/**
 * MamaChoice AI Search - Frontend App
 * Chat UI, Product Cards, Image Search, i18n
 */

// ============================================================
//  Configuration
// ============================================================

const API_BASE = "https://mamachoice-api.ohadf1976.workers.dev";
// For local testing, change to: "http://localhost:8787"

let currentLang = localStorage.getItem("mc-lang") || "he";
let isSearching = false;
let uploadedImage = null;

// ============================================================
//  i18n Translations
// ============================================================

const i18n = {
  he: {
    hero_title: "\u{1F916} \u05DE\u05E6\u05D0\u05D9 \u05D0\u05EA \u05D4\u05DE\u05D5\u05E6\u05E8 \u05D4\u05DE\u05D5\u05E9\u05DC\u05DD",
    hero_subtitle: "\u05E1\u05E4\u05E8\u05D9 \u05DC\u05E0\u05D5 \u05DE\u05D4 \u05D0\u05EA \u05DE\u05D7\u05E4\u05E9\u05EA - \u05D4\u05D1\u05D9\u05E0\u05D4 \u05D4\u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA \u05E9\u05DC\u05E0\u05D5 \u05EA\u05DE\u05E6\u05D0 \u05D1\u05E9\u05D1\u05D9\u05DC\u05DA \u05D0\u05EA \u05D4\u05D3\u05D9\u05DC\u05D9\u05DD \u05D4\u05DB\u05D9 \u05D8\u05D5\u05D1\u05D9\u05DD",
    welcome: '\u{1F44B} \u05D4\u05D9\u05D9! \u05D0\u05E0\u05D9 \u05D4\u05E2\u05D5\u05D6\u05E8\u05EA \u05D4\u05D7\u05DB\u05DE\u05D4 \u05E9\u05DC MamaChoice.<br>\u05E1\u05E4\u05E8\u05D9 \u05DC\u05D9 \u05DE\u05D4 \u05D0\u05EA \u05DE\u05D7\u05E4\u05E9\u05EA \u05D5\u05D0\u05E0\u05D9 \u05D0\u05DE\u05E6\u05D0 \u05DC\u05DA \u05D0\u05EA \u05D4\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D4\u05DB\u05D9 \u05D8\u05D5\u05D1\u05D9\u05DD \u05D1\u05DE\u05D7\u05D9\u05E8\u05D9\u05DD \u05D4\u05DB\u05D9 \u05E9\u05D5\u05D5\u05D9\u05DD!<br><small style="color:#888;">\u{1F4F7} \u05D0\u05EA \u05D9\u05DB\u05D5\u05DC\u05D4 \u05D2\u05DD \u05DC\u05D7\u05E4\u05E9 \u05DC\u05E4\u05D9 \u05EA\u05DE\u05D5\u05E0\u05D4!</small>',
    placeholder: "\u05DE\u05D4 \u05D0\u05EA \u05DE\u05D7\u05E4\u05E9\u05EA? (\u05DC\u05DE\u05E9\u05DC: \u05E6\u05E2\u05E6\u05D5\u05E2 \u05DC\u05EA\u05D9\u05E0\u05D5\u05E7 \u05D1\u05DF \u05E9\u05E0\u05D4, \u05E9\u05DE\u05DC\u05D4 \u05D0\u05DC\u05D2\u05E0\u05D8\u05D9\u05EA...)",
    searching: "\u{1F50D} \u05DE\u05D7\u05E4\u05E9\u05EA \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD...",
    found: "\u{1F389} \u05DE\u05E6\u05D0\u05EA\u05D9 {n} \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD! \u05D4\u05E0\u05D4 \u05D4\u05D8\u05D5\u05D1\u05D9\u05DD \u05D1\u05D9\u05D5\u05EA\u05E8:",
    no_results: "\u{1F614} \u05DC\u05D0 \u05DE\u05E6\u05D0\u05EA\u05D9 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD. \u05E0\u05E1\u05D9 \u05DE\u05D9\u05DC\u05D5\u05EA \u05D7\u05D9\u05E4\u05D5\u05E9 \u05D0\u05D7\u05E8\u05D5\u05EA!",
    error: "\u05D0\u05D5\u05E4\u05E1, \u05DE\u05E9\u05D4\u05D5 \u05D4\u05E9\u05EA\u05D1\u05E9. \u05E0\u05E1\u05D9 \u05E9\u05D5\u05D1!",
    buy: "\u05DC\u05E6\u05E4\u05D9\u05D9\u05D4 \u05D5\u05E8\u05DB\u05D9\u05E9\u05D4 \u2192",
    orders: "\u05E0\u05DE\u05DB\u05E8\u05D5",
    free_shipping: "\u05DE\u05E9\u05DC\u05D5\u05D7 \u05D7\u05D9\u05E0\u05DD",
    results_title: "\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05D7\u05D9\u05E4\u05D5\u05E9",
    how_title: "\u2728 \u05D0\u05D9\u05DA \u05D6\u05D4 \u05E2\u05D5\u05D1\u05D3?",
    how1_title: "\u05E1\u05E4\u05E8\u05D9 \u05DE\u05D4 \u05D0\u05EA \u05DE\u05D7\u05E4\u05E9\u05EA",
    how1_text: "\u05DB\u05EA\u05D1\u05D9 \u05D1\u05E2\u05D1\u05E8\u05D9\u05EA \u05D0\u05D5 \u05D1\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA \u05DE\u05D4 \u05D4\u05DE\u05D5\u05E6\u05E8 \u05E9\u05D0\u05EA \u05E6\u05E8\u05D9\u05DB\u05D4, \u05D0\u05D5 \u05D4\u05E2\u05DC\u05D9 \u05EA\u05DE\u05D5\u05E0\u05D4",
    how2_title: "\u05D4\u05D1\u05D9\u05E0\u05D4 \u05D4\u05DE\u05DC\u05D0\u05DB\u05D5\u05EA\u05D9\u05EA \u05DE\u05D7\u05E4\u05E9\u05EA",
    how2_text: "\u05D4\u05DE\u05E2\u05E8\u05DB\u05EA \u05E9\u05DC\u05E0\u05D5 \u05E1\u05D5\u05E8\u05E7\u05EA \u05D0\u05DC\u05E4\u05D9 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D5\u05DE\u05D5\u05E6\u05D0\u05EA \u05D0\u05EA \u05D4\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA \u05D4\u05D8\u05D5\u05D1\u05D5\u05EA \u05D1\u05D9\u05D5\u05EA\u05E8",
    how3_title: "\u05E7\u05D1\u05DC\u05D9 \u05D0\u05EA \u05D4\u05D3\u05D9\u05DC\u05D9\u05DD \u05D4\u05DB\u05D9 \u05D8\u05D5\u05D1\u05D9\u05DD",
    how3_text: "\u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05DE\u05D3\u05D5\u05E8\u05D2\u05D9\u05DD \u05E2\u05DD \u05DE\u05D7\u05D9\u05E8\u05D9\u05DD, \u05D1\u05D9\u05E7\u05D5\u05E8\u05D5\u05EA \u05D5\u05DE\u05E9\u05DC\u05D5\u05D7 \u05D7\u05D9\u05E0\u05DD \u05DC\u05D9\u05E9\u05E8\u05D0\u05DC",
    cat_title: "\u{1F4DA} \u05E7\u05D8\u05D2\u05D5\u05E8\u05D9\u05D5\u05EA \u05E4\u05D5\u05E4\u05D5\u05DC\u05E8\u05D9\u05D5\u05EA",
    footer_search: "\u05D7\u05D9\u05E4\u05D5\u05E9 \u05D7\u05DB\u05DD",
    footer_disclaimer: "\u05D4\u05D0\u05EA\u05E8 \u05DE\u05E9\u05EA\u05DE\u05E9 \u05D1\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9 \u05E9\u05D5\u05EA\u05E4\u05D9\u05DD (affiliate). \u05E8\u05DB\u05D9\u05E9\u05D4 \u05D3\u05E8\u05DA \u05D4\u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD \u05E9\u05DC\u05E0\u05D5 \u05E2\u05D5\u05D6\u05E8\u05EA \u05DC\u05E0\u05D5 \u05DC\u05D4\u05DE\u05E9\u05D9\u05DA \u05DC\u05E4\u05E2\u05D5\u05DC \u05DC\u05DC\u05D0 \u05E2\u05DC\u05D5\u05EA \u05E0\u05D5\u05E1\u05E4\u05EA \u05E2\u05D1\u05D5\u05E8\u05DB\u05DD.",
    img_selected: "\u05EA\u05DE\u05D5\u05E0\u05D4 \u05E0\u05D1\u05D7\u05E8\u05D4 - \u05DC\u05D7\u05E6\u05D9 \u05D7\u05D9\u05E4\u05D5\u05E9",
    img_searching: "\u{1F4F7} \u05DE\u05D7\u05E4\u05E9\u05EA \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D3\u05D5\u05DE\u05D9\u05DD \u05DC\u05EA\u05DE\u05D5\u05E0\u05D4...",
    img_results: "\u{1F4F7} \u05D4\u05E0\u05D4 \u05DE\u05D5\u05E6\u05E8\u05D9\u05DD \u05D3\u05D5\u05DE\u05D9\u05DD \u05DC\u05EA\u05DE\u05D5\u05E0\u05D4 \u05E9\u05D4\u05E2\u05DC\u05D9\u05EA:",
    nav_home: "\u05D1\u05D9\u05EA", nav_search: "\u05D7\u05D9\u05E4\u05D5\u05E9 \u05D7\u05DB\u05DD",
    nav_toys: "\u05E6\u05E2\u05E6\u05D5\u05E2\u05D9\u05DD", nav_sleep: "\u05E9\u05D9\u05E0\u05D4",
    nav_feeding: "\u05D4\u05D0\u05DB\u05DC\u05D4", nav_gadgets: "\u05D2\u05D0\u05D3\u05D2'\u05D8\u05D9\u05DD",
    cat_toys: "\u05E6\u05E2\u05E6\u05D5\u05E2\u05D9 \u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA", cat_sleep: "\u05DE\u05D5\u05E6\u05E8\u05D9 \u05E9\u05D9\u05E0\u05D4",
    cat_feeding: "\u05D4\u05D0\u05DB\u05DC\u05D4", cat_gadgets: "\u05D2\u05D0\u05D3\u05D2'\u05D8\u05D9\u05DD \u05D7\u05DB\u05DE\u05D9\u05DD",
    cat_gifts: "\u05DE\u05EA\u05E0\u05D5\u05EA \u05DC\u05D9\u05D3\u05D4", cat_montessori: "\u05DE\u05D5\u05E0\u05D8\u05E1\u05D5\u05E8\u05D9",
    chips: ["\u05E6\u05E2\u05E6\u05D5\u05E2\u05D9 \u05D4\u05EA\u05E4\u05EA\u05D7\u05D5\u05EA", "\u05DE\u05D5\u05E6\u05E8\u05D9 \u05E9\u05D9\u05E0\u05D4 \u05DC\u05EA\u05D9\u05E0\u05D5\u05E7", "\u05E9\u05DE\u05DC\u05EA \u05E2\u05E8\u05D1 \u05D0\u05DC\u05D2\u05E0\u05D8\u05D9\u05EA", "\u05DE\u05E1\u05DC\u05E1\u05DC \u05E9\u05D9\u05E2\u05E8", "\u05EA\u05D9\u05E7 \u05D9\u05D3 \u05DE\u05E2\u05D5\u05E6\u05D1", "\u05DE\u05DB\u05E9\u05D9\u05E8 \u05D9\u05D5\u05E4\u05D9 \u05DC\u05E4\u05E0\u05D9\u05DD", "\u05DE\u05D7\u05D8\u05D1 \u05D2\u05D5\u05E3", "\u05E1\u05D8 \u05E1\u05E4\u05D5\u05E8\u05D8"],
  },
  en: {
    hero_title: "\u{1F916} Find the Perfect Product",
    hero_subtitle: "Tell us what you need - our AI will find the best deals for you",
    welcome: '\u{1F44B} Hi! I\'m MamaChoice\'s smart assistant.<br>Tell me what you\'re looking for and I\'ll find the best products at the best prices!<br><small style="color:#888;">\u{1F4F7} You can also search by image!</small>',
    placeholder: "What are you looking for? (e.g., baby toys, elegant dress...)",
    searching: "\u{1F50D} Searching for products...",
    found: "\u{1F389} Found {n} products! Here are the best ones:",
    no_results: "\u{1F614} No products found. Try different search terms!",
    error: "Oops, something went wrong. Try again!",
    buy: "View & Buy \u2192",
    orders: "sold",
    free_shipping: "Free shipping",
    results_title: "Search Results",
    how_title: "How does it work? \u2728",
    how1_title: "Describe what you need",
    how1_text: "Type in Hebrew or English what product you need, or upload an image",
    how2_title: "AI searches for you",
    how2_text: "Our system scans thousands of products and finds the best matches",
    how3_title: "Get the best deals",
    how3_text: "Products ranked by price, reviews and free shipping to Israel",
    cat_title: "\u{1F4DA} Popular Categories",
    footer_search: "Smart Search",
    footer_disclaimer: "This site uses affiliate links. Purchasing through our links helps us continue operating at no extra cost to you.",
    img_selected: "Image selected - click search",
    img_searching: "\u{1F4F7} Searching for similar products...",
    img_results: "\u{1F4F7} Here are products similar to your image:",
    nav_home: "Home", nav_search: "Smart Search",
    nav_toys: "Toys", nav_sleep: "Sleep",
    nav_feeding: "Feeding", nav_gadgets: "Gadgets",
    cat_toys: "Developmental Toys", cat_sleep: "Sleep Products",
    cat_feeding: "Feeding", cat_gadgets: "Smart Gadgets",
    cat_gifts: "Birth Gifts", cat_montessori: "Montessori",
    chips: ["Developmental toys", "Baby sleep products", "Elegant evening dress", "Hair curler", "Designer handbag", "Face beauty device", "Body shapewear", "Gym set"],
  }
};

