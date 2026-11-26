# ANGEL MATRIX

A dot-matrix space rhythm game with an angelcore feel. Notes fly down three lanes toward the hit
bar; tap **A / S / D** (or the touch keys) as a note touches the line, **SPACE** for wide bars.
Load your own mp3 and the game builds a chart from it.

Plain HTML, CSS and JavaScript. No bundler, no dependencies.

## Run it

`npm start` and open <http://localhost:8080> (any static server works). Opening `index.html` by
double-click no longer works: browsers refuse to load ES modules from `file://`.

`npm run format` formats the code, `npm test` checks the glyph set.

## Layout

```
index.html            page shell + the ordered classic <script> list + the module entry
css/style.css
src/
  core/               labels, globals, config (constants + the `run` object), state, keyboard input
  gameplay/           chart building, judgement + latency calibration, session, impacts
  audio/              synthesised sfx, track analysis, section detection
  render/             canvas primitives, perspective, draw loop, hub, hands, angel, filters
  themes/
    colourways.js     colourway data (add a row to add a colourway)
    nightdrive/       speed lines, retro sky, road
    veil/             background
  generators/         seeded procedural content: rng.js, glyphs.js (ES modules)
  ui/                 menu, pause menu, touch keys, texture menu
  main.js             per-frame update (the loop is started by bridge.js)
  bridge.js           module entry: exposes module exports to classic scripts, starts the loop
assets/fonts/         static font files (see its README)
tools/                export-glyphs.js, script-order.json (classic scripts only)
tests/                glyph snapshot test + fixture
                      smoke-frame.mjs: headless run of the classic scripts (prints `cam`/`bg` state)
docs/                 glyph sheet (png + svg)
```

## Good to know

- **Mid-migration to ES modules.** Six files are real modules with explicit imports/exports:
  `core/labels.js`, `generators/rng.js`, `generators/glyphs.js`, `themes/colourways.js`,
  `gameplay/select-notes.js` and `audio/analyze-track.js`. Every other file in `src/` is still a
  classic script sharing one global scope, in the order listed in `index.html` (also in
  `tools/script-order.json`), so for those, order matters: a new file goes where its dependencies
  already exist.
- **How the two meet.** Module scripts run after all classic scripts, so `src/bridge.js` copies
  the modules' exports onto `globalThis` and only then starts the frame loop. Classic files must
  not use a module's exports while they load (only inside functions that run later). When the
  last classic file using a name has been converted, delete that name from `bridge.js`.
  `src/package.json`, `tools/package.json` and `tests/package.json` mark those folders as ESM for
  Node; browsers ignore them.
- **Live game state is the `run` object** (`src/core/config.js`): `run.state`, `run.hp`, `run.score`,
  `run.combo`, `run.chart`, `run.ac` and so on. It also holds the menu, track and pause state:
  `run.paused`, `run.theme`, `run.hard`, `run.busy`, `run.tr` (loaded track), `run.act` (track being
  played), `run.trSrc`, `run.himg`, `run.offTuned`. The effect lists are there too (`run.bm`, `run.ip`, `run.rays`, `run.tq`), as are `run.msz` (message size) and `run.bi` (current section step). Files read and write it directly. A loose global
  cannot be reassigned from another ES module; a property can, which is why it lives there.
- **Per-frame camera and impact values are the `cam` object** (`src/core/state.js`): `cam.x/y`, the springs `cam.kv/ky` and `cam.zv/zs`, `cam.boost`, `cam.flash`, `cam.sz`, `cam.LS`, `cam.RA`, `cam.lk`. Same reason as `run`: another file can change a property, not a loose global.
- **Background drift is the `bg` object** (`src/gameplay/impact.js`): `bg.x/y` (layer offset), the random-walk state `bg.px/py/vx/vy/tx/ty/t`, and `bg.focus`, the `[x, y]` point the scene is drawn from (`fp()` returns it).
- **Texture and hub state are objects too.** `tex` (`src/render/ascii-filters.js`) holds the chosen texture and colourway (`tex.filt`, `tex.tint`) and the pause-menu peek timers. `hub` (`src/render/hub.js`) carries the hub sprite and glint from the boss draw to `drawHub()` and `drawTwinkles()` within one frame.
- **Wording.** HUD labels live in `src/core/labels.js`. The intro paragraph is in `index.html`.
- **Glyphs** are generated from a fixed seed (`gly()`, which draws them, is in `render/glyph-shapes.js`). If you touch `rng.js` or `glyphs.js` on purpose,
  run `npm run export:glyphs -- --snapshot` to accept the new set; otherwise `npm test` fails.
- **Timing.** The game nudges its hit-timing offset toward where you actually tap and remembers it
  (`localStorage`). `SYNC +/-` in the pause menu and `[` / `]` adjust it by hand.
- **Touch keys** can be hidden (menu and pause menu). Hidden keys are invisible but still tappable.
- **Saved settings** (`localStorage`): `amTheme3`, `amFilt2`, `amTint`, `amOff`, `amKeysHidden`.

## Licence

Not chosen yet. Add a `LICENSE` file before publishing. See `CREDITS.md` for third-party items.

## Licence

MIT, see `LICENSE`. Press Start 2P is under the SIL Open Font License 1.1 (see `CREDITS.md`).
