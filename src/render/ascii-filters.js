/* ================= ASCII FILTERS ================= */
function FON() {
  const F = FILTERS[tex.filt];
  return !!F && F.k !== 'dots';
}
// Texture and colourway choice, shared with the texture menu and the main loop.
const tex = {
  filt: 0, // index into FILTERS
  tint: 0, // index into TN (colourway)
  peekUntil: 0, // while paused, keep drawing until this time so the effect shows behind the menu
  peekTimer: 0, // timeout that restores the menu backdrop
};
var GSI = 0,
  ATL = null,
  ATK = '',
  TPK = '',
  TPV = null;
try {
  tex.tint = +localStorage.getItem('amTint') || 0;
} catch (e) {}
const GZ = [[2, 4]],
  FILTERS = [
    { n: 'PIXELS', k: 'pixels' },
    { n: 'DITHER', k: 'dither' },
    { n: 'BRICK MOSAIC', k: 'brick', sq: 1 },
    { n: 'SQUARES', k: 'shape', sh: 'square', sq: 1 },
  ];
for (const F of FILTERS) {
  if (F.s) {
    F.c = F.k === 'ramp' ? Array.from(F.s) : Array.from(new Set(F.s));
    if (F.k === 'text') F.ix = Array.from(F.s).map((c) => F.c.indexOf(c));
  }
}
const OBC = [
    '#ffd000',
    '#ffa21f',
    '#ff7a45',
    '#ff5a6a',
    '#ff3d94',
    '#e02bd0',
    '#b02cff',
    '#7a3cff',
  ],
  ORM = [
    [0, [90, 44, 255]],
    [0.35, [224, 43, 208]],
    [0.65, [255, 90, 138]],
    [0.85, [255, 150, 60]],
    [1, [255, 208, 0]],
  ],
  OUT = () => TN[tex.tint][2] === 1,
  NEO = () => TN[tex.tint][2] === 2;
