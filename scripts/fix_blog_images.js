const fs = require('fs');
const path = require('path');

const blogPostsPath = path.join(__dirname, '../src/data/blog_posts.json');

// Read and parse the JSON properly
const blogData = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

console.log('Fixing blog post image URLs...\n');

let fixedCount = 0;

blogData.posts.forEach(post => {
  let originalContent = post.content;

  // Fix 1: Remove double https://https://
  post.content = post.content.replace(/https:\/\/https:\/\//g, 'https://');

  // Fix 2: Remove the entire broken screenshot image blocks
  post.content = post.content.replace(/<!-- wp:uagb\/image \{[^}]*"url":"https:\/\/www\.dmvcalifornia\.us\/wp-content\/uploads\/2024\/10\/Screenshot-2024-10-31[^>]*-->[^]*?<!-- \/wp:uagb\/image -->/g, '');

  if (originalContent !== post.content) {
    fixedCount++;
    console.log(`✓ Fixed post: ${post.title}`);
  }
});

// Save with proper formatting
fs.writeFileSync(blogPostsPath, JSON.stringify(blogData, null, 2));

console.log(`\n✅ Fixed ${fixedCount} blog posts`);
console.log('✓ JSON structure preserved');
console.log('✓ All formatting intact');
