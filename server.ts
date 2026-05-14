import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let firestore: any = null;
let adminAuth: any = null;
try {
  const config = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf-8'));
  const app = initializeApp();
  firestore = getFirestore(app, config.firestoreDatabaseId);
  adminAuth = getAuth(app);
} catch (e) {
  console.error('Firebase Admin init error:', e);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // IMPORTANT: Increase payload limits for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.post('/api/login', async (req, res) => {
    try {
      const { email, pass } = req.body;
      let settings: any = {};
      if (firestore) {
        const settingsSnap = await firestore.collection('config').doc('settings').get();
        if (settingsSnap.exists) {
          settings = settingsSnap.data() || {};
        }
      }
      
      const adminEmail = String(settings.adminEmail || 'admin').trim();
      const adminPass = String(settings.adminPass || '123456').trim();
      
      if (String(email).trim().toLowerCase() === adminEmail.toLowerCase() && String(pass).trim() === adminPass) {
        if (adminAuth) {
          const customToken = await adminAuth.createCustomToken('admin-uid');
          res.json({ success: true, token: customToken });
        } else {
          res.json({ success: true, token: 'validated' });
        }
      } else {
        res.status(401).json({ error: 'Email ou senha incorretos.' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Login check failed' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
