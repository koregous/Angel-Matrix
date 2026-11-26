#!/usr/bin/env node
// Exports the glyph alphabet as a pixel sheet (white on black).
//   node tools/export-glyphs.js              -> docs/glyph-sheet.svg
//   node tools/export-glyphs.js --snapshot   -> also rewrites tests/fixtures/glyphs.snapshot.json
// Only run with --snapshot when you MEAN to change the glyph set.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import loadGlyphs from './load-glyphs.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const GL = await loadGlyphs();
const S = 3; // glyph grid is 3x5 points -> 7x13 pixels
const GW = S * 2 + 1,
  GH = S * 4 + 1;

function line(x0, y0, x1, y1) {
  const pts = [];
  const dx = Math.abs(x1 - x0),
    dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1,
    sy = y0 < y1 ? 1 : -1;
  let e = dx - dy;
  for (;;) {
    pts.push([x0, y0]);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * e;
    if (e2 > -dy) {
      e -= dy;
      x0 += sx;
    }
    if (e2 < dx) {
      e += dx;
      y0 += sy;
    }
  }
  return pts;
}

const COLS = 8,
  ROWS = 8,
  PAD = 3,
  Z = 14,
  M = 2;
const CW = GW + PAD * 2,
  CH = GH + PAD * 2;
const W = (COLS * CW + M * 2) * Z,
  H = (ROWS * CH + M * 2) * Z;
const rects = [];
GL.forEach((g, i) => {
  const seen = new Set();
  for (const [a, b, c, d] of g)
    for (const [x, y] of line(a * S, b * S, c * S, d * S)) seen.add(x + ',' + y);
  const ox = M + (i % COLS) * CW + PAD,
    oy = M + Math.floor(i / COLS) * CH + PAD;
  for (const k of seen) {
    const [x, y] = k.split(',').map(Number);
    rects.push(`<rect x="${(ox + x) * Z}" y="${(oy + y) * Z}" width="${Z}" height="${Z}"/>`);
  }
});
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" shape-rendering="crispEdges">` +
  `<rect width="100%" height="100%" fill="#000"/><g fill="#fff">${rects.join('')}</g></svg>`;
fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
fs.writeFileSync(path.join(root, 'docs/glyph-sheet.svg'), svg);
console.log(`wrote docs/glyph-sheet.svg (${GL.length} glyphs)`);

if (process.argv.includes('--snapshot')) {
  fs.mkdirSync(path.join(root, 'tests/fixtures'), { recursive: true });
  fs.writeFileSync(path.join(root, 'tests/fixtures/glyphs.snapshot.json'), JSON.stringify(GL));
  console.log('wrote tests/fixtures/glyphs.snapshot.json');
}