// ============================================================
//  Language Switching
// ============================================================

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("mc-lang", lang);
  const t = i18n[lang];
  const html = document.documentElement;

  // Direction
  html.dir = lang === "he" ? "rtl" : "ltr";
  html.lang = lang;

  // Toggle buttons
  document.getElementById("btn-he").classList.toggle("active", lang === "he");
  document.getElementById("btn-en").classList.toggle("active", lang === "en");

  // Static texts
  document.getElementById("hero-title").innerHTML = t.hero_title;
  document.getElementById("hero-subtitle").textContent = t.hero_subtitle;
  document.getElementById("chatInput").placeholder = t.placeholder;
  document.getElementById("howTitle").innerHTML = t.how_title;
  document.getElementById("how1Title").textContent = t.how1_title;
  document.getElementById("how1Text").textContent = t.how1_text;
  document.getElementById("how2Title").textContent = t.how2_title;
  document.getElementById("how2Text").textContent = t.how2_text;
  document.getElementById("how3Title").textContent = t.how3_title;
  document.getElementById("how3Text").textContent = t.how3_text;
  document.getElementById("catTitle").innerHTML = t.cat_title;
  document.getElementById("footerSearch").textContent = t.footer_search;
  document.getElementById("footerDisclaimer").textContent = t.footer_disclaimer;
  document.getElementById("imgText").textContent = t.img_selected;

  // Nav links
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key]) el.textContent = t[key];
  });

  // Chips
  const chipsEl = document.getElementById("chips");
  chipsEl.innerHTML = t.chips.map(c =>
    `<button class="chip" onclick="searchQuery(this.textContent)">${c}</button>`
  ).join("");

  // Welcome message (only if it's the initial state)
  const welcomeMsg = document.getElementById("welcomeMsg");
  if (welcomeMsg) {
    welcomeMsg.innerHTML = t.welcome;
    welcomeMsg.dir = lang === "he" ? "rtl" : "ltr";
    welcomeMsg.style.textAlign = lang === "he" ? "right" : "left";
  }

  // Update all existing message bubbles direction
  document.querySelectorAll(".msg-bubble").forEach(el => {
    el.dir = lang === "he" ? "rtl" : "ltr";
  });
}

