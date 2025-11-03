#!/usr/bin/env python3
import json
import re

data = json.load(open('src/data/blog_posts.json'))
post = next((p for p in data['posts'] if p['slug'] == 'safe-driving-tips-for-novice-drivers'), None)

if post:
    print('Title:', post['title'])
    print('ID:', post['id'])
    print('\nChecking images in content...')

    img_tags = re.findall(r'<img[^>]*src="([^"]+)"[^>]*>', post['content'])
    print(f'\nFound {len(img_tags)} images:')
    for i, img in enumerate(img_tags, 1):
        print(f'{i}. {img}')

    print('\n--- Full content preview (first 1000 chars) ---')
    print(post['content'][:1000])
else:
    print('Post not found')
