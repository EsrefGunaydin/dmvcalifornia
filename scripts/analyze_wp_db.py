#!/usr/bin/env python3
"""
WordPress Database Analyzer
Extracts key information from WordPress SQL dump for migration planning
"""

import re
import json
from collections import defaultdict
from datetime import datetime

def extract_posts_data(sql_content):
    """Extract post data from wp_posts table"""
    posts = []
    pages = []
    post_types = defaultdict(int)
    post_statuses = defaultdict(int)

    # Find wp_posts INSERT statements
    posts_pattern = r"INSERT INTO `wp_posts`.*?VALUES\s*(.*?);"
    matches = re.findall(posts_pattern, sql_content, re.DOTALL)

    total_inserts = len(matches)

    for match in matches:
        # Extract individual rows from VALUES
        # This regex looks for rows in format (val1, val2, ..., valN)
        row_pattern = r"\((\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"),\s*(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"),\s*\d+,\s*(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\"),\s*\d+,\s*'([^']*)',\s*'([^']*)',\s*\d+\)"

        rows = re.finditer(row_pattern, match)
        for row in rows:
            try:
                post_id = row.group(1)
                post_date = row.group(3)
                post_excerpt = row.group(5)
                post_status = row.group(6)
                post_name = row.group(10)  # slug
                post_type = row.group(15)

                post_types[post_type] += 1
                post_statuses[post_status] += 1

                post_data = {
                    'id': post_id,
                    'slug': post_name,
                    'status': post_status,
                    'type': post_type,
                    'date': post_date
                }

                if post_status == 'publish':
                    if post_type == 'post':
                        posts.append(post_data)
                    elif post_type == 'page':
                        pages.append(post_data)
            except Exception as e:
                continue

    return {
        'posts': posts,
        'pages': pages,
        'post_types': dict(post_types),
        'post_statuses': dict(post_statuses),
        'total_inserts': total_inserts
    }

def extract_terms(sql_content):
    """Extract categories and tags from wp_terms"""
    terms = []

    terms_pattern = r"INSERT INTO `wp_terms`.*?VALUES\s*(.*?);"
    matches = re.findall(terms_pattern, sql_content, re.DOTALL)

    for match in matches:
        # Extract term data
        row_pattern = r"\((\d+),\s*'([^']*)',\s*'([^']*)'"
        rows = re.finditer(row_pattern, match)
        for row in rows:
            terms.append({
                'id': row.group(1),
                'name': row.group(2),
                'slug': row.group(3)
            })

    return terms

def search_quiz_content(sql_content):
    """Search for quiz-related content"""
    quiz_keywords = {
        'quiz': 0,
        'test': 0,
        'question': 0,
        'exam': 0,
        'practice': 0,
        'dmv test': 0,
        'driving test': 0
    }

    for keyword in quiz_keywords:
        pattern = re.compile(keyword, re.IGNORECASE)
        quiz_keywords[keyword] = len(pattern.findall(sql_content))

    return quiz_keywords

def analyze_url_patterns(posts, pages):
    """Analyze URL patterns from slugs"""
    url_patterns = {
        'simple_slugs': [],
        'date_based': [],
        'hierarchical': []
    }

    for post in posts[:50]:  # Sample first 50
        slug = post['slug']
        if slug:
            if '-' in slug:
                url_patterns['simple_slugs'].append(f"/{slug}")
            else:
                url_patterns['simple_slugs'].append(f"/{slug}")

    for page in pages[:20]:  # Sample first 20
        slug = page['slug']
        if slug:
            url_patterns['hierarchical'].append(f"/{slug}")

    return url_patterns

def main():
    print("🔍 WordPress Database Analyzer\n")
    print("=" * 60)

    # Read SQL file
    sql_file = '../data/wordpress/dmvcali2.sql'
    print(f"\n📂 Reading: {sql_file}")

    try:
        with open(sql_file, 'r', encoding='utf-8', errors='ignore') as f:
            sql_content = f.read()

        file_size_mb = len(sql_content) / (1024 * 1024)
        print(f"   File size: {file_size_mb:.2f} MB")
        print(f"   Total length: {len(sql_content):,} characters\n")

        # Extract data
        print("📊 Analyzing wp_posts table...")
        posts_data = extract_posts_data(sql_content)

        print(f"\n   Total INSERT statements: {posts_data['total_inserts']}")
        print(f"   Published posts: {len(posts_data['posts'])}")
        print(f"   Published pages: {len(posts_data['pages'])}")

        print(f"\n   Post Types Distribution:")
        for ptype, count in sorted(posts_data['post_types'].items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"     - {ptype}: {count}")

        print(f"\n   Post Status Distribution:")
        for status, count in sorted(posts_data['post_statuses'].items(), key=lambda x: x[1], reverse=True):
            print(f"     - {status}: {count}")

        # Extract terms
        print(f"\n🏷️  Analyzing wp_terms table (categories/tags)...")
        terms = extract_terms(sql_content)
        print(f"   Found {len(terms)} terms")
        if terms[:10]:
            print(f"   Sample terms:")
            for term in terms[:10]:
                print(f"     - {term['name']} (slug: {term['slug']})")

        # Search for quiz content
        print(f"\n🎯 Searching for quiz-related content...")
        quiz_keywords = search_quiz_content(sql_content)
        for keyword, count in sorted(quiz_keywords.items(), key=lambda x: x[1], reverse=True):
            if count > 0:
                print(f"   '{keyword}': {count} occurrences")

        # Analyze URL patterns
        print(f"\n🔗 Analyzing URL patterns...")
        url_patterns = analyze_url_patterns(posts_data['posts'], posts_data['pages'])

        print(f"\n   Sample Post URLs:")
        for url in url_patterns['simple_slugs'][:15]:
            print(f"     {url}")

        print(f"\n   Sample Page URLs:")
        for url in url_patterns['hierarchical'][:15]:
            print(f"     {url}")

        # Save analysis to JSON
        analysis_output = {
            'analyzed_at': datetime.now().isoformat(),
            'summary': {
                'total_posts': len(posts_data['posts']),
                'total_pages': len(posts_data['pages']),
                'total_terms': len(terms),
                'file_size_mb': round(file_size_mb, 2)
            },
            'posts': posts_data['posts'][:100],  # First 100 posts
            'pages': posts_data['pages'],
            'terms': terms,
            'quiz_keywords': quiz_keywords,
            'post_types': posts_data['post_types'],
            'post_statuses': posts_data['post_statuses']
        }

        output_file = 'wordpress_analysis.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis_output, f, indent=2, ensure_ascii=False)

        print(f"\n✅ Analysis complete!")
        print(f"   Full report saved to: {output_file}")
        print("\n" + "=" * 60)

    except FileNotFoundError:
        print(f"❌ Error: Could not find {sql_file}")
        print("   Make sure the WordPress database dump is in the correct location")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()
