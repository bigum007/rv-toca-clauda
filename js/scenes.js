/* ════════════════════════════════════════════════════════
   SCENE DEFINITIONS — backgrounds, objects, interactions
════════════════════════════════════════════════════════ */

const SCENES = {

  /* ════════════ LIVING ROOM ════════════ */
  'living-room': {
    label: '🛋️ Living Room',
    bgColor: '#FFF3E0',
    build(svg) {
      const W=1100, H=620;
      // Sky through window + walls
      const bg = `
        <!-- Floor -->
        <rect x="0" y="${H-140}" width="${W}" height="140" fill="#D7B483" rx="0"/>
        <!-- Floor boards -->
        ${Array.from({length:8},(_,i)=>`<line x1="0" y1="${H-140+i*18}" x2="${W}" y2="${H-140+i*18}" stroke="#C4A070" stroke-width="1.5" opacity=".5"/>`).join('')}
        ${Array.from({length:11},(_,i)=>`<line x1="${i*110}" y1="${H-140}" x2="${i*110+30}" y2="${H}" stroke="#C4A070" stroke-width="1" opacity=".4"/>`).join('')}
        <!-- Wall -->
        <rect x="0" y="0" width="${W}" height="${H-140}" fill="#FDEFD8"/>
        <!-- Wall dado rail -->
        <rect x="0" y="${H-220}" width="${W}" height="12" fill="#E8C99A" rx="2"/>
        <rect x="0" y="${H-225}" width="${W}" height="5" fill="#D4A870"/>
        <!-- Window left -->
        <rect x="60" y="60" width="200" height="260" rx="14" fill="#B8E4FF"/>
        <rect x="60" y="60" width="200" height="260" rx="14" fill="none" stroke="#C8A870" stroke-width="8"/>
        <!-- Window view - outside sky -->
        <rect x="68" y="68" width="184" height="112" fill="#87CEEB"/>
        <rect x="68" y="180" width="184" height="132" fill="#7BC67A"/>
        <!-- Clouds in window -->
        <ellipse cx="100" cy="95" rx="30" ry="18" fill="white" opacity=".9"/>
        <ellipse cx="115" cy="88" rx="24" ry="15" fill="white" opacity=".9"/>
        <ellipse cx="195" cy="110" rx="28" ry="16" fill="white" opacity=".8"/>
        <!-- Tree in window -->
        <rect x="140" y="220" width="10" height="50" fill="#5D4037"/>
        <circle cx="145" cy="200" r="30" fill="#4CAF50"/>
        <circle cx="130" cy="215" r="22" fill="#66BB6A"/>
        <!-- Window cross bars -->
        <line x1="160" y1="68" x2="160" y2="320" stroke="#C8A870" stroke-width="5"/>
        <line x1="68" y1="190" x2="252" y2="190" stroke="#C8A870" stroke-width="5"/>
        <!-- Curtains -->
        <path d="M60,60 Q52,160 58,320 L92,320 Q80,160 88,60Z" fill="#FF8A65" opacity=".9"/>
        <path d="M260,60 Q268,160 262,320 L228,320 Q240,160 232,60Z" fill="#FF8A65" opacity=".9"/>
        <rect x="52" y="52" width="216" height="18" rx="6" fill="#E64A19"/>

        <!-- Bookshelf right wall -->
        <rect x="${W-240}" y="40" width="200" height="310" rx="8" fill="#795548"/>
        <!-- Shelf boards -->
        ${[100,172,244].map(y=>`
          <rect x="${W-240}" y="${y}" width="200" height="10" rx="3" fill="#5D4037"/>
        `).join('')}
        <!-- Books on shelves -->
        ${buildBooks(W-230, 50, 180, 45)}
        ${buildBooks(W-230, 122, 180, 45)}
        ${buildBooks(W-230, 194, 180, 45)}

        <!-- Ceiling light -->
        <line x1="${W/2}" y1="0" x2="${W/2}" y2="55" stroke="#888" stroke-width="3"/>
        <ellipse cx="${W/2}" cy="52" rx="40" ry="14" fill="#FFF9C4" stroke="#F9A825" stroke-width="3"/>
        <!-- Light glow -->
        <ellipse cx="${W/2}" cy="52" rx="120" ry="60" fill="#FFFDE7" opacity=".25"/>
      `;

      // Objects
      const objs = `
        <!-- Big sofa -->
        <g class="scene-obj" data-obj="sofa" data-msg="Comfy! 🛋️ Sit down and relax~">
          <!-- Back cushion -->
          <rect x="280" y="${H-260}" width="380" height="100" rx="30" fill="#5C6BC0"/>
          <rect x="290" y="${H-255}" width="155" height="88" rx="22" fill="#7986CB"/>
          <rect x="453" y="${H-255}" width="155" height="88" rx="22" fill="#7986CB"/>
          <!-- Armrests -->
          <rect x="258" y="${H-242}" width="50" height="110" rx="22" fill="#5C6BC0"/>
          <rect x="632" y="${H-242}" width="50" height="110" rx="22" fill="#5C6BC0"/>
          <!-- Seat cushions -->
          <rect x="258" y="${H-164}" width="212" height="70" rx="20" fill="#7986CB"/>
          <rect x="470" y="${H-164}" width="212" height="70" rx="22" fill="#7986CB"/>
          <!-- Sofa legs -->
          <rect x="278" y="${H-98}" width="20" height="24" rx="6" fill="#3949AB"/>
          <rect x="642" y="${H-98}" width="20" height="24" rx="6" fill="#3949AB"/>
          <!-- Pillows -->
          <ellipse cx="350" cy="${H-200}" rx="38" ry="28" fill="#EF9A9A" transform="rotate(-15,350,${H-200})"/>
          <ellipse cx="590" cy="${H-200}" rx="38" ry="28" fill="#A5D6A7" transform="rotate(12,590,${H-200})"/>
        </g>

        <!-- Coffee table -->
        <g class="scene-obj" data-obj="table" data-msg="Snack time! 🍎🍵">
          <rect x="330" y="${H-154}" width="280" height="16" rx="8" fill="#8D6E63"/>
          <rect x="340" y="${H-138}" width="260" height="64" rx="10" fill="#A1887F"/>
          <!-- Legs -->
          <rect x="350" y="${H-74}" width="14" height="36" rx="6" fill="#795548"/>
          <rect x="574" y="${H-74}" width="14" height="36" rx="6" fill="#795548"/>
          <!-- Items on table -->
          <!-- Cup of tea -->
          <rect x="390" y="${H-186}" width="24" height="26" rx="6" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="2"/>
          <rect x="390" y="${H-186}" width="24" height="10" rx="4" fill="#4CAF50" opacity=".8"/>
          <path d="M414,${H-176} Q422,${H-176} 422,${H-166} L414,${H-166}" fill="none" stroke="#E0E0E0" stroke-width="2"/>
          <!-- Plate of cookies -->
          <ellipse cx="480" cy="${H-168}" rx="36" ry="8" fill="#FFF9C4"/>
          <circle cx="464" cy="${H-172}" r="10" fill="#D7A665"/>
          <circle cx="480" cy="${H-174}" r="10" fill="#D7A665"/>
          <circle cx="496" cy="${H-172}" r="10" fill="#D7A665"/>
          <!-- Dots on cookies -->
          <circle cx="464" cy="${H-172}" r="3" fill="#795548"/><circle cx="480" cy="${H-174}" r="3" fill="#795548"/>
          <circle cx="496" cy="${H-172}" r="3" fill="#795548"/>
          <!-- Vase with flowers -->
          <rect x="545" y="${H-196}" width="22" height="32" rx="8" fill="#42A5F5"/>
          <path d="M556,${H-196} Q556,${H-222} 548,${H-228}" stroke="#4CAF50" stroke-width="3" fill="none"/>
          <path d="M556,${H-196} Q556,${H-218} 564,${H-224}" stroke="#4CAF50" stroke-width="3" fill="none"/>
          <circle cx="548" cy="${H-228}" r="8" fill="#FF7043"/>
          <circle cx="564" cy="${H-224}" r="8" fill="#FFEB3B"/>
        </g>

        <!-- TV unit -->
        <g class="scene-obj" data-obj="tv" data-msg="📺 Click to change channel!" id="obj-tv">
          <!-- TV stand -->
          <rect x="${W-480}" y="${H-210}" width="200" height="80" rx="10" fill="#455A64"/>
          <!-- TV screen -->
          <rect x="${W-490}" y="${H-320}" width="220" height="140" rx="14" fill="#212121"/>
          <rect x="${W-484}" y="${H-314}" width="208" height="128" rx="10" fill="#1565C0" id="tv-screen"/>
          <!-- TV content -->
          <g id="tv-content">
            <text x="${W-380}" y="${H-252}" text-anchor="middle" font-size="36" font-family="Nunito,sans-serif">🎬</text>
            <text x="${W-380}" y="${H-218}" text-anchor="middle" font-size="12" fill="#B3E5FC" font-family="Nunito,sans-serif">Vondráček TV</text>
          </g>
          <!-- TV buttons -->
          <circle cx="${W-278}" cy="${H-253}" r="6" fill="#F44336"/>
          <circle cx="${W-278}" cy="${H-237}" r="6" fill="#4CAF50"/>
          <!-- Stand legs -->
          <rect x="${W-450}" y="${H-132}" width="14" height="32" rx="6" fill="#37474F"/>
          <rect x="${W-304}" y="${H-132}" width="14" height="32" rx="6" fill="#37474F"/>
        </g>

        <!-- Potted plant (large) -->
        <g class="scene-obj" data-obj="plant" data-msg="Growing strong! 🌿">
          <rect x="840" y="${H-186}" width="60" height="54" rx="14" fill="#FF7043"/>
          <rect x="844" y="${H-178}" width="52" height="46" rx="10" fill="#F4511E" opacity=".5"/>
          <rect x="862" y="${H-238}" width="16" height="58" rx="6" fill="#558B2F"/>
          <!-- Leaves -->
          <ellipse cx="836" cy="${H-256}" rx="28" ry="18" fill="#66BB6A" transform="rotate(-25,836,${H-256})"/>
          <ellipse cx="898" cy="${H-262}" rx="28" ry="18" fill="#4CAF50" transform="rotate(25,898,${H-262})"/>
          <ellipse cx="862" cy="${H-290}" rx="22" ry="30" fill="#81C784"/>
          <ellipse cx="845" cy="${H-308}" rx="18" ry="22" fill="#4CAF50" transform="rotate(-15,845,${H-308})"/>
          <ellipse cx="880" cy="${H-312}" rx="18" ry="22" fill="#66BB6A" transform="rotate(15,880,${H-312})"/>
        </g>

        <!-- Rug on floor -->
        <ellipse cx="${W/2-30}" cy="${H-105}" rx="240" ry="55" fill="#E91E63" opacity=".25"/>
        <ellipse cx="${W/2-30}" cy="${H-105}" rx="200" ry="42" fill="none" stroke="#E91E63" stroke-width="4" opacity=".3"/>
        <ellipse cx="${W/2-30}" cy="${H-105}" rx="150" ry="28" fill="none" stroke="#E91E63" stroke-width="3" opacity=".2"/>
      `;

      setSceneContent(svg, bg, objs);
    }
  },

  /* ════════════ KITCHEN ════════════ */
  'kitchen': {
    label: '🍳 Kitchen',
    bgColor: '#E8F5E9',
    build(svg) {
      const W=1100, H=620;
      const bg = `
        <!-- Tiled floor -->
        <rect x="0" y="${H-140}" width="${W}" height="140" fill="#ECEFF1"/>
        ${Array.from({length:8},(_,i)=>Array.from({length:12},(_,j)=>`
          <rect x="${j*92}" y="${H-140+i*18}" width="91" height="17"
                fill="${(i+j)%2===0?'#F5F5F5':'#E0E0E0'}" stroke="#CFD8DC" stroke-width=".5"/>
        `).join('')).join('')}
        <!-- Wall (mint/light green) -->
        <rect x="0" y="0" width="${W}" height="${H-140}" fill="#E8F5E9"/>
        <!-- Tile backsplash area -->
        <rect x="0" y="${H-360}" width="${W}" height="160" fill="#F1F8E9"/>
        ${Array.from({length:3},(_,i)=>Array.from({length:14},(_,j)=>`
          <rect x="${j*80}" y="${H-360+i*54}" width="78" height="52"
                fill="${(i+j)%2===0?'#DCEDC8':'#C8E6C9'}" stroke="#A5D6A7" stroke-width="1"/>
        `).join('')).join('')}
        <!-- Window above sink -->
        <rect x="420" y="50" width="260" height="200" rx="14" fill="#B8E4FF" stroke="#A5D6A7" stroke-width="6"/>
        <rect x="428" y="58" width="118" height="184" fill="#87CEEB"/>
        <rect x="553" y="58" width="120" height="184" fill="#87CEEB"/>
        <line x1="550" y1="58" x2="550" y2="242" stroke="#A5D6A7" stroke-width="5"/>
        <line x1="428" y1="152" x2="676" y2="152" stroke="#A5D6A7" stroke-width="5"/>
        <!-- Garden outside -->
        <rect x="428" y="160" width="244" height="82" fill="#7BC67A"/>
        <circle cx="500" cy="150" r="28" fill="#66BB6A"/>
        <circle cx="600" cy="148" r="24" fill="#4CAF50"/>
        <!-- Ceiling light bar -->
        <rect x="350" y="8" width="400" height="16" rx="8" fill="#F9A825"/>
        <rect x="350" y="22" width="400" height="8" rx="4" fill="#FFF9C4" opacity=".8"/>
        <ellipse cx="550" cy="14" rx="180" ry="40" fill="#FFFDE7" opacity=".2"/>
      `;

      const objs = `
        <!-- Countertop left -->
        <rect x="0" y="${H-290}" width="350" height="155" rx="0" fill="#78909C"/>
        <rect x="0" y="${H-290}" width="350" height="18" rx="4" fill="#90A4AE"/>

        <!-- Fridge -->
        <g class="scene-obj" data-obj="fridge" data-msg="Yum! 🥕🥛🍎 So many snacks!">
          <rect x="20" y="${H-500}" width="120" height="218" rx="16" fill="#ECEFF1"/>
          <rect x="24" y="${H-498}" width="112" height="108" rx="12" fill="#CFD8DC"/>
          <rect x="24" y="${H-382}" width="112" height="102" rx="12" fill="#CFD8DC"/>
          <!-- Handle -->
          <rect x="118" y="${H-468}" width="10" height="50" rx="5" fill="#90A4AE"/>
          <rect x="118" y="${H-352}" width="10" height="50" rx="5" fill="#90A4AE"/>
          <!-- Fridge items (top window peek) -->
          <text x="80" y="${H-445}" text-anchor="middle" font-size="22">🥛</text>
          <text x="80" y="${H-415}" text-anchor="middle" font-size="18">🧃</text>
          <!-- Fridge door magnets -->
          <circle cx="48" cy="${H-380}" r="10" fill="#FF7043"/><text x="48" y="${H-376}" text-anchor="middle" font-size="12">A</text>
          <circle cx="70" cy="${H-392}" r="8" fill="#FFEB3B"/>
          <circle cx="90" cy="${H-378}" r="10" fill="#66BB6A"/>
          <!-- Sticker from Anetka -->
          <rect x="30" y="${H-448}" width="38" height="32" rx="4" fill="white" opacity=".7"/>
          <text x="49" y="${H-430}" text-anchor="middle" font-size="20">🎨</text>
        </g>

        <!-- Stove / Oven -->
        <g class="scene-obj" data-obj="stove" data-msg="Cooking something delicious! 🍳✨" id="obj-stove">
          <rect x="170" y="${H-440}" width="160" height="155" rx="10" fill="#607D8B"/>
          <!-- Oven door -->
          <rect x="178" y="${H-370}" width="144" height="80" rx="8" fill="#455A64"/>
          <rect x="186" y="${H-362}" width="128" height="64" rx="6" fill="#37474F"/>
          <circle cx="250" cy="${H-330}" r="8" fill="#90A4AE"/>
          <!-- Stovetop -->
          <rect x="170" y="${H-440}" width="160" height="78" rx="10" fill="#546E7A"/>
          <!-- Burners -->
          <circle cx="214" cy="${H-406}" r="22" fill="#37474F"/>
          <circle cx="214" cy="${H-406}" r="16" fill="#455A64"/>
          <circle cx="314" cy="${H-406}" r="22" fill="#37474F"/>
          <circle cx="314" cy="${H-406}" r="16" fill="#455A64"/>
          <!-- Active burner glow -->
          <circle cx="214" cy="${H-406}" r="12" fill="#FF5722" opacity=".7" id="burner-glow"/>
          <!-- Pan on stove -->
          <ellipse cx="214" cy="${H-416}" rx="30" ry="8" fill="#212121"/>
          <rect x="214" y="${H-432}" width="52" height="16" rx="4" fill="#212121" transform="rotate(-20,214,${H-432})"/>
          <!-- Cooking food -->
          <text x="214" y="${H-408}" text-anchor="middle" font-size="16" id="cooking-food">🍳</text>
          <!-- Control knobs -->
          ${[196,234,272,310].map(x=>`
            <circle cx="${x}" cy="${H-295}" r="9" fill="#37474F"/>
            <line x1="${x}" y1="${H-304}" x2="${x}" y2="${H-287}" stroke="#90A4AE" stroke-width="3"/>
          `).join('')}
        </g>

        <!-- Countertop right -->
        <rect x="${W-350}" y="${H-290}" width="350" height="155" rx="0" fill="#78909C"/>
        <rect x="${W-350}" y="${H-290}" width="350" height="18" rx="4" fill="#90A4AE"/>

        <!-- Sink -->
        <g class="scene-obj" data-obj="sink" data-msg="Splish splash! 💧">
          <rect x="${W-320}" y="${H-280}" width="140" height="80" rx="10" fill="#546E7A"/>
          <rect x="${W-308}" y="${H-270}" width="116" height="60" rx="8" fill="#B2EBF2"/>
          <!-- Water / bubbles -->
          ${Array.from({length:5},(_,i)=>`<circle cx="${W-300+i*24}" cy="${H-240}" r="${3+i%2*2}" fill="white" opacity=".7"/>`).join('')}
          <!-- Faucet -->
          <rect x="${W-254}" y="${H-330}" width="8" height="52" rx="4" fill="#90A4AE"/>
          <path d="M${W-250},${H-330} Q${W-230},${H-340} ${W-228},${H-322}" fill="none" stroke="#90A4AE" stroke-width="8" stroke-linecap="round"/>
        </g>

        <!-- Kitchen table center -->
        <g class="scene-obj" data-obj="kitchen-table" data-msg="Gather round! 🍽️ Time to eat together!">
          <!-- Table top -->
          <ellipse cx="${W/2}" cy="${H-175}" rx="200" ry="55" fill="#8D6E63"/>
          <ellipse cx="${W/2}" cy="${H-178}" rx="194" ry="50" fill="#A1887F"/>
          <!-- Table legs -->
          <rect x="${W/2-14}" y="${H-125}" width="28" height="85" rx="12" fill="#6D4C41"/>
          <!-- Chairs -->
          ${[W/2-190, W/2+150].map(x=>`
            <rect x="${x}" y="${H-200}" width="60" height="18" rx="8" fill="#795548"/>
            <rect x="${x+4}" y="${H-182}" width="52" height="46" rx="8" fill="#8D6E63"/>
            <rect x="${x+4}" y="${H-136}" width="14" height="36" rx="6" fill="#6D4C41"/>
            <rect x="${x+38}" y="${H-136}" width="14" height="36" rx="6" fill="#6D4C41"/>
          `).join('')}
          <!-- Food on table -->
          <text x="${W/2-60}" y="${H-188}" font-size="28">🍲</text>
          <text x="${W/2+10}" y="${H-188}" font-size="24">🥗</text>
          <text x="${W/2-20}" y="${H-220}" font-size="18">🍞</text>
          <!-- Plates + cutlery -->
          <circle cx="${W/2-100}" cy="${H-200}" r="20" fill="white" opacity=".9"/>
          <circle cx="${W/2+80}" cy="${H-200}" r="20" fill="white" opacity=".9"/>
        </g>

        <!-- Pet food bowls -->
        <g class="scene-obj" data-obj="pet-bowls" data-msg="Feeding time! 🐾 Puffy, Dart, Líza, Cookie!">
          ${[680, 720, 760, 800].map((x,i)=>`
            <ellipse cx="${x}" cy="${H-148}" rx="22" ry="8" fill="#FF8A65"/>
            <ellipse cx="${x}" cy="${H-150}" rx="20" ry="7" fill="${['#FFCC02','#A5D6A7','#B3E5FC','#F8BBD9'][i]}"/>
            <text x="${x}" y="${H-146}" text-anchor="middle" font-size="11">${['🐕','🐩','😸','🐈'][i]}</text>
          `).join('')}
        </g>

        <!-- Fruit bowl on counter -->
        <g class="scene-obj" data-obj="fruit-bowl" data-msg="Fresh fruit! 🍎🍊🍌 So healthy!">
          <ellipse cx="860" cy="${H-290}" rx="48" ry="14" fill="#8D6E63"/>
          <text x="838" y="${H-296}" font-size="22">🍎</text>
          <text x="860" y="${H-300}" font-size="22">🍊</text>
          <text x="878" y="${H-296}" font-size="22">🍌</text>
        </g>
      `;
      setSceneContent(svg, bg, objs);
    }
  },

  /* ════════════ GARDEN ════════════ */
  'garden': {
    label: '🌸 Garden',
    bgColor: '#E8F5E9',
    build(svg) {
      const W=1100, H=620;
      const bg = `
        <!-- Sky gradient -->
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#B3E5FC"/>
            <stop offset="100%" stop-color="#E1F5FE"/>
          </linearGradient>
          <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#66BB6A"/>
            <stop offset="100%" stop-color="#388E3C"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="${W}" height="${H}" fill="url(#skyGrad)"/>
        <!-- Grass ground -->
        <rect x="0" y="${H-200}" width="${W}" height="200" fill="url(#grassGrad)"/>
        <!-- Grass texture bumps -->
        <path d="M0,${H-200} ${Array.from({length:22},(_,i)=>`Q${i*52+26},${H-215} ${i*52+52},${H-200}`).join(' ')}" fill="#81C784"/>
        <!-- Sun -->
        <circle cx="950" cy="90" r="58" fill="#FFD54F"/>
        ${Array.from({length:12},(_,i)=>{
          const a=(i/12)*Math.PI*2;
          const r1=70, r2=88;
          const x1=950+Math.cos(a)*r1, y1=90+Math.sin(a)*r1;
          const x2=950+Math.cos(a)*r2, y2=90+Math.sin(a)*r2;
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#FFC107" stroke-width="5" stroke-linecap="round"/>`;
        }).join('')}
        <!-- Clouds -->
        <g opacity=".92">
          <ellipse cx="180" cy="100" rx="70" ry="38" fill="white"/>
          <ellipse cx="230" cy="85"  rx="55" ry="34" fill="white"/>
          <ellipse cx="120" cy="105" rx="46" ry="30" fill="white"/>
        </g>
        <g opacity=".88">
          <ellipse cx="620" cy="70" rx="80" ry="40" fill="white"/>
          <ellipse cx="680" cy="55" rx="60" ry="36" fill="white"/>
          <ellipse cx="560" cy="74" rx="50" ry="32" fill="white"/>
        </g>
        <!-- Distant trees -->
        ${[60,160,260,800,900,1020].map((x,i)=>`
          <rect x="${x-6}" y="${H-310+i%2*20}" width="12" height="${60+i%3*20}" fill="#5D4037"/>
          <circle cx="${x}" cy="${H-320+i%2*20}" r="${28+i%2*12}" fill="${['#388E3C','#4CAF50','#66BB6A'][i%3]}"/>
        `).join('')}
      `;

      const objs = `
        <!-- Big oak tree left -->
        <g class="scene-obj" data-obj="oak-tree" data-msg="What a beautiful tree! 🌳🐦">
          <rect x="110" y="${H-360}" width="28" height="180" rx="10" fill="#5D4037"/>
          <!-- Bark lines -->
          <path d="M118,${H-360} Q112,${H-300} 116,${H-200}" stroke="#4E342E" stroke-width="3" fill="none" opacity=".5"/>
          <!-- Tree top layers -->
          <circle cx="124" cy="${H-400}" r="70" fill="#4CAF50"/>
          <circle cx="88"  cy="${H-360}" r="50" fill="#66BB6A"/>
          <circle cx="160" cy="${H-370}" r="50" fill="#388E3C"/>
          <circle cx="124" cy="${H-440}" r="48" fill="#81C784"/>
          <!-- Bird on branch -->
          <text x="170" y="${H-420}" font-size="24">🐦</text>
        </g>

        <!-- Swing set -->
        <g class="scene-obj" data-obj="swing" data-msg="Wheeeee! 🎠 Push me higher!">
          <!-- Frame -->
          <line x1="350" y1="${H-350}" x2="310" y2="${H-160}" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
          <line x1="550" y1="${H-350}" x2="590" y2="${H-160}" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
          <line x1="350" y1="${H-350}" x2="550" y2="${H-350}" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
          <!-- Swing ropes -->
          <line x1="410" y1="${H-340}" x2="420" y2="${H-240}" stroke="#8D6E63" stroke-width="4"/>
          <line x1="490" y1="${H-340}" x2="480" y2="${H-240}" stroke="#8D6E63" stroke-width="4"/>
          <!-- Swing seat -->
          <rect x="414" y="${H-244}" width="72" height="14" rx="7" fill="#FF7043"/>
          <!-- Stars on frame -->
          <text x="435" y="${H-360}" font-size="20">⭐</text>
        </g>

        <!-- Sandbox -->
        <g class="scene-obj" data-obj="sandbox" data-msg="Ríša's sandbox! 🏖️ Build a sandcastle!">
          <rect x="650" y="${H-182}" width="220" height="50" rx="18" fill="#8D6E63"/>
          <rect x="658" y="${H-178}" width="204" height="42" rx="14" fill="#FFD54F"/>
          <!-- Sand toys -->
          <text x="680" y="${H-152}" font-size="24">🪣</text>
          <text x="730" y="${H-148}" font-size="20">🏖️</text>
          <text x="780" y="${H-152}" font-size="22">⭐</text>
          <!-- Sandcastle -->
          <rect x="820" y="${H-198}" width="28" height="22" rx="2" fill="#FFB300"/>
          <path d="M820,${H-198} L826,${H-210} L834,${H-198}Z" fill="#FFA000"/>
          <path d="M826,${H-198} L832,${H-208} L840,${H-198}Z" fill="#FFA000"/>
          <path d="M832,${H-198} L838,${H-210} L848,${H-198}Z" fill="#FFA000"/>
        </g>

        <!-- Flower bed -->
        <g class="scene-obj" data-obj="flowers" data-msg="So pretty! 🌺🌻🌸 Zuzana's flowers!">
          ${[800,830,860,890,920,950].map((x,i)=>`
            <rect x="${x}" y="${H-256+i%2*12}" width="6" height="${26+i%3*8}" rx="3" fill="#558B2F"/>
            <circle cx="${x+3}" cy="${H-260+i%2*12}" r="${12+i%2*4}"
                    fill="${['#FF4081','#FFEB3B','#FF7043','#E91E63','#F48FB1','#FF6F00'][i]}"/>
            ${i%2===0?`<ellipse cx="${x-8}" cy="${H-248+i%2*12}" rx="10" ry="7" fill="#66BB6A" transform="rotate(-30,${x-8},${H-248+i%2*12})"/>`:''}
          `).join('')}
        </g>

        <!-- Dog house -->
        <g class="scene-obj" data-obj="dog-house" data-msg="Puffy's house! 🦊 Wagging tail inside~">
          <!-- House body -->
          <rect x="920" y="${H-280}" width="130" height="110" rx="6" fill="#795548"/>
          <!-- Roof -->
          <path d="M910,${H-280} L985,${H-340} L1060,${H-280}Z" fill="#D32F2F"/>
          <!-- Door -->
          <ellipse cx="985" cy="${H-226}" rx="30" ry="36" fill="#5D4037"/>
          <ellipse cx="985" cy="${H-226}" rx="24" ry="30" fill="#37474F"/>
          <!-- Sign -->
          <rect x="960" y="${H-310}" width="50" height="22" rx="4" fill="#FFF9C4"/>
          <text x="985" y="${H-296}" text-anchor="middle" font-size="12" font-family="Nunito,sans-serif" font-weight="bold">PUFFY</text>
          <!-- Bone outside -->
          <text x="1020" y="${H-190}" font-size="22">🦴</text>
        </g>

        <!-- Bird bath -->
        <g class="scene-obj" data-obj="bird-bath" data-msg="Splash! 🐦💧 Birds love this!">
          <rect x="225" y="${H-180}" width="12" height="80" rx="6" fill="#9E9E9E"/>
          <ellipse cx="231" cy="${H-188}" rx="38" ry="12" fill="#90A4AE"/>
          <ellipse cx="231" cy="${H-192}" rx="32" ry="9" fill="#B2EBF2"/>
          <!-- Birds -->
          <text x="215" y="${H-210}" font-size="18">🐦</text>
          <text x="235" y="${H-200}" font-size="14">🐦</text>
        </g>

        <!-- Trampoline -->
        <g class="scene-obj" data-obj="trampoline" data-msg="Jump! Jump! 🦘 So much fun!">
          <!-- Frame outer -->
          <ellipse cx="480" cy="${H-178}" rx="90" ry="28" fill="#F44336"/>
          <!-- Springs -->
          ${Array.from({length:8},(_,i)=>{
            const a=(i/8)*Math.PI*2;
            const x=480+Math.cos(a)*78, y=(H-178)+Math.sin(a)*24;
            return `<line x1="${x.toFixed(0)}" y1="${y.toFixed(0)}" x2="${(480+Math.cos(a)*58).toFixed(0)}" y2="${((H-178)+Math.sin(a)*16).toFixed(0)}" stroke="#BDBDBD" stroke-width="2"/>`;
          }).join('')}
          <!-- Jump surface -->
          <ellipse cx="480" cy="${H-178}" rx="74" ry="22" fill="#1565C0"/>
          <!-- Stars on surface -->
          <text x="462" y="${H-170}" font-size="16">⭐</text>
          <text x="490" y="${H-174}" font-size="12">✨</text>
          <!-- Legs -->
          <line x1="400" y1="${H-170}" x2="390" y2="${H-130}" stroke="#E53935" stroke-width="8" stroke-linecap="round"/>
          <line x1="560" y1="${H-170}" x2="570" y2="${H-130}" stroke="#E53935" stroke-width="8" stroke-linecap="round"/>
          <line x1="440" y1="${H-195}" x2="434" y2="${H-130}" stroke="#E53935" stroke-width="8" stroke-linecap="round"/>
          <line x1="520" y1="${H-195}" x2="526" y2="${H-130}" stroke="#E53935" stroke-width="8" stroke-linecap="round"/>
        </g>

        <!-- Flowers near path -->
        ${Array.from({length:16},(_,i)=>`
          <circle cx="${200+i*46}" cy="${H-162+Math.sin(i)*10}" r="${5+i%3*2}"
                  fill="${['#FF4081','#FFEB3B','#E91E63','#FF7043'][i%4]}" opacity=".8"/>
          <rect x="${200+i*46}" y="${H-162+Math.sin(i)*10}" width="3" height="14" rx="1.5" fill="#558B2F"/>
        `).join('')}
      `;
      setSceneContent(svg, bg, objs);
    }
  },

  /* ════════════ BEDROOM ════════════ */
  'bedroom': {
    label: '🛏️ Bedroom',
    bgColor: '#F3E5F5',
    build(svg) {
      const W=1100, H=620;
      const bg = `
        <rect x="0" y="${H-140}" width="${W}" height="140" fill="#B39DDB" opacity=".4"/>
        ${Array.from({length:8},(_,i)=>Array.from({length:12},(_,j)=>`
          <rect x="${j*92}" y="${H-140+i*18}" width="91" height="17"
                fill="${(i+j)%2===0?'#EDE7F6':'#E1D5F0'}" stroke="#D1C4E9" stroke-width=".5"/>
        `).join('')).join('')}
        <rect x="0" y="0" width="${W}" height="${H-140}" fill="#F3E5F5"/>
        <!-- Star wallpaper -->
        ${Array.from({length:40},(_,i)=>{
          const x=(i*137)%W, y=(i*89)%(H-180);
          return `<text x="${x}" y="${y}" font-size="${8+i%3*4}" opacity=".15">⭐</text>`;
        }).join('')}
        <!-- Moon wall decal -->
        <text x="520" y="80" font-size="48" opacity=".15" text-anchor="middle">🌙</text>
        <!-- Ceiling fan -->
        <circle cx="${W/2}" cy="24" r="10" fill="#9E9E9E"/>
        <line x1="${W/2}" y1="0" x2="${W/2}" y2="20" stroke="#888" stroke-width="4"/>
        ${[0,90,180,270].map(a=>`
          <rect x="${W/2-50}" y="18" width="50" height="12" rx="6" fill="#BDBDBD" transform="rotate(${a},${W/2},24)" opacity=".8"/>
        `).join('')}
        <!-- Night light glow -->
        <circle cx="80" cy="${H-190}" r="60" fill="#FFF9C4" opacity=".2"/>
      `;
      const objs = `
        <!-- Bed 1 (large, left) - parents/older kids -->
        <g class="scene-obj" data-obj="bed1" data-msg="Sweet dreams! 😴💤 Time for sleep~">
          <!-- Headboard -->
          <rect x="40" y="${H-330}" width="320" height="70" rx="22" fill="#7B1FA2"/>
          <rect x="52" y="${H-324}" width="296" height="56" rx="18" fill="#9C27B0"/>
          <!-- Stars on headboard -->
          ${Array.from({length:6},(_,i)=>`<text x="${75+i*46}" y="${H-285}" font-size="18" opacity=".6">⭐</text>`).join('')}
          <!-- Bed frame -->
          <rect x="30" y="${H-264}" width="340" height="130" rx="12" fill="#6A1B9A"/>
          <!-- Mattress -->
          <rect x="38" y="${H-262}" width="324" height="126" rx="10" fill="#F8BBD9"/>
          <!-- Pillow -->
          <rect x="50" y="${H-255}" width="140" height="60" rx="16" fill="white"/>
          <rect x="60" y="${H-248}" width="120" height="46" rx="12" fill="#F3E5F5"/>
          <rect x="204" y="${H-255}" width="140" height="60" rx="16" fill="white"/>
          <rect x="214" y="${H-248}" width="120" height="46" rx="12" fill="#F3E5F5"/>
          <!-- Blanket -->
          <rect x="38" y="${H-200}" width="324" height="64" rx="10" fill="#CE93D8"/>
          <rect x="38" y="${H-200}" width="324" height="18" rx="8" fill="#BA68C8"/>
          <!-- Foot board -->
          <rect x="30" y="${H-140}" width="340" height="22" rx="10" fill="#6A1B9A"/>
          <!-- Rug -->
          <ellipse cx="200" cy="${H-108}" rx="170" ry="40" fill="#AB47BC" opacity=".3"/>
        </g>

        <!-- Bed 2 (kids bunk - right) -->
        <g class="scene-obj" data-obj="bunk" data-msg="Bunk beds! 🌟 Who's on top?">
          <!-- Bottom bunk -->
          <rect x="${W-380}" y="${H-264}" width="300" height="130" rx="10" fill="#1565C0"/>
          <rect x="${W-372}" y="${H-260}" width="284" height="122" rx="8" fill="#FF8A65"/>
          <rect x="${W-370}" y="${H-256}" width="280" height="72" rx="8" fill="#FFF3E0"/>
          <rect x="${W-362}" y="${H-250}" width="130" height="52" rx="10" fill="white"/>
          <rect x="${W-226}" y="${H-250}" width="130" height="52" rx="10" fill="white"/>
          <rect x="${W-372}" y="${H-190}" width="284" height="48" rx="6" fill="#FFAB40"/>
          <!-- Top bunk -->
          <rect x="${W-386}" y="${H-460}" width="316" height="14" rx="6" fill="#1565C0"/>
          <rect x="${W-380}" y="${H-446}" width="300" height="120" rx="8" fill="#1565C0"/>
          <rect x="${W-372}" y="${H-442}" width="284" height="112" rx="6" fill="#A5D6A7"/>
          <rect x="${W-362}" y="${H-436}" width="130" height="48" rx="10" fill="white"/>
          <rect x="${W-226}" y="${H-436}" width="130" height="48" rx="10" fill="white"/>
          <rect x="${W-372}" y="${H-380}" width="284" height="38" rx="6" fill="#81C784"/>
          <!-- Ladder -->
          <rect x="${W-400}" y="${H-460}" width="14" height="200" rx="6" fill="#5D4037"/>
          ${[0,1,2,3].map(i=>`<rect x="${W-400}" y="${H-420+i*44}" width="14" height="8" rx="3" fill="#8D6E63"/>`).join('')}
          <!-- Guard rail top bunk -->
          <rect x="${W-386}" y="${H-466}" width="180" height="10" rx="5" fill="#1976D2"/>
          <!-- Stars/moon on beds -->
          <text x="${W-300}" y="${H-400}" font-size="22" text-anchor="middle">🌙</text>
          <text x="${W-300}" y="${H-224}" font-size="18" text-anchor="middle">🌟</text>
          <!-- Teddybears -->
          <text x="${W-340}" y="${H-198}" font-size="22">🧸</text>
          <text x="${W-330}" y="${H-386}" font-size="20">🐻</text>
        </g>

        <!-- Wardrobe -->
        <g class="scene-obj" data-obj="wardrobe" data-msg="So many outfits! 👗👕 Getting dressed!">
          <rect x="440" y="${H-460}" width="220" height="330" rx="14" fill="#795548"/>
          <!-- Doors -->
          <rect x="448" y="${H-452}" width="96" height="316" rx="10" fill="#8D6E63"/>
          <rect x="550" y="${H-452}" width="98" height="316" rx="10" fill="#8D6E63"/>
          <line x1="549" y1="${H-452}" x2="549" y2="${H-136}" stroke="#6D4C41" stroke-width="3"/>
          <!-- Handles -->
          <circle cx="534" cy="${H-295}" r="8" fill="#FFD54F"/>
          <circle cx="565" cy="${H-295}" r="8" fill="#FFD54F"/>
          <!-- Mirror on right door -->
          <rect x="558" y="${H-438}" width="78" height="150" rx="6" fill="#B2EBF2" opacity=".7"/>
          <!-- Clothes peek out bottom -->
          <text x="460" y="${H-138}" font-size="18">👗</text>
          <text x="492" y="${H-138}" font-size="18">👕</text>
          <text x="522" y="${H-138}" font-size="18">🧥</text>
        </g>

        <!-- Toy chest -->
        <g class="scene-obj" data-obj="toy-chest" data-msg="Toys! 🎮🧸🎯 Let's play!">
          <rect x="800" y="${H-210}" width="180" height="100" rx="12" fill="#FF7043"/>
          <rect x="800" y="${H-214}" width="180" height="20" rx="10" fill="#FF8A65"/>
          <rect x="810" y="${H-202}" width="160" height="82" rx="8" fill="#FF5722"/>
          <!-- Toys spilling out -->
          <text x="820" y="${H-160}" font-size="22">🎮</text>
          <text x="856" y="${H-156}" font-size="20">🧩</text>
          <text x="892" y="${H-160}" font-size="22">⚽</text>
          <text x="854" y="${H-186}" font-size="18">🎯</text>
          <!-- Lock -->
          <circle cx="890" cy="${H-210}" r="12" fill="#FFC107"/>
          <rect x="886" y="${H-218}" width="8" height="8" rx="2" fill="#FFA000"/>
        </g>

        <!-- Night light -->
        <g class="scene-obj" data-obj="nightlight" data-msg="Night night! 🌙✨ Sweet dreams!">
          <rect x="50" y="${H-222}" width="34" height="44" rx="10" fill="#FFF9C4"/>
          <ellipse cx="67" cy="${H-200}" rx="12" ry="14" fill="#FFD54F"/>
          <ellipse cx="67" cy="${H-200}" rx="8" ry="10" fill="#FFEB3B"/>
          <text x="67" y="${H-196}" text-anchor="middle" font-size="12">🌙</text>
          <!-- Glow -->
          <ellipse cx="67" cy="${H-200}" rx="40" ry="36" fill="#FFF9C4" opacity=".15"/>
        </g>
      `;
      setSceneContent(svg, bg, objs);
    }
  },

  /* ════════════ ART STUDIO ════════════ */
  'art-studio': {
    label: '🎨 Art Studio',
    bgColor: '#FFF8E1',
    build(svg) {
      const W=1100, H=620;
      const bg = `
        <!-- Wooden floor -->
        <rect x="0" y="${H-140}" width="${W}" height="140" fill="#8D6E63"/>
        ${Array.from({length:7},(_,i)=>`<line x1="0" y1="${H-140+i*20}" x2="${W}" y2="${H-140+i*20}" stroke="#6D4C41" stroke-width="2" opacity=".4"/>`).join('')}
        ${Array.from({length:12},(_,i)=>`<line x1="${i*95}" y1="${H-140}" x2="${i*95+20}" y2="${H}" stroke="#6D4C41" stroke-width="1" opacity=".3"/>`).join('')}
        <!-- Warm yellow walls -->
        <rect x="0" y="0" width="${W}" height="${H-140}" fill="#FFF8E1"/>
        <!-- Art on walls (Anetka's drawings inspiration!) -->
        <!-- Drawing 1 - cat sketch -->
        <rect x="80" y="60" width="160" height="200" rx="8" fill="white" stroke="#E0E0E0" stroke-width="3"/>
        <rect x="85" y="65" width="150" height="190" rx="5" fill="#FFFDE7"/>
        <text x="160" y="175" text-anchor="middle" font-size="64">🐱</text>
        <text x="160" y="208" text-anchor="middle" font-size="11" fill="#9E9E9E" font-family="Nunito,sans-serif">by Anetka 🎨</text>
        <!-- Drawing 2 - bunny -->
        <rect x="280" y="40" width="140" height="180" rx="8" fill="white" stroke="#E0E0E0" stroke-width="3"/>
        <rect x="285" y="45" width="130" height="170" rx="5" fill="#FFFDE7"/>
        <text x="350" y="148" text-anchor="middle" font-size="54">🐇</text>
        <!-- Drawing 3 - family -->
        <rect x="460" y="50" width="200" height="160" rx="8" fill="white" stroke="#FFB300" stroke-width="3"/>
        <rect x="466" y="56" width="188" height="148" rx="5" fill="#FFFDE7"/>
        <text x="560" y="146" text-anchor="middle" font-size="52">👨‍👩‍👧‍👦</text>
        <!-- Stars decoration on walls -->
        ${Array.from({length:20},(_,i)=>`
          <text x="${700+i%4*90}" y="${60+Math.floor(i/4)*70}" font-size="${14+i%3*6}" opacity=".2">
            ${['⭐','✨','🌟','💫'][i%4]}
          </text>`).join('')}
        <!-- Big window (north light - artist's light) -->
        <rect x="${W-340}" y="30" width="280" height="280" rx="16" fill="#B3E5FC" stroke="#F9A825" stroke-width="8"/>
        <line x1="${W-200}" y1="38" x2="${W-200}" y2="302" stroke="#F9A825" stroke-width="6"/>
        <line x1="${W-332}" y1="168" x2="${W-68}" y2="168" stroke="#F9A825" stroke-width="6"/>
        <rect x="${W-332}" y="38" width="132" height="130" fill="#87CEEB"/>
        <rect x="${W-194}" y="38" width="126" height="130" fill="#87CEEB"/>
        <rect x="${W-332}" y="175" width="132" height="120" fill="#87CEEB"/>
        <rect x="${W-194}" y="175" width="126" height="120" fill="#87CEEB"/>
        <!-- Outside light effect -->
        <rect x="${W-332}" y="38" width="264" height="260" fill="#E3F2FD" opacity=".5"/>
        <!-- Ceiling track lights -->
        <rect x="100" y="0" width="${W-200}" height="8" rx="4" fill="#757575"/>
        ${[200,380,560,740,920].map(x=>`
          <circle cx="${x}" cy="12" r="8" fill="#FFF9C4"/>
          <ellipse cx="${x}" cy="12" rx="60" ry="40" fill="#FFF9C4" opacity=".12"/>
        `).join('')}
      `;
      const objs = `
        <!-- Easel with canvas -->
        <g class="scene-obj" data-obj="easel" data-msg="Anetka's masterpiece! 🎨🖌️ So talented!">
          <!-- Easel legs -->
          <line x1="520" y1="${H-140}" x2="480" y2="${H-420}" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
          <line x1="580" y1="${H-140}" x2="620" y2="${H-420}" stroke="#5D4037" stroke-width="10" stroke-linecap="round"/>
          <line x1="510" y1="${H-140}" x2="550" y2="${H-240}" stroke="#5D4037" stroke-width="8" stroke-linecap="round"/>
          <!-- Cross support -->
          <line x1="490" y1="${H-280}" x2="610" y2="${H-280}" stroke="#5D4037" stroke-width="6"/>
          <!-- Canvas ledge -->
          <rect x="476" y="${H-422}" width="148" height="12" rx="5" fill="#8D6E63"/>
          <!-- Canvas -->
          <rect x="484" y="${H-530}" width="132" height="110" rx="6" fill="white" stroke="#E0E0E0" stroke-width="2"/>
          <!-- Painting on canvas (colorful abstract) -->
          <rect x="486" y="${H-528}" width="128" height="106" rx="4" fill="#FFF8E1"/>
          <circle cx="530" cy="${H-490}" r="20" fill="#FF7043" opacity=".8"/>
          <circle cx="565" cy="${H-480}" r="16" fill="#FFEB3B" opacity=".8"/>
          <circle cx="548" cy="${H-460}" r="14" fill="#66BB6A" opacity=".8"/>
          <circle cx="516" cy="${H-465}" r="12" fill="#42A5F5" opacity=".8"/>
          <text x="550" y="${H-432}" text-anchor="middle" font-size="10" fill="#888" font-family="Nunito,sans-serif">WIP 🎨</text>
        </g>

        <!-- Big art desk -->
        <g class="scene-obj" data-obj="art-desk" data-msg="So many art supplies! ✏️🖍️ Create something!">
          <rect x="100" y="${H-270}" width="340" height="140" rx="12" fill="#6D4C41"/>
          <rect x="100" y="${H-270}" width="340" height="20" rx="8" fill="#8D6E63"/>
          <!-- Legs -->
          <rect x="110" y="${H-132}" width="16" height="40" rx="6" fill="#5D4037"/>
          <rect x="414" y="${H-132}" width="16" height="40" rx="6" fill="#5D4037"/>
          <!-- Items on desk -->
          <!-- Marker/pencil cup -->
          <rect x="120" y="${H-318}" width="40" height="52" rx="10" fill="#F5F5F5" stroke="#E0E0E0" stroke-width="2"/>
          <text x="124" y="${H-280}" font-size="12">✏️</text>
          <text x="134" y="${H-278}" font-size="12">🖊️</text>
          <text x="144" y="${H-282}" font-size="12">🖍️</text>
          <!-- Open sketchbook -->
          <rect x="174" y="${H-298}" width="160" height="120" rx="6" fill="white" stroke="#E0E0E0" stroke-width="2"/>
          <line x1="254" y1="${H-298}" x2="254" y2="${H-178}" stroke="#CFD8DC" stroke-width="2"/>
          <!-- Sketch on left page -->
          <text x="214" y="${H-236}" text-anchor="middle" font-size="36">🐱</text>
          <!-- Lines on right page -->
          ${Array.from({length:5},(_,i)=>`<line x1="264" y1="${H-285+i*18}" x2="326" y2="${H-285+i*18}" stroke="#E0E0E0" stroke-width="1.5"/>`).join('')}
          <!-- Paint palette -->
          <ellipse cx="370" cy="${H-254}" rx="42" ry="30" fill="#ECEFF1"/>
          ${['#F44336','#FF9800','#FFEB3B','#4CAF50','#2196F3','#9C27B0'].map((c,i)=>`
            <circle cx="${340+i%3*22}" cy="${H-260+Math.floor(i/3)*18}" r="10" fill="${c}"/>
          `).join('')}
          <!-- Paintbrush on palette -->
          <rect x="380" y="${H-296}" width="6" height="50" rx="3" fill="#8D6E63" transform="rotate(25,380,${H-296})"/>
          <ellipse cx="374" cy="${H-298}" rx="5" ry="8" fill="#FF7043" transform="rotate(25,374,${H-298})"/>
        </g>

        <!-- Paint supply shelf -->
        <g class="scene-obj" data-obj="supply-shelf" data-msg="Art supplies! 🎨 Anetka's collection!">
          <rect x="660" y="${H-380}" width="240" height="250" rx="8" fill="#795548"/>
          ${[H-310, H-230, H-150].map(y=>`
            <rect x="660" y="${y}" width="240" height="10" rx="4" fill="#5D4037"/>
          `).join('')}
          <!-- Shelf items -->
          <text x="680" y="${H-325}" font-size="20">🎨</text>
          <text x="720" y="${H-320}" font-size="18">🖌️</text>
          <text x="756" y="${H-324}" font-size="20">✏️</text>
          <text x="792" y="${H-320}" font-size="18">📐</text>
          <text x="828" y="${H-325}" font-size="20">📏</text>
          <!-- Paint tubes -->
          ${['#F44336','#FF9800','#4CAF50','#2196F3','#9C27B0','#E91E63'].map((c,i)=>`
            <rect x="${668+i*36}" y="${H-246}" width="30" height="12" rx="6" fill="${c}"/>
          `).join('')}
          <!-- Awards/ribbons -->
          <text x="686" y="${H-162}" font-size="20">🏆</text>
          <text x="726" y="${H-160}" font-size="20">🥇</text>
          <text x="766" y="${H-162}" font-size="18">⭐</text>
          <text x="802" y="${H-160}" font-size="20">🎖️</text>
        </g>

        <!-- Floor art supplies scattered (fun mess!) -->
        <text x="160" y="${H-148}" font-size="20">🖍️</text>
        <text x="194" y="${H-152}" font-size="16">📄</text>
        <text x="220" y="${H-146}" font-size="18">✂️</text>
        <text x="420" y="${H-148}" font-size="20">🎨</text>
      `;
      setSceneContent(svg, bg, objs);
    }
  },
};

/* ════════════════════════════════════════════════════════
   HELPER — inject content layers into scene SVG
════════════════════════════════════════════════════════ */

function setSceneContent(svg, bgHTML, objsHTML) {
  svg.querySelector('#scene-bg').innerHTML = bgHTML;
  svg.querySelector('#scene-objects').innerHTML = objsHTML;
  svg.querySelector('#scene-characters').innerHTML = '';
  svg.querySelector('#scene-fg').innerHTML = '';
  svg.querySelector('#scene-ui').innerHTML = '';
}

/* ════════════════════════════════════════════════════════
   BOOKS helper (for bookshelf)
════════════════════════════════════════════════════════ */

function buildBooks(x, y, width, height) {
  const colors = ['#F44336','#FF9800','#FFEB3B','#4CAF50','#2196F3','#9C27B0','#E91E63','#00BCD4','#FF5722','#607D8B'];
  let out = '';
  let cx = x;
  while(cx < x + width - 8) {
    const w = 8 + Math.floor(Math.random()*14);
    const col = colors[Math.floor(Math.random()*colors.length)];
    const h2 = height - 4 - Math.floor(Math.random()*14);
    out += `<rect x="${cx}" y="${y+height-h2}" width="${w}" height="${h2}" rx="2" fill="${col}"/>`;
    cx += w + 1;
  }
  return out;
}

// Make buildBooks deterministic (use index instead of random)
(function fixBooks() {
  const _orig = buildBooks;
  let _seed = 0;
  function seededRand() { _seed = (_seed*1664525+1013904223)&0xFFFFFFFF; return (_seed>>>0)/0xFFFFFFFF; }
  window.buildBooks = function(x,y,width,height) {
    const colors = ['#F44336','#FF9800','#FFEB3B','#4CAF50','#2196F3','#9C27B0','#E91E63','#00BCD4','#FF5722','#607D8B'];
    let out='', cx=x; _seed=x*31+y;
    while(cx < x+width-8){
      const w=8+Math.floor(seededRand()*14);
      const col=colors[Math.floor(seededRand()*colors.length)];
      const h2=height-4-Math.floor(seededRand()*14);
      out+=`<rect x="${cx}" y="${y+height-h2}" width="${w}" height="${h2}" rx="2" fill="${col}"/>`;
      cx+=w+1;
    }
    return out;
  };
})();
