/**
 * App state, persisted on this device only (AsyncStorage). No network, no account.
 * TODO(v1): move to an encrypted on-device database (MARKET_ANALYSIS.md §12.5).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { predictedPeriodLength, type CycleOverride, type Flow, type Period } from '@/lib/cycle';
import type { ISODate } from '@/lib/dates';
import { demoData } from '@/lib/demo';
import { isEmptyLog, toggleIn, type DayLog } from '@/lib/log';
import * as edits from '@/lib/periods';

export type ThemePreference = 'system' | 'light' | 'dark';

export type Settings = {
  onboarded: boolean;
  /** From onboarding; null = "not sure". Used until two cycles are logged. */
  typicalCycleLength: number | null;
  typicalPeriodLength: number | null;
  theme: ThemePreference;
  weekStartsOn: 0 | 1;
};

type Data = {
  periods: Period[];
  logs: Record<ISODate, DayLog>;
  /** Keyed by cycle start date. */
  cycleOverrides: Record<ISODate, CycleOverride>;
  settings: Settings;
};

export type Snapshot = Pick<Data, 'periods' | 'logs'>;

type Actions = {
  completeOnboarding(input: {
    lastPeriodStart: ISODate | null;
    cycleLength: number | null;
    periodLength: number | null;
  }): void;
  markPeriodDay(date: ISODate): void;
  unmarkPeriodDay(date: ISODate): void;
  endPeriodOn(date: ISODate): void;
  setFlow(date: ISODate, flow: Flow | null): void;
  toggleSymptom(date: ISODate, id: string): void;
  toggleMood(date: ISODate, id: string): void;
  setNote(date: ISODate, note: string): void;
  setCycleOverride(start: ISODate, value: CycleOverride | null): void;
  updateSettings(patch: Partial<Settings>): void;
  snapshot(): Snapshot;
  restore(snapshot: Snapshot): void;
  loadDemoData(today: ISODate): void;
  deleteAllData(): void;
};

const initialData: Data = {
  periods: [],
  logs: {},
  cycleOverrides: {},
  settings: {
    onboarded: false,
    typicalCycleLength: 28,
    typicalPeriodLength: 5,
    theme: 'system',
    weekStartsOn: 1,
  },
};

function updateLog(
  logs: Record<ISODate, DayLog>,
  date: ISODate,
  update: (log: DayLog) => DayLog,
): Record<ISODate, DayLog> {
  const next = update(logs[date] ?? {});
  const copy = { ...logs };
  if (isEmptyLog(next)) delete copy[date];
  else copy[date] = next;
  return copy;
}

/** Light/medium/heavy flow can't exist outside a period — drop it when days leave a period. */
function reconcileFlows(periods: Period[], logs: Record<ISODate, DayLog>) {
  let next = logs;
  for (const [date, log] of Object.entries(logs)) {
    if (edits.isPeriodFlow(log.flow) && !edits.findPeriod(periods, date)) {
      next = updateLog(next, date, ({ flow: _drop, ...rest }) => rest);
    }
  }
  return next;
}

export const useAppStore = create<Data & Actions>()(
  persist(
    (set, get) => {
      const typicalLength = () =>
        predictedPeriodLength(get().periods, get().settings.typicalPeriodLength);

      const editPeriods = (fn: (periods: Period[]) => Period[]) => {
        const periods = fn(get().periods);
        set({ periods, logs: reconcileFlows(periods, get().logs) });
      };

      return {
        ...initialData,

        completeOnboarding({ lastPeriodStart, cycleLength, periodLength }) {
          const settings = {
            ...get().settings,
            onboarded: true,
            typicalCycleLength: cycleLength,
            typicalPeriodLength: periodLength,
          };
          const periods = lastPeriodStart
            ? edits.markPeriodDay(
                get().periods,
                lastPeriodStart,
                predictedPeriodLength(get().periods, periodLength),
              )
            : get().periods;
          set({ settings, periods });
        },

        markPeriodDay: (date) => editPeriods((p) => edits.markPeriodDay(p, date, typicalLength())),
        unmarkPeriodDay: (date) => editPeriods((p) => edits.unmarkPeriodDay(p, date)),
        endPeriodOn: (date) => editPeriods((p) => edits.endPeriodOn(p, date)),

        setFlow(date, flow) {
          if (flow && edits.isPeriodFlow(flow) && !edits.findPeriod(get().periods, date)) {
            get().markPeriodDay(date);
          }
          set({
            logs: updateLog(get().logs, date, (log) => ({ ...log, flow: flow ?? undefined })),
          });
        },

        toggleSymptom: (date, id) =>
          set({
            logs: updateLog(get().logs, date, (log) => ({
              ...log,
              symptoms: toggleIn(log.symptoms, id),
            })),
          }),

        toggleMood: (date, id) =>
          set({
            logs: updateLog(get().logs, date, (log) => ({ ...log, moods: toggleIn(log.moods, id) })),
          }),

        setNote: (date, note) =>
          set({ logs: updateLog(get().logs, date, (log) => ({ ...log, note: note.trim() })) }),

        setCycleOverride(start, value) {
          const cycleOverrides = { ...get().cycleOverrides };
          if (value) cycleOverrides[start] = value;
          else delete cycleOverrides[start];
          set({ cycleOverrides });
        },

        updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),

        snapshot: () => ({ periods: get().periods, logs: get().logs }),
        restore: (snapshot) => set(snapshot),

        loadDemoData: (today) => set({ ...demoData(today), cycleOverrides: {} }),

        deleteAllData: () => set(initialData),
      };
    },
    {
      name: 'period-tracker',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ periods, logs, cycleOverrides, settings }) => ({
        periods,
        logs,
        cycleOverrides,
        settings,
      }),
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
