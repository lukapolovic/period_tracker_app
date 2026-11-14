import { describe, expect, it } from '@jest/globals';

import { period } from '../__fixtures__/cycles';
import { predict } from '../cycle';
import {
  applyEdit,
  EMPTY_RECORD,
  normalizeRecord,
  periodStartOn,
  undoChange,
  type Change,
  type CycleRecord,
  type EditContext,
  type RecordEdit,
} from '../record';

const context: EditContext = { typicalPeriodLength: 5 };
const record = (parts: Partial<CycleRecord>): CycleRecord => ({ ...EMPTY_RECORD, ...parts });
const run = (start: CycleRecord, ...edits: RecordEdit[]) => edits.reduce((r, edit) => applyEdit(r, edit, context), start);
const change = (before: CycleRecord, edit: RecordEdit): Change => ({ before, after: applyEdit(before, edit, context) });

/** Whether predictions count the cycle starting on `start`. */
const counts = (r: CycleRecord, start: string) =>
  predict({ periods: r.periods, overrides: r.overrides, typicalCycleLength: null, typicalPeriodLength: null }, '2026-12-31')
    .cycles.find((c) => c.start === start)?.included;

describe('periods', () => {
  it('starts a new period that runs for the usual length until it is ended', () => {
    const r = run(EMPTY_RECORD, { type: 'mark-period-day', date: '2026-11-03' });
    expect(r.periods).toEqual([period('2026-11-03', '2026-11-07', true)]);
  });

  it("takes a new period's length from confirmed periods once there are some", () => {
    const r = run(record({ periods: [period('2026-09-01', '2026-09-04'), period('2026-10-01', '2026-10-04')] }), {
      type: 'mark-period-day',
      date: '2026-11-01',
    });
    expect(r.periods.at(-1)).toEqual(period('2026-11-01', '2026-11-04', true));
  });

  it('returns the same record when an edit changes nothing', () => {
    const r = record({ periods: [period('2026-11-01', '2026-11-05')] });
    expect(run(r, { type: 'mark-period-day', date: '2026-11-03' })).toBe(r);
    expect(run(r, { type: 'unmark-period-day', date: '2026-11-03' })).toBe(r);
    expect(run(r, { type: 'set-flow', date: '2026-11-09', flow: null })).toBe(r);
  });
});

describe('flow', () => {
  const logged = record({
    periods: [period('2026-11-01', '2026-11-05')],
    logs: { '2026-11-04': { flow: 'spotting' }, '2026-11-05': { flow: 'medium', symptoms: ['cramps'] } },
  });

  it('drops light, medium and heavy flow from days that leave a period, and keeps spotting', () => {
    const r = run(logged, { type: 'end-period', date: '2026-11-03' });
    expect(r.logs).toEqual({ '2026-11-04': { flow: 'spotting' }, '2026-11-05': { symptoms: ['cramps'] } });
  });

  it('makes a day a period day when it gets a period flow', () => {
    const r = run(EMPTY_RECORD, { type: 'set-flow', date: '2026-11-03', flow: 'medium' });
    expect(r.periods).toEqual([period('2026-11-03', '2026-11-07', true)]);
    expect(r.logs['2026-11-03']).toEqual({ flow: 'medium' });
  });

  it('lets spotting sit on any day without starting a period', () => {
    const r = run(EMPTY_RECORD, { type: 'set-flow', date: '2026-11-03', flow: 'spotting' });
    expect(r.periods).toEqual([]);
    expect(r.logs['2026-11-03']).toEqual({ flow: 'spotting' });
  });
});

