"""Add floating WhatsApp button + CTA to all MamaChoice pages"""
import os, re, glob

WHATSAPP_LINK = "https://chat.whatsapp.com/DYg6080BUPu1DMmPJM37dK"

# Floating button CSS
FLOAT_CSS = """
.whatsapp-float{position:fixed;bottom:20px;left:20px;z-index:999;display:flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:12px 20px;border-radius:50px;text-decoration:none;font-weight:700;font-family:'Heebo',sans-serif;box-shadow:0 4px 15px rgba(37,211,102,0.4);transition:all 0.3s;font-size:0.95em;}
.whatsapp-float:hover{background:#128C7E;transform:scale(1.05);box-shadow:0 6px 20px rgba(37,211,102,0.5);}
.whatsapp-float svg{width:24px;height:24px;fill:#fff;flex-shrink:0;}
.whatsapp-cta-box{background:linear-gradient(135deg,#E8F5E9,#C8E6C9);padding:25px 30px;border-radius:12px;margin:30px 0;border:2px solid #25D366;text-align:center;}
.whatsapp-cta-box:hover{box-shadow:0 4px 15px rgba(37,211,102,0.2);border-color:#128C7E;}
.whatsapp-cta-box h3{font-size:1.15em;color:#1B5E20;margin-bottom:8px;font-family:'Heebo',sans-serif;font-weight:700;}
.whatsapp-cta-box p{font-size:0.95em;color:#555;margin-bottom:15px;}
.whatsapp-cta-box a{display:inline-block;background:#25D366;color:#fff;padding:12px 28px;border-radius:25px;text-decoration:none;font-weight:700;font-family:'Heebo',sans-serif;font-size:1em;transition:all 0.3s;}
.whatsapp-cta-box a:hover{background:#128C7E;transform:scale(1.02);}
@media(max-width:480px){.whatsapp-float{padding:10px 16px;font-size:0.85em;bottom:15px;left:15px;gap:8px;}}
"""

# Floating button HTML
FLOAT_HTML = f"""
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" class="whatsapp-float" aria-label="הצטרפי לוואטסאפ">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
&#128242; הצטרפי לוואטסאפ שלנו!
</a>
"""

# WhatsApp CTA box for inside articles (after product 3)
WA_CTA_MID = f"""
<!-- WhatsApp CTA -->
<div class="whatsapp-cta-box">
<h3>&#128242; אוהבת את הדילים האלה?</h3>
<p>בקבוצת הוואטסאפ "אמהות קונות חכם" יש דילים בלעדיים כל יום + טיפים מאמהות!</p>
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">&#9989; הצטרפי לקבוצה עכשיו</a>
</div>
"""

# WhatsApp CTA box for end of articles (before FAQ)
WA_CTA_END = f"""
<!-- WhatsApp CTA End -->
<div class="whatsapp-cta-box" style="background:linear-gradient(135deg,#C8E6C9,#A5D6A7);border-color:#1B5E20;">
<h3>&#127775; לא לפספס! דילים בלעדיים כל יום</h3>
<p>הצטרפי לקבוצת "אמהות קונות חכם" בוואטסאפ — דילים שלא מגיעים לאתר, קופונים, והמלצות מאמהות!</p>
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">&#128276; הצטרפי עכשיו — חינם!</a>
</div>
"""

# Homepage banner HTML
HOMEPAGE_BANNER = f"""
<!-- WhatsApp Banner -->
<div style="background:linear-gradient(135deg,#25D366,#128C7E);padding:16px 20px;text-align:center;position:relative;">
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer" style="color:#fff;text-decoration:none;font-family:'Heebo',sans-serif;font-weight:700;font-size:1.1em;display:flex;align-items:center;justify-content:center;gap:10px;flex-wrap:wrap;">
<span>&#128242; הצטרפי לקבוצת הוואטסאפ "אמהות קונות חכם" — דילים בלעדיים כל יום!</span>
<span style="background:#fff;color:#25D366;padding:6px 18px;border-radius:20px;font-size:0.9em;">הצטרפי עכשיו &#8592;</span>
</a>
</div>
"""

BASE = r"D:\yupoo\mama-choice-repo"

