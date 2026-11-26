function bmc(now) {
  BI = -1;
  if (run.state !== 'play' || !run.act || !run.act.secs) return 0;
  const st = now - run.OFF - (run.t0 - run.act.P) + LEAD;
  for (const x of run.act.secs)
    if (st >= x.t && st < x.e) {
      if (!x.hot) return 0;
      const i = Math.min(2, Math.floor((3 * (st - x.t)) / Math.max(0.5, x.e - x.t)));
      BI = i;
      BU = x.up;
      return (x.up ? UPC : DNC)[i];
    }
  return 0;
}
