function boss(now, bt, FX, FY, bump) {
  hub.glint = [FX * cs, FY * cs];
  const BC = bmc(now),
    r = run.rays[run.rays.length - 1],
    hu = now - run.hubT,
    hw = hu >= 0 && hu < 1.1 ? (0.5 + 0.5 * Math.cos((PI * hu) / 1.1)) * run.hubQ : 0,
    hit = Math.max(r ? Math.max(0, 1 - (now - r.t) / 0.35) : 0, hw),
    R = Math.min(gh2 * 0.07, gw * 0.11) * (1 + 0.14 * hit + 0.06 * bump),
    KR = Math.max(1, Math.round(K)),
    LCA = [9, 6, 10],
    lcf = (i) => (run.hubK < 3 ? LCA[run.hubK] : 0),
    hc = hit > 0.15 ? lcf(0) : BC;
  // halo hovering above the circle (double ellipse) + dotted rings around it
  {
    const MA = moodA(now),
      HY = FY - R * 1.6 + Math.sin(bt * 0.7) * R * 0.06;
    if (MA > 0) {
      const NS = 13;
      for (let k = 0; k < NS; k++) {
        const a = PI + ((k + 0.5) / NS) * PI,
          x0 = FX + Math.cos(a) * R,
          y0 = HY + Math.sin(a) * R * 0.36,
          L =
            MA *
            R *
            ((k % 2 ? 0.28 : 0.55) + 0.12 * Math.sin(bt * 4 + k * 1.3)) *
            (1 + bump * 0.35),
          x1 = x0 + Math.cos(a) * L * 0.5,
          y1 = y0 - L;
        ln(x0, y0, x1, y1, 1, BC);
        dot(x1, y1, 1, 0);
        dot(x1, y1 - 1, 0.8, 0);
      }
    }
    for (let i = 0; i < 110; i++) {
      const a = (i / 110) * TAU,
        x = FX + Math.cos(a) * R,
        y = HY + Math.sin(a) * R * 0.36;
      for (let d = 0; d < KR; d++) dot(x, y + d, 1, hc);
      const x2 = FX + Math.cos(a) * R * 0.72,
        y2 = HY + Math.sin(a) * R * 0.26;
      dot(x2, y2, 0.5, BC || 3);
    }
    const sa = bt * 0.5,
      sx = FX + Math.cos(sa) * R * 1.15,
      sy = HY + Math.sin(sa) * R * 0.3;
    ln(sx - 3 * K, sy, sx + 3 * K, sy, 1, BC);
    ln(sx, sy - 3 * K, sx, sy + 3 * K, 1, BC);
  }
  sring(
    FX,
    FY,
    R * 1.2,
    0.4 + 0.3 * hit,
    hit > 0.15 ? lcf(1) : BC || 3,
    bt * 0.04,
    (i, n) => (i % 6 < 3 ? 0.5 : 0),
    BC ? run.bi + 1 : 0
  );
  sring(
    FX,
    FY,
    R * 1.5,
    0.25 + 0.3 * hit,
    hit > 0.15 ? lcf(0) : BC || 6,
    -bt * 0.05,
    (i, n) => (i % 8 < 3 ? 0.4 : 0),
    BC ? run.bi + 1 : 0
  );
  if (hu >= 0 && hu < 1.1) {
    const u = hu / 1.1;
    for (let n = 0; n < 3; n++) {
      const w = Math.max(0, Math.min(1, (u - n * 0.14) / (1 - n * 0.14))),
        e = 1 - Math.pow(1 - w, 2.4),
        fw = Math.pow(1 - w, 1.3);
      if (w > 0)
        sring(
          FX,
          FY,
          R * (1.4 + 2.2 * e),
          (0.85 - n * 0.2) * fw * run.hubQ,
          run.hubK < 3 ? [BC, lcf(0), lcf(0)][n] : BC,
          0,
          null,
          BC ? run.bi + 1 : 0
        );
    }
  }
  // wings: two mirrored fans of very thin, widely spaced bars that dance like a spectrum analyser
  const WN = 11,
    WS = R * 1.5,
    WM = Math.min(R * 6.2, gw * 0.46),
    wc = hit > 0.15 ? 9 : 0,
    lv = (i, t) =>
      0.22 +
      0.5 * (0.5 + 0.5 * Math.sin(t * (1.5 + i * 0.41) + i * 1.7)) +
      0.28 * (0.5 + 0.5 * Math.sin(t * 3.3 - i * 0.9 + 1));
  if (run.theme !== 2)
    for (const m of [-1, 1])
      for (let i = 0; i < WN; i++) {
        const wc = hit > 0.15 ? lcf(i) : BC,
          tc = hit > 0.15 ? lcf(i + 1) : BC || 12,
          u = i / (WN - 1),
          an = -(1.2 - 1.65 * u) - bump * 0.04 + Math.sin(bt * 0.5) * 0.035,
          dx = m * Math.cos(an),
          dy = Math.sin(an),
          st = WS * (1 + 0.18 * Math.sin(u * PI)),
          sx = FX + dx * st,
          sy = FY + dy * st,
          env = 0.6 + 0.4 * Math.sin(PI * (u * 0.9 + 0.12)),
          cap = Math.min(
            dy < -0.05 ? (sy - FY * 0.08) / -dy : 1e9,
            (gw / 2 - 2) / Math.max(0.2, Math.abs(dx)) - st
          ),
          lvl = Math.min(
            1.2,
            lv(i, bt) * (1 + bump * 0.3) +
              hit * Math.max(0, 1 - Math.abs(u - (1 - hit) * 1.2) * 4) * 0.5
          ),
          pk = Math.max(lvl, lv(i, bt - 0.3) * 0.95, lv(i, bt - 0.6) * 0.9),
          L = Math.max(R * 0.5, Math.min(WM * env * lvl, cap)),
          Lp = Math.min(WM * env * pk + 2.2 * K, cap);
        for (let q = 0; q <= L; q += 0.8) {
          if (q % 4.8 > 3.6) continue;
          const t = q / L;
          dot(sx + dx * q, sy + dy * q, 0.95 - 0.55 * t, t < 0.55 ? wc : BC || 3);
        }
        dot(sx + dx * L, sy + dy * L, 1, wc);
        dot(sx + dx * Lp, sy + dy * Lp, 0.85, tc);
        dot(sx + dx * (Lp + 1), sy + dy * (Lp + 1), 0.55, tc);
      }
  {
    if (run.himg) {
      let tt = (now * 1000) % run.himg.tot,
        ix = 0;
      while (ix < run.himg.fr.length - 1 && tt >= run.himg.du[ix]) {
        tt -= run.himg.du[ix];
        ix++;
      }
      const FA = run.himg.fr[ix],
        S = Math.ceil(R * 1.5),
        hw2 = run.himg.w,
        hh2 = run.himg.h,
        hz = Math.max(hw2, hh2),
        hf = (a, b) =>
          hsm(FA, hw2, hh2, (a / (2 * S)) * hz + hw2 / 2, (b / (2 * S)) * hz + hh2 / 2);
      hub.sprite = { FA, w: hw2, h: hh2, x: FX, y: FY, S, c: hc, l: hit };
      for (let yy = -S; yy <= S; yy++)
        for (let xx = -S; xx <= S; xx++) {
          if (
            Math.max(hf(xx, yy), hf(xx + 1, yy), hf(xx - 1, yy), hf(xx, yy + 1), hf(xx, yy - 1)) <
            0.04
          )
            continue;
          const X = Math.round(FX + xx),
            Y = Math.round(FY + yy);
          if (X >= 0 && Y >= 0 && X < gw && Y < gh2) {
            const ix2 = Y * gw + X;
            if (FON()) {
              const hv = Math.min(1, Math.pow(hf(xx, yy), 0.9) * 1.2);
              FB[ix2] = hv;
              if (hv > 0) FCl[ix2] = hc;
            } else FB[ix2] = 0;
          }
        }
    } else {
      const hs = BC ? run.bi + 1 : 0;
      dsw(FX, FY, R * 0.62, 1, BC, 0, hs);
      dsw(FX, FY, R * 0.5, 1, BC || 3, 1, hs);
      dsw(FX, FY, R * 0.22, 1, 0, 0, hs);
    }
  }
}
