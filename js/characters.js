/* ════════════════════════════════════════════════════════
   CHARACTER DEFINITIONS + SVG RENDERING
   Inspired by Anetka's beautiful art style
════════════════════════════════════════════════════════ */

const CHARACTERS = [
  /* ── HUMANS ── */
  {
    id: 'richard', name: 'Richard', label: 'Dad 👨',
    scale: 1.0,
    skin: '#D4956A', hair: '#4A2C0A', hairStyle: 'short-wave',
    top: '#1A237E', bottom: '#37474F', shoes: '#212121',
    accessory: 'glasses',
    eyes: '#4A90D9',
    phrases: ['Anyone want coffee? ☕', 'Time for a walk! 🐕', 'Who left this here?? 😄', 'Great day for family! 🏠', 'Did someone say pizza? 🍕'],
  },
  {
    id: 'zuzana', name: 'Zuzana', label: 'Mom 👩',
    scale: 0.97,
    skin: '#E0A87A', hair: '#6B3A1F', hairStyle: 'medium-wave',
    top: '#AD1457', bottom: '#F48FB1', shoes: '#880E4F',
    accessory: null,
    eyes: '#5D4037',
    phrases: ['Come eat! 🍲', 'I love you all! 💕', 'Who wants a hug? 🤗', 'Dinner is ready! 🍽️', 'So proud of you! ⭐'],
  },
  {
    id: 'klarka', name: 'Klárka', label: 'Klárka 👱‍♀️',
    scale: 0.95,
    skin: '#E0B080', hair: '#C0392B', hairStyle: 'long-straight',
    top: '#7B1FA2', bottom: '#E1BEE7', shoes: '#6A1B9A',
    accessory: null,
    eyes: '#4E342E',
    phrases: ['That\'s so cute! 💅', 'Can I help? 😊', 'Let me take a photo! 📸', 'Group hug! 🥰', 'I\'m the best sister! ✨'],
  },
  {
    id: 'anetka', name: 'Anetka', label: 'Anetka 🎨',
    scale: 0.88,
    skin: '#DCA06A', hair: '#3E2723', hairStyle: 'pigtails',
    top: '#FF7043', bottom: '#FFCCBC', shoes: '#BF360C',
    accessory: 'paint-smudge',
    eyes: '#6D4C41',
    phrases: ['I want to draw! 🎨', 'Look at my art! 🖌️', 'Let\'s be creative! ✏️', 'I drew this! ⭐', 'Can I use the markers? 🖊️'],
  },
  {
    id: 'tanicka', name: 'Tánička', label: 'Tánička 🌟',
    scale: 0.85,
    skin: '#D4956A', hair: '#5D4037', hairStyle: 'bun',
    top: '#00897B', bottom: '#E0F2F1', shoes: '#004D40',
    accessory: null,
    eyes: '#558B2F',
    phrases: ['Let\'s play! 🎮', 'I\'m the fastest! 🏃‍♀️', 'My turn! 😄', 'Can we go outside? 🌸', 'This is so fun! 🎉'],
  },
  {
    id: 'risa', name: 'Ríša', label: 'Ríša 🚀',
    scale: 0.68,
    skin: '#E0A070', hair: '#3E2723', hairStyle: 'messy',
    top: '#F44336', bottom: '#FFCDD2', shoes: '#B71C1C',
    accessory: null,
    eyes: '#1565C0',
    phrases: ['Wheeeee! 🚀', 'I want cookies! 🍪', 'Can Dart play? 🐶', 'Zoom zoom! 💨', 'Look at me! 🦸'],
  },

  /* ── ANIMALS ── */
  {
    id: 'puffy', name: 'Puffy', label: 'Puffy 🦊',
    scale: 0.72, isAnimal: true, animalType: 'shiba',
    fur: '#C44B12', furLight: '#F4A460',
    accent: '#fff',
    phrases: ['...', '🐾', '😴', 'Woof 🦊', '*yawn*'],
  },
  {
    id: 'dart', name: 'Dart', label: 'Dart 🐩',
    scale: 0.85, isAnimal: true, animalType: 'poodle',
    fur: '#F5F0E8', furLight: '#fff',
    accent: '#E8D5B7',
    phrases: ['Woof woof! 🐩', 'PLAY! 🎾', '*zoomies* 💨', 'Ball?? 🎾', 'Wag wag! 🐾'],
  },
  {
    id: 'liza', name: 'Líza', label: 'Líza 🐱',
    scale: 0.60, isAnimal: true, animalType: 'cat-small',
    fur: '#8D8D8D', furLight: '#C0C0C0',
    accent: '#fff',
    phrases: ['Miau... 😸', '...*stare*...', 'Purrrr 😻', 'Don\'t bother me.', '*silent judgment* 👀'],
  },
  {
    id: 'cookie', name: 'Cookie', label: 'Cookie 🐈',
    scale: 0.78, isAnimal: true, animalType: 'cat-fluffy',
    fur: '#F8F8F8', furLight: '#fff',
    accent: '#FFE0B2',
    phrases: ['Miaou! 🐈', 'Feed me! 🐟', '*flop* 😹', 'Pets please! 🤍', 'Purr purr 💕'],
  },
  {
    id: 'berta', name: 'Berta', label: 'Berta 🐇',
    scale: 0.74, isAnimal: true, animalType: 'rabbit-big',
    fur: '#A0A0A0', furLight: '#D5D5D5',
    accent: '#FFB3C1',
    phrases: ['*thump thump*', 'Munch munch 🥕', 'Binky! 🐇', 'Sniff sniff 👃', 'Hello! 🐾'],
  },
  {
    id: 'mikie', name: 'Mikie', label: 'Mikie 🐰',
    scale: 0.55, isAnimal: true, animalType: 'rabbit-small',
    fur: '#8B6914', furLight: '#C8A85A',
    accent: '#FFB3C1',
    phrases: ['*hop* 🐰', 'Munch! 🥕', 'Binky binky! ✨', '*nose wiggle*', 'Tiny but mighty! 💪'],
  },
];

