/**
 * App state, persisted on this device only (AsyncStorage). No network, no account.
 *
 * An adapter: it loads the cycle record and settings, applies edits through the record module — which holds every
 * rule about what the record may contain — and saves. TODO(v1): move to an encrypted on-device database
 * (MARKET_ANALYSIS.md §12.5); only this file should need to change.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { CycleOverride, Period } from '@/lib/cycle';
import type { ISODate } from '@/lib/dates';
import { demoData } from '@/lib/demo';
import {
  applyEdit,
  EMPTY_RECORD,
  normalizeRecord,
  undoChange,
  type Change,
  type CycleRecord,
  type DayLog,
  type EditContext,
  type RecordEdit,
} from '@/lib/record';
import type { ThemePreference } from '@/theme';

export type Settings = {
  onboarded: boolean;
  /** From onboarding; null = "not sure". Used until two cycles are logged. */
  typicalCycleLength: number | null;
  typicalPeriodLength: number | null;
  theme: ThemePreference;
  weekStartsOn: 0 | 1;
  showOvulation: boolean;
  /** The phone's own notification permission still has the last word. */
  reminders: boolean;
  /** Off keeps reminder text neutral on the lock screen. */
  detailedReminders: boolean;
};

export type OnboardingAnswers = {
  lastPeriodStart: ISODate | null;
  cycleLength: number | null;
  periodLength: number | null;
};

type Data = {
  record: CycleRecord;
  settings: Settings;
};

type Actions = {
  /** Applies one edit to the record. Pass the change it returns to `undo` to take just that edit back. */
  apply(edit: RecordEdit): Change;
  undo(change: Change): void;
  /** Saves the answers and starts the record from them. Flipping `onboarded` hands over to the main app. */
  completeOnboarding(answers: OnboardingAnswers): void;
  updateSettings(patch: Partial<Settings>): void;
  loadDemoData(today: ISODate): void;
  deleteAllData(): void;
};

const initialData: Data = {
  record: EMPTY_RECORD,
  settings: {
    onboarded: false,
    typicalCycleLength: 28,
    typicalPeriodLength: 5,
    theme: 'system',
    weekStartsOn: 1,
    showOvulation: true,
    reminders: true,
    detailedReminders: false,
  },
};

const contextOf = (settings: Settings): EditContext => ({ typicalPeriodLength: settings.typicalPeriodLength });

/** Before version 3 the record's parts sat at the top level. Version 2 added settings. */
type SavedBeforeV3 = {
  periods?: Period[];
  logs?: Record<ISODate, DayLog>;
  cycleOverrides?: Record<ISODate, CycleOverride>;
};

function migrate(saved: unknown, version: number): Data {
  const data = saved as Partial<Data> & SavedBeforeV3;
  const record =
    version < 3
      ? { periods: data.periods ?? [], logs: data.logs ?? {}, overrides: data.cycleOverrides ?? {} }
      : (data.record ?? EMPTY_RECORD);
  return {
    // Older versions could leave a cycle's "Count in predictions" choice behind when its first day moved.
    record: normalizeRecord(record),
    // Saved settings win, so only settings added since take their defaults.
    settings: { ...initialData.settings, ...data.settings },
  };
}

export const useAppStore = create<Data & Actions>()(
  persist(
    (set, get) => ({
      ...initialData,

      apply(edit) {
        const before = get().record;
        const after = applyEdit(before, edit, contextOf(get().settings));
        if (after !== before) set({ record: after });
        return { before, after };
      },

      undo: (change) => set({ record: undoChange(get().record, change) }),

      completeOnboarding({ lastPeriodStart, cycleLength, periodLength }) {
        const { record, settings } = get();
        set({
          record: applyEdit(record, { type: 'start-from-answers', lastPeriodStart, periodLength }, contextOf(settings)),
          settings: { ...settings, onboarded: true, typicalCycleLength: cycleLength, typicalPeriodLength: periodLength },
        });
      },

      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

      loadDemoData: (today) => set({ record: demoData(today) }),

      deleteAllData: () => set(initialData),
    }),
    {
      name: 'period-tracker',
      version: 3,
      storage: createJSONStorage(() => AsyncStorage),
      migrate,
      partialize: ({ record, settings }) => ({ record, settings }),
    },
  ),
);

export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAppStore.persist.onFinishHydration(onChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
