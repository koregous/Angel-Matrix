const SF = Array.from({ length: 420 }, () => [Math.random(), Math.random(), Math.random()]),
  GAL = (() => {
    const a = [];
    for (let i = 0; i < 900; i++) {
      const arm = i % 2,
        t = Math.pow(Math.random(), 0.7) * 3.4 + 0.15,
        an = t * 1.5 + arm * PI + (Math.random() - 0.5) * 0.55;
      a.push([Math.cos(an) * t, Math.sin(an) * t, 0.45 - t * 0.09 + Math.random() * 0.15]);
    }
    return a;
  })();
function scenery(bt) {
  for (const q of SF)
    dot(q[0] * gw, q[1] * gh2, 0.08 + 0.14 * Math.abs(Math.sin(bt * 0.35 + q[2] * 40)), 3);
  {
    const cx = gw * 0.84,
      cy = gh2 * 0.17,
      sc = gw * 0.03,
      c = Math.cos(bt * 0.004),
      sn = Math.sin(bt * 0.004);
    for (const p of GAL)
      dot(
        cx + (c * p[0] - sn * p[1]) * sc,
        cy + (sn * p[0] + c * p[1]) * sc * 0.5,
        Math.max(0.08, p[2]),
        5
      );
    disc(cx, cy, 1.4 * K, 0.5, 3, 1);
  }
  {
    const R = Math.max(6, gw * 0.085),
      cx = gw * 0.1,
      cy = gh2 * 0.6 + Math.sin(bt * 0.01) * 1.5;
    for (let y = -R; y <= R; y++)
      for (let x = -R; x <= R; x++) {
        const nx = x / R,
          ny = y / R,
          d = nx * nx + ny * ny;
        if (d > 1) continue;
        const nz = Math.sqrt(1 - d),
          lit = Math.max(0, nx * 0.5 - ny * 0.45 + nz * 0.55) * (0.85 + 0.15 * Math.sin(ny * 16));
        dot(cx + x, cy + y, 0.03 + lit * 0.3, 5);
      }
    for (let i = 0; i < 420; i++) {
      const a = (i / 420) * TAU,
        x = Math.cos(a) * R * 1.75,
        y = Math.sin(a) * R * 0.38;
      if (Math.sin(a) < 0 && Math.hypot(x, y / 0.38) < R) continue;
      dot(cx + x, cy + y, 0.3, 2);
    }
  }
  {
    const cx = gw * 0.91,
      cy = gh2 * 0.56,
      Rm = Math.round(3 * K);
    for (let y = -Rm; y <= Rm; y++)
      for (let x = -Rm; x <= Rm; x++) {
        const d = Math.hypot(x, y);
        if (d <= Rm) dot(cx + x, cy + y, 0.12 + Math.max(0, (x * 0.5 - y * 0.4) / Rm) * 0.3, 3);
      }
  }
}