/* ════════════════════════════════════════════════════════
   SVG BUILDER HELPERS
════════════════════════════════════════════════════════ */

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function darken(hex, amt=30) {
  const {r,g,b} = hex2rgb(hex);
  return `rgb(${Math.max(0,r-amt)},${Math.max(0,g-amt)},${Math.max(0,b-amt)})`;
}
function lighten(hex, amt=30) {
  const {r,g,b} = hex2rgb(hex);
  return `rgb(${Math.min(255,r+amt)},${Math.min(255,g+amt)},${Math.min(255,b+amt)})`;
}

/* ════════════════════════════════════════════════════════
   HAIR STYLES
════════════════════════════════════════════════════════ */

function drawHair(style, color, cx, headTop) {
  const d = darken(color, 15);
  switch(style) {
    case 'short-wave':
      return `<path d="M${cx-28},${headTop+12} Q${cx-22},${headTop-18} ${cx},${headTop-20}
                       Q${cx+22},${headTop-18} ${cx+28},${headTop+12}
                       Q${cx+20},${headTop-5} ${cx},${headTop-8}
                       Q${cx-20},${headTop-5} ${cx-28},${headTop+12}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>
              <path d="M${cx-28},${headTop+10} Q${cx-35},${headTop-5} ${cx-25},${headTop+2}"
               fill="${d}" opacity=".4"/>`;
    case 'medium-wave':
      return `<path d="M${cx-30},${headTop+15} Q${cx-20},${headTop-22} ${cx},${headTop-24}
                       Q${cx+20},${headTop-22} ${cx+30},${headTop+15}
                       Q${cx+35},${headTop+30} ${cx+32},${headTop+50}
                       Q${cx+24},${headTop+32} ${cx},${headTop+28}
                       Q${cx-24},${headTop+32} ${cx-32},${headTop+50}
                       Q${cx-35},${headTop+30} ${cx-30},${headTop+15}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>`;
    case 'long-straight':
      return `<path d="M${cx-30},${headTop+12} Q${cx-22},${headTop-22} ${cx},${headTop-24}
                       Q${cx+22},${headTop-22} ${cx+30},${headTop+12}
                       Q${cx+34},${headTop+60} ${cx+30},${headTop+90}
                       L${cx+22},${headTop+90} Q${cx+26},${headTop+60} ${cx+22},${headTop+14}
                       Q${cx},${headTop+10} ${cx-22},${headTop+14}
                       Q${cx-26},${headTop+60} ${cx-22},${headTop+90}
                       L${cx-30},${headTop+90} Q${cx-34},${headTop+60} ${cx-30},${headTop+12}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>`;
    case 'pigtails':
      return `<path d="M${cx-30},${headTop+10} Q${cx-24},${headTop-20} ${cx},${headTop-22}
                       Q${cx+24},${headTop-20} ${cx+30},${headTop+10}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>
              <ellipse cx="${cx-36}" cy="${headTop+28}" rx="10" ry="20" fill="${color}" stroke="${d}" stroke-width="1.5" transform="rotate(-15,${cx-36},${headTop+28})"/>
              <ellipse cx="${cx+36}" cy="${headTop+28}" rx="10" ry="20" fill="${color}" stroke="${d}" stroke-width="1.5" transform="rotate(15,${cx+36},${headTop+28})"/>`;
    case 'bun':
      return `<path d="M${cx-28},${headTop+10} Q${cx-22},${headTop-20} ${cx},${headTop-22}
                       Q${cx+22},${headTop-20} ${cx+28},${headTop+10}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>
              <circle cx="${cx}" cy="${headTop-30}" r="14" fill="${color}" stroke="${d}" stroke-width="2"/>`;
    case 'messy':
    default:
      return `<path d="M${cx-26},${headTop+14} Q${cx-28},${headTop-10} ${cx-10},${headTop-20}
                       Q${cx},${headTop-28} ${cx+10},${headTop-20}
                       Q${cx+28},${headTop-10} ${cx+26},${headTop+14}Z"
               fill="${color}" stroke="${d}" stroke-width="1.5"/>
              <path d="M${cx-14},${headTop-22} Q${cx-8},${headTop-36} ${cx+4},${headTop-30}" fill="${color}" stroke="${d}" stroke-width="2" fill="none"/>
              <path d="M${cx+6},${headTop-24} Q${cx+14},${headTop-34} ${cx+20},${headTop-22}" fill="none" stroke="${color}" stroke-width="3"/>`;
  }
}

