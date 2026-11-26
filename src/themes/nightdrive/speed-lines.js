var SPD = 0.35,
  RPH = 0,
  SPH = 0,
  SPT = 0;
const STK = Array.from({ length: 72 }, () => ({
  a: Math.random() * TAU,
  p: Math.random(),
  s: 0.7 + Math.random() * 0.6,
}));
function speedUpd(now) {
  const dt = Math.min(0.05, Math.max(0, now - SPT));
  SPT = now;
  const tg =
    (0.35 + Math.min(1, run.combo * 0.02) + cam.boost * 2.5) *
    (run.inv > 0.12 && run.fc === 4 ? 0.3 : 1);
  SPD += (tg - SPD) * Math.min(1, dt * 3);
  RPH += SPD * dt * 5;
  SPH += SPD * dt * 0.7;
}
function speedLines(fx, fy) {
  if (run.theme !== 1) return;
  const X = fx / cs,
    Y = fy / cs,
    Rm = Math.hypot(gw, gh2) * 0.75,
    len = 0.05 + Math.min(0.14, SPD * 0.1),
    LW = LWf(),
    hy = HYf(),
    qm = (H - fy) / (hy - fy),
    rx = (o, q) => fx + (W / 2 - fx) * q + o * LW * (FARf + (1 - FARf) * q) + SHf(q),
    ry = (q) => fy + (hy - fy) * q;
  let i = 0;
  for (const t of STK) {
    i++;
    const r = (t.p + SPH * t.s) % 1,
      v = Math.min(1, 0.15 + 0.6 * r * (0.5 + SPD * 0.5)),
      c = i % 2 ? 13 : 11,
      d0 = Rm * (0.1 + 0.9 * Math.pow(r, 1.7)),
      d1 = Rm * (0.1 + 0.9 * Math.pow(Math.min(1, r + len), 1.7));
    if (Math.sin(t.a) < 0) {
      ln(
        X + Math.cos(t.a) * d0,
        Y + Math.sin(t.a) * d0 * 1.25,
        X + Math.cos(t.a) * d1,
        Y + Math.sin(t.a) * d1 * 1.25,
        v,
        c
      );
      continue;
    }
    const k = t.a / PI - 0.5,
      o = k * 12;
    if (Math.abs(o) < 2.9) continue;
    const q0 = qm * Math.pow(r, 2.2),
      q1 = qm * Math.pow(Math.min(1, r + len), 2.2);
    ln(rx(o, q0) / cs, PYf(o, q0) / cs, rx(o, q1) / cs, PYf(o, q1) / cs, v, c);
  }
}
function bkOff(bt) {
  return run.theme === 1 ? W * 0.17 : 0;
}
