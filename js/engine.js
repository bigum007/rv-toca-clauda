/* ════════════════════════════════════════════════════════
   GAME ENGINE — drag/drop, interactions, state, save/load
════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'vondracek-family-world-v1';

/* ════════════════════════════════════════════════════════
   STATE
════════════════════════════════════════════════════════ */

let state = {
  currentScene: 'living-room',
  scenes: {}, // { sceneId: { chars: [{id,x,y}], objStates: {} } }
};

function getSceneState(sceneId) {
  if (!state.scenes[sceneId]) state.scenes[sceneId] = { chars: [], objStates: {} };
  return state.scenes[sceneId];
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    showToast('Saved! 💾');
  } catch(e) {
    showToast('Could not save 😢');
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      state = { ...state, ...loaded };
    }
  } catch(e) {}
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vondracek-world-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded! 📦');
}

function importState(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const loaded = JSON.parse(e.target.result);
      state = loaded;
      loadScene(state.currentScene || 'living-room');
      showToast('World loaded! 🌟');
    } catch(err) {
      showToast('Oops, bad file! 😢');
    }
  };
  reader.readAsText(file);
}

/* ════════════════════════════════════════════════════════
   SCENE MANAGEMENT
════════════════════════════════════════════════════════ */

let currentSceneId = 'living-room';

function loadScene(sceneId) {
  const sceneDef = SCENES[sceneId];
  if (!sceneDef) return;

  currentSceneId = sceneId;
  state.currentScene = sceneId;

  // Update nav
  document.querySelectorAll('.snav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.scene === sceneId);
  });
  document.getElementById('scene-title').textContent = sceneDef.label;

  // Build scene background + objects
  const svg = document.getElementById('scene-svg');
  sceneDef.build(svg);

  // Attach object click handlers
  svg.querySelectorAll('.scene-obj').forEach(attachObjHandler);

  // Restore characters in this scene
  const ss = getSceneState(sceneId);
  const charLayer = svg.querySelector('#scene-characters');
  charLayer.innerHTML = '';
  ss.chars.forEach(({ id, x, y }) => {
    const ch = CHARACTERS.find(c => c.id === id);
    if (!ch) return;
    const el = createSceneCharEl(ch, x, y);
    charLayer.appendChild(el);
    attachDragToSceneChar(el);
  });

  // Update tray (grey out placed chars)
  updateTray();

  // Restore any object states
  restoreObjStates(sceneId);
}

function restoreObjStates(sceneId) {
  const ss = getSceneState(sceneId);
  const objs = ss.objStates || {};

  // TV channel
  if (objs.tv !== undefined) updateTV(objs.tv);
  // Stove
  if (objs.stoveOn !== undefined) updateStove(objs.stoveOn);
}

/* ════════════════════════════════════════════════════════
   TRAY (character panel)
════════════════════════════════════════════════════════ */

function buildTray() {
  const list = document.getElementById('char-list');
  list.innerHTML = '';
  CHARACTERS.forEach(ch => {
    const card = createTrayCard(ch);
    card.addEventListener('pointerdown', e => onTrayCharPointerDown(e, ch));
    list.appendChild(card);
  });
}

function updateTray() {
  const ss = getSceneState(currentSceneId);
  const placedIds = new Set(ss.chars.map(c => c.id));
  document.querySelectorAll('.tray-char').forEach(card => {
    card.classList.toggle('in-scene', placedIds.has(card.dataset.id));
  });
}

/* ════════════════════════════════════════════════════════
   DRAG — from tray into scene
════════════════════════════════════════════════════════ */

let dragGhost = null;       // floating SVG element while dragging from tray
let dragCh = null;           // character being dragged from tray

function onTrayCharPointerDown(e, ch) {
  e.preventDefault();
  dragCh = ch;

  // Create ghost overlay on body
  dragGhost = document.createElement('div');
  dragGhost.style.cssText = `
    position:fixed; pointer-events:none; z-index:999;
    width:80px; height:120px;
    transform: translate(-50%,-50%) scale(1.2);
    left:${e.clientX}px; top:${e.clientY}px;
  `;
  dragGhost.innerHTML = `<svg viewBox="0 0 100 180" width="80" height="120" overflow="visible">
    <g transform="scale(${ch.scale})">${buildCharacterSVG(ch)}</g>
  </svg>`;
  document.body.appendChild(dragGhost);

  document.addEventListener('pointermove', onTrayDragMove);
  document.addEventListener('pointerup', onTrayDragEnd);
}

function onTrayDragMove(e) {
  if (!dragGhost) return;
  dragGhost.style.left = e.clientX + 'px';
  dragGhost.style.top  = e.clientY + 'px';
}

