import { parseQuestion } from './text';

/**
 * Renders a stored question: your words first, the passage that provoked it underneath.
 * Pure — no state, no store. Shared by the inbox and by anything else that lists questions.
 */
export function QuestionBody({ text, className }: { text: string; className?: string }) {
  const { body, quote } = parseQuestion(text);
  return (
    <div className={className}>
      <p className="whitespace-pre-wrap text-[14px] leading-6 text-[var(--color-ink)]">{body}</p>
      {quote && (
        <blockquote className="mt-2 border-l-2 border-[var(--color-rule)] pl-3 text-[13px] leading-6 text-[var(--color-ink-3)]">
          {quote}
        </blockquote>
      )}
    </div>
  );
}
