# Getta Coffee — Customer PWA (hardcoded front end)

Software Version: 1.0 (static mockup)

## Description

A static, hardcoded web application demonstrating the **customer side** of the
Getta Coffee ordering platform: nine screens running from splash and onboarding
through browsing, product options, cart, live order tracking, loyalty rewards
and the account profile.

Everything on screen is demo data. There is no backend, no database, no
authentication and no persistence — a refresh resets the demo to its starting
state. This build exists to be the **visual and behavioural reference** the
Java / Spring Boot implementation is later wrapped around, and the artifact
shown to the client before that build starts.

Its sibling repo **Project MWAGC** holds the other half: the nine-view HQ admin
console.

## Running it

Double-click `index.html`, or serve the folder with any static server:

```bash
python -m http.server 8080      # then open http://localhost:8080
```

Best viewed at a phone width. On a desktop the app sits as a 390px column
centred on the page — see *Framing* below.

Fonts (Baloo 2 + Outfit) load from Google Fonts, so the first load needs an
internet connection. Everything else is local.

## Structure

```
index.html                    single shell, all nine screens
assets/
  css/
    tokens.css                design tokens, base layer, 22 keyframes
    app.css                   app column, shared glass vocabulary, bottom nav
    screens-flow.css          splash · onboard · home · menu
    screens-order.css         product · cart · tracking
    screens-rewards.css       rewards · account
  js/
    data.js                   all demo data, verbatim from the design
    app.js                    state, render loop, navigation, timers
    screens-flow.js           splash · onboard · home · menu
    screens-order.js          product · cart · tracking · rewards · account
  img/products/               16 product photos (WebP)
```

The four-way CSS/JS split exists because no file may exceed 1000 lines. The
sibling admin build shipped a 1857-line stylesheet; this one was split along
the user journey instead — arriving and browsing, then buying, then loyalty.

## The nine screens

| Screen | What it shows |
|---|---|
| Splash | G-mug fills with coffee, bolt strikes, wordmark rises; hands over at 1.9s |
| Onboarding | Three slides, morphing dot indicators, Skip |
| Home | Wallet and points counting up, 3-banner carousel, delivery/pickup, install prompt |
| Menu | Order-type switch, 8-category rail, filtered products with a shimmer on category change |
| Product | Hero photo, four option groups, quantity stepper, live price, flying-dot add |
| Cart | Swipe-left-to-remove rows, voucher toggle, wallet, totals |
| Tracking | Four-step rail advancing on its own, ETA counting down |
| Rewards | Progress ring, 7-day check-in with flip coins and confetti, redeem tiles, tear-off vouchers |
| Account | Avatar, wallet card, loyalty split, cross-links into orders and rewards |

The bottom nav appears on Home, Menu, Rewards and Account only.

## Design source

Ported from the Claude Design project **"Getta Coffee ordering platform"**
(`9b7c1d15-3ef9-4fb5-9689-4a1c26428a10`) — specifically `Getta PWA v2.dc.html`,
the **Glass** theme.

That project also contains `Getta PWA.dc.html`, a **Classic** theme. Verified by
diff, the two are the same nine screens, the same state, the same handlers and
the same data — the entire difference is the skin, where Glass adds 74
backdrop-filtered surfaces over a gradient page. Glass was chosen; Classic is
not built here.

Those files run on Claude Design's own runtime (`<x-dc>`, `sc-for`, `sc-if`,
`DCLogic`), which no browser can execute, so the app was hand-ported to vanilla
JS: same markup, same values, same data, same animation timings, a different
renderer. `support.js` from the design project is not used here — it was read
only to pin down two behaviours the port had to reproduce:

- `style-hover="…"` compiles to a real CSS pseudo-class, so those are genuine
  `:hover` rules here, not JS listeners
- `key="…"` is a React remount instruction, which is what replays the
  onboarding slide entrance on every change

## Deliberate departures from the design

**1. No bezel.** The design presents the app inside a 390×844 phone with an 11px
`#2B1510` border, 46px radius and a drop shadow. That chrome is removed and the
app fills the viewport. Nothing *inside* it was re-measured — including the 9:41
status bar, which sits inside the phone in the source and is therefore app
content, not mockup framing.

**2. Real product photography.** The design draws every product in CSS — a lid
div over a gradient body div, with no image assets at all. Those are replaced by
16 generated product photos. The original gradient stops are retained in the
data and now tint each frame while its photo loads.

Everything else is intended to match the design exactly. A value-level audit
confirms all 74 hex colours, all 22 keyframes, all 22 animation declarations and
all 14 transitions are present, with blur radii verified against computed style.

## Framing

The app column is `width:100%; max-width:390px; margin-inline:auto`.

On a phone that is genuinely edge-to-edge. On a desktop it is a 390px column
centred on the page — with no bezel, no radius and no shadow, so it reads as an
app rather than a mockup. Holding the column at the design's own 390px is also
what keeps its arithmetic exact: the banner carousel slides are 358px because
390 less two 16px gutters is 358, and the add-to-cart dot flies to a coordinate
tuned for that width.

## Product images

The 16 photos in `assets/img/products/` were generated with `gpt-image-2` on a
consistent brief — clear cup, domed lid, three-quarter elevated angle, soft
studio lighting, warm cream ground matching the app palette. Food items switch
to a plate but keep the same angle and ground so the grid reads as one set.

Sixteen rather than eighteen because Top Picks reuses Gula Melaka Latte and Kopi
Getta from Signature — the design lists the same two drinks twice with different
tag lines, so they share their photo.

Every prompt carried explicit no-logo, no-text and no-branding instructions, so
none of them borrow real chain assets.

They ship as 640px WebP totalling 548KB. The 1024px PNG originals were roughly
1.4MB each — 22MB in total, which would have been indefensible for a mobile app
whose thumbnails display at 78px.

## No authentication

Unlike the admin console, this half has **no login screen**. The design project
does not contain one for the customer side and none was invented. If Getta
expects customers to sign in, that screen is still owed by the design.

## Security note

There is no authentication, no session handling and no data transmission of any
kind. Nothing is stored — not in `localStorage`, not in `sessionStorage`, not
anywhere. State lives in memory for the life of the page.

This is intentional for a demo. When the real API lands, state and persistence
are new work, not something to layer onto this file set.

## Next

**This customer PWA is the Java / Spring Boot half.** The Spring Boot build
consumes this as its static front end.

The two halves of Getta Coffee are deliberately on different stacks
(Kiyo, 14 Aug 2026):

| Surface | Repo | Backend |
|---|---|---|
| Customer PWA (this repo) | `Project MPWAGC` | **Java / Spring Boot** |
| Admin HQ console | `Project MWAGC` | **Laravel** |

Because the two are separate applications, whatever they share — menu,
categories, prices, outlets, orders, loyalty balances — has to cross a real
boundary rather than a function call. Worth settling before either build
starts: which side owns the database, and whether the other reads it directly
or through an API.
