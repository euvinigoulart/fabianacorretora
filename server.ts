import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';

const DB_FILE = path.join(process.cwd(), 'public', 'database.json');

// Initialize database
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ properties: [], settings: {} }));
}

let memoryDb: any = null;

function readDb() {
  if (memoryDb) return memoryDb;
  try {
    memoryDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    memoryDb = { properties: [], settings: {} };
  }
  return memoryDb;
}

function writeDb(data: any) {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Failed to write to DB", e);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // IMPORTANT: Increase payload limits for base64 images
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.get('/api/data', (req, res) => {
    res.json(readDb());
  });

  app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    const db = readDb();
    const adminEmail = String(db.settings.adminEmail || 'admin').trim();
    const adminPass = String(db.settings.adminPass || '1234').trim();
    
    if (String(email).trim().toLowerCase() === adminEmail.toLowerCase() && String(pass).trim() === adminPass) {
      res.json({ success: true, token: 'validated' });
    } else {
      console.log('Login failed', { reqEmail: email, reqPass: pass, adminEmail, adminPass });
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });

  app.post('/api/properties', (req, res) => {
    const property = req.body;
    const db = readDb();
    
    // Auto-generate ID if empty string or not provided
    if (!property.id) {
      property.id = Date.now().toString();
    }
    
    const existingIndex = db.properties.findIndex((p: any) => String(p.id) === String(property.id));
    if (existingIndex >= 0) {
      db.properties[existingIndex] = property;
    } else {
      db.properties.push(property);
    }
    writeDb(db);
    res.json({ success: true, property });
  });

  app.delete('/api/properties/:id', (req, res) => {
    const { id } = req.params;
    const db = readDb();
    db.properties = db.properties.filter((p: any) => String(p.id) !== String(id));
    writeDb(db);
    res.json({ success: true });
  });

  app.post('/api/settings', (req, res) => {
    const newSettings = req.body;
    const db = readDb();
    db.settings = { ...db.settings, ...newSettings };
    writeDb(db);
    res.json({ success: true });
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
