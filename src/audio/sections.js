/* ---- SECTION CHANGES: finds where the arrangement shifts (instrument enters, bass drops out...) ---- */
const UPC = [11, 12, 13],
  DNC = [14, 15, 16];
let BI = -1,
  BU = true;
const LEAD = 4.15;
function sring(cx, cy, r, v, c, ph, fn, sh) {
  if (!sh) return ring(cx, cy, r, v, c, ph, fn || undefined);
  const n = Math.max(10, Math.ceil(r * 8.2));
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU,
      ca = Math.abs(Math.cos(a0)),
      sa = Math.abs(Math.sin(a0));
    let p = r;
    if (sh === 1) p = (1.3 * r) / (ca + sa);
    else if (sh === 2) p = (0.9 * r) / Math.max(ca, sa);
    else p = r * (0.6 + 0.4 * Math.abs(Math.cos(2 * a0)));
    const a = a0 + ph;
    dot(cx + Math.cos(a) * p, cy + Math.sin(a) * p, fn ? fn(i, n) : v, c);
  }
}
function moodA(now) {
  if (run.state !== 'play' || !run.act || !run.act.secs) return 0;
  const st = now - run.OFF - (run.t0 - run.act.P) + LEAD;
  for (const x of run.act.secs)
    if (st >= x.t && st < x.e && x.hot)
      return Math.max(0, Math.min(1, (st - x.t) / 1.2, (x.e - st) / 1.5));
  return 0;
}
function dsw(cx, cy, r, v, c, gr, sh) {
  const R = Math.ceil(r * 1.4);
  for (let y = -R; y <= R; y++)
    for (let x = -R; x <= R; x++) {
      let d = Math.hypot(x, y);
      if (sh === 1) d = (Math.abs(x) + Math.abs(y)) / 1.3;
      else if (sh === 2) d = Math.max(Math.abs(x), Math.abs(y)) / 0.9;
      else if (sh === 3) d = d / (0.6 + 0.4 * Math.abs(Math.cos(2 * Math.atan2(y, x))));
      if (d <= r) dw(cx + x, cy + y, gr ? v * (1 - (0.5 * d) / r) : v, c);
    }
}
function analyzeSections(c0, c1, sr, bpm, P0) {
  const D = 2,
    m = Math.floor(c0.length / D) - 1,
    fs = sr / D,
    H = 2048,
    F = Math.floor(m / H),
    NB = 6,
    ed = [120, 300, 800, 2000, 5000];
  if (F < 60) return [];
  const a = ed.map((f) => 1 - Math.exp((-2 * Math.PI * f) / fs)),
    p = new Float64Array(5),
    q = new Float64Array(5),
    L = Array.from({ length: NB }, () => new Float32Array(F));
  for (let f = 0; f < F; f++) {
    const e = new Float64Array(NB);
    for (let i = f * H, end = i + H; i < end; i++) {
      const j = i * D,
        v = (c0[j] + c1[j] + c0[j + 1] + c1[j + 1]) * 0.25;
      let pv = 0;
      for (let b = 0; b < 5; b++) {
        p[b] += a[b] * (v - p[b]);
        q[b] += a[b] * (p[b] - q[b]);
        const bd = q[b] - pv;
        e[b] += bd * bd;
        pv = q[b];
      }
      const hi = v - pv;
      e[5] += hi * hi;
    }
    for (let b = 0; b < NB; b++) L[b][f] = Math.sqrt(e[b] / H);
  }
  for (let b = 0; b < NB; b++) {
    const s = Float32Array.from(L[b]).sort(),
      pc = s[Math.floor(F * 0.98)] + 1e-9;
    for (let f = 0; f < F; f++) L[b][f] = Math.log(1 + 30 * Math.min(2, L[b][f] / pc));
  }
  const PS = L.map((l) => {
    const s = new Float64Array(F + 1);
    for (let i = 0; i < F; i++) s[i + 1] = s[i] + l[i];
    return s;
  });
  const fdur = H / fs,
    W = Math.max(8, Math.min(40, Math.round((4 * 60) / bpm / fdur))),
    n = new Float32Array(F),
    dr = new Float32Array(F);
  for (let t = W; t <= F - W; t++) {
    let nv = 0,
      dv = 0;
    for (let b = 0; b < NB; b++) {
      const A = (PS[b][t] - PS[b][t - W]) / W,
        B = (PS[b][t + W] - PS[b][t]) / W;
      nv += Math.abs(B - A);
      dv += B - A;
    }
    n[t] = nv;
    dr[t] = dv;
  }
  // rhythm pattern per bar: onset strength on a 16-slot grid, kick band + hi band
  const sp2 = 60 / bpm,
    H2 = 512,
    F2 = Math.floor(m / H2),
    fd2 = H2 / fs,
    oc = [new Float32Array(F2), new Float32Array(F2)],
    R = [];
  {
    const a1 = 1 - Math.exp((-2 * Math.PI * 160) / fs),
      a3 = 1 - Math.exp((-2 * Math.PI * 3000) / fs);
    let p1 = 0,
      q1 = 0,
      p3 = 0;
    for (let f = 0; f < F2; f++) {
      let e0 = 0,
        e1 = 0;
      for (let i = f * H2, end = i + H2; i < end; i++) {
        const j = i * D,
          v = (c0[j] + c1[j] + c0[j + 1] + c1[j + 1]) * 0.25;
        p1 += a1 * (v - p1);
        q1 += a1 * (p1 - q1);
        p3 += a3 * (v - p3);
        const hh = v - p3;
        e0 += q1 * q1;
        e1 += hh * hh;
      }
      oc[0][f] = Math.sqrt(e0 / H2);
      oc[1][f] = Math.sqrt(e1 / H2);
    }
  }
  const on = oc.map((e) => {
    const s = Float32Array.from(e).sort(),
      pc = s[Math.floor(F2 * 0.98)] + 1e-9,
      c = new Float32Array(F2),
      o = new Float32Array(F2);
    for (let f = 0; f < F2; f++) c[f] = Math.log(1 + 30 * Math.min(2, e[f] / pc));
    for (let f = 1; f < F2; f++) o[f] = Math.max(0, c[f] - c[f - 1]);
    return o;
  });
  const nbar = bpm > 0 ? Math.floor((m / fs - P0) / (4 * sp2)) : 0;
  for (let k = 0; k < nbar; k++) {
    const v = new Float32Array(32);
    for (let b = 0; b < 2; b++)
      for (let s = 0; s < 16; s++) {
        const f0 = Math.round((P0 + k * 4 * sp2 + (s * sp2) / 4) / fd2);
        let mx = 0;
        for (let j = -1; j <= 1; j++) {
          const u = f0 + j;
          if (u > 0 && u < F2 && on[b][u] > mx) mx = on[b][u];
        }
        v[b * 16 + s] = mx;
      }
    R.push(v);
  }
  let sc = 0;
  if (nbar >= 6) {
    const nr = new Float32Array(F),
      Wb = 2;
    let rs = 0,
      rc = 0;
    for (let k = Wb; k <= nbar - Wb; k++) {
      let rn = 0;
      for (let d = 0; d < 32; d++) {
        let A = 0,
          B = 0;
        for (let j = 1; j <= Wb; j++) {
          A += R[k - j][d];
          B += R[k + j - 1][d];
        }
        rn += Math.abs(B - A) / Wb;
      }
      rs += rn;
      rc++;
      const t = Math.round((P0 + k * 4 * sp2) / fdur);
      for (let dt = -1; dt <= 1; dt++)
        if (t + dt >= 0 && t + dt < F) nr[t + dt] = Math.max(nr[t + dt], rn);
    }
    let ns0 = 0,
      nc0 = 0;
    for (let t = W; t <= F - W; t++) {
      ns0 += n[t];
      nc0++;
    }
    sc = (0.8 * (ns0 / nc0)) / (rs / rc + 1e-9);
    for (let t = 0; t < F; t++) n[t] += sc * nr[t];
  }
  let mu = 0,
    c = 0;
  for (let t = W; t <= F - W; t++) {
    mu += n[t];
    c++;
  }
  mu /= c;
  let sd = 0;
  for (let t = W; t <= F - W; t++) sd += (n[t] - mu) ** 2;
  sd = Math.sqrt(sd / c);
  const thr = mu + 0.8 * sd,
    cand = [],
    h = Math.floor(W / 2);
  for (let t = W; t <= F - W; t++) {
    if (n[t] < thr) continue;
    let ok = 1;
    for (let j = -h; j <= h; j++) {
      const u = t + j;
      if (u >= W && u <= F - W && n[u] > n[t]) {
        ok = 0;
        break;
      }
    }
    if (ok) cand.push(t);
  }
  cand.sort((x, y) => n[y] - n[x]);
  const acc = [],
    gap = 3 * W;
  for (const t of cand) if (acc.every((u) => Math.abs(u - t) >= gap)) acc.push(t);
  acc.sort((x, y) => x - y);
  const spb = 60 / bpm,
    dur = c0.length / sr,
    sn = (f) => {
      let s = f * fdur;
      if (bpm > 0) s = P0 + Math.round((s - P0) / spb) * spb;
      return Math.max(0, Math.min(dur, s));
    };
  const bf = [0, ...acc, F],
    M = [],
    sg = [];
  for (let i = 0; i < bf.length - 1; i++) {
    const a = bf[i],
      b = bf[i + 1];
    {
      const rm = new Float32Array(32);
      let rn = 0;
      for (let q = 0; q < R.length; q++) {
        const bt = P0 + q * 4 * sp2;
        if (bt >= a * fdur && bt < b * fdur) {
          rn++;
          for (let d = 0; d < 32; d++) rm[d] += R[q][d];
        }
      }
      if (rn) for (let d = 0; d < 32; d++) rm[d] *= sc / rn;
      M.push(L.map((l, k) => (PS[k][b] - PS[k][a]) / (b - a)).concat(Array.from(rm)));
    }
  }
  const ns = acc.map((t) => n[t]).sort((x, y) => x - y),
    td = Math.max(0.3 * (ns.length ? ns[ns.length >> 1] : 0), 1.5 * thr);
  let base = M[0];
  for (let i = 0; i < M.length; i++) {
    let d = 0,
      sgn = 0;
    for (let k = 0; k < M[i].length; k++) {
      const mv = M[i][k] - base[k];
      d += Math.abs(mv);
      if (k < NB) sgn += mv;
    }
    const hot = i > 0 && d >= td;
    if (!hot) base = M[i];
    sg.push({
      t: i ? sn(bf[i]) : 0,
      e: i < bf.length - 2 ? sn(bf[i + 1]) : dur,
      hot,
      up: sgn >= 0,
    });
  }
  const out = [];
  for (const x of sg) {
    const l = out[out.length - 1];
    if (l && l.hot === x.hot && (!x.hot || l.up === x.up)) l.e = x.e;
    else out.push(x);
  }
  return out;
}
function HLV(a) {
  const t = Float32Array.from(a).sort(),
    lo = t[Math.floor(t.length * 0.03)],
    hi = Math.max(lo + 0.05, t[Math.floor(t.length * 0.985)]);
  for (let i = 0; i < a.length; i++) a[i] = Math.min(1, Math.max(0, (a[i] - lo) / (hi - lo)));
  return a;
}
