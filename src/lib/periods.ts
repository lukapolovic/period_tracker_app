/**
 * Pure edits to the list of periods. Every function returns a new, sorted array and never
 * leaves two periods overlapping or touching (touching periods are merged).
 */
import { sortPeriods, type Flow, type Period } from './cycle';
import { addDays, type ISODate } from './dates';

export type PeriodEdge = 'single' | 'start' | 'end' | 'middle';

export function findPeriod(periods: Period[], date: ISODate): Period | null {
  return periods.find((p) => p.start <= date && date <= p.end) ?? null;
}

export function edgeOf(period: Period, date: ISODate): PeriodEdge {
  if (period.start === period.end) return 'single';
  if (date === period.start) return 'start';
  if (date === period.end) return 'end';
  return 'middle';
}

/**
 * Marks `date` as a period day. Extends or joins neighbouring periods; otherwise starts a new
 * period whose end is estimated from the typical length until the user confirms it.
 */
export function markPeriodDay(periods: Period[], date: ISODate, typicalLength: number): Period[] {
  const sorted = sortPeriods(periods);
  if (findPeriod(sorted, date)) return sorted;

  const before = sorted.find((p) => addDays(p.end, 1) === date);
  const after = sorted.find((p) => addDays(date, 1) === p.start);
  const rest = sorted.filter((p) => p !== before && p !== after);

  if (before && after) {
    return sortPeriods([...rest, { start: before.start, end: after.end, endEstimated: after.endEstimated }]);
  }
  if (before) return sortPeriods([...rest, { ...before, end: date, endEstimated: false }]);
  if (after) return sortPeriods([...rest, { ...after, start: date }]);

  const estimatedEnd = addDays(date, Math.max(1, typicalLength) - 1);
  const following = sorted.find((p) => p.start > date);
  if (following && estimatedEnd >= addDays(following.start, -1)) {
    // The estimate would run into the next period: this day is that period's real start.
    return sortPeriods([...sorted.filter((p) => p !== following), { ...following, start: date }]);
  }
  return sortPeriods([...sorted, { start: date, end: estimatedEnd, endEstimated: true }]);
}

/** Removes `date` from its period. Only the first or last day can be removed. */
export function unmarkPeriodDay(periods: Period[], date: ISODate): Period[] {
  const sorted = sortPeriods(periods);
  const period = findPeriod(sorted, date);
  if (!period) return sorted;
  const rest = sorted.filter((p) => p !== period);
  switch (edgeOf(period, date)) {
    case 'single':
      return rest;
    case 'start':
      return sortPeriods([...rest, { ...period, start: addDays(date, 1) }]);
    case 'end':
      return sortPeriods([...rest, { ...period, end: addDays(date, -1), endEstimated: false }]);
    case 'middle':
      return sorted;
  }
}

/** Confirms that the period containing `date` ended on that day. */
export function endPeriodOn(periods: Period[], date: ISODate): Period[] {
  const sorted = sortPeriods(periods);
  const period = findPeriod(sorted, date);
  if (!period) return sorted;
  return sortPeriods([...sorted.filter((p) => p !== period), { ...period, end: date, endEstimated: false }]);
}

/** Light, medium and heavy flow only make sense on a period day. */
export function isPeriodFlow(flow: Flow | undefined): boolean {
  return flow === 'light' || flow === 'medium' || flow === 'heavy';
}
