const sharp = require('sharp');
const fs = require('fs');

async function findClusters() {
  const { data, info } = await sharp('public/satk-masterplan-blocks.jpg').raw().toBuffer({ resolveWithObject: true });

  const dots = [];
  for (let y = 150; y < 1450; y += 2) {
    for (let x = 150; x < 2650; x += 2) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];

      let col = null;
      let hex = null;

      // Pure Red dots
      if (r > 180 && g < 75 && b < 75) {
        col = 'red'; hex = '#ef4444';
      }
      // Bright Green dots
      else if (g > 180 && g > r + 50 && g > b + 50) {
        col = 'green'; hex = '#22c55e';
      }
      // Bright Yellow dots
      else if (r > 190 && g > 175 && b < 100) {
        col = 'yellow'; hex = '#eab308';
      }
      // Sky / Cyan dots
      else if (b > 165 && g > 140 && b > r + 30 && g > r + 20) {
        col = 'cyan'; hex = '#06b6d4';
      }
      // Magenta / Pink dots
      else if (r > 180 && g < 100 && b > 120) {
        col = 'pink'; hex = '#ec4899';
      }
      // Orange dots
      else if (r > 200 && g >= 85 && g <= 165 && b < 65) {
        col = 'orange'; hex = '#f97316';
      }
      // Royal Blue dots
      else if (b > 180 && b > r + 80 && b > g + 40 && r < 90) {
        col = 'blue'; hex = '#3b82f6';
      }

      if (col) {
        dots.push({ x, y, col, hex });
      }
    }
  }

  console.log('Total dots:', dots.length);

  // Use a spatial grid to make clustering fast O(N)
  const cellSize = 65;
  const grid = new Map();
  dots.forEach((d, idx) => {
    const gx = Math.floor(d.x / cellSize);
    const gy = Math.floor(d.y / cellSize);
    const key = gx + '_' + gy;
    if (!grid.has(key)) grid.set(key, []);
    grid.get(key).push(idx);
  });

  const visited = new Uint8Array(dots.length);
  const clusters = [];

  for (let i = 0; i < dots.length; i++) {
    if (visited[i]) continue;
    const root = dots[i];
    const group = [root];
    visited[i] = 1;
    const queue = [root];

    while (queue.length > 0) {
      const cur = queue.pop();
      const gx = Math.floor(cur.x / cellSize);
      const gy = Math.floor(cur.y / cellSize);

      // Check neighbor cells
      for (let nx = gx - 1; nx <= gx + 1; nx++) {
        for (let ny = gy - 1; ny <= gy + 1; ny++) {
          const nkey = nx + '_' + ny;
          const cellIndices = grid.get(nkey);
          if (!cellIndices) continue;

          for (const j of cellIndices) {
            if (!visited[j] && dots[j].col === cur.col) {
              const dx = dots[j].x - cur.x;
              const dy = dots[j].y - cur.y;
              if (dx * dx + dy * dy <= 70 * 70) {
                visited[j] = 1;
                group.push(dots[j]);
                queue.push(dots[j]);
              }
            }
          }
        }
      }
    }

    if (group.length >= 25) {
      clusters.push({
        col: root.col,
        hex: root.hex,
        count: group.length,
        points: group
      });
    }
  }

  console.log('Found ' + clusters.length + ' clusters:');
  const results = [];
  clusters.forEach((c, i) => {
    let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
    c.points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });
    console.log('[' + (i+1) + '] ' + c.col + ' (' + c.count + ' pts) -> X:[' + minX + ', ' + maxX + '] Y:[' + minY + ', ' + maxY + '] center: [' + Math.round((minX+maxX)/2) + ', ' + Math.round((minY+maxY)/2) + ']');
    results.push({
      id: 'cluster_' + (i + 1),
      col: c.col,
      hex: c.hex,
      count: c.count,
      bounds: [minX, minY, maxX, maxY],
      center: [Math.round((minX+maxX)/2), Math.round((minY+maxY)/2)],
      points: c.points
    });
  });

  fs.writeFileSync('scripts/exact_clusters.json', JSON.stringify(results, null, 2));
}

findClusters();
