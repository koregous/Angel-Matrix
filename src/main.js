function frame() {
  requestAnimationFrame(frame);
  if ((run.paused && performance.now() > tex.peekUntil) || !FB || !NCP) return;
  const T = performance.now(),
    now = run.ac ? run.ac.currentTime : 0,
    bt = run.state === 'play' ? (now - run.t0) / SPB : T / 1000 / SPB;
  if (run.state === 'play') {
    for (const w of run.chart) {
      if (!w.sp && bt >= w.b - w.lead) {
        w.sp = 1;
        run.bm.push({ k: w.k, t: now });
        if (w.k == 3) run.pulse = 1;
      }
      if (!w.sp || w.d) continue;
      if (w.ty) {
        if (now > w.end + run.OFF) {
          run.total++;
          if (w.got >= w.need) {
            w.d = 1;
            run.hits++;
            if (w.got >= w.n) {
              run.score += 150;
              run.msg = 'CLEAN FLOW';
              run.mc = 2;
            } else {
              run.msg = 'FLOW';
              run.mc = 3;
            }
            run.mt = now;
          } else {
            w.d = 3;
            hurt(6, 'FLOW BROKEN', now);
          }
        }
      } else if (now > w.at + run.OFF + WIN + 0.06) {
        w.d = 3;
        run.total++;
        hurt(2, 'MISS', now);
      }
    }
    if (run.hp <= 0) finish(false);
    else if (bt > run.END + 3) finish(true);
  }
  run.shake *= 0.9;
  run.inv *= 0.88;
  cam.flash *= 0.86;
  cam.kv += -cam.ky * 0.3;
  cam.kv *= 0.76;
  cam.ky += cam.kv;
  cam.zv += -cam.zs * 0.3;
  cam.zv *= 0.76;
  cam.zs += cam.zv;
  run.pulse *= 0.9;
  run.rl *= 0.8;
  cam.boost *= 0.95;
  cam.sz += cam.boost * 0.05;
  cam.lk *= 0.92;
  cam.LS = 0;
  cam.x = 0;
  cam.y = 0;
  {
    const s = Math.sin(bt * 0.2);
    cam.RA =
      ROLL * Math.sign(s) * Math.pow(Math.abs(s), 0.6) +
      0.004 * Math.sin(bt * PI) +
      cam.lk -
      (bkOff(bt) / W) * 0.5;
  }
  {
    bg.focus = [
      W / 2 + bkOff(bt) + W * (run.theme === 1 ? 0.02 : 0.045) * Math.sin(bt * 0.21),
      H * 0.34 +
        H * 0.012 * Math.sin(bt * 0.42) -
        H * 0.007 * Math.pow(1 - (((bt % 1) + 1) % 1), 3),
    ];
    bg.t -= 1 / 60;
    if (bg.t <= 0) {
      if (Math.random() < 0.55) {
        const an = Math.random() * TAU,
          sp = 5 + Math.random() * 7;
        bg.tx = Math.cos(an) * sp;
        bg.ty = Math.sin(an) * sp * 0.7;
        bg.t = 1.5 + Math.random() * 2.5;
      } else {
        bg.tx = (Math.random() - 0.5) * 3;
        bg.ty = (Math.random() - 0.5) * 3;
        bg.t = 1 + Math.random() * 2;
      }
    }
    bg.vx += (bg.tx - bg.vx) * 0.04;
    bg.vy += (bg.ty - bg.vy) * 0.04;
    bg.px += bg.vx * 0.55;
    bg.py += bg.vy * 0.55;
    bg.x = bg.px + Math.sin(bt * 0.3) * W * 0.12;
    bg.y = bg.py + Math.sin(bt * 0.48) * H * 0.15 + cam.ky * 8;
  }
  draw(now, bt);
}
