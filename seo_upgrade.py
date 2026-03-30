#!/usr/bin/env python3
"""
MamaChoice SEO Upgrade Script
Batch-upgrades all article HTML files with:
1. Table of Contents (TOC)
2. Comparison Table
3. Author Bio (E-E-A-T)
4. Reading Time
5. Enhanced Internal Linking (6 related articles)
6. Additional FAQ questions
"""

import os
import re
import json
import math
from datetime import datetime

ARTICLES_DIR = os.path.join(os.path.dirname(__file__), 'articles')

# All articles with metadata for cross-linking
ARTICLES_DB = {
    'tzaatzuei-hitpatchut-tinok.html': {
        'title': '10 צעצועי התפתחות מומלצים לתינוק',
        'emoji': '&#129513;',
        'desc': 'צעצועי מונטסורי, צעצועים חושיים ושטיחי פעילות',
        'category': 'toys',
        'age': '0-18m'
    },
    'tzaatzuei-montessori-letinok.html': {
        'title': '7 צעצועי מונטסורי מומלצים לתינוק',
        'emoji': '&#127807;',
        'desc': 'קוביות פעילות, מגדלי השחלה ומיון צורות',
        'category': 'toys',
        'age': '6-24m'
    },
    'tzaatzuim-letinok-ben-chatzi-shana.html': {
        'title': 'צעצועים לתינוק בן חצי שנה',
        'emoji': '&#128118;',
        'desc': 'רעשנים, נשכנים וצעצועים חושיים לגיל 6 חודשים',
        'category': 'toys',
        'age': '6m'
    },
    'tzaatzuim-letinok-ben-shana.html': {
        'title': 'צעצועים לתינוק בן שנה',
        'emoji': '&#127880;',
        'desc': 'שולחנות מוזיקה, עגלות דחיפה ופאזלים',
        'category': 'toys',
        'age': '12m'
    },
    'tzaatzuim-letinok-ben-shnatayim.html': {
        'title': 'צעצועים לתינוק בן שנתיים',
        'emoji': '&#127922;',
        'desc': 'צעצועים מותאמים לגיל שנתיים',
        'category': 'toys',
        'age': '24m'
    },
    'tzaatzuim-letinok-ben-shalosh.html': {
        'title': 'צעצועים לילד בן שלוש',
        'emoji': '&#127912;',
        'desc': 'צעצועים מותאמים לגיל 3',
        'category': 'toys',
        'age': '36m'
    },
    'tzaatzuim-sensoriim-letinok.html': {
        'title': 'צעצועים סנסוריים לתינוק',
        'emoji': '&#129528;',
        'desc': 'צעצועים חושיים לפיתוח החושים',
        'category': 'toys',
        'age': '0-12m'
    },
    'tzaatzuim-chinuchiyim-lepaotot.html': {
        'title': 'צעצועים חינוכיים לפעוטות',
        'emoji': '&#128218;',
        'desc': 'צעצועים לימודיים לפעוטות',
        'category': 'toys',
        'age': '12-36m'
    },
    'tzaatzuei-chutz-lepaotot.html': {
        'title': 'צעצועי חוץ לפעוטות',
        'emoji': '&#9728;',
        'desc': 'צעצועים לחצר ולגינה',
        'category': 'toys',
        'age': '12-36m'
    },
    'tzaatzuei-ambatia-letinok.html': {
        'title': 'צעצועי אמבטיה לתינוק',
        'emoji': '&#128704;',
        'desc': 'צעצועים לאמבטיה שהופכים רחצה לכיף',
        'category': 'bath',
        'age': '6-36m'
    },
    'mutzrei-sheina-letinok.html': {
        'title': '7 מוצרי שינה מומלצים לתינוק',
        'emoji': '&#127769;',
        'desc': 'שקי שינה, רעש לבן ומנורות לילה',
        'category': 'sleep',
        'age': '0-24m'
    },
    'seder-sheina-mutzlach-letinok.html': {
        'title': '8 מוצרים לשגרת שינה מוצלחת',
        'emoji': '&#128164;',
        'desc': 'מוצרים שיעזרו לתינוק לישון טוב יותר',
        'category': 'sleep',
        'age': '0-24m'
    },
    'mutzrei-haachala-letinok.html': {
        'title': '10 מוצרי האכלה מומלצים לתינוק',
        'emoji': '&#127868;',
        'desc': 'סינרים, כלי אוכל וכוסות סיליקון',
        'category': 'feeding',
        'age': '6-36m'
    },
    'mutzrei-benika-letinok.html': {
        'title': 'מוצרי הניקה לתינוק',
        'emoji': '&#129329;',
        'desc': 'כריות הנקה, משאבות ואביזרים',
        'category': 'feeding',
        'age': '0-12m'
    },
    'bakbukim-vecosot-letinok.html': {
        'title': 'בקבוקים וכוסות לתינוק',
        'emoji': '&#129380;',
        'desc': 'בקבוקי האכלה וכוסות מעבר',
        'category': 'feeding',
        'age': '0-36m'
    },
    'kli-ochel-vetashmishei-haachala.html': {
        'title': 'כלי אוכל ותשמישי האכלה',
        'emoji': '&#127869;',
        'desc': 'צלחות, כפיות ומגשי האכלה',
        'category': 'feeding',
        'age': '6-36m'
    },
    'matanot-leida.html': {
        'title': '10 מתנות לידה מושלמות',
        'emoji': '&#127873;',
        'desc': 'רעיונות למתנות שכל יולדת תשמח לקבל',
        'category': 'gifts',
        'age': '0-6m'
    },
    'mutzarim-shemakilim-al-ima.html': {
        'title': '7 מוצרים שמקלים על אמא',
        'emoji': '&#128150;',
        'desc': 'מוצרים שחוסכים זמן ומקלים על החיים',
        'category': 'parents',
        'age': 'all'
    },
    'mutzarim-geoniyim-ali-express.html': {
        'title': '10 מוצרים גאוניים מעלי אקספרס',
        'emoji': '&#128161;',
        'desc': 'מוצרי תינוק מדהימים במחירים מטורפים',
        'category': 'deals',
        'age': 'all'
    },
    'gadgetim-chakaim-lehorim.html': {
        'title': '10 גאדג\'טים חכמים להורים',
        'emoji': '&#128241;',
        'desc': 'טכנולוגיה שמקלה על ההורות',
        'category': 'gadgets',
        'age': 'all'
    },
    'monitorim-umatzlemot-letinok.html': {
        'title': 'מוניטורים ומצלמות לתינוק',
        'emoji': '&#128247;',
        'desc': 'מוניטורים, מצלמות ומכשירי מעקב',
        'category': 'gadgets',
        'age': '0-36m'
    },
    'mutzarim-electroniyim-letinok.html': {
        'title': 'מוצרים אלקטרוניים לתינוק',
        'emoji': '&#128268;',
        'desc': 'מוצרים אלקטרוניים שימושיים לתינוק',
        'category': 'gadgets',
        'age': 'all'
    },
    'mutzarim-chashmaliyim-letinok.html': {
        'title': 'מוצרים חשמליים לתינוק',
        'emoji': '&#9889;',
        'desc': 'מוצרים חשמליים מומלצים',
        'category': 'gadgets',
        'age': 'all'
    },
    'mutzrei-betichut-habait-letinok.html': {
        'title': 'מוצרי בטיחות הבית לתינוק',
        'emoji': '&#128272;',
        'desc': 'נעילת ארונות, מגני פינות ושערי בטיחות',
        'category': 'safety',
        'age': '6-36m'
    },
    'mutzrei-betichut-labait.html': {
        'title': 'מוצרי בטיחות לבית',
        'emoji': '&#127968;',
        'desc': 'אביזרי בטיחות לבית עם ילדים',
        'category': 'safety',
        'age': 'all'
    },
    'mutzrei-betichut-letinok.html': {
        'title': 'מוצרי בטיחות לתינוק',
        'emoji': '&#128737;',
        'desc': 'בטיחות התינוק בבית ובחוץ',
        'category': 'safety',
        'age': '0-36m'
    },
    'mutzrei-rechitza-leambtia.html': {
        'title': 'מוצרי רחצה לאמבטיה',
        'emoji': '&#128704;',
        'desc': 'אמבטיות, מושבים וצעצועי רחצה',
        'category': 'bath',
        'age': '0-36m'
    },
    'mutzrei-rechitza-vetipuach-letinok.html': {
        'title': 'מוצרי רחצה וטיפוח לתינוק',
        'emoji': '&#129523;',
        'desc': 'סבונים, קרמים ואביזרי טיפוח',
        'category': 'bath',
        'age': '0-36m'
    },
    'mutzrei-briut-veezra-rishona-letinok.html': {
        'title': 'מוצרי בריאות ועזרה ראשונה',
        'emoji': '&#129657;',
        'desc': 'ערכות עזרה ראשונה, מדי חום ומוצרי בריאות',
        'category': 'health',
        'age': 'all'
    },
    'bigdei-tinok-mumlatzim.html': {
        'title': 'בגדי תינוק מומלצים',
        'emoji': '&#128086;',
        'desc': 'בגדים נוחים ואיכותיים לתינוק',
        'category': 'clothing',
        'age': '0-36m'
    },
    'nosiei-tinok-umoshavei-beteichut.html': {
        'title': 'נושאי תינוק ומושבי בטיחות',
        'emoji': '&#128664;',
        'desc': 'מנשאים, מושבי בטיחות ואביזרי נסיעה',
        'category': 'travel',
        'age': '0-36m'
    },
    'avizarei-agala-letinok.html': {
        'title': 'אביזרי עגלה לתינוק',
        'emoji': '&#128188;',
        'desc': 'אביזרים שימושיים לעגלת התינוק',
        'category': 'travel',
        'age': '0-36m'
    },
    'mutzrim-letiulim-im-tinok.html': {
        'title': 'מוצרים לטיולים עם תינוק',
        'emoji': '&#127956;',
        'desc': 'ציוד לטיולים ויציאות עם תינוק',
        'category': 'travel',
        'age': '0-36m'
    },
    'mutzrim-chaviim-lenesia-im-tinok.html': {
        'title': 'מוצרים חיוניים לנסיעה עם תינוק',
        'emoji': '&#9992;',
        'desc': 'ציוד חיוני לטיסה ונסיעה עם תינוק',
        'category': 'travel',
        'age': '0-36m'
    },
    'nesia-im-tinok.html': {
        'title': 'נסיעה עם תינוק - המדריך המלא',
        'emoji': '&#128747;',
        'desc': 'כל מה שצריך לדעת על נסיעה עם תינוק',
        'category': 'travel',
        'age': 'all'
    },
    'tikey-hachatala-lehorim.html': {
        'title': 'תיקי החתלה להורים',
        'emoji': '&#127890;',
        'desc': 'תיקי החתלה נוחים ומעוצבים',
        'category': 'travel',
        'age': '0-24m'
    },
    'ikuv-veargon-cheder-tinok.html': {
        'title': 'עיצוב וארגון חדר תינוק',
        'emoji': '&#127968;',
        'desc': 'רעיונות לעיצוב וארגון חדר התינוק',
        'category': 'room',
        'age': 'all'
    },
    'tziud-letinok-reshima-mlea.html': {
        'title': 'ציוד לתינוק - הרשימה המלאה',
        'emoji': '&#128203;',
        'desc': 'רשימת ציוד מלאה להכנה ללידה',
        'category': 'guides',
        'age': 'all'
    },
}

