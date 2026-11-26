var CE = [];
function saveOff() {
  try {
    localStorage.setItem('amOff', run.OFF);
  } catch (e) {}
}
function calib(e) {
  if (Math.abs(e) > 0.12) return;
  CE.push(e);
  if (CE.length >= 6) {
    const q = CE.slice().sort((a, b) => a - b),
      m = (q[2] + q[3]) / 2;
    CE = [];
    if (Math.abs(m) > 0.008) {
      run.OFF = Math.max(-0.15, Math.min(0.4, run.OFF + m * 0.6));
      run.offTuned = 1;
      saveOff();
    }
  }
}
function cast(k, ts) {
  if (run.state !== 'play' || !run.ac || run.paused) return;
  const now =
    run.ac.currentTime - (ts ? Math.min(0.12, Math.max(0, (performance.now() - ts) / 1000)) : 0);
  run.pose = k;
  cam.lk += (k < 3 ? k - 1 : 0) * 0.01;
  let b = null,
    o = null;
  for (const w of run.chart) {
    if (!w.sp || w.d) continue;
    const sd = now - (w.at + run.OFF),
      d = Math.abs(sd);
    if (sd < -WINE || sd > WIN) continue;
    if (w.k === k) {
      if (!b || d < b.d) b = { w, d };
    } else if (d <= WIN && (!o || d < o.d)) o = { w, d };
  }

  if (!b) {
    if (
      o &&
      !run.chart.some(
        (x) => x.sp && !x.d && x.k === k && Math.abs(x.at + run.OFF - now) <= WIN * 2.2
      )
    ) {
      hurt(3, 'WRONG KEY', now, 1);
      run.df.push({ k, l: 1, ok: 0 });
      if (run.df.length > 2) run.df.shift();
    }
    return;
  }
  const w = b.w,
    d = b.d,
    sdv = now - (w.at + run.OFF),
    pf = d <= PF,
    gd = d <= GD;
  w.d = 1;
  run.hits++;
  run.total++;
  run.combo++;
  run.maxc = Math.max(run.maxc, run.combo);
  run.score += (pf ? 300 : gd ? 150 : 70) * (1 + run.combo * 0.02);
  run.msg =
    (pf ? 'PERFECT' : gd ? 'GOOD' : 'OK') + (pf ? '' : now < w.at + run.OFF ? '  EARLY' : '  LATE');
  run.mc = pf ? 12 : KC[k];
  run.mt = now;
  run.df.push({ k, l: 1, ok: 1, g: w.g | 0 });
  if (run.df.length > 2) run.df.shift();
  {
    const p = npos(w, now);
    impact(
      k,
      pf ? 1 : gd ? 0.75 : 0.5,
      now,
      k === 3 ? W / 2 + cam.LS : p.x,
      PYf(k < 3 ? LOf(k) : 0, 1)
    );
  }
  run.msz = k === 3 ? (pf ? 36 : 30) : 24;
  run.inv = k === 3 ? 0.3 : pf ? 0.35 : 0.15;
  run.fc = KC[k];
  run.shake = k === 3 ? 0 : pf ? 0.5 : 0.3;
  calib(sdv);
}
