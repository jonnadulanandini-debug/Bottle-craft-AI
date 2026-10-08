const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'BottleCraft AI backend is running.' });
});

app.post('/api/chat', async (req, res) => {
  const { message } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'A message is required.' });
  }

  const prompt = `You are a friendly AI assistant for a custom bottle design business called BottleCraft AI.
Your job is to help customers with custom bottles, bottle sizes, cap styles, label ideas, eco-friendly materials, luxury packaging, and product recommendations.
Keep answers concise but helpful, professional, and sales-focused.
Customer question: ${message.trim()}`;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'qwen2.5:latest',
        prompt,
        stream: false,
        options: {
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama request failed:', errorText);
      return res.status(502).json({
        reply: 'I could not reach the local AI model. Please make sure Ollama is running and qwen2.5:latest is installed.'
      });
    }

    const data = await response.json();
    const reply = data.response || 'I am here to help with your custom bottle needs.';
    return res.json({ reply });
  } catch (error) {
    console.error('Chatbot backend error:', error.message);
    return res.status(500).json({
      reply: 'The chatbot service is unavailable. Check whether Ollama is running on localhost:11434.'
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BottleCraft AI website is running on http://localhost:${PORT}`);
  console.log(`Ollama model target: ${OLLAMA_URL}/api/generate`);
});
