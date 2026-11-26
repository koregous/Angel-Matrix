var SAT = 0;
addEventListener('contextmenu', (e) => e.preventDefault());
const TAU = Math.PI * 2,
  PI = Math.PI;
try {
  document.fonts && document.fonts.load('10px "Press Start 2P"');
} catch (e) {}
const cv = document.getElementById('c'),
  g = cv.getContext('2d'),
  ov = document.getElementById('ov'),
  kb = document.getElementById('keys');
const mb = document.getElementById('mb'),
  pz = document.getElementById('pz'),
  pc = document.getElementById('pc'),
  BODY0 = document.getElementById('b').innerHTML,
  STP = {
    set textContent(v) {
      document.getElementById('st').textContent = v;
      document.getElementById('pst').textContent = v;
    },
  };
const LET = 'ASD_',
  LK = ['A', 'S', 'D', 'SPACE'];
let W,
  H,
  DPR,
  cs = 8,
  K = 1,
  gw = 0,
  gh2 = 0,
  FB,
  FCl,
  bgc;
function rs() {
  if (!innerWidth || !innerHeight) return;
  DPR = Math.min(2, devicePixelRatio || 1);
  W = innerWidth;
  H = innerHeight;
  {
    const pr = document.createElement('div');
    pr.style.cssText = 'position:fixed;top:0;padding-top:env(safe-area-inset-top,0px)';
    document.body.appendChild(pr);
    SAT = parseFloat(getComputedStyle(pr).paddingTop) || 0;
    pr.remove();
  }
  cv.width = W * DPR;
  cv.height = H * DPR;
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  cs = W < 700 ? 3 : Math.max(2, Math.min(3, Math.round(W / 500)));
  K = 8 / cs;
  gw = Math.floor(W / cs);
  gh2 = Math.floor(H / cs);
  FB = new Float32Array(gw * gh2);
  FCl = new Uint8Array(gw * gh2);
  nebReset();
}