/* ════════════════════════════════════════════════════════
   HUMAN CHARACTER SVG
════════════════════════════════════════════════════════ */

function buildHumanSVG(ch) {
  const cx = 50, cy = 160;
  const headR = 28;
  const headCy = 45;
  const headTop = headCy - headR;
  const neckY = headCy + headR - 4;
  const bodyTop = neckY + 6;
  const bodyH = 52;
  const bodyW = 36;
  const bodyLeft = cx - bodyW/2;
  const legH = 42;
  const legW = 14;
  const shoeH = 8;

  const skinD = darken(ch.skin, 25);
  const topD  = darken(ch.top,  25);
  const botD  = darken(ch.bottom, 25);

  // Arms
  const armTop = bodyTop + 6;
  const armLen = bodyH * 0.65;

  let extras = '';
  if (ch.accessory === 'glasses') {
    extras += `
      <rect x="${cx-22}" y="${headCy-5}" width="18" height="13" rx="4"
            fill="none" stroke="#444" stroke-width="2.5"/>
      <rect x="${cx+4}"  y="${headCy-5}" width="18" height="13" rx="4"
            fill="none" stroke="#444" stroke-width="2.5"/>
      <line x1="${cx-4}" y1="${headCy+2}" x2="${cx+4}" y2="${headCy+2}"
            stroke="#444" stroke-width="2"/>
      <line x1="${cx-40}" y1="${headCy+2}" x2="${cx-22}" y2="${headCy+2}"
            stroke="#444" stroke-width="2"/>
      <line x1="${cx+22}" y1="${headCy+2}" x2="${cx+40}" y2="${headCy+2}"
            stroke="#444" stroke-width="2"/>`;
  }
  if (ch.accessory === 'paint-smudge') {
    extras += `
      <circle cx="${cx+16}" cy="${headCy+12}" r="4" fill="#FF7043" opacity=".6"/>
      <circle cx="${cx-4}"  cy="${headCy+18}" r="3" fill="#66BB6A" opacity=".7"/>`;
  }

  // Eye pupils color
  const eyeColor = ch.eyes || '#2244AA';

  return `
    <!-- Shadow -->
    <ellipse cx="${cx}" cy="${cy+2}" rx="22" ry="6" fill="rgba(0,0,0,.13)"/>

    <!-- Legs -->
    <rect x="${cx-bodyW/2+2}" y="${bodyTop+bodyH}" width="${legW}" height="${legH}" rx="7"
          fill="${ch.bottom}" stroke="${botD}" stroke-width="1.5"/>
    <rect x="${cx+bodyW/2-legW-2}" y="${bodyTop+bodyH}" width="${legW}" height="${legH}" rx="7"
          fill="${ch.bottom}" stroke="${botD}" stroke-width="1.5"/>

    <!-- Shoes -->
    <ellipse cx="${cx-bodyW/2+2+legW/2}" cy="${bodyTop+bodyH+legH}" rx="${legW*0.75}" ry="${shoeH/2}"
             fill="${ch.shoes}" stroke="${darken(ch.shoes,30)}" stroke-width="1.5"/>
    <ellipse cx="${cx+bodyW/2-legW/2-2}" cy="${bodyTop+bodyH+legH}" rx="${legW*0.75}" ry="${shoeH/2}"
             fill="${ch.shoes}" stroke="${darken(ch.shoes,30)}" stroke-width="1.5"/>

    <!-- Arms -->
    <rect x="${bodyLeft-14}" y="${armTop}" width="14" height="${armLen}" rx="7"
          fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>
    <rect x="${bodyLeft+bodyW}" y="${armTop}" width="14" height="${armLen}" rx="7"
          fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>
    <!-- Hands -->
    <circle cx="${bodyLeft-7}" cy="${armTop+armLen+5}" r="7"
            fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>
    <circle cx="${bodyLeft+bodyW+7}" cy="${armTop+armLen+5}" r="7"
            fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>

    <!-- Body -->
    <rect x="${bodyLeft}" y="${bodyTop}" width="${bodyW}" height="${bodyH}" rx="12"
          fill="${ch.top}" stroke="${topD}" stroke-width="2"/>
    <!-- Shirt detail line -->
    <line x1="${cx}" y1="${bodyTop+8}" x2="${cx}" y2="${bodyTop+bodyH-8}"
          stroke="${topD}" stroke-width="1.5" opacity=".4"/>

    <!-- Neck -->
    <rect x="${cx-7}" y="${neckY}" width="14" height="12" rx="5"
          fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>

    <!-- Hair (behind head) -->
    ${drawHair(ch.hairStyle, ch.hair, cx, headTop)}

    <!-- Head -->
    <circle cx="${cx}" cy="${headCy}" r="${headR}"
            fill="${ch.skin}" stroke="${skinD}" stroke-width="2"/>

    <!-- Ears -->
    <ellipse cx="${cx-headR+1}" cy="${headCy+3}" rx="6" ry="8"
             fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>
    <ellipse cx="${cx+headR-1}" cy="${headCy+3}" rx="6" ry="8"
             fill="${ch.skin}" stroke="${skinD}" stroke-width="1.5"/>

    <!-- Eyes whites -->
    <ellipse cx="${cx-11}" cy="${headCy-2}" rx="8" ry="9" fill="white"/>
    <ellipse cx="${cx+11}" cy="${headCy-2}" rx="8" ry="9" fill="white"/>
    <!-- Eye pupils -->
    <circle cx="${cx-10}" cy="${headCy}" r="5" fill="${eyeColor}"/>
    <circle cx="${cx+10}" cy="${headCy}" r="5" fill="${eyeColor}"/>
    <!-- Eye glints -->
    <circle cx="${cx-8}"  cy="${headCy-2}" r="2" fill="white"/>
    <circle cx="${cx+12}" cy="${headCy-2}" r="2" fill="white"/>
    <!-- Eyelashes top -->
    <path d="M${cx-18},${headCy-9} Q${cx-11},${headCy-13} ${cx-4},${headCy-9}"
          fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>
    <path d="M${cx+4},${headCy-9} Q${cx+11},${headCy-13} ${cx+18},${headCy-9}"
          fill="none" stroke="#333" stroke-width="2" stroke-linecap="round"/>

    <!-- Nose -->
    <ellipse cx="${cx}" cy="${headCy+10}" rx="4" ry="3" fill="${skinD}"/>

    <!-- Smile -->
    <path d="M${cx-10},${headCy+18} Q${cx},${headCy+26} ${cx+10},${headCy+18}"
          stroke="${darken(ch.skin,40)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Cheeks -->
    <ellipse cx="${cx-20}" cy="${headCy+12}" rx="6" ry="4" fill="${ch.coral||'#FFB3BA'}" opacity=".5"/>
    <ellipse cx="${cx+20}" cy="${headCy+12}" rx="6" ry="4" fill="${ch.coral||'#FFB3BA'}" opacity=".5"/>

    ${extras}`;
}

