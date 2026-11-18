/**
 * Hero animation: a short terminal intro that dissolves into a live canvas.
 *
 * Two modes (from the Gemini prototype, cleaned up):
 *   - "mobius": a torus that twists into a Möbius strip; drag to orbit, "morph" toggles.
 *   - "ascii":  a rotating torus, half wireframe / half ASCII shading, split by a scanline;
 *               the button switches between an automatic sweep and a cursor-controlled split.
 *
 * Performance & accessibility:
 *   - rendering pauses when the hero is off-screen or the tab is hidden;
 *   - with prefers-reduced-motion the intro is skipped and nothing moves on its own
 *     (it redraws only while you drag);
 *   - colors are read from the CSS variables, so the theme toggle just works.
 */

type Mode = 'mobius' | 'ascii';

const MODES: Record<Mode, { badge: string; cmd: string; output: string; caption: string; action: string }> = {
  mobius: {
    badge: '01',
    cmd: './topology --morph torus->mobius',
    output: 'genus 1 -> one-sided surface',
    caption: 'torus → möbius · drag to orbit',
    action: 'morph ↔',
  },
  ascii: {
    badge: '02',
    cmd: './shader --ascii torus',
    output: 'z-buffer 62x28 · scanline active',
    caption: 'wireframe | ascii shading',
    action: 'sweep / split',
  },
};

const ASCII_RAMP = '.,-~:;=!*#$@';

type Palette = { bg: string; ink: string; muted: string; rule: string; accent: string; accent2: string };

// Translatable strings (English defaults). Hero.astro passes the page's language in data-strings.
const STRINGS = {
  cap1: MODES.mobius.caption, act1: MODES.mobius.action,
  cap2: MODES.ascii.caption, act2: MODES.ascii.action,
  split: 'split · move the cursor to scrub',
  torus: 'torus · two-sided', mobius: 'möbius strip · one-sided', twisting: 'twisting…',
};

