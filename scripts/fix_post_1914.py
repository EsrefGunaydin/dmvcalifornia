#!/usr/bin/env python3
"""
Fix post 1914 that was truncated during extraction
"""

import re
import json

def extract_post_1914(sql_file):
    """Extract post 1914 specifically"""

    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if line.startswith('(1914,'):
                record = line.strip().lstrip('(').rstrip('),')

                # Parse fields
                parts = []
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
                        parts.append(current.strip())
                        current = ""
                        continue

                    current += char

                if current:
                    parts.append(current.strip())

                # Extract fields
                post_id = int(parts[0])
                post_date = parts[2].strip("'")
                post_content = parts[4].strip("'")
                post_title = parts[5].strip("'")
                post_excerpt = parts[6].strip("'") if len(parts) > 6 else ""
                post_name = parts[12].strip("'") if len(parts) > 12 else f"post-{post_id}"

                # Unescape content
                post_content = post_content.replace("\\'", "'").replace('\\"', '"')
                post_content = post_content.replace("\\r\\n", "\n").replace("\\n", "\n")
                post_content = post_content.replace("\\t", "\t")

                # Unescape title
                post_title = post_title.replace("\\'", "'").replace('\\"', '"')

                # Generate excerpt if empty
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
                    'author': '1'
                }

    return None

# Extract the post
print("Extracting post 1914...")
post = extract_post_1914('data/wordpress/dmvcali2.sql')

if post:
    print(f"✅ Extracted post 1914:")
    print(f"   Title: {post['title']}")
    print(f"   Slug: {post['slug']}")
    print(f"   Content length: {len(post['content'])} chars")
    print(f"   Excerpt: {post['excerpt'][:100]}...")

    # Load existing blog data
    with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
        blog_data = json.load(f)

    # Find and replace post 1914
    for i, p in enumerate(blog_data['posts']):
        if p['id'] == 1914:
            blog_data['posts'][i] = post
            print(f"\n✅ Updated post 1914 in blog_posts.json")
            break

    # Save updated data
    with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
        json.dump(blog_data, f, indent=2, ensure_ascii=False)

    print("💾 Saved updated blog_posts.json")
else:
    print("❌ Could not find post 1914")
