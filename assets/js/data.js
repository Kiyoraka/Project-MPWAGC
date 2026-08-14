/* ==========================================================================
   Getta Coffee - Customer PWA - Demo data

   Every structure below is copied VERBATIM from the DCLogic component in
   "Getta PWA v2.dc.html" (Claude Design project 9b7c1d15-3ef9-4fb5-9689-
   4a1c26428a10). Names, prices, tag lines, gradient stops, SVG paths, point
   values and progress percentages are the design's, not ours.

   Do not "improve" this data. It is the client-facing content of the mockup
   and it must match what the design preview shows, character for character.

   Exposed as the global `D`, consumed by app.js and the screen modules.
   ========================================================================== */

var D = (function () {
  'use strict';

  /* --- Categories (menu rail) -------------------------------------------
     n    short label shown in the 86px rail
     full long label (unused by the rail, kept from the source)
     ic   SVG path, drawn in a 24-viewBox
     ban  [title, subtitle] for the maroon banner above the product list
     --------------------------------------------------------------------- */
  var CATS = [
    { n: 'Signature', full: 'Signature Series', ic: 'M8 2h8l-1 4H9L8 2zm-1 6h10l-1.2 14H8.2L7 8zm5 3-2.4 4.6h2l-1 3.8 3.8-5.4h-2l.8-3z', ban: ['THE BOLT LINEUP', 'Original Getta signatures, charged daily'] },
    { n: 'Fresh Brew', full: 'Fresh Brew', ic: 'M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z', ban: ['SLOW DRIP, FAST BOLT', 'Brewed every 4 hours, no shortcuts'] },
    { n: 'Matcha', full: 'Matcha', ic: 'M20 4C8 6 4 12 4 20c8 0 14-4 16-16z', ban: ['GREEN ENERGY', 'Stone-ground uji matcha, Getta style'] },
    { n: 'Ice Blended', full: 'Ice Blended', ic: 'M11 2h2v20h-2zM4.2 6.5l15.6 9-1 1.7-15.6-9zM19.8 6.5l-15.6 9 1 1.7 15.6-9z', ban: ['FROZEN VOLTAGE', 'Blitzed, blended, brain-freeze approved'] },
    { n: 'Pastry', full: 'Pastry', ic: 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm0 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', ban: ['BAKED THIS MORNING', 'Butter first, questions later'] },
    { n: 'Bundle Promo', full: 'Bundle Promo', ic: 'M3 3h8l10 10-8 8L3 11V3zm5 3a2 2 0 1 0 .01 0z', ban: ['MORE BOLT PER RINGGIT', 'Pair up and save'] },
    { n: 'Top Picks', full: 'Top Picks', ic: 'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z', ban: ['CROWD CHARGERS', 'What Kubang Kerian is drinking'] },
    { n: 'All Day Brekkie', full: 'All Day Brekkie', ic: 'M12 5a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', ban: ['BREKKIE NEVER SLEEPS', 'Morning fuel, all day long'] }
  ];

  /* --- Products ----------------------------------------------------------
     cat    index into CATS
     tag    the small uppercase orange line above the name
     pr     base price in RM, before size / milk / add-on deltas
     c1/c2  gradient stops - retained as the loading tint behind each photo
            and as the fallback if an image ever fails to load
     img    product photo in assets/img/products/

     DEVIATION FROM THE DESIGN (Kiyo, 6:46 PM Aug 14): the source draws every
     product as a CSS cup built from a lid div over a gradient body div, with
     no image assets at all. Kiyo asked for real photography instead, so each
     product now carries an `img`. The gradient stops stay because they still
     tint the frame while a photo loads.

     Photos generated with gpt-image-2 at 1024px, downscaled to 640px WebP
     (22MB of PNG became 548KB). All are unbranded by prompt - no logos, no
     text, no ZUS assets.

     Note: entries 14 and 15 (Top Picks) intentionally repeat Gula Melaka
     Latte and Kopi Getta with different tag lines. That is the design's
     doing - the same drink appears in both Signature and Top Picks - so
     they reuse the same two photos rather than duplicating them.
     --------------------------------------------------------------------- */
  var IMG = 'assets/img/products/';

  var P = [
    { cat: 0, n: 'Kopi Getta', tag: 'THE OG BOLT', pr: 8.9, c1: '#8A5A3B', c2: '#4A2C18', img: IMG + 'kopi-getta.webp' },
    { cat: 0, n: 'Gula Melaka Latte', tag: 'SWEET LIKE KAMPUNG', pr: 12.9, c1: '#C08A52', c2: '#6B4423', img: IMG + 'gula-melaka-latte.webp' },
    { cat: 0, n: 'Pandan Cream Cold Brew', tag: 'GREEN & GORGEOUS', pr: 13.9, c1: '#9BB86A', c2: '#3E2418', img: IMG + 'pandan-cream-cold-brew.webp' },
    { cat: 0, n: 'Santan Mocha', tag: 'COCONUT VOLTAGE', pr: 13.5, c1: '#A9714B', c2: '#3C2214', img: IMG + 'santan-mocha.webp' },
    { cat: 1, n: 'Getta Long Black', tag: 'ZERO NOISE, FULL CHARGE', pr: 9.9, c1: '#5B3521', c2: '#2B1510', img: IMG + 'getta-long-black.webp' },
    { cat: 1, n: 'Kopi O Kosong', tag: 'STRAIGHT UP STRIKE', pr: 8.9, c1: '#4A2C18', c2: '#231009', img: IMG + 'kopi-o-kosong.webp' },
    { cat: 2, n: 'Uji Matcha Latte', tag: 'CALM BUT CHARGED', pr: 14.9, c1: '#A8C57C', c2: '#5F7F3E', img: IMG + 'uji-matcha-latte.webp' },
    { cat: 2, n: 'Matcha Gula Melaka', tag: 'EAST MEETS ZAP', pr: 15.9, c1: '#B3C286', c2: '#77592E', img: IMG + 'matcha-gula-melaka.webp' },
    { cat: 3, n: 'Teh Tarik Frappe', tag: 'PULLED. BLENDED. DONE.', pr: 11.9, c1: '#D9A96E', c2: '#9C6B3A', img: IMG + 'teh-tarik-frappe.webp' },
    { cat: 3, n: 'Choc Bolt Blended', tag: 'THUNDER IN A CUP', pr: 15.9, c1: '#7A4A2E', c2: '#3C2214', img: IMG + 'choc-bolt-blended.webp' },
    { cat: 3, n: 'Cempedak Cream Blended', tag: 'LOUD & LOCAL', pr: 16.9, c1: '#E5C063', c2: '#B98B2E', img: IMG + 'cempedak-cream-blended.webp' },
    { cat: 4, n: 'Kaya Butter Toast', tag: 'CRUNCH TIME', pr: 9.9, c1: '#E0B060', c2: '#A87428', img: IMG + 'kaya-butter-toast.webp' },
    { cat: 4, n: 'Polo Bun', tag: 'SOFT SERVE ENERGY', pr: 8.9, c1: '#E8C078', c2: '#B98B3E', img: IMG + 'polo-bun.webp' },
    { cat: 5, n: 'Duo Bolt Bundle', tag: '2 CUPS, 1 STRIKE', pr: 19.9, c1: '#8A5A3B', c2: '#4A2C18', img: IMG + 'duo-bolt-bundle.webp' },
    { cat: 6, n: 'Gula Melaka Latte', tag: 'NO.1 THIS WEEK', pr: 12.9, c1: '#C08A52', c2: '#6B4423', img: IMG + 'gula-melaka-latte.webp' },
    { cat: 6, n: 'Kopi Getta', tag: 'FOREVER FAVOURITE', pr: 8.9, c1: '#8A5A3B', c2: '#4A2C18', img: IMG + 'kopi-getta.webp' },
    { cat: 7, n: 'Nasi Lemak Brekkie Box', tag: 'FUEL OF CHAMPIONS', pr: 15.9, c1: '#7FA05A', c2: '#4E6B33', img: IMG + 'nasi-lemak-brekkie-box.webp' },
    { cat: 7, n: 'Getta Big Brekkie', tag: 'THE FULL CHARGE', pr: 18.9, c1: '#D89A5A', c2: '#8F5A28', img: IMG + 'getta-big-brekkie.webp' }
  ];

  /* --- Home banner carousel (3 slides, 3600ms interval) ------------------ */
  var BANNERS = [
    { t: 'BOLT HOUR', s: '20% off all Signature drinks, 3–5PM daily', bg: 'linear-gradient(112deg,#7A2418,#93331F)', fg: '#F7F1DC', sub: '#E8B77E', deco: '#EE7623', btnBg: '#EE7623', btnFg: '#fff', cta: 'ORDER NOW' },
    { t: 'NEW: PANDAN CREAM COLD BREW', s: 'Green, gorgeous & fully charged. RM 13.90', bg: 'linear-gradient(112deg,#EE7623,#D2601A)', fg: '#fff', sub: '#FBE3CE', deco: '#F7F1DC', btnBg: '#7A2418', btnFg: '#F7F1DC', cta: 'TRY IT' },
    { t: 'REFER A FRIEND', s: 'You both get RM5 wallet credit. Sharing is charging', bg: 'linear-gradient(112deg,#2B1510,#4E2A16)', fg: '#F7F1DC', sub: '#C8A671', deco: '#E0A526', btnBg: '#F7F1DC', btnFg: '#7A2418', cta: 'INVITE' }
  ];

  /* --- Onboarding slides ------------------------------------------------- */
  var OB = [
    { t: 'Order ahead, skip the queue', d: 'Tap, pay, and your kopi is waiting at the counter before you even arrive.', ic: 'M13 2 3 14h6l-2 8 10-12h-6l2-8z', bg: '#7A2418' },
    { t: 'Every cup earns bolt points', d: 'Check in daily, complete missions, and stack points with every single order.', ic: 'M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z', bg: '#EE7623' },
    { t: 'Redeem rewards, free kopi', d: 'Trade your bolts for vouchers, free drinks and Gold Bolt exclusives.', ic: 'M3 7h18v4a2 2 0 0 0 0 2v4H3v-4a2 2 0 0 0 0-2V7zm9 2-2 3.8h1.6l-.8 3 3.2-4.4h-1.6l.8-2.4h-1.2z', bg: '#3E7C4F' }
  ];

  /* --- Bottom navigation -------------------------------------------------
     These four screens are the "tab" screens. Every other screen hides the
     bar and leaves the previously active tab highlighted.
     --------------------------------------------------------------------- */
  var NAVDEF = [
    { s: 'home', lbl: 'Home', ic: 'M12 3 3 11h2v9h5v-6h4v6h5v-9h2z' },
    { s: 'menu', lbl: 'Menu', ic: 'M8 2h8l-1 4H9L8 2zm-1 6h10l-1.2 14H8.2L7 8z' },
    { s: 'rewards', lbl: 'Rewards', ic: 'M13 2 3 14h6l-2 8 10-12h-6l2-8z' },
    { s: 'account', lbl: 'Account', ic: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0H4z' }
  ];

  /* --- Product option groups ---------------------------------------------
     `delta` is the RM added to the base price when that option is chosen.
     Group 3 (Add-ons) is multi-select; the other three are single-select.
     `short` supplies the wording used in the cart row detail line, which
     differs from the button label: the button reads "Oat +RM2", the cart
     row reads "Oat milk".
     --------------------------------------------------------------------- */
  var GROUPS = [
    { name: 'Size', hint: '', multi: false, opts: ['Regular', 'Large +RM2'], delta: [0, 2], short: ['Regular', 'Large'] },
    { name: 'Sugar level', hint: '', multi: false, opts: ['0%', '30%', '70%', '100%'], delta: [0, 0, 0, 0], short: ['0%', '30%', '70%', '100%'] },
    { name: 'Milk', hint: '', multi: false, opts: ['Fresh', 'Oat +RM2', 'Santan +RM1'], delta: [0, 2, 1], short: ['Fresh', 'Oat', 'Santan'] },
    { name: 'Add-ons', hint: 'pick any', multi: true, opts: ['Extra shot +RM3', 'Gula Melaka drizzle +RM1.50', 'Grass jelly +RM2'], delta: [3, 1.5, 2], short: ['Extra shot', 'Gula Melaka drizzle', 'Grass jelly'] }
  ];

  /* --- Order tracking: the four step icons -------------------------------
     bag -> cup -> bolt -> tick, matching Received / Preparing / Ready /
     Completed.
     --------------------------------------------------------------------- */
  var STEPICS = [
    'M9 3h6l1 2h4v2H4V5h4l1-2zM6 8h12l-1 13H7L6 8z',
    'M8 2h8l-1 4H9L8 2zm-1 6h10l-1.2 14H8.2L7 8z',
    'M13 2 3 14h6l-2 8 10-12h-6l2-8z',
    'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'
  ];

  var STEPLBL = ['Received', 'Preparing', 'Ready', 'Completed'];

  /* --- Rewards: Redeem tab tiles ----------------------------------------- */
  var REDEEMS = [
    { v: 'RM 3', pts: 240, bg: '#FBE3CE', fg: '#C2570F' },
    { v: 'RM 5', pts: 400, bg: '#7A2418', fg: '#F7F1DC' },
    { v: 'RM 8', pts: 640, bg: '#EE7623', fg: '#fff' },
    { v: 'FREE KOPI', pts: 800, bg: '#3E7C4F', fg: '#F7F1DC' }
  ];

  /* --- Rewards: Missions tab list ----------------------------------------
     `w` is the progress bar fill percentage.
     --------------------------------------------------------------------- */
  var MISSIONS = [
    { t: 'Order 3 Signature drinks', s: '2 of 3 done — one more strike', pts: 50, w: 66 },
    { t: 'Try anything Matcha', s: 'New series, new bolts', pts: 20, w: 0 },
    { t: 'Bring your own tumbler', s: 'Register it under Account first', pts: 30, w: 0 }
  ];

  /* --- Rewards: My Rewards tab vouchers ----------------------------------- */
  var VOUCHERS = [
    { i: 0, amt: 'RM 3', t: 'RM3 off any order', days: 12, min: 'RM 15' },
    { i: 1, amt: 'RM 5', t: 'RM5 off Ice Blended', days: 5, min: 'RM 20' }
  ];

  /* --- Rewards: 7-day check-in strip --------------------------------------
     Day 4 is today. Days 1-3 are already claimed. Day 7 is the 21pt payoff.
     --------------------------------------------------------------------- */
  var COINS = {
    days: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    vals: [1, 1, 1, 3, 1, 1, 21],
    today: 3,        /* index of today's coin           */
    claimed: 3       /* coins already flipped on load   */
  };

  /* --- Tracking: the order being followed ---------------------------------
     Hardcoded in the design's markup rather than in its data block; lifted
     here so the tracking screen stays declarative.
     --------------------------------------------------------------------- */
  var ORDER = {
    id: 'Order #GC-2841',
    placed: 'Placed 9:32 AM · Pickup',
    lines: [
      { n: '1× Gula Melaka Latte (Large, Oat)', amt: 'RM 16.90' },
      { n: '1× Kopi Getta (Regular)', amt: 'RM 8.90' },
      { n: '1× Kaya Butter Toast', amt: 'RM 9.90' }
    ],
    total: 'RM 32.70'
  };

  /* --- Standing copy ------------------------------------------------------
     Single-use strings the screens read rather than hardcode inline.
     --------------------------------------------------------------------- */
  var COPY = {
    outlet: 'Getta Coffee Kubang Kerian',
    promoText: 'RM3 OFF first pickup order · Code: ',
    promoCode: 'GETTABOLT10',
    voucherCode: 'GETTABOLT10',
    voucherOff: 3,
    deliveryFee: 5,
    pickupSub: 'Ready in 10–15 min · Jalan Raja Perempuan Zainab II',
    deliverySub: '25–35 min to your address',
    walletBalance: 'Balance RM 24.60',
    customerName: 'Afif Maahi Abu Bakar',
    customerEmail: 'afif.maahi@gmail.com',
    greeting: 'Good morning, Afif',
    greetingSub: 'Time for your daily bolt',
    goldTarget: 1000,
    footer: 'Getta Coffee PWA v1.0 · Served fresh from DigitalOcean'
  };

  return {
    CATS: CATS,
    P: P,
    BANNERS: BANNERS,
    OB: OB,
    NAVDEF: NAVDEF,
    GROUPS: GROUPS,
    STEPICS: STEPICS,
    STEPLBL: STEPLBL,
    REDEEMS: REDEEMS,
    MISSIONS: MISSIONS,
    VOUCHERS: VOUCHERS,
    COINS: COINS,
    ORDER: ORDER,
    COPY: COPY
  };
})();