/* ════════════════════════════════════════════════════════
   ANIMAL SVGs
════════════════════════════════════════════════════════ */

function buildAnimalSVG(ch) {
  switch(ch.animalType) {
    case 'shiba': return buildShiba(ch);
    case 'poodle': return buildPoodle(ch);
    case 'cat-small': return buildCatSmall(ch);
    case 'cat-fluffy': return buildCatFluffy(ch);
    case 'rabbit-big': return buildRabbit(ch, true);
    case 'rabbit-small': return buildRabbit(ch, false);
  }
}

function buildShiba(ch) {
  const fur = ch.fur, fl = ch.furLight, ac = ch.accent;
  return `
    <ellipse cx="50" cy="162" rx="20" ry="5" fill="rgba(0,0,0,.12)"/>
    <!-- Body -->
    <ellipse cx="50" cy="120" rx="28" ry="36" fill="${fur}"/>
    <!-- Tail -->
    <path d="M72,100 Q100,70 90,50 Q80,40 75,60 Q82,75 70,90Z" fill="${fur}" stroke="${darken(fur,20)}" stroke-width="1.5"/>
    <ellipse cx="83" cy="55" rx="8" ry="10" fill="${fl}" transform="rotate(-20,83,55)"/>
    <!-- Head -->
    <circle cx="50" cy="62" r="32" fill="${fur}"/>
    <!-- Snout -->
    <ellipse cx="50" cy="74" rx="16" ry="12" fill="${fl}"/>
    <!-- Ears -->
    <path d="M22,44 L18,18 L36,34Z" fill="${fur}" stroke="${darken(fur,20)}" stroke-width="1.5"/>
    <path d="M78,44 L82,18 L64,34Z" fill="${fur}" stroke="${darken(fur,20)}" stroke-width="1.5"/>
    <path d="M25,42 L22,24 L34,34Z" fill="#FFB3A0" opacity=".7"/>
    <path d="M75,42 L78,24 L66,34Z" fill="#FFB3A0" opacity=".7"/>
    <!-- Eyes (Shiba squinty) -->
    <ellipse cx="36" cy="56" rx="8" ry="6" fill="white"/>
    <ellipse cx="64" cy="56" rx="8" ry="6" fill="white"/>
    <circle cx="37" cy="57" r="5" fill="#3E2A10"/>
    <circle cx="65" cy="57" r="5" fill="#3E2A10"/>
    <circle cx="39" cy="55" r="2" fill="white"/>
    <circle cx="67" cy="55" r="2" fill="white"/>
    <!-- Nose -->
    <ellipse cx="50" cy="69" rx="6" ry="4" fill="#2D1A0E"/>
    <!-- Mouth -->
    <path d="M44,74 Q50,79 56,74" stroke="#2D1A0E" stroke-width="2" fill="none"/>
    <!-- White chest -->
    <ellipse cx="50" cy="118" rx="16" ry="22" fill="${fl}" opacity=".9"/>
    <!-- Legs -->
    <rect x="28" y="138" width="16" height="28" rx="8" fill="${fur}"/>
    <rect x="56" y="138" width="16" height="28" rx="8" fill="${fur}"/>
    <ellipse cx="36" cy="167" rx="10" ry="5" fill="${darken(fur,20)}"/>
    <ellipse cx="64" cy="167" rx="10" ry="5" fill="${darken(fur,20)}"/>`;
}

