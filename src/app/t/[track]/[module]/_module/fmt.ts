/**
 * Formatting for the module screen. Pure — usable from both server sections and client leaves.
 *
 * There are deliberately no date, duration or "due" formatters here. The product shows the
 * learner no clock, so nothing needs to turn a timestamp into words.
 */

export function masteryPct(mastery: number): number {
  return Math.round(mastery * 100);
}
