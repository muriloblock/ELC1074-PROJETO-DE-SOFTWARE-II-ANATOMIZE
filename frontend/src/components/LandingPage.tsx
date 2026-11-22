import type { FC } from 'react';
import {
  FileText,
  Mic,
  Award,
  CheckCircle2,
  ArrowRight,
  Play,
} from 'lucide-react';
import type { Language } from '../types';
import { LanguageToggle } from './LanguageToggle';

interface LandingPageProps {
  onOpenApp: () => void;
  lang: Language;
  onToggleLanguage: () => void;
}

export const LandingPage: FC<LandingPageProps> = ({
  onOpenApp,
  lang,
  onToggleLanguage,
}) => {
  const isEs = lang === 'ES';

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900 antialiased">
      {/* CABEÇALHO COM ÍCONE OFICIAL DO APP */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-zinc-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/80 shrink-0 flex items-center justify-center text-white shadow-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-emerald-400"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="m9 16 2 2 4-4" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight text-zinc-900">
              Anatomize
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-600">
            <a href="#funcionalidades" className="hover:text-emerald-700 transition-colors">
              {isEs ? 'Recursos' : 'Recursos'}
            </a>
            <a href="#demonstracao" className="hover:text-emerald-700 transition-colors">
              {isEs ? 'Demostración' : 'Demonstração'}
            </a>
            <a href="#sobre" className="hover:text-emerald-700 transition-colors">
              {isEs ? 'Sobre el Proyecto' : 'Sobre o Projeto'}
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle lang={lang} onToggle={onToggleLanguage} />
            <button
              onClick={onOpenApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <span>{isEs ? 'Entrar a la App' : 'Entrar no App'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION COM APRESENTAÇÃO DO PRODUTO, IMAGEM E LINK DE ACESSO */}
      <section className="bg-white border-b border-zinc-200 pt-12 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            {isEs ? (
              <>
                Transforme guías de clase en{' '}
                <span className="text-emerald-700">simulaciones orales de anatomía</span> con IA
              </>
            ) : (
              <>
                Transforme apostilas em{' '}
                <span className="text-emerald-700">simulados orais de anatomia</span> com IA
              </>
            )}
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            {isEs
              ? 'Cargue el PDF de su asignatura de Anatomía Sistémica, responda por voz desde su teléfono o computador y reciba al instante evaluación de 0 a 10, aspectos a mejorar y la respuesta ideal.'
              : 'Envie o PDF da sua aula de Anatomia Sistêmica, responda por voz pelo celular ou computador e receba na hora avaliação de 0 a 10, pontos a melhorar e a resposta ideal.'}
          </p>

          <div className="mt-8 flex items-center justify-center">
            <button
              onClick={onOpenApp}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>{isEs ? 'Acceder a la Aplicación' : 'Acessar o Aplicativo'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* IMAGEM DO APLICATIVO */}
          <div className="mt-10 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/90 bg-white">
            <img
              src="/assets/tela2.png"
              alt="Interface do Anatomize - Sessão de estudo oral com avaliação e gabarito modelo"
              className="w-full h-auto block"
            />
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="funcionalidades" className="py-16 bg-white border-b border-zinc-200 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              {isEs ? 'Recursos del Sistema' : 'Recursos do Sistema'}
            </h2>
            <p className="text-2xl font-bold text-zinc-900">
              {isEs
                ? 'Todo lo necesario para simular su evaluación oral'
                : 'Tudo o que você precisa para simular sua avaliação oral'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900">
                {isEs ? 'Carga de la Clase en PDF' : 'Upload da Aula em PDF'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isEs
                  ? 'Cargue guías o capítulos en PDF. La IA analiza el material y genera preguntas cubriendo todo el contenido.'
                  : 'Envie apostilas ou capítulos em PDF. A IA analisa o documento e gera perguntas cobrindo todo o conteúdo.'}
              </p>
            </div>

            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Mic className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900">
                {isEs ? 'Simulación Oral por Voz' : 'Simulação Oral por Voz'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isEs
                  ? 'Responda con el micrófono del celular o computador, entrenando la oratoria y los términos técnicos sin presión.'
                  : 'Responda pelo microfone do celular ou notebook, treinando a fala técnica e a argumentação sem julgamentos.'}
              </p>
            </div>

            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Award className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900">
                {isEs ? 'Evaluación y Nota 0 a 10' : 'Avaliação e Nota de 0 a 10'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isEs
                  ? 'Feedback inmediato con nota objetiva, conceptos dominados y señalamiento de omisiones anatómicas.'
                  : 'Feedback imediato com nota objetiva, pontos dominados e apontamento de omissões anatômicas.'}
              </p>
            </div>

            <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-bold text-sm text-zinc-900">
                {isEs ? 'Respuesta Modelo 10/10' : 'Gabarito Modelo 10/10'}
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {isEs
                  ? 'Acceda a la respuesta de referencia para aprender a estructurar el vocabulario y la argumentación correcta.'
                  : 'Acesse a resposta ideal de referência para aprender a estruturar o vocabulário e a linha de raciocínio correta.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VÍDEO DE DEMONSTRAÇÃO (ITEM 2 OBRIGATÓRIO) */}
      <section id="demonstracao" className="py-14 bg-zinc-50 border-b border-zinc-200 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              {isEs ? 'Demostración del Producto' : 'Demonstração do Produto'}
            </h2>
            <p className="text-2xl font-bold text-zinc-900">
              {isEs ? 'Video de Demostración' : 'Vídeo de Demonstração'}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              {isEs
                ? 'Demostración de una situación concreta de uso de Anatomize y cómo apoya el aprendizaje de anatomía.'
                : 'Demonstração de uma situação concreta de uso do Anatomize e como o produto apoia o aprendizado oral de anatomia.'}
            </p>
          </div>

          {/* CONTAINER DO VÍDEO ARQUITETADO VISUALMENTE */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video flex flex-col items-center justify-center p-6 text-center text-white relative">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-3">
                <Play className="w-8 h-8 ml-1 text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-zinc-200">
                {isEs
                  ? 'Espacio Reservado para el Video de Demostración'
                  : 'Espaço Reservado para o Vídeo de Demonstração'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO SOBRE, PARCERIA COIL E VÍDEO DO DESENVOLVIMENTO (ITEM 3 OBRIGATÓRIO) */}
      <section id="sobre" className="py-14 bg-zinc-50 border-b border-zinc-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
              {isEs ? 'Colaboración Académica' : 'Colaboração Acadêmica'}
            </h2>
            <p className="text-2xl font-bold text-zinc-900">
              {isEs ? 'Sobre el Proyecto y la Alianza COIL' : 'Sobre o Projeto e a Parceria COIL'}
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              {isEs
                ? 'Iniciativa binacional desarrollada en el marco del programa COIL.'
                : 'Iniciativa binacional desenvolvida no âmbito do programa COIL.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
            {/* CARD 1: UFSM - EQUIPE DE DESENVOLVIMENTO */}
            <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 32 24"
                  className="w-6 h-4.5 rounded-xs shadow-2xs shrink-0 border border-zinc-200/80 object-cover"
                  aria-label="Bandeira do Brasil"
                >
                  <rect width="32" height="24" fill="#009b3a" />
                  <polygon points="16,2.5 30,12 16,21.5 2,12" fill="#fedf00" />
                  <circle cx="16" cy="12" r="5" fill="#002776" />
                  <path d="M11.5,13.2 C13,10.8 19,10.8 20.5,13.2" stroke="#ffffff" strokeWidth="0.8" fill="none" />
                </svg>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">
                    Universidade Federal de Santa Maria (UFSM)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {isEs ? 'Equipo de desarrollo' : 'Equipe de desenvolvimento'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-700 space-y-2 pt-2">
                <p>
                  <strong>{isEs ? 'Desarrolladores:' : 'Desenvolvedores:'}</strong> Carlos Velozo, Leandro Oliveira, Lucas Xavier e Murilo Block.
                </p>
                <p>
                  <strong>{isEs ? 'Carrera:' : 'Curso:'}</strong> Ciência da Computação.
                </p>
              </div>
            </div>

            {/* CARD 2: UST - CLIENTES */}
            <div className="p-5 bg-white border border-zinc-200 rounded-xl space-y-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <svg
                  viewBox="0 0 32 24"
                  className="w-6 h-4.5 rounded-xs shadow-2xs shrink-0 border border-zinc-200/80 object-cover"
                  aria-label="Bandera de Chile"
                >
                  <rect width="32" height="12" fill="#ffffff" />
                  <rect y="12" width="32" height="12" fill="#d52b1e" />
                  <rect width="12" height="12" fill="#0039a6" />
                  <polygon points="6,2.5 7.1,5.8 10.5,5.8 7.8,7.8 8.8,11 6,9 3.2,11 4.2,7.8 1.5,5.8 4.9,5.8" fill="#ffffff" />
                </svg>
                <div>
                  <h3 className="font-bold text-sm text-zinc-900">
                    Universidad Santo Tomás (UST)
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    {isEs ? 'Clientes' : 'Clientes'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-zinc-700 space-y-2 pt-2">
                <p>
                  <strong>{isEs ? 'Estudiantes:' : 'Estudantes:'}</strong> Bárbara Acevedo e Kiara Cabrales.
                </p>
                <p>
                  <strong>{isEs ? 'Carrera:' : 'Curso:'}</strong> Medicina Veterinaria.
                </p>
              </div>
            </div>
          </div>

          {/* CONTAINER DO VÍDEO DO DESENVOLVIMENTO (ITEM 3) */}
          <div className="max-w-4xl mx-auto bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-zinc-950 relative">
              <video
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain block"
                src="/videos/anatomize_making_of.mp4"
              >
                {isEs
                  ? 'Tu navegador no soporta la reproducción de video.'
                  : 'Seu navegador não suporta a reprodução de vídeo.'}
              </video>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