// ============================================================
//  Chat UI
// ============================================================

function addMessage(type, html) {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `msg msg-${type}`;
  const dir = currentLang === "he" ? "rtl" : "ltr";
  const align = currentLang === "he" ? "right" : "left";
  div.innerHTML = `<div class="msg-bubble" dir="${dir}" style="text-align:${align}">${html}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function addTyping() {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.id = "typingIndicator";
  div.innerHTML = `<div class="msg-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function addProductCards(products) {
  const t = i18n[currentLang];
  const currency = currentLang === "he" ? "\u20AA" : "\u20AA";

  let html = '<div class="product-grid">';
  for (const p of products) {
    const discount = p.discount > 0 ? `<div class="badge">-${p.discount}%</div>` : "";
    const originalPrice = p.discount > 0 ?
      `<span class="original">${currency}${p.original_price}</span>` : "";
    const stars = p.rating > 0 ? "\u2B50".repeat(Math.min(5, Math.round(p.rating))) : "";
    const ordersText = p.orders > 0 ? `<span class="orders">${p.orders.toLocaleString()} ${t.orders}</span>` : "";

    html += `
      <div class="product-card">
        ${discount}
        <img src="${p.image}" alt="${p.title}" loading="lazy" onerror="this.src='https://via.placeholder.com/300?text=Product'">
        <div class="product-info">
          <div class="product-title">${p.title}</div>
          <div class="product-price">
            ${currency}${p.price}
            ${originalPrice}
          </div>
          <div class="product-meta">
            ${ordersText}
            ${stars ? `<span class="rating">${stars} ${p.rating}</span>` : ""}
          </div>
          <a href="${p.affiliate_url}" target="_blank" rel="noopener noreferrer" class="product-cta">${t.buy}</a>
        </div>
      </div>
    `;
  }
  html += '</div>';

  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.innerHTML = `<div class="msg-bubble" style="max-width:100%;padding:10px;">${html}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  // Also show in results section
  document.getElementById("resultsSection").style.display = "block";
  document.getElementById("resultsTitle").textContent = t.results_title;
  document.getElementById("productGrid").innerHTML = html.replace('<div class="product-grid">', '').replace('</div>\n', '');
}

function addSkeletonCards() {
  let html = '<div class="product-grid">';
  for (let i = 0; i < 6; i++) {
    html += `<div class="skeleton-card"><div class="sk-img"></div><div class="sk-text"><div class="sk-line"></div><div class="sk-line"></div><div class="sk-line"></div></div></div>`;
  }
  html += '</div>';

  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.id = "skeletonCards";
  div.innerHTML = `<div class="msg-bubble" style="max-width:100%;padding:10px;">${html}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeSkeletonCards() {
  const el = document.getElementById("skeletonCards");
  if (el) el.remove();
}

// ============================================================
//  Image Search
// ============================================================

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    uploadedImage = {
      file: file,
      dataUrl: e.target.result,
      name: file.name
    };

    // Show preview
    document.getElementById("imgThumb").src = e.target.result;
    document.getElementById("imgPreview").classList.add("active");
    document.getElementById("imgText").textContent = i18n[currentLang].img_selected;

    // Auto-detect: try to extract keywords from filename or use generic
    const nameClean = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    document.getElementById("chatInput").value = nameClean.length > 3 ? nameClean : "";
    document.getElementById("chatInput").focus();
  };
  reader.readAsDataURL(file);
}

