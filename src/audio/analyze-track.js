export function analyzeTrack(c0, c1, sr) {
  const D = 2,
    m = Math.floor(c0.length / D) - 1,
    fs = sr / D,
    x = new Float32Array(m);
  for (let i = 0; i < m; i++) {
    const j = i * D;
    x[i] = (c0[j] + c1[j] + c0[j + 1] + c1[j + 1]) * 0.25;
  }
  const H = 256,
    F = Math.floor(m / H),
    E = [new Float32Array(F), new Float32Array(F), new Float32Array(F)];
  const lpA = (fc) => 1 - Math.exp((-2 * Math.PI * fc) / fs),
    a1 = lpA(160),
    a2 = lpA(350),
    a3 = lpA(3500),
    a4 = lpA(4500);
  let p1 = 0,
    q1 = 0,
    p2 = 0,
    q2 = 0,
    p3 = 0,
    q3 = 0,
    p4 = 0,
    q4 = 0;
  for (let f = 0; f < F; f++) {
    let e0 = 0,
      e1 = 0,
      e2 = 0;
    for (let i = f * H, e = i + H; i < e; i++) {
      const v = x[i];
      p1 += a1 * (v - p1);
      q1 += a1 * (p1 - q1);
      p2 += a2 * (v - p2);
      q2 += a2 * (p2 - q2);
      p3 += a3 * (v - p3);
      q3 += a3 * (p3 - q3);
      p4 += a4 * (v - p4);
      q4 += a4 * (p4 - q4);
      const lo = q1,
        mid = q3 - q2,
        hi = v - q4;
      e0 += lo * lo;
      e1 += mid * mid;
      e2 += hi * hi;
    }
    E[0][f] = Math.sqrt(e0 / H);
    E[1][f] = Math.sqrt(e1 / H);
    E[2][f] = Math.sqrt(e2 / H);
  }
  const fps = fs / H,
    O = E.map((e) => {
      const s = Float32Array.from(e).sort(),
        pc = s[Math.floor(F * 0.98)] + 1e-9,
        c = new Float32Array(F),
        o = new Float32Array(F);
      for (let f = 0; f < F; f++) c[f] = Math.log(1 + 30 * Math.min(2, e[f] / pc));
      for (let f = 2; f < F; f++) o[f] = Math.max(0, c[f] - Math.max(c[f - 1], c[f - 2]));
      return o;
    });
  // tempo + first-beat phase: comb-filter the onset curve (kick-weighted) over 90-180 BPM
  const tw = new Float32Array(F),
    tm = new Float32Array(F);
  for (let f = 0; f < F; f++) tw[f] = O[0][f] + 0.6 * O[1][f] + 0.3 * O[2][f];
  for (let f = 1; f < F - 1; f++) tm[f] = Math.max(tw[f - 1], tw[f], tw[f + 1]);
  const sc = (per, ph) => {
    let s = 0,
      c = 0;
    for (let t = ph; t < F - 2; t += per) {
      const i = Math.round(t);
      if (i > 0) {
        s += tm[i];
        c++;
      }
    }
    return c ? s / c : 0;
  };
  const sk = (per, ph) => {
    let s = 0,
      c = 0;
    for (let t = ph; t < F - 2; t += per) {
      const i = Math.round(t);
      if (i > 0) {
        s += tw[i] + 0.5 * (tw[i - 1] + tw[i + 1]);
        c++;
      }
    }
    return c ? s / c : 0;
  };
  let best = { s: -1, per: 0, ph: 0 },
    sum = 0,
    cnt = 0;
  for (let b = 90; b <= 180.001; b += 0.1) {
    const per = (fps * 60) / b;
    for (let ph = 0; ph < per; ph += 0.5) {
      const s = sc(per, ph);
      sum += s;
      cnt++;
      if (s > best.s) best = { s, per, ph };
    }
  }
  const conf = best.s / (sum / cnt + 1e-9),
    b0 = (fps * 60) / best.per;
  let fin = { s: -1, per: best.per, ph: best.ph };
  for (let b = b0 - 0.12; b <= b0 + 0.1201; b += 0.01) {
    const per = (fps * 60) / b;
    for (let ph = best.ph - 1.2; ph <= best.ph + 1.2; ph += 0.1) {
      if (ph < 0) continue;
      const s = sk(per, ph);
      if (s > fin.s) fin = { s, per, ph };
    }
  }
  let per = fin.per,
    h = fin.ph;
  while (h >= per) h -= per;
  if (h < 0) h = 0;
  const bpm = (fps * 60) / per,
    P = (h + 0.5) / fps,
    bt = (k) => h + k * per,
    fr = (f) => (f + 0.5) / fps;
  // clap slots: which beats of the bar carry the mid-band hits without a kick under them
  const near = (o, fp) => {
    const i = Math.round(fp);
    let q = 0;
    for (let j = -2; j <= 2; j++) {
      const v = o[i + j];
      if (v > q) q = v;
    }
    return q;
  };
  const slot = [0, 0, 0, 0];
  for (let k = 0; bt(k) < F - 3; k++)
    slot[k % 4] += Math.max(0, near(O[1], bt(k)) - 0.5 * near(O[0], bt(k)));
  let s1 = 0;
  for (let i = 1; i < 4; i++) if (slot[i] > slot[s1]) s1 = i;
  const cs = [s1];
  if (slot[(s1 + 2) % 4] >= 0.6 * slot[s1]) cs.push((s1 + 2) % 4);
  // per-band peak picking (strength = onset size, weighted by how much it stands out locally)
  const pk = (o, thr, vm = 0.35) => {
    const ps = new Float64Array(F + 1),
      W = Math.round(fps),
      out = [];
    for (let i = 0; i < F; i++) ps[i + 1] = ps[i] + o[i];
    for (let f = 3; f < F - 3; f++) {
      const v = o[f];
      if (v < vm) continue;
      let ok = 1;
      for (let j = 1; j <= 3; j++)
        if (o[f - j] > v || o[f + j] >= v) {
          ok = 0;
          break;
        }
      if (!ok) continue;
      const a = Math.max(0, f - W),
        b = Math.min(F, f + W + 1),
        r = v / ((ps[b] - ps[a]) / (b - a) + 0.02);
      if (r >= thr) out.push({ t: fr(f), f, v, s: v * (0.5 + (0.5 * Math.min(r, 8)) / 8) });
    }
    return out;
  };
  const lo = pk(O[0], 2),
    mid = pk(O[1], 2),
    hi = pk(O[2], 2.2),
    ev = [],
    used = new Set();
  for (let k = 0; bt(k) < F - 3; k++) {
    if (!cs.includes(k % 4)) continue;
    let b = null;
    for (const p of mid) if (Math.abs(p.f - bt(k)) <= 3 && (!b || p.v > b.v)) b = p;
    if (b && !used.has(b)) {
      used.add(b);
      ev.push({ t: b.t, k: 3, s: b.s * 1.5 });
    }
  }
  lo.forEach((p) => ev.push({ t: p.t, k: 0, s: p.s * 1.15 }));
  mid.forEach((p) => {
    if (!used.has(p)) ev.push({ t: p.t, k: 1, s: p.s * 0.85 });
  });
  hi.forEach((p) => ev.push({ t: p.t, k: 2, s: p.s * 0.75 }));
  const mkEv = (lo, mid, hi) => {
    const ev = [],
      used = new Set();
    for (let k = 0; bt(k) < F - 3; k++) {
      if (!cs.includes(k % 4)) continue;
      let b = null;
      for (const p of mid) if (Math.abs(p.f - bt(k)) <= 3 && (!b || p.v > b.v)) b = p;
      if (b && !used.has(b)) {
        used.add(b);
        ev.push({ t: b.t, k: 3, s: b.s * 1.5 });
      }
    }
    lo.forEach((p) => ev.push({ t: p.t, k: 0, s: p.s * 1.15 }));
    mid.forEach((p) => {
      if (!used.has(p)) ev.push({ t: p.t, k: 1, s: p.s * 0.85 });
    });
    hi.forEach((p) => ev.push({ t: p.t, k: 2, s: p.s * 0.75 }));
    return ev;
  };
  const evH = mkEv(pk(O[0], 1.35, 0.22), pk(O[1], 1.35, 0.22), pk(O[2], 1.5, 0.25));
  const dur = c0.length / sr;
  return { bpm, P, ev, evH, dur, conf, cs, endB: Math.ceil(((dur - P) * bpm) / 60) };
}