function buildPoodle(ch) {
  const fur = ch.fur, ac = ch.accent;
  // Fluffy circles for poodle curls
  function curls(cx,cy,r,n=5) {
    let out = '';
    for(let i=0;i<n;i++){
      const a = (i/n)*Math.PI*2;
      const x = cx + Math.cos(a)*r*.6;
      const y = cy + Math.sin(a)*r*.6;
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r*.55).toFixed(1)}" fill="${fur}" stroke="${ac}" stroke-width="1"/>`;
    }
    out += `<circle cx="${cx}" cy="${cy}" r="${(r*.55).toFixed(1)}" fill="${fur}"/>`;
    return out;
  }
  return `
    <ellipse cx="50" cy="168" rx="24" ry="6" fill="rgba(0,0,0,.1)"/>
    <!-- Body fluffy -->
    ${curls(50, 118, 28, 8)}
    <!-- Tail -->
    <path d="M74,100 Q96,80 88,62 Q82,55 78,70 Q84,82 72,96Z" fill="${fur}"/>
    ${curls(85, 62, 12, 5)}
    <!-- Head curls -->
    ${curls(50, 56, 32, 10)}
    <!-- Snout -->
    <ellipse cx="50" cy="70" rx="14" ry="10" fill="${darken(fur,10)}"/>
    <!-- Ears (long floppy) -->
    ${curls(22, 72, 14, 5)}
    ${curls(78, 72, 14, 5)}
    <!-- Eyes -->
    <circle cx="38" cy="52" r="7" fill="white"/>
    <circle cx="62" cy="52" r="7" fill="white"/>
    <circle cx="39" cy="53" r="5" fill="#1A0A00"/>
    <circle cx="63" cy="53" r="5" fill="#1A0A00"/>
    <circle cx="41" cy="51" r="2" fill="white"/>
    <circle cx="65" cy="51" r="2" fill="white"/>
    <!-- Nose -->
    <ellipse cx="50" cy="67" rx="5" ry="4" fill="#1A0A00"/>
    <!-- Mouth -->
    <path d="M44,72 Q50,78 56,72" stroke="#1A0A00" stroke-width="2" fill="none"/>
    <!-- Legs -->
    ${curls(32, 152, 14, 5)}
    ${curls(68, 152, 14, 5)}`;
}

