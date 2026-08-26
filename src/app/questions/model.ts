/** Plain shapes crossing the server-action boundary. No behaviour, no imports. */

export interface ConceptLabel {
  id: string;
  title: string;
  oneLine: string;
  /** null when the id is not in the curriculum (renamed or removed since it was asked). */
  href: string | null;
  moduleTitle: string;
  trackTitle: string;
  trackId: string;
  known: boolean;
}

export interface OriginLabel {
  /** The raw `raisedFrom` value, used as the join key. */
  key: string;
  href: string | null;
  label: string;
  kind: 'lesson' | 'module' | 'track' | 'practice' | 'concept' | 'path' | 'unknown';
}

export interface LabelBundle {
  concepts: ConceptLabel[];
  origins: OriginLabel[];
}
