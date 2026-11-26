function tone(f, d, type, v, time, f2, wet) {
  const o = run.ac.createOscillator(),
    n = run.ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, time);
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, time + d);
  n.gain.setValueAtTime(v, time);
  n.gain.exponentialRampToValueAtTime(0.001, time + d);
  o.connect(n);
  n.connect(run.mix);
  if (wet) n.connect(run.sb);
  o.start(time);
  o.stop(time + d + 0.02);
}
function noise(d, v, time, hpf, wet) {
  const s = run.ac.createBufferSource(),
    f = run.ac.createBiquadFilter(),
    n = run.ac.createGain();
  s.buffer = run.nb;
  f.type = 'highpass';
  f.frequency.value = hpf;
  n.gain.setValueAtTime(v, time);
  n.gain.exponentialRampToValueAtTime(0.001, time + d);
  s.connect(f).connect(n);
  n.connect(run.mix);
  if (wet) n.connect(run.sb);
  s.start(time);
  s.stop(time + d + 0.02);
}
