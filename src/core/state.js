// Per-frame camera / impact values, in one object so any file can write them (see `run`).
const cam = {
  x: 0, y: 0, // camera offset
  kv: 0, ky: 0, // vertical spring: velocity, position
  zv: 0, zs: 0, // zoom spring: velocity, position
  boost: 0, // special-note speed boost
  flash: 0, // screen flash
  sz: 0, // travel distance
  LS: 0, // lane shift
  RA: 0, // roll angle
  lk: 0, // lean
};
var rays = [],
  ROLL = 0.05,
  bm = [],
  ip = [],
  msz = 24;
//<TRACK>
