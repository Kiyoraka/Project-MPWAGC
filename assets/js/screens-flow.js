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

})(APP, D);
