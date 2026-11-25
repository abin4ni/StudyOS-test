const path = require('path');
const express = require('express');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const BLOCKED_FILES = new Set([
  '/server.js',
  '/package.json',
  '/package-lock.json',
]);

app.use((req, res, next) => {
  if (BLOCKED_FILES.has(req.path)) {
    return res.status(404).end();
  }
  next();
});

app.get('/firebase-config.js', (_req, res) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY || '',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.FIREBASE_APP_ID || '',
  };
  res.type('application/javascript');
  res.setHeader('Cache-Control', 'no-store');
  res.send(`window.__FIREBASE_CONFIG__ = ${JSON.stringify(config)};`);
});

app.use(express.static(ROOT, { dotfiles: 'ignore' }));

app.get('*', (_req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`StudyOS server listening on http://${HOST}:${PORT}`);
});
