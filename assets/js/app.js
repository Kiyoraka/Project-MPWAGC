/* ==========================================================================
   Getta Coffee - Customer PWA - Runtime core

   Stands in for the Claude Design DCLogic component in "Getta PWA v2.dc.html".
   Same state shape, same handlers, same timings - a plain render loop instead
   of the design runtime.

   Screens register themselves into APP.screen(key, renderFn) from
   screens-flow.js and screens-order.js. A render pass asks the active screen
   for its HTML, writes it into that screen's container, and lets CSS
   animations run. Because a screen is rebuilt on entry rather than merely
   unhidden, entrance animations replay exactly as the design's sc-if
   unmount/remount causes them to.

   HANDLERS: elements carry data-act="name" (plus data-i / data-g / data-s as
   needed). One delegated listener on the app root dispatches to ACTIONS.
   This replaces the design's inline onClick={{ handler }} bindings.
   ========================================================================== */

var APP = (function (D) {
  'use strict';

  /* --- state - copied from the design component --------------------------- */

  var state = {
    screen: 'splash',
    tab: 'home',
    obIdx: 0,

    cat: 0,
    menuLoad: false,
    promo: true,
    install: true,
    otype: 'pickup',

    sel: 0,
    size: 0,
    sugar: 3,
    milk: 0,
    addons: [],
    qty: 1,
    added: false,
    flying: false,
    bump: 0,

    cart: [
      { n: 'Gula Melaka Latte', det: 'Large · Oat milk · 70% sugar', pr: 16.9, qty: 1, c1: '#C08A52', c2: '#6B4423' },
      { n: 'Kaya Butter Toast', det: 'Extra kaya', pr: 9.9, qty: 1, c1: '#E0B060', c2: '#A87428' }
    ],

    dragI: -1,
    dragX: 0,
    vApplied: false,
    step: 1,
    eta: 12,

    rwTab: 0,
    ringOn: false,
    checked: false,
    confetti: false,
    flipping: false,

    points: 240,
    wallet: 24.6,
    dw: '0.00',
    dp: 0,
    bIdx: 0,

    torn: -1,
    used: {}
  };

  /* --- registries --------------------------------------------------------- */

  var SCREENS = {};   /* key -> function(state) returning HTML  */
  var ACTIONS = {};   /* name -> function(event, dataset)       */

  /* the four screens that keep the bottom nav visible */
  var TABS = ['home', 'menu', 'rewards', 'account'];

  /* --- timers ------------------------------------------------------------- */
  /* Every timeout is tracked so navigating away can cancel work in flight -
     without this, the tracking auto-advance keeps firing after you leave. */

  var timers = [];
  var carouselTimer = null;
  var etaTimer = null;
  var countTimer = null;
  var counted = false;

  function T(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  /* --- tiny helpers ------------------------------------------------------- */

  function assign(target) {
    for (var i = 1; i < arguments.length; i++) {
      var src = arguments[i];
      for (var k in src) {
        if (Object.prototype.hasOwnProperty.call(src, k)) { target[k] = src[k]; }
      }
    }
    return target;
  }

  /* escape anything that reaches innerHTML as text */
  function esc(v) {
    return String(v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* the design's money format: "RM 12.90" */
  function fmt(v) {
    return 'RM ' + v.toFixed(2);
  }

  function setState(patch) {
    assign(state, patch);
    render();
  }

  /* --- pricing - must match the design exactly ---------------------------- */

  function unitPrice() {
    var p = D.P[state.sel];
    var u = p.pr;
    u += D.GROUPS[0].delta[state.size];
    u += D.GROUPS[2].delta[state.milk];
    state.addons.forEach(function (i) { u += D.GROUPS[3].delta[i]; });
    return u;
  }

  function cartSubtotal() {
    return state.cart.reduce(function (a, c) { return a + c.pr * c.qty; }, 0);
  }

  function deliveryFee() {
    return state.otype === 'pickup' ? 0 : D.COPY.deliveryFee;
  }

  function cartTotal() {
    var sub = cartSubtotal();
    var discount = state.vApplied ? D.COPY.voucherOff : 0;
    return Math.max(0, sub - discount) + deliveryFee();
  }

  /* --- count-up: wallet and points tick in on entering home ----------------
     24 steps of 36ms with a cubic ease-out, exactly as the source does it.
     `counted` guards the mount case so it never double-starts. */

  function countUp() {
    if (counted) { return; }
    counted = true;

    var target = state.points;
    var wallet = state.wallet;
    var steps = 24;
    var n = 0;

    clearInterval(countTimer);
    countTimer = setInterval(function () {
      n++;
      var e = 1 - Math.pow(1 - n / steps, 3);
      state.dp = Math.round(target * e);
      state.dw = (wallet * e).toFixed(2);
      render();
      if (n >= steps) {
        clearInterval(countTimer);
        state.dp = state.points;
        state.dw = wallet.toFixed(2);
        render();
      }
    }, 36);
  }

  /* --- navigation ---------------------------------------------------------- */

  function nav(target) {
    if (!target) { return; }

    clearTimers();
    clearInterval(etaTimer);

    state.screen = target;
    if (TABS.indexOf(target) >= 0) { state.tab = target; }
    state.added = false;

    /* The source calls countUp() on every nav to home, but its `_counted`
       flag is never reset - so the count animates exactly once per session
       and later visits show the settled figures. Matched deliberately. */
    if (target === 'home') { countUp(); }

    /* the rewards ring animates from empty each time the screen is entered */
    if (target === 'rewards') {
      state.ringOn = false;
      T(function () { setState({ ringOn: true }); }, 250);
    }

    render();
  }

  /* --- the carousel lives above any single screen -------------------------- */

  function startCarousel() {
    clearInterval(carouselTimer);
    carouselTimer = setInterval(function () {
      if (state.screen !== 'home') { return; }
      state.bIdx = (state.bIdx + 1) % D.BANNERS.length;
      render();
    }, 3600);
  }

  /* --- rendering ----------------------------------------------------------- */

  var root, navbar, statusbar;
  var lastScreen = null;

  function render() {
    if (!root) { return; }

    var key = state.screen;
    var host = document.getElementById('screen-' + key);
    if (!host) { return; }

    /* show only the active screen */
    var all = root.querySelectorAll('.screen');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.toggle('is-active', all[i].dataset.screen === key);
      if (all[i].dataset.screen !== key) { all[i].innerHTML = ''; }
    }

    var fn = SCREENS[key];
    host.innerHTML = fn ? fn(state) : '';

    /* Note: `.screen` stays a plain block. Each screen's own root element is
       absolutely positioned and carries its own layout, exactly as the
       source does it - so no per-screen display mode is needed here. */

    /* the entrance animation belongs to the screen change, not to a re-render
       triggered by a tap inside the same screen */
    if (lastScreen !== key) {
      host.classList.remove('screen-in');
      void host.offsetWidth;            /* force reflow so the animation replays */
      host.classList.add('screen-in');
      lastScreen = key;
    }

    renderNav();

    /* the splash is a maroon fill - the status bar inverts over it */
    statusbar.classList.toggle('is-light', key === 'splash');
  }

  function renderNav() {
    var visible = TABS.indexOf(state.screen) >= 0;
    navbar.classList.toggle('is-hidden', !visible);
    if (!visible) { navbar.innerHTML = ''; return; }

    navbar.innerHTML = D.NAVDEF.map(function (n) {
      var on = state.tab === n.s;
      return '' +
        '<div class="nav-tab' + (on ? ' nav-tab--active' : '') + '" data-act="nav" data-s="' + n.s + '">' +
          '<div class="nav-tab__pill">' +
            '<svg width="20" height="20" viewBox="0 0 24 24"><path d="' + n.ic + '" fill="' + (on ? '#F7F1DC' : '#A78F72') + '" fill-rule="evenodd"></path></svg>' +
            (on ? '<svg class="nav-tab__bolt" width="9" height="9" viewBox="0 0 24 24"><path d="M13 2 3 14h6l-2 8 10-12h-6l2-8z" fill="#EE7623"></path></svg>' : '') +
          '</div>' +
          '<div class="nav-tab__lbl">' + esc(n.lbl) + '</div>' +
        '</div>';
    }).join('');
  }

  /* --- event delegation ----------------------------------------------------- */

  function wire() {
    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-act]');
      if (!el || !root.contains(el)) { return; }
      var fn = ACTIONS[el.dataset.act];
      if (fn) { fn(e, el.dataset, el); }
    });

    /* pointer events for the cart swipe-to-remove rows */
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'].forEach(function (type) {
      root.addEventListener(type, function (e) {
        var el = e.target.closest('[data-p]');
        if (!el || !root.contains(el)) { return; }
        var fn = ACTIONS['p:' + type + ':' + el.dataset.p];
        if (fn) { fn(e, el.dataset, el); }
      });
    });
  }

  /* --- shared actions ------------------------------------------------------- */

  ACTIONS.nav = function (e, d) { nav(d.s); };

  /* --- boot ----------------------------------------------------------------- */

  function start() {
    root = document.getElementById('app');
    navbar = document.getElementById('navbar');
    statusbar = document.getElementById('statusbar');

    wire();
    render();
    countUp();
    startCarousel();

    /* the splash holds for 1900ms then hands over to onboarding */
    if (state.screen === 'splash') {
      T(function () { nav('onboard'); }, 1900);
    }
  }

  /* --- public surface -------------------------------------------------------
     The screen modules use these to register renderers and handlers, and to
     read the shared helpers rather than re-implementing them. */

  return {
    start: start,

    screen: function (key, fn) { SCREENS[key] = fn; },
    action: function (name, fn) { ACTIONS[name] = fn; },

    state: state,
    setState: setState,
    render: render,
    nav: nav,
    T: T,

    esc: esc,
    fmt: fmt,
    assign: assign,

    unitPrice: unitPrice,
    cartSubtotal: cartSubtotal,
    cartTotal: cartTotal,
    deliveryFee: deliveryFee,

    /* exposed so the tracking screen can own its own interval */
    setEtaTimer: function (t) { clearInterval(etaTimer); etaTimer = t; },
    clearEtaTimer: function () { clearInterval(etaTimer); }
  };
})(D);
