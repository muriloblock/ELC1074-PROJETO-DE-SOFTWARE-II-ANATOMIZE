import { useEffect, useMemo, useRef, useState } from 'react';
import { Menu, Sparkles, AlertTriangle, X } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { QuestionThread, RespostaMensagem } from './components/QuestionThread';
import { QuestionRail } from './components/QuestionRail';
import { ChatInputBar } from './components/ChatInputBar';
import { PdfDropzone } from './components/PdfDropzone';
import { GenerateMoreQuestions } from './components/GenerateMoreQuestions';
import { SessionSummaryCard } from './components/SessionSummaryCard';
import { HelpModal } from './components/HelpModal';
import { AuthScreen } from './components/AuthScreen';
import { LanguageToggle } from './components/LanguageToggle';
import { TRANSLATIONS, agruparPorPergunta, idDoBlocoPergunta } from './types';
import type { StudySession, Language, Pergunta, SessionSummaryStats } from './types';
import { apiService, traduzirErroApi } from './services/api';
import { LOCALES, lerIdiomaInicial, salvarIdioma } from './services/idioma';
import { useAuth } from './hooks/useAuth';

const MOCK_PREVIEW_SESSION: StudySession = {
  id: 'preview-session-1',
  title: 'Sistema Locomotor - Osteologia e Artrologia',
  topic: 'Sistema Locomotor',
  pdfName: 'aula_02_anatomia_locomotor.pdf',
  messages: [
    {
      id: 'msg-q1',
      questionId: 'p-1',
      sender: 'assistant',
      type: 'question',
      pergunta: {
        id: 'p-1',
        ordem: 1,
        enunciado:
          'Explique a divisão do esqueleto humano em axial e apendicular, citando as funções primárias de cada divisão e os ossos que as compõem.',
        respostaEsperada:
          'O esqueleto axial compreende crânio, coluna vertebral, costelas e esterno, voltado à proteção de órgãos vitais. O esqueleto apendicular é composto pelos membros e cíngulos escapular e pélvico, voltado à locomoção.',
        topicosChave: ['Esqueleto axial', 'Esqueleto apendicular', 'Proteção de órgãos', 'Locomoção e sustentação'],
        dificuldade: 'básica',
      },
      timestamp: '14:02',
    },
    {
      id: 'msg-a1',
      questionId: 'p-1',
      sender: 'user',
      type: 'text',
      content:
        'O esqueleto axial é composto pelo crânio, coluna e caixa torácica e protege os órgãos vitais. O apendicular compreende os membros superiores e inferiores para locomoção.',
      timestamp: '14:04',
    },
    {
      id: 'msg-e1',
      questionId: 'p-1',
      sender: 'assistant',
      type: 'evaluation',
      evaluation: {
        correta: true,
        nota: 8.5,
        feedback:
          'Excelente resposta! Você definiu corretamente as duas divisões e suas funções principais de proteção e locomoção.',
        pontosAcertados: [
          'Divisão correta do esqueleto axial',
          'Identificação dos membros no esqueleto apendicular',
          'Associação correta com proteção de órgãos vitais',
        ],
        pontosFaltantes: [
          'Faltou citar o cíngulo escapular (clavícula e escápula) e o cíngulo pélvico como parte do apendicular',
        ],
        respostaIdeal:
          'O esqueleto axial é formado pelo crânio, coluna vertebral, costelas e esterno, com função de sustentar o eixo do corpo e proteger o SNC e vísceras torácicas. O apendicular inclui os membros e seus cíngulos de fixação (escapular e pélvico), possibilitando a mobilidade.',
      },
      timestamp: '14:04',
    },
    {
      id: 'msg-q2',
      questionId: 'p-2',
      sender: 'assistant',
      type: 'question',
      pergunta: {
        id: 'p-2',
        ordem: 2,
        enunciado:
          'Descreva a arquitetura de um osso longo típico, diferenciando a diáfise das epífises e mencionando o papel do periósteo.',
        respostaEsperada:
          'A diáfise é o corpo cilíndrico formado por osso compacto contendo o canal medular. As epífises são as extremidades alargadas com osso esponjoso e cartilagem articular. O periósteo reveste externamente o osso, atuando na nutrição e osteogênese.',
        topicosChave: [
          'Diáfise e canal medular',
          'Epífises proximal e distal',
          'Periósteo e osteogênese',
          'Cartilagem articular',
        ],
        dificuldade: 'intermediária',
      },
      timestamp: '14:06',
    },
    {
      id: 'msg-a2',
      questionId: 'p-2',
      sender: 'user',
      type: 'text',
      content:
        'A diáfise é a haste central do osso e as epífises são as pontas que formam as articulações. O periósteo é uma membrana que envolve o osso por fora.',
      timestamp: '14:08',
    },
    {
      id: 'msg-e2',
      questionId: 'p-2',
      sender: 'assistant',
      type: 'evaluation',
      evaluation: {
        correta: true,
        nota: 8.0,
        feedback: 'Boa resposta. Você diferenciou as regiões anatômicas principais do osso longo com clareza.',
        pontosAcertados: [
          'Localização da diáfise como eixo central',
          'Identificação das epífises nas extremidades articulares',
          'Menção ao periósteo como revestimento fibroso',
        ],
        pontosFaltantes: [
          'Importância do periósteo no crescimento em espessura e vascularização óssea',
          'Menção ao canal medular com medula óssea',
        ],
        respostaIdeal:
          'A diáfise é a haste tubular formada por tecido ósseo compacto que aloja a cavidade medular. As epífises são as extremidades dilatadas compostas por osso esponjoso trabecular e revestidas por cartilagem articular. O periósteo é a membrana conjuntiva vascularizada essencial para o crescimento aposicional e fixação de tendões.',
      },
      timestamp: '14:08',
    },
    {
      id: 'msg-q3',
      questionId: 'p-3',
      sender: 'assistant',
      type: 'question',
      pergunta: {
        id: 'p-3',
        ordem: 3,
        enunciado: 'Como as articulações são classificadas estruturalmente e funcionalmente? Dê exemplos de cada uma.',
        respostaEsperada:
          'Estruturalmente: fibrosas (suturas cranianas, imóveis/sinartroses), cartilagíneas (sínfise púbica, semimóveis/anfiartroses) e sinoviais (ombro, joelho, livres/diartroses).',
        topicosChave: [
          'Articulações fibrosas (sinartroses)',
          'Articulações cartilagíneas (anfiartroses)',
          'Articulações sinoviais (diartroses)',
          'Líquido sinovial',
        ],
        dificuldade: 'avançada',
      },
      timestamp: '14:10',
    },
    {
      id: 'msg-a3',
      questionId: 'p-3',
      sender: 'user',
      type: 'text',
      content:
        'São classificadas em fibrosas, cartilaginosas e sinoviais. As sinoviais têm líquido sinovial e se mexem bastante, como o joelho. As fibrosas quase não mexem.',
      timestamp: '14:12',
    },
    {
      id: 'msg-e3',
      questionId: 'p-3',
      sender: 'assistant',
      type: 'evaluation',
      evaluation: {
        correta: true,
        nota: 7.5,
        feedback:
          'Resposta satisfatória. Você citou as três classes estruturais e deu o exemplo clássico da articulação sinovial.',
        pontosAcertados: [
          'Classificação em fibrosas, cartilagíneas e sinoviais',
          'Reconhecimento da ampla mobilidade das sinoviais e presença de líquido sinovial',
          'Exemplo do joelho',
        ],
        pontosFaltantes: [
          'Terminologia funcional (sinartrose, anfiartrose e diartrose)',
          'Exemplos anatômicos de articulações cartilagíneas (ex.: sínfises e discos intervertebrais)',
        ],
        respostaIdeal:
          'Estruturalmente dividem-se em: Fibrosas (unidas por colágeno, ex.: suturas do crânio, funcionalmente sinartroses); Cartilagíneas (unidas por cartilagem, ex.: sínfise púbica e discos intervertebrais, funcionalmente anfiartroses); e Sinoviais (com cápsula, cavidade e líquido sinovial, ex.: joelho e ombro, funcionalmente diartroses de ampla mobilidade).',
      },
      timestamp: '14:12',
    },
  ],
  updatedAt: new Date().toISOString(),
};

