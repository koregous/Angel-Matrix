function star(cx, cy, r, v, c, rot = 0) {
  r = Math.max(1, r);
  for (let k = 0; k < 4; k++) {
    const a = rot + (k * PI) / 2,
      b = a + PI / 4;
    ln(cx, cy, cx + Math.cos(a) * r, cy + Math.sin(a) * r, v, c);
    ln(cx, cy, cx + Math.cos(b) * r * 0.5, cy + Math.sin(b) * r * 0.5, v * 0.6, c);
  }
  dot(cx, cy, v, 0);
  dot(cx + 1, cy, v, c);
  dot(cx - 1, cy, v, c);
  dot(cx, cy + 1, v, c);
  dot(cx, cy - 1, v, c);
}
function tri(ax, ay, bx, by, cx, cy, v, c) {
  const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  if (Math.abs(d) < 1e-6) return;
  const x0 = Math.floor(Math.min(ax, bx, cx)),
    x1 = Math.ceil(Math.max(ax, bx, cx)),
    y0 = Math.floor(Math.min(ay, by, cy)),
    y1 = Math.ceil(Math.max(ay, by, cy));
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++) {
      const l1 = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d,
        l2 = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
      if (l1 >= -0.03 && l2 >= -0.03 && 1 - l1 - l2 >= -0.03) dw(x, y, v, c);
    }
}
function lnw(x0, y0, x1, y1, v, c) {
  const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5) + 1;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    dw(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, v, c);
  }
}
function kite(x0, y0, ang, m, L, w, oc) {
  const dx = m * Math.cos(ang),
    dy = Math.sin(ang),
    nx = -dy,
    ny = dx,
    tx = x0 + dx * L,
    ty = y0 + dy * L + L * 0.12,
    mx = x0 + dx * L * 0.4 + 0,
    my = y0 + dy * L * 0.4,
    ax = mx + nx * w,
    ay = my + ny * w,
    bx = mx - nx * w,
    by = my - ny * w;
  tri(x0, y0, ax, ay, tx, ty, 0.8, 3);
  tri(x0, y0, bx, by, tx, ty, 0.5, 1);
  lnw(x0, y0, ax, ay, 1, oc);
  lnw(ax, ay, tx, ty, 1, oc);
  lnw(tx, ty, bx, by, 1, oc);
  lnw(bx, by, x0, y0, 1, oc);
  lnw(x0, y0, tx, ty, 0.6, oc);
}
function gem(cx, cy, r, k, now, v, oc) {
  const N = [3, 4, 6][k],
    rot = (k == 0 ? PI / 2 : k == 1 ? 0 : PI / 6) + Math.sin(now * 2 + k) * 0.3,
    sx = k == 1 ? 0.8 : 1,
    sy = k == 1 ? 1.3 : 1,
    V = [];
  for (let i = 0; i < N; i++) {
    const a = rot + (i / N) * TAU;
    V.push([cx + Math.cos(a) * r * sx, cy + Math.sin(a) * r * sy]);
  }
  for (let i = 0; i < N; i++) {
    const A = V[i],
      B = V[(i + 1) % N];
    tri(cx, cy, A[0], A[1], B[0], B[1], v * (i % 2 ? 0.85 : 0.5), i % 2 ? 3 : 1);
  }
  for (let i = 0; i < N; i++) {
    const A = V[i],
      B = V[(i + 1) % N];
    lnw(A[0], A[1], B[0], B[1], v, oc);
  }
  discw(cx, cy, Math.max(0.8, r * 0.28), v, [9, 6, 10][k], 1);
}
