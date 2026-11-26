addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = e.key.toLowerCase();
  if (k === 'escape' || k === 'p') {
    if (run.state === 'play') run.paused ? resume() : pause();
    return;
  }
  if (k === '[' || k === ']') {
    run.OFF += k === ']' ? 0.01 : -0.01;
    run.offTuned = 1;
    saveOff();
    run.msg = 'OFFSET ' + Math.round(run.OFF * 1000) + 'ms';
    run.mc = 5;
    run.mt = run.ac ? run.ac.currentTime : 0;
  } else if (k in KM) {
    if (k === ' ') e.preventDefault();
    if (run.state === 'play') cast(KM[k], e.timeStamp);
    else if (k === ' ') start();
  } else if (k === 'enter' && run.state !== 'play') start();
});
document.getElementById('go').onclick = start;
