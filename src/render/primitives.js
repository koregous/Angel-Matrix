function dot(x, y, v, c) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= gw || y >= gh2) return;
  const i = y * gw + x;
  if (v > FB[i]) {
    FB[i] = v;
    FCl[i] = c;
  }
}
function disc(cx, cy, r, v, c, gr) {
  const R = Math.ceil(r);
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      const d = Math.hypot(x, y);
      if (d <= r) dot(cx + x, cy + y, gr ? v * (1 - (0.6 * d) / r) : v, c);
    }
}
function ring(cx, cy, r, v, c, ph = 0, fn) {
  const n = Math.max(8, Math.ceil(r * 6.3));
  for (let i = 0; i < n; i++) {
    const a = ph + (i / n) * TAU;
    dot(cx + Math.cos(a) * r, cy + Math.sin(a) * r, fn ? fn(i, n) : v, c);
  }
}
function ln(x0, y0, x1, y1, v, c) {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    dot(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, v, c);
  }
}
function rect(x0, y0, x1, y1, v, c) {
  for (let y = Math.round(y0); y <= y1; y++)
    for (let x = Math.round(x0); x <= x1; x++) dot(x, y, v, c);
}
const txt = (s, x, y, c, sz = 14, al = 'center') => TQ.push([s, x, y, c, sz, al]);
function hand(x, y, n, v, c, m) {
  if (n == 0) rect(x - 3, y - 2, x + 3, y + 4, v, c);
  else {
    rect(x - 3, y, x + 3, y + 4, v, c);
    for (let i = 0; i < n; i++) {
      const fx = n > 1 ? x - 3 + (i * 6) / (n - 1) : x;
      ln(fx, y - 1, fx + (i - (n - 1) / 2) * 0.6, y - 6 - (i % 2), v, c);
    }
  }
  ln(x + 4 * m, y + 3, x + 6 * m, y - 1, v, c);
}
const bar = (v, n) => {
  const f = Math.round(Math.max(0, Math.min(1, v)) * n);
  return '[' + '#'.repeat(f) + '-'.repeat(n - f) + ']';
};
