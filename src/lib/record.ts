/**
 * The cycle record: everything a person has logged — periods, day logs, and the cycles they've counted in or left out
 * of predictions — and every edit they can make to it.
 *
 * Every rule about what the record may contain lives here, so it holds however the record is edited:
 * - periods are sorted and never overlap or touch (the edits in periods.ts);
 * - a new period runs for the predicted period length until it's ended;
 * - light, medium and heavy flow only sit on period days, and setting one on any other day makes it a period day;
 * - empty day logs aren't kept;
 * - a "Count in predictions" choice belongs to its cycle: it moves when the cycle's first day moves, and goes when the
 *   cycle does.
 *
 * Pure, so all of it is tested without a phone. The store only loads, applies and saves.
 */
import {
  isOutOfRange,
  overrideFor,
  predictedPeriodLength,
  RULES,
  type CycleOverride,
  type Flow,
  type Period,
} from './cycle';
import { diffDays, type ISODate } from './dates';
import { endPeriodOn, findPeriod, markPeriodDay, unmarkPeriodDay } from './periods';

export type DayLog = {
  flow?: Flow;
  symptoms?: string[];
  moods?: string[];
  note?: string;
};

export type CycleRecord = {
  /** Sorted, never overlapping or touching. */
  periods: Period[];
  /** Only days with something logged. */
  logs: Record<ISODate, DayLog>;
  /** "Count in predictions" choices that differ from the default, keyed by the first day of their cycle. */
  overrides: Record<ISODate, CycleOverride>;
};

export const EMPTY_RECORD: CycleRecord = { periods: [], logs: {}, overrides: {} };

/** One thing a person does to their record. */
export type RecordEdit =
  | { type: 'mark-period-day'; date: ISODate }
  | { type: 'unmark-period-day'; date: ISODate }
  | { type: 'end-period'; date: ISODate }
  | { type: 'set-flow'; date: ISODate; flow: Flow | null }
  | { type: 'toggle-symptom'; date: ISODate; id: string }
  | { type: 'toggle-mood'; date: ISODate; id: string }
  | { type: 'set-note'; date: ISODate; note: string }
  /** Counts a completed cycle in predictions, or leaves it out. */
  | { type: 'count-cycle'; start: ISODate; counted: boolean }
  /** Onboarding's answers: the last period's first day (null for "I don't remember") and the usual period length. */
  | { type: 'start-from-answers'; lastPeriodStart: ISODate | null; periodLength: number | null };

/** What edits need to know from settings. */
export type EditContext = {
  /** How long a new period is assumed to last while no confirmed periods exist to learn from. */
  typicalPeriodLength: number | null;
};

/** An applied edit, kept so it can be taken back. */
export type Change = { before: CycleRecord; after: CycleRecord };

/** Applies one edit. An edit that changes nothing returns the same record. */
export function applyEdit(record: CycleRecord, edit: RecordEdit, context: EditContext): CycleRecord {
  switch (edit.type) {
    case 'mark-period-day': {
      const length = predictedPeriodLength(record.periods, context.typicalPeriodLength);
      return editPeriods(record, (periods) => markPeriodDay(periods, edit.date, length));
    }
    case 'unmark-period-day':
      return editPeriods(record, (periods) => unmarkPeriodDay(periods, edit.date));
    case 'end-period':
      return editPeriods(record, (periods) => endPeriodOn(periods, edit.date));
    case 'set-flow': {
      const flow = edit.flow ?? undefined;
      const marked =
        isPeriodFlow(flow) && !findPeriod(record.periods, edit.date)
          ? applyEdit(record, { type: 'mark-period-day', date: edit.date }, context)
          : record;
      return editLog(marked, edit.date, (log) => ({ ...log, flow }));
    }
    case 'toggle-symptom':
      return editLog(record, edit.date, (log) => ({ ...log, symptoms: toggleIn(log.symptoms, edit.id) }));
    case 'toggle-mood':
      return editLog(record, edit.date, (log) => ({ ...log, moods: toggleIn(log.moods, edit.id) }));
    case 'set-note':
      return editLog(record, edit.date, (log) => ({ ...log, note: edit.note.trim() }));
    case 'count-cycle':
      return countCycle(record, edit.start, edit.counted);
    case 'start-from-answers': {
      const start = edit.lastPeriodStart;
      if (!start) return record;
      const length = predictedPeriodLength(record.periods, edit.periodLength);
      return editPeriods(record, (periods) => markPeriodDay(periods, start, length));
    }
  }
}

