const sharp = require('sharp');
const fs = require('fs');

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

  // Step 2 pixels for precision
  for (let y = 200; y < 1500; y += 2) {
    for (let x = 200; x < 2700; x += 2) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const { h, s, v } = rgb2hsv(r, g, b);

      // Dash lines have high saturation s > 0.55 and v > 0.45
      if (s > 0.55 && v > 0.45) {
        let col = null;
        let hex = null;
        // Red
        if (h >= 350 || h < 14) { col = 'red'; hex = '#ef4444'; }
        // Orange
        else if (h >= 14 && h < 38) { col = 'orange'; hex = '#f97316'; }
        // Yellow
        else if (h >= 45 && h < 75) { col = 'yellow'; hex = '#eab308'; }
        // Green
        else if (h >= 80 && h < 165) { col = 'green'; hex = '#22c55e'; }
        // Cyan / Sky
        else if (h >= 165 && h < 205) { col = 'cyan'; hex = '#06b6d4'; }
        // Blue
        else if (h >= 205 && h < 255) { col = 'blue'; hex = '#3b82f6'; }
        // Pink / Magenta
        else if (h >= 280 && h < 345) { col = 'pink'; hex = '#ec4899'; }

        if (col) {
          points.push({ x, y, col, hex });
        }
      }
    }
  }

  console.log('Detected points count:', points.length);

  // Let's cluster points of SAME color that are close to each other (distance < 50px)
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
          if (dx * dx + dy * dy < 55 * 55) {
            visited.add(j);
            cluster.push(points[j]);
            queue.push(points[j]);
          }
        }
      }
    }

    if (cluster.length >= 15) {
      clusters.push(cluster);
    }
  }

  console.log('Identified ' + clusters.length + ' distinct color clusters.');

  // For each cluster, compute convex hull or oriented bounding box
  const results = [];
  clusters.forEach((c, idx) => {
    let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
    c.forEach(pt => {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    });

    // In isometric projection, blocks are tilted parallelograms!
    // Let's find top-left, top-right, bottom-right, bottom-left points
    // Sort points by x + y, x - y, -x + y, -x - y
    let pTopLeft = c[0], pTopRight = c[0], pBottomRight = c[0], pBottomLeft = c[0];
    let minSum = 99999, maxSum = -99999, minDiff = 99999, maxDiff = -99999;

    c.forEach(pt => {
      // In isometric: top vertex has minimal y (or minimal y - x/2)
      const sum = pt.x + pt.y;
      const diff = pt.x - pt.y;
      if (sum < minSum) { minSum = sum; pTopLeft = pt; }
      if (sum > maxSum) { maxSum = sum; pBottomRight = pt; }
      if (diff > maxDiff) { maxDiff = diff; pTopRight = pt; }
      if (diff < minDiff) { minDiff = diff; pBottomLeft = pt; }
    });

    const cx = Math.round((minX + maxX) / 2);
    const cy = Math.round((minY + maxY) / 2);

    results.push({
      id: 'cluster_' + (idx + 1),
      col: c[0].col,
      hex: c[0].hex,
      count: c.length,
      center: [cx, cy],
      bounds: [minX, minY, maxX, maxY],
      corners: [
        [pTopLeft.x, pTopLeft.y],
        [pTopRight.x, pTopRight.y],
        [pBottomRight.x, pBottomRight.y],
        [pBottomLeft.x, pBottomLeft.y],
      ]
    });
  });

  fs.writeFileSync('scripts/detected_blocks.json', JSON.stringify(results, null, 2));
  console.log('Saved to scripts/detected_blocks.json');
}
run();
