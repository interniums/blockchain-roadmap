import type { Tier } from '@/lib/content/types';

export const TIER_LABEL: Record<Tier, string> = {
  spec: 'Spec',
  'canonical-docs': 'Canonical docs',
  'primary-analysis': 'Primary analysis',
  secondary: 'Secondary',
};

export const TIER_TONE: Record<Tier, 'accent' | 'good' | 'neutral' | 'warn'> = {
  spec: 'accent',
  'canonical-docs': 'good',
  'primary-analysis': 'neutral',
  secondary: 'warn',
};

/** Strongest first — a page is only as good as its best source. */
export const TIER_RANK: Record<Tier, number> = {
  spec: 0,
  'canonical-docs': 1,
  'primary-analysis': 2,
  secondary: 3,
};

/** The two tiers that may carry a claim on their own (plan §12). */
export const CARRYING_TIERS: Tier[] = ['spec', 'canonical-docs'];
