// ══════════════════════════════════════════════════════════
// PHASE 2 — CRÉATION DE MONDE (NARUTO EDITION)
// Éléments enrichis dans l'univers Naruto :
// Lieux, Natures de Chakra, Éléments de Suna, Symboles ninja
// ══════════════════════════════════════════════════════════

// ── Catégories d'éléments Naruto ─────────────────────────
const ELEM_CATEGORIES = [
  {
    label: '⊹ LIEUX LÉGENDAIRES',
    elements: [
      { id: 'suna',       label: '🏜️ Village du Sable',    tag: 'désert'    },
      { id: 'konoha',     label: '🌿 Forêt de Konoha',     tag: 'nature'    },
      { id: 'kiri',       label: '🌫️ Brume de Kiri',       tag: 'mystère'   },
      { id: 'kumo',       label: '⛰️ Pic de Kumo',         tag: 'minéral'   },
      { id: 'iwa',        label: '🪨 Grottes d\'Iwa',      tag: 'pierre'    },
      { id: 'valleedfin', label: '💀 Vallée de la Fin',    tag: 'gouffre'   },
    ]
  },
  {
    label: '⊹ NATURES DE CHAKRA',
    elements: [
      { id: 'katon',      label: '🔥 Katon (Feu)',          tag: 'feu'       },
      { id: 'suiton',     label: '💧 Suiton (Eau)',         tag: 'eau'       },
      { id: 'raiton',     label: '⚡ Raiton (Foudre)',      tag: 'foudre'    },
      { id: 'futon',      label: '🌪️ Futon (Vent)',         tag: 'vent'      },
      { id: 'doton',      label: '🌍 Doton (Terre)',        tag: 'terre'     },
      { id: 'hyoton',     label: '❄️ Hyoton (Glace)',       tag: 'glace'     },
    ]
  },
  {
    label: '⊹ SCEAU & GENJUTSU',
    elements: [
      { id: 'sharingan',  label: '👁️ Sharingan',            tag: 'illusion'  },
      { id: 'tsukuyomi',  label: '🌙 Tsukuyomi',            tag: 'lune'      },
      { id: 'seelance',   label: '⛩️ Sceau Maudit',        tag: 'maudit'    },
      { id: 'bijuu',      label: '🌀 Queue de Bijuu',       tag: 'chaos'     },
      { id: 'chakraor',   label: '✨ Chakra d\'Or',         tag: 'lumière'   },
      { id: 'yin',        label: '☯️ Yin-Yang',             tag: 'équilibre' },
    ]
  },
  {
    label: '⊹ MONDE DE SUNA',
    elements: [
      { id: 'kazekage',   label: '🎭 Trône du Kazekage',   tag: 'pouvoir'   },
      { id: 'arenadup',   label: '⚔️ Arène de l\'Examen',  tag: 'combat'    },
      { id: 'nuit_sable', label: '🌠 Nuit Étoilée Suna',   tag: 'nuit'      },
      { id: 'tempete',    label: '🌩️ Tempête de Sable',    tag: 'vent'      },
      { id: 'oasis',      label: '🌴 Oasis Cachée',        tag: 'eau'       },
      { id: 'gaara_sand', label: '🪄 Sable de Gaara',      tag: 'désert'    },
    ]
  },
];

// Flatten pour usage interne
const ELEMENTS = ELEM_CATEGORIES.flatMap(c => c.elements);

// ── Synergies & opposés (Naruto thème) ───────────────────
const OPPOSITES = {
  feu:       'eau',
  eau:       'feu',
  glace:     'feu',
  lune:      'lumière',
  lumière:   'lune',
  maudit:    'équilibre',
  équilibre: 'maudit',
  chaos:     'équilibre',
};

