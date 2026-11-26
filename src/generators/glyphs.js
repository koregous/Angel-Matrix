import { mul } from './rng.js';

export const GL = (() => {
  const r = mul(7),
    a = [];
  for (let i = 0; i < 64; i++) {
    const g = [];
    let x = (r() * 3) | 0,
      y = (r() * 5) | 0;
    const n = 3 + ((r() * 3) | 0);
    for (let j = 0; j < n; j++) {
      let nx = Math.max(0, Math.min(2, x + (((r() * 3) | 0) - 1))),
        ny = Math.max(0, Math.min(4, y + (((r() * 5) | 0) - 2)));
      if (nx == x && ny == y) ny = y < 2 ? y + 2 : y - 2;
      g.push([x, y, nx, ny]);
      x = nx;
      y = ny;
      if (r() < 0.2) {
        x = (r() * 3) | 0;
        y = (r() * 5) | 0;
      }
    }
    if (r() < 0.35) g.push([0, 0, 2, 0]);
    if (r() < 0.25) g.push([1, 0, 1, 1]);
    if (r() < 0.3) {
      const dx = (r() * 3) | 0;
      g.push([dx, 4, dx, 4]);
    }
    a.push(g);
  }
  return a;
})();