function onTrayDragEnd(e) {
  document.removeEventListener('pointermove', onTrayDragMove);
  document.removeEventListener('pointerup', onTrayDragEnd);
  if (!dragGhost || !dragCh) return;

  dragGhost.remove(); dragGhost = null;

  // Check if dropped on scene
  const sceneWrap = document.getElementById('scene-wrap');
  const rect = sceneWrap.getBoundingClientRect();
  if (e.clientX >= rect.left && e.clientX <= rect.right &&
      e.clientY >= rect.top  && e.clientY <= rect.bottom) {
    // Convert client coords → SVG coords
    const {svgX, svgY} = clientToSVG(e.clientX, e.clientY);
    placeCharInScene(dragCh, svgX, svgY - 80);
  }
  dragCh = null;
}

function placeCharInScene(ch, x, y) {
  const ss = getSceneState(currentSceneId);
  // Remove existing placement of same char (re-position)
  ss.chars = ss.chars.filter(c => c.id !== ch.id);
  ss.chars.push({ id: ch.id, x: Math.round(x), y: Math.round(y) });

  const svg = document.getElementById('scene-svg');
  const charLayer = svg.querySelector('#scene-characters');

  // Remove old element if exists
  const old = charLayer.querySelector(`[data-id="${ch.id}"]`);
  if (old) old.remove();

  const el = createSceneCharEl(ch, x, y);
  charLayer.appendChild(el);
  attachDragToSceneChar(el);

  updateTray();
  saveStateQuiet();
}

/* ════════════════════════════════════════════════════════
   DRAG — character within scene
════════════════════════════════════════════════════════ */

let draggingEl = null;
let dragOffsetX = 0, dragOffsetY = 0;
let dragStartX = 0, dragStartY = 0;

function attachDragToSceneChar(el) {
  el.addEventListener('pointerdown', onSceneCharPointerDown);
  el.addEventListener('click', onSceneCharClick);
}

function onSceneCharPointerDown(e) {
  e.stopPropagation();
  const el = e.currentTarget;
  draggingEl = el;
  el.classList.add('dragging');
  el.setPointerCapture(e.pointerId);

  // Current SVG position
  const t = getCharTransform(el);
  const pt = clientToSVG(e.clientX, e.clientY);
  dragOffsetX = pt.svgX - t.x;
  dragOffsetY = pt.svgY - t.y;
  dragStartX = t.x;
  dragStartY = t.y;

  // Bring to front
  el.parentElement.appendChild(el);

  el.addEventListener('pointermove', onSceneCharMove);
  el.addEventListener('pointerup', onSceneCharUp);
}

function onSceneCharMove(e) {
  if (!draggingEl) return;
  const pt = clientToSVG(e.clientX, e.clientY);
  const x = pt.svgX - dragOffsetX;
  const y = pt.svgY - dragOffsetY;
  setCharPosition(draggingEl, x, y);
}

function onSceneCharUp(e) {
  if (!draggingEl) return;
  const el = draggingEl;
  el.classList.remove('dragging');
  el.removeEventListener('pointermove', onSceneCharMove);
  el.removeEventListener('pointerup', onSceneCharUp);

  const t = getCharTransform(el);
  const dx = Math.abs(t.x - dragStartX), dy = Math.abs(t.y - dragStartY);
  const moved = dx > 4 || dy > 4;

  // Check if dragged back to tray area
  const tray = document.getElementById('char-tray').getBoundingClientRect();
  if (e.clientX >= tray.left && e.clientX <= tray.right) {
    // Remove from scene
    const id = el.dataset.id;
    const ss = getSceneState(currentSceneId);
    ss.chars = ss.chars.filter(c => c.id !== id);
    el.remove();
    updateTray();
    saveStateQuiet();
    showToast('Removed from scene');
  } else if (moved) {
    // Update state
    const id = el.dataset.id;
    const ss = getSceneState(currentSceneId);
    const entry = ss.chars.find(c => c.id === id);
    if (entry) { entry.x = Math.round(t.x); entry.y = Math.round(t.y); }
    saveStateQuiet();
  }

  draggingEl = null;
}

function getCharTransform(el) {
  const tr = el.getAttribute('transform') || '';
  const m = tr.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 };
}

function setCharPosition(el, x, y) {
  const ch = CHARACTERS.find(c => c.id === el.dataset.id);
  const scale = ch ? ch.scale : 1;
  el.setAttribute('transform', `translate(${x},${y}) scale(${scale})`);
}

/* ════════════════════════════════════════════════════════
   CHARACTER SPEECH (click)
════════════════════════════════════════════════════════ */

let bubbleTimeout = null;

function onSceneCharClick(e) {
  if (draggingEl) return; // was dragging, not clicking
  const el = e.currentTarget;
  const id = el.dataset.id;
  const ch = CHARACTERS.find(c => c.id === id);
  if (!ch) return;

  const phrase = ch.phrases[Math.floor(Math.random() * ch.phrases.length)];
  const t = getCharTransform(el);
  const svgRect = document.getElementById('scene-svg').getBoundingClientRect();
  const svgW = 1100, svgH = 620;
  const scaleX = svgRect.width / svgW;
  const scaleY = svgRect.height / svgH;
  const clientX = svgRect.left + t.x * scaleX;
  const clientY = svgRect.top  + t.y * scaleY;

  showBubble(phrase, clientX, clientY);
}

