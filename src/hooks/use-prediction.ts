import { useMemo } from 'react';

import { predict, type Prediction } from '@/lib/cycle';
import type { ISODate } from '@/lib/dates';
import { useAppStore } from '@/store/app-store';

export function usePrediction(today: ISODate): Prediction {
  const periods = useAppStore((s) => s.periods);
  const overrides = useAppStore((s) => s.cycleOverrides);
  const typicalCycleLength = useAppStore((s) => s.settings.typicalCycleLength);
  const typicalPeriodLength = useAppStore((s) => s.settings.typicalPeriodLength);
  const showOvulation = useAppStore((s) => s.settings.showOvulation);

  return useMemo(
    () => predict({ periods, overrides, typicalCycleLength, typicalPeriodLength, showOvulation }, today),
    [periods, overrides, typicalCycleLength, typicalPeriodLength, showOvulation, today],
  );
}
