import type { Reminder, ReminderDevice } from './reminders';

/**
 * Keeps the phone's schedule matching the latest plan. Plans can change faster than the phone updates, so only the
 * latest one counts; nothing is scheduled without permission; and a failed schedule never gets in the way of the app
 * — the next change or launch tries again. The promise settles once the phone is up to date, or the attempt failed.
 */
export function createReminderSync(device: ReminderDevice): (reminders: Reminder[]) => Promise<void> {
  let waiting: Reminder[] | null = null;
  let syncing = false;
  let done: Promise<void> = Promise.resolve();

  async function drain() {
    // Set and cleared in here, so a phone call that fails straight away can't leave syncing stuck on.
    syncing = true;
    try {
      while (waiting) {
        const latest = waiting;
        waiting = null;
        const allowed = latest.length > 0 && (await device.getPermission()) === 'granted';
        await device.replaceScheduled(allowed ? latest : []);
      }
    } catch (error) {
      console.warn('Could not schedule reminders', error);
    } finally {
      syncing = false;
    }
  }

  return (reminders) => {
    waiting = reminders;
    // A sync already under way picks up the new plan before it finishes.
    if (!syncing) done = drain();
    return done;
  };
}
