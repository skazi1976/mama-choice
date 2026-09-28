// MamaChoice accessibility layer (WCAG 2.1 AA / IS 5568) — 2026-09-27.
// Loaded on every page next to js/track.js. It adds what the static pages lacked: a main
// landmark and skip link, named navigation regions, emoji hidden from screen readers,
// underlined in-text links, corrected heading levels, a link to the accessibility statement,
// and a contrast repair that measures each text against its real background and darkens it
// only when it falls under 4.5:1 (every article has its own accent colour, many too light).
(function () {
  "use strict";
  if (window.__mcA11y) return;
  window.__mcA11y = true;
  function byId(id) { return document.querySelector("#" + id); }
  var EMOJI = /([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B06}\u{2194}-\u{21FF}★☆️]+)/u;

  function rgb(s) { var m = String(s).match(/[\d.]+/g); return m ? { r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3] } : null; }
  function lum(c) { var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
  function ratio(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  // The first opaque background behind an element, and the element that paints it.
  function bgOf(e) { while (e && e.nodeType === 1) { var st = getComputedStyle(e), c = rgb(st.backgroundColor); if (c && c.a > 0.9) return { c: c, el: e }; if (st.backgroundImage !== "none") return null; e = e.parentElement; } return { c: { r: 255, g: 255, b: 255, a: 1 }, el: null }; }
  function hex(c) { return "#" + [c.r, c.g, c.b].map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? "0" : "") + v.toString(16); }).join(""); }
  var WHITE = { r: 255, g: 255, b: 255 }, BLACK = { r: 0, g: 0, b: 0 };
  function repair(e) {
    var st = getComputedStyle(e);
    if (st.visibility === "hidden" || +st.opacity === 0) return;
    var fg = rgb(st.color), found = bgOf(e);
    if (!fg || !found || fg.a === 0) return;
    var bg = found.c;
    // Semi-transparent text (white at 35% on a dark footer, or an element at opacity .85) is judged
    // by the colour it actually shows on its background.
    var alpha = fg.a * (+st.opacity || 1), raw = fg;
    var blend = function (b) { return { r: raw.r * alpha + b.r * (1 - alpha), g: raw.g * alpha + b.g * (1 - alpha), b: raw.b * alpha + b.b * (1 - alpha), a: 1 }; };
    fg = blend(bg);
    // WCAG "large text" (24px, or 18.66px bold) needs only 3:1 — this keeps the logo and big headings in brand colour.
    var px = parseFloat(st.fontSize) || 16, large = px >= 24 || (px >= 18.66 && (+st.fontWeight || 400) >= 700);
    var need = large ? 3 : 4.5, aim = need + 0.1;
    if (ratio(fg, bg) >= need) return;
    // Light text on a coloured button or band: keep the text, deepen the colour behind it.
    var host = found.el;
    if (lum(fg) > 0.6 && alpha > 0.6 && host && host !== document.body && host !== document.documentElement && lum(bg) < 0.6 && getComputedStyle(host).backgroundImage === "none") {
      var b = bg;
      for (var k = 0; k < 25 && ratio(blend(b), b) < aim; k++) b = { r: b.r * 0.9, g: b.g * 0.9, b: b.b * 0.9 };
      host.style.setProperty("background-color", hex(b), "important"); host.dataset.a11yC = "1";
      return;
    }
    if (alpha < 1) e.style.setProperty("opacity", "1", "important");
    // Otherwise move the text toward whichever end (black or white) can actually reach 4.5:1.
    var darken = ratio(BLACK, bg) >= ratio(WHITE, bg), c = fg;
    for (var i = 0; i < 40 && ratio(c, bg) < aim; i++) c = darken ? { r: c.r * 0.88, g: c.g * 0.88, b: c.b * 0.88 } : { r: c.r + (255 - c.r) * 0.15, g: c.g + (255 - c.g) * 0.15, b: c.b + (255 - c.b) * 0.15 };
    e.style.setProperty("color", hex(c), "important"); e.dataset.a11yC = "1";
  }
  function fixColours(root) {
    var els = (root || document.body).querySelectorAll("a,button,span,div,p,h1,h2,h3,h4,h5,small,b,strong,em,label,li,td,th");
    for (var i = 0; i < els.length; i++) {
      var e = els[i];
      if (e.dataset.a11yC) continue;
      e.dataset.a11yC = "0";   // checked; becomes "1" only if repair() actually recoloured it
      if ([].some.call(e.childNodes, function (n) { return n.nodeType === 3 && n.textContent.trim(); })) { try { repair(e); } catch (err) {} }
    }
  }
  function hideEmoji(root) {
    var nodes = (root || document).querySelectorAll("a,button,h1,h2,h3,h4,h5,label,.badge");
    for (var i = 0; i < nodes.length; i++) {
      var w = document.createTreeWalker(nodes[i], NodeFilter.SHOW_TEXT, null), list = [], n;
      while ((n = w.nextNode())) if (EMOJI.test(n.textContent) && !(n.parentNode && n.parentNode.getAttribute && n.parentNode.getAttribute("aria-hidden"))) list.push(n);
      list.forEach(function (tn) {
        var frag = document.createDocumentFragment();
        tn.textContent.split(EMOJI).forEach(function (p) {
          if (!p) return;
          if (EMOJI.test(p)) { var sp = document.createElement("span"); sp.setAttribute("aria-hidden", "true"); sp.textContent = p; frag.appendChild(sp); }
          else frag.appendChild(document.createTextNode(p));
        });
        tn.parentNode.replaceChild(frag, tn);
      });
    }
  }

  // Floating buttons (WhatsApp, Telegram, the accessibility menu) sit outside every landmark;
  // gather them into one named region so a screen reader can still find them. They are
  // position:fixed, so moving them does not change where they appear.
  function gatherStrays() {
    var aside = byId("mc-float-links");
    [].slice.call(document.body.children).forEach(function (k) {
      if (/^(MAIN|NAV|HEADER|FOOTER|ASIDE|SCRIPT|STYLE|LINK|NOSCRIPT|TEMPLATE|IFRAME)$/.test(k.tagName)) return;
      if (k.classList.contains("mc-skip") || k.getAttribute("role") || k.getAttribute("aria-hidden") === "true") return;
      if (!k.textContent.trim() && !k.querySelector("a,button,input,img[alt]:not([alt=''])")) return;
      if (!aside) { aside = document.createElement("aside"); aside.id = "mc-float-links"; aside.setAttribute("aria-label", "קישורים מהירים"); document.body.appendChild(aside); }
      aside.appendChild(k);
    });
  }

  function setup() {
    var css = document.createElement("style");
    css.textContent =
      ".mc-skip{position:fixed;right:10px;top:-80px;z-index:2147483000;background:#2D2D2D;color:#fff;padding:12px 18px;border-radius:10px;font:700 15px/1.2 system-ui,sans-serif;text-decoration:none}" +
      ".mc-skip:focus{top:10px}" +
      ":is(a,button,input,select,textarea,[tabindex]):focus-visible{outline:3px solid #5b3fd0!important;outline-offset:3px!important}" +
      "main p a:not([class]),main li a:not([class]),.content-section p a,footer p a{text-decoration:underline!important;text-underline-offset:2px}";
    document.head.appendChild(css);

    // Main landmark: everything between the top navigation and the footer.
    if (!document.querySelector("main,[role=main]")) {
      var kids = [].slice.call(document.body.children), start = -1, end = kids.length;
      for (var i = 0; i < kids.length; i++) {
        var t = kids[i].tagName;
        if (start < 0 && !/^(NAV|HEADER|SCRIPT|STYLE|LINK|NOSCRIPT)$/.test(t)) start = i;
        if (t === "FOOTER") { end = i; break; }
      }
      if (start >= 0 && start < end) {
        var main = document.createElement("main"); main.id = "main"; main.tabIndex = -1;
        document.body.insertBefore(main, kids[start]);
        for (var j = start; j < end; j++) if (!/^(SCRIPT|STYLE|LINK)$/.test(kids[j].tagName)) main.appendChild(kids[j]);
      }
    }
    var mainEl = document.querySelector("main,[role=main]");
    if (mainEl && !mainEl.id) mainEl.id = "main";
    if (mainEl && !document.querySelector(".mc-skip")) {
      var sk = document.createElement("a"); sk.className = "mc-skip"; sk.href = "#main"; sk.textContent = "דלג לתוכן";
      sk.addEventListener("click", function (e) { e.preventDefault(); mainEl.setAttribute("tabindex", "-1"); mainEl.focus(); });
      document.body.insertBefore(sk, document.body.firstChild);
    }
    // Name every navigation region so they can be told apart.
    var navs = document.querySelectorAll("nav");
    [].forEach.call(navs, function (n, i) {
      if (n.getAttribute("aria-label")) return;
      n.setAttribute("aria-label", n.closest("footer") ? "קישורים באתר" : (i === 0 ? "ניווט ראשי" : "ניווט משני " + i));
    });
    // Menu button: say whether the menu is open.
    var mt = document.querySelector(".menu-toggle");
    if (mt) {
      var sync = function () {
        var menu = document.querySelector(".nav-links,.nav-menu,nav ul");
        if (menu) mt.setAttribute("aria-expanded", String(getComputedStyle(menu).display !== "none" && menu.getBoundingClientRect().height > 0));
      };
      sync(); mt.addEventListener("click", function () { setTimeout(sync, 60); });
    }
    // Skipped heading levels (h1 → h3/h4) get a corrected spoken level.
    var prev = 0;
    [].forEach.call(document.querySelectorAll("h1,h2,h3,h4,h5,h6"), function (h) {
      var lv = +h.getAttribute("aria-level") || +h.tagName[1];
      if (prev && lv > prev + 1) { lv = prev + 1; h.setAttribute("aria-level", lv); }
      prev = lv;
    });
    // Link to the accessibility statement, in the footer (or at the end of the page).
    if (!document.querySelector('a[href*="accessibility.html"]')) {
      var host = document.querySelector("footer") || document.body;
      var p = document.createElement("p"); p.style.cssText = "text-align:center;margin:10px 0;font-size:14px";
      var a = document.createElement("a"); a.href = "/accessibility.html"; a.textContent = "הצהרת נגישות";
      a.style.cssText = "text-decoration:underline"; p.appendChild(a); host.appendChild(p);
    }
    hideEmoji(); fixColours(); gatherStrays();
    // Accessibility menu (text size, contrast, motion, links).
    if (!byId("a11yWidgetJs")) { var ws = document.createElement("script"); ws.id = "a11yWidgetJs"; ws.src = "/js/a11y-widget.js?v=1"; ws.defer = true; document.head.appendChild(ws); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup); else setup();
  window.addEventListener("load", function () { setTimeout(function () { hideEmoji(); fixColours(); gatherStrays(); }, 1200); });
})();
