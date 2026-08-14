/* ==========================================================================
   Getta Coffee - Customer PWA - Ordering, tracking and rewards screens

   product · cart · tracking · rewards · account

   Populated by Phase 4 (Tasks 10-15). This file is referenced by index.html
   from Task 3 onward so the page loads without a missing-script error while
   Phase 3 is still in progress.
   ========================================================================== */

(function (A, D) {
  'use strict';

  var BOLT_PATH = 'M13 2 3 14h6l-2 8 10-12h-6l2-8z';

  /* the cart icon + its badge, shared by the product header */
  function cartButton(s) {
    return '' +
      '<div class="prodv__cart-wrap">' +
        '<button class="gbtn" data-act="nav" data-s="cart">' +
          '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M7 18a2 2 0 1 0 .01 0zM17 18a2 2 0 1 0 .01 0zM3 3h2l2.6 11h11l2.4-8H6.2" fill="none" stroke="#7A2418" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>' +
        '</button>' +
        '<div class="cart-badge' + (s.bump ? ' cart-badge--bump' : '') + '">' + s.cart.length + '</div>' +
      '</div>';
  }

  /* ========================================================================
     5 - Product

     Four option groups drive the live price: size and milk add their delta,
     add-ons are multi-select and stack. The CTA shows unit price times
     quantity and swaps to a green "Added to cart!" state for 1600ms while a
     dot flies up toward the cart icon.
     ======================================================================== */

  A.screen('product', function (s) {
    var p = D.P[s.sel];

    var picked = function (g, i) {
      if (g === 0) { return s.size === i; }
      if (g === 1) { return s.sugar === i; }
      if (g === 2) { return s.milk === i; }
      return s.addons.indexOf(i) >= 0;
    };

    var groups = D.GROUPS.map(function (grp, g) {
      var opts = grp.opts.map(function (lbl, i) {
        return '<button class="chip' + (picked(g, i) ? ' chip--on' : '') +
               '" data-act="pick" data-g="' + g + '" data-i="' + i + '">' + A.esc(lbl) + '</button>';
      }).join('');
      return '' +
        '<div class="ogroup">' +
          '<div class="ogroup__name">' + A.esc(grp.name) +
            (grp.hint ? ' <span class="ogroup__hint">' + A.esc(grp.hint) + '</span>' : '') +
          '</div>' +
          '<div class="ogroup__opts">' + opts + '</div>' +
        '</div>';
    }).join('');

    var cta = s.added
      ? '<span class="prodv__added"><svg width="15" height="15" viewBox="0 0 24 24" class="prodv__zap"><path d="' + BOLT_PATH + '" fill="#fff"></path></svg>Added to cart!</span>'
      : '<span>Add to Cart · ' + A.fmt(A.unitPrice() * s.qty) + '</span>';

    return '' +
      '<div class="prodv">' +

        '<div class="prodv__head">' +
          '<button class="gbtn" data-act="nav" data-s="menu">←</button>' +
          cartButton(s) +
        '</div>' +

        '<div class="prodv__scroll noscroll">' +
          '<div class="prodv__hero-row">' +
            '<div class="prodv__hero">' +
              '<svg class="prodv__hero-bolt" width="40" height="40" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
              '<img class="prodv__img" src="' + p.img + '" alt="' + A.esc(p.n) + '" decoding="async" width="640" height="640">' +
            '</div>' +
          '</div>' +

          '<div class="prodv__text">' +
            '<div class="prodv__tag">' + A.esc(p.tag) + '</div>' +
            '<div class="prodv__name">' + A.esc(p.n) + '</div>' +
            '<div class="prodv__price">' + A.fmt(p.pr) + '</div>' +
          '</div>' +

          groups +

          '<div class="qty">' +
            '<div class="qty__lbl">Quantity</div>' +
            '<div class="qty__box">' +
              '<button class="qty__btn qty__btn--minus" data-act="qty-dec">−</button>' +
              '<div class="qty__n">' + s.qty + '</div>' +
              '<button class="qty__btn qty__btn--plus" data-act="qty-inc">+</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="sticky-foot">' +
          (s.flying ? '<div class="flydot"></div>' : '') +
          '<button class="cta ' + (s.added ? 'cta--success' : 'cta--maroon') + ' prodv__cta" data-act="add-cart">' + cta + '</button>' +
        '</div>' +

      '</div>';
  });

  A.action('pick', function (e, d) {
    var g = +d.g, i = +d.i, s = A.state;
    if (g === 0) { A.setState({ size: i }); }
    else if (g === 1) { A.setState({ sugar: i }); }
    else if (g === 2) { A.setState({ milk: i }); }
    else {
      var a = s.addons.slice();
      var x = a.indexOf(i);
      if (x >= 0) { a.splice(x, 1); } else { a.push(i); }
      A.setState({ addons: a });
    }
  });

  A.action('qty-inc', function () { A.setState({ qty: Math.min(9, A.state.qty + 1) }); });
  A.action('qty-dec', function () { A.setState({ qty: Math.max(1, A.state.qty - 1) }); });

  A.action('add-cart', function () {
    var s = A.state;
    if (s.added) { return; }                    /* re-entrant guard, as source */

    var p = D.P[s.sel];
    var det = [
      D.GROUPS[0].short[s.size],
      D.GROUPS[2].short[s.milk] + ' milk',
      D.GROUPS[1].short[s.sugar] + ' sugar'
    ].join(' · ');
    var price = A.unitPrice();

    A.setState({ added: true, flying: true });

    A.T(function () {
      A.state.cart = A.state.cart.concat({
        n: p.n, det: det, pr: price, qty: A.state.qty, c1: p.c1, c2: p.c2, img: p.img
      });
      A.setState({ bump: A.state.bump + 1, flying: false });
    }, 620);

    A.T(function () { A.setState({ added: false }); }, 1600);
  });

  /* ========================================================================
     6 - Cart

     Rows sit on a red delete bed and are dragged left. Release past -85px
     removes the row; anything shorter springs back over .25s. Pointer capture
     keeps the gesture alive even if the finger leaves the row.
     ======================================================================== */

  A.screen('cart', function (s) {
    var sub = A.cartSubtotal();
    var fee = A.deliveryFee();
    var pickup = s.otype === 'pickup';

    var rows = s.cart.map(function (c, i) {
      var dragging = s.dragI === i;
      var shift = dragging ? s.dragX : 0;
      var rowStyle = 'transform:translateX(' + shift + 'px);transition:' +
                     (dragging ? 'none' : 'transform .25s ease-out');
      return '' +
        '<div class="crow">' +
          '<div class="crow__bed">' +
            '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 3h6l1 2h4v2H4V5h4l1-2zM6 8h12l-1 13H7L6 8z" fill="#fff"></path></svg>' +
          '</div>' +
          '<div class="crow__body" data-p="cartrow" data-i="' + i + '" style="' + rowStyle + '">' +
            '<div class="cup-well crow__well" style="--tint:' + c.c1 + '">' +
              '<img class="crow__img" src="' + c.img + '" alt="' + A.esc(c.n) + '" loading="lazy" decoding="async" width="640" height="640">' +
            '</div>' +
            '<div class="crow__text">' +
              '<div class="crow__name">' + A.esc(c.n) + '</div>' +
              '<div class="crow__det">' + A.esc(c.det) + '</div>' +
            '</div>' +
            '<div class="crow__right">' +
              '<div class="crow__price">' + A.fmt(c.pr) + '</div>' +
              '<div class="crow__qty">×' + c.qty + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    var voucherLine = s.vApplied
      ? '<div class="totals__row totals__row--save"><span>Voucher ' + A.esc(D.COPY.voucherCode) + '</span><span class="totals__strong">− ' + A.fmt(D.COPY.voucherOff) + '</span></div>'
      : '';

    return '' +
      '<div class="cartv">' +

        '<div class="cartv__head">' +
          '<button class="gbtn" data-act="nav" data-s="menu">←</button>' +
          '<div class="cartv__title">Your Order</div>' +
        '</div>' +

        '<div class="cartv__scroll noscroll">' +

          '<div class="glass-dark otype">' +
            '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" fill="#EE7623"></path></svg>' +
            '<div class="otype__text">' +
              '<div class="otype__name">' + (pickup ? 'Pickup' : 'Delivery') + ' · ' + A.esc(D.COPY.outlet) + '</div>' +
              '<div class="otype__sub">' + A.esc(pickup ? D.COPY.pickupSub : D.COPY.deliverySub) + '</div>' +
            '</div>' +
            '<div class="otype__change">Change</div>' +
          '</div>' +

          '<div class="cartv__hint">SWIPE LEFT TO REMOVE</div>' +
          '<div class="cartv__rows">' + rows + '</div>' +

          '<div class="voucher-row' + (s.vApplied ? ' voucher-row--on' : '') + '" data-act="voucher-toggle">' +
            '<svg width="18" height="18" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="' + (s.vApplied ? '#3E7C4F' : '#EE7623') + '"></path></svg>' +
            '<div class="voucher-row__lbl">' +
              (s.vApplied ? A.esc(D.COPY.voucherCode) + ' applied — RM3 off' : 'Apply voucher ' + A.esc(D.COPY.voucherCode)) +
            '</div>' +
            '<div class="voucher-row__cta">' + (s.vApplied ? 'REMOVE' : 'APPLY') + '</div>' +
          '</div>' +

          '<div class="glass wallet-row">' +
            '<div class="wallet-row__chip"><svg width="11" height="13" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg></div>' +
            '<div class="wallet-row__text">' +
              '<div class="wallet-row__name">Getta Wallet</div>' +
              '<div class="wallet-row__bal">' + A.esc(D.COPY.walletBalance) + '</div>' +
            '</div>' +
            '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="#8A6A55" stroke-width="2.4" stroke-linecap="round"></path></svg>' +
          '</div>' +

          '<div class="totals">' +
            '<div class="totals__row"><span>Subtotal</span><span class="totals__strong">' + A.fmt(sub) + '</span></div>' +
            voucherLine +
            '<div class="totals__row"><span>' + (pickup ? 'Pickup fee' : 'Delivery fee') + '</span>' +
              '<span class="totals__strong">' + (fee ? A.fmt(fee) : 'FREE') + '</span></div>' +
          '</div>' +

        '</div>' +

        '<div class="sticky-foot cartv__foot">' +
          '<div>' +
            '<div class="cartv__total-lbl">TOTAL</div>' +
            '<div class="cartv__total">' + A.fmt(A.cartTotal()) + '</div>' +
          '</div>' +
          '<button class="cta cta--orange cartv__place" data-act="place-order">Place Order</button>' +
        '</div>' +

      '</div>';
  });

  A.action('voucher-toggle', function () {
    A.setState({ vApplied: !A.state.vApplied });
  });

  /* --- swipe to remove ------------------------------------------------------
     dx is clamped at 0 so a row can only travel left, exactly as the source.

     The drag deliberately does NOT go through setState. Re-rendering would
     rewrite the row's HTML and destroy the very element holding the pointer
     capture, killing the gesture mid-swipe - React keeps that node alive
     across renders, our renderer would not. So the move writes the transform
     straight onto the node, and state is reconciled once on release. The
     visual result is identical and the gesture survives.
     ------------------------------------------------------------------------ */

  var swipe = null;

  A.action('p:pointerdown:cartrow', function (e, d, el) {
    swipe = { i: +d.i, x: e.clientX, el: el, dx: 0 };
    el.setPointerCapture(e.pointerId);
    el.style.transition = 'none';
  });

  A.action('p:pointermove:cartrow', function (e) {
    if (!swipe) { return; }
    swipe.dx = Math.min(0, e.clientX - swipe.x);
    swipe.el.style.transform = 'translateX(' + swipe.dx + 'px)';
  });

  function endSwipe() {
    if (!swipe) { return; }
    var removed = swipe.dx < -85;
    var idx = swipe.i;

    if (!removed) {
      /* spring back on the node itself, then let the next render take over */
      swipe.el.style.transition = 'transform .25s ease-out';
      swipe.el.style.transform = 'translateX(0px)';
      swipe = null;
      A.state.dragI = -1;
      A.state.dragX = 0;
      return;
    }

    swipe = null;
    A.state.cart = A.state.cart.filter(function (_, j) { return j !== idx; });
    A.setState({ dragI: -1, dragX: 0 });
  }

  A.action('p:pointerup:cartrow', endSwipe);
  A.action('p:pointercancel:cartrow', endSwipe);

  /* ========================================================================
     7 - Tracking

     Four steps advance on their own: 2 at 2800ms, 3 at 7200ms, 4 at 12500ms.
     The ETA ticks down 4 minutes every 4200ms, floored at zero. The active
     dot pulses until the order completes.
     ======================================================================== */

  A.screen('tracking', function (s) {
    var steps = D.STEPICS.map(function (ic, i) {
      var n = i + 1;
      var done = s.step > n;
      var act = s.step === n;
      var cls = 'step-dot' + (done ? ' step-dot--done' : act ? ' step-dot--active' : '');
      if (act && s.step < 4) { cls += ' step-dot--pulse'; }
      var bar = i < 3
        ? '<div class="step-bar"><div class="step-bar__fill" style="width:' + (done ? '100%' : '0%') + '"></div></div>'
        : '';
      return '' +
        '<div class="step">' +
          '<div class="' + cls + '">' +
            '<svg width="15" height="15" viewBox="0 0 24 24"><path d="' + ic + '" fill="' + (done || act ? '#fff' : '#B9A48C') + '"></path></svg>' +
          '</div>' + bar +
        '</div>';
    }).join('');

    var labels = D.STEPLBL.map(function (l, i) {
      var on = s.step >= i + 1;
      return '<div class="' + (on ? 'step-lbl step-lbl--on' : 'step-lbl') + '">' + A.esc(l) + '</div>';
    }).join('');

    var etaMsg = s.step >= 4
      ? 'Enjoy your bolt, Afif ⚡ See you again'
      : s.step === 3
        ? 'Ready! Collect at the pickup counter'
        : "We're brewing your bolt at Kubang Kerian";

    var lines = D.ORDER.lines.map(function (l) {
      return '<div class="odet__row"><span class="odet__name">' + A.esc(l.n) + '</span>' +
             '<span class="odet__amt">' + A.esc(l.amt) + '</span></div>';
    }).join('');

    return '' +
      '<div class="track noscroll">' +

        '<div class="track__head">' +
          '<button class="gbtn" data-act="nav" data-s="home">←</button>' +
          '<div>' +
            '<div class="track__id">' + A.esc(D.ORDER.id) + '</div>' +
            '<div class="track__placed">' + A.esc(D.ORDER.placed) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="track__rail">' +
          '<div class="track__steps">' + steps + '</div>' +
          '<div class="track__labels">' + labels + '</div>' +
        '</div>' +

        '<div class="glass-dark eta">' +
          '<svg class="eta__bolt" width="90" height="90" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
          '<div>' +
            '<div class="eta__n">' + s.eta + '<span class="eta__unit"> min</span></div>' +
            '<div class="eta__msg">' + A.esc(etaMsg) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="glass odet">' +
          '<div class="odet__title">Order details</div>' +
          '<div class="odet__list">' +
            lines +
            '<div class="odet__row odet__row--total"><span>Total</span><span>' + A.esc(D.ORDER.total) + '</span></div>' +
          '</div>' +
        '</div>' +

        '<button class="cta-outline track__back" data-act="nav" data-s="home">Back to Home</button>' +

      '</div>';
  });

  A.action('place-order', function () {
    A.nav('tracking');
    A.setState({ step: 1, eta: 12 });

    A.T(function () { A.setState({ step: 2 }); }, 2800);
    A.T(function () { A.setState({ step: 3 }); }, 7200);
    A.T(function () { A.setState({ step: 4, eta: 0 }); }, 12500);

    A.setEtaTimer(setInterval(function () {
      A.setState({ eta: Math.max(0, A.state.eta - 4) });
    }, 4200));
  });

  /* ========================================================================
     8 - Rewards

     Three tabs. Missions carries the 196px progress ring (dasharray 528,
     animating to points/1000), the seven-day check-in strip of flipping
     coins, and the mission list. The other two tabs land in Task 14.
     ======================================================================== */

  function rewardsHeader(s) {
    var tabs = ['Missions', 'Redeem', 'My Rewards'].map(function (t, i) {
      return '<button class="rw-tab' + (s.rwTab === i ? ' rw-tab--active' : '') +
             '" data-act="set-rw" data-i="' + i + '">' + t + '</button>';
    }).join('');
    return '' +
      '<div class="glass-bar rw__head">' +
        '<div class="rw__title">Missions &amp; Rewards</div>' +
        '<div class="rw__tabs">' + tabs + '</div>' +
      '</div>';
  }

  function missionsTab(s) {
    var pct = Math.min(1, s.points / D.COPY.goldTarget);
    var offset = s.ringOn ? 528 * (1 - pct) : 528;

    var coins = D.COINS.days.map(function (d, i) {
      var today = i === D.COINS.today;
      var done = i < D.COINS.claimed || (today && s.checked);
      var val = D.COINS.vals[i];

      var cls = 'coin' + (done ? ' coin--flipped' : '');
      if (today && s.flipping && !s.checked) { cls += ' coin--flipping'; }

      return '' +
        '<div class="coin-cell">' +
          '<div class="coin-stage">' +
            '<div class="' + cls + '">' +
              '<div class="coin__face' + (today ? ' coin__face--today' : '') + '">' + val + 'pt' + (val > 1 ? 's' : '') + '</div>' +
              '<div class="coin__back">' +
                '<svg width="13" height="13" viewBox="0 0 24 24"' + (today && s.checked ? ' class="coin__stamp"' : '') + '><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="coin-cell__d">' + A.esc(d) + '</div>' +
        '</div>';
    }).join('');

    var confetti = !s.confetti ? '' :
      '<div class="confetti">' +
        '<div class="confetti__p confetti__p--1"></div>' +
        '<div class="confetti__p confetti__p--2"></div>' +
        '<div class="confetti__p confetti__p--3"></div>' +
        '<div class="confetti__p confetti__p--4"></div>' +
        '<div class="confetti__p confetti__p--5"></div>' +
        '<div class="confetti__p confetti__p--6"></div>' +
        '<div class="confetti__p confetti__p--7"></div>' +
        '<div class="confetti__p confetti__p--8"></div>' +
      '</div>';

    var missions = D.MISSIONS.map(function (m) {
      return '' +
        '<div class="glass mission">' +
          '<div class="mission__top">' +
            '<div class="mission__t">' + A.esc(m.t) + '</div>' +
            '<div class="mission__pts">+' + m.pts + ' pts</div>' +
          '</div>' +
          '<div class="mission__s">' + A.esc(m.s) + '</div>' +
          '<div class="mission__bar"><div class="mission__fill" style="width:' + m.w + '%"></div></div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="ring-wrap">' +
        '<svg width="196" height="196" viewBox="0 0 200 200">' +
          '<circle cx="100" cy="100" r="84" fill="none" stroke="#F0E4C6" stroke-width="13"></circle>' +
          '<circle class="ring__arc" cx="100" cy="100" r="84" fill="none" stroke="#EE7623" stroke-width="13" stroke-linecap="round" stroke-dasharray="528" style="stroke-dashoffset:' + offset + '" transform="rotate(-90 100 100)"></circle>' +
          '<g transform="translate(64,52) scale(0.52)">' +
            '<path d="M70 14 C39 14 16 37 16 68 c0 31 23 54 54 54 h34 c5 0 9-4 9-9 V88 c8-2 14-10 14-19 0-11-9-20-20-20h-4 C97 30 85 14 70 14z" fill="#7A2418"></path>' +
            '<circle cx="107" cy="69" r="9" fill="#FDF9F0"></circle>' +
            '<path d="M78 26 56 66h16l-8 44 32-52H78l10-32z" fill="#EE7623"></path>' +
          '</g>' +
        '</svg>' +
        '<div class="ring__center">' +
          '<div class="ring__n">' + s.points + '</div>' +
          '<div class="ring__lbl">bolt points</div>' +
        '</div>' +
      '</div>' +

      '<div class="ring__to-gold">' + (D.COPY.goldTarget - s.points) + ' pts to <span class="ring__gold">GOLD BOLT</span> tier</div>' +

      '<div class="glass glass--raised checkin">' +
        confetti +
        '<div class="checkin__top">' +
          '<div class="checkin__t">Daily Check-in</div>' +
          '<div class="checkin__day">Day 4 of 7</div>' +
        '</div>' +
        '<div class="checkin__coins">' + coins + '</div>' +
        '<button class="checkin__btn' + (s.checked ? ' checkin__btn--done' : '') + '" data-act="checkin">' +
          (s.checked ? 'Checked in — +3 pts ⚡' : 'Check-in &amp; get 3 pts') +
        '</button>' +
      '</div>' +

      '<div class="rw__section">Complete missions, earn bolts</div>' +
      '<div class="mission-list">' + missions + '</div>';
  }

  function redeemTab(s) {
    var tiles = D.REDEEMS.map(function (r) {
      return '' +
        '<div class="glass redeem">' +
          '<div class="redeem__v" style="background:' + r.bg + ';color:' + r.fg + '">' + A.esc(r.v) + '</div>' +
          '<div class="redeem__foot">' +
            '<div class="redeem__with">Redeem with</div>' +
            '<div class="redeem__pts">' + r.pts + ' pts</div>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="glass-dark balance">' +
        '<svg width="26" height="30" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
        '<div class="balance__text">' +
          '<div class="balance__lbl">YOUR BALANCE</div>' +
          '<div class="balance__n">' + s.points + ' pts</div>' +
        '</div>' +
        '<div class="balance__tier">EASY GOER</div>' +
      '</div>' +

      '<div class="rw__section rw__section--tight">Getta Rewards</div>' +
      '<div class="redeem-grid">' + tiles + '</div>' +

      '<div class="rw__section rw__section--tight">Gold Bolt Exclusive</div>' +
      '<div class="gold">' +
        '<svg class="gold__bolt" width="72" height="72" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#E0A526"></path></svg>' +
        '<div class="gold__disc"><svg width="20" height="20" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#2B1510"></path></svg></div>' +
        '<div class="gold__text">' +
          '<div class="gold__t">RM 12 OFF anything</div>' +
          '<div class="gold__s">1,000 pts · Gold Bolt members only</div>' +
        '</div>' +
        '<div class="gold__lock">LOCKED</div>' +
      '</div>';
  }

  function mineTab(s) {
    var list = D.VOUCHERS.map(function (v) {
      var used = !!s.used[v.i];
      var tearing = s.torn === v.i;
      return '' +
        '<div class="voucher' + (used ? ' voucher--used' : '') + '">' +
          '<div class="voucher__stub' + (used ? ' voucher__stub--used' : '') + (tearing ? ' voucher__stub--tearing' : '') + '">' +
            '<div class="voucher__amt">' + A.esc(v.amt) + '</div>' +
            '<div class="voucher__off">OFF</div>' +
          '</div>' +
          '<div class="voucher__main">' +
            '<div class="voucher__notch voucher__notch--top"></div>' +
            '<div class="voucher__notch voucher__notch--bot"></div>' +
            '<div class="voucher__t">' + A.esc(v.t) + '</div>' +
            '<div class="voucher__meta">' +
              '<span>Validity <b>' + v.days + ' days</b></span>' +
              '<span>Min spend <b>' + A.esc(v.min) + '</b></span>' +
            '</div>' +
            '<button class="voucher__btn' + (used ? ' voucher__btn--used' : '') + '" data-act="use-voucher" data-i="' + v.i + '">' +
              (used ? 'USED' : 'Use now') +
            '</button>' +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="rw__section rw__section--first">Your vouchers</div>' +
      '<div class="voucher-list">' + list + '</div>';
  }

  A.screen('rewards', function (s) {
    var body = s.rwTab === 0 ? missionsTab(s)
             : s.rwTab === 1 ? redeemTab(s)
             : mineTab(s);
    return '' +
      '<div class="rw">' +
        rewardsHeader(s) +
        '<div class="rw__scroll noscroll">' + body + '</div>' +
      '</div>';
  });

  A.action('set-rw', function (e, d) {
    A.setState({ rwTab: +d.i, ringOn: false });
    A.T(function () { A.setState({ ringOn: true }); }, 250);
  });

  A.action('checkin', function () {
    if (A.state.checked) { return; }
    A.setState({ flipping: true });
    A.T(function () {
      A.state.points = A.state.points + 3;
      A.state.dp = A.state.points;
      A.setState({ checked: true, confetti: true });
    }, 350);
    A.T(function () { A.setState({ confetti: false }); }, 1400);
  });

  A.action('use-voucher', function (e, d) {
    var i = +d.i;
    if (A.state.used[i]) { return; }
    A.setState({ torn: i });
    A.T(function () {
      A.state.used = A.assign({}, A.state.used);
      A.state.used[i] = true;
      A.setState({ torn: -1 });
    }, 850);
  });

  /* jump straight to the My Rewards tab - used by the Account screen */
  A.action('go-vouchers', function () {
    A.state.rwTab = 2;
    A.nav('rewards');
  });

  /* ========================================================================
     9 - Account

     Avatar, wallet card, and two link lists whose rows cross into other
     screens: Orders opens tracking, Missions and My Vouchers open rewards
     on the right tab.
     ======================================================================== */

  var CHEVRON = '<svg width="13" height="13" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="#8A6A55" stroke-width="2.4" stroke-linecap="round"></path></svg>';

  function acctRow(icon, label, act, extra, last, fill) {
    return '' +
      '<div class="acct-row hover-row' + (last ? '' : ' divider') + '"' + (act ? ' data-act="' + act + '"' + (extra || '') : '') + '>' +
        '<svg width="19" height="19" viewBox="0 0 24 24"><path d="' + icon + '" fill="' + (fill || '#7A2418') + '"></path></svg>' +
        '<div class="acct-row__lbl">' + label + '</div>' +
        CHEVRON +
      '</div>';
  }

  A.screen('account', function (s) {
    return '' +
      '<div class="acct noscroll">' +

        '<div class="acct__head">' +
          '<div class="acct__spacer"></div>' +
          '<div class="acct__title">Account</div>' +
          '<button class="gbtn">' +
            '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9 4a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L16 3H8l-.4 2.6a7 7 0 0 0-2 1.2l-2.5-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.5-1a7 7 0 0 0 2 1.2L8 21h8l.4-2.6a7 7 0 0 0 2-1.2l2.5 1 2-3.4-2-1.6c.06-.4.1-.8.1-1.2z" fill="#7A2418"></path></svg>' +
          '</button>' +
        '</div>' +

        '<div class="acct__id">' +
          /* the avatar is a little cup with a face, drawn in divs as the
             source draws it - dark glass lid over an orange body */
          '<div class="acct__avatar">' +
            '<div class="acct__cup">' +
              '<div class="acct__cup-lid"></div>' +
              '<div class="acct__cup-body">' +
                '<div class="acct__eye acct__eye--l"></div>' +
                '<div class="acct__eye acct__eye--r"></div>' +
                '<div class="acct__mouth"></div>' +
                '<div class="acct__blush acct__blush--l"></div>' +
                '<div class="acct__blush acct__blush--r"></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div class="acct__choose">CHOOSE YOUR AVATAR</div>' +
            '<div class="acct__name">' + A.esc(D.COPY.customerName) + '</div>' +
            '<div class="acct__email">' + A.esc(D.COPY.customerEmail) + '</div>' +
          '</div>' +
        '</div>' +

        '<div class="glass glass--tile glass--raised acct__wallet">' +
          '<div class="acct__wallet-top">' +
            '<div class="cup-well acct__wcup-well">' +
              '<div class="acct__wcup">' +
                '<div class="cup__lid acct__wlid"></div>' +
                '<div class="acct__wbody"><svg width="10" height="12" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg></div>' +
              '</div>' +
            '</div>' +
            '<div class="acct__wtext">' +
              '<div class="acct__wlbl">Balance</div>' +
              '<div class="acct__wbal"><span class="acct__wrm">RM</span> 24.60</div>' +
              '<button class="cta-outline cta-outline--fill acct__topup">+ Top Up</button>' +
            '</div>' +
            '<svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" fill="none" stroke="#8A6A55" stroke-width="2.4" stroke-linecap="round"></path></svg>' +
          '</div>' +
          '<div class="acct__split">' +
            '<div class="acct__stat">' +
              '<div class="acct__stat-lbl">Bolt Points <span class="acct__stat-tag">DAILY CHECK-IN</span></div>' +
              '<div class="acct__stat-v">' + s.points + ' pts</div>' +
            '</div>' +
            '<div class="acct__rule"></div>' +
            '<div class="acct__stat">' +
              '<div class="acct__stat-lbl">Cup Streak</div>' +
              '<div class="acct__stat-v">4 / 10 ☕︎</div>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="acct__section">My Purchase</div>' +
        '<div class="glass acct__list">' +
          acctRow('M5 3h14v18l-2-1.5L15 21l-2-1.5L11 21l-2-1.5L7 21l-2-1.5V3zm3 5h8v1.8H8V8zm0 4h8v1.8H8V12z', 'Orders', 'nav', ' data-s="tracking"', false) +
          acctRow('M8 2h8l-1 4H9L8 2zm-1 6h10l-1.2 14H8.2L7 8zm5 3-2.4 4.6h2l-1 3.8 3.8-5.4h-2l.8-3z', 'Register Your Tumbler', null, null, true) +
        '</div>' +

        '<div class="acct__section">Especially For You</div>' +
        '<div class="glass acct__list acct__list--last">' +
          acctRow(BOLT_PATH, 'Missions &amp; Rewards', 'nav', ' data-s="rewards"', false, '#EE7623') +
          acctRow('M3 7h18v4a2 2 0 0 0 0 2v4H3v-4a2 2 0 0 0 0-2V7zm5 2v6h1.6V9H8zm4 0-2 3.8h1.6l-.8 3 3.2-4.4h-1.6l.8-2.4h-1.2z', 'My Vouchers', 'go-vouchers', null, true) +
        '</div>' +

        '<div class="acct__footer">' + A.esc(D.COPY.footer) + '</div>' +

      '</div>';
  });

})(APP, D);
