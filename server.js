const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Ignorar favicon
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Manejo especial para formularios POST de contacto
  if (req.method === 'POST' && req.url === '/contacto') {
    let body = '';
    req.on('data', chunk => (body += chunk.toString()));
    req.on('end', () => {
      console.log('Datos recibidos:', body);
      // Redirige a la página de confirmación
      res.writeHead(302, { Location: '/confirmacion.html' });
      res.end();
    });
    return;
  }

  // Determinar la ruta del archivo
  const urlPath = req.url === '/' ? '/index.html' : req.url.split('?')[0];
  const filePath = path.join(__dirname, 'public', urlPath);

  console.log('Ruta solicitada:', filePath);

  // Si es un directorio, error
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('Error del servidor: se intentó leer un directorio');
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 - Archivo no encontrado</h1>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>500 - Error del servidor</h1>');
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const tipos = {
        '.html': 'text/html; charset=utf-8',
        '.js':   'text/javascript; charset=utf-8',
        '.css':  'text/css; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png':  'image/png',
        '.jpg':  'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif':  'image/gif',
        '.svg':  'image/svg+xml',
        '.webp': 'image/webp',
        '.ico':  'image/x-icon'
      };
      const contentType = tipos[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});