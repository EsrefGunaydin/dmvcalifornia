const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const imagesDir = path.join(__dirname, '../public/images/blog');

// Find all 0-byte files
const files = fs.readdirSync(imagesDir);
const zeroByteFiles = files.filter(file => {
  const filePath = path.join(imagesDir, file);
  const stats = fs.statSync(filePath);
  return stats.size === 0 && stats.isFile();
});

console.log(`Found ${zeroByteFiles.length} failed image downloads\n`);

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

async function redownloadFiles() {
  let success = 0;
  let failed = 0;

  for (const filename of zeroByteFiles) {
    const filepath = path.join(imagesDir, filename);
    const url = `https://www.dmvcalifornia.us/wp-content/uploads/2017/09/${filename}`;
    const url2017_10 = `https://www.dmvcalifornia.us/wp-content/uploads/2017/10/${filename}`;
    const url2017_12 = `https://www.dmvcalifornia.us/wp-content/uploads/2017/12/${filename}`;

    try {
      // Try different possible paths
      let downloaded = false;

      for (const tryUrl of [url, url2017_10, url2017_12]) {
        try {
          await downloadFile(tryUrl, filepath);
          const stats = fs.statSync(filepath);
          if (stats.size > 0) {
            success++;
            console.log(`✓ (${success + failed}/${zeroByteFiles.length}) ${filename} (${(stats.size / 1024).toFixed(1)}KB)`);
            downloaded = true;
            break;
          }
        } catch (e) {
          // Try next URL
        }
      }

      if (!downloaded) {
        failed++;
        console.error(`✗ Failed: ${filename}`);
      }

      // Small delay
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      failed++;
      console.error(`✗ Failed: ${filename} - ${error.message}`);
    }
  }

  console.log(`\n✓ Successfully re-downloaded: ${success}`);
  console.log(`✗ Failed: ${failed}`);
}

redownloadFiles();
