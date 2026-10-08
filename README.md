# BottleCraft AI Website

A custom bottle business website with an integrated AI chatbot. The chat backend connects to a local Ollama instance using the `qwen2.5:latest` model.

## Features

- Premium landing page for a custom bottle brand
- Floating AI chatbot widget embedded into the site
- Express backend that proxies messages to Ollama
- Local model connection to `http://localhost:11434`

## Requirements

- Node.js 18 or newer
- Ollama installed locally
- Model pulled: `qwen2.5:latest`

## Setup

1. Install Node.js: https://nodejs.org/
2. Install Ollama: https://ollama.com/download
3. Pull the model:
   ```bash
   ollama pull qwen2.5:latest
   ```
4. In the project folder, install dependencies:
   ```bash
   npm install
   ```
5. Start the app:
   ```bash
   npm start
   ```
6. Open the website at:
   ```text
   http://localhost:3000
   ```

## Notes

The backend route `/api/chat` sends a request to:

```text
http://localhost:11434/api/generate
```

The model is configured as:

```text
qwen2.5:latest
```