function removeImage() {
  uploadedImage = null;
  document.getElementById("imgPreview").classList.remove("active");
  document.getElementById("imgThumb").src = "";
  document.getElementById("imageInput").value = "";
}

async function searchByImage() {
  if (!uploadedImage) return;
  const t = i18n[currentLang];

  // Show image in chat
  addMessage("user", `<img src="${uploadedImage.dataUrl}" style="max-width:150px;border-radius:10px;" alt="search image"><br><small>${uploadedImage.name}</small>`);
  addMessage("bot", t.img_searching);
  addTyping();

  // For image search, we use AliExpress image search API
  // Since the Worker needs the image, we send it as base64
  try {
    const res = await fetch(API_BASE + "/search-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: uploadedImage.dataUrl,
        lang: currentLang,
        currency: "ILS",
        country: "IL"
      })
    });

    removeTyping();

    if (!res.ok) {
      // Fallback: use text search with generic query based on image name
      const fallbackQuery = uploadedImage.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      if (fallbackQuery.length > 2) {
        removeImage();
        return doSearch(fallbackQuery);
      }
      addMessage("bot", t.error + "<br><small>Image search not available yet. Try typing what you see in the image!</small>");
      return;
    }

    const data = await res.json();
    if (data.products && data.products.length > 0) {
      addMessage("bot", t.img_results);
      addProductCards(data.products);
    } else {
      addMessage("bot", t.no_results);
    }
  } catch (err) {
    removeTyping();
    // Fallback to text search
    addMessage("bot", "\u{1F4F7} Image search is starting up... Try describing the product in words!");
  }

  removeImage();
}

