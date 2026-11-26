function orb(cx, cy, r, v, c) {
  disc(cx, cy, r * 0.45, v, c, 1);
  ring(cx, cy, r, v * 0.85, 3);
  ring(cx, cy, r * 0.72, v * 0.5, c, 0, (i, n) => (i % 2 ? v * 0.5 : 0));
}
function angel(bt, FX, FY, bump) {
  const bp = ((bt % 1) + 1) % 1,
    R = gh2 * 0.3,
    L = Math.hypot(gw, gh2);
  for (let i = 0; i < 8; i++) {
    const a = -PI * (0.1 + (0.8 * i) / 7);
    ln(
      FX + Math.cos(a) * R * 0.3,
      FY + Math.sin(a) * R * 0.3,
      FX + Math.cos(a) * L * 0.6,
      FY + Math.sin(a) * L * 0.6,
      0.03 + 0.14 * bump,
      6
    );
  }
  ring(FX, FY, R * (0.3 + 0.9 * bp), 0.45 * (1 - bp), 6);
  for (let k = 0; k < 4; k++)
    ln(0, FY - k * 1.6 * K, gw, FY - k * 1.6 * K, (0.16 - k * 0.035) * (0.6 + bump * 0.8), 6);
  for (let i = 0; i < 8; i++) {
    const s = (i * 0.618) % 1,
      x = (((s * gw + i * 91) % gw) + gw) % gw,
      y = ((i * 0.37 + bt * 0.02 * (0.5 + s)) % 1) * gh2;
    ln(x, y, x + 1.5 * K, y + 4 * K, 0.4, 0);
    ln(x + 0.5 * K, y + 1.5 * K, x - 1.2 * K, y + 2.2 * K, 0.25, 3);
  }
}
function angelOld(bt, FX, FY, bump) {
  const R = gh2 * 0.3,
    L = Math.hypot(gw, gh2);
  for (let i = 0; i < 18; i++) {
    const a = -PI * (0.04 + (0.92 * i) / 17),
      w = 0.5 + 0.5 * Math.sin(bt * 0.4 + i * 1.7);
    ln(
      FX + Math.cos(a) * R * 0.3,
      FY + Math.sin(a) * R * 0.3,
      FX + Math.cos(a) * L * 0.7,
      FY + Math.sin(a) * L * 0.7,
      0.07 + 0.1 * w + bump * 0.04,
      i % 3 ? 3 : 0
    );
  }
  for (let k = 0; k < 3; k++)
    ring(
      FX,
      FY,
      R * (0.55 + k * 0.28) + bump * K,
      0.3,
      k ? 3 : 0,
      bt * 0.01 * (k ? -1 : 1),
      (i, n) => (i % (k + 2) ? 0 : 0.35)
    );
  for (let k = 0; k < 9; k++) ln(0, FY - k * 1.6 * K, gw, FY - k * 1.6 * K, 0.2 - k * 0.022, 3);
  for (let i = 0; i < 34; i++) {
    const s = (i * 0.618) % 1,
      x = (((s * gw + Math.sin(bt * 0.3 + i) * gw * 0.03 + i * 37) % gw) + gw) % gw,
      y = ((i * 0.37 + bt * 0.02 * (0.5 + s)) % 1) * gh2;
    ln(x, y, x + 1.5 * K, y + 4 * K, 0.6, 0);
    ln(x + 0.5 * K, y + 1.5 * K, x - 1.2 * K, y + 2.2 * K, 0.35, 3);
    ln(x + 0.8 * K, y + 2.2 * K, x + 2.8 * K, y + 2.8 * K, 0.35, 3);
  }
}
