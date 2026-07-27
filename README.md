# Handoff: Fantasy MMADness Mobile App

## Overview
A mobile-first fantasy sports app for combat sports (MMA, Boxing, Bare Knuckle, Kickboxing, Pro Wrestling). Users predict fight stats/outcomes via scorecards, join leagues and season-long "Fantasy Cards," watch live fights with real-time scoring, and affiliates promote fights for referral leagues. Domain: fantasymmadness.com.

## About the Design Files
The bundled HTML file (`FantasyMMADNESS.dc.html`) is a **design reference/prototype** built in an internal component format — not production code. It renders correctly standalone in a browser (open it directly) so you can click through every screen and interaction, but the actual product should be **rebuilt natively in your target stack** (React Native, Flutter, native iOS/Android, or a mobile web framework — whatever this codebase already uses). Treat this file as the spec for layout, copy, states, and interaction — not something to transplant directly. Ignore the custom tags/attributes it uses internally (`<image-slot>`, `hint-*`, `data-*`) — these are prototype-only plumbing standing in for real image upload/CDN and internal component wiring.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and micro-interactions (animations, glows, sound cues) are intentional and final. Recreate pixel-close using your codebase's design system/component library where one exists; otherwise implement using the values documented below.

## Screen Map
1. **Home** — hero (fighter photos + title), stats bar (predictors/prizes/live events/leaderboards, clickable), sport selector carousel, featured banner + featured fight detail, upcoming events carousel, community predictions (auto-cycles all open fights every ~4.5s), rewards row (daily reward, coin wallet, mini leaderboard, streak bonus w/ live countdown), apparel carousel, affiliate promoter banner + social icons + treasure chest (buy-coins CTA).
2. **Contests** — full list of open fights across all sports/affiliates, filterable, posters use `contain` fit (never crops fighter heads).
3. **Make Predictions** — per-sport scorecards (Boxing/Bare Knuckle, MMA/Kickboxing, Pro Wrestling) with round-by-round stat inputs, KO/Survival outcome picker (auto-slides the other fighter to Survival pts), AI scouting notes.
4. **Leaderboard** — Hall of Fame (past champions with belt graphic), current season rankings.
5. **Leagues** — Affiliate alerts (new fight / fight week notices, auto-generated), Fantasy Cards (season-long cross-genre draft — pick 1 fighter per genre, score accumulates across the whole campaign span), public leagues browser, head-to-head challenges.
6. **Watch Party** — live match clock, round-by-round strike tracker, crowd reactions, Cage Cam friend chat (live feed + user text input), animated stadium-light background (flickering red/blue + flashing bulbs) over an arena photo.
7. **Profile** — stats, Fight IQ XP bar, Share Fight IQ Receipt (shareable stat card), settings link.
8. **Settings** — notification toggles (push/email/text), wager limits, automation toggles (auto-settle, AI auto-score, etc.), plus admin/back-office-only tools: **Live Scoring Team** (assign staff to Red/Blue corner per live event) and an **AI-Assisted Admin Scorecard demo** (AI auto-fills strike categories live, staff nudge +/- to correct) — both explicitly marked staff-only; regular users never see them, only the resulting point totals.
9. **Free Demo Walkthrough** (reachable from menu + Home banner) — a full guided, no-money tutorial: meet fighters → fill scorecard (with category explainers) → round-by-round reveal with full stat breakdown vs. your prediction → leaderboard movement → post-fight comments → recap with FAQ and CTAs into real Contests/Shadow Fights.
10. **Blogs & Fight News** (menu item) — full blog list + treasure chest buy-coins CTA.
11. **Menu drawer** (hamburger, top-left) — links to every tab above plus Rules/Support.

## SEO (current state vs. what the backend must own)
The prototype's `<head>` carries page-level `<title>`, meta description/keywords (Boxing, UFC, MMA, Kickboxing, BKFC, Pro Wrestling), Open Graph tags, and a JSON-LD schema block — copy these into the real site's static shell as a baseline.
**This is a single-page client app and cannot do real SEO on its own.** For actual Google indexing of blogs/fighters/events, the backend must provide: server-side rendering (or static generation) so each blog post / fighter profile / event has its own real crawlable URL; an auto-generated, auto-growing `sitemap.xml` submitted to Search Console as content is added; per-page unique meta title/description/keywords generated from each blog's own fight genre/fighters (Boxing, UFC, MMA, Kickboxing, BKFC, Wrestling keyword sets); structured data (Article/SportsEvent schema) per blog/event page. An "AI SEO bot" running 24/7 is a backend content pipeline (auto-tag new blogs with the right combat-sport keywords, auto-build meta tags, auto-ping sitemap on publish) — not something the client app can execute itself.

## Scoring System (critical business logic)
- **Boxing / Bare Knuckle**: HP (Head Punches), BP (Body Punches), TP (Total Punches — independent number, NOT auto-summed from HP+BP), KO/Survival outcome (KO winner = 500 pts, other fighter auto-gets Survival = 25 pts; if it goes the distance, a 500-pt bonus is randomly awarded to one round for either corner — not a user pick).
- **MMA / Kickboxing (UFC style)**: HP, BP, Kicks, Knees, Elbows — same KO/Survival auto-slide mechanic as boxing.
- **Pro Wrestling**: no rounds/rounds-based structure — scored over the whole match. Categories: Head Punches, Body Punches, Kicks, Power Moves (slams/suplexes/powerbombs), Finishers (signature match-ending sequences, counts as attempt whether it wins or not). Winner gets +1,000 pts, loser still gets +500 pts (not the same 25-pt survival rule as strike sports).
- **All stat categories count attempts thrown, not just landed strikes** — this is a deliberate rule, surface it in any tooltip/help copy.
- Every scorecard category needs a plain-language description visible under its label (large, white text, ~10px+, bold) explaining exactly what counts.

