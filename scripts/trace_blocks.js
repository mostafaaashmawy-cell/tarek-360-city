const sharp = require('sharp');
const fs = require('fs');

async function run() {
  const { data, info } = await sharp('public/satk-masterplan-blocks.jpg').raw().toBuffer({ resolveWithObject: true });

  // Let's define the search regions for each visible block on page 1 screenshot
  // We will find all saturated pixels of the specific color in that region and compute exact convex polygon!
  function getPolygon(minX, minY, maxX, maxY, targetCol) {
    const pts = [];
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const idx = (y * info.width + x) * info.channels;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const d = max - min;
        if (max === 0) continue;
        const s = d / max;
        const v = max / 255;
        let h = 0;
        if (d !== 0) {
          if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
          else if (max === g) h = (b - r) / d + 2;
          else if (max === b) h = (r - g) / d + 4;
          h *= 60;
        }

        if (s > 0.55 && v > 0.45) {
          let col = null;
          if (h >= 348 || h < 14) col = 'red';
          else if (h >= 14 && h < 40) col = 'orange';
          else if (h >= 45 && h < 75) col = 'yellow';
          else if (h >= 80 && h < 165) col = 'green';
          else if (h >= 165 && h < 205) col = 'cyan';
          else if (h >= 205 && h < 255) col = 'blue';
          else if (h >= 280 && h < 345) col = 'pink';

          if (col === targetCol) {
            pts.push({ x, y });
          }
        }
      }
    }

    if (pts.length < 8) return null;

    let bMinX = 9999, bMaxX = 0, bMinY = 9999, bMaxY = 0;
    pts.forEach(p => {
      if (p.x < bMinX) bMinX = p.x;
      if (p.x > bMaxX) bMaxX = p.x;
      if (p.y < bMinY) bMinY = p.y;
      if (p.y > bMaxY) bMaxY = p.y;
    });

    // In isometric projection (slant angle ~22 degrees):
    // Top-left, top-right, bottom-right, bottom-left
    let tl = pts[0], tr = pts[0], br = pts[0], bl = pts[0];
    let minSum = 999999, maxSum = -999999, minDiff = 999999, maxDiff = -999999;
    pts.forEach(p => {
      const sum = p.x + p.y * 1.5;
      const diff = p.x - p.y * 1.8;
      if (sum < minSum) { minSum = sum; tl = p; }
      if (sum > maxSum) { maxSum = sum; br = p; }
      if (diff > maxDiff) { maxDiff = diff; tr = p; }
      if (diff < minDiff) { minDiff = diff; bl = p; }
    });

    const cx = Math.round((bMinX + bMaxX) / 2);
    const cy = Math.round((bMinY + bMaxY) / 2);

    return {
      ptsCount: pts.length,
      center: [cx, cy],
      bounds: [bMinX, bMinY, bMaxX, bMaxY],
      tl: [tl.x, tl.y],
      tr: [tr.x, tr.y],
      br: [br.x, br.y],
      bl: [bl.x, bl.y],
      poly: `${tl.x},${tl.y} ${tr.x},${tr.y} ${br.x},${br.y} ${bl.x},${bl.y}`
    };
  }

  // Define the regions of the marked blocks
  const blocksToScan = [
    // ── Upper Right Sector ──
    { id: 'block_red_top', name: 'البلوك الأحمر (Red Block - فلل القمة)', col: 'red', hex: '#ef4444', region: [1700, 300, 2150, 560] },
    { id: 'block_green_top', name: 'البلوك الأخضر (Green Block - فلل الرويال)', col: 'green', hex: '#22c55e', region: [2050, 290, 2400, 410] },
    { id: 'block_yellow_top_corner', name: 'البلوك الأصفر الشرقي (East Yellow Block)', col: 'yellow', hex: '#eab308', region: [2350, 280, 2600, 440] },
    { id: 'block_cyan_mid_right', name: 'البلوك السماوي الشرقي (East Cyan Block)', col: 'cyan', hex: '#06b6d4', region: [1850, 440, 2300, 570] },
    { id: 'block_yellow_mid_right', name: 'البلوك الأصفر الأوسط (Mid-East Yellow Block)', col: 'yellow', hex: '#eab308', region: [1950, 540, 2450, 680] },
    { id: 'block_pink_mid_right', name: 'البلوك الوردي الشرقي (East Pink Block)', col: 'pink', hex: '#ec4899', region: [1880, 470, 2300, 690] },
    { id: 'block_yellow_east_avenue', name: 'البلوك الأصفر على البوليفارد (Avenue Yellow Block)', col: 'yellow', hex: '#eab308', region: [1800, 660, 2250, 810] },
    { id: 'block_blue_amenities', name: 'البلوك الأزرق (Blue Block - المرافق والفلل)', col: 'blue', hex: '#3b82f6', region: [1800, 740, 2100, 940] },

    // ── Frontline South Sector (Along lower avenue) ──
    { id: 'block_orange_front_right', name: 'البلوك البرتقالي الشرقي (Prime Orange Block 1)', col: 'orange', hex: '#f97316', region: [1500, 820, 1950, 1120] },
    { id: 'block_pink_front_center', name: 'البلوك الوردي الأمامي (Prime Pink Block)', col: 'pink', hex: '#ec4899', region: [1540, 830, 1920, 1110] },
    { id: 'block_orange_front_mid', name: 'البلوك البرتقالي الأوسط (Prime Orange Block 2)', col: 'orange', hex: '#f97316', region: [1300, 900, 1750, 1260] },
    { id: 'block_pink_front_west', name: 'البلوك الوردي الغربي (Prime Pink Block West)', col: 'pink', hex: '#ec4899', region: [1100, 850, 1490, 1140] },
    { id: 'block_orange_front_corner', name: 'البلوك البرتقالي الركني (Corner Orange Block)', col: 'orange', hex: '#f97316', region: [550, 780, 1420, 1420] },

    // ── Central Sector ──
    { id: 'block_cyan_center_1', name: 'البلوك السماوي الأوسط (Central Cyan Block)', col: 'cyan', hex: '#06b6d4', region: [1500, 610, 1800, 810] },
    { id: 'block_cyan_center_2', name: 'البلوك السماوي الغربي (West Central Cyan Block)', col: 'cyan', hex: '#06b6d4', region: [840, 580, 1330, 890] },
    { id: 'block_pink_center', name: 'البلوك الوردي الأوسط (Central Pink Block)', col: 'pink', hex: '#ec4899', region: [1230, 410, 1630, 650] },

    // ── North-West & West Sector ──
    { id: 'block_cyan_north_west', name: 'البلوك السماوي الشمالي (North-West Cyan Block)', col: 'cyan', hex: '#06b6d4', region: [700, 310, 1140, 440] },
    { id: 'block_yellow_west_row', name: 'البلوك الأصفر الغربي (West Yellow Block)', col: 'yellow', hex: '#eab308', region: [500, 400, 960, 680] },
    { id: 'block_pink_west_cluster', name: 'البلوك الوردي الغربي (West Pink Block)', col: 'pink', hex: '#ec4899', region: [730, 510, 1180, 800] },
    { id: 'block_yellow_west_perimeter', name: 'البلوك الأصفر المحيطي (Perimeter Yellow Block)', col: 'yellow', hex: '#eab308', region: [200, 600, 540, 960] },
    { id: 'block_cyan_west_corner', name: 'البلوك السماوي الركني (Corner Cyan Block)', col: 'cyan', hex: '#06b6d4', region: [320, 640, 580, 890] },
  ];

  const found = [];
  blocksToScan.forEach(b => {
    const res = getPolygon(b.region[0], b.region[1], b.region[2], b.region[3], b.col);
    if (res) {
      console.log(`FOUND ${b.id} (${b.col}): count=${res.ptsCount}, center=(${res.center[0]}, ${res.center[1]}), poly="${res.poly}"`);
      found.push({ ...b, ...res });
    } else {
      console.log(`NOT FOUND ${b.id} (${b.col}) in region [${b.region}]`);
    }
  });

  fs.writeFileSync('scripts/verified_blocks.json', JSON.stringify(found, null, 2));
}
run();
