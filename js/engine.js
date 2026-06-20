/* ════════════════════════════════════════════════════════
   ENGINE — scene rail, swipe, drag, state, interactions
════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'vondracek-world-v2';
const SCENE_IDS   = ['living-room','kitchen','garden','bedroom','art-studio'];

/* ════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════ */

/* Default positions — centered in each scene, scaled to 1100×620 SVG space */
// Default positions kept within SVG x:420-660 so they stay visible in portrait
// (portrait slice shows roughly x:407-693 of the 1100-wide scene)
const DEFAULT_CHARS = [
  { id:'richard',  sceneIdx:0, x:450, y:440 },
  { id:'zuzana',   sceneIdx:0, x:590, y:440 },
  { id:'klarka',   sceneIdx:1, x:520, y:440 },
  { id:'anetka',   sceneIdx:4, x:460, y:440 },
  { id:'tanicka',  sceneIdx:2, x:470, y:440 },
  { id:'risa',     sceneIdx:2, x:580, y:460 },
  { id:'puffy',    sceneIdx:2, x:630, y:460 },
  { id:'dart',     sceneIdx:2, x:430, y:445 },
  { id:'liza',     sceneIdx:4, x:580, y:460 },
  { id:'cookie',   sceneIdx:4, x:530, y:445 },
  { id:'berta',    sceneIdx:3, x:460, y:460 },
  { id:'mikie',    sceneIdx:3, x:570, y:468 },
];

let state = {
  sceneIdx: 0,
  chars: JSON.parse(JSON.stringify(DEFAULT_CHARS)), // deep copy
  objStates: {}, // {sceneId: {objId: value}}
  panX: [],      // per-scene horizontal pan offset in SVG units
};

function saveStateQuiet() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}
function saveState() { saveStateQuiet(); showToast('Saved! 💾'); }

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      const savedIds = new Set(saved.chars.map(c => c.id));
      const merged = saved.chars.slice();
      DEFAULT_CHARS.forEach(dc => {
        if (!savedIds.has(dc.id)) merged.push(JSON.parse(JSON.stringify(dc)));
      });
      state = { panX: [], ...saved, chars: merged };
    }
  } catch(e) {}
}

function exportState() {
  const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `vondracek-${new Date().toISOString().slice(0,10)}.json`
  });
  a.click(); URL.revokeObjectURL(a.href);
  showToast('Backup downloaded! 📦');
}

function importState(file) {
  const r = new FileReader();
  r.onload = e => {
    try {
      state = JSON.parse(e.target.result);
      rebuildAllChars();
      goToScene(state.sceneIdx || 0);
      showToast('World loaded! 🌟');
    } catch { showToast('Bad file 😢'); }
  };
  r.readAsText(file);
}

/* ════════════════════════════════════════════════════════
   ROOM PANNING — per-scene viewBox pan in SVG units
════════════════════════════════════════════════════════ */

const SVG_W = 1100, SVG_H = 620;

function visibleSVGWidth() {
  // Height fills viewport in portrait → visible SVG width is narrower than SVG_W
  const w = window.innerWidth * SVG_H / window.innerHeight;
  return Math.min(SVG_W, w);
}

function maxPanX() {
  return Math.max(0, SVG_W - visibleSVGWidth());
}

function centerPanX() {
  return maxPanX() / 2; // same view as old xMidYMid slice
}

function getPanX(idx) {
  const p = state.panX[idx];
  return (p !== undefined && p !== null) ? p : centerPanX();
}

function applyPanX(idx, panX) {
  const clamped = Math.max(0, Math.min(maxPanX(), panX));
  state.panX[idx] = clamped;
  const panel = document.querySelectorAll('.scene-panel')[idx];
  const svg   = panel && panel.querySelector('.scene-svg');
  if (svg) {
    svg.setAttribute('viewBox', `${clamped} 0 ${visibleSVGWidth()} ${SVG_H}`);
    svg.setAttribute('preserveAspectRatio', 'xMinYMin meet');
  }
  return clamped;
}

window.addEventListener('resize', () => {
  // Re-apply pan when viewport changes (rotation, resize)
  applyPanX(currentSceneIdx, getPanX(currentSceneIdx));
});