# Category mapping for cross-linking
CATEGORY_RELATED = {
    'toys': ['toys', 'room', 'gifts'],
    'sleep': ['sleep', 'room', 'gadgets'],
    'feeding': ['feeding', 'health'],
    'gadgets': ['gadgets', 'sleep', 'safety'],
    'safety': ['safety', 'gadgets', 'room'],
    'bath': ['bath', 'health', 'toys'],
    'travel': ['travel', 'safety'],
    'health': ['health', 'feeding', 'safety'],
    'parents': ['parents', 'gadgets', 'deals'],
    'gifts': ['gifts', 'toys', 'parents'],
    'deals': ['deals', 'parents', 'gadgets'],
    'clothing': ['clothing', 'gifts'],
    'room': ['room', 'safety', 'sleep'],
    'guides': ['guides', 'gifts', 'parents'],
}

# Additional FAQ templates per category
EXTRA_FAQS = {
    'toys': [
        ('כמה צעצועים צריך תינוק?', 'תינוק לא צריך הרבה צעצועים. 3-5 צעצועים בהישג יד מספיקים. מומלץ לעשות רוטציה כל שבוע - להחביא חלק ולהוציא אחרים. ככה כל צעצוע מרגיש חדש ומרתק.'),
        ('האם צעצועי עץ עדיפים על פלסטיק?', 'שניהם טובים! צעצועי עץ עמידים יותר ומפתחים תחושת משקל, אבל צעצועי סיליקון ופלסטיק BPA-free בטוחים לכניסה לפה ולניקוי קל. הכי חשוב - שהצעצוע יהיה מותאם לגיל.'),
        ('מה צעצועי STEM לתינוקות?', 'צעצועי STEM (מדע, טכנולוגיה, הנדסה, מתמטיקה) לתינוקות כוללים קוביות בנייה, פאזלים, צעצועי מיון צורות, ומגנטים. הם מפתחים חשיבה לוגית ופתרון בעיות מגיל צעיר.'),
    ],
    'sleep': [
        ('מתי תינוק מתחיל לישון כל הלילה?', 'רוב התינוקות מתחילים לישון 6-8 שעות ברצף בגיל 4-6 חודשים. שגרת שינה עקבית, סביבה חשוכה ושקטה, ומוצרי שינה מתאימים יכולים לעזור להגיע לשם מוקדם יותר.'),
        ('שק שינה או שמיכה - מה עדיף?', 'שק שינה עדיף ובטוח יותר! הוא מונע כיסוי של הפנים, שומר על חום אחיד, ומשמש כאיתות שינה. שמיכה מומלצת רק מגיל שנה ומעלה.'),
        ('האם רעש לבן בטוח לתינוקות?', 'כן, כל עוד העוצמה לא עולה על 50 דציבל (כמו מקלחת) והמכשיר לא צמוד לאוזניים. רעש לבן עוזר לתינוקות להירגע ולהירדם כי הוא מזכיר את הרעשים ברחם.'),
    ],
    'feeding': [
        ('מאיזה גיל מתחילים אוכל מוצק?', 'ההמלצה היא להתחיל בגיל 6 חודשים, כשהתינוק יושב יציב ומגלה עניין באוכל. מתחילים עם מחיות חלקות ועוברים בהדרגה לטקסטורות.'),
        ('כלי סיליקון או פלסטיק - מה עדיף?', 'סיליקון עדיף! הוא רך (לא פוגע בחניכיים), עמיד בחום, קל לניקוי, ולא מכיל BPA. כלי סיליקון גם נצמדים לשולחן ומונעים שפיכה.'),
        ('איך לעודד אכילה עצמאית (BLW)?', 'Baby Led Weaning מתחיל בגיל 6 חודשים. הגישו חתיכות רכות בגודל אצבע, שבו ליד התינוק, ותנו לו לחקור. כלי אוכל עם ידית עבה ומגש עם חלוקה עוזרים.'),
    ],
    'gadgets': [
        ('האם מוניטור WiFi בטוח?', 'מוניטורים עם WiFi נוחים לצפייה מרחוק, אבל חשוב לשנות סיסמה, לעדכן firmware ולבחור מותג אמין. מוניטורים ללא WiFi (תדר סגור) בטוחים יותר מבחינת פרטיות.'),
        ('מה ההבדל בין מוניטור וידאו לאודיו?', 'מוניטור וידאו מאפשר לראות את התינוק, מה שנותן שקט נפשי. מוניטור אודיו זול יותר ומספיק אם אתם באותה קומה. מוניטור וידאו עם ראיית לילה הוא ההשקעה הכי משתלמת.'),
    ],
    'safety': [
        ('מאיזה גיל צריך מוצרי בטיחות?', 'מומלץ להתחיל להתקין מוצרי בטיחות כשהתינוק מתחיל לזחול (בערך גיל 6-7 חודשים). שערי בטיחות, נעילת ארונות ומגני פינות הם הבסיס.'),
        ('איך לבחור שער בטיחות?', 'בחרו שער עם נעילה כפולה שמבוגר יכול לפתוח ביד אחת. ודאו שהוא מתאים לרוחב הפתח ומותקן בצורה יציבה. שער לגרם מדרגות חייב להיות מוברג לקיר, לא בלחץ.'),
    ],
    'bath': [
        ('כמה פעמים צריך לרחוץ תינוק?', '2-3 פעמים בשבוע מספיק לרוב התינוקות. רחצה יומית יכולה לייבש את העור. ביום שלא רוחצים, ניקוי עם מגבון לח או מטלית ספוגית מספיק.'),
        ('מה הטמפרטורה הנכונה למים?', 'הטמפרטורה האידיאלית היא 37 מעלות צלזיוס. תמיד בדקו עם מרפק או מדחום מים לפני הכנסת התינוק. מים חמים מדי עלולים לגרום לכוויות.'),
    ],
    'travel': [
        ('מה לקחת לטיסה עם תינוק?', 'חיתולים (יותר ממה שחושבים), בקבוק/מוצץ להמראה ונחיתה, החלפת בגדים, שקיות ניילון, חטיפים, צעצוע קטן, ותעודות זהות. בעגלה - בקשו gate check.'),
        ('האם מותר לקחת עגלה למטוס?', 'כן! רוב חברות התעופה מאפשרות עגלה עד שער העלייה (gate check) בחינם. עגלות קומפקטיות מסוימות מאושרות ככבודת יד ונכנסות לתא מטען עליון.'),
    ],
    'health': [
        ('מה חייב להיות בערכת עזרה ראשונה?', 'מדחום דיגיטלי, אקמול לתינוקות, נורופן (מגיל 3 חודשים), פלסטרים, משחת כוויות, סרום פיזיולוגי לאף, שאבה לאף, ומספריים לציפורניים עם קצה מעוגל.'),
    ],
    'gifts': [
        ('מה המתנה הכי שימושית ליולדת?', 'מוצרים שימושיים כמו שק שינה, סט סינרים סיליקון, או נשכנים הם תמיד רעיון טוב. מתנות מותאמות אישית (שמיכה עם שם, אלבום ראשון) מוסיפות נגיעה מיוחדת.'),
    ],
    'parents': [
        ('מה המוצר הכי שימושי להורים חדשים?', 'כל הורה יגיד משהו אחר, אבל מוניטור תינוק, תיק החתלה מאורגן, ומנשא ארגונומי הם שלושת המוצרים שהכי משנים את החיים היומיומיים של הורים חדשים.'),
    ],
    'deals': [
        ('מתי הכי זול לקנות בעלי אקספרס?', 'המבצעים הגדולים הם: 3.28 (יום הולדת AliExpress), 6.18 (מבצע אמצע שנה), 11.11 (Singles Day - הכי גדול!), ו-Black Friday. בין המבצעים, קופונים של מוכרים חוסכים 5-15%.'),
    ],
    'clothing': [
        ('איזה מידה לקנות לתינוק?', 'תמיד קנו מידה אחת יותר גדולה! תינוקות גדלים מהר. מידה 0-3 חודשים נגמרת תוך שבועות. בעלי אקספרס, בדקו את טבלת המידות של המוכר כי מידות סיניות קטנות יותר.'),
    ],
    'room': [
        ('מה חייב בחדר תינוק?', 'מיטת תינוק בטיחותית, מזרן קשיח, שידת החתלה, מנורת לילה עמומה, וילונות האפלה, ומוניטור. אל תעמיסו - חדר מינימליסטי בטוח יותר ומרגיע יותר.'),
    ],
    'guides': [
        ('מתי להתחיל לקנות ציוד לתינוק?', 'מומלץ להתחיל בשליש השני להריון. ככה יש זמן להשוות מחירים, לחכות למבצעים, ולקבל משלוחים מעלי אקספרס (7-21 ימים). את הדברים הגדולים (עגלה, מיטה) כדאי לקנות עד שבוע 34.'),
    ],
}


