function nebDraw() {
  const bx = Math.round(bg.x),
    by = Math.round(bg.y),
    mg = Math.max(W, H) * 0.35,
    i0 = Math.floor((-bx - mg) / NCP),
    i1 = Math.floor((-bx + W + mg) / NCP),
    j0 = Math.floor((-by - mg) / NCP),
    j1 = Math.floor((-by + H + mg) / NCP);
  let made = 0;
  for (let j = j0; j <= j1; j++)
    for (let i = i0; i <= i1; i++) {
      if (!NB.has(i + ',' + j)) {
        if (made >= 3) continue;
        made++;
      }
      g.drawImage(nebChunk(i, j), bx + i * NCP, by + j * NCP, NCP, NCP);
    }
  let gen = 0;
  for (let j = j0 - 1; j <= j1 + 1 && !gen; j++)
    for (let i = i0 - 1; i <= i1 + 1; i++)
      if (!NB.has(i + ',' + j)) {
        nebChunk(i, j);
        gen = 1;
        break;
      }
  if (NB.size > (i1 - i0 + 5) * (j1 - j0 + 5)) {
    for (const [k, c] of NB) {
      const p = k.split(','),
        i = +p[0],
        j = +p[1];
      if (i < i0 - 2 || i > i1 + 2 || j < j0 - 2 || j > j1 + 2) {
        NB.delete(k);
        NP.push(c);
      }
    }
  }
}