const SYNERGIES = [
  // Lieux + chakra naturels
  ['désert', 'vent'],    // Suna + Futon
  ['désert', 'feu'],     // Sable chaud + Katon
  ['désert', 'pouvoir'], // Suna + Kazekage
  ['désert', 'nuit'],    // Suna la nuit

  ['nature', 'eau'],     // Konoha + Suiton
  ['nature', 'vent'],    // Forêt + Futon
  ['mystère', 'illusion'], // Brume + Sharingan
  ['mystère', 'lune'],   // Kiri + Tsukuyomi
  ['minéral', 'foudre'], // Kumo + Raiton
  ['pierre', 'terre'],   // Iwa + Doton

  // Genjutsu
  ['illusion', 'lune'],  // Sharingan + Tsukuyomi
  ['illusion', 'chaos'], // Genjutsu + Bijuu
  ['maudit', 'chaos'],   // Sceau maudit + Bijuu

  // Suna spéciales
  ['eau', 'oasis'],  // eau + oasis
  ['pouvoir', 'combat'], // Kazekage + Arène

  // Yin-Yang
  ['équilibre', 'lumière'],
  ['équilibre', 'illusion'],
  ['lumière', 'feu'],
];

// ── Templates de mondes (naruto style) ───────────────────
const WORLD_TEMPLATES = [
  "{a} règne sur ce monde. {b} s'étend à l'horizon. {c} imprègne chaque instant. {d} scelle à jamais cette illusion.",
  "Sous {b}, {a} prend une forme nouvelle. {c} surgit des profondeurs du chakra. {d} complète ce monde illusoire.",
  "{a} et {b} fusionnent dans la toile du genjutsu. {c} ajoute sa nature au tissu de l'illusion. {d} couronne cette création.",
  "Le chakra de {a} se mêle à {b}. {c} vibre dans l'air du genjutsu. {d} en fait un monde que l'ennemi ne peut fuir.",
];

const ELEM_DESCS = {
  suna:       'le Village Caché du Sable',
  konoha:     'la forêt de Konoha',
  kiri:       'la brume de Kiri',
  kumo:       'les pics de Kumo',
  iwa:        'les grottes d\'Iwa',
  valleedfin: 'la Vallée de la Fin',
  katon:      'la nature du feu',
  suiton:     'la nature de l\'eau',
  raiton:     'l\'éclair du Raiton',
  futon:      'le vent du Futon',
  doton:      'la terre du Doton',
  hyoton:     'la glace du Hyoton',
  sharingan:  'l\'œil du Sharingan',
  tsukuyomi:  'le monde lunaire du Tsukuyomi',
  seelance:   'le sceau maudit',
  bijuu:      'la queue du Bijuu',
  chakraor:   'le chakra doré',
  yin:        'l\'équilibre Yin-Yang',
  kazekage:   'le trône du Kazekage',
  arenadup:   'l\'arène des examens chunin',
  nuit_sable: 'la nuit étoilée du désert',
  tempete:    'la tempête de sable',
  oasis:      'l\'oasis cachée',
  gaara_sand: 'le sable de Gaara',
};

let worldSlots = [null, null, null, null];

// ── Init ─────────────────────────────────────────────────
function initMonde() {
  worldSlots = [null, null, null, null];
  renderElemList();
  renderWorldSlots();
  updateWorldPreview();
}

// ── Render helpers ────────────────────────────────────────
function renderElemList() {
  const c = $('elemList');
  c.innerHTML = '';

  ELEM_CATEGORIES.forEach(cat => {
    // Label de catégorie
    const label = document.createElement('div');
    label.className = 'elem-category';
    label.textContent = cat.label;
    c.appendChild(label);

    // Éléments de la catégorie
    cat.elements.forEach(el => {
      const used = worldSlots.includes(el.id);
      const d    = document.createElement('div');
      d.className  = 'elem-tag' + (used ? ' used' : '');
      d.textContent = el.label;
      d.title = el.tag;
      d.onclick = () => addToSlot(el.id);
      c.appendChild(d);
    });
  });
}

function renderWorldSlots() {
  const c = $('worldSlots');
  c.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const id = worldSlots[i];
    const el = id ? ELEMENTS.find(e => e.id === id) : null;
    const d  = document.createElement('div');
    d.className   = 'world-slot' + (el ? ' filled' : '');
    d.textContent = el ? el.label : '+ Ajouter un élément';
    if (el) d.onclick = () => removeSlot(i);
    c.appendChild(d);
  }
  $('slotsFilled').textContent = worldSlots.filter(Boolean).length;
}

