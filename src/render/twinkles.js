function glint(x, y, L, a) {
  const gr = g.createRadialGradient(x, y, 0, x, y, L);
  gr.addColorStop(0, 'rgba(190,215,255,' + a * 0.35 + ')');
  gr.addColorStop(1, 'rgba(190,215,255,0)');
  g.fillStyle = gr;
  g.fillRect(x - L, y - L, L * 2, L * 2);
  g.fillStyle = 'rgba(225,238,255,' + a * 0.8 + ')';
  g.fillRect(x - L * 1.5, y - 0.4, L * 3, 0.8);
  g.fillRect(x - 0.4, y - L * 1.5, 0.8, L * 3);
}
function drawTwinkles() {
  if (run.theme === 2) {
    hub.glint = null;
    return;
  }
  const T = performance.now() / 1000,
    pl = run.state === 'play';
  g.save();
  g.globalCompositeOperation = 'screen';
  for (let i = 0; i < (pl ? 140 : 420); i += 3) {
    const q = SF[i],
      f = 0.5 + q[2] * 1.1,
      cx = pl ? (((q[0] * gw + (bg.x * f) / cs) % gw) + gw) % gw : q[0] * gw,
      cy = pl ? (((q[1] * gh2 + (bg.y * f) / cs) % gh2) + gh2) % gh2 : q[1] * gh2,
      a = Math.pow(Math.max(0, Math.sin(T * (0.8 + q[2] * 0.9) + i * 2.3)), 8);
    if (a > 0.06)
      glint(
        (Math.round(cx) + 0.5) * cs,
        (Math.round(cy) + 0.5) * cs,
        2.5 + 5 * a * (0.5 + q[2]),
        a
      );
  }
  if (hub.glint && !run.himg) {
    const a = 0.45 + 0.35 * Math.sin(T * 1.7);
    glint(hub.glint[0], hub.glint[1], 7 + 4 * a, a);
  }
  g.restore();
  hub.glint = null;
}
