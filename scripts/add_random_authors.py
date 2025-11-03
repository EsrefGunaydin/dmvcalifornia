#!/usr/bin/env python3
"""
Add random author names to blog posts
"""

import json
import random

# List of fake author names
AUTHORS = [
    "Sarah Mitchell",
    "David Chen",
    "Jennifer Rodriguez",
    "Michael Anderson",
    "Lisa Thompson",
    "Robert Johnson"
]

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Assign random authors to each post
for post in blog_data['posts']:
    post['author'] = random.choice(AUTHORS)

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

# Show stats
author_counts = {}
for post in blog_data['posts']:
    author = post['author']
    author_counts[author] = author_counts.get(author, 0) + 1

print("✅ Added random authors to all blog posts!")
print(f"\n📊 Author distribution:")
for author, count in sorted(author_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"   {author}: {count} posts")

print(f"\n💾 Saved updated blog_posts.json")