def get_related_articles(current_file, count=6):
    """Get related articles for cross-linking. Prioritize same category, then related categories."""
    if current_file not in ARTICLES_DB:
        return []

    current = ARTICLES_DB[current_file]
    current_cat = current['category']
    related_cats = CATEGORY_RELATED.get(current_cat, [current_cat])

    # Score articles by relevance
    scored = []
    for fname, meta in ARTICLES_DB.items():
        if fname == current_file:
            continue
        score = 0
        if meta['category'] == current_cat:
            score = 3  # Same category
        elif meta['category'] in related_cats:
            score = 2  # Related category
        else:
            score = 1  # Different category
        scored.append((score, fname, meta))

    # Sort by score (desc), take top N
    scored.sort(key=lambda x: -x[0])
    return [(f, m) for _, f, m in scored[:count]]


def extract_products(html):
    """Extract product names and prices from HTML."""
    products = []
    # Find all product cards
    pattern = r'<h3>(.*?)</h3>\s*<p class="price">(.*?)</p>'
    for match in re.finditer(pattern, html):
        name = match.group(1)
        price = match.group(2)
        # Clean HTML entities
        price = price.replace('&#8362;', '\u20aa')
        products.append({'name': name, 'price': price})
    return products


def estimate_reading_time(html):
    """Estimate reading time in minutes based on Hebrew text content."""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', html)
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Hebrew reading speed ~200 words/minute
    words = len(text.split())
    return max(2, math.ceil(words / 200))


