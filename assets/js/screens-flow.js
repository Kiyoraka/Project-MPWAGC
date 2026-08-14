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

})(APP, D);
