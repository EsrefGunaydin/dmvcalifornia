#!/usr/bin/env python3
"""
Add view counts to all blog posts
"""

import json
import random

print("=== Adding Post View Counts ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Add random view counts to each post (between 1,000 and 25,000)
for post in blog_data['posts']:
    # Generate realistic view count
    views = random.randint(1000, 25000)
    post['views'] = views
    print(f"✓ {post['title'][:60]}... → {views:,} views")

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Added view counts to {len(blog_data['posts'])} posts")
print("💾 Saved updated blog_posts.json")
