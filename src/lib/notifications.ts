import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderDevice, ReminderPermission } from './reminders';

const CHANNEL = 'reminders';

// Set when this adapter loads, as Expo's docs show, so a reminder that arrives while the app is open still shows.
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

/** The phone's local notifications. The browser preview gets notifications.web.ts instead. */
export const device: ReminderDevice = {
  getPermission: async () => toPermission(await Notifications.getPermissionsAsync()),

  async requestPermission() {
    await ensureChannel();
    return toPermission(await Notifications.requestPermissionsAsync());
  },

  async replaceScheduled(reminders) {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!reminders.length) return;
    await ensureChannel();
    for (const { id, at, body } of reminders) {
      await Notifications.scheduleNotificationAsync({
        identifier: id,
        content: { body, sound: 'default' },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
      });
    }
  },

  async sendTest(bodies) {
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
  },
};
