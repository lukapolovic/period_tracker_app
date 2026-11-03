import type { Flow } from './cycle';

export type DayLog = {
  flow?: Flow;
  symptoms?: string[];
  moods?: string[];
  note?: string;
};

export function isEmptyLog(log: DayLog): boolean {
  return !log.flow && !log.symptoms?.length && !log.moods?.length && !log.note?.trim();
}

/** A log worth a dot on the calendar (period flow already shows as the fill). */
export function hasDetails(log: DayLog | undefined): boolean {
  return !!log && (!!log.symptoms?.length || !!log.moods?.length || !!log.note?.trim() || log.flow === 'spotting');
}

export function toggleIn(list: string[] | undefined, id: string): string[] {
  const current = list ?? [];
  return current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
}
