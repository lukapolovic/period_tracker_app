/**
 * Day status: what a date is in the cycle. Worked out once, from the record's periods and the prediction, so Today,
 * the calendar, the day log and the explanation all give the same answer. Screens only map a status to a shape and
 * some words.
 *
 * - A period day up to today is logged. A period day after today hasn't happened yet: its period's end is an
 *   estimate, so the day is one too, and it's drawn and described like a prediction.
 * - A period day outranks a predicted period, which outranks the ovulation estimate.
 * - Cycle days are only counted up to today. Further ahead, the next period could start first.
 */
import { sortPeriods, type OvulationWindow, type Period, type PredictedWindow, type Prediction } from './cycle';
import { diffDays, type ISODate } from './dates';
import { edgeOf, type PeriodEdge } from './periods';

export type DayStatus =
  | {
      /** A logged period day: today or earlier. */
      kind: 'period';
      period: Period;
      /** 1 on the period's first day. */
      day: number;
      edge: PeriodEdge;
      /** The period's last day so far, taken from the usual length rather than from the person. */
      isEstimatedEnd: boolean;
      /** "Period ended on this day" would change something. */
      canEndHere: boolean;
    }
  /** A day still to come in the current period. */
  | { kind: 'expected-period'; period: Period; day: number }
  /** Inside a predicted window for a period to start. */
  | { kind: 'predicted-period'; window: PredictedWindow }
  /** Inside an estimated ovulation window. */
  | { kind: 'ovulation'; window: OvulationWindow }
  /** Any other day from the first logged period up to today. */
  | { kind: 'cycle-day'; day: number }
  /** Before the first logged period, or a later day nothing is predicted for. */
  | { kind: 'none' };

const within = (date: ISODate, w: { from: ISODate; to: ISODate }) => w.from <= date && date <= w.to;

/** Reads the status of any date. Build it once per render and call it for each day shown. */
export function dayStatusReader(
  periods: Period[],
  prediction: Prediction,
  today: ISODate,
): (date: ISODate) => DayStatus {
  const sorted = sortPeriods(periods);
  return (date) => {
    const period = sorted.find((p) => within(date, { from: p.start, to: p.end }));
    if (period) {
      const day = diffDays(date, period.start) + 1;
      if (date > today) return { kind: 'expected-period', period, day };
      return {
        kind: 'period',
        period,
        day,
        edge: edgeOf(period, date),
        isEstimatedEnd: period.endEstimated && date === period.end,
        canEndHere: period.endEstimated || date !== period.end,
      };
    }
    const window = prediction.upcoming.find((w) => within(date, w));
    if (window) return { kind: 'predicted-period', window };
    const ovulation = prediction.ovulation.find((w) => within(date, w));
    if (ovulation) return { kind: 'ovulation', window: ovulation };
    const cycleStart = date <= today ? sorted.filter((p) => p.start <= date).at(-1)?.start : undefined;
    return cycleStart ? { kind: 'cycle-day', day: diffDays(date, cycleStart) + 1 } : { kind: 'none' };
  };
}

/** Day numbers counted from the current cycle's first day. */
export type DaySpan = { fromDay: number; toDay: number };

/** The current cycle laid out by day number: what the ring on Today draws. */
export type CycleMap = {
  /** Days around the ring: room for the cycle so far, its period and the whole next window. */
  totalDays: number;
  cycleDay: number | null;
  /** Period days from day 1, including estimated days still to come. */
  periodDays: number;
  nextWindow: DaySpan | null;
  /**
   * This cycle's own ovulation window. It stays on the ring after it has passed, while `nextOvulation` — what the
   * card on Today names — moves on to the next cycle's.
   */
  ovulation: OvulationWindow | null;
  ovulationDays: DaySpan | null;
};

export function cycleMap(p: Prediction): CycleMap {
  const start = p.lastStart;
  const span = (w: { from: ISODate; to: ISODate } | null): DaySpan | null =>
    w && start ? { fromDay: diffDays(w.from, start) + 1, toDay: diffDays(w.to, start) + 1 } : null;
  const periodDays = p.cycles.at(-1)?.periodLength ?? 0;
  const nextWindow = span(p.next);
  const nextStart = p.next?.likelyStart;
  const ovulation = (nextStart && p.ovulation.find((w) => w.to < nextStart)) || null;
  return {
    totalDays: Math.max(p.baseLength + p.spread, p.cycleDay ?? 0, periodDays, nextWindow?.toDay ?? 0),
    cycleDay: p.cycleDay,
    periodDays,
    nextWindow,
    ovulation,
    ovulationDays: span(ovulation),
  };
}
