import { getDb, NOTES_KEY, hueFromId, escapeHtml } from '../_db.js';

export default async function handler(req, res) {
  let id = req.query?.id;
  if (!id) {
    const urlPath = (req.url || '').split('?')[0];
    const parts = urlPath.split('/');
    id = parts[parts.length - 1];
  }

  if (!id || id === '[id]') {
    return res.redirect(302, '/');
  }

  try {
    const db = getDb();
    const notes = (await db.get(NOTES_KEY)) || [];
    const note = notes.find(n => n.id === id);

    if (!note) {
      return res.redirect(302, '/');
    }

    const proto = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const baseUrl = `${proto}://${host}`;
    const hue = hueFromId(note.id);
    const truncatedText = note.text.length > 160 ? note.text.slice(0, 157) + '…' : note.text;
    const ogImageUrl = `${baseUrl}/api/og?text=${encodeURIComponent(note.text.slice(0, 150))}&author=${encodeURIComponent(note.author || 'anónimo')}&hue=${hue}`;
    const pageUrl = `${baseUrl}/#nota/${note.id}`;
    const authorSafe = escapeHtml(note.author || 'anónimo');
    const textSafe = escapeHtml(truncatedText);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.send(`<!DOCTYPE html>
<html lang="pt">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${authorSafe} no Mural</title>
<meta name="description" content="${textSafe}">
<meta property="og:title" content="${authorSafe} deixou uma nota no Mural">
<meta property="og:description" content="${textSafe}">
<meta property="og:image" content="${ogImageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:type" content="article">
<meta property="og:url" content="${baseUrl}/api/nota/${note.id}">
<meta property="og:site_name" content="Mural">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${authorSafe} deixou uma nota no Mural">
<meta name="twitter:description" content="${textSafe}">
<meta name="twitter:image" content="${ogImageUrl}">
<meta http-equiv="refresh" content="0;url=${pageUrl}">
<style>
  body{margin:0;display:flex;align-items:center;justify-content:center;min-height:100vh;
  background:#171220;color:#f4f1ea;font-family:sans-serif;}
  .r{text-align:center;opacity:0.7;}
  .r p{margin:8px 0;}
  a{color:#c6f135;}
</style>
</head>
<body>
<div class="r">
<p>a redirecionar para o mural...</p>
<p><a href="${pageUrl}">clica aqui se não redirecionar</a></p>
</div>
<script>window.location.replace('${pageUrl}');</script>
</body>
</html>`);

  } catch (err) {
    console.error('Share page error:', err);
    return res.redirect(302, '/');
  }
}
