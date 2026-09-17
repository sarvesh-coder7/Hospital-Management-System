const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { history, system } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: history,
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await geminiRes.json();
    res.json(data);
  } catch (err) {
    console.error('Gemini proxy error:', err);
    res.status(500).json({ error: 'Server error contacting Gemini' });
  }
});

module.exports = router;