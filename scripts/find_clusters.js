const sharp = require('sharp');

function rgb2hsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, v };
}

async function run() {
  const { data, info } = await sharp('public/satk-masterplan-blocks.jpg').raw().toBuffer({ resolveWithObject: true });
  const points = [];

  for (let y = 250; y < 1450; y += 3) {
    for (let x = 250; x < 2650; x += 3) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const { h, s, v } = rgb2hsv(r, g, b);

      if (s > 0.65 && v > 0.5) {
        let col = null;
        if (h >= 350 || h < 12) col = 'red';
        else if (h >= 12 && h < 38) col = 'orange';
        else if (h >= 45 && h < 70) col = 'yellow';
        else if (h >= 80 && h < 160) col = 'green';
        else if (h >= 165 && h < 205) col = 'cyan';
        else if (h >= 205 && h < 250) col = 'blue';
        else if (h >= 280 && h < 340) col = 'pink';

        if (col) {
          points.push({ x, y, col, r, g, b });
        }
      }
    }
  }

  console.log('Sampled points count:', points.length);

  // Group points into clusters by proximity
  const clusters = [];
  const visited = new Set();

  for (let i = 0; i < points.length; i++) {
    if (visited.has(i)) continue;
    const p = points[i];
    const cluster = [p];
    visited.add(i);

    const queue = [p];
    while (queue.length > 0) {
      const cur = queue.pop();
      for (let j = 0; j < points.length; j++) {
        if (!visited.has(j) && points[j].col === cur.col) {
          const dx = points[j].x - cur.x;
          const dy = points[j].y - cur.y;
          if (dx * dx + dy * dy < 85 * 85) {
            visited.add(j);
            cluster.push(points[j]);
            queue.push(points[j]);
          }
        }
      }
    }

    if (cluster.length >= 10) {
      clusters.push(cluster);
    }
  }

  console.log('Found ' + clusters.length + ' clusters:');
  clusters.forEach((c, idx) => {
    let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
    c.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });
    const cx = Math.round((minX + maxX) / 2);
    const cy = Math.round((minY + maxY) / 2);
    console.log(
      'Cluster ' + (idx + 1) + ': color=' + c[0].col +
      ' center=(' + cx + ', ' + cy + ') bounds=[' + minX + ', ' + minY + ', ' + maxX + ', ' + maxY + ']' +
      ' count=' + c.length
    );
  });
}
run();