## Fantasy Cards (season-long contest)
Fixed-length campaigns (first fight of a stretch to the last, e.g. "JUL 27 – AUG 25"), hosted by admin or any affiliate. User drafts exactly one fighter per genre (Boxing, MMA, Bare Knuckle, Kickboxing, Wrestling) from whoever's already scheduled that stretch — no snake draft, just pick-and-lock. Score accumulates across every event in the span. Users can join as many campaigns as they want (each has its own entry fee + pot).

## Automation / Admin-facing rules (for backend)
- New fight listings auto-generate an affiliate "🆕 just listed" alert; fights within 7 days auto-generate a "📅 FIGHT WEEK" alert — both are computed, not manually triggered.
- Community Prediction odds update immediately when any user submits a scorecard or taps a quick-pick chip.
- Photo/fighter carousels (sport cards, apparel, upcoming events) must show **zero empty slots**: 0 uploaded photos → one placeholder; 1 photo → static; 2+ → auto-cycle every 7s. Never show a blank tile.
- **Every fighter photo upload (Featured This Week, Featured Fight, sport-selector circles, apparel, event posters) must run automatic background removal** (e.g. remove.bg API or a trained segmentation model) server-side on upload, so white/studio backgrounds never show against the app's dark cards. In this prototype that was done manually per-photo (canvas alpha-threshold on white/near-white pixels) — the real app needs this to run automatically on every future upload, not as a one-off.
- Streak Bonus needs a live countdown ("Streak expires in Xh Ym"), red/pulsing under 1 hour remaining, resetting to 24h on claim.
- Upcoming Events auto-drop off the list once their date passes (no manual pruning).
- Live fights are scored live by admin; users only see point totals/deltas update in real time — never the raw admin scoring UI.

## Design Tokens
- **Background**: near-black `#05060a` / `#0b0c12` gradients.
- **Accent — Fire red**: `#ef4444` (MMA/UFC tag color, alerts, red-corner).
- **Accent — Blue**: `#4d8dff` (blue-corner, links, secondary CTAs).
- **Accent — Gold**: `#f2b544` / `#f2c869` (currency, points, streaks, premium).
- **Accent — Purple**: `#a855f7` (leagues, XP, Fight IQ).
- **Green**: `#22c55e` (success, live indicators, positive money).
- **Typography**: Headlines in `'Anton', sans-serif` (condensed display face); body/UI text in `'Rajdhani', sans-serif`.
- **Radius**: 8–16px on cards/buttons; pill (999px) on primary CTAs.
- **Glow pattern**: cards use layered `radial-gradient` "stadium light" glows (red/blue/gold) plus a colored `box-shadow` border-glow — this is the signature visual motif, replicate consistently across all card surfaces.
- **Animations**: `pulseLive` (live dot), `moneyPulse`/`moneyPulseGold` (currency emphasis), `ptsTwinkle` (gold shimmer on point values), `glimmerCrown` (icon bubbles), `stadiumFlickerRed/Blue` + `bulbFlash` (arena light backgrounds), `cardPop`/`quickFlash` (quick-pick feedback), `toastIn` (toast/notification entrance).
- **Sound cues**: bell ring on picks/submissions, crowd cheer on wins/streak claims — implement as short audio triggers tied to those same actions.

## Assets
- `uploads/HANDSHAKE PHOTO.jpg` / `handshake-transparent.png` — affiliate/partner section (transparent bg version used on-screen).
- `uploads/pasted-1785011607947-0.png` — stadium crowd photo (Watch Party + Home hero background).
- `uploads/pasted-1785012202182-0.png` — friends watching fight photo (Leagues promo + screen background).
- `uploads/pasted-1785012542538-0.png` — ring corner photo (mini Leaderboard card, Home).
- `uploads/chest-transparent.png` — treasure chest graphic (transparent bg) used for the buy-coins CTA; click triggers a coin-burst animation before opening the payment modal.
- All fighter/event/apparel photos are user-uploaded placeholders (`<image-slot>` in the prototype) — build real upload → CDN → carousel wiring, plus real background-removal (e.g. remove.bg API) for fighter cutouts if that visual treatment is wanted at scale, since the current transparent PNGs were manually processed.

## Payments & Coins
"FM Coins" is the in-app currency; the buy-coins modal (opened from the wallet pill, treasure chest, or "addcoins" triggers) is where a real payment provider (Stripe, Apple/Google IAP, etc.) must be wired in — coins should credit the user's account automatically on successful payment.

## Files in This Bundle
- `FantasyMMADNESS.dc.html` — full interactive prototype, open directly in a browser to click through every screen.
- `uploads/` — background/branding images referenced above.

Open the HTML file and click through Home → Contests → Make Predictions → Leagues → Watch Party → Profile → Settings → Free Demo → Blogs to see every state and copy exactly as designed.
