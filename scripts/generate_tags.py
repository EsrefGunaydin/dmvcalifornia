#!/usr/bin/env python3
"""
Generate relevant tags for blog posts based on titles and content
"""

import json
import re

# Define common DMV-related keywords and their associated tags
TAG_KEYWORDS = {
    'Driving Test': ['driver\'s license', 'driving test', 'behind the wheel', 'road test', 'driving exam'],
    'Written Test': ['written test', 'dmv test', 'permit test', 'knowledge test', 'practice test'],
    'Driver License': ['driver license', 'drivers license', 'dl', 'license renewal', 'license issue'],
    'DMV Appointments': ['dmv appointment', 'schedule', 'booking', 'wait time'],
    'Vehicle Registration': ['vehicle registration', 'car registration', 'registration renewal', 'smog check'],
    'Traffic Laws': ['traffic law', 'traffic rule', 'california vehicle code', 'violation'],
    'Real ID': ['real id', 'realid', 'federal id'],
    'Senior Drivers': ['senior', 'elderly', 'older driver'],
    'Teen Drivers': ['teen', 'teenage', 'young driver', 'minor', 'under 18'],
    'Commercial License': ['cdl', 'commercial license', 'truck driver'],
    'Motorcycle': ['motorcycle', 'motorbike', 'bike license'],
    'DMV Forms': ['form', 'application', 'document'],
    'Fees': ['fee', 'cost', 'price', 'payment'],
    'Traffic Tickets': ['ticket', 'citation', 'fine', 'traffic violation'],
    'Insurance': ['insurance', 'sr-22', 'sr22'],
    'Car Accidents': ['accident', 'crash', 'collision'],
    'Tips': ['tip', 'advice', 'guide', 'how to'],
    'ID Card': ['id card', 'identification card', 'state id'],
    'Out of State': ['out of state', 'moving to california', 'transfer'],
}

print("=== Generating Tags for Blog Posts ===\n")

# Load blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Generate tags for each post
for post in blog_data['posts']:
    tags = set()

    # Combine title and excerpt for analysis
    text = (post['title'] + ' ' + post.get('excerpt', '')).lower()

    # Check for each tag keyword
    for tag, keywords in TAG_KEYWORDS.items():
        for keyword in keywords:
            if keyword.lower() in text:
                tags.add(tag)
                break

    # Add at least a generic tag if no specific tags found
    if not tags:
        if 'dmv' in text:
            tags.add('DMV Guide')
        elif 'california' in text:
            tags.add('California DMV')
        else:
            tags.add('DMV Information')

    # Convert to sorted list
    post['tags'] = sorted(list(tags))

    print(f"✓ {post['title'][:60]}")
    print(f"  Tags: {', '.join(post['tags'])}")
    print()

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Generated tags for all {len(blog_data['posts'])} posts")
print("💾 Saved updated blog_posts.json")

# Show tag statistics
all_tags = {}
for post in blog_data['posts']:
    for tag in post.get('tags', []):
        all_tags[tag] = all_tags.get(tag, 0) + 1

print(f"\n📊 Tag distribution ({len(all_tags)} unique tags):")
for tag, count in sorted(all_tags.items(), key=lambda x: x[1], reverse=True):
    print(f"   • {tag}: {count} posts")