def build_toc_html(products):
    """Build Table of Contents HTML from product list."""
    if not products:
        return ''

    toc_items = ''
    for i, p in enumerate(products, 1):
        toc_items += f'<li><a href="#product-{i}">{p["name"]}</a> <span class="toc-price">{p["price"]}</span></li>\n'

    return f'''
<!-- Table of Contents -->
<div class="toc-box">
<h2 class="toc-title">&#128203; תוכן עניינים</h2>
<ol class="toc-list">
{toc_items}</ol>
</div>
'''


def build_comparison_table(products):
    """Build comparison table HTML."""
    if not products:
        return ''

    rows = ''
    for i, p in enumerate(products, 1):
        rows += f'<tr><td>{i}</td><td>{p["name"]}</td><td class="price-cell">{p["price"]}</td></tr>\n'

    return f'''
<!-- Comparison Table -->
<div class="comparison-table-wrapper">
<h2>&#128202; טבלת השוואה מהירה</h2>
<table class="comparison-table">
<thead><tr><th>#</th><th>מוצר</th><th>מחיר</th></tr></thead>
<tbody>
{rows}</tbody>
</table>
</div>
'''


def build_author_bio():
    """Build author bio HTML."""
    return '''
<!-- Author Bio -->
<div class="author-bio">
<div class="author-avatar">MC</div>
<div class="author-info">
<h3>&#9997; נכתב על ידי צוות MamaChoice</h3>
<p>אנחנו צוות של הורים שבודקים, משווים וממליצים על מוצרי תינוק. כל מוצר שנכנס למדריכים שלנו נבחר על סמך דירוגים, ביקורות אמיתיות ובדיקה ידנית. המטרה שלנו: לחסוך לכם זמן וכסף.</p>
<a href="../about.html" class="author-link">&#8592; קראו עוד עלינו</a>
</div>
</div>
'''


