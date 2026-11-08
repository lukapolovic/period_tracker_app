import { useEffect } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';

import {
  getReminderPermission,
  requestReminderPermission,
  syncReminders,
  type ReminderPermission,
} from '@/lib/notifications';
import { buildReminders } from '@/lib/reminders';
import { useAppStore } from '@/store/app-store';

import { usePrediction } from './use-prediction';
import { useToday } from './use-today';

const usePermissionStore = create<{ permission: ReminderPermission }>(() => ({ permission: 'undetermined' }));

export const useReminderPermission = () => usePermissionStore((s) => s.permission);

const refreshPermission = async () => {
  usePermissionStore.setState({ permission: await getReminderPermission() });
};

/** Shows the phone's prompt. Only call this right after saying what reminders are for. */
export async function askForReminders() {
  const permission = await requestReminderPermission();
  usePermissionStore.setState({ permission });
  return permission;
}

/** Keeps the phone's schedule in step with the prediction. Mount once, at the root. */
export function useReminderSync() {
  const today = useToday();
  const prediction = usePrediction(today);
  const enabled = useAppStore((s) => s.settings.reminders);
  const detailed = useAppStore((s) => s.settings.detailedReminders);
  const permission = useReminderPermission();

  // The person may have changed it in the phone's settings while the app was away.
  useEffect(() => {
    refreshPermission();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshPermission();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    syncReminders(enabled && permission === 'granted' ? buildReminders(prediction, detailed, new Date()) : []);
  }, [prediction, enabled, detailed, permission]);
}
