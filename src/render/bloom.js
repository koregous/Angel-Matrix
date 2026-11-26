function ascTint(bt) {
  const p = Math.max(0, Math.min(1, bt / run.END)),
    A = [60, 70, 200],
    B = [150, 70, 200],
    C = [255, 185, 110],
    lr = (x, y, t) => x.map((v, i) => Math.round(v + (y[i] - v) * t)),
    c = p < 0.5 ? lr(A, B, p * 2) : lr(B, C, (p - 0.5) * 2);
  g.save();
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  g.globalAlpha = 0.5;
  g.globalCompositeOperation = 'color';
  g.fillStyle = 'rgb(' + c + ')';
  g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'screen';
  const lg = g.createLinearGradient(0, H, 0, H * 0.35),
    a = 0.34 * p * p + 0.04;
  lg.addColorStop(0, 'rgba(255,190,120,' + a + ')');
  lg.addColorStop(1, 'rgba(255,190,120,0)');
  g.globalAlpha = 1;
  g.fillStyle = lg;
  g.fillRect(0, 0, W, H);
  g.restore();
}
const BLM = document.createElement('canvas'),
  blm = BLM.getContext('2d'),
  BL2 = document.createElement('canvas'),
  bl2 = BL2.getContext('2d');
function bloom() {
  const w = Math.max(8, Math.round(cv.width / 10)),
    h = Math.max(8, Math.round(cv.height / 10));
  if (BLM.width !== w || BLM.height !== h) {
    BLM.width = w;
    BLM.height = h;
  }
  blm.globalCompositeOperation = 'copy';
  blm.imageSmoothingEnabled = true;
  blm.imageSmoothingQuality = 'high';
  blm.drawImage(cv, 0, 0, w, h);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'screen';
  g.globalAlpha = run.theme === 2 ? 0.62 : 0.45;
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  g.drawImage(BLM, 0, 0, cv.width, cv.height);
  if (run.theme === 2) {
    const w2 = Math.max(6, Math.round(cv.width / 28)),
      h2 = Math.max(6, Math.round(cv.height / 28));
    if (BL2.width !== w2 || BL2.height !== h2) {
      BL2.width = w2;
      BL2.height = h2;
    }
    bl2.globalCompositeOperation = 'copy';
    bl2.imageSmoothingEnabled = true;
    bl2.drawImage(cv, 0, 0, w2, h2);
    g.globalAlpha = 0.55;
    g.drawImage(BL2, 0, 0, cv.width, cv.height);
  }
  g.restore();
}