def build_extra_faq_html(current_file, existing_faq_count):
    """Build additional FAQ items."""
    if current_file not in ARTICLES_DB:
        return '', []

    cat = ARTICLES_DB[current_file]['category']
    extra = EXTRA_FAQS.get(cat, [])

    # Add general AliExpress FAQ for all articles
    general = [
        ('כמה זמן לוקח משלוח מעלי אקספרס לישראל?', 'משלוח רגיל מעלי אקספרס לישראל לוקח 7-21 ימים עסקים. משלוח AliExpress Standard ו-Cainiao לרוב מגיעים תוך 10-14 ימים. כדאי לבדוק אם יש אפשרות משלוח מהיר.'),
        ('האם יש מכס על הזמנות מעלי אקספרס?', 'הזמנות עד 75 דולר (כ-280 שקל) פטורות ממכס ומע"מ. מעל הסכום הזה ייגבו מע"מ (17%) ולפעמים מכס. רוב מוצרי התינוק נופלים מתחת לסכום הזה.'),
    ]

    all_faqs = extra + general

    html = ''
    schema_items = []
    for q, a in all_faqs:
        html += f'''<div class="faq-item">
<h3>{q}</h3>
<p>{a}</p>
</div>
'''
        schema_items.append({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": a
            }
        })

    return html, schema_items


