import { describe, expect, it } from '@jest/globals';

import { predict, predictedPeriodLength, type Period, type PredictionInput } from '../cycle';
import { addDays, diffDays, formatRange, monthMatrix } from '../dates';

/** Builds confirmed periods from a first start and the cycle lengths that follow it. */
function history(firstStart: string, cycleLengths: number[], periodLength = 5): Period[] {
  const periods: Period[] = [];
  let start = firstStart;
  for (const len of [...cycleLengths, 0]) {
    periods.push({ start, end: addDays(start, periodLength - 1), endEstimated: false });
    start = addDays(start, len);
  }
  return periods;
}

const input = (periods: Period[], extra: Partial<PredictionInput> = {}): PredictionInput => ({
  periods,
  overrides: {},
  typicalCycleLength: null,
  typicalPeriodLength: null,
  ...extra,
});

describe('predict', () => {
  it('returns an empty prediction with no periods', () => {
    const p = predict(input([]), '2026-11-03');
    expect(p.status).toBe('empty');
    expect(p.baseLength).toBe(28);
    expect(p.basis).toBe('default');
    expect(p.earlyEstimate).toBe(true);
  });

  it('predicts a regular 28-day cycle with the minimum spread', () => {
    const periods = history('2026-05-01', [28, 28, 28, 28, 28, 28]);
    const last = periods[periods.length - 1].start;
    const p = predict(input(periods), addDays(last, 10));
    expect(p.baseLength).toBe(28);
    expect(p.spread).toBe(1); // SD is 0, floored at 1
    expect(p.next?.likelyStart).toBe(addDays(last, 28));
    expect(p.next?.from).toBe(addDays(last, 27));
    expect(p.next?.to).toBe(addDays(last, 29));
    expect(p.status).toBe('upcoming');
    expect(p.daysUntil).toEqual({ from: 17, to: 19 });
    expect(p.cyclesVary).toBe(false);
  });

  it('uses the median and a wider window for variable cycles', () => {
    const periods = history('2026-01-05', [24, 35, 27, 31, 26, 33]);
    const p = predict(input(periods), '2026-11-03');
    expect(p.usedLengths).toEqual([24, 35, 27, 31, 26, 33]);
    expect(p.baseLength).toBe(29); // median 29
    expect(p.spread).toBe(4); // sample SD ≈ 4.2
    expect(p.cyclesVary).toBe(true); // 35 − 24 > 9
  });

  it('only uses the six most recent valid cycles', () => {
    const periods = history('2025-09-01', [40, 40, 28, 28, 28, 28, 28, 28]);
    const p = predict(input(periods), '2026-11-03');
    expect(p.usedLengths).toHaveLength(6);
    expect(p.baseLength).toBe(28);
  });

  it('is robust to one missed log thanks to the median', () => {
    const periods = history('2026-01-01', [28, 29, 57, 28, 28]);
    const p = predict(input(periods), '2026-11-03');
    expect(p.baseLength).toBe(28);
  });

  it('flags and skips cycles outside 15–90 days (e.g. after a pregnancy)', () => {
    const periods = history('2025-01-01', [28, 29, 140, 27, 30]);
    const p = predict(input(periods), '2026-11-03');
    const long = p.cycles.find((c) => c.length === 140);
    expect(long?.outOfRange).toBe(true);
    expect(long?.included).toBe(false);
    expect(p.usedLengths).toEqual([28, 29, 27, 30]);
  });

  it('lets the user include a flagged cycle or exclude a normal one', () => {
    const periods = history('2026-01-01', [28, 12, 30, 29]);
    const flagged = periods[1].start;
    const normal = periods[2].start;
    const p = predict(input(periods, { overrides: { [flagged]: 'include', [normal]: 'exclude' } }), '2026-11-03');
    expect(p.usedLengths).toEqual([28, 12, 29]);
  });

  it('uses the onboarding value until two cycles exist', () => {
    const periods = history('2026-10-01', [33]);
    const p = predict(input(periods, { typicalCycleLength: 30 }), '2026-11-06');
    expect(p.basis).toBe('typical');
    expect(p.baseLength).toBe(30);
    expect(p.spread).toBe(3);
    expect(p.earlyEstimate).toBe(true);
  });

  it('falls back to the single logged cycle when the user was not sure', () => {
    const periods = history('2026-10-01', [33]);
    const p = predict(input(periods), '2026-11-06');
    expect(p.basis).toBe('single-cycle');
    expect(p.baseLength).toBe(33);
  });

  it('reports the current period day', () => {
    const periods: Period[] = [{ start: '2026-11-01', end: '2026-11-05', endEstimated: true }];
    const p = predict(input(periods), '2026-11-03');
    expect(p.status).toBe('period');
    expect(p.periodDay).toBe(3);
    expect(p.cycleDay).toBe(3);
  });

  it('reports the window and late states', () => {
    const periods = history('2026-08-01', [28, 28, 28]);
    const last = periods[periods.length - 1].start;
    expect(predict(input(periods), addDays(last, 28)).status).toBe('window');
    const late = predict(input(periods), addDays(last, 31));
    expect(late.status).toBe('late');
    expect(late.daysLate).toBe(2);
    expect(late.upcoming).toHaveLength(1);
  });

  it('ignores periods logged in the future', () => {
    const periods: Period[] = [
      { start: '2026-10-01', end: '2026-10-05', endEstimated: false },
      { start: '2026-12-01', end: '2026-12-05', endEstimated: false },
    ];
    const p = predict(input(periods), '2026-11-03');
    expect(p.lastStart).toBe('2026-10-01');
  });
});

describe('predictedPeriodLength', () => {
  it('uses confirmed lengths only', () => {
    const periods: Period[] = [
      { start: '2026-08-01', end: '2026-08-04', endEstimated: false },
      { start: '2026-09-01', end: '2026-09-04', endEstimated: false },
      { start: '2026-10-01', end: '2026-10-07', endEstimated: true },
    ];
    expect(predictedPeriodLength(periods, 6)).toBe(4);
    expect(predictedPeriodLength([], 6)).toBe(6);
    expect(predictedPeriodLength([], null)).toBe(5);
  });
});

describe('dates', () => {
  it('handles leap years and month ends', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
    expect(diffDays('2029-01-01', '2028-01-01')).toBe(366);
  });

  it('is not affected by daylight-saving transitions', () => {
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
    expect(diffDays('2026-10-26', '2026-10-24')).toBe(2);
  });

  it('builds month grids starting on the chosen weekday', () => {
    const mondayFirst = monthMatrix(2026, 10, 1); // November 2026 starts on a Sunday
    expect(mondayFirst[0].slice(0, 7)).toEqual([null, null, null, null, null, null, '2026-11-01']);
    const sundayFirst = monthMatrix(2026, 10, 0);
    expect(sundayFirst[0][0]).toBe('2026-11-01');
  });

  it('formats ranges compactly', () => {
    expect(formatRange('2026-03-03', '2026-03-06')).toBe('3–6 Mar');
    expect(formatRange('2026-11-28', '2026-12-04')).toBe('28 Nov – 4 Dec');
    expect(formatRange('2026-12-28', '2027-01-03')).toBe('28 Dec 2026 – 3 Jan 2027');
  });
});
