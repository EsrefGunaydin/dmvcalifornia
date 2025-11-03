#!/usr/bin/env python3
"""
Add the final 3 missing pages from the live site
"""

import json
import random

# Random author names
AUTHORS = [
    "Sarah Mitchell",
    "David Chen",
    "Jennifer Rodriguez",
    "Michael Anderson",
    "Lisa Thompson",
    "Robert Johnson"
]

# The 3 final missing pages
final_pages = [
    {
        'id': 9003,
        'title': 'Registering a Vehicle in California - Complete Guide',
        'slug': 'car-registration',
        'content': '''<h2>Registering a Vehicle in California</h2>
<p>Different registration processes apply depending on whether you purchased from a dealership or a private party, with a separate process for converting non-transferable registrations.</p>

<h3>Purchasing from a Dealership</h3>
<p>Dealerships typically handle all registration paperwork and issue temporary certificates. License plate issuance varies by dealership.</p>

<h3>Purchasing from a Private Individual</h3>
<p>You have <strong>10 days to register</strong> the vehicle after purchase. Required steps include:</p>
<ul>
<li>Present vehicle title with odometer mileage (if vehicle is less than 10 years old)</li>
<li>If title is missing, complete Form REG 227 (Application for Duplicate or Paperless Title)</li>
<li>Provide valid smog certificate (seller's responsibility for vehicles over 4 years old)</li>
<li>Submit Form REG 343 (Application for Title or Registration)</li>
<li>Pay all applicable fees and taxes</li>
</ul>

<p><strong>Smog Certificate Notes:</strong> Valid for 90 days; not required if previous owner renewed registration within 90 days and renewed for 2 years.</p>

<h3>Non-Transferable to Transferable Registration</h3>
<p>Required documents include current registration card, vehicle title, Form REG 343, bill of sale, odometer disclosure (if applicable), smog proof, and any transfer fees.</p>

<h2>Military Vehicle Registration</h2>
<p><strong>Non-Resident Military Members:</strong> Not required to obtain California registration if they have valid auto insurance, out-of-state plates, and current registration.</p>
<p><strong>CA Military Residents:</strong> Eligible for vehicle license fee exemption by submitting Form REG 5045 (military) or REG 5046 (NATO).</p>

<h2>Registration Fees</h2>
<p><strong>All vehicles must pay:</strong></p>
<ul>
<li>Registration fee: $56</li>
<li>California Highway Patrol fee: $24</li>
</ul>

<p><strong>Late Registration Penalties:</strong></p>
<ul>
<li>Register within 20 days of establishing residency or face late fees</li>
<li>Private party purchases: 10 days or incur penalties</li>
<li>Penalty structure: Less than 1 year ($30), 1-2 years ($50), over 2 years ($100)</li>
</ul>

<h2>Smog Checks</h2>
<p>Required for most vehicles except:</p>
<ul>
<li>New vehicles under 4 years old</li>
<li>Hybrid/electric vehicles</li>
<li>Gas vehicles model year 1975 and older</li>
<li>Diesel vehicles model year 1997+ (or over 14,000 lbs)</li>
<li>Motorcycles and trailers</li>
</ul>

<h2>Weight Certifications</h2>
<p>Required for commercial pickups/trucks with operating weight of 10,000 lbs or less. Complete Form REG 256 (Statement of Facts).</p>

<h2>License Plates</h2>
<p>California requires valid license plates with current registration stickers. Plates remain with vehicles unless specifically requested by seller. Special interest plates available through the Special Interest License Plate Application.</p>''',
        'excerpt': 'Complete guide to registering your vehicle in California. Learn about DMV registration requirements, fees, smog checks, and the difference between dealership and private party purchases.',
        'publishedAt': '2023-01-15T00:00:00Z',
        'author': random.choice(AUTHORS),
        'tags': ['Vehicle Registration', 'DMV Forms', 'Fees']
    },
    {
        'id': 9004,
        'title': 'California Auto Insurance Requirements and Programs',
        'slug': 'auto-insurance',
        'content': '''<h2>Car Insurance Requirements</h2>
<p>California mandates liability insurance to cover accident-related damages. The minimum coverage levels are:</p>
<ul>
<li>$15,000 for injury/death to one person</li>
<li>$30,000 for injury/death to multiple people</li>
<li>$5,000 for property damage</li>
</ul>

<h2>Additional Coverage Types</h2>
<p>Beyond required liability coverage, drivers can purchase:</p>
<ul>
<li><strong>Comprehensive coverage</strong> — protection against non-accident damage like theft</li>
<li><strong>Collision coverage</strong> — accident-related vehicle damage</li>
<li><strong>Medical and funeral services coverage</strong></li>
<li><strong>Uninsured/Underinsured motorist coverage</strong> — covers damages from uninsured drivers (14.43% of CA drivers in 2004)</li>
<li><strong>Rental car and towing coverage</strong></li>
</ul>

<p><em>Note: Financed vehicles require comprehensive and collision coverage.</em></p>

<h2>Proof of Insurance</h2>
<p>Insurance cards must display vehicle information, policyholder names, and policy expiration dates. Electronic insurance cards via smartphone apps are permitted. California insurers report coverage electronically to the DMV.</p>

<h2>Violations & Penalties</h2>
<p>Driving without proof of insurance carries fines of $100–$200 for first offense, and $200–$500 for subsequent violations within three years. Vehicle impoundment is possible.</p>

<h2>Registration Suspension</h2>
<p>Registration may suspend if insurance lapses 45+ days, information isn't provided within 30 days of registration, or false evidence was provided. Reinstatement costs $14.</p>

<h2>Proposition 103 (1988)</h2>
<p>This voter-approved regulation required insurers to cut rates 20% below 1987 levels and established the <strong>Good Driver Discount</strong> — a mandatory 20% reduction for drivers with:</p>
<ul>
<li>3+ years driving experience</li>
<li>No more than one violation point</li>
<li>No traffic school attendance (except once)</li>
<li>No at-fault injury/death accidents</li>
</ul>

<p>The law prohibits using credit history when calculating premiums.</p>

<h2>Low Cost Auto Insurance Program (CLCA)</h2>
<p>Established in 1999 for income-eligible drivers, requiring:</p>
<ul>
<li>Valid California driver's license</li>
<li>Vehicle valued at $25,000 or less</li>
<li>Age 19+</li>
<li>Income qualification</li>
</ul>

<h2>Claims Mediation Program</h2>
<p>Dispute resolution available for coverage extent, repair methods, damage causation, and total loss valuations—but not for coverage issues or policy interpretation.</p>

<h2>Automobile Assigned Risk Plan (CAARP)</h2>
<p>Provides liability insurance for drivers unable to obtain standard coverage due to poor driving records. Clean records for three consecutive years allow standard insurance purchase.</p>

<h2>Additional Important Information</h2>
<ul>
<li><strong>Electronic cards:</strong> Smartphone apps provide digital proof of insurance</li>
<li><strong>Car theft:</strong> California had 156,796 vehicle thefts in 2011 (approximately $1 billion loss)</li>
<li><strong>Most stolen vehicles:</strong> Honda Accord, Civic, Chevrolet/Ford pickups, Toyota Camry, Acura Integra</li>
<li><strong>Accident reporting:</strong> Accidents exceeding $1,000 damage require Form SR 1 filing within 10 days</li>
<li><strong>Cell phone use:</strong> Illegal for drivers under 18 in all forms; drivers 18+ may use hands-free only</li>
</ul>''',
        'excerpt': 'Comprehensive guide to California auto insurance requirements, coverage types, minimum liability limits, penalties, and special programs including Proposition 103 and Low Cost Auto Insurance.',
        'publishedAt': '2023-03-20T00:00:00Z',
        'author': random.choice(AUTHORS),
        'tags': ['Insurance', 'Traffic Laws', 'DMV Forms']
    },
    {
        'id': 9005,
        'title': "The Best And Worst Driver's License Designs By State",
        'slug': 'drivers-licenses-design-by-state',
        'content': '''<h2>Overview of Driver's License Designs</h2>
<p>The United States comprises 50 states with unique laws, regulations, and administrative systems. This diversity is also reflected in the design of driver's licenses across different states.</p>

<p>While all states issue driving permits following consistent fundamental principles, specific regulations and practices differ substantially, resulting in unique designs for each state.</p>

<h2>Using Your License Across States</h2>
<p><strong>Validity:</strong> Driver's licenses are generally valid across all U.S. states and territories.</p>

<h3>Important Considerations:</h3>

<h4>1. Residency Requirements</h4>
<p>Establishing permanent residency typically triggers a requirement to obtain a new state license within 30-60 days.</p>

<h4>2. Expiration Dates</h4>
<p>License validity must be current; renewal may be necessary before relocation to another state.</p>

<h4>3. Address Updates</h4>
<p>Current address registration with the DMV is often mandatory when you move.</p>

<h4>4. Real ID Compliance</h4>
<p>Non-compliant licenses may require alternative federal identification for domestic air travel. Check if your state license is Real ID compliant.</p>

<h4>5. Temporary Residency</h4>
<p>Short-term residence for work or education may not require a new license; verification with local DMV is recommended.</p>

<h2>State-by-State Variations</h2>
<p>Each state has developed its own unique driver's license design, incorporating various security features, color schemes, and state-specific imagery. From California's golden bear to New York's Statue of Liberty, these designs reflect each state's individual identity.</p>

<h2>Design Elements</h2>
<p>Modern driver's licenses include several common elements across all states:</p>
<ul>
<li>Photo identification</li>
<li>Full legal name</li>
<li>Date of birth</li>
<li>Physical description (height, weight, eye color)</li>
<li>Address</li>
<li>License number</li>
<li>Issue and expiration dates</li>
<li>Security features (holograms, barcodes, etc.)</li>
</ul>

<h2>Real ID Act Compliance</h2>
<p>Since the Real ID Act of 2005, states have been updating their license designs to meet federal security standards. These enhanced licenses feature additional security measures and are marked with a star symbol to indicate Real ID compliance.</p>

<h2>Important Note</h2>
<p>State laws and regulations can change, so it's always wise to double-check with the Department of Motor Vehicles (DMV) in the state where you plan to use your driver's license to ensure you're in compliance with current requirements.</p>''',
        'excerpt': 'Explore driver\'s license designs across all 50 U.S. states. Learn about design variations, Real ID compliance, interstate validity, and important considerations when using your license in different states.',
        'publishedAt': '2023-08-14T00:00:00Z',
        'author': random.choice(AUTHORS),
        'tags': ['Driver License', 'Real ID', 'DMV Information']
    }
]

print("=== Adding Final 3 Missing Pages ===\n")

# Load existing blog data
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

original_count = len(blog_data['posts'])

for post in final_pages:
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

print("\n🎉 All missing pages have been added!")
print("\nYou can now access:")
print("  • http://localhost:3001/car-registration/")
print("  • http://localhost:3001/auto-insurance/")
print("  • http://localhost:3001/drivers-licenses-design-by-state/")