def build_related_html(current_file):
    """Build enhanced related articles section with 6 articles."""
    related = get_related_articles(current_file, 6)
    if not related:
        return ''

    cards = ''
    for fname, meta in related:
        cards += f'''<a href="{fname}" class="related-card">
<h3>{meta["emoji"]} {meta["title"]}</h3>
<p>{meta["desc"]}</p>
</a>
'''

    return f'''<div class="related-articles">
<h2>&#128218; מדריכים נוספים שיעניינו אתכם</h2>
<div class="related-grid">
{cards}</div>
</div>'''


def build_contextual_links(current_file):
    """Build 2-3 contextual links to insert within article body."""
    related = get_related_articles(current_file, 3)
    links = []
    for fname, meta in related[:2]:
        links.append(f'<div class="contextual-link">&#128279; קראו גם: <a href="{fname}">{meta["title"]}</a></div>')
    return links


# CSS to inject
EXTRA_CSS = '''
/* TOC */
.toc-box{background:linear-gradient(135deg,#f8f9ff,#f0f4ff);border:2px solid #e0e7ff;border-radius:12px;padding:25px 30px;margin-bottom:35px;}
.toc-title{font-size:1.3em;color:#2D2D2D;margin-bottom:15px;}
.toc-list{padding-right:20px;counter-reset:toc;}
.toc-list li{margin-bottom:8px;font-size:0.95em;line-height:1.6;}
.toc-list a{color:#5B6ABF;text-decoration:none;font-weight:500;}
.toc-list a:hover{color:#3d4a9e;text-decoration:underline;}
.toc-price{color:#E07A5F;font-weight:700;font-size:0.9em;margin-right:8px;}

/* Comparison Table */
.comparison-table-wrapper{margin-bottom:35px;}
.comparison-table-wrapper h2{font-size:1.3em;margin-bottom:15px;color:#2D2D2D;}
.comparison-table{width:100%;border-collapse:collapse;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.comparison-table thead{background:#5B6ABF;color:#fff;}
.comparison-table th{padding:12px 15px;text-align:right;font-weight:600;font-size:0.95em;}
.comparison-table td{padding:10px 15px;border-bottom:1px solid #eee;font-size:0.9em;}
.comparison-table tr:nth-child(even){background:#f8f9ff;}
.comparison-table tr:hover{background:#eef1ff;}
.price-cell{color:#E07A5F;font-weight:700;}

/* Author Bio */
.author-bio{display:flex;gap:20px;align-items:flex-start;background:#FFF9FB;border:1px solid #f0e8ec;border-radius:12px;padding:25px;margin-top:40px;}
.author-avatar{width:60px;height:60px;background:linear-gradient(135deg,#C77DA0,#6BB8C7);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:1.2em;flex-shrink:0;}
.author-info h3{font-size:1.1em;color:#2D2D2D;margin-bottom:8px;}
.author-info p{font-size:0.9em;color:#555;line-height:1.7;margin-bottom:10px;}
.author-link{color:#C77DA0;text-decoration:none;font-weight:600;font-size:0.9em;}
.author-link:hover{color:#a8628a;text-decoration:underline;}

/* Reading Time */
.reading-time{display:inline-block;background:#f0f4ff;color:#5B6ABF;padding:5px 15px;border-radius:20px;font-size:0.85em;font-weight:600;margin-top:8px;}

/* Contextual Link */
.contextual-link{background:linear-gradient(135deg,#f8f9ff,#f0f4ff);padding:12px 20px;border-radius:8px;margin:20px 0;border-right:4px solid #5B6ABF;font-size:0.95em;}
.contextual-link a{color:#5B6ABF;font-weight:600;text-decoration:none;}
.contextual-link a:hover{text-decoration:underline;}

@media(max-width:768px){
  .toc-box{padding:18px;}
  .comparison-table{font-size:0.85em;}
  .comparison-table th,.comparison-table td{padding:8px 10px;}
  .author-bio{flex-direction:column;align-items:center;text-align:center;}
  .related-grid{grid-template-columns:1fr 1fr;}
}
@media(max-width:480px){
  .related-grid{grid-template-columns:1fr;}
}
'''