/**
 * Takes back one change without undoing anything edited since. Periods go back as a whole, with the cycle choices
 * tied to them, but only if they're still as the change left them. Each day log goes back on its own, so a symptom
 * logged after "Period started" survives undoing it. The record's rules then apply as usual.
 */
export function undoChange(current: CycleRecord, { before, after }: Change): CycleRecord {
  const periodsUntouched = samePeriods(current.periods, after.periods);
  return normalizeRecord({
    periods: periodsUntouched ? before.periods : current.periods,
    logs: restoreKeys(current.logs, before.logs, after.logs, sameLog),
    overrides: periodsUntouched
      ? restoreKeys(current.overrides, before.overrides, after.overrides, (a, b) => a === b)
      : current.overrides,
  });
}

/** Brings a record in line with its rules — after an undo, or when loading one saved by an older version. */
export function normalizeRecord(record: CycleRecord): CycleRecord {
  const logs = tidyLogs(record.logs, record.periods);
  const starts = new Set(record.periods.map((p) => p.start));
  const kept = Object.fromEntries(Object.entries(record.overrides).filter(([start]) => starts.has(start)));
  const overrides = sameEntries(kept, record.overrides) ? record.overrides : kept;
  return logs === record.logs && overrides === record.overrides ? record : { ...record, logs, overrides };
}

/** How a period day relates to the periods before it: what the message after "Period started" says. */
export type PeriodStart =
  /** The day joined a period already under way. */
  | { kind: 'joined' }
  /** The first period on record. */
  | { kind: 'first' }
  /** A new period, this many days after the last one began. Fewer than 15 usually means a missed log (§12.2 F-04). */
  | { kind: 'new'; daysSinceLast: number; unusuallySoon: boolean };

/** Null when `date` isn't a period day. */
export function periodStartOn(record: CycleRecord, date: ISODate): PeriodStart | null {
  const i = record.periods.findIndex((p) => p.start <= date && date <= p.end);
  if (i < 0) return null;
  if (record.periods[i].start !== date) return { kind: 'joined' };
  const previous = record.periods[i - 1];
  if (!previous) return { kind: 'first' };
  const daysSinceLast = diffDays(date, previous.start);
  return { kind: 'new', daysSinceLast, unusuallySoon: daysSinceLast < RULES.minValidCycle };
}

/** Light, medium and heavy flow only make sense on a period day; spotting can happen any day. */
function isPeriodFlow(flow: Flow | undefined): boolean {
  return flow === 'light' || flow === 'medium' || flow === 'heavy';
}

function isEmptyLog(log: DayLog): boolean {
  return !log.flow && !log.symptoms?.length && !log.moods?.length && !log.note?.trim();
}

/** A log worth a dot on the calendar (period flow already shows as the fill). */
export function hasDetails(log: DayLog | undefined): boolean {
  return !!log && (!!log.symptoms?.length || !!log.moods?.length || !!log.note?.trim() || log.flow === 'spotting');
}

function toggleIn(list: string[] | undefined, id: string): string[] {
  const current = list ?? [];
  return current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
}

/** Edits the periods, then brings the day logs and cycle choices in line with them. */
function editPeriods(record: CycleRecord, edit: (periods: Period[]) => Period[]): CycleRecord {
  const periods = edit(record.periods);
  if (samePeriods(periods, record.periods)) return record;
  return {
    periods,
    logs: tidyLogs(record.logs, periods),
    overrides: carryOverrides(record.overrides, record.periods, periods),
  };
}

function editLog(record: CycleRecord, date: ISODate, edit: (log: DayLog) => DayLog): CycleRecord {
  const current = record.logs[date];
  const next = compact(edit(current ?? {}));
  if (current ? sameLog(current, next) : isEmptyLog(next)) return record;
  return { ...record, logs: putLog(record.logs, date, next) };
}

