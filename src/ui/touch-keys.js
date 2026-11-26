['A', 'S', 'D', 'SPACE'].forEach((l, i) => {
  const b = document.createElement('button');
  b.textContent = l;
  if (i == 3) b.className = 'tap';
  b.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    cast(i, e.timeStamp);
  });
  kb.appendChild(b);
});

/*
 * TOUCH KEYS option: SHOWN or HIDDEN.
 * HIDDEN only makes the A / S / D / SPACE buttons invisible. The tap zones stay in place,
 * so touch play still works; it just gives a cleaner screen (keyboard players, screenshots).
 */
const TOUCHKEYS = {
  hidden: false,
  apply() {
    document.body.classList.toggle('keys-hidden', this.hidden);
    document.querySelectorAll('[data-tk]').forEach((b) => {
      b.textContent = 'TOUCH KEYS: ' + (this.hidden ? 'HIDDEN' : 'SHOWN');
    });
  },
  set(v) {
    this.hidden = v;
    try {
      localStorage.setItem('amKeysHidden', v ? '1' : '0');
    } catch (e) {}
    this.apply();
  },
};
try {
  TOUCHKEYS.hidden = localStorage.getItem('amKeysHidden') === '1';
} catch (e) {}
document.querySelectorAll('[data-tk]').forEach((b) => {
  b.onclick = () => TOUCHKEYS.set(!TOUCHKEYS.hidden);
});
TOUCHKEYS.apply();
