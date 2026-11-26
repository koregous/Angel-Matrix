// Guards the glyph alphabet. The glyphs come from a seeded generator, so any change to the
// seed, the algorithm or the order of random calls would silently redraw every glyph.
// If you changed them on purpose: node tools/export-glyphs.js --snapshot
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import loadGlyphs from '../tools/load-glyphs.js';

const GL = await loadGlyphs();
const snap = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/glyphs.snapshot.json'),
    'utf8'
  )
);
let fail = 0;
const check = (ok, msg) => {
  console.log((ok ? 'PASS ' : 'FAIL ') + msg);
  if (!ok) fail++;
};

check(GL.length === 64, 'there are 64 glyphs');
check(JSON.stringify(GL) === JSON.stringify(snap), 'glyph set matches the saved snapshot');
check(
  GL.every(
    (g) =>
      g.length >= 3 &&
      g.every(
        ([a, b, c, d]) =>
          a >= 0 && a <= 2 && c >= 0 && c <= 2 && b >= 0 && b <= 4 && d >= 0 && d <= 4
      )
  ),
  'every stroke stays inside the 3x5 grid'
);
process.exit(fail ? 1 : 0);
