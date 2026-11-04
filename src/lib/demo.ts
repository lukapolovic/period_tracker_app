/** Sample history for development builds, so every screen can be checked with real-looking data. */
import type { Flow, Period } from './cycle';
import { addDays, type ISODate } from './dates';
import type { DayLog } from './log';

const CYCLE_LENGTHS = [29, 27, 31, 28, 30, 26, 29];
const PERIOD_LENGTHS = [5, 4, 6, 5, 5, 4, 5, 5];
const FLOWS: Flow[] = ['medium', 'heavy', 'medium', 'light', 'light', 'spotting'];

export function demoData(today: ISODate): { periods: Period[]; logs: Record<ISODate, DayLog> } {
  const starts: ISODate[] = [addDays(today, -12)];
  for (let i = CYCLE_LENGTHS.length - 1; i >= 0; i--) {
    starts.unshift(addDays(starts[0], -CYCLE_LENGTHS[i]));
  }

  const periods: Period[] = starts.map((start, i) => ({
    start,
    end: addDays(start, PERIOD_LENGTHS[i] - 1),
    endEstimated: false,
  }));

  const logs: Record<ISODate, DayLog> = {};
  starts.forEach((start, i) => {
    for (let d = 0; d < PERIOD_LENGTHS[i]; d++) {
      logs[addDays(start, d)] = {
        flow: FLOWS[d],
        symptoms: d === 0 ? ['cramps', 'fatigue'] : d === 1 ? ['cramps'] : [],
        moods: d === 0 ? ['sensitive'] : [],
      };
    }
    const mid = addDays(start, 8);
    if (mid < today) logs[mid] = { moods: ['happy', 'energetic'] };
    const late = addDays(start, 23);
    if (late < today && i < starts.length - 1) logs[late] = { symptoms: ['bloating', 'cravings'] };
  });

  return { periods, logs };
}
