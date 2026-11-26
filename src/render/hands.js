var hA = -0.55,
  hK = 1;
function hands(now, bt, gl, bump) {
  const s = gl * 0.55;
  let e = 0;
  for (let i = rays.length - 1; i >= 0; i--) {
    const r = rays[i],
      a = now - r.t;
    if (a > 0.4) break;
    e = Math.sin(PI * Math.min(1, a / 0.4));
    hK = r.k < 3 ? r.k : 1;
    break;
  }
  const wx0 = gw * 0.17,
    wy0 = gh2 * 0.9,
    tx = LXf(hK) / cs,
    ty = HYf() / cs;
  let ta = Math.atan2(ty - wy0, tx - wx0);
  ta = Math.max(-1.2, Math.min(-0.15, ta));
  hA += (ta - hA) * 0.2;
  const a = hA + Math.sin(bt * 0.9) * 0.03,
    c = Math.cos(a),
    sn = Math.sin(a),
    lun = e * s * 0.7 + Math.sin(bt * 1.3) * s * 0.05,
    wx = wx0 + c * lun,
    wy = wy0 + sn * lun,
    P = (u, v) => [wx + c * u - sn * v, wy + sn * u + c * v],
    L = (p, q, r0, r1, v, col) => limb2(p[0], p[1], q[0], q[1], r0 * s, r1 * s, v, col),
    vv = 0.65 + 0.35 * e;
  // sleeve / forearm running off the screen edge, with cuff lines
  L(P(-s * 10, 0), P(0, 0), 0.8, 0.46, 0.4, 4);
  for (const u of [-0.9, -1.25, -1.6]) {
    const A = P(u * s, -0.62 * s),
      B = P(u * s, 0.62 * s);
    {
      const m = Math.ceil(Math.hypot(B[0] - A[0], B[1] - A[1]));
      for (let i = 0; i <= m; i++)
        dw(A[0] + ((B[0] - A[0]) * i) / m, A[1] + ((B[1] - A[1]) * i) / m, 0.9, u == -0.9 ? 0 : 3);
    }
  }
  // palm + knuckle line
  L(P(0, 0), P(1.7 * s, 0), 0.44, 0.52, 0.7, 2);
  L(P(1.7 * s, -0.32 * s), P(1.7 * s, 0.44 * s), 0.17, 0.17, 0.7, 2);
  // thumb, tucked along the outer side
  {
    const t0 = P(0.45 * s, -0.4 * s),
      t1 = P(1.05 * s, -0.78 * s),
      t2 = P(1.5 * s, -0.82 * s);
    L(t0, t1, 0.2, 0.15, 0.75, 2);
    L(t1, t2, 0.15, 0.11, 0.75, 2);
  }
  // three curled fingers; the ring finger carries the red thread
  [
    [0.44, 2],
    [0.24, 1],
    [0.02, 0],
  ].forEach(([v, n]) => {
    const p0 = P(1.7 * s, v * s),
      p1 = P(2.3 * s, (v + 0.01) * s),
      p2 = P(2.2 * s, (v + 0.42) * s);
    L(p0, p1, 0.16, 0.15, 0.75, 2);
    L(p1, p2, 0.15, 0.11, 0.75, 2);
    if (n == 1) {
      ring(p1[0], p1[1], 0.2 * s, 0.9, 8);
      for (let t = 0; t <= 1; t += 0.01) {
        const x = p1[0] + Math.sin(t * 3 + bt * 0.8) * s * 0.55 * t - s * 0.2 * t,
          y = p1[1] + (t * t * 0.6 + t * 0.4) * (gh2 - p1[1]);
        dot(x, y, 0.95 - t * 0.4, 8);
        dot(x + 1, y, 0.55 - t * 0.3, 8);
      }
    }
  });
  // pointer finger: long, tapered, slight upward hook
  let q = P(1.75 * s, -0.32 * s),
    an = 0,
    ex = 1 + e * 0.14,
    R = 0.23,
    tip = q;
  const LN = [1.4, 1.05, 0.8];
  for (let j = 0; j < 3; j++) {
    an -= 0.05 * (j + 1);
    const d0 = [Math.cos(an), Math.sin(an)],
      len = LN[j] * s * ex,
      nx = [q[0] + c * d0[0] * len - sn * d0[1] * len, q[1] + sn * d0[0] * len + c * d0[1] * len],
      R2 = R * (j == 2 ? 0.72 : 0.82);
    limb2(q[0], q[1], nx[0], nx[1], R * s, R2 * s, 0.8, 2);
    q = nx;
    R = R2;
  }
  tip = q;
  if (e > 0) {
    disc(tip[0], tip[1], s * 0.4 * e, e, 0, 1);
    ring(tip[0], tip[1], s * (0.55 + e * 0.9), 0.7 * e, 0);
  }
}
function handsOld(now, bt, gl, bump) {
  const K1 = Math.max(1, Math.round(K)),
    s = gl * 0.3;
  for (const m of [-1, 1]) {
    let e = 0,
      ext = ID,
      kk = -1;
    for (let i = rays.length - 1; i >= 0; i--) {
      const r = rays[i],
        a = now - r.t;
      if (a > 0.4) break;
      if (r.k === 1 || r.k === 3 || r.k === (m < 0 ? 0 : 2)) {
        e = Math.sin(PI * Math.min(1, a / 0.4));
        ext = EX[r.k];
        kk = r.k;
        break;
      }
    }
    const px = (W / 2 + m * W * 0.34) / cs - (m * e * W * 0.05) / cs,
      py = (H * 0.8) / cs - (e * H * 0.14) / cs + Math.sin(bt * 1.3 + m) * K * 0.8,
      sp = 0.25 + 0.3 * e + (kk == 3 ? 0.15 : 0),
      v = 0.55 + 0.45 * e;
    ring(px, py, s, v * 0.8, 3);
    ring(px, py, s * 0.6, v * 0.4, 3);
    if (e > 0) {
      disc(px, py, s * 0.6 * e, e, 0, 1);
      ring(px, py, s * (1.3 + e * 0.8), 0.7 * e, 0);
    }
    for (let i = 0; i < 5; i++) {
      const an = -PI / 2 + m * (i - 2) * sp - m * 0.15,
        x = ext[i],
        L = s * (i == 0 ? 1.3 : i == 1 ? 2.1 : i == 2 ? 2.4 : i == 3 ? 2.1 : 1.6) * (0.3 + 0.7 * x),
        x0 = px + Math.cos(an) * s,
        y0 = py + Math.sin(an) * s,
        x1 = px + Math.cos(an) * (s + L),
        y1 = py + Math.sin(an) * (s + L);
      for (let d = 0; d < K1; d++) ln(x0 + d, y0, x1 + d, y1, v, x ? 0 : 3);
      dot(x1, y1, v, 0);
    }
    for (let d = 0; d < K1; d++) {
      ln(px - s * 0.6 + d, py + s, px - m * s * 0.4 - m * K * 4 + d, gh2, v * 0.4, 3);
      ln(px + s * 0.6 + d, py + s, px - m * s * 0.4 + m * K * 4 + d, gh2, v * 0.4, 3);
    }
  }
}