def add_float_to_file(filepath):
    """Add floating WhatsApp button CSS + HTML to any HTML file"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Skip if already has WhatsApp float
    if "whatsapp-float" in content:
        print(f"  SKIP (already has float): {os.path.basename(filepath)}")
        return False

    # Add CSS before </style> (for articles with inline styles)
    if "</style>" in content:
        content = content.replace("</style>", FLOAT_CSS + "\n</style>", 1)
    # Or add CSS in <head> before </head>
    elif "</head>" in content:
        content = content.replace("</head>", f"<style>{FLOAT_CSS}</style>\n</head>", 1)

    # Add HTML before </body>
    if "</body>" in content:
        content = content.replace("</body>", FLOAT_HTML + "\n</body>", 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ADDED float: {os.path.basename(filepath)}")
    return True

def add_cta_to_article(filepath):
    """Add WhatsApp CTA boxes inside article files"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "whatsapp-cta-box" in content:
        print(f"  SKIP CTA (already has): {os.path.basename(filepath)}")
        return False

    modified = False

    # Find product 3 end and insert CTA after it
    # Pattern: <!-- Product 4 --> or the mid-cta div
    # We want to add BEFORE the mid-cta (which is usually after product 3)
    if '<div class="mid-cta">' in content:
        content = content.replace('<div class="mid-cta">', WA_CTA_MID + '\n<div class="mid-cta">', 1)
        modified = True
    # Fallback: add after product 3 comment
    elif "<!-- Product 4 -->" in content:
        content = content.replace("<!-- Product 4 -->", WA_CTA_MID + "\n<!-- Product 4 -->", 1)
        modified = True

    # Add end CTA before FAQ section
    if '<div class="faq-section">' in content:
        content = content.replace('<div class="faq-section">', WA_CTA_END + '\n<div class="faq-section">', 1)
        modified = True
    # Fallback: before related articles
    elif '<div class="related-articles">' in content:
        content = content.replace('<div class="related-articles">', WA_CTA_END + '\n<div class="related-articles">', 1)
        modified = True

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ADDED CTAs: {os.path.basename(filepath)}")
    return modified

def add_banner_to_homepage():
    """Add WhatsApp banner to homepage"""
    filepath = os.path.join(BASE, "index.html")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "whatsapp" in content.lower() and "Banner" in content:
        print("  SKIP banner (already exists)")
        return False

    # Add banner right after <body> or after </nav>
    if "</nav>" in content:
        # Find first </nav>
        idx = content.index("</nav>")
        end_nav = idx + len("</nav>")
        content = content[:end_nav] + "\n" + HOMEPAGE_BANNER + content[end_nav:]

    # Also add float CSS
    if "whatsapp-float" not in content:
        if "</head>" in content:
            content = content.replace("</head>", f"<style>{FLOAT_CSS}</style>\n</head>", 1)
        content = content.replace("</body>", FLOAT_HTML + "\n</body>", 1)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("  ADDED banner + float to index.html")
    return True

# ===== MAIN =====
print("=" * 60)
print("Adding WhatsApp integration to MamaChoice")
print("=" * 60)

# 1. Add floating button to ALL HTML files
print("\n1. Adding floating WhatsApp button to ALL pages:")
all_html = glob.glob(os.path.join(BASE, "**", "*.html"), recursive=True)
float_count = 0
for f in sorted(all_html):
    if add_float_to_file(f):
        float_count += 1

print(f"\n   Total: {float_count} files updated with floating button")

# 2. Add CTA boxes to all ARTICLE files
print("\n2. Adding WhatsApp CTAs to articles:")
article_files = glob.glob(os.path.join(BASE, "articles", "*.html"))
cta_count = 0
for f in sorted(article_files):
    if add_cta_to_article(f):
        cta_count += 1

print(f"\n   Total: {cta_count} articles updated with CTAs")

# 3. Add banner to homepage
print("\n3. Adding WhatsApp banner to homepage:")
add_banner_to_homepage()

print("\n" + "=" * 60)
print("DONE! WhatsApp integration complete.")
print(f"Link: {WHATSAPP_LINK}")
print("=" * 60)
