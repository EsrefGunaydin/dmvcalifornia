#!/usr/bin/env python3
"""
Merge full content with correct slugs
"""

import json

# Load the old file with correct slugs
with open('blog_posts.json', 'r', encoding='utf-8') as f:
    old_data = json.load(f)

# Load the new file with full content
with open('blog_posts_full.json', 'r', encoding='utf-8') as f:
    new_data = json.load(f)

# Create a mapping of ID -> full post from new data
new_posts_by_id = {p['id']: p for p in new_data['posts']}

# Merge: take slug from old, content from new
merged_posts = []

for old_post in old_data['posts']:
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
        print(f"✓ Merged: {merged_post['title'][:50]} ({len(merged_post['content'])} chars)")
    else:
        # Keep old post if not found in new data
        merged_posts.append(old_post)
        print(f"⚠ Kept old: {old_post['title'][:50]} (not in new data)")

# Add any new posts that weren't in the old data
old_ids = {p['id'] for p in old_data['posts']}
for new_post in new_data['posts']:
    if new_post['id'] not in old_ids:
        merged_posts.append(new_post)
        print(f"+ Added new: {new_post['title'][:50]}")

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

print(f"\n✅ Merged {len(merged_posts)} posts!")
print(f"💾 Saved to: blog_posts_merged.json")

# Stats
lengths = [len(p['content']) for p in merged_posts]
print(f"\n📊 Content Stats:")
print(f"   Average: {sum(lengths)//len(lengths)} chars")
print(f"   Shortest: {min(lengths)} chars")
print(f"   Longest: {max(lengths)} chars")
