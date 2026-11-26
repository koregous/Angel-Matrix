// Background drift and the focal point the scene is drawn from. One object, like `cam`, so
// main.js can write it and the render files can read it.
const bg = {
  x: 0, y: 0, // offset applied to the background layers
  px: 0, py: 0, // drift position
  vx: 0, vy: 0, // drift velocity
  tx: 0, ty: 0, // target velocity
  t: 0, // seconds until a new target is picked
  focus: [innerWidth / 2, innerHeight * 0.34],
};
var dxp = 0,
  dxv = 0;
const fp = () => bg.focus,
  tp = () => [W / 2, H * 0.7],
  GS = () => H * 0.38;
function pos(w, i, now) {
  const [x, y] = fp();
  if (w.ty) {
    const [tx, ty] = tp(),
      ts = w.ts[i],
      p = (now - (ts - w.lead * SPB)) / (w.lead * SPB),
      q = Math.pow(Math.max(p, 0), 1.9);
    return { x: x + (tx - x) * q, y: y + (ty - y) * q, q };
  }
  const p = (now - (w.at - w.lead * SPB)) / (w.lead * SPB),
    q = Math.pow(Math.max(p, 0), 1.9),
    gh = GS();
  return { x: x + w.P[i][0] * gh * q, y: y + w.P[i][1] * gh * q, q };
}
function spark(x, y, c, n, m = 1) {
  return;
  for (let j = 0; j < n; j++) {
    const a = Math.random() * TAU,
      s = (2 + Math.random() * 7) * m;
    run.pt.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      c,
      l: 1,
      g: (Math.random() * GL.length) | 0,
      h: (5 + Math.random() * 6) * (m > 1.5 ? 1.3 : 1),
    });
  }
}
function vib(p) {
  try {
    navigator.vibrate && navigator.vibrate(p);
  } catch (e) {}
}
function impact(k, q, now, x, y) {
  const sp = k === 3,
    s = sp ? 1 : q;
  run.hubT = now;
  run.hubQ = s;
  run.hubK = k;
  // vibration
  vib(sp ? [50, 25, 30] : q >= 1 ? 18 : q >= 0.75 ? 12 : 7);
  // visual: spring slam + zoom punch + shockwave + flash
  dxv += (k < 3 ? k - 1 : 0) * W * 0.01 + (Math.random() - 0.5) * W * 0.012;
  cam.kv += sp ? 0.45 : 1.1 * s;
  cam.zv += sp ? 0.3 : 0.6 * s;
  cam.flash = Math.max(cam.flash, sp ? 0.25 : 0.2 * s);
  ip.push({ k, q: s, t: now, x, y, sp });
  rays.push({ t: now, k });
  if (sp) cam.boost = 1;
  if (rays.length > 8) rays.shift();
  if (ip.length > 8) ip.shift();
  spark(x, y, 9, sp ? 50 : 22, sp ? 2 : 1.3);
  spark(x, y, 10, sp ? 36 : 14, sp ? 2.8 : 1.8);
  if (sp) spark(x, y, 0, 70, 2.2);
  if (sp) {
    spark(x, y, 2, 30, 1.6);
    spark(x, y, 3, 24, 2.6);
  }
}
