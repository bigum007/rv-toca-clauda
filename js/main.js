/* ════════════════════════════════════════════════════════
   MAIN — boot, title screen, scene init, event wiring
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   TITLE SCREEN
════════════════════════════════════════════════════════ */

function buildTitleScreen() {
  // Stars
  const starsEl = document.getElementById('title-stars');
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = 3 + Math.random() * 6;
    s.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;--dur:${1.5+Math.random()*3}s;--delay:${-Math.random()*3}s;`;
    starsEl.appendChild(s);
  }

  // Character parade at bottom
  const parade = document.getElementById('title-chars');
  const ids = ['risa','tanicka','anetka','cookie','dart','puffy'];
  ids.forEach((id, i) => {
    const ch = CHARACTERS.find(c => c.id === id);
    if (!ch) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = `display:flex;flex-direction:column;align-items:center;animation:titleBounce ${1.1+i*.15}s ease-in-out infinite alternate;animation-delay:${-i*.28}s;`;
    wrap.innerHTML = `<svg viewBox="0 0 100 180" width="${Math.round(52*ch.scale)}px" height="${Math.round(78*ch.scale)}px" overflow="visible">${buildCharacterSVG(ch)}</svg>`;
    parade.appendChild(wrap);
  });
}

/* ════════════════════════════════════════════════════════
   CONFETTI
════════════════════════════════════════════════════════ */

function spawnConfetti() {
  const cols = ['#FF4081','#FFEB3B','#66BB6A','#42A5F5','#FF7043','#CE93D8'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    const sz = 7 + Math.random() * 10;
    el.style.cssText = `position:fixed;pointer-events:none;z-index:999;width:${sz}px;height:${sz}px;background:${cols[i%cols.length]};border-radius:${Math.random()>.5?'50%':'3px'};left:${Math.random()*100}%;top:-20px;transition:top ${1.4+Math.random()*1.8}s ease-in,opacity .5s ${1.6+Math.random()*1.2}s;`;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.top = (50+Math.random()*80)+'vh'; });
    setTimeout(() => el.remove(), 3800);
  }
}

/* ════════════════════════════════════════════════════════
   SCENE INITIALIZATION
════════════════════════════════════════════════════════ */

function initScenes() {
  document.querySelectorAll('.scene-panel').forEach(panel => {
    const sceneId = panel.dataset.scene;
    const bg = panel.dataset.bg || '#fff';
    panel.style.background = bg;

    // Create the SVG element — viewBox will be updated by applyPanX in goToScene
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('class','scene-svg');
    svg.setAttribute('viewBox','0 0 1100 620');
    svg.setAttribute('preserveAspectRatio','xMidYMid slice'); // overridden on navigation
    svg.setAttribute('xmlns','http://www.w3.org/2000/svg');

    // Layers
    ['scene-bg','scene-objects','scene-chars','scene-ui'].forEach(id => {
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.setAttribute('id', id + '-' + sceneId);
      // alias so scenes.js build() can find them by common names
      g.setAttribute('data-layer', id);
      svg.appendChild(g);
    });

    // Also add defs for the scene
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    svg.insertBefore(defs, svg.firstChild);

    panel.appendChild(svg);

    // Build scene content — pass a proxy object that scenes.js can use
    const proxy = buildSceneProxy(svg, sceneId);
    if (SCENES[sceneId]) SCENES[sceneId].build(proxy);

    // Attach object interaction handler
    attachObjInteractions(panel, svg);
  });
}

/* scenes.js build() expects an SVG with #scene-bg, #scene-objects, etc.
   We proxy by finding our data-layer elements. */
function buildSceneProxy(svg, sceneId) {
  return new Proxy(svg, {
    get(target, prop) {
      if (prop === 'querySelector') {
        return sel => {
          // Map old IDs to new data-layer approach
          if (sel === '#scene-bg')   return svg.querySelector('[data-layer="scene-bg"]');
          if (sel === '#scene-objects') return svg.querySelector('[data-layer="scene-objects"]');
          if (sel === '#scene-characters') return svg.querySelector('[data-layer="scene-chars"]');
          if (sel === '#scene-fg')   return svg.querySelector('[data-layer="scene-ui"]');
          if (sel === '#scene-ui')   return svg.querySelector('[data-layer="scene-ui"]');
          return svg.querySelector(sel);
        };
      }
      const val = target[prop];
      return typeof val === 'function' ? val.bind(target) : val;
    }
  });
}

/* ════════════════════════════════════════════════════════
   START GAME
════════════════════════════════════════════════════════ */

function startGame() {
  spawnConfetti();
  const title = document.getElementById('title-screen');
  title.style.opacity = '0';
  title.style.transform = 'scale(1.04)';
  setTimeout(() => {
    title.classList.add('hidden');
    document.getElementById('world').classList.remove('hidden');
    initGame();
  }, 500);
}

function initGame() {
  loadState();
  initScenes();
  buildCastDrawer();
  setupSceneSwipe();
  setupDotNav();
  setupHUDButtons();
  rebuildAllChars();
  goToScene(state.sceneIdx || 0);
  // Auto-save every 30s
  setInterval(saveStateQuiet, 30000);
}

/* ════════════════════════════════════════════════════════
   EVENT BINDINGS
════════════════════════════════════════════════════════ */

function setupDotNav() {
  document.querySelectorAll('#scene-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => {
      goToScene(parseInt(dot.dataset.idx));
      closeAllDrawers();
    });
  });
}

function setupHUDButtons() {
  document.getElementById('btn-cast').addEventListener('click', () => {
    if (document.getElementById('cast-drawer').classList.contains('open')) {
      closeCastDrawer();
    } else {
      closeMenuDrawer();
      openCastDrawer();
    }
  });

  document.getElementById('btn-menu').addEventListener('click', () => {
    if (document.getElementById('menu-drawer').classList.contains('open')) {
      closeMenuDrawer();
    } else {
      closeCastDrawer();
      openMenuDrawer();
    }
  });

  // Backdrop tap closes all
  document.getElementById('drawer-backdrop').addEventListener('click', closeAllDrawers);

  document.getElementById('btn-save').addEventListener('click',   () => { saveState(); closeMenuDrawer(); });
  document.getElementById('btn-export').addEventListener('click', () => { exportState(); closeMenuDrawer(); });
  document.getElementById('btn-import').addEventListener('click', () => { document.getElementById('file-import').click(); closeMenuDrawer(); });
  document.getElementById('btn-home').addEventListener('click',   () => {
    closeMenuDrawer();
    const title = document.getElementById('title-screen');
    title.style.opacity = '0'; title.style.transform = 'scale(1.04)'; title.style.transition = '';
    title.classList.remove('hidden');
    requestAnimationFrame(() => {
      title.style.transition = 'opacity .4s, transform .4s';
      title.style.opacity = '1'; title.style.transform = 'scale(1)';
    });
    document.getElementById('world').classList.add('hidden');
  });

  document.getElementById('file-import').addEventListener('change', e => {
    if (e.target.files[0]) importState(e.target.files[0]);
    e.target.value = '';
  });

  // Close bubble on background tap
  document.getElementById('world').addEventListener('click', e => {
    if (!e.target.closest('.scene-char') && !e.target.closest('.scene-obj')) {
      document.getElementById('speech-bubble').classList.add('hidden');
    }
  });
}

/* ════════════════════════════════════════════════════════
   KEYBOARD (desktop)
════════════════════════════════════════════════════════ */

document.addEventListener('keydown', e => {
  if (document.getElementById('world').classList.contains('hidden')) return;
  if ((e.ctrlKey||e.metaKey) && e.key==='s') { e.preventDefault(); saveState(); }
  if (e.key==='Escape') { closeAllDrawers(); document.getElementById('speech-bubble').classList.add('hidden'); }
  if (e.key==='ArrowRight') goToScene(currentSceneIdx+1);
  if (e.key==='ArrowLeft')  goToScene(currentSceneIdx-1);
});

/* ════════════════════════════════════════════════════════
   BOOT
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Inject backdrop element
  const bd = document.createElement('div');
  bd.id = 'drawer-backdrop';
  document.getElementById('world').appendChild(bd);

  buildTitleScreen();
  document.getElementById('btn-start').addEventListener('click', startGame);
});
