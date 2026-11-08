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

The browser preview needs Skia's WebAssembly file once after install:

```bash
npm run setup:web
```

In development builds, **Settings → Developer → Load demo data** fills the app with seven months of sample cycles.

```bash
npm test           # prediction engine + period editing unit tests
npm run typecheck
npm run lint
```

## What's in this first version

The app is one wide page. The nav bar pans along it; the day log and the explanation rise over it as sheets.

| Stop | What it does |
| --- | --- |
| Onboarding (4 steps) | Promise, last period start (or "I don't remember"), typical lengths (or "Not sure"), first prediction |
| Today | Cycle ring wrapped in a ribbon, next-period window ("16–18 days"), one main button (Period started / ended), quick log chips, undo, ovulation estimate |
| Calendar | Month view: logged days solid, predictions dashed, ovulation estimate dotted; tap any day to log |
| History | Typical cycle, range, period length, cycle-length chart, include/leave out any cycle |
| Settings | Typical lengths, theme (system/light/dark), week start, ovulation estimate, reminders, delete all data |
| Day log (sheet) | Period day, flow, symptoms, mood, note |
| How predictions work (sheet) | The user's own numbers explained in plain words |

Predictions follow MARKET_ANALYSIS.md §12.3: median of the last ≤ 6 valid cycles, a ±window from their spread, always shown as a range. The ovulation estimate counts back 14 days from the predicted start, with a window from 5 days before to 1 day after.

Reminders are local notifications, so nothing leaves the phone. They come at 09:00 the day before a predicted period or ovulation window, and at 20:00 on the last day of an ovulation window or the estimated last day of a period in progress. The text stays neutral unless **Settings → Reminders → Say what they're about** is on. To see them without waiting, use **Settings → Developer → Send test reminders**.

## Where things live

```
src/app/          routes: the one page, onboarding and the two sheets
src/screens/      the four stops on the page
src/flow/         the world: pager, ribbons, knots, field, nav, sheets
src/components/   UI pieces; src/components/ui/ holds the design-system primitives
src/lib/          pure logic: cycle.ts (predictions), periods.ts (editing), dates.ts
src/store/        app state, saved on the device only
src/theme/        design tokens (colours, type, spacing) for light and dark
```

## Design

The full spec is [DESIGN.md](DESIGN.md), following the
[refero MindMarket style](https://styles.refero.design/style/9130ad37-bf80-458f-b808-ac0ef6a8d1e9) and the motion of
[mindmarket.com](https://mindmarket.com/): cream paper, white sticker cards, Inter only, and ribbons that bend as the
page pans. All colours, type and spacing are tokens in [src/theme/tokens.ts](src/theme/tokens.ts), for light and dark.

The ribbons are drawn with Skia and run on the UI thread with Reanimated, so they never wait on JavaScript.

### Placeholder art

The figures in [assets/art/](assets/art/) are simple placeholders drawn for this project. To swap one for the real art,
replace the file and update its ratio in [src/flow/art.ts](src/flow/art.ts). The app icon is still Expo's default (the
app name is not decided yet — §18.3).

## Not built yet (from the v1.0 MUST list)

Late, supplies and daily-log reminders · choosing a reminder time · life events (pregnancy, birth, contraception changes) · app lock ·
export/import · encrypted on-device database · custom symptoms · alternate icons · Plus purchase and tip jar.
