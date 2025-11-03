#!/usr/bin/env python3
"""
Manually add the 2 missing posts that weren't in WordPress extraction
"""

import json
import random

# Random author names we're using
AUTHORS = [
    "Sarah Mitchell",
    "David Chen",
    "Jennifer Rodriguez",
    "Michael Anderson",
    "Lisa Thompson",
    "Robert Johnson"
]

# Missing posts content
missing_posts = [
    {
        'id': 9001,  # Use high ID to avoid conflicts
        'title': 'California Drivers 101: How To Drive Safely And Avoid Fines',
        'slug': 'how-to-drive-safely-and-avoid-fines',
        'content': '''<h2>Overview of California Driving Laws</h2>
<p>California enforces strict driving regulations through the Department of Motor Vehicles. Key requirements include:</p>
<ul>
<li>Valid driver's license required</li>
<li>Obedience to traffic signs and signals</li>
<li>Right-of-way yielding to pedestrians and cyclists</li>
<li>Speed limit compliance</li>
<li>No driving under influence of alcohol or drugs</li>
<li>Mandatory seatbelts for all passengers</li>
<li>Children under 8 must use approved safety seats</li>
</ul>

<h2>Safety Driving Tips</h2>
<p>Follow these strategies for safe driving in California:</p>
<p><strong>Speed Limits:</strong> Always obey posted speed limits. Speeding is one of the leading causes of accidents on California roads.</p>
<p><strong>Following Distance:</strong> Maintain substantial space between your vehicle and others to ensure adequate reaction time.</p>
<p><strong>Awareness:</strong> Stay alert to other vehicles, pedestrians, and cyclists, especially near schools and residential areas.</p>
<p><strong>Distraction Avoidance:</strong> Keep your full attention on the road at all times. Avoid using your phone while driving.</p>

<h2>Common Traffic Violations and Fines</h2>
<p>Understanding California traffic fines can help you drive more carefully:</p>
<ul>
<li><strong>Speeding:</strong> Fines starting at $35 (over $200 for exceeding 100 mph)</li>
<li><strong>Red light violations:</strong> $100 fine</li>
<li><strong>Driving uninsured:</strong> $200 base fine</li>
<li><strong>DUI:</strong> Minimum $1,000 fine</li>
<li><strong>Not using turn signals:</strong> Up to $250</li>
<li><strong>Failing to yield to pedestrians:</strong> Up to $250</li>
</ul>

<h2>Additional Regulations</h2>
<p>Cell phone use while driving is prohibited in California. Drivers under 18 cannot use phones at all while operating a vehicle.</p>
<p>The maximum highway speed limit is 65 mph, though some areas may have lower limits.</p>
<p>Right turns on red are allowed after complete stops, unless posted otherwise.</p>''',
        'excerpt': 'Learn how to drive safely in California and avoid costly traffic fines. Understand key driving laws, safety tips, and common traffic violations with their associated penalties.',
        'publishedAt': '2023-02-14T00:00:00Z',
        'author': random.choice(AUTHORS),
        'tags': ['Driver License', 'Tips', 'Traffic Laws']
    },
    {
        'id': 9002,
        'title': 'DMV Change of Address Online: A Step-by-Step Guide',
        'slug': 'how-to-update-your-address-with-the-dmv',
        'content': '''<h2>Why Address Updates Matter</h2>
<p>Keeping your DMV address current is crucial for several reasons. It ensures you receive important documents like driver's licenses and registration cards on time. It also helps you maintain legal compliance, as many jurisdictions require address notifications within specific timeframes after relocation.</p>

<h2>How to Update Your Address with California DMV</h2>
<p>The California DMV makes it easy to update your address online using the MyDMV portal. Follow these four simple steps:</p>

<h3>Step 1: Account Access</h3>
<p>Log into your MyDMV account or create a new one if you haven't already. You'll need your driver's license number and other identification information.</p>

<h3>Step 2: Driver's License Update</h3>
<p>Once logged in, click "Start Address Change" and follow the prompts to enter your new address information carefully. Submit the changes and print your confirmation document for your records.</p>

<h3>Step 3: Vehicle Registration Update</h3>
<p>Access the vehicle/vessel section of your MyDMV account to update your address for up to three vehicles simultaneously. This is particularly convenient for multi-car households.</p>

<h3>Step 4: Status Verification</h3>
<p>Check back after three business days to confirm that your address change has been processed successfully. You'll receive updated documents by mail at your new address.</p>

<h2>Important Notes</h2>
<p>While you need to complete separate sections for driver's licenses and vehicle registrations, this separation ensures thoroughness and compliance with DMV requirements.</p>
<p>The online system makes address updates accessible and manageable for most users, though the process may seem cumbersome at first.</p>

<h2>Alternative Methods</h2>
<p>If you prefer not to use the online system, you can also update your address by:</p>
<ul>
<li>Visiting a local DMV office in person</li>
<li>Calling the DMV customer service line</li>
<li>Mailing a written notification to your local DMV office</li>
</ul>''',
        'excerpt': 'Complete guide to updating your address with the California DMV online. Learn the simple four-step process using MyDMV portal to update your driver\'s license and vehicle registration.',
        'publishedAt': '2023-08-13T00:00:00Z',
        'author': random.choice(AUTHORS),
        'tags': ['DMV Forms', 'Driver License', 'Tips']
    }
]

print("=== Adding Missing Blog Posts ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

original_count = len(blog_data['posts'])

for post in missing_posts:
    # Check if already exists
    if not any(p['slug'] == post['slug'] for p in blog_data['posts']):
        blog_data['posts'].append(post)
        print(f"✓ Added: {post['title']}")
        print(f"  Slug: /{post['slug']}")
        print(f"  Author: {post['author']}")
        print(f"  Tags: {', '.join(post['tags'])}\n")
    else:
        print(f"⚠ Already exists: {post['title']}\n")

# Update total
blog_data['total_posts'] = len(blog_data['posts'])

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"✅ Total posts: {original_count} → {len(blog_data['posts'])}")
print("💾 Saved updated blog_posts.json")
