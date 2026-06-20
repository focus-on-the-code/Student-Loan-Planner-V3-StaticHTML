// @ts-check
export function forgivenessAtTerm({ monthIndex, termMonths, balanceCents }) { return termMonths && monthIndex >= termMonths && balanceCents > 0 ? balanceCents : 0; }
