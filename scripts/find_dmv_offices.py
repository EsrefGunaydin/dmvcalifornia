#!/usr/bin/env python3
"""
Find all DMV office pages in WordPress
"""

import re

print("=== Finding DMV Office Pages ===\n")

# Look for posts with dmv-related slugs
with open('data/wordpress/dmvcali2.sql', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        # Look for INSERT INTO wp_posts
        if "INSERT INTO `wp_posts`" in line:
            # Find all records that might be DMV offices
            # Match patterns like (id, ..., 'dmv-something', ...)
            matches = re.findall(r"\((\d+),[^,]*,[^,]*,[^,]*,'([^']*)',[^,]*'([^']*)'[^,]*'(page|post)',[^,]*'publish'[^)]*'([^']*)'[^)]*\)", line)

            for match in matches:
                post_id, title, excerpt, post_type, post_name = match
                # Look for DMV office patterns
                if ('dmv' in post_name.lower() or 'dmv' in title.lower()) and 'office' not in post_name:
                    if not any(x in post_name for x in ['revision', 'autosave', 'test']):
                        print(f"ID: {post_id}")
                        print(f"  Title: {title}")
                        print(f"  Slug: {post_name}")
                        print(f"  Type: {post_type}")
                        print()

print("\n=== Also checking for 'dmv-offices' page ===\n")

# Look for the main directory page
with open('data/wordpress/dmvcali2.sql', 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if "dmv-offices" in line and "INSERT INTO `wp_posts`" in line:
            # Extract the record
            matches = re.findall(r"\((\d+),[^,]*,[^,]*,[^,]*,'([^']*)'", line)
            for match in matches[:5]:
                print(f"ID: {match[0]}, Title: {match[1]}")
