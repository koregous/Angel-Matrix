const BRL = [11, 6, 14];
function edgeWave(now) {
  if (!run.ip.length) return;
  const m = 2,
    x0 = m,
    x1 = gw - 1 - m,
    y0 = m,
    y1 = gh2 - 1 - m,
    st = 3,
    P = [],
    mx = Math.round((x0 + x1) / 2);
  for (let x = mx; x <= x1; x += st) P.push([x, y1, 0, -1]);
  for (let y = y1 - st; y >= y0; y -= st) P.push([x1, y, -1, 0]);
  for (let x = x1 - st; x >= x0; x -= st) P.push([x, y0, 0, 1]);
  for (let y = y0 + st; y <= y1; y += st) P.push([x0, y, 1, 0]);
  for (let x = x0 + st; x < mx; x += st) P.push([x, y1, 0, -1]);
  const N = P.length,
    ml = Math.max(4, Math.min(gw, gh2) * 0.09);
  for (const o of run.ip) {
    const a = now - o.t,
      life = o.sp ? 1.5 : 1.1;
    if (a < 0 || a > life) continue;
    const amp = (0.6 + 0.4 * o.q) * (1 - (a / life) * 0.8),
      fr = a * N * 0.55,
      wd = N * 0.1,
      c = o.sp ? 0 : BRL[o.k];
    for (let i = 0; i < N; i++) {
      const d = Math.min(i, N - i),
        e = Math.exp(-Math.pow((d - fr) / wd, 2));
      if (e < 0.05) continue;
      const h =
          0.55 * (0.5 + 0.5 * Math.sin(i * 2.3 + a * 22)) +
          0.45 * (0.5 + 0.5 * Math.sin(i * 0.9 - a * 14 + o.k * 2)),
        L = ml * amp * e * (0.4 + 0.6 * h);
      if (L < 0.8) continue;
      const p = P[i],
        qx = Math.abs(p[3]),
        qy = Math.abs(p[2]);
      for (let j = 0; j <= L; j++) {
        const v = Math.min(1, (1 - (j / (L + 1)) * 0.3) * (0.8 + 0.2 * e)),
          X = p[0] + p[2] * j,
          Y = p[1] + p[3] * j;
        dot(X, Y, v, c);
        dot(X + qx, Y + qy, v, c);
      }
    }
  }
}
