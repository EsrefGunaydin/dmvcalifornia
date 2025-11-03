const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const blogPostsPath = path.join(__dirname, '../src/data/blog_posts.json');
let blogContent = fs.readFileSync(blogPostsPath, 'utf8');

// Create directories
const imagesDir = path.join(__dirname, '../public/images/blog');
const pdfsDir = path.join(__dirname, '../public/pdfs');
[imagesDir, pdfsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Extract ALL wp-content URLs (with or without http/https://)
const urlPattern = /(?:https?:\/\/)?www\.dmvcalifornia\.us\/wp-content\/uploads\/[^\s"'\\,)]+/g;
const matches = blogContent.match(urlPattern) || [];

const uniqueUrls = [...new Set(matches.map(url => {
  // Ensure URL has https://
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  // Convert http:// to https://
  return url.replace(/^http:\/\//, 'https://');
}))];

console.log(`Found ${uniqueUrls.length} unique assets\n`);

// Download function
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        fs.unlink(filepath, () => {});
        reject(new Error(`Redirect: ${response.headers.location}`));
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading all remaining assets...\n');

  const mapping = {};
  let downloaded = 0;
  let alreadyExists = 0;
  let failed = 0;

  for (const url of uniqueUrls) {
    try {
      const urlObj = new URL(url);
      const filename = path.basename(urlObj.pathname);
      const ext = path.extname(filename).toLowerCase();

      const isPdf = ext === '.pdf';
      const targetDir = isPdf ? pdfsDir : imagesDir;
      const filepath = path.join(targetDir, filename);
      const newPath = isPdf ? `/pdfs/${filename}` : `/images/blog/${filename}`;

      // Check if already exists
      if (fs.existsSync(filepath)) {
        // Map all variations
        mapping[url] = newPath;
        mapping[url.replace('https://', 'http://')] = newPath;
        mapping[url.replace('https://', '')] = newPath;
        mapping[url.replace('http://', '')] = newPath;
        alreadyExists++;
        continue;
      }

      // Download
      await downloadFile(url, filepath);
      // Map all variations
      mapping[url] = newPath;
      mapping[url.replace('https://', 'http://')] = newPath;
      mapping[url.replace('https://', '')] = newPath;
      mapping[url.replace('http://', '')] = newPath;
      downloaded++;
      console.log(`✓ (${downloaded + alreadyExists}/${uniqueUrls.length}) ${filename}`);

      // Delay to avoid overwhelming server
      await new Promise(resolve => setTimeout(resolve, 150));

    } catch (error) {
      failed++;
      console.error(`✗ ${url.substring(url.lastIndexOf('/') + 1)}: ${error.message}`);
      // Keep original URL on failure for all variations
      mapping[url] = url;
      mapping[url.replace('https://', 'http://')] = url.replace('https://', 'http://');
      mapping[url.replace('https://', '')] = url.replace('https://', '');
      mapping[url.replace('http://', '')] = url.replace('http://', '');
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Already existed: ${alreadyExists}`);
  console.log(`   Failed: ${failed}`);

  // Update blog_posts.json
  console.log(`\n🔄 Updating blog_posts.json...`);

  let updatedContent = blogContent;
  Object.keys(mapping).forEach(oldUrl => {
    const newUrl = mapping[oldUrl];
    // Escape special regex characters
    const escaped = oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace with word boundaries to avoid partial matches
    updatedContent = updatedContent.replace(new RegExp(escaped, 'g'), newUrl);
  });

  fs.writeFileSync(blogPostsPath, updatedContent);
  console.log('✓ Updated blog_posts.json');

  // Verify
  const remaining = (updatedContent.match(/www\.dmvcalifornia\.us\/wp-content/g) || []).length;
  console.log(`\n✅ Migration complete! Remaining external refs: ${remaining}`);

  if (remaining > 0) {
    console.log('\nRemaining URLs (these may be broken links on the original site):');
    const remainingUrls = [...new Set(updatedContent.match(/https?:\/\/www\.dmvcalifornia\.us\/wp-content\/[^\s"'\\,)]+/g) || [])];
    remainingUrls.forEach(url => console.log(`   - ${url}`));
  }
}

main();
