import type { ReminderDevice } from './reminders';

/** The browser preview has no local notifications, so reminders stay out of it. */
export const device: ReminderDevice = {
  getPermission: async () => 'unsupported',
  requestPermission: async () => 'unsupported',
  replaceScheduled: async () => {},
  sendTest: async () => {},
};
