#!/usr/bin/env python3
"""
Remove broken Pixabay images from posts
"""

import json
import re

# Load blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Fix each post with broken images
fixed_count = 0
for post in blog_data['posts']:
    if 'pixabay.com/get/' in post['content']:
        original_content = post['content']

        # Remove img tags with pixabay.com/get/ URLs
        # Match <img> tags with pixabay URLs
        post['content'] = re.sub(
            r'<img[^>]*src="https?://pixabay\.com/get/[^"]*"[^>]*>',
            '',
            post['content']
        )

        # Remove empty figure tags that might be left
        post['content'] = re.sub(r'<figure[^>]*>\s*</figure>', '', post['content'])

        # Remove empty paragraphs
        post['content'] = re.sub(r'<p>\s*</p>', '', post['content'])

        if original_content != post['content']:
            print(f'✓ Fixed: {post["title"]}')
            print(f'  Removed broken Pixabay images')
            fixed_count += 1

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f'\n✅ Fixed {fixed_count} post(s) with broken images')
print('💾 Saved updated blog_posts.json')
