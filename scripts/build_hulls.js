const fs = require('fs');
const sharp = require('sharp');

// Monotone chain 2D convex hull
function convexHull(pts) {
  if (pts.length <= 2) return pts;
  const points = [...pts].sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  function cross(o, a, b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  const lower = [];
  for (const p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

// Simplify polygon using Douglas-Peucker to remove redundant collinear points
function perpendicularDistance(p, p1, p2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const mag = Math.hypot(dx, dy);
  if (mag === 0) return Math.hypot(p.x - p1.x, p.y - p1.y);
  return Math.abs(dy * p.x - dx * p.y + p2.x * p1.y - p2.y * p1.x) / mag;
}

function douglasPeucker(pts, epsilon = 6) {
  if (pts.length <= 2) return pts;
  let dmax = 0;
  let index = 0;
  const end = pts.length - 1;

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistance(pts[i], pts[0], pts[end]);
    if (d > dmax) {
      index = i;
      dmax = d;
    }
  }

  if (dmax > epsilon) {
    const rec1 = douglasPeucker(pts.slice(0, index + 1), epsilon);
    const rec2 = douglasPeucker(pts.slice(index), epsilon);
    return rec1.slice(0, -1).concat(rec2);
  } else {
    return [pts[0], pts[end]];
  }
}

async function run() {
  const data = JSON.parse(fs.readFileSync('scripts/exact_clusters.json'));
  console.log('Processing ' + data.length + ' clusters...');

  const verified = [];

  data.forEach((c, idx) => {
    const hull = convexHull(c.points);
    // simplify hull to retain key corners while following exact contour
    const closedHull = [...hull, hull[0]];
    const simplified = douglasPeucker(closedHull, 7).slice(0, -1);

    const polyString = simplified.map(p => `${Math.round(p.x)},${Math.round(p.y)}`).join(' ');
    
    // Center point
    let sumX = 0, sumY = 0;
    simplified.forEach(p => { sumX += p.x; sumY += p.y; });
    const cx = Math.round(sumX / simplified.length);
    const cy = Math.round(sumY / simplified.length);

    console.log(`Cluster ${idx+1} [${c.col}]: ${simplified.length} vertices, center: [${cx}, ${cy}]`);
    console.log(`  Poly: ${polyString}`);

    verified.push({
      id: c.id,
      col: c.col,
      hex: c.hex,
      count: c.count,
      verticesCount: simplified.length,
      center: [cx, cy],
      polygon: polyString,
      points: simplified
    });
  });

  fs.writeFileSync('scripts/convex_hull_blocks.json', JSON.stringify(verified, null, 2));

  // Generate an SVG visualization to inspect
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2752 1536" width="2752" height="1536">
    <image href="satk-masterplan-blocks.jpg" width="2752" height="1536" />
  `;

  verified.forEach(b => {
    svg += `
    <polygon points="${b.polygon}" fill="${b.hex}50" stroke="${b.hex}" stroke-width="4" />
    <circle cx="${b.center[0]}" cy="${b.center[1]}" r="14" fill="${b.hex}" stroke="#fff" stroke-width="3" />
    <text x="${b.center[0]}" y="${b.center[1] - 20}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#fff" stroke="#000" stroke-width="2" text-anchor="middle">${b.col}</text>
    `;
  });
  svg += `</svg>`;

  fs.writeFileSync('public/test_hulls.svg', svg);
  console.log('Saved test_hulls.svg');
}

run();
