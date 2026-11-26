# Fonts

The game uses **Press Start 2P**. For now it is loaded from Google Fonts (see the `<link>` in
`index.html`), which needs an internet connection; without it the game falls back to Courier New.

To self-host it (recommended before publishing):

1. Download `PressStart2P-Regular.woff2` and the font's licence text into this folder.
2. Add to `css/style.css`:
   ```css
   @font-face {
     font-family: 'Press Start 2P';
     src: url('../assets/fonts/PressStart2P-Regular.woff2') format('woff2');
     font-display: swap;
   }
   ```
3. Delete the three Google Fonts `<link>` lines from `index.html`.
4. Keep the licence file next to the font and keep `CREDITS.md` up to date.
