#!/usr/bin/env python3
"""
Extract complete blog posts from WordPress database with full content and images
"""

import re
import json
import html
from datetime import datetime

def clean_html_for_excerpt(text):
    """Remove HTML tags and clean text for excerpt"""
    text = re.sub(r'<[^>]+>', '', text)
    text = html.unescape(text)
    text = ' '.join(text.split())
    return text

def extract_posts_from_sql(sql_content):
    """Extract complete published posts from wp_posts"""
    posts = []

    # Find the wp_posts INSERT section
    posts_pattern = r"INSERT INTO `wp_posts`.*?VALUES\s*(.*?)(?=\n(?:--|CREATE|INSERT INTO `(?!wp_posts)))"
    match = re.search(posts_pattern, sql_content, re.DOTALL | re.IGNORECASE)

    if not match:
        print("Could not find wp_posts section")
        return posts

    values_section = match.group(1)

    # Split by record boundaries - find opening parenthesis at start of line or after comma
    # Each record is like: (ID, author, date, date_gmt, content, title, ...)
    records = re.split(r'\),\s*\(', values_section)

    print(f"Found {len(records)} total records in wp_posts")

    for i, record in enumerate(records):
        try:
            # Clean up the record
            record = record.strip().lstrip('(').rstrip(')')

            # Skip if too short
            if len(record) < 100:
                continue

            # Check if this is a published post
            if "'publish'" not in record or "'post'" not in record:
                continue

            # Extract ID (first field)
            id_match = re.match(r'(\d+),', record)
            if not id_match:
                continue
            post_id = int(id_match.group(1))

            # Split by fields more carefully - need to handle escaped quotes
            # WordPress structure: ID, author, date, date_gmt, content, title, excerpt, status, ...

            # Extract key fields using more robust pattern
            # Field positions in wp_posts:
            # 0: ID, 1: post_author, 2: post_date, 3: post_date_gmt, 4: post_content, 5: post_title

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

            if len(parts) < 20:  # wp_posts has about 23 fields
                continue

            # Extract fields
            post_author = parts[1].strip("'")
            post_date = parts[2].strip("'")
            post_content = parts[4].strip("'")
            post_title = parts[5].strip("'")
            post_excerpt = parts[6].strip("'") if len(parts) > 6 else ""
            post_name = parts[12].strip("'") if len(parts) > 12 else f"post-{post_id}"  # slug

            # Skip WordPress revisions and autosaves
            if 'revision' in post_name.lower() or 'autosave' in post_name.lower():
                continue

            # Unescape content
            post_content = post_content.replace("\\'", "'").replace('\\"', '"')
            post_content = post_content.replace("\\r\\n", "\n").replace("\\n", "\n")
            post_content = post_content.replace("\\t", "\t")

            # Unescape title
            post_title = post_title.replace("\\'", "'").replace('\\"', '"')

            # Generate excerpt if empty
            if not post_excerpt:
                post_excerpt = clean_html_for_excerpt(post_content)[:200] + "..."
            else:
                post_excerpt = post_excerpt.replace("\\'", "'").replace('\\"', '"')

            post_data = {
                'id': post_id,
                'title': post_title,
                'slug': post_name,
                'content': post_content,  # FULL CONTENT
                'excerpt': post_excerpt,
                'publishedAt': post_date,
                'author': post_author
            }

            posts.append(post_data)
            print(f"✓ [{len(posts)}] {post_title[:60]} ({len(post_content)} chars)")

        except Exception as e:
            # Silently continue - some records may be malformed
            continue

    return posts

def extract_featured_images(sql_content):
    """Extract featured image mappings from wp_postmeta"""
    featured_images = {}

    # Find wp_postmeta section
    meta_pattern = r"INSERT INTO `wp_postmeta`.*?VALUES\s*(.*?)(?=\n(?:--|CREATE|INSERT INTO `(?!wp_postmeta)))"
    match = re.search(meta_pattern, sql_content, re.DOTALL | re.IGNORECASE)

    if not match:
        print("Could not find wp_postmeta section")
        return featured_images

    values_section = match.group(1)

    # Look for _thumbnail_id meta keys
    # Format: (meta_id, post_id, meta_key, meta_value)
    thumbnail_pattern = r"\((\d+),\s*(\d+),\s*'_thumbnail_id',\s*'(\d+)'\)"

    for match in re.finditer(thumbnail_pattern, values_section):
        post_id = int(match.group(2))
        attachment_id = int(match.group(3))
        featured_images[post_id] = attachment_id

    print(f"\n📸 Found {len(featured_images)} featured images")
    return featured_images

def main():
    print("=" * 70)
    print("WordPress FULL Blog Post Extractor (with images)")
    print("=" * 70)

    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"\n📂 Reading: {sql_file}\n")

    try:
        with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()

        print("📊 Extracting published posts with FULL content...\n")
        posts = extract_posts_from_sql(sql_content)

        print("\n📸 Extracting featured images...")
        featured_images = extract_featured_images(sql_content)

        print(f"\n✅ Successfully extracted {len(posts)} complete blog posts!\n")

        # Save to JSON
        output = {
            'extracted_at': datetime.now().isoformat(),
            'total_posts': len(posts),
            'featured_images': featured_images,
            'posts': posts
        }

        output_file = 'blog_posts_full.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"💾 Saved to: {output_file}")

        # Show summary
        print("\n" + "=" * 70)
        print("Blog Posts Summary:")
        print("=" * 70)
        for post in posts[:5]:
            print(f"\n📝 {post['title']}")
            print(f"   Slug: /{post['slug']}")
            print(f"   Date: {post['publishedAt']}")
            print(f"   Content length: {len(post['content'])} chars")
            print(f"   Excerpt: {post['excerpt'][:100]}...")

        if len(posts) > 5:
            print(f"\n... and {len(posts) - 5} more posts")

        # Show content length stats
        lengths = [len(p['content']) for p in posts]
        print(f"\n📊 Content Stats:")
        print(f"   Average: {sum(lengths)//len(lengths)} chars")
        print(f"   Shortest: {min(lengths)} chars")
        print(f"   Longest: {max(lengths)} chars")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {sql_file}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
