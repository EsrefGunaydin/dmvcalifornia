const fs = require('fs');
const path = require('path');
const https = require('https');

const blogPostsPath = path.join(__dirname, '../src/data/blog_posts.json');
const blogData = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Create directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images/blog');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Download file function
function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
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

async function main() {
  console.log('Downloading screenshot files...\n');

  const screenshotUrls = [
    'https://www.dmvcalifornia.us/wp-content/uploads/2024/10/Screenshot-2024-10-31-at-5.23.57 PM.png',
    'https://www.dmvcalifornia.us/wp-content/uploads/2024/10/Screenshot-2024-10-31-at-5.23.57 PM-900x487.png'
  ];

  for (const url of screenshotUrls) {
    try {
      const filename = path.basename(url);
      const filepath = path.join(imagesDir, filename);

      if (fs.existsSync(filepath)) {
        console.log(`✓ Already exists: ${filename}`);
        continue;
      }

      await downloadFile(url, filepath);
      console.log(`✓ Downloaded: ${filename}`);
    } catch (error) {
      console.error(`✗ Failed to download: ${url}`);
      console.error(`  Error: ${error.message}`);
    }
  }

  // Now update all references in blog posts
  let content = fs.readFileSync(blogPostsPath, 'utf8');

  // Replace all variations of the screenshot URLs
  const replacements = [
    {
      old: /https:\/\/www\.dmvcalifornia\.us\/wp-content\/uploads\/2024\/10\/Screenshot-2024-10-31-at-5\.23\.57 PM-900x487\.png[\\,\s]*/g,
      new: '/images/blog/Screenshot-2024-10-31-at-5.23.57 PM-900x487.png'
    },
    {
      old: /https:\/\/www\.dmvcalifornia\.us\/wp-content\/uploads\/2024\/10\/Screenshot-2024-10-31-at-5\.23\.57 PM\.png[\\,\s]*/g,
      new: '/images/blog/Screenshot-2024-10-31-at-5.23.57 PM.png'
    }
  ];

  replacements.forEach(({ old, new: newUrl }) => {
    content = content.replace(old, newUrl);
  });

  fs.writeFileSync(blogPostsPath, content);
  console.log('\n✓ Updated blog_posts.json');
  console.log('✓ Migration completed!');
}

main();