function showBubble(text, x, y) {
  const b = document.getElementById('interact-bubble');
  b.querySelector('#bubble-content').textContent = text;
  b.classList.remove('hidden');
  b.style.left = Math.min(x, window.innerWidth - 250) + 'px';
  b.style.top  = Math.max(10, y - 80) + 'px';

  if (bubbleTimeout) clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(() => b.classList.add('hidden'), 3000);
}

/* ════════════════════════════════════════════════════════
   OBJECT INTERACTIONS
════════════════════════════════════════════════════════ */

const TV_CHANNELS = ['🎬🎭','📺🎮','🎵🎶','🌍🌏','🏆⚽','🎪🤹','🌈✨','🦁🐯'];
let tvChannel = 0;
let stoveOn = false;
const COOK_FOODS = ['🍳','🍲','🥘','🍝','🍜','🥞','🥗','🍕'];
let cookFood = 0;

function attachObjHandler(el) {
  el.addEventListener('click', e => {
    e.stopPropagation();
    const obj = el.dataset.obj;
    const msg = el.dataset.msg;

    // Special interactive objects
    if (obj === 'tv') {
      tvChannel = (tvChannel + 1) % TV_CHANNELS.length;
      updateTV(tvChannel);
      const ss = getSceneState(currentSceneId);
      ss.objStates.tv = tvChannel;
      saveStateQuiet();
      showBubble('📺 Channel ' + (tvChannel+1) + ' ' + TV_CHANNELS[tvChannel],
        e.clientX, e.clientY);
      return;
    }
    if (obj === 'stove') {
      stoveOn = !stoveOn;
      cookFood = (cookFood + 1) % COOK_FOODS.length;
      updateStove(stoveOn);
      const ss = getSceneState(currentSceneId);
      ss.objStates.stoveOn = stoveOn;
      ss.objStates.cookFood = cookFood;
      saveStateQuiet();
      showBubble(stoveOn ? '🔥 Cooking ' + COOK_FOODS[cookFood] + '!' : '✅ Done cooking!',
        e.clientX, e.clientY);
      return;
    }

    // Wiggle animation
    el.classList.remove('active-anim');
    void el.offsetWidth;
    el.classList.add('active-anim');

    // Show message bubble
    if (msg) showBubble(msg, e.clientX, e.clientY);
  });
}

function updateTV(channel) {
  const screen = document.getElementById('tv-screen');
  const content = document.getElementById('tv-content');
  if (!screen || !content) return;
  const colors = ['#1565C0','#2E7D32','#B71C1C','#4A148C','#E65100','#006064','#880E4F','#1B5E20'];
  screen.setAttribute('fill', colors[channel % colors.length]);
  const ch = TV_CHANNELS[channel] || '📺';
  const W=1100, H=620;
  content.innerHTML = `
    <text x="${W-380}" y="${H-252}" text-anchor="middle" font-size="40" font-family="Nunito,sans-serif">${ch}</text>
    <text x="${W-380}" y="${H-218}" text-anchor="middle" font-size="13" fill="#B3E5FC" font-family="Nunito,sans-serif">Ch. ${channel+1}</text>`;
}

function updateStove(on) {
  const glow = document.getElementById('burner-glow');
  const food = document.getElementById('cooking-food');
  if (glow) {
    glow.setAttribute('opacity', on ? '0.9' : '0');
    glow.style.animation = on ? 'burnPulse 1s ease-in-out infinite alternate' : 'none';
  }
  if (food) food.textContent = COOK_FOODS[cookFood] || '🍳';
}

/* ════════════════════════════════════════════════════════
   SVG COORDINATE HELPERS
════════════════════════════════════════════════════════ */

function clientToSVG(clientX, clientY) {
  const svg = document.getElementById('scene-svg');
  const rect = svg.getBoundingClientRect();
  const svgW = 1100, svgH = 620;
  const scaleX = svgW / rect.width;
  const scaleY = svgH / rect.height;
  return {
    svgX: (clientX - rect.left) * scaleX,
    svgY: (clientY - rect.top)  * scaleY,
  };
}

/* ════════════════════════════════════════════════════════
   TOAST NOTIFICATION
════════════════════════════════════════════════════════ */

let toastTimeout = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => t.classList.add('hidden'), 2500);
}

/* Quiet save (no toast) */
function saveStateQuiet() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
}

/* ════════════════════════════════════════════════════════
   STOVE animation keyframe injection
════════════════════════════════════════════════════════ */

(function injectStoveAnim() {
  const style = document.createElement('style');
  style.textContent = `@keyframes burnPulse {
    from { fill: #FF5722; r: 12px; }
    to   { fill: #FF9800; r: 16px; }
  }`;
  document.head.appendChild(style);
})();
