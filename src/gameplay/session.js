function start() {
  if (run.busy || !run.tr) return;
  ov.classList.remove('fin');
  run.act = run.tr;
  if (!run.ac) {
    run.ac = new (window.AudioContext || window.webkitAudioContext)();
    run.mix = run.ac.createGain();
    run.mix.gain.value = 0.8;
    run.mix.connect(run.ac.destination);
    run.sb = run.ac.createGain();
    run.sb.gain.value = 0.6;
    const rv = run.ac.createConvolver(),
      n = run.ac.sampleRate * 2.4,
      ib = run.ac.createBuffer(2, n, run.ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = ib.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5);
    }
    rv.buffer = ib;
    const rg = run.ac.createGain();
    rg.gain.value = 0.7;
    run.sb.connect(rv);
    rv.connect(rg);
    rg.connect(run.ac.destination);
    run.nb = run.ac.createBuffer(1, run.ac.sampleRate, run.ac.sampleRate);
    const d = run.nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  run.ac.resume();
  if (!run.offTuned) run.OFF = Math.min(0.25, (run.ac.outputLatency || 0) + (run.ac.baseLatency || 0));
  run.END = run.act.endB;
  timing(60 / run.act.bpm);
  run.t0 = run.ac.currentTime + 0.4 + run.act.P;
  run.chart = buildTr();
  try {
    run.trSrc && run.trSrc.stop();
  } catch (e) {}
  run.trSrc = run.ac.createBufferSource();
  run.trSrc.buffer = run.act.buf;
  run.trSrc.connect(run.mix);
  run.trSrc.start(run.t0 - run.act.P);
  run.nextStep = 0;
  run.hp = 100;
  run.score = 0;
  run.combo = 0;
  run.maxc = 0;
  run.hits = 0;
  run.total = 0;
  run.df = [];
  run.pt = [];
  run.bm = [];
  run.msg = '';
  run.state = 'play';
  ov.style.display = 'none';
  pz.style.display = 'none';
  run.paused = false;
  mb.style.display = 'block';
}
function finish(win) {
  run.state = 'end';
  run.endT = performance.now();
  ov.classList.add('fin');
  try {
    run.trSrc && run.trSrc.stop();
  } catch (e) {}
  const acc = run.total ? run.hits / run.total : 0,
    rk = !win ? 'F' : acc >= 0.95 ? 'S' : acc >= 0.85 ? 'A' : acc >= 0.7 ? 'B' : 'C';
  document.getElementById('t').textContent = win ? '[ RANK ' + rk + ' ]' : '[ DEFEATED ]';
  document.getElementById('b').innerHTML =
    'Score ' +
    Math.round(run.score) +
    ' · Max combo ' +
    run.maxc +
    ' · Accuracy ' +
    Math.round(acc * 100) +
    '%';
  document.getElementById('go').textContent = 'PLAY AGAIN';
  document.getElementById('go').style.display = '';
  mb.style.display = 'none';
  ov.style.display = 'flex';
}
function hurt(n, l, now, q) {
  run.hp -= n;
  run.combo = 0;
  run.shake = 1;
  run.inv = 0.45;
  run.fc = 4;
  run.msg = l;
  run.mc = 4;
  run.mt = now;
  if (!q) {
    tone(70, 0.3, 'sawtooth', 0.5, now, 30);
    noise(0.2, 0.4, now, 200);
  }
}
