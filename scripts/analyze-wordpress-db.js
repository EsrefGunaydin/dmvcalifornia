#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the SQL file
const sqlFile = path.join(__dirname, '../data/wordpress/dmvcali2.sql');
console.log('🔍 Analyzing WordPress database...\n');

const sqlContent = fs.readFileSync(sqlFile, 'utf8');

// Extract posts
const postsRegex = /INSERT INTO `wp_posts`[^;]*;/gs;
const postsMatches = sqlContent.match(postsRegex);

console.log(`📊 Total INSERT statements for wp_posts: ${postsMatches ? postsMatches.length : 0}\n`);

// Analyze post types
const publishedPosts = [];
const pages = [];
const revisions = [];
const otherTypes = {};

if (postsMatches) {
  postsMatches.forEach((insert) => {
    // Extract VALUES section
    const valuesMatch = insert.match(/VALUES\s*\((.*?)\)(?:,\s*\((.*?)\))*$/s);

    if (valuesMatch) {
      const values = insert.match(/\((\d+),.*?'(publish|inherit|draft|private|trash)',.*?'([^']*)',.*?\)/g);

      if (values) {
        values.forEach((val) => {
          const match = val.match(/\((\d+),.*?'([^']*?)',.*?'([^']*?)',.*?'([^']*?)',.*?'([^']*?)',.*?'([^']*?)'/);

          if (match) {
            const [, id, postAuthor, postDate, postDateGmt, postContent, postTitle] = match;

            // Try to get post_type
            const typeMatch = val.match(/'(post|page|revision|attachment|nav_menu_item)',/);
            const postType = typeMatch ? typeMatch[1] : 'unknown';

            // Try to get post_status
            const statusMatch = val.match(/'(publish|inherit|draft|private|trash)',/);
            const postStatus = statusMatch ? statusMatch[1] : 'unknown';

            // Try to get post_name (slug)
            const slugMatch = val.match(/'post_name',\s*'',\s*'',\s*'([^']*?)'/);
            const slug = slugMatch ? slugMatch[1] : '';

            if (postStatus === 'publish' && postType === 'post') {
              publishedPosts.push({ id, slug, type: postType });
            } else if (postStatus === 'publish' && postType === 'page') {
              pages.push({ id, slug, type: postType });
            } else if (postType === 'revision') {
              revisions.push({ id, type: postType });
            } else {
              otherTypes[postType] = (otherTypes[postType] || 0) + 1;
            }
          }
        });
      }
    }
  });
}

console.log('📄 Post Types Breakdown:');
console.log(`  ✅ Published Posts: ${publishedPosts.length}`);
console.log(`  📃 Pages: ${pages.length}`);
console.log(`  🔄 Revisions: ${revisions.length}`);
console.log(`  📦 Other Types:`, otherTypes);
console.log();

// Try to find categories
console.log('🏷️  Searching for categories...');
const termsRegex = /INSERT INTO `wp_terms`[^;]*;/gs;
const termsMatches = sqlContent.match(termsRegex);
console.log(`   Found ${termsMatches ? termsMatches.length : 0} term inserts\n`);

// Try to find post meta (featured images, etc.)
console.log('🖼️  Searching for post metadata...');
const postmetaRegex = /INSERT INTO `wp_postmeta`[^;]*;/gs;
const postmetaMatches = sqlContent.match(postmetaRegex);
console.log(`   Found ${postmetaMatches ? postmetaMatches.length : 0} postmeta inserts\n`);

// Look for quiz-related content
console.log('🎯 Searching for quiz-related content...');
const quizKeywords = ['quiz', 'test', 'question', 'exam', 'practice'];
let quizMatches = 0;

quizKeywords.forEach((keyword) => {
  const regex = new RegExp(keyword, 'gi');
  const matches = (sqlContent.match(regex) || []).length;
  if (matches > 0) {
    console.log(`   "${keyword}": ${matches} occurrences`);
    quizMatches += matches;
  }
});
console.log(`   Total quiz-related mentions: ${quizMatches}\n`);

// Sample some post slugs
console.log('📝 Sample Published Post Slugs (first 20):');
publishedPosts.slice(0, 20).forEach((post) => {
  console.log(`   - /${post.slug}`);
});
console.log();

console.log('📄 Sample Page Slugs:');
pages.slice(0, 20).forEach((page) => {
  console.log(`   - /${page.slug}`);
});
console.log();

console.log('✅ Analysis Complete!\n');
console.log('Next Step: Create detailed URL mapping for SEO preservation');
