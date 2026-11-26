function flUI() {
  const F = FILTERS[tex.filt];
  document
    .querySelectorAll('[data-fl]')
    .forEach((b) => (b.textContent = 'TEXTURE ' + (tex.filt + 1) + '/' + FILTERS.length + ': ' + F.n));
  document
    .querySelectorAll('[data-tn]')
    .forEach((b) => (b.textContent = 'COLOURWAY: ' + TN[tex.tint][0]));
}
function flChange() {
  try {
    localStorage.setItem('amFilt2', FILTERS[tex.filt].n);
    localStorage.setItem('amTint', tex.tint);
  } catch (e) {}
  flUI();
  /* peek: clear the overlay backdrop for a moment so the effect is visible behind the buttons; keep drawing while paused */
  const el = run.paused ? pz : ov.style.display !== 'none' ? ov : null;
  if (el) {
    tex.peekUntil = performance.now() + 3000;
    el.style.background = 'rgba(0,0,0,0)';
    clearTimeout(tex.peekTimer);
    tex.peekTimer = setTimeout(() => {
      pz.style.background = '';
      ov.style.background = '';
    }, 3000);
  }
}
document.querySelectorAll('[data-f]').forEach(
  (b) =>
    (b.onclick = () => {
      tex.filt = (tex.filt + +b.dataset.f + FILTERS.length) % FILTERS.length;
      flChange();
    })
);
document.querySelectorAll('[data-fl]').forEach(
  (b) =>
    (b.onclick = () => {
      tex.filt = (tex.filt + 1) % FILTERS.length;
      flChange();
    })
);
document.querySelectorAll('[data-tn]').forEach(
  (b) =>
    (b.onclick = () => {
      tex.tint = (tex.tint + 1) % TN.length;
      flChange();
    })
);
try {
  const sv = localStorage.getItem('amFilt2'),
    ix = FILTERS.findIndex((f) => f.n === sv);
  tex.filt = ix >= 0 ? ix : 0;
} catch (e) {
  tex.filt = 0;
}
try {
  const so = localStorage.getItem('amOff');
  if (so !== null && isFinite(+so)) {
    run.OFF = +so;
    run.offTuned = 1;
  }
} catch (e) {}
