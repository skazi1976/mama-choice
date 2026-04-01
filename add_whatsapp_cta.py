"""Add WhatsApp CTA boxes inside all article files"""
import os, glob

WHATSAPP_LINK = "https://chat.whatsapp.com/DYg6080BUPu1DMmPJM37dK"
BASE = r"D:\yupoo\mama-choice-repo\articles"

WA_CTA_MID = f"""
<!-- WhatsApp CTA -->
<div class="whatsapp-cta-box">
<h3>&#128242; אוהבת את הדילים האלה?</h3>
<p>בקבוצת הוואטסאפ "אמהות קונות חכם" יש דילים בלעדיים כל יום + טיפים מאמהות!</p>
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">&#9989; הצטרפי לקבוצה עכשיו</a>
</div>
"""

WA_CTA_END = f"""
<!-- WhatsApp End CTA -->
<div class="whatsapp-cta-box" style="background:linear-gradient(135deg,#C8E6C9,#A5D6A7);border-color:#1B5E20;">
<h3>&#127775; לא לפספס! דילים בלעדיים כל יום</h3>
<p>הצטרפי לקבוצת "אמהות קונות חכם" בוואטסאפ — דילים שלא מגיעים לאתר, קופונים, והמלצות מאמהות!</p>
<a href="{WHATSAPP_LINK}" target="_blank" rel="noopener noreferrer">&#128276; הצטרפי עכשיו — חינם!</a>
</div>
"""

article_files = glob.glob(os.path.join(BASE, "*.html"))
for filepath in sorted(article_files):
    name = os.path.basename(filepath)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Check if CTA already inserted (look for the actual CTA div, not the CSS)
    if "WhatsApp CTA -->" in content:
        print(f"  SKIP: {name}")
        continue

    modified = False

    # Insert mid-article CTA before the existing mid-cta div
    if '<div class="mid-cta">' in content:
        content = content.replace(
            '<div class="mid-cta">',
            WA_CTA_MID + '\n<div class="mid-cta">',
            1
        )
        modified = True
    elif "<!-- Product 4 -->" in content:
        content = content.replace(
            "<!-- Product 4 -->",
            WA_CTA_MID + "\n<!-- Product 4 -->",
            1
        )
        modified = True

    # Insert end CTA before FAQ section
    if '<div class="faq-section">' in content:
        content = content.replace(
            '<div class="faq-section">',
            WA_CTA_END + '\n<div class="faq-section">',
            1
        )
        modified = True
    elif '<div class="related-articles">' in content:
        content = content.replace(
            '<div class="related-articles">',
            WA_CTA_END + '\n<div class="related-articles">',
            1
        )
        modified = True

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  ADDED CTAs: {name}")
    else:
        print(f"  NO MATCH: {name}")

print("\nDone!")
