function glyph(k, cx, cy, h, v, c) {
  const s = h / 6,
    t = h < 8 ? 1 : Math.max(1, Math.round(K * 0.9));
  for (const P of GLY[k])
    for (let i = 0; i < P.length - 1; i++)
      for (let a = 0; a < t; a++)
        for (let b = 0; b < t; b++)
          ln(
            cx + (P[i][0] - 2) * s + a,
            cy + (P[i][1] - 3) * s + b,
            cx + (P[i + 1][0] - 2) * s + a,
            cy + (P[i + 1][1] - 3) * s + b,
            v,
            c
          );
}
function npos(w, now) {
  const [fx, fy] = fp(),
    p = (now - run.OFF - (w.at - w.lead * SPB)) / (w.lead * SPB),
    q = Math.pow(Math.max(p, 0), 2.6),
    cx = fx + (W / 2 - fx) * q;
  return {
    x: (w.k < 3 ? cx + LOf(w.k) * LWf() * (FARf + (1 - FARf) * q) : cx) + SHf(q),
    y: PYf(w.k < 3 ? LOf(w.k) : 0, q),
    q,
  };
}
