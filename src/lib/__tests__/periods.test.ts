import { describe, expect, it } from '@jest/globals';

import type { Period } from '../cycle';
import { endPeriodOn, markPeriodDay, unmarkPeriodDay } from '../periods';

const p = (start: string, end: string, endEstimated = false): Period => ({ start, end, endEstimated });

describe('markPeriodDay', () => {
  it('starts a new period with an estimated end', () => {
    expect(markPeriodDay([], '2026-11-03', 5)).toEqual([p('2026-11-03', '2026-11-07', true)]);
  });

  it('does nothing when the day is already a period day', () => {
    const periods = [p('2026-11-01', '2026-11-05')];
    expect(markPeriodDay(periods, '2026-11-03', 5)).toEqual(periods);
  });

  it('extends a period forwards and confirms the new end', () => {
    expect(markPeriodDay([p('2026-11-01', '2026-11-05', true)], '2026-11-06', 5)).toEqual([
      p('2026-11-01', '2026-11-06'),
    ]);
  });

  it('extends a period backwards', () => {
    expect(markPeriodDay([p('2026-11-02', '2026-11-05')], '2026-11-01', 5)).toEqual([
      p('2026-11-01', '2026-11-05'),
    ]);
  });

  it('joins two periods separated by one day', () => {
    const periods = [p('2026-11-01', '2026-11-03'), p('2026-11-05', '2026-11-07', true)];
    expect(markPeriodDay(periods, '2026-11-04', 5)).toEqual([p('2026-11-01', '2026-11-07', true)]);
  });

  it('moves the start of the next period back instead of overlapping it', () => {
    const periods = [p('2026-11-05', '2026-11-09')];
    expect(markPeriodDay(periods, '2026-11-02', 5)).toEqual([p('2026-11-02', '2026-11-09')]);
  });

  it('keeps periods sorted', () => {
    const periods = [p('2026-11-01', '2026-11-05')];
    const result = markPeriodDay(periods, '2026-10-01', 5);
    expect(result.map((x) => x.start)).toEqual(['2026-10-01', '2026-11-01']);
  });
});

describe('unmarkPeriodDay', () => {
  it('removes a single-day period', () => {
    expect(unmarkPeriodDay([p('2026-11-01', '2026-11-01')], '2026-11-01')).toEqual([]);
  });

  it('trims the first or last day', () => {
    const periods = [p('2026-11-01', '2026-11-05', true)];
    expect(unmarkPeriodDay(periods, '2026-11-01')).toEqual([p('2026-11-02', '2026-11-05', true)]);
    expect(unmarkPeriodDay(periods, '2026-11-05')).toEqual([p('2026-11-01', '2026-11-04')]);
  });

  it('leaves middle days alone', () => {
    const periods = [p('2026-11-01', '2026-11-05')];
    expect(unmarkPeriodDay(periods, '2026-11-03')).toEqual(periods);
  });
});

describe('endPeriodOn', () => {
  it('confirms the end of the period containing the day', () => {
    expect(endPeriodOn([p('2026-11-01', '2026-11-05', true)], '2026-11-03')).toEqual([
      p('2026-11-01', '2026-11-03'),
    ]);
  });

  it('ignores days outside any period', () => {
    const periods = [p('2026-11-01', '2026-11-05')];
    expect(endPeriodOn(periods, '2026-11-09')).toEqual(periods);
  });
});
