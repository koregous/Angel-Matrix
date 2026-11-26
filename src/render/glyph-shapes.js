const GLY = [
  [
    [
      [0, 6],
      [2, 0],
      [4, 6],
    ],
    [
      [0.9, 4],
      [3.1, 4],
    ],
  ],
  [
    [
      [4, 0.8],
      [3, 0],
      [1, 0],
      [0, 1],
      [0, 2],
      [1, 3],
      [3, 3],
      [4, 4],
      [4, 5],
      [3, 6],
      [1, 6],
      [0, 5.2],
    ],
  ],
  [
    [
      [0, 0],
      [0, 6],
      [2.5, 6],
      [4, 4.5],
      [4, 1.5],
      [2.5, 0],
      [0, 0],
    ],
  ],
];
const el = (cx, cy, rx, ry, n) =>
    Array.from({ length: n + 1 }, (_, i) => [
      cx + Math.cos((i / n) * TAU) * rx,
      cy + Math.sin((i / n) * TAU) * ry,
    ]),
  GLYA = [
    [
      [
        [2, 0],
        [2.7, 2.3],
        [4, 3],
        [2.7, 3.7],
        [2, 6],
        [1.3, 3.7],
        [0, 3],
        [1.3, 2.3],
        [2, 0],
      ],
    ],
    [el(2, 3, 2, 1.3, 16), el(2, 3, 1.2, 0.6, 12)],
    [
      [
        [0, 6],
        [0, 3.4],
        [0.9, 1],
        [2.6, 0],
        [4, 0.5],
        [2.9, 1.5],
        [4, 2.3],
        [2.7, 3.1],
        [3.7, 4],
        [2.2, 4.5],
        [2.6, 5.4],
        [0, 6],
      ],
      [
        [0.8, 5],
        [0.7, 3],
        [1.6, 1.8],
      ],
    ],
  ];

// Draws glyph number `g` of the generated alphabet (GL) as strokes. Lives here, not in
// generators/glyphs.js, because it draws (uses ln) and the generator must stay pure.
function gly(cx, cy, h, g, v, c) {
  const u = h / 4;
  for (const s of GL[g])
    ln(cx + (s[0] - 1) * u, cy + (s[1] - 2) * u, cx + (s[2] - 1) * u, cy + (s[3] - 2) * u, v, c);
}
