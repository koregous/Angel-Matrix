const EX = [
    [0, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
  ],
  ID = [0.3, 0.4, 0.45, 0.4, 0.3];
// Handed from the boss draw to drawHub() and drawTwinkles() within one frame.
const hub = {
  sprite: null, // what drawHub() should draw (frame, position, size, colour)
  glint: null, // [x, y] for the twinkle glint on the hub
};
function hsm(FA, w, h, u, v) {
  if (u < 0 || v < 0 || u > w - 1 || v > h - 1) return 0;
  const x0 = u | 0,
    y0 = v | 0,
    x1 = Math.min(w - 1, x0 + 1),
    y1 = Math.min(h - 1, y0 + 1),
    fx = u - x0,
    fy = v - y0;
  return (
    (FA[y0 * w + x0] * (1 - fx) + FA[y0 * w + x1] * fx) * (1 - fy) +
    (FA[y1 * w + x0] * (1 - fx) + FA[y1 * w + x1] * fx) * fy
  );
}
const B8 = (() => {
  let m = [[0]];
  for (let z = 1; z < 8; z *= 2) {
    const n = m.length,
      N = [];
    for (let y = 0; y < 2 * n; y++) {
      N.push([]);
      for (let x = 0; x < 2 * n; x++)
        N[y].push(
          m[y % n][x % n] * 4 +
            [
              [0, 2],
              [3, 1],
            ][y >= n ? 1 : 0][x >= n ? 1 : 0]
        );
    }
    m = N;
  }
  return m.map((r) => r.map((v) => (v + 0.5) / 64));
})();
function drawHub() {
  const d = hub.sprite;
  hub.sprite = null;
  if (!d) return;
  const half = d.S * cs,
    n = Math.round((2 * half) / Math.max(1.6, cs * 0.6)),
    p = (2 * half) / n,
    cx = d.x * cs,
    cy = d.y * cs,
    sz = Math.max(d.w, d.h),
    T = performance.now() / 1000,
    { FA, w, h } = d,
    smp = (u, v) => {
      if (u < 0 || v < 0 || u > w - 1 || v > h - 1) return 0;
      const x0 = u | 0,
        y0 = v | 0,
        x1 = Math.min(w - 1, x0 + 1),
        y1 = Math.min(h - 1, y0 + 1),
        fx = u - x0,
        fy = v - y0;
      return (
        (FA[y0 * w + x0] * (1 - fx) + FA[y0 * w + x1] * fx) * (1 - fy) +
        (FA[y1 * w + x0] * (1 - fx) + FA[y1 * w + x1] * fx) * fy
      );
    },
    on = new Path2D(),
    dim = new Path2D(),
    gl = [];
  if (!FON())
    for (let j = 0; j < n; j++)
      for (let i = 0; i < n; i++) {
        const v = Math.pow(
            smp(((i + 0.5) / n - 0.5) * sz + w / 2, ((j + 0.5) / n - 0.5) * sz + h / 2),
            0.9
          ),
          th = B8[j & 7][i & 7] * 0.92 + 0.04,
          x = cx + (i + 0.5 - n / 2) * p,
          y = cy + (j + 0.5 - n / 2) * p;
        if (v > th) {
          on.moveTo(x + p * 0.38, y);
          on.arc(x, y, p * 0.38, 0, TAU);
        } else if (v * 2.1 > th) {
          dim.moveTo(x + p * 0.2, y);
          dim.arc(x, y, p * 0.2, 0, TAU);
        }
      }
  {
    const hx = PAL[d.c] || PAL[0],
      r0 = [1, 3, 5].map((k) => parseInt(hx.slice(k, k + 2), 16)),
      kk = Math.max(1, 235 / Math.max(1, ...r0)),
      c3 = r0.map((v) => Math.min(255, Math.round(v * kk))),
      GR = half * 1.9,
      ga = (0.3 + 0.35 * (d.l || 0)) * (0.88 + 0.12 * Math.sin(T * 2)),
      rc = 'rgba(' + c3 + ',',
      gg = g.createRadialGradient(cx, cy, 0, cx, cy, GR);
    gg.addColorStop(0, rc + ga + ')');
    gg.addColorStop(0.5, rc + ga * 0.35 + ')');
    gg.addColorStop(1, rc + '0)');
    g.save();
    g.globalCompositeOperation = 'screen';
    g.fillStyle = gg;
    g.fillRect(cx - GR, cy - GR, GR * 2, GR * 2);
    g.restore();
    if (!FON()) {
      g.fillStyle = 'rgb(' + c3.map((v) => Math.round(v * 0.5)) + ')';
      g.fill(dim);
      g.fillStyle = 'rgb(' + c3.map((v) => Math.round(v + (255 - v) * 0.25)) + ')';
      g.fill(on);
    }
  }
}
