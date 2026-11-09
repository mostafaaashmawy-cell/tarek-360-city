const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = path.resolve(__dirname, 'brochure_print.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const pagesDir = path.resolve(__dirname, 'brochure_page_previews');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

const headMatch = html.match(/<head>[\s\S]*?<\/head>/)[0];

const pageStarts = [];
const startTag = '<div class="page';
let pos = html.indexOf(startTag);
while (pos !== -1) {
  pageStarts.push(pos);
  pos = html.indexOf(startTag, pos + 1);
}

console.log(`Found ${pageStarts.length} pages.`);

for (let i = 0; i < pageStarts.length; i++) {
  const start = pageStarts[i];
  const end = (i + 1 < pageStarts.length) ? pageStarts[i + 1] : html.indexOf('</body>');
  const pageHtml = html.substring(start, end).trim();
  const fullHtml = `<!DOCTYPE html><html lang="ar" dir="rtl">${headMatch}<body style="width:1440px;height:1018px;overflow:hidden;margin:0;padding:0;">${pageHtml}</body></html>`;
  const pageFile = path.join(pagesDir, `page_${i + 1}.html`);
  const pngFile = path.join(pagesDir, `page_${i + 1}.png`);
  fs.writeFileSync(pageFile, fullHtml, 'utf8');
  execFileSync(edgePath, [
    '--headless',
    '--disable-gpu',
    '--window-size=1440,1018',
    `--screenshot=${pngFile}`,
    pageFile,
  ]);
  console.log(`Page ${i + 1} captured (${fs.statSync(pngFile).size} bytes)`);
}
