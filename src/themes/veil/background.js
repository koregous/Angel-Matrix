/* ---- VEIL theme: one soft luminous mass in a lot of dark, hair-like strands, rising fog, rare sacred glitch ---- */
const VS = Array.from({ length: 64 }, () => {
    const r = Math.random;
    return {
      o: (r() + r() + r() - 1.5) * 0.5,
      p: r() * TAU,
      l: 0.55 + r() * 0.6,
      a: 0.35 + r() * 0.65,
      w: 0.5 + r() * 0.9,
    };
  }),
  VF = Array.from({ length: 7 }, (_, i) => ({
    x: i / 6,
    p: Math.random() * TAU,
    s: 0.05 + Math.random() * 0.08,
    r: 0.35 + Math.random() * 0.3,
  }));
var VG = null,
  VB = -1;
function veilBg(now, bt, fx, fy, bump) {
  const T = performance.now() / 1000,
    br = 0.5 + 0.5 * Math.sin(T * 0.55);
  g.fillStyle = '#03030a';
  g.fillRect(-W, -H, W * 3, H * 3);
  g.save();
  g.globalCompositeOperation = 'screen';
  {
    const a = 0.23 + 0.04 * br + bump * 0.01,
      R = W * 0.62,
      gr = g.createRadialGradient(0, 0, 0, 0, 0, R);
    g.translate(fx, fy + H * 0.1);
    g.scale(0.78, 1.35);
    gr.addColorStop(0, 'rgba(214,220,255,' + a + ')');
    gr.addColorStop(0.35, 'rgba(150,152,220,' + a * 0.5 + ')');
    gr.addColorStop(0.7, 'rgba(60,60,130,' + a * 0.18 + ')');
    gr.addColorStop(1, 'rgba(40,40,100,0)');
    g.fillStyle = gr;
    g.fillRect(-R, -R, R * 2, R * 2);
    g.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  g.restore();
  g.save();
  g.globalCompositeOperation = 'screen';
  {
    const top = fy - H * 0.16,
      gr = g.createLinearGradient(0, top, 0, H);
    gr.addColorStop(0, 'rgba(225,228,255,0)');
    gr.addColorStop(0.18, 'rgba(225,228,255,.5)');
    gr.addColorStop(0.7, 'rgba(200,205,250,.3)');
    gr.addColorStop(1, 'rgba(200,205,250,0)');
    g.strokeStyle = gr;
    for (const s of VS) {
      const x0 = fx + s.o * W * 0.62,
        L = (H - top) * s.l;
      g.globalAlpha = s.a * (0.3 + 0.1 * br);
      g.lineWidth = s.w;
      g.beginPath();
      for (let k = 0; k <= 8; k++) {
        const y = top + (L * k) / 8,
          x = x0 + Math.sin(T * 0.28 + s.p + k * 0.5) * (2 + k * 0.9);
        k ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
  }
  for (const f of VF) {
    const x = W * (f.x + 0.12 * Math.sin(T * f.s + f.p)),
      y = H * (0.98 - 0.1 * (0.5 + 0.5 * Math.sin(T * f.s * 1.3 + f.p * 2))),
      R = W * f.r,
      gr = g.createRadialGradient(x, y, 0, x, y, R);
    gr.addColorStop(0, 'rgba(170,180,235,.15)');
    gr.addColorStop(1, 'rgba(170,180,235,0)');
    g.fillStyle = gr;
    g.fillRect(x - R, y - R, R * 2, R * 2);
  }
  g.restore();
  {
    const vg = g.createRadialGradient(
      W / 2,
      H * 0.48,
      Math.min(W, H) * 0.3,
      W / 2,
      H * 0.48,
      Math.max(W, H) * 0.8
    );
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,.62)');
    g.fillStyle = vg;
    g.fillRect(-W, -H, W * 3, H * 3);
  }
  const bi = Math.floor(bt);
  if (bi !== VB) {
    VB = bi;
    if (!VG && Math.random() < 0.12)
      VG = {
        t: T,
        x: fx - W * (0.2 + Math.random() * 0.16),
        y: H * (0.1 + Math.random() * 0.3),
        w: W * (0.05 + Math.random() * 0.06),
        h: H * (0.2 + Math.random() * 0.25),
      };
  }
  if (VG) {
    const age = T - VG.t;
    if (age > 0.45) VG = null;
    else {
      const f = 1 - age / 0.45,
        r = mul(Math.floor(age * 18) * 7919 + 3),
        c2 = Math.max(5, W * 0.014),
        C = ['#b9b4f0', '#e8ecff', '#7f8cff', '#d9a8e0'];
      g.save();
      g.globalCompositeOperation = 'screen';
      for (let y = 0; y < VG.h; y += c2)
        for (let x = 0; x < VG.w; x += c2) {
          if (r() < 0.24 * f) {
            g.globalAlpha = (0.1 + 0.35 * r()) * f;
            g.fillStyle = C[(r() * 4) | 0];
            g.fillRect(VG.x + x, VG.y + y, c2 - 1, c2 - 1);
          }
        }
      for (let i = 0; i < 6; i++) {
        g.globalAlpha = 0.22 * f;
        g.fillStyle = C[i % 4];
        g.fillRect(
          VG.x - VG.w * (r() * 0.8) + (r() - 0.5) * W * 0.05,
          VG.y + r() * VG.h,
          VG.w * (1.5 + r() * 2),
          1 + (r() < 0.3 ? 1 : 0)
        );
      }
      g.restore();
    }
  }
}