// ── Slot actions ──────────────────────────────────────────
function addToSlot(id) {
  if (worldSlots.includes(id)) return;
  const empty = worldSlots.indexOf(null);
  if (empty === -1) return;
  worldSlots[empty] = id;
  renderElemList(); renderWorldSlots(); updateWorldPreview();
}

function removeSlot(i) {
  worldSlots[i] = null;
  renderElemList(); renderWorldSlots(); updateWorldPreview();
}

// ── Cohérence ─────────────────────────────────────────────
function calcCoherence() {
  const filled = worldSlots.filter(Boolean);
  if (filled.length < 2) return 0;
  let score = 50;
  const tags = filled.map(id => ELEMENTS.find(e => e.id === id)?.tag);

  // Opposés → malus
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      if (OPPOSITES[tags[i]] === tags[j] || OPPOSITES[tags[j]] === tags[i]) score -= 22;
    }
  }
  // Synergies → bonus
  SYNERGIES.forEach(([a, b]) => {
    if (tags.includes(a) && tags.includes(b)) score += 14;
  });
  // Bonus Suna special : combinaison complète Suna
  const sunaEls = ['suna', 'kazekage', 'gaara_sand', 'tempete', 'nuit_sable', 'oasis'];
  const sunaCount = filled.filter(id => sunaEls.includes(id)).length;
  if (sunaCount >= 3) score += 20;

  // Bonus genjutsu pur
  const genjEls = ['sharingan', 'tsukuyomi', 'seelance', 'bijuu', 'chakraor', 'yin'];
  const genjCount = filled.filter(id => genjEls.includes(id)).length;
  if (genjCount >= 3) score += 15;

  return Math.max(0, Math.min(100, score + (filled.length * 4)));
}

function updateWorldPreview() {
  const filled = worldSlots.filter(Boolean);
  const coh    = calcCoherence();
  const bar    = $('coherenceFill');

  bar.style.width      = filled.length < 2 ? '0%' : coh + '%';
  bar.style.background = coh < 30 ? 'var(--fail)' : coh < 60 ? 'var(--v1)' : coh < 80 ? 'var(--v2)' : 'var(--mirage)';
  $('coherenceVal').textContent = filled.length < 2 ? '—' : Math.round(coh) + '%';

  if (filled.length < 1) {
    $('worldPreviewText').textContent = 'Choisissez vos éléments pour tisser l\'illusion...';
    $('worldPreviewText').style.color = 'var(--dim)';
    return;
  }

  const tpl   = WORLD_TEMPLATES[filled.length % WORLD_TEMPLATES.length];
  const descs = filled.map(id => ELEM_DESCS[id] || id);
  const txt   = tpl
    .replace('{a}', descs[0] || '…')
    .replace('{b}', descs[1] || '…')
    .replace('{c}', descs[2] || '…')
    .replace('{d}', descs[3] || '…');

  $('worldPreviewText').textContent = txt;
  $('worldPreviewText').style.color = 'var(--text)';

  const hint = $('mondeHint');
  if      (coh >= 80) hint.textContent = "✦ Genjutsu puissant — le sable et le chakra s'unissent !";
  else if (coh >= 60) hint.textContent = "✦ Belle synergie de natures — l'illusion prend forme.";
  else if (coh >= 40) hint.textContent = "Cette illusion manque d'harmonie entre les éléments...";
  else                hint.textContent = "⚠ Ces natures de chakra s'annulent — l'illusion s'effondre !";
}

// ── Validate ──────────────────────────────────────────────
function validerMonde() {
  const filled = worldSlots.filter(Boolean);
  if (filled.length < 2) { alert('Ajoutez au moins 2 éléments !'); return; }
  scores.monde = calcCoherence();
  hideAll(); show('phase-failles'); updateProgress(2); initFailles();
}