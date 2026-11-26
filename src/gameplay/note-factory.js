function mk(k, jit, r) {
  const a = (r() - 0.5) * 0.5,
    s = 0.9 + r() * 0.25,
    ca = Math.cos(a),
    sa = Math.sin(a),
    ox = (r() - 0.5) * 0.1,
    oy = (r() - 0.5) * 0.06,
    P = [];
  for (let i = 0; i < KG[k].length; i += 2) {
    const u = ((KG[k][i] - 2) / 4) * 0.62 + (r() - 0.5) * jit * 0.1,
      v = (KG[k][i + 1] - 3) / 6 + (r() - 0.5) * jit * 0.1;
    P.push([(u * ca - v * sa) * s + ox, (u * sa + v * ca) * s + oy]);
  }
  return P;
}
