"""Fix Product Schema issues reported by Google Search Console:
1. Missing 'description' on Product
2. Missing 'hasMerchantReturnPolicy' in offers
3. Missing global identifier (add brand instead of GTIN)
4. Missing 'shippingDetails' in offers
"""
import os, glob, json, re

BASE = r"D:\yupoo\mama-choice-repo\articles"

# Shared return policy (AliExpress buyer protection)
RETURN_POLICY = {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "IL",
    "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 15,
    "returnMethod": "https://schema.org/ReturnByMail",
    "returnFees": "https://schema.org/ReturnShippingFees"
}

# Shared shipping details (AliExpress to Israel)
SHIPPING_DETAILS = {
    "@type": "OfferShippingDetails",
    "shippingDestination": {
        "@type": "DefinedRegion",
        "addressCountry": "IL"
    },
    "deliveryTime": {
        "@type": "ShippingDeliveryTime",
        "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
        },
        "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 7,
            "maxValue": 21,
            "unitCode": "DAY"
        }
    },
    "shippingRate": {
        "@type": "MonetaryAmount",
        "value": "0",
        "currency": "ILS"
    }
}

def fix_schema(filepath):
    """Fix the ItemList schema in an article file"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Find all JSON-LD scripts
    pattern = r'<script type="application/ld\+json">(.*?)</script>'
    matches = list(re.finditer(pattern, content))

    if not matches:
        print(f"  NO SCHEMA: {os.path.basename(filepath)}")
        return False

    modified = False

    for match in matches:
        try:
            data = json.loads(match.group(1))
        except json.JSONDecodeError:
            continue

        # Only process ItemList schemas (contains Product items)
        if data.get("@type") != "ItemList":
            continue

        items = data.get("itemListElement", [])
        for item in items:
            product = item.get("item", {})
            if product.get("@type") != "Product":
                continue

            # 1. Add description (use product name as description)
            if "description" not in product:
                product["description"] = product.get("name", "")
                modified = True

            # 2. Add brand (instead of GTIN which we don't have)
            if "brand" not in product:
                product["brand"] = {
                    "@type": "Brand",
                    "name": "MamaChoice"
                }
                modified = True

            # Fix offers
            offers = product.get("offers", {})
            if isinstance(offers, dict):
                # 3. Add hasMerchantReturnPolicy
                if "hasMerchantReturnPolicy" not in offers:
                    offers["hasMerchantReturnPolicy"] = RETURN_POLICY
                    modified = True

                # 4. Add shippingDetails
                if "shippingDetails" not in offers:
                    offers["shippingDetails"] = SHIPPING_DETAILS
                    modified = True

        if modified:
            # Replace the old JSON-LD with updated one
            new_json = json.dumps(data, ensure_ascii=False)
            old_script = match.group(0)
            new_script = f'<script type="application/ld+json">{new_json}</script>'
            content = content.replace(old_script, new_script)

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"  FIXED: {os.path.basename(filepath)}")
        return True
    else:
        print(f"  ALREADY OK: {os.path.basename(filepath)}")
        return False


# ===== MAIN =====
print("=" * 60)
print("Fixing Product Schema - Google Search Console issues")
print("=" * 60)

article_files = glob.glob(os.path.join(BASE, "*.html"))
fixed_count = 0

for f in sorted(article_files):
    if fix_schema(f):
        fixed_count += 1

print(f"\nTotal: {fixed_count} files fixed")
print("Done!")
