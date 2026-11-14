# Context

The words this codebase uses, so code, docs and conversations mean the same thing. Scope and reasoning live in
[MARKET_ANALYSIS.md](MARKET_ANALYSIS.md); the look in [DESIGN.md](DESIGN.md).

## What a person logs

- **Period** — a run of bleeding days, from first to last. Periods never overlap or touch: touching periods merge. A
  period's end is *estimated* (from the usual length) until the person ends it.
- **Flow** — how heavy bleeding is on a day: spotting, light, medium or heavy. Light, medium and heavy only sit on
  period days, and setting one on any other day makes it a period day; spotting can be any day. Only this meaning of
  "flow" is a domain word — see *the flow* below.
- **Day log** — what's noted for one date: flow, symptoms, moods and a note. Empty logs aren't kept.
- **Cycle** — from the first day of one period to the day before the next. The current cycle has no length yet.
- **Count in predictions** — whether a completed cycle is used for predictions. Cycles of 15–90 days count by default;
  shorter or longer ones (usually a missed log) don't, unless counted in. A choice that differs from the default is a
  **cycle override**, keyed by the cycle's first day. It moves when that day moves and goes when the cycle does.
- **Cycle record** — periods, day logs and cycle overrides together, plus every edit a person can make to them
  ([src/lib/record.ts](src/lib/record.ts)). Every rule above lives there. The store only loads, applies and saves.
  Undo takes back one edit and nothing logged since.

## What the app works out

- **Prediction** — what `predict()` makes of the record ([src/lib/cycle.ts](src/lib/cycle.ts)): the base cycle length
  (median of up to six counted cycles), the spread, and a status — empty, period, upcoming, window or late.
- **Next-period window** — when a period is likely to start: the likely start ± the spread. Always a range.
- **Ovulation estimate** — 14 days before a predicted start, in a window from 5 days before to 1 day after. Dates only,
  so a rough estimate and never contraception. When there's no window, the **ovulation gap** says why: switched off, no
  period yet, cycles that vary, a late period, or no room after the period.
- **Day status** — what a single date is: a logged period day, an expected period day (still to come, so an estimate),
  a predicted period day, an ovulation-estimate day, a plain cycle day, or nothing
  ([src/lib/day-status.ts](src/lib/day-status.ts)). Screens ask it instead of doing their own date maths.
- **Cycle map** — the current cycle by day number, as the ring on Today draws it. It keeps this cycle's ovulation
  window after it has passed; the card on Today names the next one.
- **Reminders** — local notifications planned from the prediction ([src/lib/reminders.ts](src/lib/reminders.ts),
  [src/hooks/use-reminders.ts](src/hooks/use-reminders.ts)). On only when the setting is on and the phone allows it;
  *blocked* when the phone says no.

## The app itself

- **The flow** (also *the world*) — the one wide page the app pans along, with its ribbons, knots and field
  ([src/flow/](src/flow/)). Its state type is `FlowState`, to keep it apart from *Flow* above.
- **Stop** — one of the places on the page: Today, Calendar, History, Settings ([src/flow/stops.ts](src/flow/stops.ts)).
  The world's art is drawn for exactly four pages (`WORLD_PAGES`); onboarding's four steps reuse it.
- **Sheet** — a route that rises over the page instead of replacing it: the day log and "How predictions work".
