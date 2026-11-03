# Period Tracker App — Market & Competitive Analysis

> **Document type:** Market analysis + product scope definition
> **Version:** 1.1 — research snapshot taken on **1 November 2026**; owner decisions recorded the same day
> **Audience:** Project owner (go/no-go decision), developers, designer(s), whoever handles store/legal admin
> **Status:** Scope agreed — owner decisions and their consequences are recorded in [§18](#18-owner-decisions)

---

## How to use this document

| If you are… | Read first |
|---|---|
| The owner deciding whether and how to proceed | §1 Executive summary → §10 Feasibility & verdict → §18 Owner decisions |
| A developer estimating the work | §12 MVP scope & specs → §8 Rules that affect the build → §15 Admin checklist → §16 Timeline |
| A designer | §4.9 Competitor design analysis → §5 What users dislike → §13 Design direction |
| Handling marketing / launch | §4.10 Competitor marketing → §11 Positioning → §14 Go-to-market → §17 KPIs |

**Evidence labels used throughout**

- **[V] Verified** — read directly from a primary source during this research (store listing, Apple's official chart feed, official documentation).
- **[E] Estimate** — third-party model or vendor figure (analytics firms, market-research reports). Directionally useful, not audited.
- **[A] Assumption** — our own modelling or judgement. Flagged so it can be challenged.

References such as **[S5]** point to the numbered source list in [Appendix B](#appendix-b--sources).

---

## Table of contents

1. [Executive summary](#1-executive-summary)
2. [Research scope & methodology](#2-research-scope--methodology)
3. [Market overview](#3-market-overview)
4. [Competitive landscape](#4-competitive-landscape)
5. [Voice of the user — what people dislike (and love)](#5-voice-of-the-user--what-people-dislike-and-love)
6. [Gap analysis & opportunity scoring](#6-gap-analysis--opportunity-scoring)
7. [Pricing analysis — are competitors too pricey?](#7-pricing-analysis--are-competitors-too-pricey)
8. [Regulatory, privacy & store-policy landscape](#8-regulatory-privacy--store-policy-landscape)
9. [SWOT for a new entrant](#9-swot-for-a-new-entrant)
10. [Feasibility, financials & the honest verdict](#10-feasibility-financials--the-honest-verdict)
11. [Positioning & brand strategy](#11-positioning--brand-strategy)
12. [MVP scope definition (for developers)](#12-mvp-scope-definition-for-developers)
13. [Design direction](#13-design-direction)
14. [Go-to-market & marketing plan](#14-go-to-market--marketing-plan)
15. [Administrative & launch checklist](#15-administrative--launch-checklist)
16. [Timeline & cost estimate](#16-timeline--cost-estimate)
17. [KPIs, milestones & kill criteria](#17-kpis-milestones--kill-criteria)
18. [Owner decisions](#18-owner-decisions)
- [Appendix A — Raw data snapshot](#appendix-a--raw-data-snapshot-1-november-2026)
- [Appendix B — Sources](#appendix-b--sources)
- [Appendix C — Glossary](#appendix-c--glossary)

---

## 1. Executive summary

### 1.1 The verdict

**Conditional GO.** A period tracker is a sensible *first* app to publish **only if it is built lean, positioned sharply, and marketed persistently by the owner.**

A generic tracker — "another pink calendar with ovulation, pregnancy mode and articles" — is **not** a smart investment. That space is owned by apps with 100M+ installs, a market leader valued at over $1B, and free cycle tracking built into every iPhone.

Why a *conditional* yes is defensible:

- **The need is universal and permanent.** In the US, roughly one-third to one-half of women of reproductive age use a cycle-tracking app or website [S37][S39]. Predicting the next period is the #1 reason people use one [S40].
- **The market leaders are actively annoying their users.** The most-helpful recent reviews of Flo and Clue are about paywalls and upsell pop-ups. The biggest ad-supported tracker is criticised for unskippable video ads that play while people log their period (§5).
- **A simple tracker can be built with no server at all.** That keeps running costs near zero, makes the privacy promise true by design rather than by policy, and removes most of the legal burden of holding health data (§8, §12).

Why it is risky:

- **Distribution, not development, is the hard part.** Apps that already promise "private, no account, no ads" have very little traction: Lunavi has 5K+ Google Play installs; Euki has 162 US App Store ratings despite a perfect 10/10 privacy score from Mozilla [V][S67][S4][S27]. The newcomers that did break out (Stardust 2020, Lively 2023, Musa 2024) combined an emotional hook with heavy social-media marketing (§4.6).
- **Paid advertising does not pay back** at the prices this market accepts. A US App Store install in Health & Fitness costs about **$3.83**; the median app in the category earns about **$0.66 per install in its first 60 days** [E][S45][S43].
- **Most new subscription apps earn little.** Across categories, only about **17%** of new apps reach $1K of monthly revenue within two years, and fewer than **5%** reach $10K [E][S43].

**Realistic money expectation:** the base case is **a few thousand US dollars in year one** (scenarios in §10.3 range from roughly $400 to $50K). Year one should be treated as building a product, ratings, reputation and skills — not as an income.

### 1.2 Go conditions (all of them must hold)

| # | Condition | Why it matters |
|---|---|---|
| G1 | Cash cost to launch ≤ ~$3K if the owner builds it, or ≤ ~$10–15K if development is outsourced | Keeps break-even reachable in the base-case scenario (§10.4) |
| G2 | **No backend, no accounts** — all health data stays on the user's device | Zero server cost; the privacy claim becomes provable; minimal GDPR / FTC / state-law exposure |
| G3 | Differentiation is built into the product (§1.5), not only into the marketing | "Private" on its own is a crowded and weak hook |
| G4 | The owner commits ~4–6 hours/week to marketing for at least 6 months | Organic channels are the only economical growth path (§10, §14) |
| G5 | **No medical claims** — no contraception, no "helps you get pregnant", no diagnosis | Avoids medical-device regulation (EU MDR Class IIb, FDA) (§8.1) |
| G6 | Kill/pivot criteria agreed in advance for month 6 (§17) | Limits sunk cost |

### 1.3 The top 3 competitors per store (1 November 2026)

| Store | #1 | #2 | #3 | Basis |
|---|---|---|---|---|
| **Apple App Store** | **Flo** (FLO HEALTH UK LIMITED) | **Clue** (BioWink GmbH) | **Period Tracker Period Calendar** (ABISHKKING LIMITED) | US Health & Fitness charts, US rating volume, cross-checked in 9 more storefronts [V][S1–S4] |
| **Google Play** | **Period Calendar Period Tracker** (Simple Design Ltd.) | **Flo** (Flo Health Inc.) | **Clue** (BioWink) | Install bands, review counts, install estimates, Play search rank [V][S6][S8][S10–S12] |

The same three brands lead both stores. "Period Calendar" on Android (Simple Design Ltd.) and "Period Tracker Period Calendar" on iOS (ABISHKKING LIMITED) use the same headline claim ("trusted by 300 million"), the same signature features (themes and pets, partner mode, multiple profiles) and the same app-factory publishing style (both publishers also sell PDF readers and workout apps). This document therefore treats them as **one competitor archetype: the ad-supported mass-market utility.** Their corporate relationship is not publicly documented.

Honourable mentions: **Stardust** (#4 period app in the US free chart), **Natural Cycles** (#3 period-related app by US grossing — but a regulated birth-control device, a different product category), **Lively** (the fastest-rising newcomer, top-100 grossing in 8 of 10 storefronts checked) and **Apple Health Cycle Tracking** (free and built in).

### 1.4 Key findings

1. **Revenue is extremely concentrated.** Flo reports ~80M monthly active users (Aug 2026, company-reported) and is estimated at $7–8M per month in store revenue [E][S22][S24]. Clue is estimated at ~$1.3M per month [E][S24]. Stardust (~$400K/month) and Lively (~$300–450K/month) follow [E][S24][S25]. Everyone else shares what is left.
2. **Premium prices cluster around $40 per year.** Flo $39.99–59.99/yr, Clue $39.99/yr, and even the "free" ad-supported leader sells $39.99–49.99/yr plus a $2.99 ad removal [V][S14–S16]. RevenueCat's Health & Fitness median annual price is ≈ $39.94 [E][S43].
3. **Users mostly object to the pressure, not the price.** Basics moved behind paywalls, upsell pop-ups after every action, insights shown and then locked, purchase flows without a clear exit, and ads in the middle of logging (§5).
4. **Free substitutes are strong.** Apple Health Cycle Tracking is built in (predictions, cycle-deviation alerts, temperature-based ovulation estimates with Apple Watch) [V][S48]. *My Cycle*, made by a single developer, is 100% free — no in-app purchases, no ads — and has 104K US ratings [V][S66].
5. **Privacy matters but rarely drives switching on its own.** People are worried (post-Dobbs, the Flo litigation, Mozilla reviews), yet in one study only ~9% had taken any protective action, and overall app use *rose* after Dobbs [S37][S38].
6. **There are real unmet needs:** honest predictions for irregular cycles; life events (pregnancy, birth, pregnancy loss, starting/stopping contraception) that currently corrupt predictions; discreet notifications and icons; calm, non-stereotyped design; painless backup when changing phones; and lightweight apps (the three leaders are 307–348 MB on iOS) (§5, §6).
7. **Regulation is manageable** for a tracker that makes no medical claims and keeps data on the device. Store administration has specific traps for first-time publishers: Google's 12-tester rule, health declarations, a public address for monetised Google Play apps, EU trader status, and Apple's rule against storing health data in iCloud (§8, §15).

### 1.5 Recommended positioning

> **"The calm period tracker. No account. No ads. No nagging. The basics are free forever — and your data never leaves your phone."**

Three brand pillars:

- **Calm** — no pop-ups, no push marketing, no content feed, neutral and quiet design.
- **Honest** — predictions shown as ranges ("likely 3–6 March"), clear about uncertainty, no dark patterns, prices shown once and plainly.
- **Private** — local-only data, "Data Not Collected" store labels, no third-party SDKs, verifiable by anyone.

Signature features that make the positioning demonstrable (and filmable for short-form video):

- **Life events** — tell the app about pregnancy, birth, pregnancy loss, or starting/stopping hormonal contraception, and predictions stay accurate instead of breaking.
- **Discreet mode** — neutral notification text by default, alternate neutral app icons, app lock.
- **Honest prediction ranges** — a window, not a falsely precise single date, with a plain explanation of why.
- **Supplies reminder** — "restock pads/tampons/cup in 3 days".

### 1.6 Recommended v1.0 scope (summary — the full spec is in §12)

**In v1.0:** onboarding without sign-up · Today view and calendar · log period start/end and daily flow · symptoms, mood and notes (customisable list) · prediction engine with ranges · local reminders (period due, late check-in, supplies, daily log) with discreet text · app lock · life events · history and simple stats · export/import and "delete all data" · light/dark themes · accessibility · optional fertile-window estimate (off by default, enabled only after a legal check) · one optional "Plus" one-time purchase + tip jar.

**Out of v1.0:** accounts and cloud sync, partner sharing, community, articles, AI chat, pregnancy and trying-to-conceive modes, any contraception claim, ads.

### 1.7 Monetisation (decided)

**Free core forever + one optional "Plus" one-time purchase** (suggested $14.99, with a $9.99 launch offer and regional price tiers) for comfort features: widgets, extra themes and icons, advanced statistics, a PDF report for doctor visits — **plus an optional tip jar** ($1.99 / $4.99 / $9.99) as the very cheap way to support the app. **No ads (decided — §18), no weekly plans, no paywall during onboarding.** Re-evaluate a low annual tier only if features with ongoing costs are added later. Reasoning and maths are in §7 and §10.

### 1.8 Owner decisions at a glance (1 Nov 2026)

| Topic | Decision |
|---|---|
| Base | An EU country (exact country still to confirm) |
| Who builds | The owner, personally |
| Developer account | Individual — Google's 12-tester test applies and contact details become public (§18.2) |
| Platforms | iOS and Android at launch, one cross-platform codebase |
| Languages | English only at launch (app stays localisation-ready) |
| Money | Free core + one-time Plus + optional tip jar; **no ads** |
| Fertile window | Built, **off by default**, enabled only after a legal check |
| Marketing | Owner creates the content, **faceless** format |
| Name | To be decided — before store accounts, icon and screenshots |
| Teens | No teen-specific focus in v1; standard age rating |
| Openness | Public privacy-architecture page; consider open-sourcing the prediction engine later |

Full rationale and consequences: §18.

---

## 2. Research scope & methodology

**Research date.** All chart positions, ratings and listing details were captured on **1 November 2026** unless stated otherwise. Store data changes daily.

**Sources used** (full list in Appendix B):

1. **Apple's official chart feeds** (iTunes RSS): Health & Fitness *Top Free* and *Top Grossing* (top 100) for 10 storefronts — US, GB, DE, FR, BR, IN, AU, CA, HR, RS [S1–S3].
2. **Apple's iTunes Search API**: rating counts, averages and release dates for 28 period apps in the US store, plus targeted searches for privacy-first, perimenopause and teen apps [S4].
3. **Live store listings** read directly on both stores: feature lists, privacy labels / data-safety sections, app sizes, languages, most-helpful reviews [S5–S11][S63–S69].
4. **Price trackers** (App Pricing Lab) for in-app purchase price points, because Apple's web listing no longer shows full price tables [S14–S19].
5. **Analytics estimates** (AppBrain, Screensdesign, Adapty, Similarweb/Dealroom ranges) for installs and revenue — always labelled [E].
6. **Industry benchmarks**: RevenueCat *State of Subscription Apps 2026* [S43], Adapty [S44], AppTweak Apple Ads benchmarks [S45].
7. **Independent privacy testing**: Mozilla Foundation's July 2026 review of six period trackers [S26][S27].
8. **Academic studies** on usage, design expectations and cycle physiology [S37–S42].
9. **Regulation and store policy**: Apple and Google developer documentation, FDA guidance, EU MDR guidance, US state-law summaries [S46–S59].

**How the "top 3" were chosen**

- *App Store:* position in the US Health & Fitness Top Free chart; US rating volume (a proxy for cumulative downloads); Top Grossing position; consistency across 9 more storefronts.
- *Google Play:* Google no longer publishes charts on the web, so we used public install bands (100M+, 50M+…), review counts, AppBrain install estimates and ranking in Play search for "period tracker".

**Limitations**

- Charts are daily snapshots and positions move.
- Revenue figures are third-party models, not company disclosures.
- Prices vary by country and are A/B-tested (Flo shows nine different price points [S14]).
- Review analysis is qualitative (most-helpful and recent reviews on both stores), not a full statistical scrape.
- No paid intelligence tools (Sensor Tower, AppTweak, data.ai) were used. Buying one month of such a tool before launch would sharpen keyword-volume and download estimates.

---

## 3. Market overview

### 3.1 Market size

| Source | 2025 market size | Growth (CAGR) | Horizon |
|---|---|---|---|
| Mordor Intelligence [S33] | $1.46B (2026: $1.60B) | 9.5% | → $2.52B by 2031 |
| Research and Markets [S36] | $2.0B | 18.0% | to 2033 |
| Fortune Business Insights [S34] | $2.08B | 20.5% | 2026–2034 |
| Towards Healthcare [S35] | $2.07B | 20.3% | 2026–2035 |

All figures [E]. North America accounts for roughly 42–46% of revenue [S33][S35].

**Interpretation [A]:** this is a real, growing market of about $1.5–2B per year, growing 10–20% annually. But it is heavily concentrated — Flo alone plausibly takes ~10% of the whole market. For a new independent app, market size is not the constraint; **reachable users and conversion are.**

### 3.2 Who uses period trackers, and why

- **Prevalence.** In five US states, more than one-third of women aged 18–44 used a cycle-tracking app or website before the 2022 Dobbs decision; afterwards it was almost half (Neiman et al., *Contraception*, 2025; roughly 2,000–2,500 respondents per state per survey wave) [S37]. A 2022 KFF figure put lifetime use of period-tracking apps at nearly one in three US women [S39].
- **The core job.** In a 2024 study of 700 women aged 20–39, 62.3% used a tracker, **mainly to predict their next period** [S40].
- **What users want (the classic study).** A University of Washington study (687 survey respondents plus 2,000 app reviews) found that people want accuracy — especially with irregular cycles — the ability to correct predictions and record reasons for changes (stress, a contraception change), customisation, discreet design, data export, and fewer assumptions about gender, partners and fertility goals. Many participants disliked "pink and flowery" designs [S41].
- **Physiology that matters for the product.** In 612,613 real-world cycles, the average cycle was 29.3 days and only 13% of cycles were exactly 28 days long; the luteal phase averaged 12.4 days (not the textbook 14), and average cycle length shortened slightly with age (Bull et al., *npj Digital Medicine*, 2019 — study funded by Natural Cycles) [S42]. Predictions must therefore be personal and shown with uncertainty.

**User segments [A]:**

| Segment | Core need | Served well today? | Priority for v1 |
|---|---|---|---|
| "Just tell me when" trackers (approx. 16–45) | Fast logging, accurate dates, reminders | Yes — but with nags, paywalls or ads | **Primary** |
| Irregular cycles (PCOS, post-pill, postpartum, stress) | Honest ranges, no false alarms, life events | Partly | **Primary** |
| Privacy-conscious users (US post-Dobbs, EU) | No cloud, no tracking, verifiable | Only by small, little-known apps | **Primary (positioning)** |
| People on hormonal contraception | Pill / ring / patch reminders | Yes, by many apps | v1.1 |
| Teens and first periods (often with a parent) | Simple, friendly, free, safe | Some niche apps | Later |
| Trying to conceive (TTC) | Fertile window, temperature, ovulation tests | Yes, heavily (Flo, Clue, Premom, Natural Cycles) | **Out of scope** |
| Pregnant / postpartum | Week-by-week content | Yes, heavily | Out of scope (handled as a life event only) |
| Perimenopause (approx. 40–55) | Symptom tracking, increasingly irregular cycles | Growing fast (Flo, Clue, Lively, Balance, Caria…) | Later / pivot option (§10.6) |
| Trans and non-binary people who menstruate | Neutral language and design | Rarely | Covered by design principles (§13) |

### 3.3 Platforms and geography

- **Android brings installs; iOS brings revenue.** The single most-installed tracker is an ad-supported Android app (est. ~220M downloads, ~1.2M in the last 30 days) [E][S12]. In Western markets, most subscription revenue comes from iOS [A].
- **Chart positions** — Apple App Store, Health & Fitness category, 1 November 2026 [V][S1–S3]. Format: *Top Free rank / Top Grossing rank*; "–" means not in the top 100.

| Storefront | Flo | Clue | Period Tracker (ABISHKKING) | Other period apps in the top 100 |
|---|---|---|---|---|
| United States | **#2 / #5** | #39 / #26 | #35 / – | Stardust #42/#68 · Lively #86/#44 · Natural Cycles –/#31 · Premom –/#43 |
| United Kingdom | #4 / #3 | #59 / #20 | #86 / – | Lively #71/#48 · Stardust #88/#43 · Premom –/#41 · Natural Cycles –/#42 |
| Germany | #8 / #4 | #37 / #14 | #36 / #99 | Lively #44/#28 · SimpleInnovation #87/#72 · Natural Cycles –/#67 |
| France | #5 / #3 | #36 / #24 | #38 / – | Lively #88/#55 · SimpleInnovation #84/– |
| Brazil | #4 / #2 | #25 / #21 | #20 / #24 | Lively #89/– · Natural Cycles –/#60 |
| India | #14 / #4 | #23 / #70 | #44 / – | Premom #72/– |
| Australia | #4 / #4 | #23 / #19 | – | Stardust #33/#23 · Lively #74/#32 · My Cycle #82/– |
| Canada | #4 / #4 | #15 / #28 | #76 / – | Premom #56/#32 · Stardust #66/#35 · Lively #72/#48 · My Cycle #89/– |
| Croatia | #4 / #4 | #78 / – | **#3 / #6** | Lively #19/#14 · Clover #42/#42 · My Cycle #70/– |
| Serbia | #3 / #2 | #77 / #79 | **#1** / #32 | Lively #25/#87 · My Cycle #31/– · Clover #87/#59 |

**What the charts tell us [A]:**

- Flo leads everywhere, for both downloads and revenue.
- Clue is a solid #2 in Western, higher-income markets, but weak in Central/Eastern Europe.
- The ad-supported utility (ABISHKKING / Simple Design) dominates downloads in price-sensitive markets (Serbia #1, Croatia #3, Brazil #20) — users there choose "free with ads" over subscriptions.
- **Lively**, launched only in June 2023, is already in the top-100 grossing in 8 of 10 storefronts — proof that a newcomer *can* break in with a strong hook and marketing.
- Smaller, non-English markets are less contested: a local-language app with local press can reach the top of a national chart with far fewer downloads than in the US [A].

### 3.4 Key trends, 2024–2026

1. **Paywall creep.** Flo and Clue have moved previously free features into premium tiers; the companies' own review replies acknowledge it (§5) [V][S5–S8].
2. **Privacy scrutiny and litigation.** FTC order against Flo (2021); Flo class action — Google, Flo and Flurry settled for a combined $59.5M, and a jury found Meta liable in August 2025 [S28–S32]. Mozilla re-tested trackers in July 2026, scoring them from 2/10 to 10/10 [S27]. US state consumer-health laws such as Washington's My Health My Data Act now apply to period apps [S58].
3. **Life-stage expansion.** Perimenopause is the new battleground: Flo's "Perimenopause Score" and "Menopause Timeline", Clue's perimenopause mode, Lively's perimenopause update, plus dedicated apps [V][S5][S7][S63].
4. **Wearables.** Apple Watch wrist temperature, Oura, WHOOP, Fitbit and Withings integrations (Clue, Stardust, Natural Cycles) [V][S7][S65].
5. **AI assistants.** Flo's 24/7 "Health Assistant" (Premium), Stardust's AI, Musa's "AI goddess" avatar. User reception is mixed — one of Flo's most-helpful reviews asks to switch off the bot [V][S6].
6. **Cycle syncing and lifestyle content.** Nutrition/exercise/self-care advice by cycle phase, driven by social media (Lively, Musa, Stardust) [V][S63–S65].
7. **Gamification and companions.** Musa's dragon; Period Calendar's pets and themes [V][S9][S64].
8. **App bloat.** Flo 347.7 MB, Clue 334.2 MB, ABISHKKING 307.3 MB on iOS — versus *My Cycle* at 44.6 MB [V].
9. **Medical-claim transparency.** Apple requires a "regulated medical device" declaration for health apps (from March 2026) [S47]; the FDA revised its general-wellness guidance in January 2026 [S55]; EU authorities treat contraception apps as Class IIb devices [S56].
10. **A flood of new small entrants.** At least six new period trackers launched in the US store between December 2025 and September 2026, most with almost no ratings [V][S4] — discoverability keeps getting harder.

---

## 4. Competitive landscape

### 4.1 Top 3 — Apple App Store (US)

| Rank | App | Publisher | Released | US H&F Top Free | US H&F Top Grossing | US ratings | Avg. rating | iOS size |
|---|---|---|---|---|---|---|---|---|
| 1 | **Flo Cycle & Period Tracker** | FLO HEALTH UK LIMITED | Oct 2015 | #2 | #5 | 2,011,046 | 4.74 | 347.7 MB |
| 2 | **Clue Period & Cycle Tracker** | BioWink GmbH | Jul 2013 | #39 | #26 | 406,898 | 4.76 | 334.2 MB |
| 3 | **Period Tracker Period Calendar** | ABISHKKING LIMITED | Sep 2014 | #35 | – | 174,779 | 4.92 | 307.3 MB |
| (4) | Stardust Period Tracker | Stardust App LLC | Jan 2020 | #42 | #68 | 120,204 | 4.76 | 229.2 MB |

All [V] [S1][S2][S4][S5][S7][S9][S65]. Clue ranks #3 by downloads in the US but #2 by ratings and revenue; ABISHKKING ranks higher by downloads in many non-US storefronts.

### 4.2 Top 3 — Google Play

| Rank | App | Developer | Installs | Reviews | Avg. rating | Ads | In-app purchases |
|---|---|---|---|---|---|---|---|
| 1 | **Period Calendar Period Tracker** | Simple Design Ltd. | 100M+ (est. ~220M total; ~1.2M / 30 days [E][S12]) | 4.9M | 4.9 | **Yes** | Yes |
| 2 | **Flo Ovulation & Period Tracker** | Flo Health Inc. | 100M+ | 5.17M | 4.7 | No third-party ads | Yes — #7 top grossing in Health & Fitness |
| 3 | **Clue: Period & Cycle Tracker** | Clue Period Tracker by BioWink | 50M+ | 1.51M | 4.5 | No | Yes |

All [V] unless marked [S6][S8][S10][S11]. The next tier, each with 10M+ installs: *Period Tracker and Calendar* (SimpleInnovation; 559,748 ratings; est. ~32M downloads [E][S13]), *Ovulation & Period Tracker* (Leap Fitness Group; 456,121), *Period Tracker* (GP International; 357,594), *Clover* (Wachanga; 314,987), *MeetYou* (202,138) and *Period and Ovulation Tracker* (SMSROBOT; 177,698) — all but MeetYou carry ads [V][S11].

### 4.3 Competitor profile — Flo

| Attribute | Detail |
|---|---|
| Company | Flo Health; iOS seller FLO HEALTH UK LIMITED; launched 2015 [V] |
| Funding | $200M round led by General Atlantic at a valuation above $1B (July 2024) [S21] |
| Scale | 570M+ downloads worldwide (July 2026, store listing) [V]; ~80M monthly active users (Aug 2026, company-reported via press) [E][S22]; 70M MAU and ~5M paying users in 2024 [S21] |
| Revenue | Not disclosed. Store revenue est. $7–8M per month [E][S24]; company-level estimates cluster around $100–230M per year (e.g., Business of Apps ~$200M for 2023; Similarweb $100–200M) [E][S23] |
| Store stats | iOS: 2.01M US ratings, 4.7★, #2 free / #5 grossing (US H&F). Google Play: 100M+ installs, 5.17M reviews, 4.7★, #7 top grossing in H&F [V] |
| Platforms | iPhone, Apple Watch, Android, Wear OS; 21 languages; iOS 17+ [V] |
| Positioning | "Science-backed" all-in-one women's-health companion for every life stage — periods, trying to conceive, pregnancy, perimenopause [V] |
| Free tier | Period and ovulation predictions; 70+ symptoms and moods; irregular-cycle support; downloadable cycle report for doctors; temperature, ovulation-test and discharge logging; Pregnancy Mode; Anonymous Mode [V][S5][S6] |
| Premium | Daily tailored insights and expert videos; in-depth pregnancy features; Symptom Checker for PCOS, endometriosis and fibroids (not available in the UK/EU); fertility insights; 24/7 virtual "Health Assistant"; Secret Chats community; "Flori" well-being battery; Flo for Partners (listed as Premium on Google Play) [V][S5][S6] |
| Pricing | Monthly and yearly plans with free trials; discounts pushed via in-app stories, push notifications and email; web checkout at flo.health [V][S20]. Nine US price points seen: $1.99, $7.49, $11.49, $14.99 (×2), $43.99, $47.99, $49.99, $59.99 [V][S14]. **Practical range: ~$7.49–14.99 per month, ~$40–60 per year.** Eligible for US HSA/FSA health accounts [V][S5] |
| Privacy | Claims dual ISO 27001 / ISO 27701 certification and a 2025 privacy award [V]. Apple label — *data used to track you*: purchases, location, identifiers, usage data [V][S5]. Google data-safety: "no data shared with third parties" [V][S6]. Mozilla 2026: **7/10** — ad/analytics sharing is optional, but an attribution SDK was contacted at first launch and received a device identifier even after tracking was declined [S27]. History: 2021 FTC order over sharing health data with Facebook, Google and others [S32]; class action settled by Flo for $8M (part of $59.5M); Meta found liable by a jury in August 2025 [S28–S31] |
| Marketing | Large creator/UGC programme on TikTok, Meta and Snap (dedicated job roles) [S61]; agency-run TikTok Spark Ads campaign reported at ~10.5M views (agency claim) [E][S61]; privacy credentials as PR; partner feature as a growth loop; 21 localised store listings; web checkout; HSA/FSA eligibility [V] |
| Users love | Accuracy and adaptation to changes; breadth of tracking; partner sharing; early nudges to talk to a doctor (e.g., about PCOS) [V][S5][S6] |
| Users dislike | Features moved out of the free plan; constant premium prompts; a purchase flow that is hard to exit; insights and chatbot answers locked behind the paywall; generic chatbot content; no custom symptoms; login/account confusion [V][S5][S6] |
| Threat to us | **High** for mindshare and search visibility; **low** for our niche — Flo's business model depends on subscriptions and attribution tracking, so it is unlikely to become "calm, local-only, free basics" |

### 4.4 Competitor profile — Clue

| Attribute | Detail |
|---|---|
| Company | BioWink GmbH, Berlin; app launched July 2013 [V]. Cut ~25% of staff in January 2023 to prioritise profitability [S60]. Strategic investment from Verdane reported in early 2026; a 2026 UK partnership with Evaro for in-app prescriptions reported [E][S60] |
| Scale | "Over 100M people" (company claim) [V]; Google Play 50M+ installs, 1.51M reviews, 4.5★; iOS 406,898 US ratings, 4.8★; #39 free / #26 grossing (US H&F); #14 grossing in Germany [V] |
| Revenue | Est. ~$1.3M per month in store revenue [E][S24] |
| Platforms | iPhone (iOS 18+), Android; 27 languages. The App Store lists Clue as a **regulated medical device** [V][S7] |
| Positioning | "#1 women-led" tracker — science-backed, privacy-first, protected by EU law (GDPR) [V] |
| Features | 200+ trackable factors; 300–400+ expert articles; modes for periods, trying to conceive, pregnancy and perimenopause; birth-control logging and pill reminders; phase-change alerts; a "clinically validated" fertile-window algorithm marketed for conception; wearable sync (Apple Watch, Oura, WHOOP, Withings, Fitbit); option to hide unusual cycles from averages; custom app icons; declared accessibility support (VoiceOver, Voice Control, Larger Text, Dark Interface, Reduced Motion, Captions) [V][S7][S8] |
| Pricing (Clue Plus) | $9.99 per month; $39.99 per year (seen discounted to $29.99) [V][S15] |
| Privacy | Mozilla 2026: **8/10** — analytics kept in-house, sensitive data withheld from its marketing tool, consents editable later [S27]. Apple label — *data used to track you*: identifiers [V][S7]. Google data-safety declares that personal info, health & fitness and two other data types may be shared with third parties [V][S8] |
| Marketing | Editorial and science-led brand; large article library; women-led and EU-privacy positioning; wearable partnerships; weekly app releases (version 300.0 at time of research) [V] |
| Users love | Scientific credibility; customisation; design that isn't stereotypically feminine; custom app icons; ability to exclude cycles from predictions [V][S7] |
| Users dislike | Clue Plus prompts after almost every action; at least two promotions per session; complaints that nearly everything is paywalled; a past redesign that removed loved features (choosing which categories to track, birth-control tracking); sluggishness; **no way to log a birth or pregnancy loss, so predictions stay wrong for months afterwards** (support's workaround is to hide the cycle manually) [V][S7][S8] |
| Threat to us | **Medium.** Closest to our tone and values, but its subscription pressure is the opening we exploit |

### 4.5 Competitor profile — Period Calendar (Simple Design Ltd. on Android / ABISHKKING LIMITED on iOS)

| Attribute | Detail |
|---|---|
| Publisher | App-factory portfolios: the same developer accounts publish notepads, PDF readers, auto-clickers, volume boosters and home-workout apps [V][S9][S10] |
| Scale | Android: 100M+ installs (est. ~220M), 4.9M reviews, 4.9★, "popular in 63 countries" [V][E][S10][S12]. iOS: 174,779 US ratings, 4.9★, #35 US free; **#1 in Serbia, #3 in Croatia, #20 in Brazil** (free) [V]. Both claim "300 million users" |
| Platforms | iPhone (iOS 15+), Apple Watch, Android, Wear OS; 39 languages (description) / 51 (listing metadata) [V] |
| Business model | **Ads + subscription.** Mozilla observed Google AdMob/DoubleClick and InMobi ad SDKs [S27]. iOS price points: weekly $0.99–1.49, monthly $9.99, yearly $39.99–49.99, "Remove the Ads" $2.99 [V][S16] |
| Free features | Period, ovulation and pregnancy modes; partner mode; birth-control reminders (pill, ring, patch, injection, IUD, implant) with **customisable discreet notification text**; medication reminders; 58 symptoms and 67 moods; temperature, cervical mucus, ovulation- and pregnancy-test logs; due-date countdown; exportable health report with charts; PIN / Face ID / fingerprint lock; weight, water, sleep, sex and step tracking; breast self-exam guide; multiple profiles (e.g., mother and daughter); unlimited themes and virtual pets; Apple Health sync; backup and restore [V][S9][S10] |
| Premium | Monthly trend analysis, daily fertility insights, symptom insights, self-care courses, Kegel exercises, extended pregnancy support [V][S9] |
| Privacy | Listings claim no account is needed and that data stays on the device / is never collected [V]. But the Apple label lists identifiers and usage data as *used to track you*, and health & fitness, contact info, identifiers, usage data and sensitive info as *linked to you* [V][S9]. Mozilla 2026: **6/10** — the only ad-supported app tested; ad networks received device details and the app's identity, though no cycle data was observed going to advertisers; no in-app privacy controls [S27] |
| Regulatory red flag | The Android listing describes the app as a birth-control app [V][S10] — the kind of claim that makes software a medical device in the EU (§8.1). **We must never copy this wording** |
| Marketing | Large-scale store optimisation (keyword-dense descriptions in dozens of languages), huge rating volume, in-store seasonal events (e.g., a Breast Cancer Awareness Month event), likely ad-funded user acquisition and cross-promotion across the portfolio [V][A] |
| Users love | Everything being free; accuracy; cute pets and themes; partner mode [V][S9][S10] |
| Users dislike | **Unskippable video ads (often for games) that play while logging a period**; the developer's reply promises to reduce ad frequency and duration [V][S9] |
| Threat to us | **High** in price-sensitive markets: they give almost everything away. Our counter: no ads ever, calm design, and privacy claims that hold up to testing |

### 4.6 Other notable competitors

| App | Positioning | Scale (US iOS ratings · Android installs) | Model / price | Why it matters |
|---|---|---|---|---|
| **Apple Health — Cycle Tracking** | Built into every iPhone | All iPhones | Free | Period and fertile-window predictions, cycle-deviation alerts (irregular, infrequent or prolonged periods, persistent spotting), "cycle factors" (pregnancy, lactation, contraception), temperature-based ovulation estimates with Apple Watch Series 8+/Ultra; explicitly not birth control [V][S48]. **On iPhone this is the real "free and private" benchmark** — our app must be clearly nicer and easier to use. Samsung Health and Fitbit/Google offer similar built-in tracking on Android [A] |
| **Stardust** | Astrology and moon phases, friends sharing, Gen Z | 120,204 · 1M+ | $6.99/mo; $24.99–39.99/yr | #42 free / #68 grossing in the US; est. ~$400K/mo [E]. **Mozilla 2/10** — symptoms and reproductive details sent to analytics/attribution firms despite a "your data is private" slogan [S27][S62] |
| **Lively** | "Cycle syncing" (nutrition, exercise, self-care per phase), aesthetic design, partner syncing, perimenopause | 55,446 · 500K+ | $2.99/wk; $4.99/mo; $18.99–39.99/yr | Launched June 2023; top-100 grossing in 8 of 10 storefronts; est. $300–450K/mo and ~70K downloads/mo [E][S25] — the clearest recent breakout |
| **Musa** | Gamified self-care dragon, "hormone-scope", AI avatar, cycle syncing | 11,957 · 1M+ | Subscription | Launched July 2024; reviews mention discovering it through Instagram ads [V][S64] |
| **Natural Cycles** | FDA-cleared, CE-marked digital birth control (regulated medical device) | 30,331 · 1M+ | $149.99–194.99/yr; $21.99–28.49/mo (iOS); NC° Band $129.99 or free with an annual plan | #31 US grossing. Shows the price people pay for a *regulated* contraception claim — out of our scope [V][S19][S73] |
| **My Cycle** (indie) | Completely free — no purchases, no subscriptions, no ads | 103,768 · – | Free | One developer; 33 languages; 44.6 MB; gained users when Clue's redesign upset people; reviews complain the iCloud restore wording is confusing. Proof that *simple and free* can win scale — but it does not make money directly (the developer also publishes baby and pregnancy apps) [V][S66] |
| **Euki** | Non-profit, open source, local-only, PIN + decoy screen | 162 · – | Free | **Mozilla 10/10**, yet tiny reach [V][S26][S68] |
| **drip** | Open source (Heart of Code e.V.) | 59 · – | Free | Tiny reach [V][S69] |
| **Lunavi** | 100% offline, no account, discreet mode, panic wipe, no "pink stereotypes" | – · 5K+ (122 reviews) | Free + in-app purchases | Almost exactly the "privacy-first" positioning — and still tiny. Google label: "no data collected" [V][S67] |
| Clover (Wachanga) | Mainstream tracker | 23,648 · 10M+ | Ads + purchases | Top-100 in Croatia and Serbia [V] |
| Ovulation & Period Tracker (Leap Fitness) | Mainstream tracker | – · 10M+ | Ads + purchases | App-factory publisher [V] |
| Period Tracker by GP Apps | One of the oldest (2009) | 78,994 · 10M+ | Ads + purchases | [V] |
| Premom | Ovulation-test reading for trying to conceive | 60,821 · – | Purchases | #43 US grossing [V] |
| Spot On (Planned Parenthood) | Birth-control focus | 15,398 · – | Free | Mozilla 5/10 [S27] |
| Perimenopause specialists | Balance (1,155), Caria (1,430), Health & Her (956), Menelle (196, launched Jan 2026) | small | Subscriptions | Growing niche (§10.6) [V] |
| Teen-focused | Pinkllama (19,232), Luna Teen (2,513), Magicgirl (1,760), Soso (814, launched Jan 2026) | small | Mixed | Niche (§10.6) [V] |
| 2026 newcomers | Melda (495 ratings, Apr 2026), Bloomra (5, May 2026), Emberly (1, Aug 2026), Luna: Private (2, Sep 2026), LunaSafe (1, Dec 2025), Private Period Tracker (0, Jan 2026) | near zero | – | Shows how hard discovery is for a new, undifferentiated app [V][S4] |

**Two patterns worth internalising [A]:**

1. **Breakout newcomers led with an emotional or identity hook, not with privacy** — astrology and friends (Stardust), aesthetic "cycle syncing" (Lively), a gamified companion (Musa) — and all invested in social media (and very likely paid acquisition).
2. **Privacy-only apps stay small.** Euki, drip, Lunavi and the 2026 "private tracker" launches have hundreds to low thousands of users. The one indie that reached real scale, *My Cycle*, won on **"simple and completely free"** plus years of store optimisation in 33 languages.

➡️ **Implication:** our product must combine *free, simple basics* (proven by My Cycle), *real privacy* (trust and PR) and a *distinctive, likeable brand with a repeatable content angle* (proven by Lively and Musa) — without depending on paid ads.

### 4.7 Feature comparison matrix

Legend: ✓ = offered · ✗ = not offered · "n/a" = not advertised / not verifiable from public sources.

| Feature | Flo | Clue | Period Calendar | Apple Health | My Cycle | Lunavi | **Our v1.0** |
|---|---|---|---|---|---|---|---|
| Period prediction | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ **with a range** |
| Fertile window / ovulation estimate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Optional, **off by default** (pending legal check) |
| Period reminders | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Discreet / custom notification text | n/a | n/a | ✓ | ✗ | n/a | ✓ | ✓ **by default** |
| Birth-control / pill reminders | ✓ (separate product, may need subscription) | ✓ | ✓ (6 methods) | Via Medications feature | n/a | n/a | v1.1 |
| Symptoms & moods | 70+ | 200+ | 58 + 67 moods | Basic list | Notes | 40+ | ~25 defaults + custom, hide/show |
| Works without an account | Anonymous Mode | n/a | ✓ | ✓ (Apple ID) | ✓ | ✓ | ✓ |
| Third-party ads | ✗ (self-promotion) | ✗ (self-promotion) | **✓** | ✗ | ✗ | ✗ | ✗ **never** |
| Upsell pressure on free users (from reviews) | High | High | Ads + premium | None | None | Low | **None** — one quiet optional unlock |
| Apple label: data used to track you | Purchases, location, identifiers, usage | Identifiers | Identifiers, usage | – | None | – (Google: no data collected) | **None — target "Data Not Collected"** |
| Mozilla 2026 privacy score | 7/10 | 8/10 | 6/10 | – | – | – | Design to Euki-level practices |
| App lock (PIN / biometrics) | ✓ | n/a | ✓ | Device lock only | n/a | ✓ + panic wipe | ✓ |
| Doctor report / data export | Cycle report | In-app health record | Report with charts | Health data export | n/a | Export/import | Export/import ✓; PDF report in Plus (v1.1) |
| Backup when changing phones | Cloud account | Cloud account | Google account / email / file | iCloud (Health) | iCloud (confusing restore) | Manual file | OS backup + file export, **with very clear wording** |
| Life events (pregnancy, birth, loss, contraception changes) | Pregnancy mode | Modes + manual hiding; no birth/loss logging | Pregnancy mode | Cycle factors | ✗ | ✗ | ✓ **core differentiator** |
| Irregular-cycle handling | Claimed | Claimed | Claimed | Deviation alerts | Basic | Adaptive | ✓ ranges + plain-language explanation |
| Other modes | TTC, pregnancy, perimenopause | TTC, pregnancy, perimenopause | Pregnancy | – | – | TTC, simple | None in v1 |
| Wearables | Apple Watch, Wear OS | Apple Watch, Oura, WHOOP, Withings, Fitbit | Apple Watch, Wear OS | Apple Watch | ✗ | ✗ | ✗ (Health sync in v1.1) |
| Partner sharing | ✓ | n/a | ✓ | ✗ | ✗ | ✗ | ✗ (needs a backend) |
| Articles / content library | Large | 300–400+ | Tips & courses | Some | ✗ | Phase guidance | ✗ |
| AI chatbot | ✓ (Premium) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Personalisation | – | Custom icons | Themes & pets | – | – | 5 themes | Themes + alternate icons |
| Languages | 21 | 27 | 39–51 | Many | 33 | n/a | 1–6 at launch |
| iOS download size | 347.7 MB | 334.2 MB | 307.3 MB | Built in | 44.6 MB | n/a | **Target < 40 MB** |
| Premium price | ~$40–60/yr | $39.99/yr | $39.99–49.99/yr + $2.99 ad removal | Free | Free | Free + purchases | **Free + ~$14.99 one-time** |

Sources: [S5–S10][S14–S16][S26][S27][S48][S66][S67].

### 4.8 Pricing comparison (US, 2026)

| App | Model | Weekly | Monthly | Yearly | One-time | Notes |
|---|---|---|---|---|---|---|
| Flo | Freemium subscription (+ web checkout) | $1.99 point seen | $7.49–14.99 | $39.99–59.99 | – | Free trials, heavy price testing, HSA/FSA eligible [S14][S20] |
| Clue | Freemium subscription | – | $9.99 | $39.99 (promo $29.99) | – | [S15] |
| Period Calendar (iOS) | Ads + subscription | $0.99–1.49 | $9.99 | $39.99–49.99 | Ad removal $2.99 | [S16] |
| Stardust | Freemium subscription | ("All Access" $2.99–4.99) | $6.99 | $24.99–39.99 | – | 7-day or 1-month trials [S17] |
| Lively | Freemium subscription | $2.99 | $4.99 | $18.99–39.99 | ($49.99 item, unlabelled) | [S18] |
| Natural Cycles | Paid regulated device | – | $21.99–28.49 | $149.99–194.99 | – | Includes a temperature band with annual [S19][S73] |
| Apple Health · My Cycle · Euki · drip | Free | – | – | – | – | – |
| *RevenueCat H&F medians* | – | *$4.99* | *$9.99* | *≈ $39.94* | – | [S43] |

Analysis and our recommendation are in §7.

### 4.9 Design & style comparison

| App | Palette | Visual language | Home screen | Tone |
|---|---|---|---|---|
| Flo | Pink/coral and lavender, green accents | Soft illustrations, feather icon, rounded cards | Big "period in X days" circle plus daily insight cards and stories | Warm, educational, health-companion |
| Clue | Deep red/burgundy and white, teal highlights | Minimalist, editorial, cycle ring, bold type | Cycle ring with "X weeks until your next period" | Scientific, direct, inclusive |
| Period Calendar | Pastel peach, pink, lavender | 3D cartoon illustrations, mascots and pets, many themes | Big "period in 3 days" card, "chance of getting pregnant" | Cute, playful, very feminine; cluttered by ads |
| Stardust | Deep navy and purple, cosmic | Moon phases, zodiac, tarot-style daily cards | Daily cosmic reading | Mystical, Gen Z, social |
| Lively | Soft "aesthetic" neutrals | Lifestyle imagery, phase-based tips | Daily phase advice | Wellness coach |
| Musa | Playful, bright | Gamified dragon companion, AI avatar | Habits and quests | Empowering, game-like |
| My Cycle | Plain | Basic calendar | Calendar | Utilitarian |
| Apple Health | System design | Cycle timeline | Buried inside the Health app | Clinical, neutral |

Sources: store screenshots and listings, 1 Nov 2026 [V][S5][S7][S9][S63–S66].

**Design takeaways [A]:**

1. Two aesthetics dominate: **pink and cute** (Flo, Period Calendar and most clones) versus **editorial and scientific** (Clue). A **calm, neutral, customisable, discreet** look is under-served — and it is what the UW study participants asked for [S41].
2. Home screens are crowded with content cards, promotions and upsells. A home screen that shows *only* what matters (today's cycle day, next period window, one-tap logging) is itself a differentiator.
3. **Accessibility is a gap:** of the top three on iOS, only Clue declares accessibility support on its App Store page; Flo and ABISHKKING declare none [V][S5][S7][S9]. Declaring full support is a cheap, visible advantage.
4. Size and speed: the leaders are ~300–350 MB. A < 40 MB app that opens instantly is a real (if quiet) quality signal.

### 4.10 Marketing comparison

| App | Main channels | Core messages |
|---|---|---|
| Flo | Paid social and creator/UGC (TikTok, Meta, Snap); privacy credentials as PR; partner-sharing growth loop; 21 localised listings; web checkout; HSA/FSA eligibility [V][S61] | "Science-backed", "570M downloads", "trusted", "privacy-first" |
| Clue | Editorial content and science credibility; women-led brand; EU privacy positioning; wearable partnerships [V] | "#1 women-led", "science-based", "privacy-first" |
| Period Calendar | Store optimisation at scale in dozens of languages; massive rating volume; in-store events; likely ad-funded acquisition and portfolio cross-promotion [V][A] | "Free", "no account", "300 million users", "4.9★" |
| Stardust | Gen Z identity (astrology); friend sharing; privacy slogans (contradicted by testing) [V][S27] | Cycle tracking blended with astrology and moon phases |
| Lively | Instagram community; cycle-syncing trend; partner syncing [V][S63] | Aligning daily life (food, exercise, self-care) with cycle phases |
| Musa | Instagram ads; gamification [V][S64] | "Your cycle, your superpower" |
| My Cycle | Store optimisation in 33 languages; one bold claim [V][S66] | Completely free: no purchases, subscriptions or ads |
| Euki / Lunavi | Privacy advocacy coverage; little else [V] | Data stays on the phone; no account |

**Marketing lessons for us [A]:**

1. **One bold, checkable claim beats a list of features** (My Cycle's "completely free"). Ours: *"No account. No ads. No nagging."*
2. **Localisation multiplies store reach** cheaply — every localised listing is a new set of search keywords.
3. **Big players win organic traffic with education.** We can do a small, credible version: short videos that bust myths (only 13% of cycles are 28 days [S42]), explain predictions, and show privacy in action.
4. **Privacy must be a proof, not a slogan.** Stardust shows the reputational cost of hollow claims [S27][S62]. We should be able to say "check it yourself" (§12.5).
5. **Growth loops matter** (Flo's partner mode, Stardust's friends). We postpone them because they need a backend, but they are a strong v2 candidate if the app gains traction (§12.2).

---

## 5. Voice of the user — what people dislike (and love)

**Method.** We read the most-helpful and most-recent reviews on both stores for Flo, Clue, Period Calendar, *My Cycle* and Lunavi (1 Nov 2026), and combined them with three studies (UW CHI 2017 [S41], Duke CHI 2024 [S38], JMIR 2024 [S40]) and Mozilla's 2026 testing [S27]. Reviews are paraphrased, not quoted. "Helpful votes" show how many other users agreed.

### 5.1 Complaint themes

| # | Theme | Evidence (paraphrased) | Apps | Severity | What we do about it |
|---|---|---|---|---|---|
| 1 | **Paywall creep and upsell pressure** | Flo, Google Play, Oct 2025 (124 helpful votes): calls Flo the worst tracker because of pay-blockers; Flo's reply confirms features were *moved out of the free plan*. Flo, App Store, Sep 2024: purchase prompts every few minutes, a purchase screen that is hard to leave, insights teased then locked; the user says the free app is now no better than the phone's calendar. Flo, App Store, 2021: the chat made the user answer questions for minutes, then asked for a subscription to see the answer. Clue, Google Play, Jan 2025 (196 helpful): after Clue Plus lapsed, a resubscribe prompt after *every* action; rating dropped from 5 to 3. Clue, Google Play, Jun 2025 (215 helpful): at least two promotions per use, no way to turn them off. Clue, Google Play, Sep 2026: nearly everything paywalled, including explanations younger users relied on [V][S5–S8] | Flo, Clue | **Very high** — the #1 theme in the most-helpful reviews | Basics free forever; zero pop-ups; one quiet optional upgrade |
| 2 | **Ads at a sensitive moment** | Period Tracker Period Calendar, App Store, Jan 2024: loves the penguin mascot but begs for the removal of unskippable ~10-second game ads that play while logging a period; developer says ads fund the app [V][S9] | Period Calendar | High | No ads, ever — make it a promise |
| 3 | **Privacy distrust** | Flo's FTC order and class action [S28–S32]; Stardust scored 2/10 after sending symptom data to third parties [S27]; listings claiming "data stays on device" while Apple labels list tracking identifiers [V][S9]. *But* only ~9% of worried users in one study had taken any action [S38] | All | Medium as a switching driver; high as a trust filter | Local-only, no SDKs, "Data Not Collected" labels, verifiable claims (§12.5) |
| 4 | **Inaccurate predictions — especially irregular cycles and new users** | Clue, App Store, 2021: a teen's predictions were weeks off for about a year before improving. UW study: apps handle irregular cycles poorly and don't let people correct predictions or record reasons [V][S7][S41] | All | High | Ranges instead of single dates; plain explanation; fast adaptation; easy corrections (§12.3) |
| 5 | **Life events break predictions** | Clue, App Store, Aug 2025: no way to record a birth; after pregnancy the app treated 10 months as one "cycle" and flagged normal breastfeeding irregularity as a problem; predictions still skewed a year later. Support's workaround: manually hide that cycle [V][S7] | Clue (and most apps) | Medium–High for affected users (and emotionally sensitive) | **Life events** (pregnancy, birth, pregnancy loss, start/stop hormonal contraception, breastfeeding) that pause and reset predictions automatically |
| 6 | **Bloat and lack of control** | Clue, App Store: a redesign removed the ability to choose what to track, forcing users through dozens of irrelevant options (later improved). Flo, Google Play, Mar 2025 (189 helpful): wants to skip the chatbot and add custom symptoms. Leaders are 307–348 MB on iOS [V][S6][S7] | Flo, Clue, Period Calendar | Medium | Short default list; hide/show any item; custom items; < 40 MB app |
| 7 | **Assumptions and tone** | UW study: assumptions about gender, partners and fertility goals; pink, flowery designs that some found insulting. A Clue reviewer praises it for *not* being stereotypically feminine [S41][V][S7] | Flo, Period Calendar, clones | Medium | Neutral design, inclusive language, fertility features off unless switched on |
| 8 | **Accounts, backup and data loss** | Flo, Google Play, Sep 2026: stuck logged into the wrong account, had to reinstall twice. *My Cycle*, App Store, Sep 2026: iCloud backup requires manual "update" and warns about "replacing" data, which confused the user [V][S6][S66] | Flo, My Cycle | Medium (but a catastrophic experience when it happens) | No account; OS backup on by default; one clear "Back up / Restore" screen with plain wording and confirmations |
| 9 | **Notifications that embarrass or market** | Period Calendar sells *customisable discreet reminder text* (so reminders don't embarrass people in public) as a feature — evidence of demand [V][S10]. Flo sends discount offers through push notifications [V][S20] | Flo, Clue | Medium | Discreet text by default; user-editable; quiet hours; **never** marketing notifications |
| 10 | **Can't pay** | Teens, students and users in lower-income markets rely on free tiers; Clue reviewer (Sep 2026) notes younger users depended on now-paywalled features [V][S8]; ad-supported apps dominate price-sensitive storefronts (§3.3) | Flo, Clue | Medium | Everything essential is free; Plus is optional and cosmetic/convenience |

### 5.2 What users love (keep these)

- **Quick, simple logging** and **reminders that arrive on time** [V][S5][S9].
- **Being free** — the most common praise for Period Calendar and *My Cycle* [V][S9][S10][S66].
- **Personality** — Period Calendar's pets and themes, Clue's custom icons [V][S7][S9].
- **Seeing patterns** across months, and **reports to show a doctor** [V][S5][S9].
- **A gentle nudge** to talk to a professional when patterns look unusual (one Flo user credits the app with prompting a PCOS conversation) [V][S5].
- **An app lock** so friends or family can't see the app's contents [V][S5].
- **Partner sharing** for some couples [V][S6][S10].

---

## 6. Gap analysis & opportunity scoring

Scoring 1–5 for each column (5 = best for us): **Pain** (how much users suffer today), **Gap** (how poorly competitors cover it), **Ease** (5 = easy to build), **Story** (marketing value). Total out of 20. [A]

| ID | Opportunity | Pain | Gap | Ease | Story | Total | Decision |
|---|---|---|---|---|---|---|---|
| O1 | Basics free forever, zero nags or pop-ups | 5 | 3 | 5 | 5 | **18** | **v1.0** |
| O4 | Life events that keep predictions accurate | 4 | 4 | 3 | 4 | **15** | **v1.0** |
| O3 | Honest prediction ranges + irregular-cycle support | 4 | 3 | 4 | 3 | **14** | **v1.0** |
| O5 | Discreet mode (neutral notification text, alternate icons, lock, hidden app-switcher preview) | 3 | 3 | 4 | 4 | **14** | **v1.0** |
| O8 | Supplies/restock reminder | 2 | 4 | 5 | 3 | **14** | **v1.0** |
| O2 | No account, local-only, no third-party SDKs ("Data Not Collected") | 3 | 2 | 4 | 4 | **13** | **v1.0** (foundation) |
| O6 | Calm, neutral, customisable and accessible design | 3 | 3 | 3 | 4 | **13** | **v1.0** |
| O13 | Import history (Apple Health / Health Connect, CSV, other apps' exports) | 3 | 4 | 2 | 4 | **13** | v1.1 (big switching enabler) |
| O7 | Lightweight and fast (< 40 MB, instant start) | 2 | 4 | 4 | 2 | **12** | **v1.0** (non-functional requirement) |
| O9 | Painless backup and phone switch | 4 | 3 | 3 | 2 | **12** | **v1.0** |
| O14 | Perimenopause mode | 4 | 2 | 2 | 4 | **12** | v2 / pivot option |
| O18 | Teen-friendly mode / parent guide | 3 | 3 | 3 | 3 | **12** | Later |
| O10 | PDF report for doctor visits | 3 | 2 | 3 | 2 | **10** | v1.1 (Plus) |
| O12 | Home-screen and lock-screen widgets, watch | 2 | 2 | 3 | 3 | **10** | v1.1 (Plus) |
| O11 | Pill / contraception reminders | 3 | 1 | 3 | 2 | **9** | v1.1 |
| O15 | Partner sharing (end-to-end encrypted) | 2 | 1 | 1 | 4 | **8** | v2+ (needs a backend) |
| O17 | Articles / content library | 1 | 1 | 2 | 2 | **6** | Won't (use social media instead) |
| O16 | AI insights / chatbot | 1 | 1 | 1 | 2 | **5** | Won't |

**Reading the table:** the highest-scoring opportunities are cheap to build and directly answer the top complaints. Content, AI and social features — where incumbents spend most of their money — score lowest for a new entrant.

---

## 7. Pricing analysis — are competitors too pricey?

### 7.1 The short answer

**Too pricey for what most people actually need; reasonably priced for what the premium tiers contain.**

- **In absolute terms the price is normal.** ~$40/year (~$3.33/month) matches the Health & Fitness median of ≈ $39.94/year [S43].
- **But the core job is commoditised.** Logging a period and predicting the next one is free in Apple Health, *My Cycle*, Euki, drip and (with ads) in Period Calendar. Charging for anything near that core feels like a toll on something that should be free.
- **Premium value is perceived as generic.** Users describe paywalled insights and chatbot answers as information they could find online (§5, theme 1).
- **The real pain is the *pressure*, not the price** — interruptions, features removed from the free plan, teased-then-locked insights, unclear exits.
- **Pricing feels arbitrary.** Flo shows nine different price points; trials and discounts arrive via push notifications and email [S14][S20]. That breeds distrust.
- **Affordability gap.** Teens and users in lower-income markets cannot pay, which is why ad-supported apps win downloads there (§3.3).

### 7.2 Willingness-to-pay evidence

| Metric | Value | Source |
|---|---|---|
| Flo paying users / monthly active users (2024) | ~5M / ~70M (≈ 7%) | [S21] |
| Health & Fitness download → paid within 35 days (median / top quartile) | 2.9% / 6.2% | [E][S43] |
| Health & Fitness trial → paid (median / top quartile) | 37.7% / 51.4% | [E][S43] |
| Health & Fitness revenue per install, day 14 / day 60 (median) | $0.48 / $0.66 | [E][S43] |
| Health & Fitness install lifetime value (Adapty) | $1.21 | [E][S44] |
| Median price points, Health & Fitness | $4.99/week · $9.99/month · ≈ $39.94/year | [E][S43] |

General consumer surveys about "subscription fatigue" point in different directions, depending on how questions are asked [S71]. The **category-specific** evidence — reviews of Flo and Clue — is unambiguous: users resent paying, or being pushed to pay, for the basics.

### 7.3 Monetisation options compared

| Model | Revenue potential | Fit with "calm & private" | Build complexity | User sentiment | Verdict |
|---|---|---|---|---|---|
| Paid upfront (e.g., $2.99 to download) | Low — kills discovery against free rivals | Good | Low | Neutral | ✗ |
| Free + ads | Needs enormous scale (Period Calendar has ~220M downloads) | **Contradicts the brand**; ad SDKs break "Data Not Collected" | Medium | Negative (§5 theme 2) | ✗ (decided against — §18) |
| Freemium subscription ($/month, $/year) | Highest *per user*, recurring | Risky — invites the nagging users hate | Medium–High (renewals, grace periods, status checks) | Negative for basics | Not at launch |
| **Freemium + one-time "Plus" unlock** | Moderate; one-off | **Strong** — "pay once, own it" | **Low** (non-consumable purchase; no server needed) | Positive | ✓ **Recommended** |
| Hybrid (annual + lifetime) | Moderate–High | OK if quiet | Medium | Mixed | Consider in v1.1+ if recurring-cost features arrive |
| Tip jar / "supporter" purchase | Low but brand-positive | Strong | Low | Positive | ✓ **Decided** — alongside Plus |
| B2B (clinics, employers, schools) | Potentially high | Neutral | High (sales, contracts, compliance) | – | Out of scope |

### 7.4 Recommendation

**Free forever (stated in-app and on the store page):** period logging, predictions with ranges, all reminders, symptoms/mood/notes, life events, app lock, history, export/import, delete-all, light/dark themes, accessibility.

**"Plus" — one-time purchase** (suggested **$14.99**, launch offer **$9.99** for the first 1–2 months, regional price tiers in lower-income markets):

- Extra colour themes and alternate app icons
- Home-screen and lock-screen widgets (v1.1)
- Advanced statistics: cycle-length trends, symptom patterns by phase
- PDF report for doctor visits (v1.1)
- Password-protected backup file
- Custom reminder schedules beyond the defaults
- (Later) Apple Watch / Wear OS complications

**Tip jar — optional "support the app" purchases (decided):** three consumable in-app purchases ($1.99 / $4.99 / $9.99) that unlock nothing and simply show a thank-you. They give price-sensitive users a very cheap way to support the app without ads or tracking. Both stores allow tips through their own in-app purchase systems. Show the tip jar only on the Plus screen and in Settings — never as a prompt.

**Rules for the paywall (non-negotiable):**

1. No paywall or upsell in onboarding.
2. No pop-ups. Plus appears in Settings and as a small lock badge on Plus features — nowhere else.
3. At most one gentle, dismissible mention, after the user has logged their second period, and never again.
4. Never lock away data the user has created, and never downgrade free features later ("free forever" must stay true).
5. No fake countdowns, no "only today" pressure, no pre-ticked trials.
6. "Restore purchases" always visible; enable **Family Sharing** for the iOS purchase (a nice touch for mothers and daughters).

**Why not a subscription at launch?** [A] It contradicts the core promise, adds technical work (renewal states, grace periods, cancellations) and attracts the exact complaints we are positioning against. If a later feature has real running costs (e.g., encrypted sync or partner sharing), an optional low annual tier can be added alongside the lifetime option.

---

## 8. Regulatory, privacy & store-policy landscape

> This section summarises the research for planning purposes. **It is not legal advice.** Budget for a short review by a lawyer familiar with app privacy and medical-device rules in the owner's country before launch (§16).

### 8.1 Medical-device boundaries — what we may and may not claim

| Feature / claim | US (FDA) | EU (MDR) / UK | Our decision |
|---|---|---|---|
| Logging and displaying user-entered cycle data (calendar, diary) | Low-risk / general wellness | A simple cycle diary that only stores and displays entered data may not be a device [S57] | ✓ Core of v1 |
| Predicting the next period from past dates | General wellness if no medical claims [S55] | Generally not a device without a medical purpose [S57] | ✓ With disclaimers |
| Fertile window "for information only" | Grey zone — depends entirely on how it is marketed | Grey zone; marketed to help conception it can become a (Class I) device [S57] | Optional, **off by default**, no conception or contraception wording; legal check before launch |
| "Use as birth control", "safe days", "prevent pregnancy" | Medical device (Natural Cycles needed FDA clearance) | **Class IIb** device (MDR Rule 15) requiring a notified body; Swiss court: an app usable for contraception is a device; German app Ovy certified Class IIb in 2025 [S56] | ✗ **Never** |
| "Helps you get pregnant", conception-optimised predictions, temperature- or LH-based ovulation detection | Device risk | Device risk (Class I or higher) [S57] | ✗ Not in v1 |
| Flagging conditions (PCOS, endometriosis) or "abnormal cycle" alerts | Device risk (diagnosis) | Device risk | ✗ Never. Generic "talk to a healthcare professional" text only |

Related store rules: Apple guideline 1.4.1 requires medical apps to remind users to check with a doctor [S46]. Since March 2026 Apple asks every Health & Fitness app distributed in the US, UK or EEA to declare whether it is a **regulated medical device** — we declare **"No"** (existing apps must declare by early 2027) [S47]. The FDA's revised General Wellness guidance (6 January 2026) keeps the two-part test: intended only for general wellness, and low risk [S55].

### 8.2 Privacy law — and why "local-only" is a legal strategy too

| Law | When it applies | Main obligations | Exposure with a local-only, no-SDK design [A] |
|---|---|---|---|
| **GDPR / UK GDPR** (EU/UK users) | When the developer processes personal data of people in the EU/UK. Health data is "special category" data (Art. 9) | Lawful basis + explicit consent, records, data-subject rights, breach notification, often a DPIA | If cycle data never leaves the device and the developer can never access it, the developer is not processing it. Residual personal data: support emails, and purchase records (handled by Apple/Google). **Confirm this analysis with a lawyer** |
| **FTC Act §5 + Health Breach Notification Rule** (US) | Health apps holding identifiable health data; the 2024 final rule confirmed health apps are covered [S59]. The FTC's 2021 Flo order shows enforcement against *misleading privacy claims* [S32] | Don't misrepresent practices; notify breaches | No server = no server breach. **Main risk is a privacy claim that isn't literally true** |
| **Washington My Health My Data Act** (and similar laws in other states) | Collecting "consumer health data" of state residents — period tracking is explicitly covered [S58] | Separate consent, a consumer-health-data privacy policy, no sale without authorisation; private right of action | Minimal if nothing is collected; still publish a clear policy |
| Other US state privacy laws (e.g., California) | Revenue / data-volume thresholds | Notices, opt-outs | Likely below thresholds; no data collected |
| **Legal requests after Dobbs** | Companies holding data can be subpoenaed | – | **There is no server data to hand over** — a genuine user benefit. Data on the phone itself remains reachable if someone has the phone → app lock, hidden previews, panic wipe (v1.1) |
| COPPA (US, under 13) / GDPR child consent (13–16 by country) | If directed at children or knowingly collecting their data | Parental consent | No collection → minimal; set the age rating carefully |

**Key insight:** "nothing ever leaves the device" is simultaneously the **marketing message**, the **user protection**, and the **cheapest compliance strategy** for a solo developer. Every analytics, crash-reporting, attribution or ad SDK added later erodes all three.

### 8.3 App store requirements that affect the build

**Apple App Store**

- **Guideline 5.1.3(i):** health data may not be used for advertising or data mining; disclose any health data collected [S46].
- **Guideline 5.1.3(ii): apps may not store personal health information in iCloud** [S46]. → **No app-managed iCloud/CloudKit sync of cycle data in v1.** Rely on the phone's own device backup plus a user-initiated export file. If in doubt about device backups, ask App Review during submission.
- **Guideline 1.4.1:** remind users to consult a doctor; disclose methodology behind any accuracy claim [S46].
- **App Privacy label** must be accurate. "Data Not Collected" is achievable only if no analytics/crash/attribution SDK collects anything.
- **Privacy policy URL** and **support URL** required.
- **Regulated medical device declaration** (since March 2026) → "No" [S47].
- **Age-rating questionnaire** (Apple introduced new age tiers in 2025). US state age-assurance laws (Texas, Utah) now require some developers to use Apple's Declared Age Range API — impact is small for a no-account app, but monitor [S51].
- **EU Digital Services Act "trader" status:** developers who earn money must publish an address, phone and email on EU product pages; Apple removed 135,000+ non-compliant apps from EU storefronts in February 2025 [S50].
- **Accessibility Nutrition Labels:** declare supported accessibility features (a visible advantage, §4.9).
- **In-app purchases:** digital unlocks must use Apple's in-app purchase system; provide "Restore purchases".
- **Alternate app icons** are allowed but must not imitate other apps or system apps (copycat / misleading-metadata rules).

**Google Play**

- **Health apps declaration** — mandatory for all apps since 2024; period tracking is a declared health feature [S53].
- **Data safety form** + privacy policy.
- **Personal developer accounts created after 13 Nov 2023 must run a closed test with at least 12 opted-in testers for 14 consecutive days before production release — for every new app** [S52]. Engagement checks on testers were reportedly added in 2026. Organisation accounts (with a D-U-N-S number) are exempt.
- **Monetised apps must provide a physical address, which Google displays publicly** [S54] — use a business address if the owner doesn't want their home address public.
- **Target API level** must be raised every year (deadline each August).
- Google Play Billing for digital unlocks; Health Connect permission declarations if health data is read or written later (v1.1).

### 8.4 Wording rules (for the app, store listing, website and social media)

| ✅ Say | ❌ Never say |
|---|---|
| "Next period likely 3–6 March" | "Your period will start on 4 March" (false precision) |
| "Predictions are estimates based on the cycles you've logged" | "Accurate ovulation detection" / "99% accurate" |
| "Not a method of contraception" (onboarding, settings, store description, fertile-window toggle) | "Birth control app", "safe days", "chance of pregnancy: 2%" |
| "If you have concerns about your cycle, talk to a healthcare professional" | "Your cycle is abnormal", "You may have PCOS" |
| "Your data stays on this device. We can't see it." (only if literally true) | "Military-grade encryption", "100% private" (unless independently verified) |
| "Period later than expected" | Fear-based or pregnancy-assuming language ("You might be pregnant!") |

---

## 9. SWOT for a new entrant

| **Strengths** (of the proposed concept) | **Weaknesses** |
|---|---|
| No server → near-zero running costs | No brand, no audience, no marketing budget |
| Privacy that is provable, not just promised | Single developer / small team bandwidth |
| Small, well-defined scope → fast to build and easy to keep stable | No cross-device sync and no partner sharing in v1 |
| No ads and free basics → instant goodwill versus Flo/Clue/Period Calendar | No content engine (articles, SEO) |
| Minimal regulatory and compliance burden | Limited monetisation surface (cosmetic/convenience Plus) |
| Calm, focused experience — easy to explain in one sentence | First-time publisher learning curve (store policies, ASO, reviews) |

| **Opportunities** | **Threats** |
|---|---|
| Widespread resentment of Flo/Clue paywalls and Period Calendar ads | Free built-ins (Apple Health, Samsung Health, Fitbit) |
| Recurring privacy news cycles (Mozilla tests, lawsuits, state laws) | Free indie apps (*My Cycle*, Euki, drip) and mass ad-funded apps |
| Under-served users: irregular cycles, life events, people tired of "pink" | Incumbents adopting "calm"/privacy messaging or easing their nags |
| Accessibility gap among the leaders | A flood of new (often AI-built) apps making discovery harder |
| Smaller, local-language markets that are cheaper to win | Prediction errors leading to bad reviews in a sensitive category |
| Apple editorial featuring (privacy, design, accessibility) | Store policy changes (new declarations, age-assurance laws) |
| Tech-savvy launch audiences that value "no backend" (Hacker News, Reddit, Product Hunt) | Copycats cloning a successful positioning quickly |
| Perimenopause as a later expansion | A data-loss incident (e.g., failed restore) damaging trust |

---

## 10. Feasibility, financials & the honest verdict

### 10.1 What success realistically looks like

| Benchmark | Data | Source |
|---|---|---|
| New subscription apps reaching **$1K monthly revenue** within 2 years | ~17% (all categories) | [E][S43] |
| New subscription apps reaching **$10K monthly revenue** within 2 years | ~4.6% (all categories) | [E][S43] |
| Privacy-first indie trackers | Euki 162 US ratings · drip 59 · Lunavi 5K+ installs · 2026 launches 0–5 ratings | [V][S4][S67] |
| Simple, completely free indie tracker (*My Cycle*, 2019) | 104K US ratings after ~7 years — but no direct revenue | [V][S66] |
| Marketing-heavy breakout (Lively, 2023) | Est. $300–450K/month and ~70K downloads/month after ~3 years | [E][S24][S25] |
| Paid acquisition economics (US, Health & Fitness) | ~$3.83 per install vs ~$0.66 median revenue per install by day 60 | [E][S45][S43] |

**Conclusion [A]:** a calm, free-basics tracker can plausibly gather a loyal user base and modest revenue. Large revenue requires either years of compounding store optimisation and word of mouth, or marketing spend that the unit economics of a low-price app cannot justify.

### 10.2 Cost to launch (summary — details in §16)

| Path | Cash cost to v1.0 [A] | Notes |
|---|---|---|
| **Owner builds it** (with or without AI assistance) — **chosen** | ~$450–2,500 core; up to ~$5,500 with optional extras | Store fees, domain, legal review, icon/design help; trademark, tools and small marketing tests are the optional extras (no translation cost for the English-only launch) |
| Freelance developer(s) | ~$10–30K + the above | 300–600 hours for both platforms at ~$30–50/h (CEE/LatAm/Asia freelance rates) |
| Agency | ~$30–80K + the above | Not recommended for this scope |

### 10.3 Revenue scenarios (year 1)

**Assumptions [A]:**

- Blended net revenue ≈ **75% of list price** after the store commission (15% under Apple's Small Business Program and on Google's first $1M per year) and VAT/GST in many countries.
- Average realised list price of Plus ≈ **$11** (mix of the $9.99 launch offer, $14.99 regular price and lower regional tiers) → **≈ $8.25 net per purchase**.
- Conversion = share of installs that buy Plus within ~60 days. Benchmarks for subscription apps with paywalls are higher (2.9% median [S43]); a soft, non-pushy one-time unlock is assumed lower.

| Scenario | What it takes | Installs in year 1 | Conversion | Purchases | Net revenue |
|---|---|---|---|---|---|
| **Pessimistic** — "launch and hope" | Publish, little marketing | 3,000 | 1.5% | 45 | **≈ $370** |
| **Base** — "consistent organic effort" | 4–6 h/week content + ASO + community for 12 months; 4–6 languages | 25,000 | 2.5% | 625 | **≈ $5,200** |
| **Optimistic** — "one or two viral moments + press" | Base + a video or story that takes off, Apple featuring or strong press | 150,000 | 4.0% | 6,000 | **≈ $49,500** |

**What it takes to earn ~$1,000/month:** ≈ 120 Plus purchases per month → at 2.5% conversion ≈ **4,800 installs per month (~160 per day)**. For comparison: Lunavi has 5K+ installs *in total*; Lively gets an estimated ~70K per month with heavy marketing [V][E].

Year 2 can be meaningfully better than year 1 if ratings, keyword rankings and word of mouth compound [A].

**Effect of the owner decisions (§18) [A]:** building it yourself puts break-even inside the base case (§10.4). Two decisions slow growth: *faceless* content usually builds reach and trust more slowly than founder-on-camera video, and *English-only* listings won't rank for searches in other languages (e.g., German, Portuguese, Spanish). Expect the base case to take 12–18 months rather than 12, unless languages are added in v1.1. The tip jar adds a little: assuming 0.3–0.5% of installs tip ~$3, that is ≈ $150–300 in the base case.

### 10.4 Break-even

| Build path | Total cash outlay (year 1) [A] | Plus purchases to break even | Installs needed at 2.5% | Reachable in… |
|---|---|---|---|---|
| **Owner-built (chosen)** | ~$1,500 | ~180 | ~7,300 | Base scenario ✓ |
| Freelance ($15K) | ~$17,000 | ~2,060 | ~82,000 | Between base and optimistic |
| Agency ($40K) | ~$42,000 | ~5,100 | ~204,000 | Optimistic scenario only |

→ **The build budget decides whether this is a sensible bet.** Keeping cash costs low (go condition G1) is the single most important financial decision.

### 10.5 Verdict scorecard

| Dimension | Score (1–5, 5 = favourable) | Comment |
|---|---|---|
| Demand | 5 | Universal, recurring, lifelong need |
| Competitive intensity | 1 | Extreme — giants, free built-ins, hundreds of clones |
| Differentiation potential | 3 | Real gaps exist, but they are partly served and easy to copy |
| Build complexity | 4 | Simple, offline, no backend |
| Regulatory risk | 4 | Low with no medical claims and local-only data |
| Monetisation potential | 2 | The core must be free; the upsell is modest |
| Marketing difficulty | 2 | Discovery is the bottleneck |
| Fit for a first-time publisher | 4 | Excellent learning project with manageable scope |
| **Overall** | **3.1 / 5** | **Conditional GO** |

**Say NO (or rethink) if any of these are true:**

- The plan is to spend more than ~$15K on outsourced development and expect it back within 12 months.
- Nobody will do marketing consistently.
- v1 is meant to include trying-to-conceive, pregnancy or contraception features, or any medical claim.
- Meaningful income is needed in year 1.

### 10.6 Alternative niches (pivot or expansion options)

| Niche | Why attractive | Why hard | Assessment |
|---|---|---|---|
| **Perimenopause tracker** (≈ 40–55) | Rising attention; higher spending power; incumbents treat it as an add-on; symptom tracking and irregularity handling are our strengths | Needs credible content and expert input; Balance, Flo and Clue are present; audience lives more on Facebook/Instagram than TikTok | **Best v2 or pivot candidate** |
| Teen first-period companion (+ parent guide) | Parents will pay; trust and simplicity matter; under-served | Child-privacy rules, age-assurance laws, age ratings; teens can't pay | Medium |
| Irregular cycles / PCOS symptom tracker | High pain, active online communities | Medical-claim boundaries; needs clinical credibility | Medium |
| PMDD / mood-and-cycle tracker | High pain, passionate niche communities | Mental-health sensitivity; claims | Medium–low |
| Owner's home market first (local language) | Less competition in national charts; local press loves "local developer builds app" stories | Small revenue on its own | Good beachhead for reviews and notoriety — not a business by itself |

---

## 11. Positioning & brand strategy

### 11.1 Target users (personas)

| Persona | Profile | Pains | Where to reach them |
|---|---|---|---|
| **P1 — The fed-up switcher** (primary) | 20–38; used Flo, Clue or Period Calendar for years; only wants dates and reminders | Pop-ups, paywalls, ads, clutter | TikTok, Instagram Reels, YouTube Shorts, Reddit; searches like "period tracker no ads", "simple period tracker" |
| **P2 — The privacy-conscious** (primary) | 20–40; US (especially states with abortion restrictions) or EU; follows privacy news; may be tech-savvy | Fear of data sharing, subpoenas, breaches; distrust of slogans | Reddit (privacy and app communities), Hacker News, privacy newsletters/blogs, Mastodon/Bluesky |
| **P3 — The irregular cycler** (primary) | PCOS, post-pill, postpartum, approaching perimenopause, high stress | Wrong predictions, false alarms, apps that "break" after pregnancy | Condition-specific communities and creators |
| Later: teens & parents; perimenopause | – | – | – |

### 11.2 Value proposition

- **Jobs to be done:** know when my period is coming · be prepared (supplies, plans) · remember to log · keep it private · show my history to a doctor.
- **Pains removed:** nagging and paywalls · ads · privacy anxiety · predictions that are confidently wrong · losing data when changing phones · embarrassing notifications.
- **Gains created:** calm, quick, trustworthy, good-looking, free.

### 11.3 Messaging pillars and proof points

| Pillar | Message | Proof the user can see |
|---|---|---|
| **Calm** | "No pop-ups. No ads. No feed." | Log a period in 2 taps; the only notifications are the reminders you chose |
| **Honest** | "Ranges, not guesses dressed up as facts." | "How we calculate" screen; life events; no fake discounts |
| **Private** | "Your data never leaves your phone." | No sign-up; "Data Not Collected" store labels; iOS App Privacy Report shows no network activity; possibly an Android build without internet permission (§12.5) |
| **Free basics** | "The basics are free. Forever." | A "free forever" list in the app and on the store page |

### 11.4 Tone of voice

Warm, plain, a little witty; never clinical, never fearful, never patronising. Inclusive without being awkward ("you", "your cycle", "your period"). No "ladies", "girls" or "goddess" clichés; no medical certainty.

- ✅ "Your period is likely in 3–5 days. Stocked up?"
- ✅ "Later than expected? That happens. Log it when it starts — or tell us what changed."
- ❌ "Warning! Your period is late!" · "Hey girl, Aunt Flo is coming!"

### 11.5 Naming and identity guidance

- **Criteria:** short (≤ 12 characters), easy to spell and pronounce in the launch languages, not literally "period" (discreet on a home screen), .com or .app domain and social handles available, no trademark conflict in the software and health-information classes.
- **Avoid** anything close to Flo, Clue, Lively, Stardust, Natural Cycles, Glow, Eve, Ovia or Maya, and the very crowded "Luna/Moon" naming space.
- **Store title pattern:** "[Brand]: Period Tracker" (≤ 30 characters) + subtitle such as "Private · No ads · No account" (≤ 30 characters).
- **Process:** brainstorm ~30 names → search both stores → check domains → search trademark registers (USPTO, EUIPO, national office) → check social handles → quick preference poll with 20–30 people from the target group.
- **Icon:** abstract and calm (not an obvious blood drop), legible at small sizes, with neutral alternate icons.

---

## 12. MVP scope definition (for developers)

### 12.1 Product principles (non-negotiable)

1. **Local-first:** no backend, no accounts, no cloud sync in v1.
2. **No third-party SDKs that send data:** no ads, analytics, attribution, crash-reporting, remote-config or A/B-testing SDKs.
3. **The basics are free forever** — and stay free.
4. **Honest predictions** — always ranges, always explainable.
5. **Discreet and inclusive by default.**
6. **Fast and small:** < 40 MB download; opens in under 1.5 s.
7. **Accessible from day one.**
8. **No medical claims** (§8.4).

### 12.2 Feature list (MoSCoW)

**MUST — v1.0**

| ID | Feature | Key requirements / acceptance criteria |
|---|---|---|
| F-01 | **Onboarding** (≤ 4 screens, ≤ 60 s) | Promise screen (no account, no ads); last period start (or "I don't remember"); typical period and cycle length with sensible defaults and "not sure"; notification pre-permission screen with **discreet vs descriptive** text choice; optional "what brings you here" (just tracking / irregular cycles / coming off birth control / after pregnancy) that pre-sets life events. **No email, name or birthday.** Every question skippable; the user sees a first prediction in < 60 s |
| F-02 | **Today screen** | Cycle day; next-period window ("in 3–5 days"); one primary button ("Period started" / "Period ended"); quick-log chips; neutral "later than expected" status. No content feed, no promotions |
| F-03 | **Calendar** | Month view; logged period days (solid), predicted window (outlined **and** patterned — never colour-only), optional fertile estimate (if enabled), dots for days with logs; tap a day to log; edit any past day; jump to today |
| F-04 | **Period logging** | Start/end; daily flow (spotting, light, medium, heavy); retroactive logging; undo; auto-estimated end after the typical length until the user confirms; sanity check for improbable entries (e.g., two starts 6 days apart) |
| F-05 | **Daily log** | ~20 default symptoms (cramps, headache, bloating, breast tenderness, acne, back pain, nausea, fatigue, cravings, sleep problems…), mood set, optional discharge, optional intimacy/sex (hidden by default), pain-relief taken, free-text note. Users can hide, reorder and add custom items |
| F-06 | **Prediction engine** | Spec in §12.3 |
| F-07 | **Reminders** | Spec in §12.4 — period coming, late check-in, supplies, period-end check, daily log; discreet text; quiet hours |
| F-08 | **Life events** | Pregnancy (pauses predictions); pregnancy ended / birth (restarts learning); breastfeeding (wider ranges); started or stopped hormonal contraception (earlier cycles excluded from averages); "my cycles are changing" (wider ranges); mark a single cycle as unusual (illness, travel, stress). Each event shows its effect in plain language. Compassionate wording ("Pregnancy ended") — no assumptions about how the user feels |
| F-09 | **History & basic stats** | List of cycles (length, period length); median cycle length, shortest–longest range, average period length; include/exclude any cycle; simple bar chart with a text summary for screen readers |
| F-10 | **Privacy & security** | App lock (PIN + Face ID/Touch ID/fingerprint) with timeout; blurred app-switcher preview; discreet notifications by default; at least one free neutral alternate icon; "Delete all data" with double confirmation |
| F-11 | **Data portability** | Export to JSON (complete, versioned) and CSV (cycles and daily logs) via the share sheet; import from our own JSON and a documented CSV template; restore preview ("34 cycles, Jan 2023 – Oct 2026"); explicit **merge vs replace** choice; automatic safety copy of current data before any replace; plain explanation of how the phone's own backup protects the data |
| F-12 | **Settings** | Notifications; appearance (system/light/dark; extra themes in Plus); first day of week; date format; language; life-events manager; data & backup; security; "How predictions work"; about & disclaimers; contact support; rate the app; Plus & restore purchases |
| F-13 | **Plus purchase + tip jar** | One non-consumable in-app purchase (Plus) and three consumable tips ($1.99 / $4.99 / $9.99) that unlock nothing and show a thank-you; a single calm screen listing Plus features **and** the free-forever list; restore purchases; Family Sharing on iOS (Plus); entitlement works offline (cached) |
| F-14 | **Accessibility** | Text scaling to 200%; full VoiceOver/TalkBack labels (e.g., "4 March, predicted period"); contrast ≥ 4.5:1; never colour-only meaning; Reduce Motion support; touch targets ≥ 44 pt / 48 dp; charts with text alternatives |
| F-15 | **Localisation-ready** | All strings externalised; plural rules; locale date formats; RTL-ready layouts. **Launch language: English only (decided — §18)**; translations are a v1.1 candidate, so no hard-coded text |
| F-16 | **Feedback & reviews** | "Send feedback" via email (no data attached automatically); native review prompt only after a positive moment (e.g., the second time a period starts inside the predicted window), at most once per 90 days |
| F-17 | **Safety texts** | Disclaimers in onboarding, About, the fertile-window toggle and the store description (§8.4) |

**SHOULD — v1.0 if time allows, otherwise v1.1**

| ID | Feature | Notes |
|---|---|---|
| F-18 | Optional fertile-window estimate — **decided: build in v1.0** | Behind a switch, **off by default**; dotted style + "estimate" label; disabled automatically when cycles vary a lot or a hormonal-contraception event is active; the switch is shown to users only after the legal check (§8.1) |
| F-19 | Panic wipe | Deliberate flow (Settings → PIN → confirm) to avoid accidental loss |

**v1.1 — planned for 1–3 months after launch**

- Home-screen and lock-screen widgets (Plus)
- PDF report for doctor visits (Plus)
- Pill / contraception reminders
- Apple Health and Health Connect: read past periods at onboarding, write new ones
- Import from other apps (CSV templates; investigate other trackers' export formats) — a major switching enabler
- Advanced statistics (Plus)
- Additional languages

**v2+ — could have, only with traction**

- Perimenopause mode
- Apple Watch / Wear OS complications
- Partner sharing via end-to-end encrypted link (requires a minimal relay backend)
- Optional end-to-end encrypted sync between devices (must respect Apple 5.1.3(ii); changes the "never leaves your phone" claim — decide carefully)
- Teen mode / parent guide
- Optional low annual tier, only if recurring-cost features exist

**WON'T — explicitly out of scope for v1**

| Excluded | Reason |
|---|---|
| Accounts, login, cloud sync, social login | Cost, privacy, legal exposure; contradicts the positioning |
| Community / forums | Moderation burden, safety and legal risk |
| Article library / blog inside the app | Cost and content liability; education happens on social media instead |
| AI chatbot or AI insights | Cost, liability, user scepticism (§3.4) |
| Trying-to-conceive mode, temperature/LH charts, "chance of pregnancy" | Medical-device risk (§8.1); crowded segment |
| Pregnancy week-by-week | Crowded and content-heavy |
| Any contraception claim | EU Class IIb medical device territory |
| Ads, analytics, attribution or crash SDKs | Contradicts brand and privacy labels |
| Web app / desktop | Not needed for the core job |

### 12.3 Prediction engine specification (v1)

**Definitions**

- *Period start* = first day with logged flow of light or more (spotting alone does not start a period unless the user taps "Period started").
- *Cycle length* = days from one period start to the next.
- *Valid cycle* = 15–90 days long, not excluded by the user or by a life event. Cycles outside 15–90 days are flagged ("Did you miss a log?") and excluded unless the user confirms them.

**Algorithm — deterministic and explainable**

1. Take the most recent **up to 6 valid cycles**.
2. **Base cycle length L** = median of those cycles.
   - 0–1 valid cycles: use the onboarding value; if "not sure", use 28 days and label the prediction "early estimate".
3. **Uncertainty V** (days):
   - 3+ valid cycles: V = max(1, round(standard deviation)), capped at 10.
   - Fewer than 3: V = 3.
   - Breastfeeding or "cycles are changing" life events: V × 1.5 (capped at 10).
4. **Next period window** = last period start + L, shown as [start − V, start + V].
5. **Predicted period length** = median of the last up to 6 logged period lengths (default 5 days).
6. **"Cycles vary" notice:** if the shortest and longest recent valid cycles differ by more than 9 days (a configurable constant, in line with commonly cited normal variation), show a neutral note — "Your cycles vary, so predictions show a wider range." **No diagnosis, no alarm.**
7. **Later than expected:** if today is past the window end and no period is logged → status "Later than expected (X days)" with three actions: *Log period* · *Remind me later* · *Something changed* (opens life events).
8. **Life events:** active pregnancy → no predictions. Pregnancy ended/birth → predictions restart from the next logged period using onboarding defaults until 2 new cycles exist ("Rebuilding your predictions"). Contraception started/stopped → earlier cycles excluded from averages until 2 new cycles exist.
9. **Fertile estimate** (only if F-18 is enabled, cycles don't vary a lot, and no hormonal-contraception event is active): estimated ovulation = next predicted start − 14 days; window = ovulation − 5 to ovulation + 1. Always labelled as a rough estimate, not for contraception. (Real-world luteal phases average ~12.4 days and vary [S42] — another reason to keep this feature conservative.)
10. **Transparency screen ("How we calculate"):** e.g., "Based on your last 6 cycles — 27, 29, 30, 28, 33, 29 days — the median is 29 days. Your next period is likely between 3 and 6 March."
11. **Tests:** deterministic unit tests with fixtures — perfectly regular 28-day; variable 24–35; one missed log; postpartum gap; contraception switch; only one cycle logged; edits to past dates; leap years; time-zone changes and daylight-saving transitions.
12. **Later (v2):** recency weighting, Bayesian updating — only with validation against real (opt-in, anonymised, *volunteered*) data.

### 12.4 Notifications specification

| ID | Reminder | Default | Timing |
|---|---|---|---|
| N1 | Period coming | **On** | 2 days before the window starts (configurable 0–7), at the user's chosen time (default 09:00) |
| N2 | Supplies restock | Offered in onboarding | 4 days before the window starts |
| N3 | Late check-in | **On** | Window end + 2 days; repeats at most twice, every 2 days, then stops |
| N4 | Period-end check | Off | Predicted period length + 2 days, if no end is logged |
| N5 | Daily log reminder | Off | User-chosen time |
| N6 | Fertile-window estimate | Off | Only if F-18 is enabled |
| N7 | Pill reminder | – | v1.1 |

**Text**

- **Discreet (default):** title = app name (or a neutral alias); body = "You have a reminder" / "Time to check in" / custom text written by the user.
- **Descriptive (opt-in):** "Your period is likely in 2–4 days."
- **Never:** marketing, discounts, upsells, re-engagement nudges.

**Implementation notes**

- *iOS:* local notifications only. iOS keeps at most **64 pending local notifications per app**, so schedule the next ~90 days of events and reschedule on every app launch, every data change, and opportunistically via background refresh.
- *Android:* runtime notification permission on Android 13+. Day-level reminders do **not** need exact alarms (exact-alarm permission is denied by default for new installs on Android 14+); use inexact alarms or WorkManager. Reschedule after reboot, app update and time-zone change. Test on Samsung, Xiaomi and OnePlus devices, whose battery optimisers are known to delay or kill scheduled work. One notification channel per reminder type.
- Ask for permission only after a short explanation screen; if denied, show a gentle in-app banner instead of nagging.
- **Quiet hours:** reminders that fall inside quiet hours fire when quiet hours end.
- No remote push infrastructure at all.

### 12.5 Data, privacy & security specification

**Storage**

- On-device database (e.g., SQLite / Core Data / SwiftData / Room), encrypted at rest:
  - iOS: Data Protection classes (note: scheduling notifications in the background may require *complete until first user authentication*).
  - Android: SQLCipher or an equivalent, with keys held in the Android Keystore.
- App-lock PIN stored only as a salted hash (Argon2 or PBKDF2) in Keychain/Keystore; biometrics via LocalAuthentication / BiometricPrompt.

**Network**

- **The app makes no network requests**, except those made by the operating system's store frameworks for purchases.
- Bundle all fonts and assets — no CDNs, no remote config.

**Verifiable privacy (marketing proof points — validate before claiming)**

- iOS: the built-in **App Privacy Report** (Settings → Privacy & Security) shows each app's network activity. Target: **zero domains contacted** by our app.
- Android: investigate shipping **without the INTERNET permission** (Google Play purchases are handled by the Play Store app). If feasible, this is a powerful, checkable claim. Confirm with the current Play Billing library before promising it.
- Before every release: run a network-traffic audit through a proxy to confirm no unexpected calls.
- Optional: publish a short "privacy architecture" page; open-source the prediction engine; later, request an independent privacy review.

**Backup and restore**

- Rely on the phone's own backups (iOS device backup; Android Auto Backup — encrypted with the device's screen-lock credentials on supported devices) plus the manual export/import file (F-11).
- **Do not build app-managed iCloud/CloudKit sync of cycle data** (Apple guideline 5.1.3(ii)).
- Android: include the database in backup rules and **test restores on real devices.**

**Export format**

- JSON (complete, versioned schema) and CSV.
- Optional password-protected export (Plus): AES-GCM with a key derived from the password (Argon2 or PBKDF2).

**Deletion**

- "Delete all data" erases the database, preferences, scheduled notifications and Keychain/Keystore items.

**Store labels**

- Apple: "Data Not Collected". Google: "No data collected · No data shared". **Only if verified true** by the network audit.

**Threat model**

| Threat | Mitigation |
|---|---|
| Company server breach or legal request to the company | No server; no data held |
| Leakage through third-party SDKs | No SDKs |
| Shared or borrowed phone | App lock, neutral icon, discreet notifications, blurred previews |
| Coerced access | App lock; panic wipe (v1.1). Be honest in the privacy page that data on an unlocked phone can be seen |
| Lost or broken phone | OS backup + export file |
| Accidental deletion or bad restore | Double confirmations; automatic safety copy before any replace |

### 12.6 Non-functional requirements

| Area | Requirement |
|---|---|
| Platforms | iOS (current + previous major version; confirm the cut-off at kick-off) and Android 8.0+ (confirm device share at kick-off); always target the API level Google currently requires |
| Performance | Cold start < 1.5 s on a 3-year-old mid-range phone; log a period in ≤ 2 taps from launch; smooth 60 fps calendar scrolling |
| Size | Download < 40 MB (stretch goal < 25 MB) |
| Offline | 100% of features work offline |
| Reliability | ≥ 99.5% crash-free sessions (App Store Connect / Android vitals); zero data loss across updates (migration tests in CI) |
| Accessibility | WCAG 2.2 AA-equivalent contrast; full screen-reader support; 200% text scaling; no colour-only meaning |
| Localisation | All strings externalised; locale-aware dates and numbers; RTL-ready |
| Privacy | Zero third-party network calls, verified by a proxy audit before each release |
| Data model | Versioned schema with tested migrations; versioned export format |
| Dates & time | Store calendar dates (not timestamps) for cycle data so travel and daylight-saving changes never shift a logged day |
| Battery | No background polling |

### 12.7 Recommended technical approach

| Option | Pros | Cons |
|---|---|---|
| **A. Cross-platform** (Flutter or React Native/Expo) | One codebase for both stores — roughly 1.2–1.4× the effort of a single native app instead of ~2× [A] | Widgets, watch and some notification/secure-storage work still need small native modules; slightly larger binaries |
| B. Native (SwiftUI + Kotlin/Jetpack Compose) | Best platform integration (widgets, Health, watch), smallest apps | ~2× the effort for two stores |
| C. iOS-first native, Android 2–3 months later | Fastest path to revenue in Western markets | Delays the platform where most installs are |

**Decision (§18): Option A — one cross-platform codebase for both stores.** Pick the framework the owner is most comfortable with (Flutter and React Native/Expo both fit), with small native modules for notifications, secure storage, biometrics and (later) widgets. Keep dependencies minimal and audit every library for network activity.

**Purchases:** use StoreKit 2 and Google Play Billing directly — a single one-time unlock doesn't need a third-party purchase SDK. If one is used (e.g., RevenueCat), it sends purchase metadata to a third party and must be disclosed in the privacy labels and policy.

### 12.8 Measuring success without trackers

- **App Store Connect App Analytics** (impressions, product-page views, conversion, downloads, and retention for users who agreed to share analytics with developers) and **Sales & Trends**.
- **Google Play Console** statistics, acquisition reports and Android vitals.
- Keyword rankings via ASO tools (free tiers or one-month trials).
- Plus purchases from store reports.
- Reviews, ratings and support emails.
- Optional: an external, anonymous, opt-in survey link in Settings ("How are we doing?").

---

## 13. Design direction

### 13.1 Principles

**Calm** · **Clear** · **Kind** · **Discreet** · **Inclusive** · **Accessible** · **Quick**

### 13.2 Visual direction

- **Palette:** a neutral base (warm off-white in light mode, deep charcoal in dark mode) with **one confident accent** (e.g., terracotta, berry or deep teal). Offer a pink theme for people who want it — but don't make pink the default identity. Check every palette with colour-blindness simulators.
- **Typography:** platform system fonts (SF Pro / Roboto) for speed and accessibility, or one well-hinted bundled typeface. Large, friendly numerals for "days until".
- **Shapes and imagery:** soft, rounded geometry; generous white space; abstract shapes instead of stock photos or cartoon mascots; subtle motion; light haptic feedback when logging.
- **Dark mode is mandatory**, not optional.

### 13.3 App icon and alternate icons

- Abstract mark (circle, arc or wave) that does not shout "period" on the home screen.
- 3–5 neutral alternate icons (one free, the rest in Plus). They must not imitate other apps or system apps (store rules).

### 13.4 Information architecture and screen list

Navigation: **3 tabs — Today · Calendar · History** — plus a Settings entry.

| # | Screen | Purpose |
|---|---|---|
| 1 | Onboarding (≤ 4 screens) | Promise, last period, typical lengths, notification choice |
| 2 | Today | Cycle day, next window, primary action, quick log |
| 3 | Calendar | Month view, logging any day |
| 4 | Day log (sheet) | Flow, symptoms, mood, notes |
| 5 | History & stats | Cycles list, summary stats, chart |
| 6 | Life events | List + add / end events |
| 7 | Reminders | Toggles, timing, discreet text, quiet hours |
| 8 | Privacy & data | Backup explanation, export, import/restore, delete all |
| 9 | Security | App lock, timeout, panic wipe (v1.1) |
| 10 | Appearance | Theme, alternate icons |
| 11 | Plus | Single calm screen; free-forever list; restore |
| 12 | About & safety | How predictions work, disclaimers, contact |
| 13 | Lock screen | PIN / biometrics |

### 13.5 Key UX patterns

- **One primary action** on Today ("Period started" / "Period ended" / "Log today").
- Logging in ≤ 2 taps; everything editable later; undo snackbar.
- Predictions drawn as soft outlined ranges; logged days solid; patterns or icons as well as colour.
- Empty states that teach ("Log two periods and predictions become personal").
- **No modal pop-ups** — except operating-system permission prompts and destructive confirmations.
- Late periods: neutral wording and three clear options.
- Sensitive items (sex, discharge) hidden by default and easy to enable.
- Pregnancy loss and similar events handled with care: neutral wording, option to pause reminders for a while.

### 13.6 Copy guidelines

Plain language, second person, inclusive. Use real words ("period", "cycle"), not euphemisms. Never imply certainty about health. Every piece of copy should pass the test: *would this embarrass someone if it appeared on their lock screen?*

### 13.7 Store creative

- 6–8 screenshots per platform per language, **message-led**: (1) "No account. No ads. No nagging." (2) "Know when it's coming — honest ranges" (3) "Discreet reminders" (4) "Life changes? Predictions adapt." (5) "Your data never leaves your phone" (6) "Beautiful in light and dark" (7) "The basics are free. Forever."
- A 15–30-second app preview video.
- Google Play feature graphic (1024 × 500).

### 13.8 Designer deliverables

Design system (colour tokens for light/dark, type scale, spacing, components) · app icon + alternates · all screens in light and dark mode and with large text · empty, error and loading states · notification copy deck · store screenshots and preview video storyboard · simple landing page.

---

## 14. Go-to-market & marketing plan

### 14.1 Strategy in one sentence

**Organic first:** store optimisation + **faceless** short-form content made by the owner (decided — §18) + genuine community participation + privacy-angle PR + Apple featuring. Paid ads only as small, capped experiments once there is an organic baseline.

### 14.2 Phases

**Pre-launch (weeks −8 to 0)**

- **Build in public:** weekly posts on TikTok, Instagram, Threads/X and relevant communities — e.g., "I'm building a period tracker that physically can't spy on you."
- **Landing page** with the promise, screenshots and a way to follow along. (If collecting emails for a waitlist, that is personal data — cover it in the website's privacy policy, or skip the waitlist and point to social accounts.)
- **Recruit testers:** at least 12 Android testers for Google's mandatory closed test (aim for ~20 as a buffer) and TestFlight testers on iOS.
- **Collect early testimonials** and the first questions people ask (they become FAQ entries and video topics).
- **Press kit:** icon, screenshots, one-page fact sheet, founder story, plain-language privacy explanation.
- **Apple featuring nomination** submitted several weeks before launch via App Store Connect [S49].
- **Localised store listings** ready (keywords researched per language, not just translated).

**Launch (weeks 0–2)**

- **Product Hunt** launch (Tuesday–Thursday), framed around "no account, no ads, no servers".
- **Hacker News "Show HN"** — technical audiences appreciate the no-backend architecture.
- **Reddit:** post only where self-promotion is allowed (app and indie-developer communities, privacy communities); in health and condition-specific communities, participate genuinely and follow each community's rules.
- **Privacy publications** that maintain "most private period apps" lists (e.g., Tuta's 2026 list [S72]) — pitch for inclusion once the app can prove its claims.
- **Local press** in the owner's home market (the "local developer" angle).
- **Gift Plus codes** (Apple offer codes / Google promo codes) to micro-creators (5K–50K followers) in health, privacy and lifestyle niches.

**After launch (months 1–12)**

- **Content engine:** 3 short videos per week for the first 12 weeks, then 2 per week. Content pillars:
  1. *Myth-busting* — "Only 13% of cycles are exactly 28 days" [S42]; "Why your app's prediction is probably wrong".
  2. *Privacy in action* — showing iOS App Privacy Report: "Here's what my period app sends: nothing."
  3. *Relatable humour* — supplies running out, reminders at the worst moment.
  4. *Build in public* — "You asked, I built it" feature drops.
  5. *Switching guides* — moving your history from another app (export/import).
- **Faceless formats (decided — §18):** screen recordings of the app with text overlays; hands-only phone shots; voice-over (your own voice, or none); text-on-screen myth-busting clips; carousels and infographics for Instagram and Pinterest (health and self-care infographics travel well there); written build-in-public posts on Reddit, Threads and X; short devlogs. Use one consistent visual template so the brand is recognisable without a face. Faceless accounts usually grow more slowly, so lean harder on ASO, Reddit and privacy press [A].
- **Reply to every review within 48 hours**; turn requests into visible updates.
- **Monthly ASO iteration;** screenshot A/B tests with Apple's Product Page Optimization and Google's Store Listing Experiments.
- **Calendar moments:** Data Privacy Day (28 January), Menstrual Hygiene Day (28 May), back-to-school (if a teen mode ships), and any major privacy news story.

### 14.3 App Store Optimisation (ASO) plan

| Field | Apple App Store | Google Play |
|---|---|---|
| Title | 30 characters — "[Brand]: Period Tracker" | 30 characters |
| Subtitle / short description | Subtitle, 30 characters — e.g., "Private · No ads · No account" | Short description, 80 characters |
| Keywords | Hidden keyword field, 100 characters (comma-separated; don't repeat words already in the title) | No keyword field — the full description (up to 4,000 characters) is indexed, so use keywords naturally |
| Other | Promotional text (170 characters, changeable without review) | Promotional content / events |

- **Seed keywords (English):** period tracker, period calendar, cycle tracker, menstrual, private period tracker, period tracker no ads, offline period tracker, simple period tracker, discreet, irregular periods, PMS, period reminder.
- **English-only launch (decided — §18):** still create separate App Store listings for English (U.S.), English (U.K.), English (Australia) and English (Canada), and custom store listings per country on Google Play, so keywords and wording can be tuned for each market.
- **When languages are added (v1.1 candidate), localise keywords, not just text** — e.g., German *Periodenkalender, Zyklus*; Spanish *calendario menstrual*; Brazilian Portuguese *calendário menstrual*; French *calendrier des règles*.
- **Research tools:** Apple Search Ads keyword popularity (free with an account), Google Play Console search-term reports, and a one-month trial of an ASO tool.
- **Ratings:** aim for ≥ 4.7; ask only at positive moments (F-16).

### 14.4 Paid acquisition — when and how

- **Not at launch.** Unit economics don't work: a US Health & Fitness install via Apple Ads costs ~$3.83 [E][S45], while our expected revenue per install is ~$0.21 (2.5% × $8.25 net) [A].
- **Small experiments only, after organic traction:** brand-name keywords on Apple Ads once people search for the brand; capped tests (≤ $100–200/month) on long-tail keywords in cheaper markets. Stop any campaign whose cost per purchase exceeds the net value of a purchase.
- **Creators:** start with product gifting; pay for posts only when the audience fits closely and the price is below the expected return.

### 14.5 PR angles

1. "A period tracker with no servers — so there is nothing to hand over."
2. "A first-time developer who got tired of paywalls and ads" (only if it is the owner's genuine story).
3. "Only 13% of cycles are 28 days — why period apps are so often wrong."
4. "The tracker that handles pregnancy, birth and loss with care."
5. Local-developer story for home-market media.
6. "An accessibility-first period tracker."

### 14.6 Community and retention

- A simple public roadmap page and a monthly changelog.
- A visible feedback channel (email) and credit for users whose ideas ship (in the changelog — never as pop-ups).

---

## 15. Administrative & launch checklist

### 15.1 Individual or company account?

| | Individual | Company (sole proprietorship, LLC, d.o.o., GmbH…) |
|---|---|---|
| Setup time | Fastest | Days to weeks, plus a D-U-N-S number (free) |
| Name shown on the stores | Your legal name | Company name |
| Google's 12-tester / 14-day closed test | **Applies** (personal accounts created after 13 Nov 2023) [S52] | **Exempt** (organisation accounts) |
| Public contact details | Google shows a physical address for monetised apps [S54]; EU trader status shows address, phone and email [S50] | Company address and contact details |
| Liability | Personal | Limited (depending on legal form) |
| Accounting | Personal income tax | Company bookkeeping costs |
| Recommendation [A] | Fine for a first, low-revenue launch | Better if aiming to earn money and to keep a home address private |
| **Decision (§18)** | ✓ **Chosen** | – |

### 15.2 Checklist

**A. Business and legal**

- [x] Individual account chosen (§18). Still to do: check your country's rules for registering as self-employed / sole trader once the app earns money (often required for regular income) and how app income is reported.
- [ ] Bank account able to receive store payouts.
- [ ] Trademark search for the chosen name; consider registering it in key markets.
- [ ] Domain (.com or .app), professional email address, landing page.
- [ ] Ask an accountant how app income is taxed locally. (Apple and Google collect and remit VAT/sales tax in most countries — confirm what that means for you.)
- [ ] Lawyer review: privacy policy, terms/EULA, disclaimers, store copy (medical-claims check), fertile-window decision.

**B. Store accounts**

- [ ] Apple Developer Program ($99/year).
- [ ] Apply for the App Store Small Business Program (15% commission).
- [ ] Sign the Paid Apps Agreement; add banking and tax information (e.g., W-8BEN for non-US individuals, W-8BEN-E for non-US companies, W-9 for US persons).
- [ ] Set **EU Digital Services Act trader status** in App Store Connect — as an EU-based individual selling Plus, you will most likely count as a "trader", so your address, phone and email will be shown on EU product pages [S50].
- [ ] Google Play Console ($25 one-time), identity verification, payments profile.
- [ ] Physical address for monetised Google Play apps (publicly displayed) — with an individual account this will be your own address unless you use a business or virtual-office address the stores accept; check the current rules first [S54].
- [ ] **Personal Google account (decided):** plan the 12-tester × 14-day closed test (≈ 3 weeks including recruitment; recruit ~20 testers as a buffer) [S52].

**C. Documents to publish on the website**

- [ ] **Privacy policy** — accurate and specific: no data collected by the developer; data stored only on the device; purchases processed by Apple/Google; how support emails are handled; that device backups are controlled by the user's Apple/Google account; a consumer-health-data section for US state laws such as Washington's; contact details; effective date.
- [ ] **Terms of use / EULA** (Apple's standard EULA is acceptable on iOS) + medical disclaimer.
- [ ] **Support / FAQ page** — backup and restore, switching phones, Android battery-saver settings for reliable reminders, how predictions work, how to delete all data.
- [ ] **Press kit page.**
- [ ] (Optional) Accessibility statement.

**D. Store forms and declarations**

*Apple*
- [ ] App Privacy questionnaire → "Data Not Collected" (only if verified).
- [ ] Age-rating questionnaire.
- [ ] Regulated medical device declaration → "No" [S47].
- [ ] Export-compliance (encryption) questions — the app uses only the operating system's standard encryption; answer accordingly.
- [ ] Accessibility Nutrition Labels.
- [ ] In-app purchase (non-consumable) with review screenshot; Family Sharing enabled.
- [ ] App Review notes: no account needed, local-only data, where the disclaimers are.
- [ ] Featuring nomination [S49].

*Google*
- [ ] Data safety form.
- [ ] Health apps declaration (period tracking) [S53].
- [ ] Content rating questionnaire (IARC).
- [ ] Target audience and content (not designed for children unless a teen mode is decided later; then the Families policy applies).
- [ ] Ads declaration: "No ads".
- [ ] One-time managed product in Play Billing.
- [ ] Closed-testing track → production access application.
- [ ] Health Connect declaration (only when the v1.1 integration ships).

**E. Store listing assets (for each language)**

- [ ] Title, subtitle (iOS), keyword field (iOS), promotional text (iOS), description, short description (Google), release notes.
- [ ] Screenshots in the sizes App Store Connect and Play Console require (consider iPhone-only at launch to avoid iPad assets and layouts), app preview video, Google feature graphic, icon.
- [ ] Support URL, marketing URL, privacy-policy URL.

**F. Pre-submission quality assurance**

- [ ] Prediction-engine unit tests pass; manual test matrix across iOS versions and Android manufacturers.
- [ ] Notification reliability verified over ≥ 2 weeks on real devices (including Samsung and Xiaomi).
- [ ] Backup/restore verified: phone-to-phone migration, OS backup restore, export/import round trip.
- [ ] Network audit: zero third-party calls.
- [ ] Accessibility audit (VoiceOver, TalkBack, large text).
- [ ] Native-speaker review of every localisation.
- [ ] Legal copy check against §8.4.

**G. Recurring operations**

- [ ] Reply to reviews within 48 hours.
- [ ] Check crashes weekly (App Store Connect, Android vitals).
- [ ] Monthly ASO review.
- [ ] Yearly: renew the Apple membership; update for the new iOS and Android versions each autumn; raise the Android target API level before Google's August deadline; re-check privacy labels and declarations whenever anything changes.
- [ ] Keep a changelog; keep the export format backward-compatible.

---

## 16. Timeline & cost estimate

### 16.1 Timeline

Assumes one experienced developer at ~25–30 hours/week plus a part-time designer [A]. Roughly halve the calendar time for a full-time developer; add 50–100% for a first-time developer.

| Phase | Weeks | Output |
|---|---|---|
| 0. Decisions & setup | 1–2 | Answers to §18; name shortlist; store accounts opened; D-U-N-S requested (if company) |
| 1. Design | 2–4 | Design system, key screens, clickable prototype tested with 5–8 target users |
| 2. Core build | 4–9 | Onboarding, Today, calendar, logging, prediction engine, life events, settings |
| 3. Reminders, security, data | 8–11 | Notifications, app lock, export/import, backup/restore tests |
| 4. Purchase, accessibility, localisation | 10–12 | Plus purchase + tip jar, accessibility pass, localisation-ready strings (English only at launch) |
| 5. Beta | 12–14 | TestFlight + Google closed test (≥ 12 testers × 14 days); bug fixes |
| 6. Store prep & submission | 13–15 | Listings, screenshots, forms, legal review, submission (Apple usually reviews within 1–2 days; new Google accounts can take several days) |
| 7. Launch | 15–16 | Launch plan executed (§14) |

**Total: ~14–16 weeks (≈ 3.5–4 months) part-time; ~8–10 weeks full-time.**

### 16.2 Cost estimate (USD, year 1) [A]

| Item | Owner builds (DIY) — **chosen** | Lean outsourced | Notes |
|---|---|---|---|
| Apple Developer Program | 99 / year | 99 / year | |
| Google Play Console | 25 one-time | 25 one-time | |
| Domain + email | 15–75 | 15–75 | |
| Landing page hosting | 0–120 | 0–120 | A static site is enough |
| Legal review | 300–1,500 | 300–1,500 | Start from reputable templates, then have a local lawyer review |
| Trademark search / registration | 0–1,200 | 0–1,200 | Depends on the number of jurisdictions |
| Design (icon, UI kit, store assets) | 0–800 | 1,500–5,000 | |
| Translations (4–5 languages, ~3,000 words) | 0 at launch (English only — decided); 300–1,000 when languages are added | 1,000–2,500 | Machine translation + native-speaker review is the budget option |
| Development | 0 (own time) | 10,000–30,000 | 300–600 hours × $30–50/h |
| Test devices | 0–300 | 0–300 | Used Android phones are fine |
| ASO tool (1–2 months) | 0–200 | 0–200 | Optional |
| Marketing (gifting, small tests) | 0–1,200 | 0–1,200 | Mostly the owner's time |
| **Total, year 1** | **≈ $450–5,500** (typical ≈ $1,200–1,500) | **≈ $13,000–42,000** | |

**Ongoing per year:** Apple $99; domain/email/hosting ~$15–200; ~20–60 hours of maintenance (yearly OS updates, store requirements, fixes).

---

## 17. KPIs, milestones & kill criteria

### 17.1 KPIs and targets [A]

Measured with store dashboards only — no in-app analytics (§12.8).

| KPI | Why it matters | Day 90 | Month 6 | Month 12 |
|---|---|---|---|---|
| Installs per day (both stores) | Discovery | 10–30 | 40–80 | 70–150 |
| Store-page conversion (views → installs) | Listing quality | Baseline | +20% vs baseline | +40% vs baseline |
| Retention (App Store Connect / Play "retained installers") | Real value | At or above the peer median shown in Play Console | Above peer median | Above peer median |
| Average rating | Trust and ranking | ≥ 4.6 | ≥ 4.7 | ≥ 4.7 |
| Number of ratings (all stores) | Social proof | 50 | 300 | 1,000 |
| Crash-free sessions | Quality | ≥ 99.5% | ≥ 99.7% | ≥ 99.7% |
| Plus conversion (purchases ÷ installs) | Monetisation | ≥ 1.5% | ≥ 2% | ≥ 2.5% |
| Net revenue per month | Sustainability | – | $200–400 | $500–1,000 |
| Long-tail keywords ranked top-10 (main language) | Discoverability | 2 | 5 | 10 |
| Followers on the main social platform | Owned audience | 500 | 2,000 | 5,000 |

### 17.2 Milestones (stage gates)

| Milestone | When | Pass criteria |
|---|---|---|
| M1 — Prototype test | Week 4 | ≥ 6 of 8 test users complete the core tasks unaided; ≥ 5 of 8 say they would switch |
| M2 — Beta complete | Week 14 | ≥ 20 testers; zero data-loss bugs; reminders reliable on every test device |
| M3 — Launch | Week 16 | Live on both stores |
| M4 — Day-90 review | Launch + 90 days | Compare with §17.1; adjust marketing and roadmap |
| M5 — Month-6 decision | Launch + 6 months | Continue / pivot / maintenance-only (§17.3) |

### 17.3 Kill / pivot criteria (month 6)

Stop active investment or pivot if **two or more** are true:

- Fewer than **15 installs/day** on average in month 6 despite consistent marketing.
- Average rating below **4.3**.
- Plus conversion below **1%**.
- Fewer than **1,000 total installs**.
- The owner can no longer sustain the marketing effort.

**Options at that point:** maintenance-only mode (keep the app live with minimal updates — ~$99/year); pivot to the perimenopause niche reusing the prediction engine and logging (§10.6); or open-source the app for reputation and portfolio value.

---

## 18. Owner decisions

Recorded on 1 November 2026 after walking through the open questions. The "Recommended" column shows what this document advised; where the owner chose differently, the consequences are listed in §18.2.

### 18.1 Decision log

| # | Topic | Recommended | **Decision** | Status |
|---|---|---|---|---|
| D1 | Home country | – | **An EU country** | ⏳ Exact country still to confirm (taxes, self-employment rules) |
| D2 | Who builds it | Owner-built, or freelance ≤ ~$15K | **The owner builds it** | ✅ As recommended |
| D3 | Developer account | Company | **Individual** | ⚠️ Differs — see §18.2 |
| D4 | Platforms | Both, cross-platform | **Both, one cross-platform codebase** | ✅ As recommended |
| D5 | Launch languages | English + 3–5 others | **English only** (localisation-ready) | ⚠️ Differs — see §18.2 |
| D6 | Monetisation | Free core + one-time Plus | **Free core + one-time Plus + optional tip jar; no ads** | ✅ As recommended (+ tip jar) |
| D7 | Fertile-window estimate | Build, off by default, legal check | **Build, off by default, legal check** | ✅ As recommended |
| D8 | Marketing | Owner on camera | **Owner creates the content, faceless** | ⚠️ Differs — see §18.2 |
| D9 | App name | Shortlist + trademark check | **Decide later** | ⏳ Needed before store accounts, icon and screenshots |
| D10 | Teens | No teen focus, standard rating | **No teen focus, standard rating** | ✅ As recommended |
| D11 | Openness | Privacy page now, engine later | **Privacy-architecture page; maybe open-source the engine later** | ✅ As recommended |

**Ads were considered and rejected (D6).** An ad SDK would require a consent pop-up on first launch for EU/UK users (Google has required a certified consent tool for ads in the EEA, UK and Switzerland since 2024 [S74]), would end the "No ads" and "Data Not Collected" claims, and would share device data from a period app with ad networks — a legal risk under US consumer-health laws such as Washington's [S58]. In return it would earn little: banner ads pay roughly $0.30–2 per 1,000 impressions in the US and Western Europe [E][S75], so roughly $25–100 per month in the base case [A]. The tip jar gives price-sensitive users a cheap way to support the app without any of those costs.

### 18.2 What the decisions change

| Decision | Consequence | What to do |
|---|---|---|
| **Individual account (D3)** | Your legal name appears as the seller on both stores. Google's 12-tester × 14-day closed test applies to every new app [S52]. Once the app earns money, Google shows a physical address publicly [S54]; as an EU-based seller you will most likely count as a DSA "trader", so Apple shows your address, phone and email on EU product pages [S50] | Recruit ~20 Android testers early (§14.2). Decide whether you are comfortable with your home address being public — if not, check whether a business or virtual-office address is accepted, or revisit D3 before turning on purchases. Check your country's rules on registering as self-employed once income starts |
| **English only (D5)** | Store-search reach is limited to English-speaking storefronts (the most competitive, but also the highest-paying); no home-market beachhead | Use the separate English store localisations (U.S., U.K., Australia, Canada) to tune keywords per market (§14.3). Keep the app localisation-ready (F-15). Re-evaluate at the day-90 review — adding 1–4 languages is the cheapest growth lever available |
| **Faceless marketing (D8)** | Reach and trust usually build more slowly than with founder-on-camera content [A] | Use the faceless formats in §14.2; post consistently with one recognisable template; lean harder on ASO, Reddit and privacy press. Expect the base case to take 12–18 months rather than 12 (§10.3) |
| **Owner builds it (D2)** | Cash cost ≈ $450–5,500 in year 1 (typical ≈ $1,200–1,500); break-even sits inside the base case (§10.4) | Keep v1.0 strictly to the MUST items in §12.2; still budget for the legal review and for icon/design help |
| **Tip jar (D6)** | Small extra income (≈ $150–300 in the base case [A]); no effect on privacy labels | Implement as three consumable in-app purchases (F-13) |

### 18.3 Still open

1. **Exact EU country** — determines business registration, income-tax treatment, and whether a business/virtual address is a practical option.
2. **App name and brand (D9)** — follow §11.5; must be fixed before opening store listings, designing the icon and producing screenshots.
3. **Legal check for the fertile-window switch (D7)** — schedule it together with the privacy-policy review (§15.2 A).
4. **Launch-language review** — revisit at the day-90 milestone (§17.2).

---

## Appendix A — Raw data snapshot (1 November 2026)

### A.1 US App Store — iTunes Search API results for "period tracker" [V][S4]

| Search rank | App | Seller | Avg. rating | US ratings | First released |
|---|---|---|---|---|---|
| 1 | Flo Cycle & Period Tracker | FLO HEALTH UK LIMITED | 4.74 | 2,011,046 | 2015-10 |
| 2 | Period Tracker Period Calendar | ABISHKKING LIMITED | 4.92 | 174,779 | 2014-09 |
| 3 | Period Tracker by GP Apps | GP International LLC | 4.82 | 78,994 | 2009-10 |
| 4 | Stardust Period Tracker | Stardust App LLC | 4.76 | 120,204 | 2020-01 |
| 5 | Clue Period & Cycle Tracker | BioWink GmbH | 4.76 | 406,898 | 2013-07 |
| 6 | Period Tracker and Calendar | AppManage LLC | 4.78 | 54,577 | 2015-08 |
| 7 | Lively – Period Tracker, Cycle | Lively Cycle, LLC | 4.81 | 55,446 | 2023-06 |
| 8 | Period Tracker ⋆ | LUCKY LABS LP | 4.72 | 25,470 | 2021-11 |
| 9 | My Cycle | Aleksei Neiman | 4.80 | 103,768 | 2019-06 |
| 10 | Glow Eve Period Tracker | Glow, Inc. | 4.67 | 114,377 | 2015-07 |
| 11 | Musa: Period & Pregnancy | Musa Health Inc | 4.80 | 11,957 | 2024-07 |
| 12 | Ovia Cycle & Pregnancy Tracker | Ovuline, Inc. | 4.83 | 90,842 | 2012-12 |
| 13 | Clover – Period Tracker & Cycle | Wachanga LTD | 4.63 | 23,648 | 2018-08 |
| 14 | Life – Period Tracker Calendar | Life Fertility Tracker IVS | 4.76 | 62,890 | 2013-09 |
| 15 | Melda Cycle & Period Tracker | PlusMinusOne, Inc. | 4.75 | 495 | 2026-04 |
| 16 | Period Tracker | Sevenlogics, Inc. | 4.57 | 8,297 | 2013-10 |
| 17 | Glow Ovulation & Period App | Glow, Inc. | 4.71 | 75,051 | 2013-08 |
| 18 | Femometer Fertility Tracker | BONGMI LIMITED | 4.90 | 70,932 | 2017-08 |
| 19 | Cycles: Period & Cycle Tracker | Perigee AB | 4.70 | 27,301 | 2013-02 |
| 20 | MeetYou – Period Tracker | Hangzhou Youzijie Information Technology | 4.55 | 16,142 | 2022-03 |
| 21 | Premom – Ovulation Tracker, PCOS | Easy Healthcare Corporation | 4.78 | 60,821 | 2017-10 |
| 22 | MyFlo Period Tracker Calendar | FLO Living LLC | 4.45 | 14,298 | 2016-11 |
| 23 | Bloomra: Period Tracker | New Life Fed HR Solutions LLC | 4.60 | 5 | 2026-05 |
| 24 | IVY Period & Pregnancy Tracker | String Health, Inc. | 4.66 | 67,896 | 2011-05 |
| 25 | My period calendar Pinkllama | Llama Luna Apps Inc | 4.79 | 19,232 | 2020-01 |
| 26 | Period Tracker: Monthly Cycles | Hangzhou Beesoft Information Technology | 3.97 | 3,811 | 2010-04 |
| 27 | Spot On Period Tracker | Planned Parenthood Direct, Inc. | 4.24 | 15,398 | 2016-03 |
| 28 | Period Tracker · | Luni | 4.63 | 3,603 | 2020-07 |

### A.2 Google Play — search results for "period tracker" (US) [V][S6][S8][S10][S11][S70]

| Search rank | App | Developer | Installs | Ratings | Avg. | Ads | IAP |
|---|---|---|---|---|---|---|---|
| 1 | Period Calendar Period Tracker | Simple Design Ltd. | 100M+ | ~4.9M | 4.9 | Yes | Yes |
| 2 | Flo Ovulation & Period Tracker | Flo Health Inc. | 100M+ | ~5.17M | 4.7 | No | Yes |
| 3 | Period Tracker and Calendar | SimpleInnovation | 10M+ | 559,748 | 4.87 | Yes | Yes |
| 4 | Period Tracker | GP International LLC | 10M+ | 357,594 | 4.43 | Yes | Yes |
| 5 | Ovulation & Period Tracker | Leap Fitness Group | 10M+ | 456,121 | 4.84 | Yes | Yes |
| 6 | Stardust Period Tracker | Stardust App Inc | 1M+ | 23,274 | 4.53 | No | Yes |
| 7 | Clue: Period & Cycle Tracker | Clue Period Tracker by BioWink | 50M+ | ~1.51M | 4.5 | No | Yes |
| 8 | Lunavi: Offline Period Tracker | Abhi Labs | 5K+ | 122 | 4.85 | No | Yes |
| 9 | Period Tracker | Clearblue | 100K+ | 2,067 | 4.60 | No | No |
| 10 | Clover: Period & Cycle Tracker | Wachanga | 10M+ | 314,987 | 4.55 | Yes | Yes |
| 11 | Musa: Period & Self-Care Pet | Musa Health, Inc. | 1M+ | 33,034 | 4.52 | No | Yes |
| 12 | Period Tracker & Ovulation | Living Better | 1M+ | 37,969 | 4.85 | Yes | Yes |
| 13 | Ovia Cycle & Pregnancy Tracker | Ovia Health | 1M+ | 81,954 | 4.52 | No | No |
| 14 | Luna Teen Period Tracker | Dotty Apps | 100K+ | 1,028 | 4.52 | No | Yes |
| 15 | MeetYou – Period Tracker | MEETYOU PTE. LTD. | 10M+ | 202,138 | 4.73 | No | Yes |
| 16 | Period and Ovulation Tracker | SMSROBOT LTD | 10M+ | 177,698 | 4.76 | Yes | Yes |
| 17 | Symptom, Mood & Period Tracker | Bearable | 500K+ | 10,617 | 4.59 | No | Yes |
| 18 | Lively – Period Tracker, Cycle | Lively Cycle, LLC | 500K+ | 24,035 | 4.69 | No | Yes |
| 19 | GetMyMood: Period Tracker | GetMyMood Inc. | 1K+ | 41 | 4.94 | No | Yes |
| 20 | Ovulation Tracker App – Glow | Glow Inc | 1M+ | 74,292 | 4.14 | No | Yes |
| – | Natural Cycles – Birth Control | NaturalCycles AG | 1M+ | 23,513 | 4.41 | No | No (sold via web) |

### A.3 Selected targeted searches, US App Store [V][S4]

| Search | Notable results (US ratings) |
|---|---|
| "private period tracker" / "offline period tracker" | Emberly (1), Private Period Tracker (0), Enria (7), LunaSafe (1), Luna: Private (2), iPeriod Period Tracker + ($1.99, 2,697) |
| Open-source / non-profit | Euki (162), drip (59) |
| "perimenopause tracker" | Menelle (196), Health & Her (956), Balance (1,155), Caria (1,430) |
| "teen period tracker" | Luna Teen (2,513), Pinkllama (19,232), Soso (814), Magicgirl (1,760) |

### A.4 In-app purchase price points observed (US, Apple) [V][S14–S19]

| App | Price points (USD) | Data date |
|---|---|---|
| Flo | 1.99 · 7.49 · 11.49 · 14.99 · 14.99 · 43.99 · 47.99 · 49.99 · 59.99 | Mar 2026 |
| Clue | 9.99 (monthly) · 29.99 · 39.99 (yearly) | Mar 2026 |
| Period Tracker Period Calendar | 0.99 (7-day) · 1.49 (weekly) · 9.99 (monthly) · 39.99 · 49.99 (yearly) · 2.99 (remove ads) | Apr 2026 |
| Stardust | 2.99–4.99 ("All Access") · 6.99 (monthly) · 24.99–39.99 (annual) | Apr 2026 |
| Lively | 2.99 (weekly) · 4.99 (monthly) · 18.99–39.99 (annual) · 19.99–49.99 (unlabelled) | Apr 2026 |
| Natural Cycles | 21.99 · 28.49 (monthly) · 149.99 · 194.99 (annual) | Apr 2026 |

---

## Appendix B — Sources

*All accessed 1 November 2026 unless a date is given.*

**Store charts and listings**

- **[S1]** Apple iTunes RSS — US Health & Fitness Top Free: https://itunes.apple.com/us/rss/topfreeapplications/limit=200/genre=6013/json
- **[S2]** Apple iTunes RSS — US Health & Fitness Top Grossing: https://itunes.apple.com/us/rss/topgrossingapplications/limit=200/genre=6013/json
- **[S3]** Same feeds for other storefronts (replace `us` with `gb`, `de`, `fr`, `br`, `in`, `au`, `ca`, `hr`, `rs`)
- **[S4]** iTunes Search API, US store: https://itunes.apple.com/search?term=period+tracker&entity=software&country=us&limit=30 (plus searches for "private period tracker", "offline period tracker", "euki", "drip period", "perimenopause tracker", "teen period tracker")
- **[S5]** Flo — App Store: https://apps.apple.com/us/app/flo-cycle-period-tracker/id1038369065
- **[S6]** Flo — Google Play: https://play.google.com/store/apps/details?id=org.iggymedia.periodtracker
- **[S7]** Clue — App Store: https://apps.apple.com/us/app/clue-period-cycle-tracker/id657189652
- **[S8]** Clue — Google Play: https://play.google.com/store/apps/details?id=com.clue.android
- **[S9]** Period Tracker Period Calendar (ABISHKKING) — App Store: https://apps.apple.com/us/app/period-tracker-period-calendar/id896501514
- **[S10]** Period Calendar Period Tracker (Simple Design) — Google Play: https://play.google.com/store/apps/details?id=com.popularapp.periodcalendar
- **[S11]** Google Play search "period tracker" (US): https://play.google.com/store/search?q=period%20tracker&c=apps&hl=en_US&gl=US
- **[S12]** AppBrain — Period Calendar (download estimates): https://www.appbrain.com/app/com.popularapp.periodcalendar
- **[S13]** AppBrain — Period Tracker and Calendar (SimpleInnovation): https://www.appbrain.com/app/com.lbrc.PeriodCalendar
- **[S63]** Lively — App Store: https://apps.apple.com/us/app/lively-period-tracker-cycle/id6447674634
- **[S64]** Musa — App Store: https://apps.apple.com/us/app/musa-period-pregnancy/id6504586102
- **[S65]** Stardust — App Store: https://apps.apple.com/us/app/stardust-period-tracker/id1495829322
- **[S66]** My Cycle — App Store: https://apps.apple.com/us/app/my-cycle/id1459096552
- **[S67]** Lunavi — Google Play: https://play.google.com/store/apps/details?id=com.abhilabs.lunavi
- **[S68]** Euki — App Store: https://apps.apple.com/us/app/id1469213846
- **[S69]** drip — App Store: https://apps.apple.com/us/app/id1584564949
- **[S70]** Google Play listings of the other apps in Appendix A.2 (e.g., https://play.google.com/store/apps/details?id=com.lbrc.PeriodCalendar, …id=com.period.tracker.lite, …id=periodtracker.pregnancy.ovulationtracker, …id=com.stardust.app, …id=com.wachanga.womancalendar, …id=com.musa.musa, …id=com.app.lively_app, …id=com.naturalcycles.cordova)

**Pricing**

- **[S14]** App Pricing Lab — Flo (Mar 2026): https://apppricinglab.com/app/apple/1038369065
- **[S15]** App Pricing Lab — Clue (Mar 2026): https://apppricinglab.com/app/apple/657189652
- **[S16]** App Pricing Lab — Period Tracker Period Calendar (Apr 2026): https://apppricinglab.com/iap/apple/896501514
- **[S17]** App Pricing Lab — Stardust (Apr 2026): https://apppricinglab.com/app/apple/1495829322
- **[S18]** App Pricing Lab — Lively (Apr 2026): https://apppricinglab.com/app/apple/6447674634
- **[S19]** App Pricing Lab — Natural Cycles (Apr 2026): https://apppricinglab.com/app/apple/765535549
- **[S20]** Flo Help Center — subscription prices: https://help.flo.health/hc/en-us/articles/4411278780564-What-is-the-price-for-a-Flo-subscription
- **[S73]** Natural Cycles — NC° Band: https://www.naturalcycles.com/devices/nc-band

**Companies, revenue and marketing**

- **[S21]** TechCrunch — Flo raises $200M at a $1B valuation (30 Jul 2024): https://www.techcrunch.com/2024/07/30/fertility-tracking-app-flo-health-raises-200m-at-a-1b-valuation
- **[S22]** YesPress — Flo Health news (80M MAU, Aug 2026): https://yespress.io/flo-health-inc
- **[S23]** Flo revenue estimates — Dealroom: https://dealroom.co/companies/flo-1/ · Similarweb: https://www.similarweb.com/company/flo.health · Business of Apps: https://www.businessofapps.com/?p=101518
- **[S24]** Screensdesign — period tracker category and app revenue estimates: https://screensdesign.com/categories/period-tracker-apps/ · https://screensdesign.com/apps/clue-period-cycle-tracker/
- **[S25]** Adapty paywall library — Lively estimates: https://adapty.io/paywall-library/lively-cycle-period-tracker/
- **[S60]** Clue company news — tech.eu (Jan 2023 layoffs): https://tech.eu/2023/01/19/period-tracking-startup-clue-cuts-its-workforce-by-25-per-cent · Legal500 (Verdane investment, 2026): https://www.legal500.com/developments/?p=56280 · Wikipedia: https://en.wikipedia.org/wiki/Clue_(mobile_app)
- **[S61]** Flo marketing — House of Marketers TikTok case study: https://www.houseofmarketers.com/flo-health-tiktok-influencer-case-study/ · Flo job posting (organic social / TikTok): https://job-boards.greenhouse.io/flohealth/jobs/7684911003

**Privacy testing and litigation**

- **[S26]** Mozilla Foundation — Euki privacy review (Nothing Personal, 2026): https://www.mozillafoundation.org/en/nothing-personal/euki-privacy-review/
- **[S27]** PPC Land — summary of Mozilla's July 2026 period-tracker review (scores and findings): https://ppc.land/mozilla-rates-stardust-2-of-10-over-symptom-data-sent-to-third-parties/
- **[S28]** Malwarebytes — Meta accessed women's health data from Flo without consent (Aug 2025): https://www.malwarebytes.com/blog/news/2025/08/meta-accessed-womens-health-data-from-flo-app-without-consent-says-court
- **[S29]** Fierce Healthcare — Meta found liable: https://www.fiercehealthcare.com/digital-health/meta-found-liable-abusing-consumer-reproductive-health-data-run-targeted-ads
- **[S30]** Labaton — Frasco v. Flo Health case page: https://www.labaton.com/Cases/Frasco-v-Flo-Health-Inc
- **[S31]** Settlement amounts (Google $48M, Flo $8M, Flurry $3.5M): https://allaboutcookies.org/flo-class-action-due-date
- **[S32]** FTC's 2021 Flo Health order (summary): https://fredlaw.com/alert-the-non-hipaa-regulation-of-health-data
- **[S62]** Stardust data-sharing coverage: https://allaboutcookies.org/stardust-shared-users-health-data · https://www.scworld.com/brief/period-tracking-app-stardust-shares-sensitive-user-data-with-third-parties-report-finds
- **[S72]** Tuta — best secure and private period apps 2026: https://tuta.com/blog/best-period-apps

**Market size and research**

- **[S33]** Mordor Intelligence — menstrual health apps market: https://www.mordorintelligence.com/industry-reports/menstrual-health-apps-market
- **[S34]** Fortune Business Insights: https://www.fortunebusinessinsights.com/menstrual-health-apps-market-118738
- **[S35]** Towards Healthcare: https://www.towardshealthcare.com/insights/menstrual-health-apps-market-sizing
- **[S36]** Research and Markets: https://www.researchandmarkets.com/reports/6246106/menstrual-health-apps-market-size-share-and
- **[S37]** Neiman et al., *Contraception* (Mar 2025), summary: https://www.iotm2mcouncil.org/iot-library/news/connected-health-news/period-tracking-app-use-increases-despite-dobbs-ruling/
- **[S38]** Duke / CHI 2024 privacy study (183 women): https://today.duke.edu/2024/05/data-privacy-post-roe-era · Pharmacy Times summary: https://pharmacytimes.com/view/post-roe-how-safe-are-period-tracking-smartphone-apps-
- **[S39]** KFF figure via Spectrum News (Aug 2022): https://spectrumnews1.com/ca/la/la-times-today/2022/08/04/how-secure-is-data-from-period-tracking-apps--
- **[S40]** JMIR 2024 — Millennial and Gen Z period-tracker use (n=700): https://www.jmir.org/2024/1/e53146
- **[S41]** University of Washington — period tracking apps failing users in basic ways (CHI 2017): https://washington.edu/news/2017/05/02/period-tracking-apps-failing-users-in-basic-ways-study-finds
- **[S42]** Bull et al., *npj Digital Medicine* 2019 — 612,613 menstrual cycles: https://pmc.ncbi.nlm.nih.gov/articles/PMC6710244

**Benchmarks**

- **[S43]** RevenueCat — State of Subscription Apps 2026: https://www.revenuecat.com/state-of-subscription-apps/
- **[S44]** Adapty — Health & Fitness subscription benchmarks: https://adapty.io/blog/health-fitness-app-subscription-benchmarks/
- **[S45]** AppTweak — Apple Ads benchmarks 2026: https://www.apptweak.com/en/aso-blog/apple-ads-benchmarks
- **[S71]** Chargebee — Global Consumer Insights 2025 (subscription attitudes): https://go.chargebee.com/rs/463-NSB-124/images/Chargebee-Global-Consumer-Insights-2025.pdf
- **[S75]** In-app ad revenue (eCPM) estimates — MonetizeMore: https://www.monetizemore.com/blog/how-much-ad-revenue-can-apps-generate/ · ReachEffect: https://reacheffect.com/blog/how-much-can-an-app-make-from-advertising/

**Regulation and store policy**

- **[S46]** Apple — App Store Review Guidelines (1.4.1, 5.1.3): https://developer.apple.com/app-store/review/guidelines/
- **[S47]** Apple — Declare regulated medical device status: https://developer.apple.com/help/app-store-connect/manage-app-information/declare-regulated-medical-device-status · 9to5Mac (Mar 2026): https://9to5mac.com/2026/03/26/new-app-store-policy-requires-medical-device-disclosures-for-some-health-apps/
- **[S48]** Apple — Track your period with Cycle Tracking: https://support.apple.com/120356
- **[S49]** Apple — Nominate your app for featuring: https://developer.apple.com/help/app-store-connect/manage-featuring-nominations/nominate-your-app-for-featuring
- **[S50]** TechCrunch — Apple removes EU apps without trader contact info (Feb 2025): https://techcrunch.com/2025/02/18/apple-purges-apps-without-contact-info-from-eu-app-store-as-dsa-deadline-hits
- **[S51]** AppleInsider — age verification mandatory in Texas (Jun 2026): https://appleinsider.com/articles/26/06/03/age-verification-now-mandatory-for-app-store-users-in-texas
- **[S52]** Google Play Console Help — testing requirements for new personal developer accounts: https://support.google.com/googleplay/android-developer/answer/14151465
- **[S53]** Google Play Console Help — Health apps declaration: https://support.google.com/googleplay/android-developer/answer/14738291
- **[S54]** Google Play Console Help — developer physical address requirement: https://support.google.com/googleplay/android-developer/answer/13962
- **[S55]** Covington — FDA revised General Wellness guidance (Jan 2026): https://www.cov.com/en/news-and-insights/insights/2026/01/fda-issues-revised-guidance-on-general-wellness-products
- **[S56]** Mondaq / Lenz & Staehelin — Swiss court: fertility tracker app is a medical device: https://www.mondaq.com/life-sciences-biotechnology-nanotechnology/1246458/software-as-a-medical-device-swiss-federal-administrative-court-confirms-fertility-tracker-app-is-a-medical-device · FemTech Insider — Ovy certified Class IIb (Apr 2025): https://femtechinsider.com/german-cycle-tracking-app-receives-mdr-certification-as-contraceptive-medical-device/
- **[S57]** Hardian Health — Are fertility tracking apps regulated?: https://www.hardianhealth.com/insights/fertility-apps-medical-device-regulation
- **[S58]** Washington My Health My Data Act — Stoel Rives FAQ: https://www.stoel.com/legal-insights/legal-updates/faq-washington-state%E2%80%99s-%E2%80%98my-health-my-data-act%E2%80%99 · terms.law: https://terms.law/washington-mhmda-for-period-tracking-apps/
- **[S59]** FTC Health Breach Notification Rule and health apps: https://www.aphnetworks.com/index.php/news/24403-ftc-says-health-apps-must-notify-consumers-about-data-breaches-or-face-fines
- **[S74]** Google AdMob Help — certified consent-management (CMP) requirement for ads in the EEA, UK and Switzerland: https://support.google.com/admob/answer/13554020

---

## Appendix C — Glossary

| Term | Meaning |
|---|---|
| **ASO** | App Store Optimisation — improving store listings (title, keywords, screenshots) to rank higher in store search and convert more visitors |
| **CPI / CPT** | Cost per install / cost per tap in paid advertising |
| **RPI / LTV** | Revenue per install / lifetime value of a user |
| **D35 download-to-paid** | Share of downloads that become paying users within 35 days |
| **Freemium** | Free app with optional paid features |
| **Non-consumable IAP** | A one-time in-app purchase that unlocks something permanently |
| **MAU** | Monthly active users |
| **TTC** | Trying to conceive |
| **BBT / LH** | Basal body temperature / luteinising hormone (ovulation tests) |
| **Luteal phase** | Time between ovulation and the next period (≈ 12–14 days on average) |
| **Fertile window** | The days in a cycle when pregnancy is possible (estimated) |
| **MDR** | EU Medical Device Regulation |
| **Class I / IIb** | EU medical-device risk classes; contraception software is Class IIb and needs a notified body |
| **FDA general wellness** | US policy under which low-risk wellness products are not regulated as medical devices |
| **GDPR (Art. 9)** | EU data-protection law; Article 9 covers special categories such as health data |
| **HBNR** | US FTC Health Breach Notification Rule |
| **MHMDA** | Washington State's My Health My Data Act |
| **DSA trader status** | EU Digital Services Act requirement to publish seller contact details on EU store pages |
| **D-U-N-S** | Free business identifier from Dun & Bradstreet, required for organisation developer accounts |
| **Data safety / privacy label** | Mandatory store disclosures of what data an app collects and shares |
| **Local-first** | Architecture in which data lives on the device and works offline, with no server |

---

*Document history — v1.0 (1 November 2026): initial market analysis and v1.0 scope definition. v1.1 (1 November 2026): owner decisions recorded (§18); monetisation (tip jar, no ads), languages, account type, marketing format, build path and costs updated throughout.*
