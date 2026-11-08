import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import type { Reminder } from './reminders';

export type ReminderPermission = 'granted' | 'denied' | 'undetermined' | 'unsupported';

const CHANNEL = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

/** Android won't show the permission prompt until a channel exists. */
async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL, {
    name: 'Reminders',
    importance: AndroidImportance.DEFAULT,
  });
}

function toPermission(status: Notifications.NotificationPermissionsStatus): ReminderPermission {
  if (status.granted) return 'granted';
  return status.canAskAgain ? 'undetermined' : 'denied';
}

export async function getReminderPermission(): Promise<ReminderPermission> {
  return toPermission(await Notifications.getPermissionsAsync());
}

export async function requestReminderPermission(): Promise<ReminderPermission> {
  await ensureChannel();
  return toPermission(await Notifications.requestPermissionsAsync());
}

async function replaceScheduled(reminders: Reminder[]) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!reminders.length || (await getReminderPermission()) !== 'granted') return;
  await ensureChannel();
  for (const { id, at, body } of reminders) {
    await Notifications.scheduleNotificationAsync({
      identifier: id,
      content: { body, sound: 'default' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
    });
  }
}

let waiting: Reminder[] | null = null;
let syncing = false;

/** Makes the phone's schedule match. Changes can arrive faster than it updates, so only the latest one counts. */
export async function syncReminders(reminders: Reminder[]) {
  waiting = reminders;
  if (syncing) return;
  syncing = true;
  try {
    while (waiting) {
      const latest = waiting;
      waiting = null;
      await replaceScheduled(latest);
    }
  } catch (error) {
    // A failed schedule must never get in the way of the app. The next launch tries again.
    console.warn('Could not schedule reminders', error);
  } finally {
    syncing = false;
  }
}

/** Development only: sends each body a few seconds apart, so reminders can be seen without waiting for a date. */
export async function sendTestReminders(bodies: string[]) {
  await ensureChannel();
  await Promise.all(
    bodies.map((body, i) =>
      Notifications.scheduleNotificationAsync({
        content: { body, sound: 'default' },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 3 + i * 3,
          channelId: CHANNEL,
        },
      }),
    ),
  );
}
