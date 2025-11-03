#!/usr/bin/env python3
"""
WordPress URL Mapper
Extracts all URLs from wp_posts for SEO preservation
"""

import re
import json
from datetime import datetime
from collections import defaultdict

def extract_posts_and_pages(sql_content):
    """Extract all posts and pages with their URLs"""
    posts = []
    pages = []

    # Find wp_posts INSERT section
    posts_pattern = r"INSERT INTO `wp_posts`.*?VALUES\s*(.*?)(?=\n-- |INSERT INTO `wp_postsread|CREATE TABLE|$)"
    match = re.search(posts_pattern, sql_content, re.DOTALL)

    if not match:
        print("⚠️  Could not find wp_posts data")
        return posts, pages

    values_section = match.group(1)

    # Parse individual post records
    # Format: (ID, post_author, 'post_date', 'post_date_gmt', 'post_content', 'post_title', 'post_excerpt', 'post_status', ...)
    # Field 12 is post_name (slug)
    # Field 21 is post_type

    # Split by records - look for patterns like (160, 1, '2017-09-18 ...
    record_pattern = r"\((\d+),\s*\d+,\s*'([^']*)',\s*'([^']*)',.*?'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',.*?'([^']*)',.*?'([^']*)'"

    for match in re.finditer(record_pattern, values_section):
        try:
            post_id = int(match.group(1))
            post_date = match.group(2)
            post_title = match.group(5) if len(match.groups()) >= 5 else ''
            post_status = match.group(8) if len(match.groups()) >= 8 else ''
            post_name = match.group(9) if len(match.groups()) >= 9 else ''  # slug

            # Try to extract post_type (field 21) - this is tricky
            # For now, infer from context

            if post_status == 'publish' and post_name:
                post_data = {
                    'id': post_id,
                    'title': post_title[:100],  # Truncate for display
                    'slug': post_name,
                    'date': post_date,
                    'status': post_status
                }

                # Infer type from slug patterns
                if '-revision' in post_name or post_name.isdigit():
                    continue  # Skip revisions

                posts.append(post_data)

        except Exception as e:
            continue

    return posts, pages

def analyze_url_patterns(posts):
    """Analyze URL structure and patterns"""
    patterns = defaultdict(list)

    for post in posts:
        slug = post['slug']
        date = post['date']

        try:
            year = date[:4]
            month = date[5:7]

            # Common WordPress URL patterns:
            # 1. /%postname%/
            # 2. /%year%/%monthnum%/%postname%/
            # 3. /%category%/%postname%/

            # For now, collect by pattern type
            if slug:
                patterns['simple'].append(f"/{slug}")
                patterns['dated'].append(f"/{year}/{month}/{slug}")

        except:
            continue

    return patterns

def main():
    print("=" * 60)
    print("WordPress URL Mapper")
    print("=" * 60)

    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"\n📂 Reading: {sql_file}\n")

    try:
        with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()

        print("📊 Extracting posts and pages...")
        posts, pages = extract_posts_and_pages(sql_content)

        print(f"   Found {len(posts)} published posts/pages\n")

        # Analyze URL patterns
        print("🔗 Analyzing URL patterns...")
        patterns = analyze_url_patterns(posts)

        print(f"   Simple URLs: {len(patterns['simple'])}")
        print(f"   Date-based URLs: {len(patterns['dated'])}\n")

        # Sample URLs
        print("📝 Sample URLs (first 20):")
        for url in patterns['simple'][:20]:
            print(f"   {url}")

        # Save to JSON
        output = {
            'extracted_at': datetime.now().isoformat(),
            'total_posts': len(posts),
            'total_pages': len(pages),
            'posts': posts[:100],  # First 100 for review
            'url_patterns': {
                'simple': patterns['simple'][:50],
                'dated': patterns['dated'][:50]
            },
            'all_slugs': [p['slug'] for p in posts]
        }

        output_file = 'extracted_urls.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"\n✅ URL mapping complete!")
        print(f"   Saved to: {output_file}")
        print(f"   Total URLs: {len(posts)}")

        # Create redirect map for Next.js
        redirects = []
        for post in posts:
            slug = post['slug']
            if slug and slug not in ['news', 'home']:
                redirects.append({
                    'source': f"/{slug}",
                    'destination': f"/{slug}",  # Preserve same URL
                    'permanent': True
                })

        redirect_file = 'url_redirects.json'
        with open(redirect_file, 'w', encoding='utf-8') as f:
            json.dump(redirects, f, indent=2)

        print(f"   Redirects: {redirect_file}")

        print("\n" + "=" * 60)
        print("✅ Ready for Next.js routing configuration!")
        print("=" * 60)

    except FileNotFoundError:
        print(f"❌ Error: Could not find {sql_file}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
