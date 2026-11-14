/** Test fixtures shared by the lib tests. Jest only runs files in __tests__, so this folder isn't a suite. */
import type { Period, PredictionInput } from '../cycle';
import { addDays } from '../dates';

/** Confirmed periods from a first start and the cycle lengths that follow it. */
export function history(firstStart: string, cycleLengths: number[], periodLength = 5): Period[] {
  const periods: Period[] = [];
  let start = firstStart;
  for (const len of [...cycleLengths, 0]) {
    periods.push({ start, end: addDays(start, periodLength - 1), endEstimated: false });
    start = addDays(start, len);
  }
  return periods;
}

export const input = (periods: Period[], extra: Partial<PredictionInput> = {}): PredictionInput => ({
  periods,
  overrides: {},
  typicalCycleLength: null,
  typicalPeriodLength: null,
  ...extra,
});

export const period = (start: string, end: string, endEstimated = false): Period => ({ start, end, endEstimated });
