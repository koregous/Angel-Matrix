function pause() {
  if (run.state !== 'play' || run.paused || !run.ac) return;
  run.paused = true;
  run.ac.suspend();
  pz.style.display = 'flex';
  mb.style.display = 'none';
}
function resume() {
  if (!run.paused) return;
  run.paused = false;
  run.fromPause = false;
  pz.style.display = 'none';
  mb.style.display = 'block';
  run.ac.resume();
}
mb.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  pause();
});
document.getElementById('rs').onclick = resume;
{
  const nd = (d) => {
    run.OFF += d;
    run.offTuned = 1;
    saveOff();
    STP.textContent = 'OFFSET ' + Math.round(run.OFF * 1000) + 'MS';
  };
  document.getElementById('om').onclick = () => nd(-0.01);
  document.getElementById('op').onclick = () => nd(0.01);
}
document.getElementById('pr').onclick = () => {
  if (run.busy) return;
  run.fromPause = false;
  start();
};
pc.onclick = () => {
  run.fromPause = true;
  document.getElementById('fi').click();
};
document.getElementById('pq').onclick = () => {
  if (run.busy) return;
  run.paused = false;
  run.fromPause = false;
  run.state = 'menu';
  try {
    run.trSrc && run.trSrc.stop();
  } catch (e) {}
  run.ac && run.ac.resume();
  pz.style.display = 'none';
  mb.style.display = 'none';
  document.getElementById('t').textContent = '[ ANGEL MATRIX ]';
  document.getElementById('b').innerHTML = BODY0;
  const go = document.getElementById('go');
  go.textContent = 'START';
  go.style.display = run.tr ? '' : 'none';
  ov.style.display = 'flex';
};
document.addEventListener('visibilitychange', () => {
  if (document.hidden) pause();
});
