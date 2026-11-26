// Loads the glyph generator (src/generators/glyphs.js, an ES module) and returns the 64 glyphs.
// Used by the export tool and the test.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

export default async function loadGlyphs() {
  const url = pathToFileURL(path.join(root, 'src/generators/glyphs.js')).href;
  const { GL } = await import(url);
  return GL;
}
