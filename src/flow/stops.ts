/** The stops on the one page, in order. Home, the nav bar and `Pages` all come from this one list. */
export const STOPS = [
  { key: 'today', label: 'Today' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'history', label: 'History' },
  { key: 'settings', label: 'Settings' },
] as const;

export type StopKey = (typeof STOPS)[number]['key'];

/** Each stop's page index, for panning to it: `goTo(Pages.calendar)`. */
export const Pages = Object.fromEntries(STOPS.map((stop, i) => [stop.key, i])) as Record<StopKey, number>;