function buildCatSmall(ch) {
  const fur=ch.fur, fl=ch.furLight;
  return `
    <ellipse cx="50" cy="158" rx="18" ry="5" fill="rgba(0,0,0,.1)"/>
    <!-- Body -->
    <ellipse cx="50" cy="116" rx="22" ry="32" fill="${fur}"/>
    <!-- Tail -->
    <path d="M68,130 Q90,100 84,78 Q80,68 72,84 Q78,100 66,118Z" fill="${fur}"/>
    <!-- Head -->
    <circle cx="50" cy="58" r="26" fill="${fur}"/>
    <!-- Ears -->
    <path d="M24,40 L18,16 L34,32Z" fill="${fur}"/>
    <path d="M76,40 L82,16 L66,32Z" fill="${fur}"/>
    <path d="M26,38 L21,20 L33,31Z" fill="#FFB3C1" opacity=".8"/>
    <path d="M74,38 L79,20 L67,31Z" fill="#FFB3C1" opacity=".8"/>
    <!-- Snout -->
    <ellipse cx="50" cy="66" rx="12" ry="9" fill="${fl}" opacity=".7"/>
    <!-- Eyes (narrow, cat-like) -->
    <ellipse cx="38" cy="53" rx="8" ry="7" fill="white"/>
    <ellipse cx="62" cy="53" rx="8" ry="7" fill="white"/>
    <ellipse cx="38" cy="54" rx="4" ry="6" fill="#3A7D44"/>
    <ellipse cx="62" cy="54" rx="4" ry="6" fill="#3A7D44"/>
    <ellipse cx="38" cy="54" rx="2" ry="5" fill="#111"/>
    <ellipse cx="62" cy="54" rx="2" ry="5" fill="#111"/>
    <circle cx="40" cy="52" r="1.5" fill="white"/>
    <circle cx="64" cy="52" r="1.5" fill="white"/>
    <!-- Whiskers -->
    <line x1="26" y1="64" x2="44" y2="66" stroke="${darken(fur,40)}" stroke-width="1.5"/>
    <line x1="26" y1="68" x2="44" y2="68" stroke="${darken(fur,40)}" stroke-width="1.5"/>
    <line x1="74" y1="64" x2="56" y2="66" stroke="${darken(fur,40)}" stroke-width="1.5"/>
    <line x1="74" y1="68" x2="56" y2="68" stroke="${darken(fur,40)}" stroke-width="1.5"/>
    <!-- Nose -->
    <path d="M47,63 L50,66 L53,63 Z" fill="#FF8FAB"/>
    <!-- Legs -->
    <rect x="30" y="134" width="14" height="26" rx="7" fill="${fur}"/>
    <rect x="56" y="134" width="14" height="26" rx="7" fill="${fur}"/>
    <ellipse cx="37" cy="161" rx="8" ry="4" fill="${darken(fur,20)}"/>
    <ellipse cx="63" cy="161" rx="8" ry="4" fill="${darken(fur,20)}"/>`;
}

