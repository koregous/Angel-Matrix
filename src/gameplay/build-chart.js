let dens = 1;
function buildTr() {
  const r = mul(9),
    a = [];
  for (const e of selectNotes(run.tr, dens, run.hard)) {
    const b = (e.t - run.tr.P) / SPB;
    a.push({
      k: e.k,
      lead: 5,
      P: mk(e.k, 0.25 + Math.min(0.45, (b / run.END) * 0.5), r),
      sp: 0,
      d: 0,
      b,
      at: run.t0 + b * SPB,
      s: '',
    });
  }
  return a.sort((x, y) => x.b - y.b);
}
