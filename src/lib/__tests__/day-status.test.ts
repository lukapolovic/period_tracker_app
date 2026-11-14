import { describe, expect, it } from '@jest/globals';

import { history, input, period } from '../__fixtures__/cycles';
import { nextOvulation, predict, type Period } from '../cycle';
import { addDays } from '../dates';
import { cycleMap, dayStatusReader } from '../day-status';

const reader = (periods: Period[], today: string) =>
  dayStatusReader(periods, predict(input(periods, { showOvulation: true }), today), today);

describe('day status', () => {
  const current = [period('2026-11-01', '2026-11-05', true)];

  it('numbers a logged period day and knows where it sits in its period', () => {
    const statusOf = reader(current, '2026-11-03');
    expect(statusOf('2026-11-01')).toMatchObject({ kind: 'period', day: 1, edge: 'start', canEndHere: true });
    expect(statusOf('2026-11-03')).toMatchObject({ kind: 'period', day: 3, edge: 'middle', isEstimatedEnd: false });
  });

  it('treats a day still to come in the current period as an estimate, everywhere', () => {
    // The calendar draws it dashed and the day log calls it estimated: both read this one status.
    expect(reader(current, '2026-11-03')('2026-11-04')).toMatchObject({ kind: 'expected-period', day: 4 });
  });

  it('marks the estimated last day once it is here', () => {
    expect(reader(current, '2026-11-05')('2026-11-05')).toMatchObject({ kind: 'period', isEstimatedEnd: true, canEndHere: true });
  });

  it('knows when "Period ended on this day" would change nothing', () => {
    const statusOf = reader([period('2026-11-01', '2026-11-04')], '2026-11-04');
    expect(statusOf('2026-11-04')).toMatchObject({ kind: 'period', canEndHere: false });
    expect(statusOf('2026-11-03')).toMatchObject({ kind: 'period', canEndHere: true });
  });

  describe('in a regular cycle', () => {
    const regular = history('2026-05-01', [28, 28, 28, 28, 28, 28]);
    const last = regular[regular.length - 1].start;
    const today = addDays(last, 8);
    const prediction = predict(input(regular, { showOvulation: true }), today);
    const statusOf = dayStatusReader(regular, prediction, today);

    it('finds the predicted window and the ovulation estimate', () => {
      expect(statusOf(addDays(last, 28))).toEqual({ kind: 'predicted-period', window: prediction.next });
      expect(statusOf(addDays(last, 14))).toEqual({ kind: 'ovulation', window: prediction.ovulation[0] });
    });

    it('counts cycle days up to today, and none further ahead', () => {
      expect(statusOf(addDays(last, 7))).toEqual({ kind: 'cycle-day', day: 8 });
      expect(statusOf(addDays(last, 20))).toEqual({ kind: 'none' });
    });

    it('says nothing before the first period', () => {
      expect(statusOf('2026-01-01')).toEqual({ kind: 'none' });
    });
  });
});

describe('cycleMap', () => {
  const regular = history('2026-05-01', [28, 28, 28, 28, 28, 28]);
  const last = regular[regular.length - 1].start;
  const on = (today: string) => predict(input(regular, { showOvulation: true }), today);

  it('lays out the current cycle by day number for the ring', () => {
    const map = cycleMap(on(addDays(last, 3)));
    expect(map).toMatchObject({
      cycleDay: 4,
      periodDays: 5,
      nextWindow: { fromDay: 28, toDay: 30 },
      ovulationDays: { fromDay: 10, toDay: 16 },
      totalDays: 30,
    });
  });

  it("keeps this cycle's ovulation window on the ring after it has passed, while the card moves on", () => {
    const p = on(addDays(last, 20));
    const [thisCycle, nextCycle] = p.ovulation;
    expect(cycleMap(p).ovulation).toBe(thisCycle);
    expect(nextOvulation(p, addDays(last, 20))).toBe(nextCycle);
  });

  it('draws nothing but the empty ring before the first period', () => {
    const map = cycleMap(predict(input([]), '2026-11-03'));
    expect(map).toEqual({
      totalDays: 31,
      cycleDay: null,
      periodDays: 0,
      nextWindow: null,
      ovulation: null,
      ovulationDays: null,
    });
  });
});
