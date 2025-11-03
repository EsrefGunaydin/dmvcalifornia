#!/usr/bin/env python3
"""
Extract real blog posts from wp_posts table
"""

import re
import json
import html
from datetime import datetime

def clean_html(text):
    """Remove HTML tags and clean text"""
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # Decode HTML entities
    text = html.unescape(text)
    # Clean up whitespace
    text = ' '.join(text.split())
    return text

def extract_posts_from_sql(sql_content):
    """Extract actual published posts from wp_posts"""
    posts = []

    # Find the wp_posts INSERT section
    posts_pattern = r"INSERT INTO `wp_posts`.*?VALUES\s*(.*?)(?=\n-- |\nCREATE TABLE `wp_postsread|$)"
    match = re.search(posts_pattern, sql_content, re.DOTALL)

    if not match:
        print("Could not find wp_posts section")
        return posts

    values_section = match.group(1)

    # Split into individual records - each record starts with (ID,
    # We'll look for publish status and post type

    # More precise pattern to match post records
    # Fields: ID, author, date, date_gmt, content, title, excerpt, status, comment_status, ping_status, password, name (slug)
    record_pattern = r"\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*'((?:[^'\\]|\\.)*)'"

    for match in re.finditer(record_pattern, values_section):
        try:
            post_id = int(match.group(1))
            post_author = match.group(2)
            post_date = match.group(3)
            post_date_gmt = match.group(4)
            post_content_start = match.group(5)

            # Get the full record text starting from this ID
            record_start = match.start()
            # Find the end of this record (next record or end)
            next_record = re.search(r'\),\s*\(', values_section[record_start:])
            if next_record:
                record_text = values_section[record_start:record_start + next_record.start() + 1]
            else:
                record_text = values_section[record_start:]

            # Extract fields from the full record
            # Look for post_status = 'publish'
            if "'publish'" in record_text:
                # Extract title - comes after content
                title_match = re.search(r"'([^']*)',\s*'[^']*',\s*'publish'", record_text)
                if not title_match:
                    continue

                title = title_match.group(1)

                # Extract slug (post_name) - field 12
                slug_match = re.search(r"'',\s*'([^']*)',\s*'',\s*''", record_text)
                slug = slug_match.group(1) if slug_match else f"post-{post_id}"

                # Extract post_type - look for 'post' or 'page'
                type_match = re.search(r"'(post|page)',\s*''", record_text)
                if not type_match or type_match.group(1) != 'post':
                    continue  # Skip if not a post

                # Extract content (simplified - just get first part)
                content_match = re.search(r"'([^']{100,}?)'", record_text)
                content = content_match.group(1) if content_match else post_content_start

                # Clean content
                content = content.replace("\\'", "'").replace("\\r\\n", "\n").replace("\\n", "\n")
                excerpt = clean_html(content)[:200] + "..." if len(content) > 200 else clean_html(content)

                post_data = {
                    'id': post_id,
                    'title': title,
                    'slug': slug,
                    'content': content[:500],  # First 500 chars
                    'excerpt': excerpt,
                    'publishedAt': post_date,
                    'author': post_author
                }

                posts.append(post_data)
                print(f"✓ Found: {title[:50]}")

        except Exception as e:
            continue

    return posts

def main():
    print("=" * 60)
    print("WordPress Blog Post Extractor")
    print("=" * 60)

    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"\n📂 Reading: {sql_file}\n")

    try:
        with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()

        print("📊 Extracting published posts...\n")
        posts = extract_posts_from_sql(sql_content)

        print(f"\n✅ Found {len(posts)} published blog posts!\n")

        # Save to JSON
        output = {
            'extracted_at': datetime.now().isoformat(),
            'total_posts': len(posts),
            'posts': posts
        }

        output_file = 'blog_posts.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"💾 Saved to: {output_file}")

        # Show summary
        print("\n" + "=" * 60)
        print("Blog Posts Summary:")
        print("=" * 60)
        for post in posts[:10]:
            print(f"\n📝 {post['title']}")
            print(f"   Slug: /{post['slug']}")
            print(f"   Date: {post['publishedAt']}")
            print(f"   Excerpt: {post['excerpt'][:80]}...")

        if len(posts) > 10:
            print(f"\n... and {len(posts) - 10} more posts")

    except FileNotFoundError:
        print(f"❌ Error: Could not find {sql_file}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