function tintCol(h) {
  if (NEO()) {
    const r = parseInt(h.slice(1, 3), 16) / 255,
      g2 = parseInt(h.slice(3, 5), 16) / 255,
      b = parseInt(h.slice(5, 7), 16) / 255,
      mx = Math.max(r, g2, b),
      mn = Math.min(r, g2, b),
      l = (mx + mn) / 2,
      d = mx - mn;
    if (d < 0.08)
      return 'rgb(' + [r, g2, b].map((v) => Math.round(Math.min(1, v * 1.1) * 255)) + ')';
    let H = mx === r ? ((g2 - b) / d + 6) % 6 : mx === g2 ? (b - r) / d + 2 : (r - g2) / d + 4;
    const L = Math.min(0.68, Math.max(0.5, l * 0.6 + 0.3)),
      A = L > 0.5 ? 1 - L : L,
      f = (n) => {
        const k = (n + H * 2) % 12;
        return Math.round((L - A * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
      };
    return 'rgb(' + [f(0), f(8), f(4)] + ')';
  }
  if (OUT()) {
    const r = parseInt(h.slice(1, 3), 16),
      g2 = parseInt(h.slice(3, 5), 16),
      b = parseInt(h.slice(5, 7), 16),
      l = Math.min(1, ((0.299 * r + 0.587 * g2 + 0.114 * b) / 255) * 1.15);
    let a = ORM[0],
      c = ORM[ORM.length - 1];
    for (let i = 1; i < ORM.length; i++)
      if (l <= ORM[i][0]) {
        a = ORM[i - 1];
        c = ORM[i];
        break;
      }
    const u = c[0] === a[0] ? 0 : (l - a[0]) / (c[0] - a[0]);
    return 'rgb(' + a[1].map((v, k) => Math.round(v + (c[1][k] - v) * u)) + ')';
  }
  const t = TN[tex.tint][1];
  if (!t) return h;
  const r = parseInt(h.slice(1, 3), 16),
    g2 = parseInt(h.slice(3, 5), 16),
    b = parseInt(h.slice(5, 7), 16),
    l = Math.min(1, ((0.299 * r + 0.587 * g2 + 0.114 * b) / 255) * 1.15),
    k = 0.35 + 0.65 * l;
  return 'rgb(' + t.map((v) => Math.round(v * k)) + ')';
}
function getTPA() {
  return OUT() ? OBC : getTP();
}
function getTP() {
  const k = tex.tint + '|' + run.theme;
  if (k !== TPK || !TPV) {
    TPK = k;
    TPV = PAL.map(tintCol);
  }
  return TPV;
}
function atlasFor(F, cw, ch) {
  const k = tex.filt + '|' + GSI + '|' + tex.tint + '|' + run.theme + '|' + cs + '|' + DPR;
  if (k === ATK && ATL) return ATL;
  ATK = k;
  const TP = getTPA(),
    dw = Math.max(2, Math.round(cw * DPR)),
    dh = Math.max(2, Math.round(ch * DPR)),
    c = ATL || (ATL = document.createElement('canvas'));
  c.width = dw * F.c.length;
  c.height = dh * TP.length;
  const a = c.getContext('2d');
  a.clearRect(0, 0, c.width, c.height);
  a.textAlign = 'center';
  a.textBaseline = 'middle';
  a.font =
    'bold ' +
    Math.round(Math.min(dh * 0.86, dw / 0.58)) +
    'px "Courier New",ui-monospace,monospace';
  for (let r = 0; r < TP.length; r++) {
    a.fillStyle = TP[r];
    for (let i = 0; i < F.c.length; i++) {
      const m = a.measureText(F.c[i]).width,
        sx = m > dw * 1.02 ? dw / m : 1;
      a.save();
      a.beginPath();
      a.rect(i * dw, r * dh, dw, dh);
      a.clip();
      a.translate((i + 0.5) * dw, (r + 0.5) * dh + dh * 0.04);
      a.scale(sx, 1);
      a.fillText(F.c[i], 0, 0);
      a.restore();
    }
  }
  return c;
}
const ALV = [0.22, 0.45, 0.72, 1];
function shp(p, sh, x, y, s, cw, ch, v) {
  switch (sh) {
    case 'circle':
      p.moveTo(x + s, y);
      p.arc(x, y, s, 0, TAU);
      break;
    case 'square':
      p.rect(x - s, y - s, s * 2, s * 2);
      break;
    case 'diamond':
      p.moveTo(x, y - s);
      p.lineTo(x + s, y);
      p.lineTo(x, y + s);
      p.lineTo(x - s, y);
      p.closePath();
      break;
    case 'plus':
      {
        const t = Math.max(0.5, s * 0.3);
        p.rect(x - s, y - t, s * 2, t * 2);
        p.rect(x - t, y - s, t * 2, s * 2);
      }
      break;
    case 'tri':
      p.moveTo(x, y - s);
      p.lineTo(x + s, y + s * 0.8);
      p.lineTo(x - s, y + s * 0.8);
      p.closePath();
      break;
    case 'star':
      {
        const q = s * 0.22;
        p.moveTo(x, y - s);
        p.lineTo(x + q, y - q);
        p.lineTo(x + s, y);
        p.lineTo(x + q, y + q);
        p.lineTo(x, y + s);
        p.lineTo(x - q, y + q);
        p.lineTo(x - s, y);
        p.lineTo(x - q, y - q);
        p.closePath();
      }
      break;
    case 'hbar':
      {
        const t = Math.max(0.5, ch * 0.46 * v);
        p.rect(x - cw / 2, y - t, cw, t * 2);
      }
      break;
    case 'vbar':
      {
        const t = Math.max(1, ch * 0.96 * v);
        p.rect(x - cw * 0.34, y + ch / 2 - t, cw * 0.68, t);
      }
      break;
  }
}
function ascDraw() {
  const F = FILTERS[tex.filt];
  if (!F || F.k === 'dots') return;
  let BW = GZ[GSI][0],
    BH = GZ[GSI][1];
  if (F.sq) BW = BH = GZ[GSI][0] + 1;
  if (F.k === 'dither' || F.k === 'pixels') {
    BW = 1;
    BH = 1;
  }
  const cw = BW * cs,
    ch = BH * cs,
    nx = Math.ceil(gw / BW),
    ny = Math.ceil(gh2 / BH),
    TP = getTPA(),
    OB = OUT(),
    T = performance.now() / 1000,
    GA = run.theme === 2 ? 0.66 : 1,
    PP = [],
    gl = F.k === 'ramp' || F.k === 'rand' || F.k === 'text',
    half = (Math.min(cw, ch) / 2) * 0.94,
    tk = Math.floor(T * 2.5);
  const at = gl ? atlasFor(F, cw, ch) : null,
    dw = at ? at.width / F.c.length : 0,
    dh = at ? at.height / TP.length : 0,
    nc = gl ? F.c.length : 0;
  const P = (ci, lv) => {
    const k = ci * 4 + lv;
    return PP[k] || (PP[k] = new Path2D());
  };
  for (let by = 0; by < ny; by++) {
    const y0 = by * BH,
      y1 = Math.min(gh2, y0 + BH);
    for (let bx = 0; bx < nx; bx++) {
      const x0 = bx * BW,
        x1 = Math.min(gw, x0 + BW);
      let mx = 0,
        sm = 0,
        mc = 0,
        n = 0;
      for (let y = y0; y < y1; y++) {
        const o = y * gw;
        for (let x = x0; x < x1; x++) {
          const v = FB[o + x];
          n++;
          if (v > 0) {
            sm += v;
            if (v > mx) {
              mx = v;
              mc = FCl[o + x];
            }
          }
        }
      }
      if (mx < 0.05) continue;
      if (OB) mc = Math.min(7, Math.floor((y0 / gh2) * 8));
      const v = Math.min(1, mx * 0.7 + (sm / n) * 0.9),
        cx = x0 * cs + cw / 2,
        cy = y0 * cs + ch / 2;
      if (gl) {
        let i;
        if (F.k === 'ramp') {
          i = Math.round(v * (nc - 1));
          if (i < 1) continue;
          g.globalAlpha = (0.55 + 0.45 * v) * GA;
        } else if (F.k === 'rand') {
          if (v < 0.1) continue;
          i = Math.floor(nbh(bx, by, tk + Math.floor(nbh(bx, by, 7) * 9)) * nc);
          g.globalAlpha = (0.25 + 0.75 * v) * GA;
        } else {
          if (v < 0.1) continue;
          i = F.ix[(bx + by * 5) % F.ix.length];
          g.globalAlpha = (0.3 + 0.7 * v) * GA;
        }
        g.drawImage(at, i * dw, mc * dh, dw, dh, x0 * cs, y0 * cs, cw, ch);
        continue;
      }
      if (F.k === 'shape') {
        shp(P(mc, 3), F.sh, cx, cy, Math.max(0.7, half * Math.sqrt(v)), cw, ch, v);
      } else if (F.k === 'shade') {
        const lv = Math.min(3, Math.floor(v * 4));
        P(mc, lv).rect(x0 * cs, y0 * cs, cw, ch);
      } else if (F.k === 'brick') {
        const lv = Math.min(3, Math.floor(v * 4)),
          gp = Math.max(1, cs * 0.4);
        P(mc, lv).rect(x0 * cs + gp / 2, y0 * cs + gp / 2, cw - gp, ch - gp);
        if (v > 0.55) {
          const q = P(mc, 3);
          q.moveTo(cx + cw * 0.17, cy);
          q.arc(cx, cy, cw * 0.17, 0, TAU);
        }
      } else if (F.k === 'dither') {
        if (v > B8[y0 & 7][x0 & 7] * 0.95 + 0.03) P(mc, 3).rect(x0 * cs, y0 * cs, cs, cs);
      } else if (F.k === 'pixels') {
        P(mc, Math.min(3, Math.floor(v * 4))).rect(x0 * cs, y0 * cs, cs, cs);
      }
    }
  }
  PP.forEach((p, k) => {
    g.globalAlpha = (F.k === 'shade' || F.k === 'brick' || F.k === 'pixels' ? ALV[k & 3] : 1) * GA;
    g.fillStyle = TP[k >> 2];
    g.fill(p);
  });
  g.globalAlpha = 1;
}
