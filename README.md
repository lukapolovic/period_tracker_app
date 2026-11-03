# period_tracker_app

A calm, private period tracker — no account, no ads, data stays on the phone.
Scope and reasoning live in [MARKET_ANALYSIS.md](MARKET_ANALYSIS.md) (§12 MVP spec, §12.3 prediction engine, §13 design).

Built with Expo (SDK 58) + React Native + TypeScript — one codebase for iOS and Android.

## Run it

```bash
npm install
npm start
```

Then press `i` (iOS simulator), `a` (Android emulator) or `w` (browser), or scan the QR code with the Expo Go app on your phone.
Expo SDK 58 expects Node 22.13 or newer; older Node 22 versions work but print a warning (`nvm install 22` fixes it).

In development builds, **Settings → Developer → Load demo data** fills the app with seven months of sample cycles.

```bash
npm test           # prediction engine + period editing unit tests
npm run typecheck
npm run lint
```

## What's in this first version

| Screen | What it does |
| --- | --- |
| Onboarding (4 steps) | Promise, last period start (or "I don't remember"), typical lengths (or "Not sure"), first prediction |
| Today | Cycle ring, next-period window ("16–18 days"), one main button (Period started / ended), quick log chips, undo |
| Calendar | Month view: logged days solid, predictions dashed; tap any day to log |
| Day log | Period day, flow, symptoms, mood, note |
| History | Typical cycle, range, period length, cycle-length chart, include/leave out any cycle |
| How predictions work | The user's own numbers explained in plain words |
| Settings | Typical lengths, theme (system/light/dark), week start, delete all data |

Predictions follow MARKET_ANALYSIS.md §12.3: median of the last ≤ 6 valid cycles, a ±window from their spread, always shown as a range.

## Where things live

```
src/app/          screens (Expo Router — every file is a route)
src/components/   UI pieces; src/components/ui/ holds the design-system primitives
src/lib/          pure logic: cycle.ts (predictions), periods.ts (editing), dates.ts
src/store/        app state, saved on the device only
src/theme/        design tokens (colours, type, spacing) for light and dark
```

## Design

Direction: the [refero style](https://styles.refero.design/style/7088d695-362b-4e09-b325-fa8136d4f350) — white canvas,
rounded display type, flat fills, thick 2px borders, 12px corners, one saturated green for actions.
All colours are tokens in [src/theme/tokens.ts](src/theme/tokens.ts). Changes made for accessibility (WCAG AA):

- Text on green buttons is Night Ink, not white (white on `#58cc02` is only 2.1:1).
- Grey body text is `#767676` instead of `#777777`; link text uses a deeper blue.
- Period data uses its own berry colour; predictions are always dashed, never colour-only.

Fonts are Nunito Black (big numbers, 48px+) and Nunito Sans (everything else), bundled with the app.

### Art placeholders

Every character or animation is a dashed `<Placeholder>` with a short brief for the illustrator:

| Where | Kind | Brief |
| --- | --- | --- |
| Onboarding, step 1 | character | Mascot waving hello |
| Onboarding, last step | animation | Celebration burst as setup finishes |
| Today, inside the ring | character | Mascot that changes with the cycle phase |
| History, empty state | character | Mascot holding an empty calendar |
| How predictions work | illustration | Past cycles → median → likely window |

App icon and splash are still Expo's defaults (the app name is not decided yet — §18.3).

## Not built yet (from the v1.0 MUST list)

Reminders and discreet notifications · life events (pregnancy, birth, contraception changes) · app lock ·
export/import · encrypted on-device database · custom symptoms · alternate icons · Plus purchase and tip jar.
