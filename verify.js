const http = require('http');

function requestJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = payload ? JSON.stringify(payload) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: payload ? 'POST' : 'GET',
      headers: payload ? {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      } : {}
    }, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (error) {
          resolve({ status: res.statusCode, body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const health = await requestJson('/api/health');
    const chat = await requestJson('/api/chat', { message: 'Recommend a luxury bottle for a perfume brand.' });
    console.log('HEALTH', JSON.stringify(health));
    console.log('CHAT', JSON.stringify(chat));
  } catch (error) {
    console.error('VERIFY_ERROR', error.message);
    process.exitCode = 1;
  }
})();
