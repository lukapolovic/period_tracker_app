/**
 * Prediction engine (MARKET_ANALYSIS.md §12.3) — deterministic and explainable.
 *
 * 1. Take the most recent up to 6 valid cycles (15–90 days, not excluded).
 * 2. Base length L = median of those cycles (onboarding value until 2 exist).
 * 3. Spread V = round(standard deviation), 1–10 days; 3 days until 3 cycles exist.
 * 4. Next period window = last start + L, shown as [start − V, start + V].
 */
import { addDays, diffDays, type ISODate } from './dates';

export type Flow = 'spotting' | 'light' | 'medium' | 'heavy';

/** A bleeding episode. `endEstimated` = the end came from the typical length, not from the user. */
export type Period = { start: ISODate; end: ISODate; endEstimated: boolean };

export type CycleOverride = 'include' | 'exclude';

export const RULES = {
  minValidCycle: 15,
  maxValidCycle: 90,
  maxCyclesUsed: 6,
  defaultCycle: 28,
  defaultPeriod: 5,
  /** Cycles needed before predictions use your own history. */
  minCyclesPersonal: 2,
  /** Cycles needed before the spread is measured instead of assumed. */
  minCyclesSpread: 3,
  defaultSpread: 3,
  maxSpread: 10,
  /** Shortest-to-longest difference that triggers the "cycles vary" note. */
  varyThreshold: 9,
} as const;

export type CycleInfo = {
  start: ISODate;
  /** Last day of the cycle; null for the current cycle. */
  end: ISODate | null;
  /** Days until the next period start; null for the current cycle. */
  length: number | null;
  periodLength: number;
  periodEndEstimated: boolean;
  outOfRange: boolean;
  override: CycleOverride | null;
  included: boolean;
  usedForPrediction: boolean;
};

export type PredictedWindow = {
  likelyStart: ISODate;
  from: ISODate;
  to: ISODate;
  spread: number;
};

export type PredictionStatus = 'empty' | 'period' | 'upcoming' | 'window' | 'late';
export type PredictionBasis = 'history' | 'typical' | 'single-cycle' | 'default';

export type Prediction = {
  status: PredictionStatus;
  cycles: CycleInfo[];
  usedLengths: number[];
  baseLength: number;
  spread: number;
  periodLength: number;
  basis: PredictionBasis;
  earlyEstimate: boolean;
  cyclesVary: boolean;
  lastStart: ISODate | null;
  cycleDay: number | null;
  currentPeriod: Period | null;
  periodDay: number | null;
  next: PredictedWindow | null;
  /** Windows to draw on the calendar. */
  upcoming: PredictedWindow[];
  daysUntil: { from: number; to: number } | null;
  daysLate: number | null;
};

export type PredictionInput = {
  periods: Period[];
  overrides: Record<ISODate, CycleOverride>;
  typicalCycleLength: number | null;
  typicalPeriodLength: number | null;
};

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function sortPeriods(periods: Period[]): Period[] {
  return [...periods].sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
}

export function periodLengthOf(p: Period): number {
  return diffDays(p.end, p.start) + 1;
}

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function sampleStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

export function buildCycles(periods: Period[], overrides: Record<ISODate, CycleOverride>): CycleInfo[] {
  const sorted = sortPeriods(periods);
  const cycles = sorted.map((p, i): CycleInfo => {
    const next = sorted[i + 1];
    const length = next ? diffDays(next.start, p.start) : null;
    const outOfRange =
      length !== null && (length < RULES.minValidCycle || length > RULES.maxValidCycle);
    const override = overrides[p.start] ?? null;
    const included =
      length !== null && (override === 'include' || (override !== 'exclude' && !outOfRange));
    return {
      start: p.start,
      end: next ? addDays(next.start, -1) : null,
      length,
      periodLength: periodLengthOf(p),
      periodEndEstimated: p.endEstimated,
      outOfRange,
      override,
      included,
      usedForPrediction: false,
    };
  });
  const used = new Set(
    cycles
      .filter((c) => c.included)
      .slice(-RULES.maxCyclesUsed)
      .map((c) => c.start),
  );
  return cycles.map((c) => ({ ...c, usedForPrediction: used.has(c.start) }));
}