// ============================================================
//  Search
// ============================================================

async function doSearch(query) {
  const t = i18n[currentLang];

  addTyping();
  addSkeletonCards();

  try {
    const params = new URLSearchParams({
      q: query,
      lang: currentLang,
      currency: "ILS",
      country: "IL",
      page: "1"
    });

    const res = await fetch(`${API_BASE}/search?${params}`);
    removeTyping();
    removeSkeletonCards();

    if (!res.ok) {
      addMessage("bot", t.error);
      return;
    }

    const data = await res.json();

    if (data.products && data.products.length > 0) {
      addMessage("bot", t.found.replace("{n}", data.products.length));
      addProductCards(data.products);

      // Track search in GA
      if (typeof gtag === "function") {
        gtag("event", "search", { search_term: query, results: data.products.length });
      }
    } else {
      addMessage("bot", t.no_results);
      // Show suggestion chips again
      const chipsDiv = document.getElementById("chips");
      if (chipsDiv) chipsDiv.style.display = "flex";
    }

  } catch (err) {
    removeTyping();
    removeSkeletonCards();
    addMessage("bot", t.error);
    console.error("Search error:", err);
  }
}

function sendMessage() {
  if (isSearching) return;

  const input = document.getElementById("chatInput");
  const query = input.value.trim();

  // If image is uploaded, do image search first
  if (uploadedImage && !query) {
    searchByImage();
    return;
  }

  if (!query && !uploadedImage) return;

  isSearching = true;
  document.getElementById("sendBtn").disabled = true;

  // Show user message
  addMessage("user", escapeHtml(query));
  input.value = "";

  // Hide chips after first search
  document.getElementById("chips").style.display = "none";

  // If image + text, use text search (image as context only)
  if (uploadedImage) {
    addMessage("user", `<img src="${uploadedImage.dataUrl}" style="max-width:80px;border-radius:8px;vertical-align:middle;margin-left:8px;" alt=""> ${escapeHtml(query)}`);
    removeImage();
  }

  doSearch(query).finally(() => {
    isSearching = false;
    document.getElementById("sendBtn").disabled = false;
  });
}

function searchQuery(query) {
  document.getElementById("chatInput").value = query;
  sendMessage();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
//  Init
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Set language
  setLang(currentLang);

  // Enter key handler
  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Check URL params
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q");
  if (q) {
    document.getElementById("chatInput").value = q;
    sendMessage();
  }

  // Hamburger menu
  const toggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }
});
