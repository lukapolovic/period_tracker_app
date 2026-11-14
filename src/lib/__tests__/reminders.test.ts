import { describe, expect, it, jest } from '@jest/globals';

import { predict, type Period } from '../cycle';
import { addDays } from '../dates';
import { createReminderSync } from '../reminder-sync';
import {
  buildReminders,
  plannedReminders,
  reminderStatus,
  type Reminder,
  type ReminderDevice,
  type ReminderKind,
  type ReminderPermission,
} from '../reminders';

const start = '2026-11-02';
const inProgress: Period = { start, end: addDays(start, 4), endEstimated: true };
const ended: Period = { ...inProgress, endEstimated: false };

const prediction = (periods: Period[], today: string, showOvulation = true) =>
  predict({ periods, overrides: {}, typicalCycleLength: 28, typicalPeriodLength: 5, showOvulation }, today);

const morningOf = (date: string) => new Date(`${date}T08:00:00`);
const local = (r: { at: Date }) => [r.at.getMonth() + 1, r.at.getDate(), r.at.getHours()];
const first = (list: ReturnType<typeof buildReminders>, kind: ReminderKind) => list.find((r) => r.kind === kind)!;

describe('buildReminders', () => {
  const list = buildReminders(prediction([inProgress], start), false, morningOf(start));

  it('reminds the morning before the period window opens', () => {
    // Next start 30 Nov, ±3 days, so the window opens on 27 Nov.
    expect(local(first(list, 'period-soon'))).toEqual([11, 26, 9]);
  });

  it('reminds the morning before the ovulation window opens', () => {
    // Ovulation 16 Nov, so the window is 11–17 Nov.
    expect(local(first(list, 'ovulation-soon'))).toEqual([11, 10, 9]);
  });

  it('reminds on the evening of the last ovulation day', () => {
    expect(local(first(list, 'ovulation-over'))).toEqual([11, 17, 20]);
  });

  it('reminds on the evening of the estimated last period day', () => {
    expect(local(first(list, 'period-over'))).toEqual([11, 6, 20]);
  });

  it('skips the period end once it is logged', () => {
    const logged = buildReminders(prediction([ended], start), false, morningOf(start));
    expect(logged.some((r) => r.kind === 'period-over')).toBe(false);
  });

  it('plans three cycles ahead, in time order, with no repeated ids', () => {
    expect(list.filter((r) => r.kind === 'period-soon')).toHaveLength(3);
    expect(list.filter((r) => r.kind === 'ovulation-soon')).toHaveLength(3);
    const times = list.map((r) => r.at.getTime());
    expect(times).toEqual([...times].sort((a, b) => a - b));
    expect(new Set(list.map((r) => r.id)).size).toBe(list.length);
  });

  it('leaves out anything already past', () => {
    const later = buildReminders(prediction([inProgress], '2026-11-12'), false, morningOf('2026-11-12'));
    expect(later.some((r) => r.id === 'ovulation-soon-2026-11-10')).toBe(false);
    expect(later.some((r) => r.id === 'ovulation-over-2026-11-17')).toBe(true);
  });

  it('has no ovulation reminders when the estimate is off', () => {
    const off = buildReminders(prediction([inProgress], start, false), false, morningOf(start));
    expect(off.some((r) => r.kind.startsWith('ovulation'))).toBe(false);
    expect(off.some((r) => r.kind === 'period-soon')).toBe(true);
  });

  it('stays quiet while a period is late', () => {
    const today = addDays(start, 45);
    expect(buildReminders(prediction([ended], today), false, morningOf(today))).toEqual([]);
  });

  it('keeps text neutral by default, so a lock screen gives nothing away', () => {
    for (const r of list) expect(r.body).not.toMatch(/period|ovulation/i);
  });

  it('says what each reminder is about when asked to', () => {
    const detailed = buildReminders(prediction([inProgress], start), true, morningOf(start));
    expect(first(detailed, 'period-soon').body).toBe('Your period is likely in 1–7 days.');
    expect(first(detailed, 'ovulation-soon').body).toBe('Your estimated ovulation window starts tomorrow.');
    expect(first(detailed, 'ovulation-over').body).toBe('Your estimated ovulation window ends today.');
    expect(first(detailed, 'period-over').body).toBe('Your period is likely ending today.');
  });
});

describe('reminderStatus', () => {
  it('is on only when the setting is on and the phone allows it', () => {
    expect(reminderStatus(true, 'granted')).toBe('on');
    expect(reminderStatus(false, 'granted')).toBe('off');
    expect(reminderStatus(true, 'undetermined')).toBe('off');
  });

  it('lets the phone have the last word', () => {
    expect(reminderStatus(true, 'denied')).toBe('blocked');
    expect(reminderStatus(true, 'unsupported')).toBe('unsupported');
  });
});

describe('plannedReminders', () => {
  const p = prediction([inProgress], start);
  const now = morningOf(start);
  const on = { reminders: true, detailedReminders: false };

  it('plans the reminders while they are on', () => {
    expect(plannedReminders(p, on, 'granted', now)).toEqual(buildReminders(p, false, now));
  });

  it('plans nothing when they are off, blocked or not yet allowed', () => {
    expect(plannedReminders(p, { ...on, reminders: false }, 'granted', now)).toEqual([]);
    expect(plannedReminders(p, on, 'denied', now)).toEqual([]);
    expect(plannedReminders(p, on, 'undetermined', now)).toEqual([]);
  });
});

/** A phone that keeps its schedule in memory. */
function memoryDevice(permission: ReminderPermission, fail = false) {
  const schedules: Reminder[][] = [];
  const device: ReminderDevice = {
    getPermission: async () => permission,
    requestPermission: async () => permission,
    replaceScheduled: async (reminders) => {
      if (fail) throw new Error('no space left');
      schedules.push(reminders);
    },
    sendTest: async () => {},
  };
  return { device, schedules };
}

describe('createReminderSync', () => {
  const list = buildReminders(prediction([inProgress], start), false, morningOf(start));

  it('schedules the latest plan', async () => {
    const { device, schedules } = memoryDevice('granted');
    await createReminderSync(device)(list);
    expect(schedules).toEqual([list]);
  });

  it('schedules nothing without permission, and clears what was there', async () => {
    const { device, schedules } = memoryDevice('denied');
    await createReminderSync(device)(list);
    expect(schedules).toEqual([[]]);
  });

  it('skips plans that were replaced before the phone got to them', async () => {
    const { device, schedules } = memoryDevice('granted');
    const sync = createReminderSync(device);
    sync(list.slice(0, 1));
    sync(list.slice(0, 2));
    await sync(list);
    expect(schedules).toEqual([list.slice(0, 1), list]);
  });

  it('never lets a failed schedule get in the way of the app', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { device } = memoryDevice('granted', true);
    await expect(createReminderSync(device)(list)).resolves.toBeUndefined();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('tries again on the next change, even after a phone call that failed straight away', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { device, schedules } = memoryDevice('granted');
    let calls = 0;
    const flaky: ReminderDevice = {
      ...device,
      getPermission: () => {
        calls += 1;
        if (calls === 1) throw new Error('not ready');
        return Promise.resolve<ReminderPermission>('granted');
      },
    };
    const sync = createReminderSync(flaky);
    await sync(list);
    await sync(list);
    expect(schedules).toEqual([list]);
    warn.mockRestore();
  });
});