/** Drops period flow from days that aren't period days any more, and any log left empty. */
function tidyLogs(logs: Record<ISODate, DayLog>, periods: Period[]): Record<ISODate, DayLog> {
  let next = logs;
  for (const [date, log] of Object.entries(logs)) {
    const strayFlow = isPeriodFlow(log.flow) && !findPeriod(periods, date);
    if (strayFlow || isEmptyLog(log)) next = putLog(next, date, strayFlow ? { ...log, flow: undefined } : log);
  }
  return next;
}

/**
 * Keeps each "Count in predictions" choice with its cycle. A cycle is known by the period that starts it, so each
 * period after an edit takes the choice of the earliest period before the edit that it overlaps: a choice moves when
 * its period's first day moves, the earlier choice stands when two periods merge, and it goes with a removed period.
 */
function carryOverrides(
  overrides: Record<ISODate, CycleOverride>,
  before: Period[],
  after: Period[],
): Record<ISODate, CycleOverride> {
  const next: Record<ISODate, CycleOverride> = {};
  for (const period of after) {
    const origin = before.find((old) => old.start <= period.end && period.start <= old.end);
    const choice = origin ? overrides[origin.start] : undefined;
    if (choice) next[period.start] = choice;
  }
  return sameEntries(next, overrides) ? overrides : next;
}

/** Stores a choice only where it differs from the default. The current cycle has no length yet, so it can't be counted. */
function countCycle(record: CycleRecord, start: ISODate, counted: boolean): CycleRecord {
  const i = record.periods.findIndex((p) => p.start === start);
  const next = record.periods[i + 1];
  if (i < 0 || !next) return record;
  const choice = overrideFor(isOutOfRange(diffDays(next.start, start)), counted);
  if ((record.overrides[start] ?? null) === choice) return record;
  const overrides = { ...record.overrides };
  if (choice) overrides[start] = choice;
  else delete overrides[start];
  return { ...record, overrides };
}

/** For each key the change touched that still reads as the change left it, puts back what was there before. */
function restoreKeys<T>(
  current: Record<string, T>,
  before: Record<string, T>,
  after: Record<string, T>,
  same: (a: T, b: T) => boolean,
): Record<string, T> {
  const matches = (a: T | undefined, b: T | undefined) => (a === undefined || b === undefined ? a === b : same(a, b));
  let next = current;
  for (const key of new Set([...Object.keys(before), ...Object.keys(after)])) {
    if (matches(before[key], after[key]) || !matches(current[key], after[key])) continue;
    if (next === current) next = { ...current };
    if (before[key] === undefined) delete next[key];
    else next[key] = before[key];
  }
  return next;
}

function putLog(logs: Record<ISODate, DayLog>, date: ISODate, log: DayLog): Record<ISODate, DayLog> {
  const next = { ...logs };
  const tidy = compact(log);
  if (isEmptyLog(tidy)) delete next[date];
  else next[date] = tidy;
  return next;
}

/** Leaves out empty fields, so equal logs look equal. */
function compact(log: DayLog): DayLog {
  const out: DayLog = {};
  if (log.flow) out.flow = log.flow;
  if (log.symptoms?.length) out.symptoms = log.symptoms;
  if (log.moods?.length) out.moods = log.moods;
  if (log.note?.trim()) out.note = log.note;
  return out;
}

function sameLog(a: DayLog, b: DayLog): boolean {
  return (
    a.flow === b.flow &&
    sameList(a.symptoms, b.symptoms) &&
    sameList(a.moods, b.moods) &&
    (a.note ?? '').trim() === (b.note ?? '').trim()
  );
}

function sameList(a: string[] = [], b: string[] = []): boolean {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

function samePeriods(a: Period[], b: Period[]): boolean {
  return (
    a === b ||
    (a.length === b.length &&
      a.every((p, i) => p.start === b[i].start && p.end === b[i].end && p.endEstimated === b[i].endEstimated))
  );
}

function sameEntries<T>(a: Record<string, T>, b: Record<string, T>): boolean {
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => a[key] === b[key]);
}
