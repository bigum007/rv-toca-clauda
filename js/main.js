/* ════════════════════════════════════════════════════════
   MAIN — initialization, title screen, event wiring
════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════
   TITLE SCREEN SETUP
════════════════════════════════════════════════════════ */

function buildTitleScreen() {
  // Spawn star particles
  const starsEl = document.getElementById('title-stars');
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = 3 + Math.random() * 6;
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${1.5+Math.random()*3}s;
      --delay:${-Math.random()*3}s;
    `;
    starsEl.appendChild(s);
  }

  // Show mini characters parading at the bottom
  const parade = document.getElementById('title-chars');
  // Pick a few characters to show on title
  const titleChars = ['risa','tanicka','anetka','cookie','dart','puffy'];
  titleChars.forEach((id, i) => {
    const ch = CHARACTERS.find(c => c.id === id);
    if (!ch) return;
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex; flex-direction:column; align-items:center;
      animation: titleCharBounce ${1.2+i*.15}s ease-in-out infinite alternate;
      animation-delay:${i*-0.3}s;
    `;
    wrap.innerHTML = `
      <svg viewBox="0 0 100 180" width="${60*ch.scale}px" height="${80*ch.scale}px" overflow="visible">
        ${buildCharacterSVG(ch)}
      </svg>
    `;
    parade.appendChild(wrap);
  });

  // Inject title animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes titleCharBounce {
      from { transform: translateY(0) rotate(-4deg); }
      to   { transform: translateY(-20px) rotate(4deg); }
    }
    .title-characters { gap: 10px; padding-bottom: 10px; }
  `;
  document.head.appendChild(style);
}

/* ════════════════════════════════════════════════════════
   TITLE → GAME TRANSITION
════════════════════════════════════════════════════════ */

function startGame() {
  const title = document.getElementById('title-screen');
  title.style.transition = 'opacity .6s, transform .6s';
  title.style.opacity = '0';
  title.style.transform = 'scale(1.05)';
  setTimeout(() => {
    title.classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    initGame();
  }, 600);
}

/* ════════════════════════════════════════════════════════
   GAME INITIALIZATION
════════════════════════════════════════════════════════ */

function initGame() {
  loadState();
  buildTray();
  loadScene(state.currentScene || 'living-room');
}

/* ════════════════════════════════════════════════════════
   EVENT BINDINGS
════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  buildTitleScreen();

  // Start button
  document.getElementById('btn-start').addEventListener('click', startGame);

  // Home button (go back to title)
  document.getElementById('btn-home').addEventListener('click', () => {
    const title = document.getElementById('title-screen');
    title.style.opacity = '';
    title.style.transform = '';
    title.style.transition = '';
    title.classList.remove('hidden');
    document.getElementById('game').classList.add('hidden');
    title.style.transition = 'opacity .4s';
    title.style.opacity = '0';
    requestAnimationFrame(() => { title.style.opacity = '1'; });
  });

  // Save
  document.getElementById('btn-save').addEventListener('click', saveState);

  // Export
  document.getElementById('btn-export').addEventListener('click', exportState);

  // Import
  document.getElementById('btn-import').addEventListener('click', () => {
    document.getElementById('file-import').click();
  });
  document.getElementById('file-import').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) importState(file);
    e.target.value = '';
  });

  // Scene navigation
  document.querySelectorAll('.snav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const sceneId = btn.dataset.scene;
      if (sceneId !== currentSceneId) loadScene(sceneId);
    });
  });

  // Close interaction bubble on scene click
  document.getElementById('scene-svg').addEventListener('click', () => {
    document.getElementById('interact-bubble').classList.add('hidden');
  });

  // Auto-save every 30 seconds
  setInterval(saveStateQuiet, 30000);
});

/* ════════════════════════════════════════════════════════
   KEYBOARD shortcuts
════════════════════════════════════════════════════════ */

document.addEventListener('keydown', e => {
  if (document.getElementById('game').classList.contains('hidden')) return;
  if (e.key === 's' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); saveState(); }
  if (e.key === 'Escape') document.getElementById('interact-bubble').classList.add('hidden');

  // Scene switching 1-5
  const scenes = ['living-room','kitchen','garden','bedroom','art-studio'];
  const n = parseInt(e.key);
  if (n >= 1 && n <= 5) loadScene(scenes[n-1]);
});

/* ════════════════════════════════════════════════════════
   WELCOME CONFETTI (first visit)
════════════════════════════════════════════════════════ */

function spawnConfetti() {
  const colors = ['#FF4081','#FFEB3B','#66BB6A','#42A5F5','#FF7043','#CE93D8'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    const size = 8 + Math.random() * 10;
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:1000;
      width:${size}px; height:${size}px;
      background:${colors[i%colors.length]};
      border-radius:${Math.random()>.5?'50%':'2px'};
      left:${Math.random()*100}%;
      top:-20px;
      opacity:1;
      transition: top ${1.5+Math.random()*2}s ease-in, opacity ${0.5}s ${1.5+Math.random()*1.5}s ease;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.top = (60 + Math.random() * 100) + 'vh';
    });
    setTimeout(() => el.remove(), 4000);
  }
}

// Fire confetti when game starts
const _orig = startGame;
window.startGame = function() {
  spawnConfetti();
  _orig();
};

// Re-wire the button (since we overrode startGame)
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-start').addEventListener('click', () => {});
  // The first listener already set above handles it; this is harmless extra.
}, { once: false });

// Fix: replace button binding after DOM is ready so we get the wrapped version
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-start');
  // Remove previous listeners by cloning
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener('click', window.startGame);
}, { capture: true });