export function initHero(root: HTMLElement) {
  let S = STRINGS;
  try { S = { ...STRINGS, ...JSON.parse(root.dataset.strings || '{}') }; } catch {}
  MODES.mobius.caption = S.cap1; MODES.mobius.action = S.act1;
  MODES.ascii.caption = S.cap2; MODES.ascii.action = S.act2;

  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = root.querySelector<HTMLCanvasElement>('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const term = root.querySelector<HTMLElement>('[data-term]')!;
  const termBadge = root.querySelector<HTMLElement>('[data-term-badge]')!;
  const termCmd = root.querySelector<HTMLElement>('[data-term-cmd]')!;
  const termOut = root.querySelector<HTMLElement>('[data-term-out]')!;
  const termOutText = root.querySelector<HTMLElement>('[data-term-out-text]')!;
  const hud = root.querySelector<HTMLElement>('[data-hud]')!;
  const caption = root.querySelector<HTMLElement>('[data-caption]')!;
  const actionBtn = root.querySelector<HTMLButtonElement>('[data-action]')!;
  const replayBtn = root.querySelector<HTMLButtonElement>('[data-replay]')!;
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-mode]'));

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mode: Mode = 'mobius';
  let timers: number[] = [];
  let raf: number | null = null;
  let revealed = false;
  let revealAt = 0;
  let visible = true;
  let W = 470;
  let H = 340;

  const st = {
    dragging: false,
    lastX: 0,
    lastY: 0,
    rotX: 0.56,
    rotY: 0.35,
    morphTarget: 1,
    morph: 0,
    morphManual: false,
    scanMode: 'sweep' as 'sweep' | 'split',
    scanX: null as number | null,
  };

  // ---------- palette from CSS variables ----------
  let pal: Palette = readPalette();
  function readPalette(): Palette {
    const s = getComputedStyle(document.documentElement);
    const v = (n: string, d: string) => s.getPropertyValue(n).trim() || d;
    return {
      bg: v('--bg', '#F3EFE6'),
      ink: v('--ink', '#1C1B19'),
      muted: v('--muted', '#5E5A52'),
      rule: v('--rule', '#D9D3C6'),
      accent: v('--accent', '#0A7A3F'),
      accent2: v('--accent2', '#B4500F'),
    };
  }
  window.addEventListener('themechange', () => {
    // wait one frame so the new variables are applied
    requestAnimationFrame(() => { pal = readPalette(); requestDraw(); });
  });

  // ---------- sizing ----------
  function resize() {
    const r = stage.getBoundingClientRect();
    W = Math.max(260, r.width || 470);
    H = Math.max(190, r.height || 340);
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    requestDraw();
  }
  new ResizeObserver(resize).observe(stage);

  // ---------- pointer ----------
  canvas.addEventListener('pointerdown', (e) => {
    st.dragging = true;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    try { canvas.setPointerCapture(e.pointerId); } catch {}
  });
  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (mode === 'ascii' && st.scanMode === 'split' && !st.dragging) {
      const rel = (e.clientX - rect.left) / Math.max(1, rect.width);
      if (rel >= 0.08 && rel <= 0.92) { st.scanX = rel; requestDraw(); }
    }
    if (!st.dragging) return;
    st.rotY += (e.clientX - st.lastX) * 0.0085;
    st.rotX = Math.max(-1.35, Math.min(1.35, st.rotX + (e.clientY - st.lastY) * 0.0085));
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    requestDraw();
  });
  const endDrag = (e: PointerEvent) => {
    st.dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
  };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  actionBtn.addEventListener('click', () => {
    if (mode === 'mobius') {
      st.morphManual = true;
      st.morphTarget = st.morphTarget > 0.5 ? 0 : 1;
      if (reduced) st.morph = st.morphTarget;
    } else {
      st.scanX = null;
      st.scanMode = st.scanMode === 'sweep' ? 'split' : 'sweep';
      caption.textContent = st.scanMode === 'split' ? S.split : MODES.ascii.caption;
    }
    requestDraw();
  });

  // ---------- sequence: terminal intro -> canvas ----------
  function later(fn: () => void, ms: number) { timers.push(window.setTimeout(fn, ms)); }

  function start(next: Mode) {
    mode = next;
    const cfg = MODES[next];
    timers.forEach(clearTimeout);
    timers = [];

    tabs.forEach((t) => {
      const on = t.dataset.mode === next;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', String(on));
    });

    st.morphManual = false;
    st.morphTarget = 1;
    st.morph = reduced ? 1 : 0;
    st.scanMode = 'sweep';
    st.scanX = null;
    st.rotX = next === 'mobius' ? 1.0 : 0.55;
    st.rotY = next === 'mobius' ? 0.2 : 0.25;

    caption.textContent = cfg.caption;
    actionBtn.textContent = cfg.action;
    termBadge.textContent = cfg.badge;
    termOutText.textContent = cfg.output;

    if (reduced) {
      // No intro, no motion: show the finished figure right away.
      term.classList.add('dissolving');
      canvas.classList.add('visible');
      hud.classList.add('visible');
      revealed = true;
      revealAt = performance.now();
      requestDraw();
      return;
    }

    revealed = false;
    canvas.classList.remove('visible');
    hud.classList.remove('visible');
    term.classList.remove('dissolving');
    termCmd.textContent = '';
    termOut.classList.remove('shown');

    const chars = Array.from(cfg.cmd);
    const delay = Math.min(30, Math.max(20, Math.floor(940 / chars.length)));
    chars.forEach((ch, i) => later(() => { termCmd.textContent += ch; }, 90 + i * delay));
    later(() => termOut.classList.add('shown'), 1120);
    later(() => {
      term.classList.add('dissolving');
      canvas.classList.add('visible');
      hud.classList.add('visible');
      revealed = true;
      revealAt = performance.now();
    }, 1550);

    resize();
    loop();
  }

  tabs.forEach((t) => t.addEventListener('click', () => start(t.dataset.mode as Mode)));
  replayBtn.addEventListener('click', () => start(mode));

  // ---------- render loop (paused when off-screen / hidden / reduced motion) ----------
  function loop() {
    if (raf !== null || reduced || !visible || document.hidden) return;
    const tick = (now: number) => {
      draw(now);
      raf = (!visible || document.hidden) ? null : requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  let drawQueued = false;
  function requestDraw() {
    if (!reduced) return; // the loop is already drawing every frame
    if (drawQueued) return;
    drawQueued = true;
    requestAnimationFrame((now) => { drawQueued = false; draw(now); });
  }
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) loop();
  }).observe(stage);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });

  function draw(now: number) {
    ctx.clearRect(0, 0, W, H);
    // With reduced motion, time stands still (a calm, finished frame).
    const elapsed = reduced ? 3 : revealed ? (now - revealAt) / 1000 : 0;
    if (mode === 'mobius') drawMobius(elapsed);
    else drawAscii(elapsed);
  }

  // ---------- math helpers ----------
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function rot(x: number, y: number, z: number, rx: number, ry: number) {
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const x1 = x * cy + z * sy;
    const z1 = -x * sy + z * cy;
    const cx = Math.cos(rx), sx = Math.sin(rx);
    return { x: x1, y: y * cx - z1 * sx, z: y * sx + z1 * cx };
  }
  function project(p: { x: number; y: number; z: number }, cx: number, cy: number, scale: number, fov = 7) {
    const f = (scale * fov) / Math.max(0.6, fov + p.z);
    return { x: cx + p.x * f, y: cy + p.y * f, z: p.z };
  }

  // ---------- mode 01: torus <-> Möbius ----------
  function surface(u: number, v: number, m: number) {
    const R = 1.42, r = 0.54, w = 0.68;
    const th = Math.PI * v;
    const xt = (R + r * Math.cos(th)) * Math.cos(u);
    const yt = (R + r * Math.cos(th)) * Math.sin(u);
    const zt = r * Math.sin(th);
    const h = 0.5 * u;
    const xm = (R + w * v * Math.cos(h)) * Math.cos(u);
    const ym = (R + w * v * Math.cos(h)) * Math.sin(u);
    const zm = w * v * Math.sin(h);
    return { x: xt + (xm - xt) * m, y: yt + (ym - yt) * m, z: zt + (zm - zt) * m };
  }

  function drawMobius(t: number) {
    if (!reduced) {
      if (!st.morphManual) st.morph = t <= 0.45 ? 0 : easeInOut(Math.min(1, (t - 0.45) / 2.1));
      else st.morph += (st.morphTarget - st.morph) * 0.08;
    }
    const m = st.morph;
    // The surface spins around its own axis (so it never turns edge-on) and gently rocks.
    const spin = reduced ? 0 : t * 0.42;
    const rx = st.rotX + (reduced ? 0 : Math.sin(t * 0.35) * 0.08);
    const ry = st.rotY + (reduced ? 0 : Math.sin(t * 0.22) * 0.25);
    const cx = W * 0.5, cy = H * 0.5, sc = Math.min(W, H) * 0.215;
    const place = (p: { x: number; y: number; z: number }) => {
      const c = Math.cos(spin), s = Math.sin(spin);
      return project(rot(p.x * c - p.y * s, p.x * s + p.y * c, p.z, rx, ry), cx, cy, sc);
    };
    const Nu = 60, Nv = 12;

    const grid: { x: number; y: number; z: number }[][] = [];
    for (let i = 0; i <= Nu; i++) {
      const u = (i / Nu) * Math.PI * 2;
      const row = [];
      for (let j = 0; j <= Nv; j++) {
        row.push(place(surface(u, -1 + (2 * j) / Nv, m)));
      }
      grid.push(row);
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < Nu; i++) {
      const back = (grid[i][0].z + grid[i][Nv].z) * 0.5 > 0.1;
      ctx.strokeStyle = back ? pal.rule : pal.muted;
      ctx.globalAlpha = back ? 0.45 : 0.72;
      ctx.beginPath();
      grid[i].forEach((p, j) => (j ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.stroke();
    }
    for (let j = 1; j < Nv; j++) {
      const mid = j === Nv / 2;
      ctx.strokeStyle = mid ? pal.ink : pal.muted;
      ctx.globalAlpha = mid ? 0.55 : 0.34;
      ctx.lineWidth = mid ? 1.2 : 0.85;
      ctx.beginPath();
      for (let i = 0; i <= Nu; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, grid[i][j].x, grid[i][j].y);
      ctx.stroke();
    }
    const edge = (j: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.15;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      for (let i = 0; i <= Nu; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, grid[i][j].x, grid[i][j].y);
      ctx.stroke();
    };
    edge(Nv, pal.accent);
    edge(0, pal.accent2);

    // A bead travelling along the centre line: on the Möbius strip it needs two laps to come back.
    const lap = reduced ? 1.2 : (t * 1.35) % (Math.PI * 4);
    const c3 = surface(lap, 0, m), e3 = surface(lap, 0.88, m);
    const pc = place(c3);
    const pe = place(e3);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.accent2;
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(pc.x, pc.y); ctx.lineTo(pe.x, pe.y); ctx.stroke();
    ctx.fillStyle = pal.accent;
    ctx.beginPath(); ctx.arc(pc.x, pc.y, 3.6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = pal.accent2;
    ctx.beginPath(); ctx.arc(pe.x, pe.y, 3.2, 0, Math.PI * 2); ctx.fill();

    ctx.globalAlpha = 0.88;
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.muted;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const label = m < 0.08 ? S.torus : m > 0.92 ? S.mobius : S.twisting;
    ctx.fillText(`m = ${m.toFixed(2)} · ${label}`, 12, 20);
    ctx.globalAlpha = 1;
  }

  // ---------- mode 02: wireframe | ASCII torus ----------
  function drawAscii(t: number) {
    const A = st.rotX + (reduced ? 0 : t * 0.65);
    const B = st.rotY + (reduced ? 0 : t * 0.42);
    const norm = st.scanMode === 'split' ? (st.scanX ?? 0.5) : reduced ? 0.5 : 0.5 + 0.28 * Math.sin(t * 0.95 - 0.6);
    const scanX = W * norm;

    const R1 = 0.62, R2 = 1.32, K2 = 7;
    const cx = W * 0.5, cy = H * 0.47, sc = Math.min(W, H) * 0.18;
    const cA = Math.cos(A), sA = Math.sin(A), cB = Math.cos(B), sB = Math.sin(B);

    const point = (th: number, ph: number) => {
      const cT = Math.cos(th), sT = Math.sin(th), cP = Math.cos(ph), sP = Math.sin(ph);
      const ox = R2 + R1 * cT, oy = R1 * sT;
      const x = ox * (cB * cP + sA * sB * sP) - oy * cA * sB;
      const y = ox * (sB * cP - sA * cB * sP) + oy * cA * cB;
      const ooz = 1 / (K2 + cA * ox * sP + oy * sA);
      const nx = cT * (cB * cP + sA * sB * sP) - sT * cA * sB;
      const ny = cT * (sB * cP - sA * cB * sP) + sT * cA * cB;
      const nz = cA * cT * sP + sT * sA;
      return { xp: cx + sc * K2 * ooz * x, yp: cy + sc * K2 * ooz * y, ooz, lum: -0.38 * nx - 0.72 * ny - 0.58 * nz };
    };

    // left of the scanline: wireframe
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, scanX, H); ctx.clip();
    const Nph = 36, Nth = 18;
    ctx.lineWidth = 1.1;
    for (let i = 0; i < Nph; i++) {
      const ph = (i / Nph) * Math.PI * 2;
      let avg = 0;
      ctx.beginPath();
      for (let j = 0; j <= Nth; j++) {
        const p = point((j / Nth) * Math.PI * 2, ph);
        avg += p.ooz;
        j ? ctx.lineTo(p.xp, p.yp) : ctx.moveTo(p.xp, p.yp);
      }
      const front = avg / (Nth + 1) > 1 / K2;
      ctx.strokeStyle = front ? pal.accent2 : pal.rule;
      ctx.globalAlpha = front ? 0.72 : 0.48;
      ctx.stroke();
    }
    ctx.lineWidth = 0.95;
    ctx.strokeStyle = pal.ink;
    ctx.globalAlpha = 0.36;
    for (let j = 0; j < Nth; j += 2) {
      const th = (j / Nth) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= Nph; i++) {
        const p = point(th, (i / Nph) * Math.PI * 2);
        i ? ctx.lineTo(p.xp, p.yp) : ctx.moveTo(p.xp, p.yp);
      }
      ctx.stroke();
    }
    ctx.restore();

    // right of the scanline: z-buffered ASCII shading
    ctx.save();
    ctx.beginPath(); ctx.rect(scanX, 0, W - scanX, H); ctx.clip();
    const cols = 62, rows = 28, cw = W / cols, ch = (H - 24) / rows;
    const z = new Float32Array(cols * rows);
    const g = new Uint8Array(cols * rows);
    for (let th = 0; th < Math.PI * 2; th += 0.085) {
      for (let ph = 0; ph < Math.PI * 2; ph += 0.032) {
        const p = point(th, ph);
        const c = Math.floor(p.xp / cw), r = Math.floor((p.yp - 8) / ch);
        if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
        const k = r * cols + c;
        if (p.ooz > z[k]) {
          z[k] = p.ooz;
          g[k] = Math.max(0, Math.min(11, Math.floor((p.lum + 0.35) * 9.5))) + 1;
        }
      }
    }
    ctx.font = `600 ${Math.max(9, Math.floor(ch * 0.92))}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const v = g[r * cols + c];
        if (!v) continue;
        ctx.fillStyle = v >= 8 ? pal.accent : v >= 5 ? pal.ink : pal.muted;
        ctx.globalAlpha = v >= 8 ? 0.96 : 0.84;
        ctx.fillText(ASCII_RAMP[v - 1], (c + 0.5) * cw, 8 + (r + 0.5) * ch);
      }
    }
    ctx.restore();

    // the scanline
    ctx.globalAlpha = 0.92;
    ctx.strokeStyle = pal.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(scanX, 10); ctx.lineTo(scanX, H - 28); ctx.stroke();
    ctx.font = '500 10.5px "JetBrains Mono", monospace';
    ctx.fillStyle = pal.accent;
    ctx.fillText('VEC | ASCII', Math.max(44, Math.min(W - 44, scanX)), 18);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  start('mobius');
}
