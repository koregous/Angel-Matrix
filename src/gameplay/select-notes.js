export function selectNotes(T, dens, hard) {
  const RATE = hard ? 4.2 : [1.5, 2.4, 3.6][dens],
    GAP = hard ? 0.095 : [0.3, 0.2, 0.13][dens],
    LG = hard ? 0.17 : [0.55, 0.38, 0.26][dens],
    lead = T.P + (4 * 60) / T.bpm,
    gs = 60 / T.bpm / 4,
    src =
      hard && T.evH
        ? T.evH.map((e) => {
            const g = T.P + Math.round((e.t - T.P) / gs) * gs;
            return Math.abs(g - e.t) < 0.045 ? { ...e, t: g } : e;
          })
        : T.ev,
    c = src.filter((e) => e.t >= lead).sort((a, b) => b.s - a.s),
    acc = [],
    cap = Math.floor((T.dur - lead) * RATE);
  for (const e of c) {
    if (acc.length >= cap) break;
    let ok = 1;
    for (const a of acc) {
      const d = Math.abs(a.t - e.t);
      if (d < GAP || (a.k === e.k && d < LG)) {
        ok = 0;
        break;
      }
    }
    if (ok) acc.push(e);
  }
  return acc.sort((a, b) => a.t - b.t);
}
//</TRACK>
