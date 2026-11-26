/* ---- NIGHTDRIVE sky: retrowave striped sun on the horizon (merged from the old OUTRUN theme) ---- */
function nightSky(fx, fy, bump) {
  const R = Math.min(W * 0.34, H * 0.21),
    cy = fy - R * 0.4,
    top = cy - R;
  let a = g.createLinearGradient(0, fy - H * 0.62, 0, fy);
  a.addColorStop(0, '#04021a');
  a.addColorStop(0.6, '#1c0b3c');
  a.addColorStop(1, '#4a1260');
  g.fillStyle = a;
  g.fillRect(-W, fy - H * 2, W * 3, H * 2);
  let b = g.createLinearGradient(0, fy, 0, fy + H * 0.6);
  b.addColorStop(0, '#14041f');
  b.addColorStop(0.35, '#050109');
  b.addColorStop(1, '#000');
  g.fillStyle = b;
  g.fillRect(-W, fy, W * 3, H * 2.5);
  g.save();
  g.globalCompositeOperation = 'screen';
  const hr = R * (1.55 + bump * 0.06),
    hg = g.createRadialGradient(fx, cy, R * 0.6, fx, cy, hr);
  hg.addColorStop(0, 'rgba(255,60,170,.5)');
  hg.addColorStop(1, 'rgba(255,60,170,0)');
  g.fillStyle = hg;
  g.fillRect(fx - hr, cy - hr, hr * 2, hr * 2);
  g.restore();
  g.save();
  g.beginPath();
  g.rect(fx - R - 2, top - 2, R * 2 + 4, fy - top + 2);
  g.clip();
  g.beginPath();
  g.arc(fx, cy, R, 0, Math.PI * 2);
  g.clip();
  const sg = g.createLinearGradient(0, top, 0, fy);
  sg.addColorStop(0, '#ffd000');
  sg.addColorStop(0.5, '#ff7a45');
  sg.addColorStop(1, '#ff3d94');
  g.fillStyle = sg;
  const cut = [
    [0.65, 0.7],
    [0.91, 0.99],
    [1.15, 1.26],
  ];
  let y0 = top - 1;
  for (const [c0, c1] of cut) {
    g.fillRect(fx - R - 2, y0, R * 2 + 4, top + c0 * R - y0);
    y0 = top + c1 * R;
  }
  g.fillRect(fx - R - 2, y0, R * 2 + 4, fy - y0);
  g.restore();
  const fg = g.createLinearGradient(0, fy - H * 0.07, 0, fy);
  fg.addColorStop(0, 'rgba(255,120,210,0)');
  fg.addColorStop(1, 'rgba(255,120,210,.35)');
  g.fillStyle = fg;
  g.fillRect(-W, fy - H * 0.07, W * 3, H * 0.07);
  g.fillStyle = '#ffffff';
  g.globalAlpha = 0.9;
  g.fillRect(-W, fy - 1, W * 3, 2);
  g.globalAlpha = 1;
}
