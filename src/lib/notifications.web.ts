import type { Reminder } from './reminders';

export type ReminderPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

/** The browser preview has no local notifications, so reminders stay out of it. */
export const getReminderPermission = async (): Promise<ReminderPermission> => 'unsupported';
export const requestReminderPermission = getReminderPermission;
export const syncReminders = async (_reminders: Reminder[]) => {};
export const sendTestReminders = async (_bodies: string[]) => {};