function buildCatFluffy(ch) {
  const fur=ch.fur, fl=ch.furLight;
  return `
    <ellipse cx="50" cy="165" rx="24" ry="6" fill="rgba(0,0,0,.1)"/>
    <!-- Body (fluffy/big) -->
    <ellipse cx="50" cy="118" rx="30" ry="38" fill="${fur}"/>
    <!-- Chest fluff -->
    <ellipse cx="50" cy="105" rx="22" ry="26" fill="${fl}" opacity=".85"/>
    <!-- Tail -->
    <path d="M76,125 Q100,95 94,70 Q88,60 80,78 Q88,96 74,116Z" fill="${fur}"/>
    <path d="M80,80 Q92,70 88,60" stroke="${fl}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- Head (bigger/fluffier) -->
    <circle cx="50" cy="56" r="30" fill="${fur}"/>
    <!-- Cheek fluffs -->
    <circle cx="22" cy="62" r="14" fill="${fl}" opacity=".8"/>
    <circle cx="78" cy="62" r="14" fill="${fl}" opacity=".8"/>
    <!-- Ears -->
    <path d="M22,34 L16,8 L34,28Z" fill="${fur}"/>
    <path d="M78,34 L84,8 L66,28Z" fill="${fur}"/>
    <path d="M24,32 L20,12 L32,27Z" fill="#FFB3C1" opacity=".8"/>
    <path d="M76,32 L80,12 L68,27Z" fill="#FFB3C1" opacity=".8"/>
    <!-- Eyes -->
    <ellipse cx="38" cy="50" rx="9" ry="8" fill="white"/>
    <ellipse cx="62" cy="50" rx="9" ry="8" fill="white"/>
    <circle cx="38" cy="51" r="6" fill="#1B5E20"/>
    <circle cx="62" cy="51" r="6" fill="#1B5E20"/>
    <ellipse cx="38" cy="51" rx="3" ry="5.5" fill="#111"/>
    <ellipse cx="62" cy="51" rx="3" ry="5.5" fill="#111"/>
    <circle cx="40" cy="48" r="2" fill="white"/>
    <circle cx="64" cy="48" r="2" fill="white"/>
    <!-- Whiskers -->
    <line x1="24" y1="62" x2="43" y2="64" stroke="#999" stroke-width="1.5"/>
    <line x1="24" y1="66" x2="43" y2="67" stroke="#999" stroke-width="1.5"/>
    <line x1="76" y1="62" x2="57" y2="64" stroke="#999" stroke-width="1.5"/>
    <line x1="76" y1="66" x2="57" y2="67" stroke="#999" stroke-width="1.5"/>
    <!-- Nose -->
    <path d="M47,60 L50,64 L53,60 Z" fill="#FF8FAB"/>
    <path d="M44,66 Q50,72 56,66" stroke="#8B4775" stroke-width="2" fill="none"/>
    <!-- Legs -->
    <rect x="28" y="142" width="16" height="25" rx="8" fill="${fur}"/>
    <rect x="56" y="142" width="16" height="25" rx="8" fill="${fur}"/>
    <ellipse cx="36" cy="168" rx="10" ry="5" fill="${darken(fur,10)}"/>
    <ellipse cx="64" cy="168" rx="10" ry="5" fill="${darken(fur,10)}"/>`;
}

