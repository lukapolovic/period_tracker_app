/**
 * Reminders, as the rest of the app sees them: whether they're on, turning them on or off, whether they say what
 * they're about, and a test send. This module owns the phone's permission, the "on" rule, what gets planned and
 * keeping the phone's schedule in step, so screens only show a toggle and call one of these.
 */
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { create } from 'zustand';

import { device } from '@/lib/notifications';
import { createReminderSync } from '@/lib/reminder-sync';
import { plannedReminders, reminderStatus, sampleBodies, type ReminderPermission, type ReminderStatus } from '@/lib/reminders';
import { useAppStore } from '@/store/app-store';

import { usePrediction } from './use-prediction';
import { useToday } from './use-today';

/** The phone's answer. Not saved: it's asked again at launch and whenever the app comes back to the foreground. */
const usePermission = create<{ permission: ReminderPermission }>(() => ({ permission: 'undetermined' }));

const sync = createReminderSync(device);

async function refreshPermission() {
  usePermission.setState({ permission: await device.getPermission() });
}

export function useReminders(): { status: ReminderStatus; detailed: boolean } {
  const setting = useAppStore((s) => s.settings.reminders);
  const detailed = useAppStore((s) => s.settings.detailedReminders);
  const permission = usePermission((s) => s.permission);
  return { status: reminderStatus(setting, permission), detailed };
}

/**
 * Saves the choice. Turning on also asks the phone if it hasn't been asked yet, so only turn reminders on right after
 * saying what they're for.
 */
export async function setRemindersOn(on: boolean) {
  useAppStore.getState().updateSettings({ reminders: on });
  if (on && usePermission.getState().permission === 'undetermined') {
    usePermission.setState({ permission: await device.requestPermission() });
  }
}

/** Off keeps the text neutral, so a lock screen gives nothing away. */
export function setDetailedReminders(detailed: boolean) {
  useAppStore.getState().updateSettings({ detailedReminders: detailed });
}

/** Development only: one of each reminder, a few seconds apart, so they can be seen without waiting for a date. */
export function sendTestReminders() {
  return device.sendTest(sampleBodies(useAppStore.getState().settings.detailedReminders));
}

/** Keeps the phone's schedule in step with the prediction. Mount once, at the root. */
export function useReminderSync() {
  const today = useToday();
  const prediction = usePrediction(today);
  const reminders = useAppStore((s) => s.settings.reminders);
  const detailedReminders = useAppStore((s) => s.settings.detailedReminders);
  const permission = usePermission((s) => s.permission);

  // The person may have changed it in the phone's settings while the app was away.
  useEffect(() => {
    refreshPermission();
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refreshPermission();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    sync(plannedReminders(prediction, { reminders, detailedReminders }, permission, new Date()));
  }, [prediction, reminders, detailedReminders, permission]);
}