/** Median of the last confirmed period lengths, else the typical value, else 5. */
export function predictedPeriodLength(periods: Period[], typical: number | null): number {
  const confirmed = sortPeriods(periods)
    .filter((p) => !p.endEstimated)
    .slice(-RULES.maxCyclesUsed)
    .map(periodLengthOf);
  const value = confirmed.length ? Math.round(median(confirmed)) : (typical ?? RULES.defaultPeriod);
  return clamp(value, 1, 14);
}

export function predict(input: PredictionInput, today: ISODate): Prediction {
  // Ignore anything logged in the future; it can't be a past period start.
  const periods = sortPeriods(input.periods).filter((p) => p.start <= today);
  const cycles = buildCycles(periods, input.overrides);
  const usedLengths = cycles.filter((c) => c.usedForPrediction).map((c) => c.length as number);

  let baseLength: number;
  let basis: PredictionBasis;
  if (usedLengths.length >= RULES.minCyclesPersonal) {
    baseLength = Math.round(median(usedLengths));
    basis = 'history';
  } else if (input.typicalCycleLength) {
    baseLength = input.typicalCycleLength;
    basis = 'typical';
  } else if (usedLengths.length === 1) {
    baseLength = usedLengths[0];
    basis = 'single-cycle';
  } else {
    baseLength = RULES.defaultCycle;
    basis = 'default';
  }

  const spread =
    usedLengths.length >= RULES.minCyclesSpread
      ? clamp(Math.round(sampleStdDev(usedLengths)), 1, RULES.maxSpread)
      : RULES.defaultSpread;
  const periodLength = predictedPeriodLength(periods, input.typicalPeriodLength);
  const cyclesVary =
    usedLengths.length >= 2 &&
    Math.max(...usedLengths) - Math.min(...usedLengths) > RULES.varyThreshold;

  const base = {
    cycles,
    usedLengths,
    baseLength,
    spread,
    periodLength,
    basis,
    earlyEstimate: usedLengths.length < RULES.minCyclesPersonal,
    cyclesVary,
  };

  const last = periods[periods.length - 1];
  if (!last) {
    return {
      ...base,
      status: 'empty',
      lastStart: null,
      cycleDay: null,
      currentPeriod: null,
      periodDay: null,
      next: null,
      upcoming: [],
      daysUntil: null,
      daysLate: null,
    };
  }

  const windowFor = (k: number): PredictedWindow => {
    const likelyStart = addDays(last.start, baseLength * k);
    // Uncertainty compounds for cycles further ahead.
    const s = Math.min(RULES.maxSpread, Math.round(spread * Math.sqrt(k)));
    return { likelyStart, from: addDays(likelyStart, -s), to: addDays(likelyStart, s), spread: s };
  };

  const next = windowFor(1);
  const inPeriod = today <= last.end;
  let status: PredictionStatus;
  if (inPeriod) status = 'period';
  else if (today < next.from) status = 'upcoming';
  else if (today <= next.to) status = 'window';
  else status = 'late';

  return {
    ...base,
    status,
    lastStart: last.start,
    cycleDay: diffDays(today, last.start) + 1,
    currentPeriod: inPeriod ? last : null,
    periodDay: inPeriod ? diffDays(today, last.start) + 1 : null,
    next,
    // While late we only show the missed window — anything further out would be a guess.
    upcoming: status === 'late' ? [next] : [1, 2, 3].map(windowFor),
    daysUntil:
      status === 'upcoming'
        ? { from: diffDays(next.from, today), to: diffDays(next.to, today) }
        : null,
    daysLate: status === 'late' ? diffDays(today, next.to) : null,
  };
}