const isPreviewMode = typeof window !== 'undefined' && window.location.search.includes('preview=summary');

export function App() {
  const [lang, setLang] = useState<Language>(lerIdiomaInicial);
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>(isPreviewMode ? [MOCK_PREVIEW_SESSION] : []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(isPreviewMode ? MOCK_PREVIEW_SESSION.id : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [mostrarResumoManual, setMostrarResumoManual] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const newQuestionRef = useRef<HTMLElement>(null);
  const [questionToScrollId, setQuestionToScrollId] = useState<string | null>(null);

  const scrollToElementId = (elementId: string) => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 60);
    });
  };

  // Sempre que o usuário logado muda (login, logout ou troca de conta), zera
  // o estado local e recarrega as sessions do banco do usuário atual — evita
  // que o histórico de uma conta vaze para outra.
  //
  // O contador é o que fecha a corrida: uma resposta que chega depois de uma
  // troca de conta pertence ao usuário anterior e precisa ser descartada, senão
  // ela sobrescreve a lista já limpa e o histórico de A aparece na tela de B.
  const loadedMessagesSessionIds = useRef<Set<string>>(new Set());
  const carregamentoAtual = useRef(0);
  const userId = user?.id ?? null;

  useEffect(() => {
    // depende do id, não do objeto: onAuthStateChange devolve um user novo a cada
    // refresh de token, e recarregar tudo nessas horas só aumenta a janela de corrida
    const carregamento = ++carregamentoAtual.current;

    if (isPreviewMode) {
      setSessions([MOCK_PREVIEW_SESSION]);
      setActiveSessionId(MOCK_PREVIEW_SESSION.id);
      loadedMessagesSessionIds.current.add(MOCK_PREVIEW_SESSION.id);
      return;
    }

    setSessions([]);
    setActiveSessionId(null);
    loadedMessagesSessionIds.current = new Set();

    if (!userId) return;

    apiService
      .listarSessions()
      .then((carregadas) => {
        if (carregamentoAtual.current !== carregamento) return;
        setSessions(carregadas);
      })
      .catch((err) => console.error('Falha ao carregar sessions:', err));
  }, [userId]);

  const t = TRANSLATIONS[lang];
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const { grupos, orfas } = useMemo(
    () => agruparPorPergunta(activeSession?.messages ?? []),
    [activeSession?.messages],
  );

  useEffect(() => {
    if (!questionToScrollId || !newQuestionRef.current) return;

    newQuestionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setQuestionToScrollId(null);
  }, [questionToScrollId, activeSession?.messages.length]);

  // uma sessão só existe a partir de um PDF; sem ele a única ação possível é anexar
  const hasPdf = Boolean(activeSession?.pdfName);

  // Métricas agregadas da sessão para o resumo ao fim das perguntas
  const summaryStats: SessionSummaryStats | null = (() => {
    if (!activeSession) return null;
    const questions = activeSession.messages.filter((m) => m.type === 'question' && m.pergunta);
    const evaluations = activeSession.messages
      .filter((m) => m.type === 'evaluation' && m.evaluation)
      .map((m) => m.evaluation!);

    if (questions.length === 0 || evaluations.length === 0) return null;

    const totalPerguntas = questions.length;
    const totalRespondidas = evaluations.length;
    const acertos = evaluations.filter((e) => e.correta || e.nota >= 7.0).length;
    const erros = totalRespondidas - acertos;
    const somaNotas = evaluations.reduce((acc, e) => acc + (Number(e.nota) || 0), 0);
    const notaMedia = totalRespondidas > 0 ? somaNotas / totalRespondidas : 0;

    const pontosFaltantesSet = new Set<string>();
    const pontosFaltantes: string[] = [];
    for (const e of evaluations) {
      for (const ponto of e.pontosFaltantes || []) {
        const limpo = ponto.trim();
        const chave = limpo.toLowerCase();
        if (limpo && !pontosFaltantesSet.has(chave)) {
          pontosFaltantesSet.add(chave);
          pontosFaltantes.push(limpo);
        }
      }
    }

    const pontosAcertadosSet = new Set<string>();
    const pontosAcertados: string[] = [];
    for (const e of evaluations) {
      for (const ponto of e.pontosAcertados || []) {
        const limpo = ponto.trim();
        const chave = limpo.toLowerCase();
        if (limpo && !pontosAcertadosSet.has(chave)) {
          pontosAcertadosSet.add(chave);
          pontosAcertados.push(limpo);
        }
      }
    }

    const isCompleto = totalRespondidas >= totalPerguntas;

    return {
      totalPerguntas,
      totalRespondidas,
      acertos,
      erros,
      notaMedia,
      pontosFaltantes,
      pontosAcertados,
      isCompleto,
    };
  })();

  useEffect(() => {
    if (summaryStats?.isCompleto) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } else {
          summaryRef.current?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 100);
    }
  }, [summaryStats?.isCompleto]);

  // <html lang> e título acompanham o idioma: senão o navegador do celular, vendo
  // lang="en" numa página em espanhol, oferece traduzi-la por conta própria
  useEffect(() => {
    document.documentElement.lang = LOCALES[lang];
    document.title = TRANSLATIONS[lang].documentTitle;
  }, [lang]);

  // só a escolha manual é gravada; o idioma detectado do navegador não vira preferência
  const toggleLanguage = () => {
    const proximo: Language = lang === 'PT' ? 'ES' : 'PT';
    setLang(proximo);
    salvarIdioma(proximo);
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setMostrarResumoManual(false);

    if (loadedMessagesSessionIds.current.has(id)) return;
    loadedMessagesSessionIds.current.add(id);

    const carregamento = carregamentoAtual.current;
    apiService
      .carregarMensagens(id)
      .then((messages) => {
        // mesma guarda do carregamento da lista: descarta resposta de outra conta
        if (carregamentoAtual.current !== carregamento) return;
        setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, messages } : s)));
      })
      .catch((err) => console.error('Falha ao carregar mensagens:', err));
  };

  // não cria linha nenhuma: a sessão nasce no banco quando o PDF é enviado
  // (Edge Function upload-pdf). Antes disso a tela só mostra o dropzone.
  const handleNewStudy = () => {
    setActiveSessionId(null);
    setErrorBanner(null);
    setMostrarResumoManual(false);
  };

  const handleRenameSession = async (id: string, title: string) => {
    try {
      // o servidor resolve colisões acrescentando "(1)", "(2)", então o nome
      // gravado pode diferir do digitado
      const tituloGravado = await apiService.renomearSession(id, title);
      setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, title: tituloGravado } : s)));
    } catch (err: unknown) {
      const msg = traduzirErroApi(err, lang);
      console.error('Falha ao renomear sessão:', err);
      setErrorBanner(msg);
    }
  };

  const handleSendMessage = async (text: string) => {
    // sem texto não há o que avaliar (o microfone ainda não transcreve e chegava
    // aqui com string vazia, gravando mensagem em branco e gastando chamada de IA)
    if (!text.trim()) return;
    if (!activeSessionId || !activeSession?.currentQuestion || !user) return;
    const sessionId = activeSessionId;
    const questionId = String(activeSession.currentQuestion.id);

    setIsProcessing(true);
    setProcessingStatus(t.processingAudio);
    setErrorBanner(null);

    try {
      const userMessage = await apiService.inserirMensagemTexto(sessionId, user.id, questionId, text);
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, userMessage] } : s)),
      );
      scrollToElementId(`msg-${userMessage.id}`);

      const { evaluationId, ...evaluation } = await apiService.avaliarResposta(questionId, text, lang);
      const evaluationMessage = await apiService.inserirMensagemAvaliacao(
        sessionId,
        user.id,
        questionId,
        evaluationId,
        evaluation,
      );

      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, evaluationMessage] } : s)),
      );
      scrollToElementId(`msg-${evaluationMessage.id}`);
    } catch (err: unknown) {
      const msg = traduzirErroApi(err, lang);
      console.error('Erro na avaliação:', err);
      setErrorBanner(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleSelectQuestion = (pergunta: Pergunta) => {
    if (!activeSessionId) return;
    setSessions((prev) => prev.map((s) => (s.id === activeSessionId ? { ...s, currentQuestion: pergunta } : s)));
    apiService
      .definirPerguntaAtual(activeSessionId, String(pergunta.id))
      .catch((err) => console.error('Falha ao salvar pergunta atual:', err));
    scrollToElementId(idDoBlocoPergunta(pergunta.id));
  };

  const handleTranscribeAudio = async (audioBlob: Blob) => {
    setErrorBanner(null);
    return apiService.transcreverAudio(audioBlob, lang);
  };

  const handleTranscriptionError = (error: unknown) => {
    setErrorBanner(traduzirErroApi(error, lang));
  };

  const handleUploadPdf = async (file: File, quantidade: number) => {
    setIsProcessing(true);
    setProcessingStatus(t.generatingQuestions);
    setErrorBanner(null);

    try {
      // title já vem único e sanitizado do servidor — não recalcular aqui
      const { sessionId, title, perguntas, pdfName } = await apiService.uploadPdf(file, quantidade, lang);

      const [questionMessages] = await Promise.all([
        apiService.inserirMensagensDePerguntas(sessionId, user!.id, perguntas),
        apiService.definirPerguntaAtual(sessionId, String(perguntas[0].id)),
      ]);

      const newSession: StudySession = {
        id: sessionId,
        title,
        topic: title,
        pdfName,
        currentQuestion: perguntas[0],
        messages: questionMessages,
        updatedAt: new Date().toISOString(),
      };
      loadedMessagesSessionIds.current.add(sessionId);
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(sessionId);
    } catch (err: unknown) {
      const msg = traduzirErroApi(err, lang);
      console.error('Falha ao processar PDF:', err);
      setErrorBanner(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  // gera mais perguntas na sessão atual, continuando a numeração e sem repetir
  // as que já foram feitas (o servidor manda os enunciados anteriores no prompt)
  const handleGerarMaisPerguntas = async (quantidade: number) => {
    if (!activeSessionId || !user) return;
    const sessionId = activeSessionId;

    setIsProcessing(true);
    setProcessingStatus(t.generatingMore);
    setErrorBanner(null);

    try {
      const perguntas = await apiService.gerarMaisPerguntas(sessionId, quantidade, lang);
      const questionMessages = await apiService.inserirMensagensDePerguntas(sessionId, user.id, perguntas);

      setQuestionToScrollId(String(perguntas[0].id));
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, ...questionMessages] } : s)),
      );
    } catch (err: unknown) {
      const msg = traduzirErroApi(err, lang);
      console.error('Falha ao gerar novas perguntas:', err);
      setErrorBanner(msg);
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white">
        <Sparkles className="w-6 h-6 text-emerald-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthScreen lang={lang} onToggleLanguage={toggleLanguage} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-zinc-900 font-sans">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewStudy={handleNewStudy}
        onRenameSession={handleRenameSession}
        lang={lang}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onOpenHelp={() => setIsHelpOpen(true)}
        user={user}
        onSignOut={signOut}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} lang={lang} />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white relative">
        <header className="h-14 px-4 md:px-8 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpenMobile(true)}
              className="md:hidden p-2 -ml-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"
              aria-label={t.openMenu}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {activeSession && (
            <div className="text-[11px] font-bold tracking-wider text-zinc-600 uppercase select-none text-center truncate px-2">
              {t.activeSession}: {activeSession.title}
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <LanguageToggle lang={lang} onToggle={toggleLanguage} />
          </div>
        </header>

        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pl-4 pr-10 md:pl-8 md:pr-14 py-6 space-y-6">
          {activeSession && activeSession.pdfName ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {grupos.map((grupo) => (
                <QuestionThread
                  key={grupo.pergunta.id}
                  grupo={grupo}
                  lang={lang}
                  isActive={activeSession.currentQuestion?.id === grupo.pergunta.id}
                  onSelect={() => handleSelectQuestion(grupo.pergunta)}
                  scrollRef={String(grupo.pergunta.id) === questionToScrollId ? newQuestionRef : undefined}
                />
              ))}

              {/* respostas sem pergunta correspondente (ex.: avaliação que falhou) não somem */}
              {orfas.map((msg) => {
                const matchingOrdem = activeSession?.messages.find(
                  (m) => m.type === 'question' && String(m.pergunta?.id) === msg.questionId,
                )?.pergunta?.ordem;
                return (
                  <RespostaMensagem
                    key={msg.id}
                    msg={msg}
                    lang={lang}
                    questionOrder={matchingOrdem}
                  />
                );
              })}

              {isProcessing && (
                <div className="flex items-center gap-3 text-zinc-600 text-sm italic pl-2 bg-emerald-50/60 border border-emerald-100/80 rounded-xl p-3 max-w-md">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>{processingStatus || t.processingAudio}</span>
                </div>
              )}

              {/* Resumo da sessão: exibido automaticamente ao terminar as perguntas da rodada */}
              {summaryStats && (summaryStats.isCompleto || mostrarResumoManual) && (
                <div ref={summaryRef} className="flex justify-start pt-2">
                  <SessionSummaryCard stats={summaryStats} lang={lang} />
                </div>
              )}

              {/* Botão para ver/ocultar resumo parcial antes de terminar todas as perguntas */}
              {summaryStats && !summaryStats.isCompleto && (
                <div className="flex justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMostrarResumoManual((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-xs font-medium text-zinc-600 transition-colors cursor-pointer"
                  >
                    <span>
                      {mostrarResumoManual
                        ? t.hideSummary
                        : `${t.viewSummary} (${summaryStats.totalRespondidas}/${summaryStats.totalPerguntas})`}
                    </span>
                  </button>
                </div>
              )}

              <GenerateMoreQuestions onGenerate={handleGerarMaisPerguntas} lang={lang} disabled={isProcessing} />
            </div>
          ) : (
            <PdfDropzone
              onUploadPdf={handleUploadPdf}
              lang={lang}
              isProcessing={isProcessing}
              processingStatus={processingStatus}
            />
          )}
        </div>

        {activeSession?.pdfName && (
          <QuestionRail
            grupos={grupos}
            currentQuestionId={activeSession.currentQuestion?.id}
            containerRef={chatContainerRef}
            lang={lang}
          />
        )}

        <div className="p-4 pt-2 shrink-0 bg-gradient-to-t from-white via-white to-transparent">
          {errorBanner && (
            <div className="max-w-3xl mx-auto mb-2 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              <p className="flex-1 leading-relaxed">{errorBanner}</p>
              <button
                type="button"
                onClick={() => setErrorBanner(null)}
                className="text-amber-500 hover:text-amber-700 shrink-0"
                aria-label={t.closeWarning}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          {hasPdf && activeSession?.currentQuestion && (
            <div className="max-w-3xl mx-auto mb-2 text-[11px] font-medium text-emerald-700 px-1">
              {t.answeringThis}: {t.questionBadge} #{activeSession.currentQuestion.ordem}
            </div>
          )}
          {/* sem PDF não há pergunta para responder: a tela mostra só o dropzone */}
          {hasPdf && (
            <ChatInputBar
              onSendMessage={handleSendMessage}
              onTranscribeAudio={handleTranscribeAudio}
              onTranscriptionError={handleTranscriptionError}
              pdfName={activeSession?.pdfName}
              hasSelectedQuestion={Boolean(activeSession?.currentQuestion)}
              lang={lang}
              disabled={isProcessing}
            />
          )}
        </div>
      </main>
    </div>
  );
}
export default App;
