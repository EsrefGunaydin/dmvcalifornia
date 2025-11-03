#!/usr/bin/env python3
"""
Extract tags from WordPress database and add them to blog posts
"""

import json
import re

def extract_table_data(sql_file, table_name):
    """Extract all records from a specific table"""
    records = []
    with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
        in_insert = False
        buffer = ""

        for line in f:
            if f'INSERT INTO `{table_name}`' in line:
                in_insert = True
                buffer = line
                continue

            if in_insert:
                buffer += line
                if ';' in line:
                    # End of INSERT statement
                    in_insert = False

                    # Extract VALUES part
                    match = re.search(r'VALUES\s+(.+);', buffer, re.DOTALL)
                    if match:
                        values_str = match.group(1).strip()

                        # Parse each tuple (record)
                        current_tuple = ""
                        paren_depth = 0
                        in_quotes = False
                        escape_next = False

                        for char in values_str:
                            if escape_next:
                                current_tuple += char
                                escape_next = False
                                continue

                            if char == '\\':
                                escape_next = True
                                current_tuple += char
                                continue

                            if char == "'" and not escape_next:
                                in_quotes = not in_quotes

                            if not in_quotes:
                                if char == '(':
                                    paren_depth += 1
                                    if paren_depth == 1:
                                        current_tuple = ""
                                        continue
                                elif char == ')':
                                    paren_depth -= 1
                                    if paren_depth == 0:
                                        # Parse the tuple
                                        fields = []
                                        field = ""
                                        field_in_quotes = False
                                        field_escape = False

                                        for c in current_tuple:
                                            if field_escape:
                                                field += c
                                                field_escape = False
                                                continue

                                            if c == '\\':
                                                field_escape = True
                                                continue

                                            if c == "'":
                                                field_in_quotes = not field_in_quotes
                                                continue

                                            if c == ',' and not field_in_quotes:
                                                fields.append(field.strip())
                                                field = ""
                                                continue

                                            field += c

                                        if field:
                                            fields.append(field.strip())

                                        records.append(fields)
                                        current_tuple = ""
                                        continue

                            current_tuple += char

                    buffer = ""

    return records

print("=== Extracting Tags from WordPress Database ===\n")

# Step 1: Extract wp_terms (term_id -> name)
print("1. Extracting terms...")
terms = {}
term_records = extract_table_data('data/wordpress/dmvcali2.sql', 'wp_terms')
for record in term_records:
    if len(record) >= 2:
        term_id = int(record[0])
        term_name = record[1]
        terms[term_id] = term_name

print(f"   Found {len(terms)} terms")

# Step 2: Extract wp_term_taxonomy (term_taxonomy_id -> term_id, filter by post_tag)
print("2. Extracting term taxonomies...")
term_taxonomy = {}  # term_taxonomy_id -> term_id
taxonomy_records = extract_table_data('data/wordpress/dmvcali2.sql', 'wp_term_taxonomy')
for record in taxonomy_records:
    if len(record) >= 3:
        term_taxonomy_id = int(record[0])
        term_id = int(record[1])
        taxonomy = record[2]

        # Only keep post_tag taxonomy
        if taxonomy == 'post_tag':
            term_taxonomy[term_taxonomy_id] = term_id

print(f"   Found {len(term_taxonomy)} post_tag taxonomies")

# Step 3: Extract wp_term_relationships (object_id -> term_taxonomy_id)
print("3. Extracting term relationships...")
post_tags = {}  # post_id -> [tag_names]
relationship_records = extract_table_data('data/wordpress/dmvcali2.sql', 'wp_term_relationships')
for record in relationship_records:
    if len(record) >= 2:
        object_id = int(record[0])
        term_taxonomy_id = int(record[1])

        # Check if this is a post_tag
        if term_taxonomy_id in term_taxonomy:
            term_id = term_taxonomy[term_taxonomy_id]
            if term_id in terms:
                tag_name = terms[term_id]

                if object_id not in post_tags:
                    post_tags[object_id] = []
                post_tags[object_id].append(tag_name)

print(f"   Found tags for {len(post_tags)} posts")

# Step 4: Add tags to blog_posts.json
print("\n4. Adding tags to blog posts...")
with open('src/data/blog_posts.json', 'r', encoding='utf-8') as f:
    blog_data = json.load(f)

updated_count = 0
for post in blog_data['posts']:
    post_id = post['id']

    if post_id in post_tags:
        post['tags'] = sorted(list(set(post_tags[post_id])))
        print(f"   ✓ Post {post_id}: {post['title'][:50]} → {len(post['tags'])} tags")
        updated_count += 1
    else:
        post['tags'] = []

# Save updated blog data
with open('src/data/blog_posts.json', 'w', encoding='utf-8') as f:
    json.dump(blog_data, f, indent=2, ensure_ascii=False)

print(f"\n✅ Updated {updated_count} out of {len(blog_data['posts'])} posts with tags")
print("💾 Saved updated blog_posts.json")

# Show all unique tags
all_tags = set()
for post in blog_data['posts']:
    all_tags.update(post.get('tags', []))

print(f"\n📊 Found {len(all_tags)} unique tags:")
for tag in sorted(all_tags):
    tag_count = sum(1 for p in blog_data['posts'] if tag in p.get('tags', []))
    print(f"   • {tag}: {tag_count} posts")
