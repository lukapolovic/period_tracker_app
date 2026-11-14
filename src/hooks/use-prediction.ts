import { useMemo } from 'react';

import { predict, type Prediction } from '@/lib/cycle';
import type { ISODate } from '@/lib/dates';
import { dayStatusReader, type DayStatus } from '@/lib/day-status';
import { useAppStore } from '@/store/app-store';

export function usePrediction(today: ISODate): Prediction {
  const periods = useAppStore((s) => s.record.periods);
  const overrides = useAppStore((s) => s.record.overrides);
  const typicalCycleLength = useAppStore((s) => s.settings.typicalCycleLength);
  const typicalPeriodLength = useAppStore((s) => s.settings.typicalPeriodLength);
  const showOvulation = useAppStore((s) => s.settings.showOvulation);

  return useMemo(
    () => predict({ periods, overrides, typicalCycleLength, typicalPeriodLength, showOvulation }, today),
    [periods, overrides, typicalCycleLength, typicalPeriodLength, showOvulation, today],
  );
}

/** What any date is in the cycle, read against the record and this prediction. */
export function useDayStatus(prediction: Prediction, today: ISODate): (date: ISODate) => DayStatus {
  const periods = useAppStore((s) => s.record.periods);
  return useMemo(() => dayStatusReader(periods, prediction, today), [periods, prediction, today]);
}
