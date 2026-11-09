const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, '../out');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  
  let filePath = path.join(outDir, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + reqPath);
  }
});

server.listen(4567, () => {
  console.log('Server started on 4567');
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const screenshotPath = path.resolve(__dirname, 'test_analytics.png');
  const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1400,900 --screenshot="${screenshotPath}" "http://localhost:4567/admin/analytics.html"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Screenshot captured:', fs.existsSync(screenshotPath), fs.statSync(screenshotPath).size);
  } catch (err) {
    console.error('Capture error:', err);
  } finally {
    server.close();
  }
});
