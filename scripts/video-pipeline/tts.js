const fs = require('fs');

// eleven_v3 since Oct 2026: it reads at the pace the ElevenLabs site
// previews voices with (about a third slower than multilingual_v2, with
// natural pauses). v3 takes no `speed` setting, and its `stability` must be
// one of 0.0 (creative), 0.5 (natural) or 1.0 (robust).
const DEFAULT_MODEL = 'eleven_v3';

async function synthesize(text, voiceId, outPath, { modelId = DEFAULT_MODEL } = {}) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not set (check .env.local)');
  }

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`ElevenLabs TTS failed (${res.status}) for voice ${voiceId}: ${body.slice(0, 300)}`);
  }

  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  return outPath;
}

async function listVoices() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY not set (check .env.local)');
  }
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': apiKey },
  });
  if (!res.ok) {
    throw new Error(`ElevenLabs list voices failed (${res.status})`);
  }
  const data = await res.json();
  return data.voices || [];
}

module.exports = { synthesize, listVoices };
