import express from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * Tiny Node/Express backend (the optional bonus). It serves the bundle catalog
 * from GET /api/bundle, reading the SAME JSON the frontend uses as a fallback,
 * so there is a single source of truth for the data.
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, '..', 'src', 'data', 'bundle.json');
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());

app.get('/api/bundle', async (_req, res) => {
  try {
    const raw = await readFile(CATALOG_PATH, 'utf8');
    res.type('application/json').send(raw);
  } catch (err) {
    console.error('Failed to read catalog:', err);
    res.status(500).json({ error: 'Failed to load bundle catalog' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Bundle API listening on http://localhost:${PORT}/api/bundle`);
});