describe('day logs', () => {
  const day = '2026-11-03';

  it('keeps no empty logs', () => {
    const r = run(EMPTY_RECORD, { type: 'toggle-symptom', date: day, id: 'cramps' }, { type: 'toggle-symptom', date: day, id: 'cramps' });
    expect(r.logs).toEqual({});
  });

  it('trims notes, and a blank note leaves nothing behind', () => {
    expect(run(EMPTY_RECORD, { type: 'set-note', date: day, note: '  slept badly ' }).logs[day]).toEqual({ note: 'slept badly' });
    expect(run(EMPTY_RECORD, { type: 'set-note', date: day, note: 'x' }, { type: 'set-note', date: day, note: '  ' }).logs).toEqual({});
  });

  it('keeps symptoms, moods and flow side by side', () => {
    const r = run(
      record({ periods: [period('2026-11-01', '2026-11-05')] }),
      { type: 'toggle-symptom', date: day, id: 'cramps' },
      { type: 'toggle-mood', date: day, id: 'calm' },
      { type: 'set-flow', date: day, flow: 'light' },
    );
    expect(r.logs[day]).toEqual({ flow: 'light', symptoms: ['cramps'], moods: ['calm'] });
  });
});

describe('Count in predictions', () => {
  // Cycles of 28 days (normal), 12 days (flagged as unusually short) and 30 days, then the current one.
  const periods = [
    period('2026-08-01', '2026-08-05'),
    period('2026-08-29', '2026-09-02'),
    period('2026-09-10', '2026-09-12'),
    period('2026-10-10', '2026-10-14'),
  ];
  const r = record({ periods });

  it('stores a choice only where it differs from the default', () => {
    const left = run(r, { type: 'count-cycle', start: '2026-08-01', counted: false });
    expect(left.overrides).toEqual({ '2026-08-01': 'exclude' });
    const flagged = run(r, { type: 'count-cycle', start: '2026-08-29', counted: true });
    expect(flagged.overrides).toEqual({ '2026-08-29': 'include' });
    expect(run(left, { type: 'count-cycle', start: '2026-08-01', counted: true }).overrides).toEqual({});
  });

  it('does what it says, whatever the cycle', () => {
    for (const start of ['2026-08-01', '2026-08-29', '2026-09-10']) {
      for (const counted of [true, false]) {
        expect(counts(run(r, { type: 'count-cycle', start, counted }), start)).toBe(counted);
      }
    }
  });

  it("can't count the current cycle, which has no length yet", () => {
    expect(run(r, { type: 'count-cycle', start: '2026-10-10', counted: false })).toBe(r);
  });

  it("keeps a left-out cycle left out after fixing its first day", () => {
    const left = run(r, { type: 'count-cycle', start: '2026-08-01', counted: false });
    const earlier = run(left, { type: 'mark-period-day', date: '2026-07-31' });
    expect(earlier.overrides).toEqual({ '2026-07-31': 'exclude' });
    expect(counts(earlier, '2026-07-31')).toBe(false);
    const later = run(left, { type: 'unmark-period-day', date: '2026-08-01' });
    expect(counts(later, '2026-08-02')).toBe(false);
  });

  it('lets a removed period take its choice with it, so a period added on that day starts fresh', () => {
    const single = record({ periods: [period('2026-08-01', '2026-08-01'), period('2026-08-29', '2026-09-02')] });
    const left = run(single, { type: 'count-cycle', start: '2026-08-01', counted: false });
    const removed = run(left, { type: 'unmark-period-day', date: '2026-08-01' });
    expect(removed.overrides).toEqual({});
    expect(counts(run(removed, { type: 'mark-period-day', date: '2026-08-01' }), '2026-08-01')).toBe(true);
  });

  it("keeps the earlier period's choice when two periods merge", () => {
    const close = record({
      periods: [period('2026-08-01', '2026-08-03'), period('2026-08-05', '2026-08-07'), period('2026-09-01', '2026-09-05')],
      overrides: { '2026-08-01': 'include', '2026-08-05': 'exclude' },
    });
    expect(run(close, { type: 'mark-period-day', date: '2026-08-04' }).overrides).toEqual({ '2026-08-01': 'include' });
  });
});

describe('start from answers', () => {
  it("starts the record from onboarding's answers", () => {
    const r = run(EMPTY_RECORD, { type: 'start-from-answers', lastPeriodStart: '2026-10-20', periodLength: 6 });
    expect(r.periods).toEqual([period('2026-10-20', '2026-10-25', true)]);
  });

  it('keeps the period within the lengths you can enter', () => {
    const r = run(EMPTY_RECORD, { type: 'start-from-answers', lastPeriodStart: '2026-10-01', periodLength: 30 });
    expect(r.periods[0].end).toBe('2026-10-14');
  });

  it('adds nothing for "I don\'t remember"', () => {
    expect(run(EMPTY_RECORD, { type: 'start-from-answers', lastPeriodStart: null, periodLength: 5 })).toBe(EMPTY_RECORD);
  });
});

