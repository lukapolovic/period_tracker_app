import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Easing,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

/** The whole app is one wide page with four stops: Today, Calendar, History, Settings. */
export const PAGE_COUNT = 4;

export const Pages = { today: 0, calendar: 1, history: 2, settings: 3 } as const;

/** Slow start, long soft landing. */
const PAN_EASING = Easing.bezier(0.62, 0.02, 0.16, 1);

export type Flow = {
  width: number;
  height: number;
  /** Pan position in pages: 0 is Today, 1.5 is halfway between Calendar and History. */
  progress: SharedValue<number>;
  /** How far each page is scrolled, by page index. */
  offsets: SharedValue<number[]>;
  /** How close each page is to its end: 0 at the top, 1 at the bottom. */
  ends: SharedValue<number[]>;
  /** The scroll of whatever is in view, blended between pages while panning. */
  scrollY: SharedValue<number>;
  /** 1 when the page in view has reached its end, so the field can grow. */
  rise: SharedValue<number>;
  /** How open a sheet is. The ribbons drift up with it. */
  lift: SharedValue<number>;
  reduceMotion: boolean;
  /** The page the pan is heading for, for accessibility and the nav bar. */
  page: number;
  setPage: (page: number) => void;
  /** Pans to a page. */
  goTo: (page: number) => void;
  /** Lands on a page without a pan. */
  jumpTo: (page: number) => void;
};

const FlowContext = createContext<Flow | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const progress = useSharedValue(0);
  const offsets = useSharedValue<number[]>(new Array(PAGE_COUNT).fill(0));
  const ends = useSharedValue<number[]>(new Array(PAGE_COUNT).fill(0));
  const lift = useSharedValue(0);

  const scrollY = useDerivedValue(() => {
    const p = Math.min(Math.max(progress.get(), 0), PAGE_COUNT - 1);
    const a = Math.floor(p);
    const b = Math.min(a + 1, PAGE_COUNT - 1);
    const list = offsets.get();
    return list[a] + (list[b] - list[a]) * (p - a);
  });

  const rise = useDerivedValue(() => {
    const p = Math.min(Math.max(progress.get(), 0), PAGE_COUNT - 1);
    const a = Math.floor(p);
    const b = Math.min(a + 1, PAGE_COUNT - 1);
    const list = ends.get();
    return list[a] + (list[b] - list[a]) * (p - a);
  });

  const goTo = useCallback(
    (next: number) => {
      const distance = Math.abs(next - progress.get());
      setPage(next);
      progress.set(
        withTiming(next, {
          duration: reduceMotion ? 1 : 760 + Math.min(distance, 3) * 150,
          easing: PAN_EASING,
        }),
      );
    },
    [progress, reduceMotion],
  );

  const jumpTo = useCallback(
    (next: number) => {
      setPage(next);
      progress.set(next);
      offsets.set(new Array(PAGE_COUNT).fill(0));
      ends.set(new Array(PAGE_COUNT).fill(0));
    },
    [progress, offsets, ends],
  );

  const value = useMemo(
    () => ({
      width,
      height,
      progress,
      offsets,
      ends,
      scrollY,
      rise,
      lift,
      reduceMotion,
      page,
      setPage,
      goTo,
      jumpTo,
    }),
    [width, height, progress, offsets, ends, scrollY, rise, lift, reduceMotion, page, goTo, jumpTo],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow(): Flow {
  const flow = useContext(FlowContext);
  if (!flow) throw new Error('useFlow must be used inside FlowProvider');
  return flow;
}
