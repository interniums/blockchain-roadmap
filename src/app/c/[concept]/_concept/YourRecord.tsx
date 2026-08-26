/**
 * The learner half of the concept page: what is known about you here, and the two things
 * you can do about it. A server component that composes the two client leaves which
 * actually touch the store.
 */
import { MasteryPanel } from './MasteryPanel';
import { QuestionsPanel } from './QuestionsPanel';

export function YourRecord({
  conceptId, conceptTitle, prereqIds, creditAncestorCount,
}: {
  conceptId: string;
  conceptTitle: string;
  prereqIds: string[];
  creditAncestorCount: number;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <MasteryPanel
        conceptId={conceptId}
        conceptTitle={conceptTitle}
        prereqIds={prereqIds}
        creditAncestorCount={creditAncestorCount}
      />
      <QuestionsPanel conceptId={conceptId} conceptTitle={conceptTitle} />
    </div>
  );
}
