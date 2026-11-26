// Transitional bridge between ES modules and the classic scripts that are not converted yet.
//
// Module scripts run after every classic script, so the classic files cannot see a module's
// exports on their own. This file puts them on `globalThis` and only then starts the frame loop,
// which is why `frame()` is called here and not at the bottom of main.js.
//
// When the last classic file that uses a name is converted to import it, delete its line below.
import { LABEL } from './core/labels.js';
import { mul } from './generators/rng.js';
import { GL } from './generators/glyphs.js';
import { TN } from './themes/colourways.js';
import { selectNotes } from './gameplay/select-notes.js';
import { analyzeTrack } from './audio/analyze-track.js';

Object.assign(globalThis, { LABEL, mul, GL, TN, selectNotes, analyzeTrack });

// Startup work that reads module exports, so it cannot run while the classic scripts load.
flUI(); // first paint of the texture / colourway button labels (reads TN)
frame();
