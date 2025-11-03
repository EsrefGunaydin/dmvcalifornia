#!/usr/bin/env python3
"""
Re-extract truncated posts that have very short content
"""

import re
import json

def extract_post(sql_file, post_id):
    """Extract a specific post from SQL"""
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            if line.startswith(f'({post_id},'):
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

                if len(parts) < 13:
                    return None

                # Extract fields
                post_id_val = int(parts[0])
                post_date = parts[2].strip("'")
                post_content = parts[4].strip("'")
                post_title = parts[5].strip("'")
                post_excerpt = parts[6].strip("'") if len(parts) > 6 else ""
                post_name = parts[12].strip("'") if len(parts) > 12 else f"post-{post_id_val}"

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
                    'id': post_id_val,
                    'title': post_title,
                    'slug': post_name,
                    'content': post_content,
                    'excerpt': post_excerpt,
                    'publishedAt': post_date,
                    'author': '1'
                }

    return None

# IDs of truncated posts
truncated_ids = [354, 369, 460, 1335, 2610, 2926]

print("=== Fixing Truncated Posts ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Re-extract each truncated post
fixed_count = 0
for post_id in truncated_ids:
    print(f"Extracting post {post_id}...")
    post = extract_post('data/wordpress/dmvcali2.sql', post_id)

    if post:
        # Find and replace in blog data
        for i, p in enumerate(blog_data['posts']):
            if p['id'] == post_id:
                old_length = len(p['content'])
                blog_data['posts'][i] = post
                print(f"  ✅ Updated post {post_id}: {post['title'][:50]}")
                print(f"     Content: {old_length} → {len(post['content'])} chars")
                fixed_count += 1
                break
    else:
        print(f"  ❌ Could not find post {post_id}")

    print()

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"✅ Fixed {fixed_count} out of {len(truncated_ids)} truncated posts")
print("💾 Saved updated blog_posts.json")
