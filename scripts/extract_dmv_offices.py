#!/usr/bin/env python3
"""
Extract all DMV office pages from WordPress database
"""

import json
import re

# Known office slugs from the live website
OFFICE_SLUGS = [
    "california-dmv-alturas-office", "arleta", "arvin-dmv", "auburn-dmv", "dmv-bakersfield",
    "dmv-bakersfield-southwest", "banning-dmv", "barstow-dmv", "dmv-bell-gardens", "bellflower-dmv",
    "bishop-dmv", "blythe-dmv", "dmv-brawley", "dmv-capitola", "carmichael-dmv",
    "dmv-chico", "dmv-chula-vista", "dmv-clovis", "coalinga-dmv", "colusa-dmv",
    "compton-dmv", "dmv-concord", "dmv-corte-madera", "costa-mesa-dmv", "dmv-crescent-city-ca",
    "culver-city-dmv", "dmv-daly-city", "davis-dmv", "delano-dmv", "dmv-el-cajon",
    "dmv-el-centro", "el-cerrito-dmv", "el-monte-dmv", "dmv-euraka", "fairfield-dmv",
    "dmv-fall-river-mills-ca", "folsom-dmv", "fontana-dmv", "fontana-commercial-drive-test-center",
    "fort-bragg-dmv", "fremont-dmv", "dmv-fresno", "fresno-commercial-drive-test-center",
    "fresno-north-dmv", "fullerton-dmv", "garberville-dmv", "gardena-commercial-drive-test-center",
    "gilroy-dmv", "glendale-dmv", "dmv-goleta", "granada-hills-driver-license-processing-center",
    "dmv-grass-valley", "hanford-dmv", "hawthorne-dmv", "hayward-dmv", "hemet-dmv",
    "hollister-dmv", "hollywood-dmv", "dmv-indio", "inglewood-dmv", "dmv-jackson-ca",
    "laguna-hills-dmv", "lake-isabella-dmv", "lakeport-dmv", "lancaster-dmv", "lincoln-park-dmv",
    "lodi-dmv", "lompoc-dmv", "long-beach-dmv", "dmv-los-angeles", "dmv-los-banos",
    "los-gatos-dmv", "madera-dmv", "manteca-dmv", "mariposa-dmv", "mendota-dmv",
    "merced-dmv", "dmv-modesto", "montebello-dmv", "mt-shasta-dmv", "napa-dmv",
    "needles-dmv", "newhall-dmv", "norco-dmv", "novato-dmv", "oakland-dmv",
    "oakland-coliseum-dmv", "dmv-oceanside", "oroville-dmv", "oxnard-dmv", "dmv-palm-desert",
    "dmv-palm-springs", "dmv-paradise-ca", "pasadena-dmv", "dmv-paso-robles", "petaluma-dmv",
    "pittsburg-dmv", "placerville-dmv", "dmv-pleasanton", "pomona-dmv", "porterville-dmv",
    "poway-dmv", "quincy-dmv", "rancho-cucamonga-dmv", "rancho-san-diego-industry-business-center",
    "red-bluff-dmv", "dmv-redding-ca", "redlands-dmv", "redwood-city-dmv", "reedley-dmv",
    "ridgecrest-dmv", "riverside-dmv", "riverside-east-dmv", "rocklin-dmv", "roseville-dmv",
    "dmv-sacramento", "dmv-south-sacramento", "dmv-salinas", "san-andreas-dmv", "dmv-san-bernardino",
    "san-clemente-dmv", "dmv-san-diego", "san-diego-clairemont-dmv", "dmv-san-francisco",
    "dmv-san-jose", "san-jose-driver-license-processing-center-dl", "dmv-san-luis-obispo",
    "san-marcos-rancheros-dmv", "san-mateo-dmv", "san-pedro-dmv", "san-ysidro-dmv",
    "santa-ana-dmv", "dmv-santa-barbara", "santa-clara-dmv", "dmv-santa-maria", "santa-monica-dmv",
    "santa-paula-dmv", "santa-rosa-dmv", "santa-teresa-dmv", "dmv-seaside", "shafter-dmv",
    "simi-valley-dmv", "dmv-sonora-ca", "dmv-south-lake-tahoe", "stanton-driver-license-processing-center-dl",
    "stockton-dmv", "dmv-susanville-ca", "taft-dmv", "dmv-temecula", "thousand-oaks-dmv",
    "torrance-dmv", "tracy-dmv", "truckee-dmv", "tulare-dmv", "tulelake-dmv",
    "turlock-dmv", "twentynine-palms-dmv", "ukiah-dmv", "vacaville-dmv", "vallejo-dmv",
    "dmv-van-nuys", "dmv-ventura", "victorville-dmv", "dmv-visalia", "dmv-walnut-creek",
    "dmv-watsonville", "weaverville-dmv", "west-covina-dmv", "west-hollywood-dmv",
    "west-sacramento-commercial-drive-test-center", "westminister-dmv", "whittier-dmv",
    "willows-dmv", "winnetka-dmv", "woodland-dmv", "yreka-dmv", "yuba-city-dmv"
]

def extract_post(sql_file, slug):
    """Extract a specific post by slug from SQL"""
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            # Look for the slug in post_name field (field 12)
            if f"'{slug}'" in line and "INSERT INTO `wp_posts`" in line:
                # Try to find the record
                records = re.findall(
                    r"\((\d+),[^,]*,[^,]*,[^,]*,'([^']*)'[^,]*,'([^']*)'[^,]*(,(?:[^']*'[^']*')*)[^,]*'(publish|draft)'[^,]*'([^']*)'",
                    line
                )

                for record in records:
                    post_id, title, post_content, _, status, post_name = record[:6]

                    if post_name == slug and status == 'publish':
                        # Unescape content
                        post_content = post_content.replace("\\'", "'").replace('\\"', '"')
                        post_content = post_content.replace("\\r\\n", "\n").replace("\\n", "\n")
                        post_content = post_content.replace("\\t", "\t")

                        return {
                            'id': int(post_id),
                            'title': title.replace("\\'", "'").replace('\\"', '"'),
                            'slug': post_name,
                            'content': post_content
                        }

    return None

print("=== Extracting DMV Office Pages ===\n")
print(f"Searching for {len(OFFICE_SLUGS)} office pages...\n")

offices = []
found_count = 0
not_found = []

for slug in OFFICE_SLUGS:
    office = extract_post('data/wordpress/dmvcali2.sql', slug)

    if office:
        offices.append(office)
        found_count += 1
        print(f"✓ Found: {office['title']} (/{office['slug']})")
    else:
        not_found.append(slug)
        print(f"✗ Not found: {slug}")

# Save to JSON
output = {
    'extracted_at': '2025-01-01T00:00:00Z',
    'total_offices': len(offices),
    'offices': offices
}

with open('src/data/dmv_offices.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Extracted {found_count} out of {len(OFFICE_SLUGS)} DMV office pages")
print(f"💾 Saved to: src/data/dmv_offices.json")

if not_found:
    print(f"\n⚠️  {len(not_found)} offices not found in WordPress:")
    for slug in not_found[:10]:
        print(f"   - {slug}")
    if len(not_found) > 10:
        print(f"   ... and {len(not_found) - 10} more")

# Show sample
if offices:
    print(f"\n📝 Sample office:")
    sample = offices[0]
    print(f"   Title: {sample['title']}")
    print(f"   Slug: {sample['slug']}")
    print(f"   Content length: {len(sample['content'])} chars")
    print(f"   Content preview: {sample['content'][:200]}...")
