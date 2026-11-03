import type { FC, Ref } from 'react';
import { QuestionCard } from './QuestionCard';
import { EvaluationCard } from './EvaluationCard';
import { idDoBlocoPergunta, TRANSLATIONS } from '../types';
import type { ChatMessage, GrupoPergunta, Language } from '../types';

export const RespostaMensagem: FC<{
  msg: ChatMessage;
  lang: Language;
  questionOrder?: number;
}> = ({ msg, lang, questionOrder }) => {
  const t = TRANSLATIONS[lang];

  if (msg.sender === 'user') {
    return (
      <div id={`msg-${msg.id}`} className="flex flex-col items-end gap-1.5 scroll-mt-6">
        {questionOrder != null && (
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-full select-none uppercase tracking-wide">
            {t.questionBadge} #{questionOrder}
          </span>
        )}
        <div className="max-w-xl bg-zinc-100/90 text-zinc-900 rounded-2xl rounded-tr-xs px-5 py-3 text-[15px] leading-relaxed shadow-2xs">
          {msg.content}
        </div>
      </div>
    );
  }

  if (msg.type === 'evaluation' && msg.evaluation) {
    return (
      <div id={`msg-${msg.id}`} className="flex justify-start pt-1 scroll-mt-6">
        <EvaluationCard evaluation={msg.evaluation} lang={lang} questionOrder={questionOrder} />
      </div>
    );
  }

  return null;
};

interface QuestionThreadProps {
  grupo: GrupoPergunta;
  lang: Language;
  isActive: boolean;
  onSelect: () => void;
  scrollRef?: Ref<HTMLElement>;
}

/** pergunta + as respostas e avaliações dela, num bloco visualmente separado dos demais */
export const QuestionThread: FC<QuestionThreadProps> = ({ grupo, lang, isActive, onSelect, scrollRef }) => (
  <section
    id={idDoBlocoPergunta(grupo.pergunta.id)}
    ref={scrollRef}
    className="scroll-mt-4 rounded-3xl border border-zinc-200/70 bg-zinc-50/50 p-3 md:p-4 space-y-4"
  >
    <QuestionCard pergunta={grupo.pergunta} lang={lang} isActive={isActive} onSelect={onSelect} />

    {grupo.respostas.length > 0 && (
      <div className="space-y-4 border-t border-dashed border-zinc-200 pt-4">
        {grupo.respostas.map((msg) => (
          <RespostaMensagem
            key={msg.id}
            msg={msg}
            lang={lang}
            questionOrder={grupo.pergunta.ordem}
          />
        ))}
      </div>
    )}
  </section>
);
