import { describe, expect, it } from 'vitest';
import { getCashSuggestions } from './cashSuggestions';

describe('getCashSuggestions', () => {
  it('starts with the exact total and rounds up to common notes', () => {
    expect(getCashSuggestions(190)).toEqual([190, 200, 500, 2000]);
  });

  it('drops duplicates when the total is already a round number', () => {
    expect(getCashSuggestions(500)).toEqual([500, 2000]);
  });

  it('handles odd amounts', () => {
    expect(getCashSuggestions(35)).toEqual([35, 40, 50, 100]);
  });
});
