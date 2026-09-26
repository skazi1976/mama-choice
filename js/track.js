// מדידת קליקים: קישורי רכישה (עלי אקספרס), מנוע החיפוש OneFindMe וקישורים יוצאים אחרים.
// שולח אירועי GA4 עם שם העמוד, מיקום המוצר וטקסט הכפתור. בלי מידע אישי.
(function () {
  function page() {
    var p = location.pathname.replace(/\/$/, "/index.html").split("/").pop() || "index.html";
    return p.replace(/\.html$/, "");
  }
  function pageType() {
    var p = location.pathname;
    return p.indexOf("/articles/") > -1 ? "article" : p.indexOf("/categories/") > -1 ? "category"
         : p.indexOf("/gallery/") > -1 ? "gallery" : "page";
  }
  function productPosition(a) {
    var box = a.closest && a.closest("[id^='product-']");
    if (box) return parseInt(box.id.replace("product-", ""), 10) || 0;
    var all = document.querySelectorAll("a[href*='s.click.aliexpress.com']");
    for (var i = 0; i < all.length; i++) if (all[i] === a) return i + 1;
    return 0;
  }
  function productName(a) {
    var box = a.closest && a.closest(".article-product, .product-card, [id^='product-']");
    var h = box && box.querySelector("h3, h4");
    return h ? h.textContent.trim().slice(0, 90) : "";
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || typeof gtag !== "function") return;
    var href = a.href, text = (a.textContent || "").trim().slice(0, 60);
    var base = { page_name: page(), page_type: pageType(), cta_text: text, transport_type: "beacon" };
    if (href.indexOf("aliexpress.com") > -1) {
      base.product_position = productPosition(a);
      base.product_name = productName(a);
      base.link_url = href.slice(0, 100);
      gtag("event", "affiliate_click", base);
    } else if (href.indexOf("onefindme.com") > -1) {
      base.link_url = href.slice(0, 100);
      gtag("event", "engine_click", base);
    } else if (a.hostname && a.hostname !== location.hostname) {
      base.link_url = href.slice(0, 100);
      gtag("event", "outbound_click", base);
    }
  }, true);
})();
