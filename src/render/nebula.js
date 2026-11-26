/* ---- ENDLESS NEBULA: world is cut into square chunks, each generated lazily from world-space noise (seamless, never repeats) ---- */
const NEBC = {
  seed: 1337,
  rot: -0.35,
  stretch: 2.2,
  cloud: 1.1,
  lo: 0.44,
  hi: 0.9,
  gain: 1.12,
  warp: 1.2,
  detail: 7,
  stars: 220,
  beacon: 0.12,
};
let NB = new Map(),
  NP = [],
  NCC = 96,
  NCP = 0,
  NEBK = 0;
const NSH = 730;
const nbh = (x, y, s) => {
    let h =
      Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(s | 0, 0x9e3779b1);
    h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
    h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  },
  nbv = (x, y, s) => {
    const xi = Math.floor(x),
      yi = Math.floor(y),
      xf = x - xi,
      yf = y - yi,
      u = xf * xf * (3 - 2 * xf),
      v = yf * yf * (3 - 2 * yf),
      a = nbh(xi, yi, s),
      b = nbh(xi + 1, yi, s),
      c = nbh(xi, yi + 1, s),
      d = nbh(xi + 1, yi + 1, s);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  },
  nbf = (x, y, s) => {
    let t = 0,
      a = 0.5;
    for (let o = 0; o < 4; o++) {
      t += a * nbv(x, y, s + o * 17);
      x *= 2;
      y *= 2;
      a *= 0.5;
    }
    return t;
  },
  nbs = (a, b, x) => {
    x = Math.max(0, Math.min(1, (x - a) / (b - a)));
    return x * x * (3 - 2 * x);
  };
const NCL = ['#102a5c', '#2f74e0', '#8cc6ff', '#0f4a3a', '#2fb589', '#f2fbff'];
function nebReset() {
  NCC = Math.round(288 / cs);
  NCP = NCC * cs;
  const k = NCP * DPR + '|' + cs;
  if (k === NEBK) return;
  NEBK = k;
  for (const c of NB.values()) NP.push(c);
  NB.clear();
}
function nebChunk(ci, cj) {
  const key = ci + ',' + cj;
  let c = NB.get(key);
  if (c) return c;
  c = NP.pop() || document.createElement('canvas');
  const CW = Math.round(NCP * DPR);
  if (c.width !== CW || c.height !== CW) {
    c.width = CW;
    c.height = CW;
  }
  const b = c.getContext('2d');
  b.setTransform(DPR, 0, 0, DPR, 0, 0);
  const C = NEBC,
    S = C.seed,
    ca = Math.cos(C.rot),
    sa = Math.sin(C.rot),
    r = Math.max(0.6, cs * 0.4),
    dr = Math.max(0.5, cs * 0.12);
  b.clearRect(0, 0, NCP, NCP);
  b.imageSmoothingEnabled = false;
  const D = new Path2D(),
    P = NCL.map(() => new Path2D());
  for (let y = 0; y < NCC; y++)
    for (let x = 0; x < NCC; x++) {
      const gx = ci * NCC + x,
        gy = cj * NCC + y,
        px = (x + 0.5) * cs,
        py = (y + 0.5) * cs;
      D.moveTo(px + dr, py);
      D.arc(px, py, dr, 0, TAU);
      const u = (gx * cs) / NSH,
        v = (gy * cs) / NSH,
        ru = u * ca - v * sa + (nbv(u * 1.3, v * 1.3, S + 11) - 0.5) * C.warp,
        rv = u * sa + v * ca + (nbv(u * 1.3 + 5, v * 1.3 + 9, S + 12) - 0.5) * C.warp,
        mask = nbs(C.lo, C.hi, nbf(ru * C.cloud, rv * C.cloud * C.stretch, S + 13));
      if (mask <= 0) continue;
      const n = nbf(u * C.detail, v * C.detail, S + 21),
        m = nbf(u * C.detail * 0.72 + 9, v * C.detail * 0.72 + 4, S + 22),
        val = mask * (0.3 + n * 1.2) * C.gain;
      if (val < 0.14 || nbh(gx, gy, S + 991) > Math.min(1, val * 2)) continue;
      const gr = m > 0.52,
        i = val < 0.3 ? (gr ? 3 : 0) : val < 0.5 ? (gr ? 4 : 1) : val < 0.72 ? (gr ? 4 : 2) : 5,
        q = P[i];
      if (cs < 2) q.rect(px - r, py - r, r * 2, r * 2);
      else {
        q.moveTo(px + r, py);
        q.arc(px, py, r, 0, TAU);
      }
    }
  b.fillStyle = '#101010';
  b.fill(D);
  P.forEach((p, i) => {
    b.fillStyle = NCL[i];
    b.fill(p);
  });
  const sp4 = (x, y, a) => {
      b.fillRect(x - a, y, a * 2 + 1, 1);
      b.fillRect(x, y - a, 1, a * 2 + 1);
    },
    rn = mul(Math.imul(ci, 0x1f3d5b79) ^ Math.imul(cj, 0x6a09e667) ^ S),
    exp = (C.stars * NCP * NCP) / (W * H),
    ns = Math.floor(exp) + (rn() < exp % 1 ? 1 : 0),
    mg = 7;
  for (let i = 0; i < ns; i++) {
    b.fillStyle = ['#e6f4ff', '#7db3ff', '#5fd1a3'][i % 3];
    const x = mg + Math.floor(rn() * (NCP - mg * 2)),
      y = mg + Math.floor(rn() * (NCP - mg * 2));
    if (rn() < 0.16) sp4(x, y, 2 + Math.floor(rn() * 4));
    else b.fillRect(x, y, 1, 1);
  }
  if (rn() < C.beacon) {
    const mb2 = Math.max(10, Math.round(W * 0.022)) + 4,
      x = mb2 + Math.floor(rn() * (NCP - mb2 * 2)),
      y = mb2 + Math.floor(rn() * (NCP - mb2 * 2));
    b.fillStyle = '#e6f4ff';
    sp4(x, y, Math.max(10, Math.round(W * 0.022)));
    b.fillRect(x - 2, y - 2, 5, 5);
  }
  NB.set(key, c);
  return c;
}
