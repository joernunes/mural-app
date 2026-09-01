import { getDb, NOTES_KEY } from './_db.js';

const MAX_TEXT = 500;
const MAX_NAME = 40;

export default async function handler(req, res) {
  try {
    const db = getDb();

    if (req.method === 'GET') {
      const notes = (await db.get(NOTES_KEY)) || [];
      return res.status(200).json({ notes });
    }

    if (req.method === 'POST') {
      const { noteId, text, author, action } = req.body || {};

      // Add a comment to an existing note
      if (noteId || action === 'comment') {
        if (!noteId || !text || typeof text !== 'string' || !text.trim()) {
          return res.status(400).json({ error: 'noteId ou texto em falta' });
        }
        const notes = (await db.get(NOTES_KEY)) || [];
        const note = notes.find((n) => n.id === noteId);
        if (!note) {
          return res.status(404).json({ error: 'nota não encontrada' });
        }
        note.comments = note.comments || [];
        const comment = {
          id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
          text: text.trim().slice(0, MAX_TEXT),
          author: (author || 'anónimo').toString().trim().slice(0, MAX_NAME) || 'anónimo',
          ts: Date.now()
        };
        note.comments.push(comment);
        await db.set(NOTES_KEY, notes);
        return res.status(200).json({ comment, note });
      }

      // Create a new note
      if (!text || typeof text !== 'string' || !text.trim()) {
        return res.status(400).json({ error: 'texto em falta' });
      }
      const notes = (await db.get(NOTES_KEY)) || [];
      const note = {
        id: 'n_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8),
        text: text.trim().slice(0, MAX_TEXT),
        author: (author || 'anónimo').toString().trim().slice(0, MAX_NAME) || 'anónimo',
        ts: Date.now(),
        readers: [],
        comments: []
      };
      notes.push(note);
      await db.set(NOTES_KEY, notes);
      return res.status(200).json({ note });
    }

    if (req.method === 'PATCH') {
      const { id, reader } = req.body || {};
      if (!id || !reader) {
        return res.status(400).json({ error: 'id ou reader em falta' });
      }
      const notes = (await db.get(NOTES_KEY)) || [];
      const note = notes.find((n) => n.id === id);
      if (note) {
        note.readers = note.readers || [];
        const readerName = reader.toString().trim().slice(0, MAX_NAME) || 'anónimo';
        if (!note.readers.includes(readerName)) {
          note.readers.push(readerName);
          await db.set(NOTES_KEY, notes);
        }
      }
      return res.status(200).json({ notes });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    return res.status(405).end('Method not allowed');
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'erro no servidor: ' + (err.message || err) });
  }
}
