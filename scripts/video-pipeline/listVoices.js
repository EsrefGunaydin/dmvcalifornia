require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local', override: true });

const { listVoices } = require('./tts');

listVoices()
  .then((voices) => {
    voices.forEach((v) => {
      console.log(`${v.voice_id}  ${v.name}  (${v.labels?.accent || 'n/a'}, ${v.labels?.gender || 'n/a'})`);
    });
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
