#!/usr/bin/env python3
"""
Extract keywords from WordPress postmeta and add them to blog posts as tags
"""

import json
import re

def extract_postmeta(sql_file):
    """Extract all postmeta records"""
    records = []
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        in_insert = False
        buffer = ""

        for line in f:
            if 'INSERT INTO `wp_postmeta`' in line:
                in_insert = True
                buffer = line
                continue

            if in_insert:
                buffer += line
                if ';' in line:
                    # End of INSERT statement
                    in_insert = False

                    # Extract VALUES part
                    match = re.search(r'VALUES\s+(.+);', buffer, re.DOTALL)
                    if match:
                        values_str = match.group(1).strip()

                        # Parse each tuple (record)
                        current_tuple = ""
                        paren_depth = 0
                        in_quotes = False
                        escape_next = False

                        for char in values_str:
                            if escape_next:
                                current_tuple += char
                                escape_next = False
                                continue

                            if char == '\\':
                                escape_next = True
                                current_tuple += char
                                continue

                            if char == "'" and not escape_next:
                                in_quotes = not in_quotes

                            if not in_quotes:
                                if char == '(':
                                    paren_depth += 1
                                    if paren_depth == 1:
                                        current_tuple = ""
                                        continue
                                elif char == ')':
                                    paren_depth -= 1
                                    if paren_depth == 0:
                                        # Parse the tuple
                                        fields = []
                                        field = ""
                                        field_in_quotes = False
                                        field_escape = False

                                        for c in current_tuple:
                                            if field_escape:
                                                field += c
                                                field_escape = False
                                                continue

                                            if c == '\\':
                                                field_escape = True
                                                continue

                                            if c == "'":
                                                field_in_quotes = not field_in_quotes
                                                continue

                                            if c == ',' and not field_in_quotes:
                                                fields.append(field.strip())
                                                field = ""
                                                continue

                                            field += c

                                        if field:
                                            fields.append(field.strip())

                                        records.append(fields)
                                        current_tuple = ""
                                        continue

                            current_tuple += char

                    buffer = ""

    return records

print("=== Extracting Keywords from WordPress Database ===\n")

# Extract all postmeta
print("1. Extracting postmeta...")
postmeta_records = extract_postmeta('data/wordpress/dmvcali2.sql')
print(f"   Found {len(postmeta_records)} postmeta records")

# Extract keywords for each post
print("\n2. Extracting keywords...")
post_keywords = {}  # post_id -> [keywords]

for record in postmeta_records:
    if len(record) >= 4:
        post_id = int(record[1])
        meta_key = record[2]
        meta_value = record[3]

        # Look for keyword-related meta fields
        if meta_key in ['rank_math_focus_keyword', '_yoast_wpseo_focuskw', 'keywords']:
            if meta_value and meta_value.strip():
                if post_id not in post_keywords:
                    post_keywords[post_id] = []

                # Some keywords might be comma-separated
                keywords = [k.strip() for k in meta_value.split(',')]
                post_keywords[post_id].extend(keywords)

print(f"   Found keywords for {len(post_keywords)} posts")

# Add keywords to blog_posts.json
print("\n3. Adding keywords to blog posts as tags...")
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

updated_count = 0
for post in blog_data['posts']:
    post_id = post['id']

    if post_id in post_keywords:
        # Remove duplicates and sort
        post['tags'] = sorted(list(set(post_keywords[post_id])))
        print(f"   ✓ Post {post_id}: {post['title'][:50]} → {len(post['tags'])} tags")
        updated_count += 1
    else:
        post['tags'] = []

# Save updated blog data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Updated {updated_count} out of {len(blog_data['posts'])} posts with keywords/tags")
print("💾 Saved updated blog_posts.json")

# Show all unique tags
all_tags = set()
for post in blog_data['posts']:
    all_tags.update(post.get('tags', []))

print(f"\n📊 Found {len(all_tags)} unique keywords/tags:")
for tag in sorted(all_tags):
    tag_count = sum(1 for p in blog_data['posts'] if tag in p.get('tags', []))
    print(f"   • {tag}: {tag_count} posts")