def add_product_anchors(html):
    """Add id anchors to product cards for TOC linking."""
    counter = [0]
    def replacer(match):
        counter[0] += 1
        return f'<div class="article-product" id="product-{counter[0]}">'
    return re.sub(r'<div class="article-product">', replacer, html)


def upgrade_article(filepath):
    """Apply all SEO upgrades to a single article file."""
    filename = os.path.basename(filepath)
    print(f"  Processing: {filename}")

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    # Skip if already upgraded
    if 'toc-box' in html:
        print(f"    SKIP: Already upgraded")
        return False

    # 1. Extract products
    products = extract_products(html)

    # 2. Reading time
    reading_time = estimate_reading_time(html)

    # 3. Build new elements
    toc_html = build_toc_html(products)
    table_html = build_comparison_table(products)
    author_html = build_author_bio()
    related_html = build_related_html(filename)
    contextual_links = build_contextual_links(filename)
    extra_faq_html, extra_faq_schema = build_extra_faq_html(filename, 5)

    # === INJECT CSS ===
    html = html.replace('</style>', EXTRA_CSS + '\n</style>')

    # === ADD READING TIME to hero ===
    reading_badge = f'<div class="reading-time">&#9201; זמן קריאה: {reading_time} דקות | עודכן: מרץ 2026</div>'
    # Insert after the date div in hero
    html = re.sub(
        r'(<div class="date">.*?</div>)',
        r'\1\n' + reading_badge,
        html
    )

    # === ADD PRODUCT ANCHORS ===
    html = add_product_anchors(html)

    # === ADD TOC + COMPARISON TABLE after intro ===
    html = html.replace(
        '</div>\n\n<!-- Product 1 -->',
        '</div>\n\n' + toc_html + '\n' + table_html + '\n<!-- Product 1 -->'
    )
    # Fallback: try without double newline
    if 'toc-box' not in html:
        html = html.replace(
            '</div>\n<!-- Product 1 -->',
            '</div>\n' + toc_html + '\n' + table_html + '\n<!-- Product 1 -->'
        )

    # === ADD CONTEXTUAL LINKS between products ===
    # Insert after product 3 and product 7
    for i, link in enumerate(contextual_links):
        target_product = 4 + (i * 3)  # After product 3, 6
        marker = f'<!-- Product {target_product} -->'
        if marker in html:
            html = html.replace(marker, link + '\n\n' + marker)

    # === REPLACE RELATED ARTICLES with enhanced version ===
    html = re.sub(
        r'<!-- Related Articles -->.*?</div>\s*</div>',
        related_html,
        html,
        flags=re.DOTALL
    )

    # === ADD EXTRA FAQ items before closing faq-section ===
    if extra_faq_html:
        html = html.replace('</div>\n\n</div>\n\n<footer>',
                          extra_faq_html + '</div>\n\n</div>\n\n<footer>')
        # Fallback
        if extra_faq_html not in html:
            # Insert before closing faq-section div
            html = re.sub(
                r'(</div>\s*</div>\s*<footer>)',
                extra_faq_html + r'\1',
                html
            )

    # === ADD AUTHOR BIO before footer ===
    html = html.replace('<footer>', author_html + '\n\n<footer>')

    # === UPDATE FAQ SCHEMA with extra questions ===
    if extra_faq_schema:
        # Find existing FAQPage schema
        faq_schema_pattern = r'(<script type="application/ld\+json">{"@context":"https://schema\.org","@type":"FAQPage","mainEntity":\[)(.*?)(\]}</script>)'
        match = re.search(faq_schema_pattern, html)
        if match:
            existing = match.group(2)
            new_items = json.dumps(extra_faq_schema, ensure_ascii=False)
            # Remove outer brackets from new items
            new_items = new_items[1:-1]
            updated = existing + ',' + new_items
            html = html[:match.start()] + match.group(1) + updated + match.group(3) + html[match.end():]

    # === UPDATE dateModified in Article schema ===
    today = datetime.now().strftime('%Y-%m-%d')
    html = re.sub(
        r'"dateModified":"[^"]*"',
        f'"dateModified":"{today}"',
        html
    )

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f"    OK: {len(products)} products, {reading_time} min read, +{len(extra_faq_schema)} FAQs")
    return True


def main():
    """Upgrade all articles."""
    print("=" * 60)
    print("MamaChoice SEO Upgrade")
    print("=" * 60)

    articles = [f for f in os.listdir(ARTICLES_DIR) if f.endswith('.html')]
    print(f"\nFound {len(articles)} articles\n")

    upgraded = 0
    skipped = 0
    errors = 0

    for article in sorted(articles):
        filepath = os.path.join(ARTICLES_DIR, article)
        try:
            if upgrade_article(filepath):
                upgraded += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"    ERROR: {e}")
            errors += 1

    print(f"\n{'=' * 60}")
    print(f"Done! Upgraded: {upgraded}, Skipped: {skipped}, Errors: {errors}")
    print(f"{'=' * 60}")


if __name__ == '__main__':
    main()
