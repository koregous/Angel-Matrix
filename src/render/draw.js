function draw(now, bt) {
  TQ = [];
  FB.fill(0);
  const [fx, fy] = fp(),
    [tx, ty] = tp(),
    gh = GS(),
    FX = fx / cs,
    FY = fy / cs,
    TX = tx / cs,
    TY = ty / cs,
    rr = (gh * 0.62) / cs,
    bp = ((bt % 1) + 1) % 1,
    bump = Math.pow(1 - bp, 3);
  speedUpd(now);
  if (run.theme === 1) roadDraw(now, bt, fx, fy, bump);
  speedLines(fx, fy);
  {
    const sp = 2 + bump * 1.2 + cam.boost * 7 + Math.min(2.5, run.combo * 0.04),
      xs = gw * 0.62,
      ys = gh2 * 0.7;
    for (const f of fog) {
      f.r += (0.004 + f.r * 0.045) * f.s * sp;
      if (f.r > 1.15) {
        f.r = 0.02 + Math.random() * 0.05;
        f.a = Math.random() * TAU;
      }
      const ca = Math.cos(f.a),
        sa = Math.sin(f.a),
        r2 = f.r / (1 + 0.1 * sp * f.s),
        v = Math.min(1, 0.15 + f.r * 0.9);
    }
  }

  for (let i = 0; i < (run.theme === 2 ? 36 : 140); i++) {
    const q = SF[i],
      f = 0.5 + q[2] * 1.1;
    dot(
      (((q[0] * gw + (bg.x * f) / cs) % gw) + gw) % gw,
      (((q[1] * gh2 + (bg.y * f) / cs) % gh2) + gh2) % gh2,
      0.08 + 0.14 * Math.abs(Math.sin(bt * 0.35 + q[2] * 40)),
      3
    );
  }
  boss(now, bt, FX, FY, bump);
  const KR = Math.max(1, Math.round(K)),
    hy = HYf(),
    HYc = hy / cs,
    lw = LWf(),
    E = [0, 1, 2, 3].map((j) => (W / 2 + cam.LS + ((j - 1.5) * lw * 2) / 3) / cs),
    gl = (lw * 0.55) / cs,
    ex = (j, q) =>
      FX +
      (W / 2 / cs - FX) * q +
      (j - 1.5) * (2 / 3) * (lw / cs) * (FARf + (1 - FARf) * q) +
      SHf(q) / cs;

  const pp = (bt - run.OFF / SPB) / 5 + cam.sz,
    qb = (gh2 - FY) / (HYc - FY),
    pb = Math.pow(qb, 1 / 2.6),
    fr = (x) => ((x % 1) + 1) % 1,
    rp = (j, p) => {
      const q = Math.pow(Math.max(p, 0), 2.6);
      return [ex(j, q), FY + (HYc - FY) * q, q];
    },
    seg = (j, a, b, v, c, t) => {
      const A = rp(j, a),
        B = rp(j, b);
      for (let d = 0; d < t; d++) ln(A[0] + d, A[1], B[0] + d, B[1], v, c);
    };

  const ph = fr(pp * 10) * 0.1,
    BCN = bmc(now);
  for (let i = 0; i < 24; i++) {
    const sd = (i * 0.618) % 1,
      j = 0.15 + (((i * 7) % 11) / 10) * 2.7,
      p = fr(pp * 3 + sd) * pb,
      q1 = Math.pow(p, 2.6),
      q2 = Math.pow(Math.min(pb, p + 0.04 + p * 0.14), 2.6);
    ln(
      ex(j, q1),
      PYf(((j - 1.5) * 2) / 3, q1) / cs,
      ex(j, q2),
      PYf(((j - 1.5) * 2) / 3, q2) / cs,
      0.15 + q2 * 0.6,
      BCN || 3
    );
  }
  for (let i = -1; i < 13; i++) {
    const a = ph + i * 0.1,
      b = Math.min(a + 0.05, pb);
    if (b <= 0 || a >= pb) continue;
    const a0 = Math.max(a, 0),
      q = Math.pow(a0, 2.6);
  }

  bm = bm.filter((b) => now - b.t < 0.8);
  const bc = bmc(now);
  for (const b of bm) {
    const age = now - b.t,
      fade = Math.max(0, 1 - age / 0.8),
      land = Math.min(1, age / 0.2),
      ks = b.k < 3 ? [b.k] : [0, 1, 2],
      head = FY * land * land;
    for (const k of ks) {
      const x = FX + LOf(k) * (lw / cs) * FARf;
      {
        const e = Math.min(1, age / 0.35),
          s = Math.max(0, (age - 0.08) / 0.4),
          q1 = Math.pow(e, 1.6),
          q0 = Math.pow(Math.min(1, s), 1.6),
          P = (q) => [
            FX + (W / 2 / cs - FX) * q + LOf(k) * (lw / cs) * (FARf + (1 - FARf) * q),
            PYf(LOf(k), q) / cs,
          ],
          A = P(q0),
          B = P(q1),
          th = 1 + Math.round(KR * q1 * 1.5);
        for (let d = 0; d < th; d++)
          ln(A[0] + d, A[1], B[0] + d, B[1], Math.max(0, 1 - age / 0.45), bc);
      }
      {
        const fl = Math.max(0, 1 - age / 0.32),
          e = Math.min(1, age / 0.32),
          vv = Math.min(1, fl * 1.8),
          sz = (2.2 + 6.5 * Math.sin(e * PI * 0.85)) * K,
          lc = k < 3 ? BRL[k] : 0;
        star(x, FY, sz, vv, bc, 0);
        star(x, FY, sz * 0.6, vv, k < 3 ? lc : bc || 3, PI / 4);
        ring(x, FY, (1 + e * 4.5) * K, Math.min(1, fl * 1.4), bc || lc);
        for (let i = 0; i < 4; i++) {
          const an = PI / 4 + (i * PI) / 2,
            rr = sz * (0.9 + e * 1.6);
          dot(x + Math.cos(an) * rr, FY + Math.sin(an) * rr, vv, lc);
          dot(x + Math.cos(an) * rr * 1.2, FY + Math.sin(an) * rr * 1.2, vv * 0.7, lc);
        }
        disc(x, FY, Math.max(0.8, 1.1 * K * fl), vv, 0, 1);
      }
    }
    if (b.k > 2 && land >= 1) ln(ex(0, 0), FY, ex(3, 0), FY, 0.8 * fade, bc);
  }
  {
    const cx = (k) => LXf(k) / cs,
      hmv = HMf(),
      yx = (x) => HYc + (hmv * (x * cs - W / 2 - cam.LS)) / cs,
      ss = (k) => PSf(LOf(k), 1),
      rr = gl * 0.4,
      ts = (1 + bump * 0.25 + run.pulse * 0.35) * K,
      tv = 0.55 + bump * 0.25,
      gp = 1.6 * K;
    for (let k = 0; k < 2; k++) {
      const a = cx(k) + rr * 1.3,
        b = cx(k + 1) - rr * 1.3,
        L = b - a;
      disc(a + L * 0.1, yx(a + L * 0.1), 0.45 * K, 0.7, 0, 1);
      ln(a + L * 0.3, yx(a + L * 0.3), a + L * 0.7, yx(a + L * 0.7), 0.6, 0);
      disc(a + L * 0.9, yx(a + L * 0.9), 0.45 * K, 0.7, 0, 1);
    }
    for (const sd of [-1, 1]) {
      const edge = sd < 0 ? cx(0) - rr * 1.3 : cx(2) + rr * 1.3,
        bsx = edge + sd * gp,
        tipx = bsx + sd * ts * 1.3,
        Y0 = yx(bsx),
        ts2 = ts * ss(sd < 0 ? 0 : 2);
      lnw(bsx, Y0 - ts2, bsx, Y0 + ts2, tv, 0);
      lnw(bsx, Y0 - ts2, tipx, Y0, tv, 0);
      lnw(bsx, Y0 + ts2, tipx, Y0, tv, 0);
    }
    for (let k = 0; k < 3; k++) {
      const x = cx(k),
        Yk = yx(x),
        s = ss(k);
      if (k == 1) {
        const d = rr * 0.95 * s;
        lnw(x, Yk - d, x + d, Yk, 0.6, 0);
        lnw(x + d, Yk, x, Yk + d, 0.6, 0);
        lnw(x, Yk + d, x - d, Yk, 0.6, 0);
        lnw(x - d, Yk, x, Yk - d, 0.6, 0);
        const e = d * 0.45;
        lnw(x, Yk - e, x + e, Yk, 0.3, 5);
        lnw(x + e, Yk, x, Yk + e, 0.3, 5);
        lnw(x, Yk + e, x - e, Yk, 0.3, 5);
        lnw(x - e, Yk, x, Yk - e, 0.3, 5);
      } else {
        ring(x, Yk, rr * s, 0.55, 0);
        ring(x, Yk, gl * 0.28 * s, 0.25, 5);
      }
    }
  }
  const ns = run.state === 'play' ? run.chart.find((w) => w.sp && !w.d) : null;
  if (run.state === 'play') {
    for (const w of run.chart) {
      if (!w.sp || w.d) continue;
      const o = npos(w, now);
      if (o.q <= 0) continue;
      const first = w === ns,
        v = first ? 1 : 0.5 + Math.min(1, o.q) * 0.4,
        c = first ? 0 : o.q > 0.55 ? 3 : 5;
      if (w.k < 3) {
        const nx = o.x / cs,
          ny = o.y / cs,
          nr = Math.max(1.2 * K, gl * 0.4 * o.q * PSf(LOf(w.k), o.q));
        ln(nx, ny, FX + (nx - FX) * 0.7, FY + (ny - FY) * 0.7, v * 0.6, [9, 6, 10][w.k]);
        nglyph(nx, ny, nr, w, now, v, c);
        if (o.q > 0.25)
          ring(
            LXf(w.k) / cs,
            PYf(LOf(w.k), 1) / cs,
            gl * 0.4 * PSf(LOf(w.k), 1) * (1 + (1 - Math.min(1, o.q)) * 1.6),
            0.12 + 0.5 * o.q,
            first ? 0 : 3
          );
      } else {
        const xl = ex(0, o.q),
          xr = ex(3, o.q),
          yl = PYf(-1, o.q) / cs,
          yr = PYf(1, o.q) / cs;
        for (let d = -1; d <= 1; d++) ln(xl, yl + d, xr, yr + d, d ? v * 0.5 : v, c);
      }
    }
  }
  for (const f of run.df) {
    const col = f.ok ? 0 : 4,
      v = f.l > 0.35 ? 1 : 0.5;
    if (f.k < 3) {
      const cx = LXf(f.k) / cs,
        Yf = PYf(LOf(f.k), 1) / cs,
        sf = PSf(LOf(f.k), 1);
      {
        const KR2 = Math.max(1, Math.round(K));
        ring(cx, Yf, gl * 0.6 * sf, v * 0.8, [9, 6, 10][f.k]);
        for (let d = 0; d < KR2; d++) gly(cx + d, Yf, gl * 0.8 * sf, f.g | 0, v, col);
      }
    } else ln(E[0], PYf(-1, 1) / cs, E[3], PYf(1, 1) / cs, 0.9 * v, col);
  }
  {
    const qs = (H * 0.78 - fy) / (hy - fy),
      ox = (fx + (W / 2 - fx) * qs + SHf(qs)) / cs,
      oy = (H * 0.78) / cs,
      PS0 = 1 + (FARf + (1 - FARf) * qs - 1) * 0.6,
      hu = now - run.hubT,
      hl = (sp2) => 0,
      hw = hu >= 0 && hu < 1.1 ? (0.5 + 0.5 * Math.cos((PI * hu) / 1.1)) * run.hubQ : 0,
      R = gl * 0.28 * PS0 * (1 + bump * 0.12 + hw * 0.45);
    {
      const sr = R * 1.5;
      star(ox, oy, sr, 1, bmc(now), bt * 0.05);
      star(ox, oy, sr * 0.6, 0.7, bmc(now) || 3, -bt * 0.08 + PI / 4);
      disc(ox, oy, Math.max(1, R * 0.18), 1, 0, 0);
    }
    if (hu >= 0 && hu < 1.1) {
      const u = hu / 1.1;
      for (let n = 0; n < 3; n++) {
        const w = Math.max(0, Math.min(1, (u - n * 0.14) / (1 - n * 0.14))),
          e = 1 - Math.pow(1 - w, 2.4),
          fw = Math.pow(1 - w, 1.3);
        if (w > 0)
          ring(
            ox,
            oy,
            R * 1.6 + gl * (0.2 + 1.7 * e),
            (0.85 - n * 0.2) * fw * run.hubQ,
            (run.hubK < 3 ? [0, [9, 6, 10][run.hubK], [9, 6, 10][run.hubK]] : [0, 0, 0])[n]
          );
      }
    }
    rays = rays.filter((r) => now - r.t < 0.4);
    for (const r of rays) {
      const a = now - r.t,
        f = 1 - a / 0.4,
        e = Math.min(1, a / 0.06),
        s = Math.max(0, (a - 0.05) / 0.25);
      for (const T of r.k < 3 ? [r.k] : [0, 1, 2]) {
        const tx = LXf(T) / cs,
          ty = PYf(LOf(T), 1) / cs,
          x0 = ox + (tx - ox) * s,
          y0 = oy + (ty - oy) * s,
          x1 = ox + (tx - ox) * e,
          y1 = oy + (ty - oy) * e;
        for (let d = 0; d < KR; d++) ln(x0 + d, y0, x1 + d, y1, f, 0);
        ln(x0 - 2, y0, x1 - 2, y1, f * 0.9, 9);
        ln(x0 + KR + 1, y0, x1 + KR + 1, y1, f * 0.9, 10);
      }
    }
  }

  if (run.state === 'end') {
    const t = (performance.now() - run.endT) / 1000,
      ox = W / 2 / cs,
      oy = (H * 0.78) / cs,
      N = PAL.length,
      rc = (i) => N - 1 - (((i % N) + N) % N),
      stp = Math.floor(t * 9),
      Rm = Math.min(gw, gh2) * 0.5;
    disc(ox, oy, gl * 0.32, 1, rc(stp), 1);
    ring(ox, oy, gl * 0.45, 0.9, rc(stp + 3));
    star(ox, oy, gl * 0.9, 1, rc(stp + 5), t * 2);
    for (let k = 0; k < 4; k++) {
      const ph = (t * 0.5 + k / 4) % 1;
      ring(ox, oy, ph * Rm, 1 - ph * 0.8, rc(stp + k * 3));
    }
    for (let i = 0; i < 64; i++) {
      const a = i * 2.39996 + (i % 2 ? t * 0.15 : -t * 0.1),
        sp = 0.25 + (((i * 37) % 10) / 10) * 0.75,
        ph = (t * 0.35 * sp + i * 0.137) % 1,
        r = ph * Rm * (0.35 + 0.65 * sp);
      star(
        ox + Math.cos(a) * r,
        oy + Math.sin(a) * r,
        (1 + (i % 3)) * K * (1 - ph * 0.6),
        1 - ph * 0.7,
        rc(stp + i),
        t * 3 + i
      );
    }
  }
  ip = ip.filter((o) => now - o.t < (o.sp ? 1.5 : 1.1));
  edgeWave(now);
  for (const o of ip) {
    const a = now - o.t,
      life = o.sp ? 1.5 : 1.1,
      f = 0.5 + 0.5 * Math.cos(PI * Math.min(1, a / life)),
      cx = o.x / cs,
      cy = o.y / cs;
    if (o.sp) {
      {
        const mid = (E[0] + E[3]) / 2,
          e = Math.min(1, a / 0.7),
          half = ((E[3] - E[0]) / 2) * (1 + 1.1 * (1 - Math.pow(1 - e, 3))),
          N = 41,
          PT = [1, 0.4, 0.7, 0.3];
        for (let i = 0; i < N; i++) {
          const u = i / (N - 1),
            x = mid - half + half * 2 * u,
            env = Math.pow(Math.sin(PI * u), 1.5),
            m = Math.abs(i - (N - 1) / 2),
            pat = PT[m % 4],
            w = Math.sin(m * 0.55 - a * 20) * 0.5 + 0.5,
            h = f * (0.3 + 0.7 * w) * pat * (0.15 + 0.85 * env) * gh2 * 0.1,
            th = env > 0.45 ? KR : 1;
          for (let d = 0; d < th; d++) {
            ln(x + d, HYc - h, x + d, HYc, f, pat == 1 ? 0 : 3);
            ln(x + d, HYc, x + d, HYc + h * 0.3, f * 0.5, 3);
          }
          if (pat == 1 && env > 0.1) {
            const cy = HYc - h - 2 * K;
            dot(x, cy - 1, f, 0);
            dot(x - 1, cy, f, 0);
            dot(x + 1, cy, f, 0);
            dot(x, cy + 1, f, 0);
          }
        }
        for (let x = Math.round(mid - half); x <= mid + half; x++) {
          const u = (x - (mid - half)) / (2 * half),
            t = Math.round(KR * (0.2 + 0.9 * Math.pow(Math.sin(PI * u), 0.8)));
          ln(x, HYc - t, x, HYc + t, f, 0);
        }
        for (let j = 1; j <= 7; j++) {
          const v = f * (1 - j / 8) * 0.7;
          dot(mid - half - j * 2 * K, HYc, v, 3);
          dot(mid + half + j * 2 * K, HYc, v, 3);
        }
        for (let x = Math.round(mid - half); x <= mid + half; x += 2) {
          const w2 = Math.sin(x * 0.3 - a * 30) * gh2 * 0.03 * f;
          dot(x, HYc + 3 * K + w2, f, 9);
          dot(x, HYc - 3 * K - w2, f, 10);
        }
      }
    } else {
      const u = Math.min(1, a / life);
      for (let n = 0; n < 3; n++) {
        const w = Math.max(0, Math.min(1, (u - n * 0.14) / (1 - n * 0.14))),
          e = 1 - Math.pow(1 - w, 2.4),
          fw = Math.pow(1 - w, 1.3) * (w > 0 ? 1 : 0),
          r = gl * (0.5 + 1.9 * e);
        if (w > 0)
          ring(
            cx,
            cy,
            r,
            (0.9 - n * 0.2) * fw * o.q,
            (o.k < 3 ? [0, [9, 6, 10][o.k], [9, 6, 10][o.k]] : [0, 0, 0])[n]
          );
      }
    }
  }
  if (run.inv > 0.12 && run.fc === 4) {
    for (let i = 0; i < Math.round(2 * K); i++)
      for (let q = 0; q < 3; q++) {
        const a = q / 3,
          b = (q + 1) / 3,
          c = run.fc < 0 ? [9, 6, 10][q] : run.fc;
        ln(i, gh2 * a, i, gh2 * b, 1, c);
        ln(gw - 1 - i, gh2 * a, gw - 1 - i, gh2 * b, 1, c);
        ln(gw * a, i, gw * b, i, 1, c);
        ln(gw * a, gh2 - 1 - i, gw * b, gh2 - 1 - i, 1, c);
      }
  }
  if (run.state === 'play') {
    txt(LABEL.hp + ' ' + bar(run.hp / 100, 10), 12, SAT + 24, run.hp > 30 ? 0 : 4, 13, 'left');
    txt(
      LABEL.progress +
        ' ' +
        bar(Math.max(0, Math.min(1, bt / run.END)), 20) +
        ' ' +
        Math.max(0, Math.round(bt * 37)) +
        ' ' +
        LABEL.unit,
      W / 2,
      SAT + 46,
      3,
      13
    );
    txt(String(Math.round(run.score)).padStart(7, '0'), W - 12, SAT + 26, 0, 18, 'right');
    if (run.combo > 1) txt(run.combo + ' COMBO', W / 2, SAT + 110, 0, 22);
    const ma = 1 - (now - run.mt) / 0.6;
    if (run.msg && ma > 0) txt(run.msg, W / 2, SAT + 80, run.mc, msz);
  } else txt('--- ANGEL MATRIX ---', W / 2, H * 0.93, 5, 13);
  {
    const gr = g.createRadialGradient(fx, fy, 0, fx, fy, Math.max(W, H) * 0.8);
    gr.addColorStop(0, 'rgba(95,98,108,' + (0.06 + bump * 0.04) + ')');
    gr.addColorStop(0.4, 'rgba(16,16,20,.08)');
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = '#000';
    g.fillRect(0, 0, W, H);
    g.fillStyle = gr;
    g.fillRect(0, 0, W, H);
  }
  g.save();
  if (run.shake > 0.3)
    g.translate((Math.random() - 0.5) * run.shake * 8, (Math.random() - 0.5) * run.shake * 8);
  g.translate(-cam.x * 0.4, -cam.y * 0.8 + cam.ky * 6);
  {
    const z = 1 + cam.zs * 0.03 + Math.min(0.03, Math.max(0, SPD - 0.4) * 0.025);
    g.translate(W / 2, bg.focus[1]);
    g.rotate(cam.RA);
    g.scale(z, z);
    g.translate(-W / 2, -bg.focus[1]);
  }
  if (run.theme === 1) nightSky(fx, fy, bump);
  else veilBg(now, bt, fx, fy, bump);
  {
    const ma = moodA(now),
      mk = bmc(now);
    if (ma > 0 && mk) {
      const hx = PAL[mk],
        cr = parseInt(hx.slice(1, 3), 16),
        cg = parseInt(hx.slice(3, 5), 16),
        cb = parseInt(hx.slice(5, 7), 16),
        pu = ma * (0.4 + bump * 0.2),
        rg = 'rgba(' + cr + ',' + cg + ',' + cb + ',',
        gr2 = g.createRadialGradient(
          fx,
          fy,
          0,
          fx,
          fy,
          Math.min(gh2 * 0.07, gw * 0.11) * cs * 3.6 * (1 + bump * 0.08)
        );
      gr2.addColorStop(0, rg + pu + ')');
      gr2.addColorStop(0.55, rg + pu * 0.35 + ')');
      gr2.addColorStop(1, rg + '0)');
      g.save();
      g.setTransform(DPR, 0, 0, DPR, 0, 0);
      g.globalCompositeOperation = 'screen';
      g.fillStyle = gr2;
      g.fillRect(0, 0, W, H);
      g.globalCompositeOperation = 'source-over';
      const vg = g.createRadialGradient(
        W / 2,
        H / 2,
        Math.min(W, H) * 0.3,
        W / 2,
        H / 2,
        Math.max(W, H) * 0.75
      );
      vg.addColorStop(0, 'rgba(0,0,0,0)');
      vg.addColorStop(1, 'rgba(0,0,0,' + 0.45 * ma + ')');
      g.fillStyle = vg;
      g.fillRect(0, 0, W, H);
      g.restore();
    }
  }
  const paths = FON() ? [] : Array.from({ length: PAL.length * 5 }, () => new Path2D());
  if (!FON())
    for (let i = 0; i < FB.length; i++) {
      const v = FB[i];
      if (v < 0.04) continue;
      const l = Math.min(5, Math.ceil(v * 5)),
        x = ((i % gw) + 0.5) * cs,
        y = (((i / gw) | 0) + 0.5) * cs,
        r = Math.max(0.7, cs * (0.08 + 0.06 * l)),
        p = paths[FCl[i] * 5 + l - 1];
      if (cs < 2) p.rect(x - r, y - r, r * 2, r * 2);
      else {
        p.moveTo(x + r, y);
        p.arc(x, y, r, 0, TAU);
      }
    }
  if (FON()) ascDraw();
  else {
    const TPd = getTP();
    if (run.theme === 2) g.globalAlpha = 0.66;
    paths.forEach((p, k) => {
      g.fillStyle = TPd[(k / 5) | 0];
      g.fill(p);
    });
    g.globalAlpha = 1;
  }
  drawHub();
  drawTwinkles();
  bloom();
  g.translate(W / 2, bg.focus[1]);
  g.rotate(-cam.RA);
  g.translate(-W / 2, -bg.focus[1]);
  g.textBaseline = 'middle';
  for (const [s, x, y, c, sz, al] of TQ) {
    g.font = Math.max(8, Math.round(sz * 0.7)) + 'px "Press Start 2P","Courier New",monospace';
    g.textAlign = al;
    g.fillStyle = PAL[c];
    g.fillText(s, x, y);
  }
  g.restore();
  if (cam.flash > 0.02) {
    g.fillStyle =
      (run.theme === 2 ? 'rgba(200,200,255,' : 'rgba(30,190,165,') + Math.min(0.3, cam.flash * 0.3) + ')';
    g.fillRect(0, 0, W, H);
  }
  for (const f of run.df) f.l -= 0.03;
  run.df = run.df.filter((f) => f.l > 0);
  for (const p of run.pt) {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy = p.vy * 0.95 + 0.12;
    p.l -= 0.022;
    if (Math.random() < 0.1) p.g = (Math.random() * GL.length) | 0;
  }
  run.pt = run.pt.filter((p) => p.l > 0);
}
