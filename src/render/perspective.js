const FARf = 0.1,
  LWf = () => Math.min(W * 0.22, H * 0.3, 260),
  HYf = () => H * 0.62,
  SHf = (q) => cam.LS * Math.pow(Math.max(q, 0), 1.4),
  LOf = (k) => [-1.6, 0, 1.6][k],
  LXf = (k) => W / 2 + LOf(k) * LWf() + cam.LS;
const HMf = () => {
    const f = W * 0.9;
    return Math.max(-0.2, Math.min(0.2, ((HYf() - bg.focus[1]) * (bg.focus[0] - W / 2)) / (f * f)));
  },
  PYf = (o, q) => {
    const fy = bg.focus[1];
    return fy + (HYf() - fy) * q + HMf() * q * o * LWf() * (FARf + (1 - FARf) * q);
  },
  PSf = (o, q) =>
    Math.max(0.55, 1 + (HMf() * o * LWf() * (FARf + (1 - FARf) * q)) / (HYf() - bg.focus[1]));
