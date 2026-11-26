function roadDraw(now, bt, fx, fy, bump) {
  const LW = LWf(),
    hy = HYf(),
    qm = (H - fy) / (hy - fy),
    rx = (o, q) => fx + (W / 2 - fx) * q + o * LW * (FARf + (1 - FARf) * q) + SHf(q),
    ry = (q) => fy + (hy - fy) * q,
    hm = HMf(),
    py = (o, q) => fy + (hy - fy) * q + hm * q * o * LW * (FARf + (1 - FARf) * q),
    L = (o, q0, q1, v, c) =>
      ln(rx(o, q0) / cs, py(o, q0) / cs, rx(o, q1) / cs, py(o, q1) / cs, v, c),
    u = RPH % 1,
    fyc = fy / cs;
  ln(0, fyc, gw, fyc, 0.55, 13);
  for (let x = 0; x < gw; x += 2) {
    const hh =
      (Math.sin(x * 0.21) + Math.sin(x * 0.083 + 1.7) * 1.4 + Math.sin(x * 0.5) * 0.4 + 2.4) *
      gh2 *
      0.011 *
      Math.min(1, Math.abs(x * cs - fx) / (W * 0.12));
    if (hh > 0.6) {
      ln(x, fyc, x, fyc - hh, 0.28, 14);
      dot(x, fyc - hh, 0.5, 14);
    }
  }
  for (let n = 0; n < 14; n++) {
    const s = (n + u) / 14,
      q = Math.pow(s, 2.2) * qm,
      v = 0.16 + 0.5 * s,
      xl = rx(-2.6, q),
      xr = rx(2.6, q),
      yy = (x) => (ry(q) + hm * q * (x - rx(0, q))) / cs;
    ln(0, yy(0), xl / cs - 1, yy(xl), v, 13);
    ln(xr / cs + 1, yy(xr), gw, yy(gw * cs), v, 13);
  }
  {
    const sp = Math.ceil(W / LW / 0.8) + 2;
    for (let k = -sp; k <= sp; k++) {
      const o = k * 0.8;
      if (Math.abs(o) < 3.2) continue;
      for (let i = 0; i < 8; i++) {
        const q0 = (qm * i) / 8,
          q1 = (qm * (i + 1)) / 8;
        ln(
          rx(o, q0) / cs,
          py(o, q0) / cs,
          rx(o, q1) / cs,
          py(o, q1) / cs,
          Math.min(1, 0.15 + (0.55 * (i + 1)) / 8 + bump * 0.08),
          13
        );
      }
    }
  }
  for (let q = 0; q < qm; q += 0.04) {
    const v = Math.min(1, 0.3 + q + bump * 0.3);
    L(-2.5, q, q + 0.04, v, 11);
    L(2.5, q, q + 0.04, v, 13);
  }
  const N = 16;
  for (let n = 0; n < N; n++) {
    const s = (n + u) / N,
      q0 = Math.pow(s, 2.2) * qm,
      q1 = Math.pow(Math.min(1, s + 0.45 / N), 2.2) * qm;
    for (const o of [-0.8, 0.8]) L(o, q0, q1, 0.35 + 0.65 * Math.min(1, q0), 3);
  }
  for (let n = 0; n < 10; n++) {
    const s = (n + u) / 10,
      q = Math.pow(s, 2.2) * qm,
      h = (0.02 + q * 0.1) * gh2;
    for (const sd of [-1, 1]) {
      const x = rx(3.4 * sd, q) / cs,
        y = py(3.4 * sd, q) / cs;
      ln(x, y, x, y - h, 0.7, 12);
      dot(x, y - h, 1, 0);
    }
  }
}
