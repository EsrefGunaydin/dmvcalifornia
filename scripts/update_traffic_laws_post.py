#!/usr/bin/env python3
"""
Add additional content to the traffic laws post
"""

import json

additional_content = '''
<h2>Other Notable Changes Affecting Drivers</h2>
<p>In addition to the topics above, a few other 2025 legal changes will impact California drivers' responsibilities and wallets:</p>

<p><strong>Higher minimum insurance coverage:</strong> California has raised the mandatory minimum auto liability insurance limits for the first time in decades. Starting January 1, 2025, drivers must carry at least $30,000 coverage for a single injury or death (up from $15,000), $60,000 per accident for multiple injuries/deaths (up from $30,000), and $15,000 for property damage (up from $5,000). This change (SB 1107) essentially doubles the required insurance protection. It means premiums may increase for those who previously had only the old minimum, but more coverage will be available to victims in the event of a crash. Drivers should check their insurance policy and ensure it meets the new 30/60/15 minimums to avoid penalties or personal liability.</p>

<p><strong>License plate obstruction ban:</strong> Drivers using spray-on coatings or covers to thwart toll or red-light cameras should note that a new law explicitly prohibits altering or obscuring your license plate's reflective coating. Assembly Bill 2111 was passed to crack down on toll evasion and ghost plates. Any device or method that makes your license plate harder to read (to any camera or entity) is illegal. This includes tinted plate covers or films that reflect flash. You could be cited if a plate is intentionally defaced to hinder identification. Keep your plates clear and legible.</p>

<p><strong>Grace period for expired registration:</strong> As of mid-2024 (and continuing in 2025), California now gives drivers a bit of leeway if they're late in renewing their vehicle registration. Assembly Bill 256 created a 60-day grace period during which police cannot ticket solely for an expired registration sticker. From July 1, 2024, until Jan 1, 2030, if your tags just expired, you have up to two months to get them renewed without fear of an immediate fix-it ticket or stop for that alone. Important: This doesn't mean you can drive an unregistered vehicle indefinitely – you still owe the fees, and after 60 days, you can be cited. Also, an officer may still notice the expired tag if you commit another violation. The intent is to reduce minor traffic stops and give drivers a reasonable window to handle registration delays. Drivers should use this grace period to comply, not as an excuse to ignore registration.</p>

<p><strong>Other laws:</strong> California passed numerous laws (from employment-related driving rules to rules for autonomous vehicles and even a requirement for schools to teach about DUI prevention). For instance, schools will be adding curriculum about the dangers of drunk driving (inspired by a legislator's own DUI incident). While these don't directly change day-to-day driving rules, they underscore the state's focus on traffic safety education in the long run.</p>

<h2>Summary</h2>
<p>In summary, California's 2025 traffic laws strongly emphasize safety: slower, more careful driving and greater accountability. Drivers should be prepared for automated speed enforcement in big cities, put their phones away whenever driving, and avoid impaired driving, given the stiffer DUI punishments. At intersections, give pedestrians plenty of space and visibility, and don't park too close to crosswalks. Stay courteous with buses and cautious around street racers (who face new crackdowns). Also, check your insurance and vehicle paperwork to meet the new requirements. By understanding and following these updates, drivers can avoid fines and help make the roads safer for everyone in 2025 and beyond.</p>

<h2>Sources</h2>
<ul>
<li>California DMV – "DMV Highlights New Laws in 2025" (Press Release) – dmv.ca.gov</li>
<li>California Highway Patrol – "New Laws for 2025" (Highlights) – chp.ca.gov</li>
<li>AB 413 Daylighting Law – California Legislative Info & Alameda Post – foxla.com, alamedapost.com</li>
<li>Harris Personal Injury Lawyers – "New Traffic Laws in CA for 2025" – harrispersonalinjury.com</li>
<li>San Diego DUI Law Center – "New DUI Laws in 2025" – sandiegoduilawyer.com</li>
<li>FOX 11 Los Angeles – Coverage of 2025 Driving Laws – foxla.com</li>
<li>511 Contra Costa – "New CA Transportation Laws 2025" – 511contracosta.org</li>
</ul>
'''

print("=== Updating Traffic Laws Post ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

# Find and update the post
for post in blog_data['posts']:
    if post['slug'] == 'new-traffic-laws-for-california-drivers-in-2025':
        old_length = len(post['content'])
        post['content'] += additional_content
        new_length = len(post['content'])
        
        print(f"✓ Updated: {post['title']}")
        print(f"  Slug: /{post['slug']}")
        print(f"  Content: {old_length} → {new_length} characters (+{new_length - old_length})")
        print(f"  Added sections: Other Notable Changes, Summary, Sources")
        break

# Save updated data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print("\n✅ Post updated successfully")
print("💾 Saved updated blog_posts.json")
print("\nView the updated article at:")
print("  • http://localhost:3001/new-traffic-laws-for-california-drivers-in-2025/")