function buildRabbit(ch, big) {
  const fur=ch.fur, fl=ch.furLight, ac=ch.accent;
  const earH = big ? 52 : 44;
  const bodyRx = big ? 26 : 20;
  return `
    <ellipse cx="50" cy="${big?162:158}" rx="${bodyRx}" ry="6" fill="rgba(0,0,0,.1)"/>
    <!-- Body -->
    <ellipse cx="50" cy="${big?118:114}" rx="${bodyRx}" ry="${big?36:28}" fill="${fur}"/>
    <!-- Tail -->
    <circle cx="${big?76:72}" cy="${big?130:122}" r="${big?12:9}" fill="${fl}"/>
    <!-- Head -->
    <circle cx="50" cy="${big?60:56}" r="${big?28:24}" fill="${fur}"/>
    <!-- Long Ears -->
    <ellipse cx="36" cy="${big?60-earH/2:56-earH/2}" rx="10" ry="${earH/2}" fill="${fur}" stroke="${darken(fur,20)}" stroke-width="1.5"/>
    <ellipse cx="64" cy="${big?60-earH/2:56-earH/2}" rx="10" ry="${earH/2}" fill="${fur}" stroke="${darken(fur,20)}" stroke-width="1.5"/>
    <ellipse cx="36" cy="${big?60-earH/2:56-earH/2}" rx="5" ry="${earH/2-4}" fill="${ac}" opacity=".7"/>
    <ellipse cx="64" cy="${big?60-earH/2:56-earH/2}" rx="5" ry="${earH/2-4}" fill="${ac}" opacity=".7"/>
    <!-- Snout -->
    <ellipse cx="50" cy="${big?70:66}" rx="13" ry="9" fill="${fl}" opacity=".7"/>
    <!-- Eyes -->
    <circle cx="38" cy="${big?55:51}" r="${big?8:7}" fill="white"/>
    <circle cx="62" cy="${big?55:51}" r="${big?8:7}" fill="white"/>
    <circle cx="38" cy="${big?56:52}" r="${big?5:4}" fill="#C0392B"/>
    <circle cx="62" cy="${big?56:52}" r="${big?5:4}" fill="#C0392B"/>
    <circle cx="${big?40:39}" cy="${big?54:50}" r="2" fill="white"/>
    <circle cx="${big?64:63}" cy="${big?54:50}" r="2" fill="white"/>
    <!-- Nose -->
    <path d="M47,${big?68:64} L50,${big?72:68} L53,${big?68:64} Z" fill="#C0392B"/>
    <!-- Whiskers -->
    <line x1="28" y1="${big?70:66}" x2="42" y2="${big?72:68}" stroke="${darken(fur,30)}" stroke-width="1.5"/>
    <line x1="28" y1="${big?74:70}" x2="42" y2="${big?74:70}" stroke="${darken(fur,30)}" stroke-width="1.5"/>
    <line x1="72" y1="${big?70:66}" x2="58" y2="${big?72:68}" stroke="${darken(fur,30)}" stroke-width="1.5"/>
    <line x1="72" y1="${big?74:70}" x2="58" y2="${big?74:70}" stroke="${darken(fur,30)}" stroke-width="1.5"/>
    <!-- Legs -->
    <ellipse cx="36" cy="${big?150:144}" rx="${big?14:11}" ry="${big?10:8}" fill="${fur}"/>
    <ellipse cx="64" cy="${big?150:144}" rx="${big?14:11}" ry="${big?10:8}" fill="${fur}"/>
    <ellipse cx="36" cy="${big?160:153}" rx="${big?16:12}" ry="${big?8:6}" fill="${darken(fur,15)}"/>
    <ellipse cx="64" cy="${big?160:153}" rx="${big?16:12}" ry="${big?8:6}" fill="${darken(fur,15)}"/>`;
}

/* ════════════════════════════════════════════════════════
   MAIN EXPORT: build SVG string for a character
════════════════════════════════════════════════════════ */

function buildCharacterSVG(ch) {
  const body = ch.isAnimal ? buildAnimalSVG(ch) : buildHumanSVG(ch);
  return `<g class="char-body">${body}</g>`;
}

/* Build a <g> element ready to be placed in the scene SVG */
function createSceneCharEl(ch, x, y) {
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('class','scene-char just-placed');
  g.setAttribute('data-id', ch.id);
  g.setAttribute('transform', `translate(${x},${y}) scale(${ch.scale})`);
  g.innerHTML = buildCharacterSVG(ch);
  return g;
}

/* Build a tray card (small preview) */
function createTrayCard(ch) {
  const div = document.createElement('div');
  div.className = 'tray-char';
  div.dataset.id = ch.id;
  div.title = ch.name;
  div.innerHTML = `
    <svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      <g transform="scale(${ch.scale*0.9}) translate(${ch.isAnimal?0:0},0)">
        ${buildCharacterSVG(ch)}
      </g>
    </svg>
    <div class="tray-char-name">${ch.label}</div>`;
  return div;
}
