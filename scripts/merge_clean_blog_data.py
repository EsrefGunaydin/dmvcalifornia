#!/usr/bin/env python3
"""
Merge full content with correct slugs, filtering out revisions
"""

import json

# Load the old file with correct slugs
with open('blog_posts.json', 'r', encoding='utf-8') as f:
    old_data = json.load(f)

# Load the new file with full content (no revisions)
with open('blog_posts_full.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

# Filter out revisions and autosaves from old data
old_posts_clean = [
    p for p in old_data['posts']
    if 'revision' not in p['slug'].lower() and 'autosave' not in p['slug'].lower()
]

print(f"📊 Original posts: {len(old_data['posts'])}")
print(f"✅ Clean posts (no revisions): {len(old_posts_clean)}")
print(f"✅ New extracted posts: {len(new_data['posts'])}\n")

# Create a mapping of ID -> full post from new data
new_posts_by_id = {p['id']: p for p in new_data['posts']}

# Merge: take slug from old, content from new
merged_posts = []

for old_post in old_posts_clean:
    post_id = old_post['id']

    if post_id in new_posts_by_id:
        new_post = new_posts_by_id[post_id]

        # Use the best of both
        merged_post = {
            'id': post_id,
            'title': new_post['title'],  # New title (more accurate)
            'slug': old_post['slug'],     # Old slug (correct)
            'content': new_post['content'], # NEW FULL CONTENT
            'excerpt': new_post['excerpt'] if new_post['excerpt'] else old_post['excerpt'],
            'publishedAt': old_post['publishedAt'],
            'author': old_post['author']
        }

        merged_posts.append(merged_post)
        print(f"✓ Merged: {merged_post['title'][:50]} → /{merged_post['slug']}")
    else:
        # Keep old post if not found in new data (but only if it has a valid slug)
        if old_post['slug'] and old_post['slug'].strip():
            merged_posts.append(old_post)
            print(f"⚠ Kept old: {old_post['title'][:50]} (not in new data)")

# Sort by ID
merged_posts.sort(key=lambda x: x['id'])

# Save merged data
output = {
    'extracted_at': new_data['extracted_at'],
    'total_posts': len(merged_posts),
    'featured_images': new_data['featured_images'],
    'posts': merged_posts
}

with open('blog_posts_merged.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"\n✅ Merged {len(merged_posts)} clean posts!")
print(f"💾 Saved to: blog_posts_merged.json")

# Stats
lengths = [len(p['content']) for p in merged_posts]
print(f"\n📊 Content Stats:")
print(f"   Average: {sum(lengths)//len(lengths)} chars")
print(f"   Shortest: {min(lengths)} chars")
print(f"   Longest: {max(lengths)} chars")

# Show some examples
print(f"\n📝 Sample posts:")
for post in merged_posts[:5]:
    print(f"   /{post['slug']} - {post['title'][:60]}")
