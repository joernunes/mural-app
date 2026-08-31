import { kv } from '@vercel/kv';

const NOTES_KEY = 'mural-notes';
const MAX_TEXT = 500;
const MAX_NAME = 40;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const notes = (await kv.get(NOTES_KEY)) || [];
      return res.status(200).json({ notes });
    }

    if (req.method === 'POST') {
      const { text, author } = req.body || {};
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'texto em falta' });
      }
      const notes = (await kv.get(NOTES_KEY)) || [];
      const note = {
        id: 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        text: text.trim().slice(0, MAX_TEXT),
        author: (author || 'anónimo').toString().trim().slice(0, MAX_NAME) || 'anónimo',
        ts: Date.now(),
        readers: []
      };
      notes.push(note);
      await kv.set(NOTES_KEY, notes);
      return res.status(200).json({ note });
    }

    if (req.method === 'PATCH') {
      const { id, reader } = req.body || {};
      if (!id || !reader) {
        return res.status(400).json({ error: 'id ou reader em falta' });
      }
      const notes = (await kv.get(NOTES_KEY)) || [];
      const note = notes.find((n) => n.id === id);
      if (note) {
        note.readers = note.readers || [];
        const readerName = reader.toString().trim().slice(0, MAX_NAME) || 'anónimo';
        if (!note.readers.includes(readerName)) {
          note.readers.push(readerName);
          await kv.set(NOTES_KEY, notes);
        }
      }
      return res.status(200).json({ notes });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    return res.status(405).end('Method not allowed');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'erro no servidor' });
  }
}
