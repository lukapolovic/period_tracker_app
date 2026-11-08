# Design system — "Paper meadow"

> One long sheet of cream paper with ribbons running through it. Panning along it is the whole app.

**Status:** adopted and built 4 Nov 2026. It replaces "Field notes on birch paper". When code and this file disagree,
this file wins.

**References:**

- [MindMarket on Refero Styles](https://styles.refero.design/style/9130ad37-bf80-458f-b808-ac0ef6a8d1e9): tokens, type, shape.
- [mindmarket.com](https://mindmarket.com/): motion, ribbon, depth tricks.

---

## 1. The idea

The app is one page, not a stack of screens. Today, Calendar, History and Settings are four stops along a single wide
sheet. The nav bar pans the sheet; nothing slides in on top of it. Fat ribbons run behind everything, and they bend as
the sheet moves, so moving around feels like one continuous flow.

| Product principle ([MARKET_ANALYSIS.md §13.1](MARKET_ANALYSIS.md)) | How this style delivers it |
| --- | --- |
| Calm | Motion only answers something you did. An idle screen draws nothing. Text always sits on a plain surface. |
| Clear | One big readout per page. Every state has a shape (solid, dashed, outlined) as well as a colour. |
| Kind | Characters and flowers keep it warm. They never react to what you log. |
| Discreet | No blood imagery. Coral is one colour among several, so a glance at the screen says nothing about periods. |
| Accessible | Every text pair is AA or better (§4). Reduce Motion turns the whole world still (§9). |

---

## 2. Colour — light

### Neutrals

| Name | Hex | Token | Role |
| --- | --- | --- | --- |
| Cream Paper | `#f5f1e4` | `canvas` | The page. Also the chips and wells inside white cards. |
| Pure White | `#ffffff` | `surface` | Cards, nav, pills. Never white on white. |
| Sandstone | `#e0dbce` | `surfaceAlt` | Recessed: ring track, segmented track. |
| Hairline Mist | `#d5d5d4` | `line` | Dividers inside cards. |
| Deep Stone | `#60625e` | `textSecondary` | Secondary text. See §10. |
| Ink Black | `#2c2e2a` | `ink` | All primary text and icons. |

### Accents

Colour is decoration, not status. Blue, coral and yellow never mean success, error or warning.

| Name | Hex | Token | Role |
| --- | --- | --- | --- |
| Fresh Grass | `#8ed462` | `structure`, `ribbonGrass` | The big ribbon, nav blob, chart bars. Never text. |
| Sunshine Pop | `#f5e211` | `action`, `ribbonSun` | The one primary button per page, the ribbon around the disc. |
| Coral Pop | `#ff705d` | `period`, `ribbonCoral` | Logged period days, always with ink text on top. |
| Ember Coral | `#c9361f` | `periodLine` | Period as a thin line or text: prediction outlines, dashed arcs. |
| Deep Lilac | `#7b3fb0` | `ovulationLine` | The ovulation estimate, always as a dotted line. |
| Sky Pop | `#2ba0ff` | `symptom`, `ribbonSky` | Selected symptom chips, ribbons. |
| Lilac | `#e8c0fc` | `mood` | Selected mood chips, stat tile. Sampled from the art. |
| Meadow, Forest | `#79c14d`, `#65a936` | `hillMid`, `hillBack` | The field. Sampled from the art. |

One chromatic accent per component. Ribbons also have a `…Shade` token, used only where a ribbon folds or dives
behind something (§6).

---

## 3. Colour — dark ("Night meadow")

The reference has no dark theme, so these are ours. Accent fills stay as they are, because ink text works on all of
them. Only the ribbons and hills drop a step, so they don't glare at night.

| Token | Hex |
| --- | --- |
| `canvas` / `surface` / `surfaceAlt` | `#1f231c` / `#2b3026` / `#3a4034` |
| `line` | `#474e40` |
| `ink` / `textSecondary` | `#f5f1e4` / `#b9bcb1` |
| `periodLine` | `#ff8b7b` |
| `ovulationLine` | `#d6a8f5` |
| `ribbonGrass` / `ribbonSky` / `ribbonCoral` / `ribbonSun` | `#4f8f3a` / `#2384d4` / `#e0604f` / `#d9c814` |
| `hillBack` / `hillMid` / `hillFront` | `#2f5426` / `#3a6a2e` / `#4a8038` |

---

## 4. Contrast (computed, WCAG 2.x)

| Pair | Ratio |
| --- | --- |
| Ink on cream / white | 12.1 / 13.7 |
| Deep Stone on cream / white | 5.5 / 6.2 |
| Ink on grass / sun / coral / sky / lilac | 7.7 / 10.3 / 5.1 / 5.0 / 8.7 |
| Ember Coral on cream / white | 4.6 / 5.2 |
| Deep Lilac on cream / white | 5.8 / 6.6 |
| Dark: cream on canvas, secondary on surface | 14.1, 7.0 |
| Dark: `periodLine` on surface | 5.9 |
| Dark: `ovulationLine` on surface | 6.9 |

---

## 5. Type, shape, surfaces

**Type:** Inter only, regular and medium. No second typeface, no bold, no all-caps labels.

| Variant | Size / line | Tracking | Use |
| --- | --- | --- | --- |
| `display` | 72 / 72 | −0.06em | The number in the disc |
| `headingLg` | 53 / 58 | −0.04em | Page headings. Never smaller. |
| `heading` | 40 / 44 | −0.04em | Onboarding questions, stepper values |
| `headingSm` | 30 / 36 | −0.03em | Card titles |
| `subheading` | 20 / 25 | −0.01em | |
| `paragraph` | 17 / 26 | | Reading text |
| `body`, `bodyStrong` | 15 / 22 | | Everything else |
| `button` | 16 / 22 | | |
| `label` | 15 / 20 | | Short labels, in sentence case |
| `caption` | 13 / 18 | | Legends, fine print |

**Radius:** 50 on cards and sheets, full on pills, buttons, chips and nav, 22 on inset tiles, 10 on tags. Nothing
sharper.

**Depth:** cream, then white, then sandstone. No shadows. The only gradients in the system are the fold shades on
ribbons (§6).

**Text rule:** text sits on a white card or pill, or inside the disc. A ribbon may pass behind a card, never behind
bare text. If a link sits on the canvas, give it the white pill (`TextButton onCanvas`).

---

## 6. The world

Everything lives in `src/flow/`. Back to front:

1. **Background ribbons** (Skia canvas): one big Fresh Grass ribbon, plus thin Sun, Sky and Coral lines.
2. **Pages**: four transparent scroll views side by side.
3. **Front canvas**: the over-strands of the knots, the field, the clouds.
4. **Nav**: the floating pill.

### Ribbons

Each ribbon is a spline through a few control points, defined in screen widths and heights in
[world.ts](src/flow/world.ts). `parallax` sets how far it travels per page. Below 1 it reads as further away.

They curve as they move. Every control point chases its target on its own soft spring, with stiffness varying along
the line, and how far a point lags turns into a sideways bend ([ribbon-sim.ts](src/flow/ribbon-sim.ts)). So a line
stretches and snakes while the page pans, then relaxes into its resting curve. A line never slides as one rigid shape.

The big ribbon also has a self-crossing loop between Calendar and History. Its under-strand gets the fold shade, because
two strands of the same flat colour would otherwise merge. This is the site's trick: the shaded stretch is drawn first,
then the rest on top.

### The wrap (Today)

The yellow ribbon comes in from the left, goes behind the disc, around the right, across the front, around the left,
behind again and out to the right ([hero-wrap.tsx](src/components/hero-wrap.tsx)). The disc sits between two canvases,
which is what creates the depth. The prediction runs along the front stretch as text.

- The ribbon crosses only the disc's rim, below the ring, so it never covers data.
- It winds itself on at launch and whenever the page arrives, and unwinds when you leave.
- Screen readers get the same text from the ring's label.

### The knots (between pages)

Each gap between pages has a ribbon tied around the content like string around a parcel. One strand runs behind the
cards; the other runs over them with a curl in it. They have a parallax above 1, so they're off screen at rest and only
cross mid-pan. Both strands start and end off screen, so nothing ever appears to change depth in the middle of a card.
A unit test holds them off screen at rest.

### The hop (over a card)

`RibbonHop` wraps a card: a thin ribbon runs behind it, rises above its top edge and lands over its top right corner
([ribbon-hop.tsx](src/flow/ribbon-hop.tsx)). The arc follows the page's scroll, so it leaps while you scroll and settles
when you stop. Only use it on cards with a free top right corner.

### The field

Three rows of hills along the bottom, in front of the content, so cards slide behind them
([field.tsx](src/flow/field.tsx)). At rest they barely clear the nav. When a page reaches its end they rise, the page's
two flowers grow and its character climbs out. Each row pans at its own speed. Flowers lean with the pan.

### The clouds

A cream cloud band slides down over the status bar once a page leaves its top, so scrolled content never collides with
the clock.

---

## 7. Components

- **Button:** a pill with the label left and a small circle right, as on the reference site. Primary is Sunshine Pop
  with a white circle. Secondary is cream in a card (white with `onCanvas`) with a green circle. The circle slides on
  press. One primary per page.
- **Nav:** a white pill with four equal text tabs: Today, Calendar, History, Settings. A green blob follows the pan
  itself, stretching between stops.
- **Card:** white, radius 50, title in `headingSm`.
- **Chip:** cream pill. Selected fills with its category colour and gains a check mark.
- **Sheet:** a cream page that rises over the world, leaving a strip of it showing. The ribbons drift up with it. Day
  log and How predictions work use it. They're routes (`transparentModal`) so deep links and back keep working.
- **Snackbar:** ink pill above the nav, with a yellow Undo.
- **Segmented:** sandstone track with a sliding white thumb.
- **Toggle:** a label and one line on what it does, with a switch that turns green when on.

### Data

| State | Shape |
| --- | --- |
| Logged period | Solid coral |
| Predicted | Dashed Ember Coral outline, never a fill |
| Ovulation estimate | Dotted Deep Lilac outline, never a fill |
| Today | Green with an ink ring (calendar), ink bead (ring) |
| Has a log | A small dot |
| Left out of predictions | Dashed, hollow bar |

### Ovulation and reminders

The ovulation estimate shows as a dotted arc on the ring, dotted days on the calendar, a card under Today's log and an
"Ovulation estimate" tag during the window. It's on by default and can be turned off in Settings. It's always called a
rough estimate, and "Not a method of contraception" sits beside it. It disappears when cycles vary too much for dates to
mean anything, or while a period is late.

Reminders are local notifications: nothing leaves the phone. They arrive at 09:00 the day before a predicted period or
ovulation window, and at 20:00 on the last day of an ovulation window or the estimated last day of a period in progress.
The text is neutral unless someone turns on "Say what they're about", so a lock screen gives nothing away.

---

## 8. Characters

Flat figures placed straight on the canvas with no frames.

**Everything in [assets/art/](assets/art/) is a placeholder.** They are simple noodle people and props drawn for this
project, built from the app's palette, so each spot holds the right size and weight until the real art arrives. Nothing
in the repo comes from the reference site. To swap one, replace the file and update its ratio in
[art.ts](src/flow/art.ts).

Placement rules:

- Characters can overlap a card's edge or corner, never text or data.
- They are decorative and hidden from screen readers.
- Each gets a `drift` value, so it moves at its own speed. Negative feels closer than the cards.
- They never appear inside the ring, the calendar or charts, and never react to what's logged.

Two spots have no figure yet and show a dashed `Placeholder` with a brief: History's empty state and the top of How
predictions work.

---

## 9. Motion

| Moment | What happens |
| --- | --- |
| Tap a nav item | 760ms + 150ms per page, `bezier(0.62, 0.02, 0.16, 1)`: slow start, long soft landing |
| Swipe | The page follows the finger. A spring settles it, carrying the finger's speed. Rubber band at both ends. |
| Page content | Each section trails the pan by a different amount (`Drift`), so a page moves in layers |
| Launch | The ribbon draws itself around the disc over 1.5s |
| Sheet | Spring up, quick ease down |
| Press | Button shrinks 2.5%, its circle slides 5pt |

**Rules:** motion answers a person's action. Nothing loops. When everything has settled the ribbon loop snaps to rest
and stops redrawing, so an idle screen costs no battery.

**Reduce Motion:** pans land immediately, ribbons stop bending, the wrap and hops are simply drawn, and sections stop
drifting.

**Haptics:** a light tap when you log something and when you change page.

---

## 10. Where we depart from the style doc

| The doc says | We do | Why |
| --- | --- | --- |
| Stone Gray `#80827f` for muted text | Deep Stone `#60625e` | Stone is 3.4:1 on cream, below AA |
| Headlines at 140px | Largest is 72px | It's a phone. 53px stays the floor for page headings, as the doc asks. |
| Accents never functional | Coral marks period days, blue and lilac mark log categories | The app needs categories. They always come with a shape or a check mark, and none of them means success or error. |
| Primary CTA is a ghost pill | Yellow pill with a white circle | That's what the live site does, and the owner's reference shows it |
| No gradients | Fold shades on ribbons only | The depth illusion needs them, and the site uses them the same way |
| Nav at the top | Nav at the bottom | Thumb reach on a phone |
| Green circular menu button in the nav | Settings is a plain fourth tab | Owner's call: one word is clearer than an icon, and the blob and circle looked like two buttons |
| Light theme only | Night meadow too | Dark mode is required ([§13.2](MARKET_ANALYSIS.md)) |

---

## 11. Quick rules

- Text on a white surface, or in the disc. Never bare on the canvas.
- One primary button per page.
- Green is structure. Never text.
- Predictions are dashed, always. The ovulation estimate is dotted.
- No shadows. No sharp corners. No all-caps.
- New ribbon shapes go in `world.ts`. Keep knots off screen at rest (the test will tell you).
- React context doesn't reach inside a Skia `Canvas`: pass `colors` in as a prop.
- Reanimated only tracks shared values a worklet reads directly, not ones read inside a helper it calls.

---

## 12. Open questions for the owner

1. **Final art:** which characters replace the placeholders, and is the red panda still the main character?
2. **App name and icon:** both still undecided. The lock screen shows the app's name above every reminder, so neutral
   reminder text only stays discreet with a neutral name.
3. **Android:** built and checked on the iOS simulator and web only. Needs a pass on a real Android phone, especially
   how the ribbons perform on a mid-range device, and how the sheet and reminders behave.
4. **Ovulation estimate:** on by default is the owner's call, which changes [MARKET_ANALYSIS.md](MARKET_ANALYSIS.md). The
   legal check it asks for (§8.1) is still to do before launch.
