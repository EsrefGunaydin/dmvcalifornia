#!/usr/bin/env python3
"""
Extract missing blog posts from WordPress
"""

import json
import re

# Missing post slugs
MISSING_SLUGS = [
    'how-to-drive-safely-and-avoid-fines',
    'how-to-update-your-address-with-the-dmv',
    'drivers-licenses-design-by-state',
    'car-registration',
    'auto-insurance'
]

def extract_post_by_slug(sql_file, slug):
    """Extract a specific post from SQL by slug"""
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

        # Find lines that contain this slug and INSERT INTO wp_posts
        lines = content.split('\n')

        for line in lines:
            if slug in line and 'INSERT INTO `wp_posts`' in line and 'publish' in line:
                # Try to parse this line to extract the post
                # Match pattern: (id,...fields...,'slug',...)
                # This is complex, so let's look for the record that has our slug

                # Split by records (separated by ),(
                records = line.split('),(')

                for record in records:
                    if f"'{slug}'" in record and 'publish' in record:
                        # Clean up the record
                        record = record.strip('(').strip(')').strip(',')

                        # Try to parse fields more carefully
                        # WordPress wp_posts has these fields in order:
                        # ID, post_author, post_date, post_date_gmt, post_content, post_title,
                        # post_excerpt, post_status, comment_status, ping_status, post_password,
                        # post_name, to_ping, pinged, post_modified, post_modified_gmt,
                        # post_content_filtered, post_parent, guid, menu_order, post_type,
                        # post_mime_type, comment_count

                        # Split by comma but respect quotes
                        fields = []
                        current = ""
                        in_quotes = False
                        escape_next = False

                        for char in record:
                            if escape_next:
                                current += char
                                escape_next = False
                                continue

                            if char == '\\':
                                current += char
                                escape_next = True
                                continue

                            if char == "'" and not escape_next:
                                in_quotes = not in_quotes
                                current += char
                                continue

                            if char == ',' and not in_quotes:
                                fields.append(current.strip())
                                current = ""
                                continue

                            current += char

                        if current:
                            fields.append(current.strip())

                        if len(fields) >= 13:
                            post_id = int(fields[0])
                            post_title = fields[5].strip("'")
                            post_content = fields[4].strip("'")
                            post_excerpt = fields[6].strip("'") if len(fields) > 6 else ""
                            post_date = fields[2].strip("'")
                            post_name = fields[11].strip("'")

                            # Unescape content
                            post_content = post_content.replace("\\'", "'").replace('\\"', '"')
                            post_content = post_content.replace("\\r\\n", "\n").replace("\\n", "\n")
                            post_content = post_content.replace("\\t", "\t")

                            post_title = post_title.replace("\\'", "'").replace('\\"', '"')

                            if not post_excerpt:
                                clean_excerpt = re.sub(r'<[^>]+>', '', post_content)
                                clean_excerpt = ' '.join(clean_excerpt.split())
                                post_excerpt = clean_excerpt[:200] + "..."
                            else:
                                post_excerpt = post_excerpt.replace("\\'", "'").replace('\\"', '"')

                            return {
                                'id': post_id,
                                'title': post_title,
                                'slug': post_name,
                                'content': post_content,
                                'excerpt': post_excerpt,
                                'publishedAt': post_date,
                                'author': '1',
                                'tags': []
                            }

    return None

print("=== Extracting Missing Blog Posts ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

original_count = len(blog_data['posts'])
found_count = 0

for slug in MISSING_SLUGS:
    print(f"Searching for: {slug}")
    post = extract_post_by_slug('data/wordpress/dmvcali2.sql', slug)

    if post:
        # Check if already exists
        if not any(p['id'] == post['id'] for p in blog_data['posts']):
            blog_data['posts'].append(post)
            found_count += 1
            print(f"  ✓ Found and added: {post['title']}")
            print(f"    Content length: {len(post['content'])} chars\n")
        else:
            print(f"  ⚠ Already exists: {post['title']}\n")
    else:
        print(f"  ✗ Not found in WordPress\n")

if found_count > 0:
    # Update total
    blog_data['total_posts'] = len(blog_data['posts'])

    # Save updated data
    with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
        json.dump(blog_data, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Added {found_count} missing posts")
    print(f"📊 Total posts: {original_count} → {len(blog_data['posts'])}")
    print("💾 Saved updated blog_posts.json")
else:
    print("\n⚠ No new posts were added")
