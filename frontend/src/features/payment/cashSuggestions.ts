const NOTE_STEPS = [10, 50, 100, 500, 2000];

/**
 * Quick-tap amounts for cash payments: the exact total, then the total rounded up to
 * common note values (e.g. ₹190 → 190, 200, 500, 2000). Duplicates are removed.
 */
export function getCashSuggestions(total: number, limit = 4): number[] {
  const amounts = [total, ...NOTE_STEPS.map((step) => Math.ceil(total / step) * step)];
  return [...new Set(amounts)].filter((amount) => amount >= total).sort((a, b) => a - b).slice(0, limit);
}