describe('undo', () => {
  const today = '2026-11-08';

  it('takes back "Period started" and keeps what was logged since', () => {
    const started = change(EMPTY_RECORD, { type: 'mark-period-day', date: today });
    const since = run(started.after, { type: 'toggle-symptom', date: today, id: 'cramps' });
    const undone = undoChange(since, started);
    expect(undone.periods).toEqual([]);
    expect(undone.logs[today]).toEqual({ symptoms: ['cramps'] });
  });

  it('drops a period flow logged since, once its period is taken back', () => {
    const started = change(EMPTY_RECORD, { type: 'mark-period-day', date: today });
    const since = run(started.after, { type: 'set-flow', date: today, flow: 'medium' });
    expect(undoChange(since, started)).toEqual(EMPTY_RECORD);
  });

  it('puts back flow the change dropped', () => {
    const before = record({ periods: [period('2026-11-01', '2026-11-05', true)], logs: { '2026-11-04': { flow: 'heavy' } } });
    const ended = change(before, { type: 'end-period', date: '2026-11-02' });
    expect(ended.after.logs).toEqual({});
    expect(undoChange(ended.after, ended)).toEqual(before);
  });

  it('puts a moved choice back where it was', () => {
    const before = run(
      record({ periods: [period('2026-08-01', '2026-08-05'), period('2026-08-29', '2026-09-02')] }),
      { type: 'count-cycle', start: '2026-08-01', counted: false },
    );
    const moved = change(before, { type: 'mark-period-day', date: '2026-07-31' });
    expect(undoChange(moved.after, moved)).toEqual(before);
  });

  it('leaves periods alone when they have been edited since', () => {
    const started = change(EMPTY_RECORD, { type: 'mark-period-day', date: today });
    const since = run(started.after, { type: 'end-period', date: today });
    expect(undoChange(since, started).periods).toEqual(since.periods);
  });
});

describe('periodStartOn', () => {
  const current = record({ periods: [period('2026-11-01', '2026-11-05')] });
  const after = (date: string) => periodStartOn(run(current, { type: 'mark-period-day', date }), date);

  it('tells joining a period apart from starting one', () => {
    expect(after('2026-11-06')).toEqual({ kind: 'joined' });
    expect(periodStartOn(run(EMPTY_RECORD, { type: 'mark-period-day', date: '2026-11-01' }), '2026-11-01')).toEqual({ kind: 'first' });
  });

  it('notices a period starting unusually soon after the last one', () => {
    expect(after('2026-11-12')).toEqual({ kind: 'new', daysSinceLast: 11, unusuallySoon: true });
    expect(after('2026-11-29')).toEqual({ kind: 'new', daysSinceLast: 28, unusuallySoon: false });
  });

  it('has nothing to say about a day that is not a period day', () => {
    expect(periodStartOn(current, '2026-11-20')).toBeNull();
  });
});

describe('normalizeRecord', () => {
  it('tidies a record saved by an older version', () => {
    const saved = record({
      periods: [period('2026-08-01', '2026-08-05'), period('2026-08-29', '2026-09-02')],
      logs: { '2026-08-10': { flow: 'heavy', moods: ['calm'] }, '2026-08-11': { symptoms: [] }, '2026-08-02': { flow: 'heavy' } },
      overrides: { '2026-07-31': 'exclude', '2026-08-29': 'include' },
    });
    expect(normalizeRecord(saved)).toEqual({
      periods: saved.periods,
      logs: { '2026-08-10': { moods: ['calm'] }, '2026-08-02': { flow: 'heavy' } },
      overrides: { '2026-08-29': 'include' },
    });
  });

  it('leaves a tidy record as it is', () => {
    const tidy = record({ periods: [period('2026-08-01', '2026-08-05')], logs: { '2026-08-02': { flow: 'heavy' } } });
    expect(normalizeRecord(tidy)).toBe(tidy);
  });
});
