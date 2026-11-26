{
  const ld = document.getElementById('ld'),
    fi = document.getElementById('fi'),
    st = STP,
    go = document.getElementById('go');
  ld.onclick = () => fi.click();
  document.getElementById('df').onclick = function () {
    run.hard = !run.hard;
    this.textContent = 'DIFFICULTY: ' + (run.hard ? 'HARD' : 'NORMAL');
    this.style.borderColor = run.hard ? '#e0455a' : '#555';
  };
  {
    const PAL0 = PAL.slice(),
      PALO = PAL0.map(
        (c, i) =>
          ({
            11: '#27f3ff',
            12: '#ffb000',
            13: '#ff2bd6',
            14: '#8a5cff',
            15: '#ff4d7a',
            16: '#d62bff',
          })[i] || c
      ),
      PALV = [
        '#f4f6ff',
        '#5d6278',
        '#b9bdd6',
        '#cfd4ea',
        '#565b73',
        '#8f95b3',
        '#a9c4ff',
        '#a8e0d0',
        '#c88aa8',
        '#e6b8d6',
        '#b3b0f0',
        '#dbe8ff',
        '#e8e4f4',
        '#e6c8e8',
        '#c4bcf0',
        '#d8aab8',
        '#b8a4e8',
      ],
      tb = document.getElementById('th'),
      tl = () => {
        tb.textContent = 'THEME: ' + ['', 'NIGHTDRIVE', 'VEIL'][run.theme];
        PAL.splice(0, PAL.length, ...(run.theme === 2 ? PALV : PALO));
      };
    try {
      {
        run.theme = +localStorage.getItem('amTheme3') === 2 ? 2 : 1;
      }
    } catch (e) {}
    tl();
    tb.onclick = () => {
      run.theme = run.theme === 1 ? 2 : 1;
      tl();
      try {
        localStorage.setItem('amTheme3', run.theme);
      } catch (e) {}
    };
  }
  {
    const hb = document.getElementById('hi'),
      fh = document.getElementById('fh');
    async function gifLoad(f) {
      try {
        const dec = new ImageDecoder({ data: await f.arrayBuffer(), type: 'image/gif' });
        await dec.tracks.ready;
        const n = Math.min(dec.tracks.selectedTrack.frameCount, 150),
          fr = [],
          du = [];
        let w = 0,
          h = 0,
          cn,
          cx;
        for (let i = 0; i < n; i++) {
          const r = await dec.decode({ frameIndex: i }),
            vf = r.image;
          if (!cn) {
            const s = Math.min(96 / vf.displayWidth, 96 / vf.displayHeight);
            w = Math.max(1, Math.round(vf.displayWidth * s));
            h = Math.max(1, Math.round(vf.displayHeight * s));
            cn = document.createElement('canvas');
            cn.width = w;
            cn.height = h;
            cx = cn.getContext('2d', { willReadFrequently: true });
          }
          cx.clearRect(0, 0, w, h);
          cx.drawImage(vf, 0, 0, w, h);
          const d = cx.getImageData(0, 0, w, h).data,
            a = new Float32Array(w * h);
          for (let k = 0; k < w * h; k++)
            a[k] =
              (((0.299 * d[k * 4] + 0.587 * d[k * 4 + 1] + 0.114 * d[k * 4 + 2]) / 255) *
                d[k * 4 + 3]) /
              255;
          fr.push(HLV(a));
          du.push(Math.max(20, (vf.duration || 100000) / 1000));
          vf.close();
        }
        run.himg = { w, h, fr, du, tot: du.reduce((p, q) => p + q, 0) };
        hb.textContent = 'HUB IMAGE: ON (TAP TO CLEAR)';
      } catch (e) {
        hb.textContent = 'HUB IMAGE (GIF FAILED)';
      }
    }
    hb.onclick = () => {
      if (run.himg) {
        run.himg = null;
        hb.textContent = 'HUB IMAGE';
        return;
      }
      fh.click();
    };
    fh.onchange = () => {
      const f = fh.files[0];
      fh.value = '';
      if (!f) return;
      if (f.type === 'image/gif' && window.ImageDecoder) {
        gifLoad(f);
        return;
      }
      const im = new Image();
      im.onload = () => {
        const M = 256,
          s = Math.min(M / im.width, M / im.height),
          w = Math.max(1, Math.round(im.width * s)),
          h = Math.max(1, Math.round(im.height * s)),
          cn = document.createElement('canvas');
        cn.width = w;
        cn.height = h;
        const cx = cn.getContext('2d');
        cx.drawImage(im, 0, 0, w, h);
        const d = cx.getImageData(0, 0, w, h).data,
          a = new Float32Array(w * h);
        for (let i = 0; i < w * h; i++)
          a[i] =
            (((0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255) *
              d[i * 4 + 3]) /
            255;
        run.himg = { w, h, fr: [HLV(a)], du: [1], tot: 1 };
        hb.textContent = 'HUB IMAGE: ON (TAP TO CLEAR)';
        URL.revokeObjectURL(im.src);
      };
      im.src = URL.createObjectURL(f);
    };
  }
  fi.onchange = async () => {
    const f = fi.files[0];
    if (!f) return;
    run.busy = true;
    ld.disabled = pc.disabled = true;
    st.textContent = 'DECODING…';
    try {
      const OC = window.OfflineAudioContext || window.webkitOfflineAudioContext,
        buf = await new OC(2, 1, 44100).decodeAudioData(await f.arrayBuffer());
      st.textContent = 'ANALYZING…';
      await new Promise((r) => setTimeout(r, 50));
      const T = analyzeTrack(
        buf.getChannelData(0),
        buf.numberOfChannels > 1 ? buf.getChannelData(1) : buf.getChannelData(0),
        buf.sampleRate
      );
      T.buf = buf;
      try {
        T.secs = analyzeSections(
          buf.getChannelData(0),
          buf.numberOfChannels > 1 ? buf.getChannelData(1) : buf.getChannelData(0),
          buf.sampleRate,
          T.bpm,
          T.P
        );
      } catch (e) {
        T.secs = [];
      }
      run.tr = T;
      go.textContent = 'START';
      go.style.display = '';
      ld.textContent = 'CHANGE MP3';
      ld.classList.add('sec');
      const d = Math.round(T.dur);
      st.textContent =
        f.name.slice(0, 28) +
        ' · ' +
        T.bpm.toFixed(1) +
        ' BPM · ' +
        Math.floor(d / 60) +
        ':' +
        String(d % 60).padStart(2, '0') +
        ' · ' +
        T.secs.filter((x) => x.hot).length +
        ' DROPS' +
        (T.conf < 1.35 ? ' · TEMPO UNSURE' : '');
    } catch (e) {
      st.textContent = 'COULD NOT READ THAT FILE';
      run.fromPause = false;
    }
    run.busy = false;
    ld.disabled = pc.disabled = false;
    fi.value = '';
    if (run.fromPause) {
      run.fromPause = false;
      start();
    }
  };
}
