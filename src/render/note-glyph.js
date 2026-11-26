function nglyph(cx, cy, r, w, now, v, oc) {
  if (w.g === undefined) w.g = (Math.random() * GL.length) | 0;
  const KR = Math.max(1, Math.round(K)),
    h = r * 1.7,
    lc = [9, 6, 10][w.k];
  ring(cx, cy, r * 1.25, v * 0.55, lc);
  if (r > 6) ring(cx, cy, r * 1.5, v * 0.25, lc, now);
  for (let d = 0; d < KR; d++) gly(cx + d, cy, h, w.g, v, oc);
}
