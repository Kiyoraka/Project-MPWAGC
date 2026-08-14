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
              '<div class="prodv__cup">' +
                '<div class="cup__lid prodv__lid"></div>' +
                '<div class="cup__body prodv__body" style="background:linear-gradient(180deg,' + p.c1 + ',' + p.c2 + ')">' +
                  '<div class="cup__foam prodv__foam"></div>' +
                '</div>' +
              '</div>' +
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
        n: p.n, det: det, pr: price, qty: A.state.qty, c1: p.c1, c2: p.c2
      });
      A.setState({ bump: A.state.bump + 1, flying: false });
    }, 620);

    A.T(function () { A.setState({ added: false }); }, 1600);
  });

})(APP, D);
