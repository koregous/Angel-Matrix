function dw(x, y, v, c) {
  x = Math.round(x);
  y = Math.round(y);
  if (x < 0 || y < 0 || x >= gw || y >= gh2) return;
  const i = y * gw + x;
  FB[i] = v;
  FCl[i] = c;
}
function discw(cx, cy, r, v, c, gr) {
  const R = Math.ceil(r);
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      const d = Math.hypot(x, y);
      if (d <= r) dw(cx + x, cy + y, gr ? v * (1 - (0.5 * d) / r) : v, c);
    }
}
function limb2(x0, y0, x1, y1, r0, r1, v, c, ol, ov) {
  const n = Math.max(
    2,
    Math.ceil(Math.hypot(x1 - x0, y1 - y0) / Math.max(0.7, Math.min(r0, r1) * 0.5))
  );
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    discw(
      x0 + (x1 - x0) * t,
      y0 + (y1 - y0) * t,
      r0 + (r1 - r0) * t + 1.3,
      ov === undefined ? 1 : ov,
      ol || 0,
      0
    );
  }
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    discw(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r0 + (r1 - r0) * t, v, c, 1);
  }
}
function limb(x0, y0, x1, y1, r0, r1, v, c) {
  const n = Math.max(
    2,
    Math.ceil(Math.hypot(x1 - x0, y1 - y0) / Math.max(0.7, Math.min(r0, r1) * 0.55))
  );
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    disc(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, r0 + (r1 - r0) * t, v, c, 1);
  }
}
