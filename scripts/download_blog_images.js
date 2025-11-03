const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const blogPostsPath = path.join(__dirname, '../src/data/blog_posts.json');
const blogData = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images/blog');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Extract all unique image URLs
const imageUrls = new Set();
const imageUrlPattern = /https:\/\/www\.dmvcalifornia\.us\/wp-content\/uploads\/[^"'\s)]+\.(jpg|jpeg|png|gif|webp)/gi;

blogData.posts.forEach(post => {
  const matches = post.content.match(imageUrlPattern);
  if (matches) {
    matches.forEach(url => imageUrls.add(url));
  }
});

console.log(`Found ${imageUrls.size} unique images to download`);

// Download image function
function downloadImage(url, filepath) {
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
      } else {
        fs.unlink(filepath, () => {});
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Create a mapping of old URLs to new URLs
const urlMapping = {};

async function downloadAllImages() {
  let downloaded = 0;
  let failed = 0;

  for (const url of imageUrls) {
    try {
      // Extract filename from URL
      const urlPath = new URL(url).pathname;
      const filename = path.basename(urlPath);
      const filepath = path.join(imagesDir, filename);

      // Check if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`✓ Already exists: ${filename}`);
        urlMapping[url] = `/images/blog/${filename}`;
        downloaded++;
        continue;
      }

      // Download the image
      await downloadImage(url, filepath);
      urlMapping[url] = `/images/blog/${filename}`;
      downloaded++;
      console.log(`✓ Downloaded (${downloaded}/${imageUrls.size}): ${filename}`);

      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      failed++;
      console.error(`✗ Failed to download: ${url}`);
      console.error(`  Error: ${error.message}`);
      // Keep the original URL if download fails
      urlMapping[url] = url;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Successfully downloaded: ${downloaded}`);
  console.log(`Failed: ${failed}`);

  return urlMapping;
}

// Update blog posts with new image URLs
function updateBlogPosts(mapping) {
  let updatedCount = 0;

  blogData.posts.forEach(post => {
    let updated = false;
    let newContent = post.content;

    Object.keys(mapping).forEach(oldUrl => {
      const newUrl = mapping[oldUrl];
      if (newContent.includes(oldUrl)) {
        newContent = newContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
        updated = true;
      }
    });

    if (updated) {
      post.content = newContent;
      updatedCount++;
    }
  });

  console.log(`\nUpdated ${updatedCount} blog posts`);

  // Save updated blog_posts.json
  fs.writeFileSync(blogPostsPath, JSON.stringify(blogData, null, 2));
  console.log('Saved updated blog_posts.json');

  // Save mapping file for reference
  const mappingPath = path.join(__dirname, 'image_url_mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`Saved URL mapping to ${mappingPath}`);
}

// Run the script
async function main() {
  console.log('Starting image download and migration...\n');

  try {
    const mapping = await downloadAllImages();
    updateBlogPosts(mapping);
    console.log('\n✓ Image migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

main();