/* ════════════════════════════════════════════════════════
   SCENE RAIL — swipe + programmatic navigation
════════════════════════════════════════════════════════ */

let currentSceneIdx = 0;
let labelTimeout   = null;

function goToScene(idx) {
  idx = Math.max(0, Math.min(SCENE_IDS.length - 1, idx));
  currentSceneIdx = idx;
  state.sceneIdx  = idx;

  const rail = document.getElementById('scene-rail');
  rail.style.transform = `translateX(calc(${-idx} * 100vw))`;

  applyPanX(idx, getPanX(idx)); // restore this scene's pan position

  updateDots(idx);
  flashLabel(SCENES[SCENE_IDS[idx]].label);
  saveStateQuiet();
  updateCastDrawer();
}

function updateDots(idx) {
  document.querySelectorAll('#scene-dots .dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

function flashLabel(text) {
  const el = document.getElementById('scene-label');
  el.textContent = text;
  el.classList.add('visible');
  clearTimeout(labelTimeout);
  labelTimeout = setTimeout(() => el.classList.remove('visible'), 1800);
}

/* ════════════════════════════════════════════════════════
   SWIPE — pan within room first, switch scene at edge
════════════════════════════════════════════════════════ */

let swipe = { active: false, startX: 0, startY: 0, startTime: 0, id: null, startPanX: 0 };

function setupSceneSwipe() {
  const rail = document.getElementById('scene-rail');

  rail.addEventListener('pointerdown', e => {
    if (e.target.closest('.scene-char') || e.target.closest('.scene-obj')) return;
    swipe = {
      active: true, startX: e.clientX, startY: e.clientY,
      startTime: Date.now(), id: e.pointerId,
      startPanX: getPanX(currentSceneIdx)
    };
    rail.setPointerCapture(e.pointerId);
  }, { passive: true });

  rail.addEventListener('pointermove', e => {
    if (!swipe.active || e.pointerId !== swipe.id) return;
    const dx = e.clientX - swipe.startX; // screen px, positive = dragging right
    const vw = visibleSVGWidth();
    // Convert screen px → SVG units (1 screen px = vw / viewportWidth SVG units)
    const svgPerPx = vw / window.innerWidth;
    const newPanX  = swipe.startPanX - dx * svgPerPx;
    const maxP     = maxPanX();

    if (newPanX >= 0 && newPanX <= maxP) {
      // Still within room — pan the viewBox live
      const panel = document.querySelectorAll('.scene-panel')[currentSceneIdx];
      const svg   = panel && panel.querySelector('.scene-svg');
      if (svg) svg.setAttribute('viewBox', `${newPanX} 0 ${vw} ${SVG_H}`);
      rail.style.transform = `translateX(calc(${-currentSceneIdx} * 100vw))`;
    } else {
      // Past room edge — rubber-band the rail to hint at scene switch
      const overshootSVG = newPanX < 0 ? -newPanX : newPanX - maxP;
      const overshootPx  = (overshootSVG / svgPerPx) * 0.35;
      const dir = dx > 0 ? 1 : -1;
      rail.style.transform =
        `translateX(calc(${-currentSceneIdx} * 100vw + ${dir * overshootPx}px))`;
    }
  }, { passive: true });

  rail.addEventListener('pointerup', e => {
    if (!swipe.active || e.pointerId !== swipe.id) return;
    swipe.active = false;

    const dx   = e.clientX - swipe.startX;
    const dy   = Math.abs(e.clientY - swipe.startY);
    const dt   = Date.now() - swipe.startTime;
    const vw   = visibleSVGWidth();
    const svgPerPx  = vw / window.innerWidth;
    const newPanX   = swipe.startPanX - dx * svgPerPx;
    const maxP      = maxPanX();

    // How far past the room edge are we (in screen px)?
    const overshootSVG = newPanX < 0 ? -newPanX : (newPanX > maxP ? newPanX - maxP : 0);
    const overshootPx  = overshootSVG / svgPerPx;
    const fast = dt < 300 && overshootPx > 30;
    const far  = overshootPx > window.innerWidth * 0.28;

    if ((fast || far) && dy < 100) {
      goToScene(currentSceneIdx + (dx < 0 ? 1 : -1));
    } else {
      applyPanX(currentSceneIdx, newPanX);
      rail.style.transform = `translateX(calc(${-currentSceneIdx} * 100vw))`;
      saveStateQuiet();
    }
  }, { passive: true });

  rail.addEventListener('pointercancel', () => {
    if (!swipe.active) return;
    swipe.active = false;
    applyPanX(currentSceneIdx, swipe.startPanX);
    rail.style.transform = `translateX(calc(${-currentSceneIdx} * 100vw))`;
  }, { passive: true });
}

/* ════════════════════════════════════════════════════════
   CHARACTER DRAG — SVG pointer events
   Finger lands at character's "feet" for clear visibility
════════════════════════════════════════════════════════ */

let drag = { active: false, el: null, id: null, svg: null, startX: 0, startY: 0, hasMoved: false };

function svgPt(svg, clientX, clientY) {
  const pt = svg.createSVGPoint();
  pt.x = clientX; pt.y = clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function getCharScale(el) {
  const tr = el.getAttribute('transform') || '';
  const m = tr.match(/scale\(([\d.]+)\)/);
  return m ? parseFloat(m[1]) : 1;
}

function setCharPos(el, x, y) {
  const sc = getCharScale(el);
  el.setAttribute('transform', `translate(${x},${y}) scale(${sc})`);
}

function getCharPos(el) {
  const tr = el.getAttribute('transform') || '';
  const m = tr.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 };
}

function attachCharDrag(charEl, svg) {
  charEl.addEventListener('pointerdown', e => {
    if (drag.active) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return; // only left-click
    e.stopPropagation(); // prevent scene swipe from starting

    charEl.setPointerCapture(e.pointerId);
    drag = { active: true, el: charEl, id: e.pointerId, svg,
             startX: e.clientX, startY: e.clientY, hasMoved: false };
    charEl.classList.add('held');
    if (charEl.parentElement) charEl.parentElement.appendChild(charEl);
  });

  charEl.addEventListener('pointermove', e => {
    // CRITICAL: check drag.el === charEl so only the grabbed char responds,
    // not every char the cursor passes over
    if (!drag.active || drag.el !== charEl || e.pointerId !== drag.id) return;
    // Mouse stuck-drag recovery: button released outside browser window
    if (e.pointerType === 'mouse' && e.buttons === 0) { endDrag(charEl, false); return; }

    const dx = Math.abs(e.clientX - drag.startX);
    const dy = Math.abs(e.clientY - drag.startY);
    if (!drag.hasMoved && dx < 6 && dy < 6) return; // dead zone — tap, not drag
    drag.hasMoved = true;

    const p = svgPt(svg, e.clientX, e.clientY);
    const sc = getCharScale(charEl);
    setCharPos(charEl, p.x - 50 * sc, p.y - 150 * sc);
  });

  charEl.addEventListener('pointerup', e => {
    if (!drag.active || drag.el !== charEl || e.pointerId !== drag.id) return;
    endDrag(charEl, drag.hasMoved, e.clientX, e.clientY);
  });

  charEl.addEventListener('pointercancel', e => {
    if (drag.active && drag.el === charEl && e.pointerId === drag.id) endDrag(charEl, false);
  });
}

/* Global safety net: catches pointerup/cancel that slip through (e.g. pointer left window) */
document.addEventListener('pointerup', e => {
  if (drag.active && e.pointerId === drag.id && drag.el) {
    endDrag(drag.el, drag.hasMoved, e.clientX, e.clientY);
  }
}, { capture: true });
document.addEventListener('pointercancel', e => {
  if (drag.active && e.pointerId === drag.id && drag.el) endDrag(drag.el, false);
}, { capture: true });

function endDrag(charEl, moved, clientX, clientY) {
  drag.active = false;
  charEl.classList.remove('held');

  const pos = getCharPos(charEl);
  const id  = charEl.dataset.id;
  const entry = state.chars.find(c => c.id === id);
  if (entry) {
    entry.sceneIdx = currentSceneIdx;
    entry.x = Math.round(pos.x);
    entry.y = Math.round(pos.y);
    saveStateQuiet();
  }

  if (!moved && clientX !== undefined) {
    onCharTap(charEl, clientX, clientY);
  }
}

/* ════════════════════════════════════════════════════════
   SPEECH BUBBLE
════════════════════════════════════════════════════════ */

let bubbleTimer = null;

function onCharTap(charEl, clientX, clientY) {
  const id = charEl.dataset.id;
  const ch = CHARACTERS.find(c => c.id === id);
  if (!ch) return;
  const phrase = ch.phrases[Math.floor(Math.random() * ch.phrases.length)];
  showBubble(phrase, clientX, clientY);
}

function showBubble(text, x, y) {
  const b = document.getElementById('speech-bubble');
  document.getElementById('bubble-text').textContent = text;
  b.classList.remove('hidden');
  // Clamp to viewport
  const bw = Math.min(220, window.innerWidth * 0.6);
  const bx = Math.min(x, window.innerWidth - bw - 12);
  const by = Math.max(10, y - 80);
  b.style.left = bx + 'px';
  b.style.top  = by + 'px';
  clearTimeout(bubbleTimer);
  bubbleTimer = setTimeout(() => b.classList.add('hidden'), 3000);
}

/* ════════════════════════════════════════════════════════
   OBJECT INTERACTIONS
════════════════════════════════════════════════════════ */

const TV_SHOWS = ['🎬🎭','🎮📺','🎵🎶','🌍🌏','🏆⚽','🎪🤹','🌈✨','🦁🐯'];
let tvCh = 0;

const FOODS   = ['🍳','🍲','🥘','🍝','🍜','🥞','🥗','🍕','🫕','🫔'];
let foodIdx   = 0;
let stoveOn   = false;

function attachObjInteractions(panelEl, svg) {
  panelEl.addEventListener('click', e => {
    const obj = e.target.closest('.scene-obj');
    if (!obj) return;
    e.stopPropagation();

    const id  = obj.dataset.obj || '';
    const msg = obj.dataset.msg || '';

    // Bounce animation
    obj.classList.remove('pop');
    void obj.offsetWidth;
    obj.classList.add('pop');

    // Special logic
    if (id === 'tv') {
      tvCh = (tvCh + 1) % TV_SHOWS.length;
      updateTV(svg, tvCh);
      showBubble('📺 ' + TV_SHOWS[tvCh], e.clientX, e.clientY);
      return;
    }
    if (id === 'stove') {
      stoveOn = !stoveOn;
      foodIdx = (foodIdx + 1) % FOODS.length;
      updateStove(svg, stoveOn, foodIdx);
      showBubble(stoveOn ? '🔥 ' + FOODS[foodIdx] + ' cooking!' : '✅ Done!', e.clientX, e.clientY);
      return;
    }
    if (msg) showBubble(msg, e.clientX, e.clientY);
  });
}

function updateTV(svg, ch) {
  const screen  = svg.querySelector('#tv-screen');
  const content = svg.querySelector('#tv-content');
  if (!screen || !content) return;
  const colors = ['#1565C0','#2E7D32','#B71C1C','#4A148C','#E65100','#006064','#880E4F','#1B5E20'];
  screen.setAttribute('fill', colors[ch % colors.length]);
  const W=1100, H=620;
  content.innerHTML = `
    <text x="${W-380}" y="${H-252}" text-anchor="middle" font-size="40" font-family="Nunito,sans-serif">${TV_SHOWS[ch]}</text>
    <text x="${W-380}" y="${H-218}" text-anchor="middle" font-size="13" fill="#B3E5FC" font-family="Nunito,sans-serif">Ch.${ch+1}</text>`;
}

function updateStove(svg, on, fi) {
  const glow = svg.querySelector('#burner-glow');
  const food = svg.querySelector('#cooking-food');
  if (glow) glow.setAttribute('opacity', on ? '0.95' : '0.1');
  if (food) food.textContent = FOODS[fi];
}

/* Stove animation */
const stoveStyle = document.createElement('style');
stoveStyle.textContent = `
  #burner-glow { transition: opacity .4s; }
`;
document.head.appendChild(stoveStyle);

/* ════════════════════════════════════════════════════════
   CHARACTER MANAGEMENT
════════════════════════════════════════════════════════ */

function getOrCreateCharLayer(panelEl) {
  let g = panelEl.querySelector('.char-layer-g');
  if (!g) {
    // Find the SVG and append a <g> for characters
    const svg = panelEl.querySelector('.scene-svg');
    const ns = 'http://www.w3.org/2000/svg';
    g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'char-layer-g');
    svg.appendChild(g);
  }
  return g;
}

function placeCharInScene(charData, panel) {
  const svg   = panel.querySelector('.scene-svg');
  const layer = getOrCreateCharLayer(panel);
  const ch    = CHARACTERS.find(c => c.id === charData.id);
  if (!ch) return;

  // Remove existing element for this char in any scene
  document.querySelectorAll(`.scene-char[data-id="${ch.id}"]`).forEach(el => el.remove());

  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','scene-char just-placed');
  g.setAttribute('data-id', ch.id);
  g.setAttribute('transform', `translate(${charData.x},${charData.y}) scale(${ch.scale})`);
  g.innerHTML = buildCharacterSVG(ch);
  layer.appendChild(g);

  attachCharDrag(g, svg);

  // Remove just-placed after animation
  setTimeout(() => g.classList.remove('just-placed'), 500);

  return g;
}

function rebuildAllChars() {
  // Remove all existing character elements
  document.querySelectorAll('.scene-char').forEach(el => el.remove());

  // Place each character in its scene
  state.chars.forEach(charData => {
    const panel = document.querySelectorAll('.scene-panel')[charData.sceneIdx];
    if (panel) placeCharInScene(charData, panel);
  });

  updateCastDrawer();
}

/* ════════════════════════════════════════════════════════
   CAST DRAWER
════════════════════════════════════════════════════════ */

function buildCastDrawer() {
  const list = document.getElementById('cast-list');
  list.innerHTML = '';
  CHARACTERS.forEach(ch => {
    const item = document.createElement('div');
    item.className = 'cast-item';
    item.dataset.id = ch.id;
    item.innerHTML = `
      <svg viewBox="0 0 100 180" overflow="visible">
        <g transform="scale(${ch.scale})">${buildCharacterSVG(ch)}</g>
      </svg>
      <div class="cast-item-name">${ch.label}</div>`;
    item.addEventListener('click', () => onCastItemTap(ch.id));
    list.appendChild(item);
  });
}

function updateCastDrawer() {
  // Mark which characters are in the current scene
  document.querySelectorAll('.cast-item').forEach(item => {
    const id = item.dataset.id;
    const cd = state.chars.find(c => c.id === id);
    item.classList.toggle('in-scene', cd && cd.sceneIdx === currentSceneIdx);
  });
}

function onCastItemTap(charId) {
  const cd = state.chars.find(c => c.id === charId);
  if (!cd) return;

  // Place at center of the currently visible view area
  const panX = getPanX(currentSceneIdx);
  cd.sceneIdx = currentSceneIdx;
  cd.x = Math.round(panX + visibleSVGWidth() / 2);
  cd.y = 440;

  const panel = document.querySelectorAll('.scene-panel')[currentSceneIdx];
  placeCharInScene(cd, panel);
  saveStateQuiet();
  updateCastDrawer();
  closeCastDrawer();
}

/* ════════════════════════════════════════════════════════
   DRAWER OPEN / CLOSE
════════════════════════════════════════════════════════ */

function openCastDrawer() {
  updateCastDrawer();
  document.getElementById('cast-drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('open');
}
function closeCastDrawer() {
  document.getElementById('cast-drawer').classList.remove('open');
  closeBackdrop();
}
function openMenuDrawer() {
  document.getElementById('menu-drawer').classList.add('open');
  document.getElementById('drawer-backdrop').classList.add('open');
}
function closeMenuDrawer() {
  document.getElementById('menu-drawer').classList.remove('open');
  closeBackdrop();
}
function closeBackdrop() {
  document.getElementById('drawer-backdrop').classList.remove('open');
}
function closeAllDrawers() {
  closeCastDrawer(); closeMenuDrawer();
}

/* ════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════ */

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2400);
}
