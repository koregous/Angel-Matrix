addEventListener('resize', rs);
rs();
const PAL = [
  '#ffffff',
  '#6a6d75',
  '#c4bfb6',
  '#d9d9d9',
  '#6b6b6b',
  '#9a9a9a',
  '#6aa8ff',
  '#3fae86',
  '#e0455a',
  '#0f9d84',
  '#1d4fbf',
  '#7df9ff',
  '#ffc46b',
  '#ff8fd8',
  '#b49cff',
  '#ff7a8a',
  '#c77dff',
];
const GY = [
  [1, 0, 2, 0, 3, 0, 0, 2, 4, 2, 0, 4, 4, 4, 1, 6, 2, 6, 3, 5, 4, 6],
  [0, 0, 0, 1.5, 0.5, 4, 1, 6, 2, 3, 3, 6, 3.5, 4, 4, 1.5, 4, 0],
  [0, 0, 2, 0, 4, 0, 0, 1.5, 0, 3, 2, 3, 0, 4.5, 0, 6, 2, 6, 4, 6],
  [2, 0, 1, 2, 3, 2, 0.5, 4, 1.7, 4, 2.3, 4, 3.5, 4, 0, 6, 4, 6],
  [3.5, 0, 1.5, 0, 0, 1.2, 1, 2.6, 3, 3.4, 4, 4.8, 2.5, 6, 0.5, 6],
  [0, 0, 2, 0, 0, 2, 0, 4, 0, 6, 2, 6, 3.7, 1.5, 4, 3, 3.7, 4.5],
];
const FN = [1, 2, 3, 5],
  KM = { a: 0, s: 1, d: 2, ' ': 3 },
  KC = [9, 6, 10, 0],
  KG = [GY[3], GY[4], GY[5], [0, 4, 0, 5, 1, 5, 2, 5, 3, 5, 4, 5, 4, 4]];
// The live game state, kept in one object so any file can read and change it. (Loose globals
// cannot be reassigned from another file once files become ES modules; properties can.)
const run = {
  state: 'menu', // 'menu' | 'play' | 'end'
  // audio graph (created on the first start) and song timing
  ac: undefined,
  mix: undefined,
  sb: undefined,
  nb: undefined,
  t0: 0,
  END: 112,
  OFF: 0, // hit-timing offset
  // chart and progress
  chart: [],
  nextStep: 0,
  endT: 0,
  // score
  hp: 100,
  score: 0,
  combo: 0,
  maxc: 0,
  hits: 0,
  total: 0,
  // HUD message
  msg: '',
  mc: 0,
  mt: 0,
  msz: 24, // size of the message text
  // effects
  shake: 0,
  inv: 0,
  fc: 0,
  pulse: 0,
  pose: 2,
  rl: 0,
  df: [],
  pt: [],
  bm: [], // recent note spawns, { k, t }, drawn as short-lived effects
  ip: [], // recent hit impacts
  rays: [], // recent shockwave rays
  tq: [], // text queued during a frame, drawn at the end of draw()
  bi: -1, // current section step (0-2), -1 when not in a section; set by bmc()
  hubT: -99,
  hubK: 3,
  hubQ: 0,
  // menu, track and pause state
  paused: false,
  fromPause: false,
  busy: false, // a track is being loaded or analysed
  hard: false, // HARD difficulty selected
  theme: 0, // 1 = NIGHTDRIVE, 2 = VEIL
  tr: null, // the loaded track
  act: null, // the track being played
  trSrc: null, // its audio source node
  himg: null, // custom hub image
  offTuned: 0, // 1 once the player has tuned the hit-timing offset
};
let BPM = 140,
  SPB,
  WIN,
  WINE,
  PF,
  GD,
  hint = true,
  fog = Array.from({ length: 90 }, () => ({
    a: Math.random() * TAU,
    r: Math.random(),
    s: 0.3 + Math.random() * 0.7,
    c: ((q) => (q < 0.1 ? 2 : q < 0.2 ? 1 : q < 0.38 ? 3 : 0))(Math.random()),
  }));
function timing(s) {
  SPB = s;
  WIN = Math.min(0.16, s * 0.33);
  WINE = Math.min(0.32, s * 0.6);
}
function setB(b) {
  BPM = b;
  timing(60 / b);
  PF = 0.05;
  GD = 0.09;
}
setB(130);
