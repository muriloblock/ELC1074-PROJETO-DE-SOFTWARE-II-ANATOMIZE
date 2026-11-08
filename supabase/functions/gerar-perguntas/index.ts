import { corsHeaders, handlePreflight } from '../_shared/cors.ts';
import { createUserClient } from '../_shared/supabaseClient.ts';
import { gerarPerguntas } from '../_shared/ai-provider.ts';
import { idiomaDaRequisicao } from '../_shared/prompts.ts';
import { consumirCotaIA } from '../_shared/rate-limit.ts';
import { ErroIA, traduzirErroIA, jsonError } from '../_shared/errors.ts';

// mesmo orçamento de caracteres de upload-pdf
const MAX_CONTEXT_CHARS_BY_PROVIDER: Record<string, number> = {
  groq: 16_000,
  gemini: 80_000,
};

// gera mais perguntas para uma sessão que já tem PDF, reaproveitando o texto
// extraído no upload — o PDF não é reenviado nem reprocessado
Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  try {
    const supabase = createUserClient(req);
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return jsonError('NAO_AUTENTICADO', 401);
    }
    const userId = userData.user.id;

    if (!(await consumirCotaIA(supabase, 'gerar_perguntas'))) {
      return jsonError('COTA_EXCEDIDA', 429);
    }

    const body = await req.json();
    const { sessionId, quantidade: quantidadeRecebida, lang } = body as {
      sessionId?: string;
      quantidade?: number;
      lang?: string;
    };
    const quantidade = Number(quantidadeRecebida ?? 3);
    const idioma = idiomaDaRequisicao(lang, 'gerar-perguntas');

    if (!sessionId) {
      return jsonError('CAMPOS_OBRIGATORIOS', 400);
    }
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 20) {
      return jsonError('QUANTIDADE_INVALIDA', 400);
    }

    // a RLS "sessions: dono" garante que só a própria sessão é encontrada
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('id, pdf_text')
      .eq('id', sessionId)
      .single();
    if (sessionError || !session) {
      return jsonError('SESSAO_NAO_ENCONTRADA', 404);
    }

    const textoExtraido = (session.pdf_text ?? '').trim();
    if (!textoExtraido) {
      return jsonError('SESSAO_SEM_PDF', 422);
    }

    // enunciados já feitos entram no prompt para o modelo não repetir, e a maior
    // ordem continua a numeração exibida na UI
    const { data: existentes, error: existentesError } = await supabase
      .from('questions')
      .select('ordem, enunciado')
      .eq('session_id', sessionId)
      .order('ordem', { ascending: true });
    if (existentesError) throw existentesError;

    const ordemInicialBase = existentes.reduce((maior, q) => Math.max(maior, q.ordem), 0) + 1;
    const enunciadosExistentes = existentes.map((q) => q.enunciado);

    const provider = (Deno.env.get('AI_PROVIDER') || 'groq').toLowerCase();
    const limite = MAX_CONTEXT_CHARS_BY_PROVIDER[provider] ?? MAX_CONTEXT_CHARS_BY_PROVIDER.groq;

    // cobre o documento inteiro em blocos, evitando repetição com as perguntas já feitas
    const blocos: string[] = [];
    for (let i = 0; i < textoExtraido.length; i += limite) {
      blocos.push(textoExtraido.slice(i, i + limite));
    }

    const perguntasPorBloco = Math.max(1, Math.ceil(quantidade / blocos.length));
    const perguntas: (Awaited<ReturnType<typeof gerarPerguntas>>[number])[] = [];
    let ordemAtual = ordemInicialBase;

    for (const bloco of blocos) {
      if (perguntas.length >= quantidade) break;
      const restantes = quantidade - perguntas.length;
      const pedir = Math.min(perguntasPorBloco, restantes);
      const novas = await gerarPerguntas(bloco, pedir, {
        idioma,
        perguntasExistentes: [...enunciadosExistentes, ...perguntas.map((p) => p.enunciado)],
        ordemInicial: ordemAtual,
      });
      perguntas.push(...novas);
      ordemAtual += novas.length;
    }

    const { data: questionRows, error: insertError } = await supabase
      .from('questions')
      .insert(
        perguntas.map((p) => ({
          session_id: sessionId,
          user_id: userId,
          ordem: p.ordem,
          enunciado: p.enunciado,
          resposta_esperada: p.respostaEsperada,
          topicos_chave: p.topicosChave,
          dificuldade: p.dificuldade,
        })),
      )
      .select();
    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        perguntas: [...questionRows].sort((a, b) => a.ordem - b.ordem).map((q) => ({
          id: q.id,
          ordem: q.ordem,
          enunciado: q.enunciado,
          respostaEsperada: q.resposta_esperada,
          topicosChave: q.topicos_chave,
          dificuldade: q.dificuldade,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (erro) {
    console.error('gerar-perguntas falhou:', erro);
    if (erro instanceof ErroIA) {
      const amigavel = traduzirErroIA(erro);
      return jsonError(amigavel.codigo, amigavel.status);
    }
    return jsonError('FALHA_INESPERADA', 500);
  }
});
