// Accessibility menu (shared with OneFindMe; copied for MamaChoice — statement link → /accessibility.html) — 2026-09-27.
// Our own, not a third-party overlay: overlays fight screen readers (the site already works
// with VoiceOver on its own). This menu is for low-vision visitors — bigger text, high
// contrast, no motion, visible links — plus the way to the accessibility statement.
// Settings persist per visitor (localStorage, guarded). Loaded by js/app.js and js/a11y-cat.js.
(function () {
  "use strict";
  // /pets/ replaces document.getElementById with a version that returns a truthy no-op stub for
  // missing ids, which made every "already exists?" check lie. querySelector is not patched.
  function byId(id) { return document.querySelector("#" + id); }
  if (window.__a11yWidget) return;
  window.__a11yWidget = true;

  var S = {
    he: { open: "תפריט נגישות", title: "הגדרות נגישות", size: "גודל טקסט", s0: "רגיל", s1: "גדול", s2: "גדול מאוד", hc: "ניגודיות גבוהה", motion: "עצירת אנימציות", links: "הדגשת קישורים", font: "גופן קריא", reset: "איפוס הגדרות", statement: "הצהרת נגישות", close: "סגירה", done: "ההגדרה נשמרה", vl: "שפת החיפוש הקולי", vauto: "אוטומטית (שפת הטלפון)" },
    en: { open: "Accessibility menu", title: "Accessibility settings", size: "Text size", s0: "Normal", s1: "Large", s2: "Extra large", hc: "High contrast", motion: "Stop animations", links: "Highlight links", font: "Readable font", reset: "Reset settings", statement: "Accessibility statement", close: "Close", done: "Setting saved", vl: "Voice search language", vauto: "Automatic (phone language)" },
    ar: { open: "قائمة إمكانية الوصول", title: "إعدادات إمكانية الوصول", size: "حجم النص", s0: "عادي", s1: "كبير", s2: "كبير جدًا", hc: "تباين عالٍ", motion: "إيقاف الحركة", links: "إبراز الروابط", font: "خط سهل القراءة", reset: "إعادة الضبط", statement: "بيان إمكانية الوصول", close: "إغلاق", done: "تم حفظ الإعداد", vl: "لغة البحث الصوتي", vauto: "تلقائي (لغة الهاتف)" },
    ru: { open: "Меню доступности", title: "Настройки доступности", size: "Размер текста", s0: "Обычный", s1: "Крупный", s2: "Очень крупный", hc: "Высокий контраст", motion: "Остановить анимацию", links: "Выделить ссылки", font: "Удобный шрифт", reset: "Сбросить", statement: "Заявление о доступности", close: "Закрыть", done: "Настройка сохранена", vl: "Язык голосового поиска", vauto: "Автоматически (язык телефона)" },
    es: { open: "Menú de accesibilidad", title: "Ajustes de accesibilidad", size: "Tamaño del texto", s0: "Normal", s1: "Grande", s2: "Muy grande", hc: "Alto contraste", motion: "Detener animaciones", links: "Resaltar enlaces", font: "Fuente legible", reset: "Restablecer", statement: "Declaración de accesibilidad", close: "Cerrar", done: "Ajuste guardado", vl: "Idioma de la búsqueda por voz", vauto: "Automático (idioma del teléfono)" },
    pt: { open: "Menu de acessibilidade", title: "Configurações de acessibilidade", size: "Tamanho do texto", s0: "Normal", s1: "Grande", s2: "Muito grande", hc: "Alto contraste", motion: "Parar animações", links: "Destacar links", font: "Fonte legível", reset: "Redefinir", statement: "Declaração de acessibilidade", close: "Fechar", done: "Configuração salva", vl: "Idioma da busca por voz", vauto: "Automático (idioma do telefone)" },
    fr: { open: "Menu d'accessibilité", title: "Réglages d'accessibilité", size: "Taille du texte", s0: "Normale", s1: "Grande", s2: "Très grande", hc: "Contraste élevé", motion: "Arrêter les animations", links: "Souligner les liens", font: "Police lisible", reset: "Réinitialiser", statement: "Déclaration d'accessibilité", close: "Fermer", done: "Réglage enregistré", vl: "Langue de la recherche vocale", vauto: "Automatique (langue du téléphone)" },
    de: { open: "Barrierefreiheits-Menü", title: "Einstellungen zur Barrierefreiheit", size: "Textgröße", s0: "Normal", s1: "Groß", s2: "Sehr groß", hc: "Hoher Kontrast", motion: "Animationen stoppen", links: "Links hervorheben", font: "Lesbare Schrift", reset: "Zurücksetzen", statement: "Erklärung zur Barrierefreiheit", close: "Schließen", done: "Einstellung gespeichert", vl: "Sprache der Sprachsuche", vauto: "Automatisch (Telefonsprache)" },
    it: { open: "Menu accessibilità", title: "Impostazioni di accessibilità", size: "Dimensione testo", s0: "Normale", s1: "Grande", s2: "Molto grande", hc: "Contrasto elevato", motion: "Ferma animazioni", links: "Evidenzia link", font: "Carattere leggibile", reset: "Ripristina", statement: "Dichiarazione di accessibilità", close: "Chiudi", done: "Impostazione salvata", vl: "Lingua della ricerca vocale", vauto: "Automatica (lingua del telefono)" },
    pl: { open: "Menu dostępności", title: "Ustawienia dostępności", size: "Rozmiar tekstu", s0: "Normalny", s1: "Duży", s2: "Bardzo duży", hc: "Wysoki kontrast", motion: "Zatrzymaj animacje", links: "Wyróżnij linki", font: "Czytelna czcionka", reset: "Resetuj", statement: "Deklaracja dostępności", close: "Zamknij", done: "Ustawienie zapisane", vl: "Język wyszukiwania głosowego", vauto: "Automatycznie (język telefonu)" },
    tr: { open: "Erişilebilirlik menüsü", title: "Erişilebilirlik ayarları", size: "Metin boyutu", s0: "Normal", s1: "Büyük", s2: "Çok büyük", hc: "Yüksek kontrast", motion: "Animasyonları durdur", links: "Bağlantıları vurgula", font: "Okunaklı yazı tipi", reset: "Sıfırla", statement: "Erişilebilirlik beyanı", close: "Kapat", done: "Ayar kaydedildi", vl: "Sesli arama dili", vauto: "Otomatik (telefon dili)" },
    tl: { open: "Accessibility menu", title: "Mga setting ng accessibility", size: "Laki ng teksto", s0: "Normal", s1: "Malaki", s2: "Napakalaki", hc: "Mataas na contrast", motion: "Itigil ang animation", links: "I-highlight ang mga link", font: "Madaling basahing font", reset: "I-reset", statement: "Pahayag sa accessibility", close: "Isara", done: "Na-save ang setting", vl: "Wika ng voice search", vauto: "Awtomatiko (wika ng telepono)" }
  };
  var lang = (document.documentElement.lang || "he").slice(0, 2);
  var L = S[lang] || S.en;
  var KEY = "ofm_a11y_prefs";
  var prefs = { size: 0, hc: false, motion: false, links: false, font: false };
  try { var saved = JSON.parse(localStorage.getItem(KEY) || "null"); if (saved) for (var k in prefs) if (k in saved) prefs[k] = saved[k]; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {} }

  var ZOOM = [1, 1.15, 1.3];
  var ICON = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="6.2" r="1.7" fill="currentColor"/><path d="M6.5 9.2l5.5 1.1 5.5-1.1M12 10.3v4.2l-2.6 4.6M12 14.5l2.6 4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var css = document.createElement("style");
  css.id = "a11yWidgetCss";
  css.textContent =
    "#a11yW-btn{position:fixed;left:0;top:42%;z-index:2147482000;width:46px;height:46px;border:0;border-radius:0 12px 12px 0;background:#1d4ed8;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 3px 12px rgba(0,0,0,.25);padding:0}" +
    "#a11yW-btn:hover{background:#1e40af}#a11yW-btn:focus-visible{outline:3px solid #facc15;outline-offset:2px}" +
    "#a11yW-panel{position:fixed;left:52px;top:calc(42% - 120px);z-index:2147482001;width:min(290px,calc(100vw - 64px));max-height:76vh;overflow:auto;background:#fff;color:#1a1a1a;border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.28);padding:14px;font:15px/1.4 system-ui,-apple-system,'Segoe UI',Arial,sans-serif;border:2px solid #1d4ed8}" +
    "#a11yW-panel[hidden]{display:none}" +
    "#a11yW-panel .a11yW-hd{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:0 0 10px}#a11yW-panel h2{font:700 17px/1.3 system-ui,sans-serif;margin:0;color:#111}" +
    "#a11yW-panel .a11yW-x{border:0;background:#eef2ff;color:#1e3a8a;width:34px;height:34px;border-radius:8px;font-size:18px;cursor:pointer}" +
    "#a11yW-panel .a11yW-g{margin:0 0 10px}#a11yW-panel .a11yW-l{font-weight:700;margin:0 0 6px;font-size:14px;color:#333}" +
    "#a11yW-panel .a11yW-row{display:flex;gap:6px}" +
    "#a11yW-panel button.a11yW-o{flex:1;min-height:44px;border:2px solid #cbd5e1;background:#f8fafc;color:#111;border-radius:10px;font:600 14px/1.2 system-ui,sans-serif;cursor:pointer;padding:6px 8px;text-align:center}" +
    "#a11yW-panel button.a11yW-o[aria-pressed=true]{background:#1d4ed8;border-color:#1d4ed8;color:#fff}" +
    "#a11yW-panel button.a11yW-t{display:block;width:100%;margin:0 0 8px;text-align:start}" +
    "#a11yW-panel button:focus-visible,#a11yW-panel a:focus-visible{outline:3px solid #facc15;outline-offset:2px}" +
    "#a11yW-panel .a11yW-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap}" +
    "#a11yW-panel .a11yW-reset{border:0;background:none;color:#9f1239;font:600 14px system-ui,sans-serif;text-decoration:underline;cursor:pointer;min-height:44px}" +
    "#a11yW-panel a{color:#1d4ed8;font-weight:700;text-decoration:underline}" +
    "#a11yW-panel .a11yW-sel{width:100%;min-height:44px;border:2px solid #cbd5e1;border-radius:10px;background:#f8fafc;color:#111;font:600 14px system-ui,sans-serif;padding:6px 8px}" +
    // effects — the widget itself is excluded so it stays usable in every mode
    "html.a11y-hc body,html.a11y-hc body *:not(#a11yW-panel):not(#a11yW-panel *):not(#a11yW-btn):not(#a11yW-btn *):not(img):not(svg):not(svg *):not(video){background-color:#000!important;background-image:none!important;color:#fff!important;border-color:#fff!important;text-shadow:none!important;box-shadow:none!important}" +
    "html.a11y-hc a:not(#a11yW-panel a),html.a11y-hc a:not(#a11yW-panel a) *{color:#ffe600!important}" +
    "html.a11y-hc button:not(#a11yW-panel button):not(#a11yW-btn),html.a11y-hc input,html.a11y-hc select{border:2px solid #fff!important}" +
    "html.a11y-motion *,html.a11y-motion *::before,html.a11y-motion *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}" +
    "html.a11y-links a:not(#a11yW-panel a){text-decoration:underline!important;text-underline-offset:3px!important;font-weight:700!important}" +
    "html.a11y-links a:not(#a11yW-panel a):focus,html.a11y-links a:not(#a11yW-panel a):hover{outline:3px solid #facc15!important}" +
    "html.a11y-font body *:not(#a11yW-panel *):not(svg *){font-family:Arial,'Segoe UI',system-ui,sans-serif!important;letter-spacing:.02em!important;word-spacing:.08em!important;line-height:1.6!important}";
  document.head.appendChild(css);

  // The category pages' contrast repair writes inline `color … !important`, which beats any
  // stylesheet — so in high-contrast mode those texts stayed dark on the black ground. Park
  // those inline colours while high contrast is on, and put them back when it is off.
  function hcInline(on) {
    [].forEach.call(document.querySelectorAll('[data-a11y-c="1"]'), function (e) {
      if (on) {
        if (e.dataset.a11yInline === undefined) e.dataset.a11yInline = e.style.cssText;
        e.style.removeProperty("color"); e.style.removeProperty("background-color");
      } else if (e.dataset.a11yInline !== undefined) {
        e.style.cssText = e.dataset.a11yInline; delete e.dataset.a11yInline;
      }
    });
  }

  function apply() {
    var h = document.documentElement;
    h.classList.toggle("a11y-hc", !!prefs.hc);
    hcInline(!!prefs.hc);
    h.classList.toggle("a11y-motion", !!prefs.motion);
    h.classList.toggle("a11y-links", !!prefs.links);
    h.classList.toggle("a11y-font", !!prefs.font);
    // zoom (not font-size): the site is laid out in px, so only zoom actually enlarges it —
    // and like browser zoom it reflows instead of overflowing.
    if (document.body) document.body.style.zoom = ZOOM[prefs.size] === 1 ? "" : String(ZOOM[prefs.size]);
    var p = byId("a11yW-panel");
    if (!p) return;
    [].forEach.call(p.querySelectorAll("[data-size]"), function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-size") === prefs.size)); });
    [].forEach.call(p.querySelectorAll("[data-t]"), function (b) { b.setAttribute("aria-pressed", String(!!prefs[b.getAttribute("data-t")])); });
  }

  function say(msg) {
    var st = byId("a11yStatus") || byId("a11yW-status");
    if (!st) return;
    st.textContent = ""; setTimeout(function () { st.textContent = msg; }, 60);
  }

  function build() {
    if (byId("a11yW-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button"; btn.id = "a11yW-btn";
    btn.setAttribute("aria-label", L.open); btn.title = L.open;
    btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "a11yW-panel");
    btn.innerHTML = ICON;

    var p = document.createElement("div");
    p.id = "a11yW-panel"; p.hidden = true;
    p.setAttribute("role", "dialog"); p.setAttribute("aria-labelledby", "a11yW-h");
    p.setAttribute("dir", document.documentElement.dir || "rtl");
    p.innerHTML =
      '<div class="a11yW-hd"><h2 id="a11yW-h" tabindex="-1">' + L.title + '</h2><button type="button" class="a11yW-x" aria-label="' + L.close + '">✕</button></div>' +
      '<div class="a11yW-g" role="group" aria-labelledby="a11yW-sz"><div class="a11yW-l" id="a11yW-sz">' + L.size + '</div><div class="a11yW-row">' +
        '<button type="button" class="a11yW-o" data-size="0">' + L.s0 + '</button>' +
        '<button type="button" class="a11yW-o" data-size="1">' + L.s1 + '</button>' +
        '<button type="button" class="a11yW-o" data-size="2">' + L.s2 + '</button></div></div>' +
      '<button type="button" class="a11yW-o a11yW-t" data-t="hc">' + L.hc + '</button>' +
      '<button type="button" class="a11yW-o a11yW-t" data-t="motion">' + L.motion + '</button>' +
      '<button type="button" class="a11yW-o a11yW-t" data-t="links">' + L.links + '</button>' +
      '<button type="button" class="a11yW-o a11yW-t" data-t="font">' + L.font + '</button>' +
      (typeof window.findiVoiceLang === "function" ? '<div class="a11yW-g"><label class="a11yW-l" for="a11yW-vl">' + L.vl + '</label><select id="a11yW-vl" class="a11yW-sel"></select></div>' : "") +
      '<div class="a11yW-foot"><button type="button" class="a11yW-reset">' + L.reset + '</button><a href="/accessibility.html">' + L.statement + '</a></div>' +
      '<div id="a11yW-status" role="status" aria-live="polite" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)"></div>';
    document.body.appendChild(btn);
    document.body.appendChild(p);

    function open(v) {
      p.hidden = !v; btn.setAttribute("aria-expanded", String(v));
      if (v) p.querySelector("#a11yW-h").focus(); else btn.focus();
    }
    btn.addEventListener("click", function () { open(p.hidden); });
    p.querySelector(".a11yW-x").addEventListener("click", function () { open(false); });
    p.addEventListener("keydown", function (e) { if (e.key === "Escape") { e.stopPropagation(); open(false); } });
    document.addEventListener("click", function (e) { if (!p.hidden && !p.contains(e.target) && e.target !== btn && !btn.contains(e.target)) open(false); });
    p.addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      if (b.hasAttribute("data-size")) { prefs.size = +b.getAttribute("data-size"); }
      else if (b.hasAttribute("data-t")) { var k = b.getAttribute("data-t"); prefs[k] = !prefs[k]; }
      else if (b.classList.contains("a11yW-reset")) { prefs = { size: 0, hc: false, motion: false, links: false, font: false }; }
      else return;
      save(); apply(); say(L.done);
    });
    var vl = p.querySelector("#a11yW-vl");
    if (vl) {
      var VL = [["", L.vauto], ["he-IL", "עברית"], ["en-US", "English"], ["ar-SA", "العربية"], ["ru-RU", "Русский"], ["es-ES", "Español"],
                ["pt-BR", "Português"], ["fr-FR", "Français"], ["de-DE", "Deutsch"], ["it-IT", "Italiano"], ["pl-PL", "Polski"], ["tr-TR", "Türkçe"], ["fil-PH", "Filipino"]];
      var cur = ""; try { cur = localStorage.getItem("ofm_voice_lang") || ""; } catch (e) {}
      VL.forEach(function (o) { var op = document.createElement("option"); op.value = o[0]; op.textContent = o[1]; if (o[0] === cur) op.selected = true; vl.appendChild(op); });
      vl.addEventListener("change", function () {
        try { if (vl.value) localStorage.setItem("ofm_voice_lang", vl.value); else localStorage.removeItem("ofm_voice_lang"); } catch (e) {}
        // A one-tap chip choice from earlier in the visit must not override the menu.
        try { if (window.FINDI_VOICE) { window.FINDI_VOICE.userLang = null; window.FINDI_VOICE.langFallback = null; } } catch (e) {}
        say(L.done);
      });
    }
    apply();
  }

  // Apply saved settings as early as possible to avoid a flash of the default view.
  apply();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
