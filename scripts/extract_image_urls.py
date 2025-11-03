#!/usr/bin/env python3
"""
Extract featured image URLs from WordPress database
"""

import re
import json

def extract_attachment_urls(sql_content, attachment_ids):
    """Extract image URLs for specific attachment IDs from wp_posts"""
    image_urls = {}

    # Find wp_posts section
    posts_pattern = r"INSERT INTO `wp_posts`.*?VALUES\s*(.*?)(?=\n(?:--|CREATE|INSERT INTO `(?!wp_posts)))"
    match = re.search(posts_pattern, sql_content, re.DOTALL | re.IGNORECASE)

    if not match:
        print("Could not find wp_posts section")
        return image_urls

    values_section = match.group(1)
    records = re.split(r'\),\s*\(', values_section)

    print(f"Looking for {len(attachment_ids)} image attachments...")

    for record in records:
        try:
            record = record.strip().lstrip('(').rstrip(')')

            # Check if this is an attachment post type
            if "'attachment'" not in record:
                continue

            # Extract ID
            id_match = re.match(r'(\d+),', record)
            if not id_match:
                continue

            post_id = int(id_match.group(1))

            # Only process if this is one of our featured images
            if post_id not in attachment_ids:
                continue

            # Split by fields
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

            if len(parts) < 12:
                continue

            # Field 12 is post_name (slug), we need guid (URL) which is field 11
            guid = parts[10].strip("'") if len(parts) > 10 else ""

            if guid and (guid.startswith('http') or guid.startswith('//')):
                image_urls[post_id] = guid
                print(f"✓ Found image {post_id}: {guid[:80]}")

        except Exception as e:
            continue

    return image_urls

def main():
    print("=" * 70)
    print("WordPress Featured Image URL Extractor")
    print("=" * 70)

    # Load merged blog data with featured_images mapping
    with open('blog_posts_merged.json', 'r', encoding='utf-8') as f:
        blog_data = json.load(f)

    featured_images = blog_data.get('featured_images', {})

    # Get unique attachment IDs
    attachment_ids = set(featured_images.values())

    print(f"\n📸 Found {len(featured_images)} posts with featured images")
    print(f"📸 Need to extract {len(attachment_ids)} unique image URLs\n")

    # Load WordPress SQL
    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"📂 Reading: {sql_file}\n")

    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        sql_content = f.read()

    # Extract image URLs
    image_urls = extract_attachment_urls(sql_content, attachment_ids)

    print(f"\n✅ Extracted {len(image_urls)} image URLs")

    # Create post_id -> image_url mapping
    post_images = {}
    for post_id_str, attachment_id in featured_images.items():
        post_id = int(post_id_str)
        if attachment_id in image_urls:
            post_images[post_id] = image_urls[attachment_id]

    print(f"✅ Mapped {len(post_images)} posts to their featured images")

    # Update blog data with image URLs
    for post in blog_data['posts']:
        post_id = post['id']
        if post_id in post_images:
            post['featuredImage'] = post_images[post_id]

    # Save updated data
    with open('blog_posts_with_images.json', 'w', encoding='utf-8') as f:
        json.dump(blog_data, f, indent=2, ensure_ascii=False)

    print(f"\n💾 Saved to: blog_posts_with_images.json")

    # Show some examples
    print("\n" + "=" * 70)
    print("Sample Posts with Images:")
    print("=" * 70)

    count = 0
    for post in blog_data['posts']:
        if 'featuredImage' in post:
            print(f"\n📝 {post['title'][:50]}")
            print(f"   🖼️  {post['featuredImage'][:70]}...")
            count += 1
            if count >= 5:
                break

    if len(post_images) > 5:
        print(f"\n... and {len(post_images) - 5} more posts with images")

if __name__ == "__main__":
    main()
