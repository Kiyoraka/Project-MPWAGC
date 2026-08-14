/* ==========================================================================
   Getta Coffee - Customer PWA - Arrival and browsing screens

   splash · onboard · home · menu

   Each screen registers a renderer that returns HTML for its container, and
   any handlers it owns. Markup, values and animation timings are transcribed
   from "Getta PWA v2.dc.html"; only the renderer differs from the design.
   ========================================================================== */

(function (A, D) {
  'use strict';

  /* the G-mug body path, shared by the splash artwork and its clip mask */
  var MUG_PATH = 'M70 14 C39 14 16 37 16 68 c0 31 23 54 54 54 h34 c5 0 9-4 9-9 V88 c8-2 14-10 14-19 0-11-9-20-20-20h-4 C97 30 85 14 70 14z';
  var BOLT_PATH = 'M13 2 3 14h6l-2 8 10-12h-6l2-8z';

  /* ========================================================================
     1 - Splash

     Three staggered animations, all `both` so they hold their end state:
       bolt      boltDrop .55s after .18s
       mug fill  mugFill  .7s  after .75s   (clipped to the mug silhouette)
       wordmark  wordIn   .4s  after 1.15s
     app.js hands over to onboarding at 1900ms, just after the wordmark lands.
     ======================================================================== */

  A.screen('splash', function () {
    return '' +
      '<div class="splash">' +
        '<svg width="150" height="150" viewBox="0 0 140 140">' +
          '<defs><clipPath id="gmug"><path d="' + MUG_PATH + '"></path></clipPath></defs>' +
          '<path d="' + MUG_PATH + '" fill="#F7F1DC"></path>' +
          '<circle cx="107" cy="69" r="9" fill="#7A2418"></circle>' +
          '<g clip-path="url(#gmug)">' +
            '<g class="splash__fill">' +
              '<rect x="0" y="52" width="140" height="90" fill="#EE7623"></rect>' +
              '<rect x="0" y="52" width="140" height="8" fill="#F2953F"></rect>' +
            '</g>' +
          '</g>' +
          '<path class="splash__bolt" d="M78 26 56 66h16l-8 44 32-52H78l10-32z" fill="#7A2418"></path>' +
        '</svg>' +
        '<div class="splash__word">' +
          '<div class="splash__name">GETTA<br>COFFEE</div>' +
          '<div class="splash__tag">KOPI AT LIGHTNING SPEED</div>' +
        '</div>' +
      '</div>';
  });

  /* ========================================================================
     2 - Onboarding

     Three slides. The source puts key="{{ obIdx }}" on the slide body, which
     React treats as a remount instruction - so the fadeUp entrance replays
     on every slide change. Our renderer rebuilds the screen on each state
     change anyway, so the same replay happens for the same reason.

     Dots morph 8px -> 24px on the active index. The CTA reads "Next" until
     the last slide, then "Let's Getta Coffee".
     ======================================================================== */

  A.screen('onboard', function (s) {
    var slide = D.OB[s.obIdx];
    var last = s.obIdx >= D.OB.length - 1;

    var dots = D.OB.map(function (_, i) {
      return '<div class="ob-dot' + (i === s.obIdx ? ' ob-dot--active' : '') + '"></div>';
    }).join('');

    return '' +
      '<div class="onboard">' +
        '<div class="onboard__skip-row">' +
          '<button class="onboard__skip" data-act="ob-skip">Skip</button>' +
        '</div>' +

        '<div class="onboard__body">' +
          '<div class="onboard__disc" style="background:' + slide.bg + '">' +
            '<svg width="84" height="84" viewBox="0 0 24 24"><path d="' + slide.ic + '" fill="#F7F1DC"></path></svg>' +
          '</div>' +
          '<div class="onboard__title">' + A.esc(slide.t) + '</div>' +
          '<div class="onboard__desc">' + A.esc(slide.d) + '</div>' +
        '</div>' +

        '<div class="onboard__dots">' + dots + '</div>' +

        '<button class="cta cta--maroon onboard__cta" data-act="ob-next">' +
          (last ? 'Let\'s Getta Coffee' : 'Next') +
        '</button>' +
      '</div>';
  });

  A.action('ob-skip', function () {
    A.nav('home');
  });

  A.action('ob-next', function () {
    var s = A.state;
    if (s.obIdx >= D.OB.length - 1) {
      A.nav('home');
    } else {
      A.setState({ obIdx: s.obIdx + 1 });
    }
  });

  /* ========================================================================
     3 - Home

     Wallet and bolt points show `dw` / `dp`, the animated count-up figures
     app.js drives. The carousel track is 358px per slide - the design's
     390px width less its 16px side padding - and translates by index. The
     decorative bolt on each slide parallaxes by (i - bIdx) * -26px.
     ======================================================================== */

  A.screen('home', function (s) {
    var SLIDE = 358;

    var slides = D.BANNERS.map(function (b, i) {
      var par = 'transform:translateX(' + ((i - s.bIdx) * -26) + 'px)';
      return '' +
        '<div class="ban" style="background:' + b.bg + '">' +
          '<svg class="ban__bolt" width="130" height="130" viewBox="0 0 24 24" style="' + par + '">' +
            '<path d="' + BOLT_PATH + '" fill="' + b.deco + '"></path>' +
          '</svg>' +
          '<div class="ban__body">' +
            '<div class="ban__title" style="color:' + b.fg + '">' + A.esc(b.t) + '</div>' +
            '<div class="ban__sub" style="color:' + b.sub + '">' + A.esc(b.s) + '</div>' +
            '<div class="ban__cta" style="background:' + b.btnBg + ';color:' + b.btnFg + '">' + A.esc(b.cta) + '</div>' +
          '</div>' +
        '</div>';
    }).join('');

    var dots = D.BANNERS.map(function (_, i) {
      return '<div class="ban-dot' + (i === s.bIdx ? ' ban-dot--active' : '') + '"></div>';
    }).join('');

    var install = !s.install ? '' :
      '<div class="install">' +
        '<svg width="26" height="26" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
        '<div class="install__text">' +
          '<div class="install__title">Install Getta Coffee</div>' +
          '<div class="install__sub">Add to Home Screen — works offline</div>' +
        '</div>' +
        '<button class="install__add" data-act="install-dismiss">Add</button>' +
        '<button class="install__x" data-act="install-dismiss">✕</button>' +
      '</div>';

    return '' +
      '<div class="home noscroll">' +

        '<div class="home__head">' +
          '<div>' +
            '<div class="home__greet">' + A.esc(D.COPY.greeting) + '</div>' +
            '<div class="home__greet-sub">' + A.esc(D.COPY.greetingSub) + '</div>' +
          '</div>' +
          '<button class="gbtn gbtn--lg home__bell">' +
            '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v4l-2 4h18l-2-4V9a7 7 0 0 0-7-7zm-3 17a3 3 0 0 0 6 0z" fill="#7A2418"></path></svg>' +
            '<div class="gbtn__dot"></div>' +
          '</button>' +
        '</div>' +

        '<div class="home__tiles">' +
          '<div class="glass tile">' +
            '<div class="tile__lbl">WALLET (RM)</div>' +
            '<div class="tile__val">' + A.esc(s.dw) + '</div>' +
          '</div>' +
          '<div class="glass tile">' +
            '<div class="tile__lbl">CUP STREAK</div>' +
            '<div class="tile__val">4<span class="tile__unit">/10 ☕︎</span></div>' +
          '</div>' +
          '<div class="tile tile--dark" data-act="nav" data-s="rewards">' +
            '<div class="tile__badge">CHECK-IN</div>' +
            '<div class="tile__lbl tile__lbl--dark">BOLT PTS</div>' +
            '<div class="tile__val tile__val--dark">' +
              '<svg width="11" height="14" viewBox="0 0 24 24"><path d="' + BOLT_PATH + '" fill="#EE7623"></path></svg>' +
              A.esc(s.dp) +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div class="carousel">' +
          '<div class="carousel__track" style="transform:translateX(-' + (s.bIdx * SLIDE) + 'px)">' + slides + '</div>' +
          '<div class="carousel__dots">' + dots + '</div>' +
        '</div>' +

        '<div class="home__modes">' +
          '<div class="glass glass--tile mode hover-lift" data-act="go-delivery">' +
            '<svg width="64" height="52" viewBox="0 0 64 52"><circle cx="14" cy="42" r="8" fill="none" stroke="#7A2418" stroke-width="3"></circle><circle cx="48" cy="42" r="8" fill="none" stroke="#7A2418" stroke-width="3"></circle><path d="M14 42 24 20h12l6 22" fill="none" stroke="#7A2418" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path><path d="M36 20h10l6 10" fill="none" stroke="#EE7623" stroke-width="3" stroke-linecap="round"></path><rect x="20" y="8" width="18" height="12" rx="3" fill="#EE7623"></rect><path d="M27 10.5 24 15h3l-1.5 4 5-6h-3l1.5-2.5z" fill="#F7F1DC"></path></svg>' +
            '<div class="mode__name">DELIVERY</div>' +
            '<div class="mode__sub">Bolted to your door</div>' +
          '</div>' +
          '<div class="glass glass--tile mode hover-lift" data-act="go-pickup">' +
            '<svg width="64" height="52" viewBox="0 0 64 52"><rect x="8" y="18" width="48" height="30" rx="4" fill="none" stroke="#7A2418" stroke-width="3"></rect><path d="M6 18 12 6h40l6 12" fill="none" stroke="#7A2418" stroke-width="3" stroke-linejoin="round"></path><path d="M8 18h48" stroke="#EE7623" stroke-width="4"></path><rect x="26" y="30" width="12" height="18" rx="2" fill="#EE7623"></rect></svg>' +
            '<div class="mode__name">PICKUP</div>' +
            '<div class="mode__sub">Skip the queue</div>' +
          '</div>' +
        '</div>' +

        install +
      '</div>';
  });

  A.action('install-dismiss', function (e) {
    e.stopPropagation();
    A.setState({ install: false });
  });

  A.action('go-delivery', function () {
    A.state.otype = 'delivery';
    A.nav('menu');
  });

  A.action('go-pickup', function () {
    A.state.otype = 'pickup';
    A.nav('menu');
  });

})(APP, D);
