// ══════════════════════════════════════════════════════════
// PHASE 2 — CRÉATION DE MONDE
// Mechanic: pick elements into 4 slots, coherence score based on combos
// ══════════════════════════════════════════════════════════

const ELEMENTS = [
  { id: 'feu',       label: '🔥 Feu',       tag: 'chaleur'   },
  { id: 'glace',     label: '❄️ Glace',     tag: 'froid'     },
  { id: 'foret',     label: '🌲 Forêt',     tag: 'nature'    },
  { id: 'desert',    label: '🏜️ Désert',    tag: 'aridité'   },
  { id: 'ocean',     label: '🌊 Océan',     tag: 'eau'       },
  { id: 'montagne',  label: '⛰️ Montagne',  tag: 'minéral'   },
  { id: 'lune',      label: '🌙 Lune',      tag: 'nuit'      },
  { id: 'soleil',    label: '☀️ Soleil',    tag: 'jour'      },
  { id: 'village',   label: '🏘️ Village',   tag: 'humanité'  },
  { id: 'ruines',    label: '🏚️ Ruines',    tag: 'passé'     },
  { id: 'cerisiers', label: '🌸 Cerisiers', tag: 'nature'    },
  { id: 'brume',     label: '🌫️ Brume',     tag: 'mystère'   },
  { id: 'eclair',    label: '⚡ Éclair',    tag: 'tempête'   },
  { id: 'pluie',     label: '🌧️ Pluie',     tag: 'eau'       },
];

const OPPOSITES = {
  feu: 'froid', froid: 'chaleur',
  jour: 'nuit', nuit: 'jour',
  'aridité': 'eau', eau: 'aridité',
};

const SYNERGIES = [
  ['nature', 'eau'], ['nature', 'minéral'], ['mystère', 'nuit'],
  ['nuit', 'humanité'], ['passé', 'mystère'], ['tempête', 'eau'],
  ['tempête', 'nuit'],
];

const WORLD_TEMPLATES = [
  "{a} s'étend à perte de vue. {b} se dessine à l'horizon. {c} emplit l'air de sa présence. {d} couronne ce monde parfait.",
  "Sous {b}, {a} prend vie. {c} ajoute une dimension inattendue. {d} complète cette vision unique.",
  "{a} et {b} coexistent en harmonie. {c} surgit de nulle part. {d} scelle ce monde dans l'éternité.",
];

const ELEM_DESCS = {
  feu: 'des flammes dansantes', glace: 'un froid cristallin',
  foret: 'une forêt ancienne', desert: 'un désert sans fin',
  ocean: 'un océan infini', montagne: 'des montagnes majestueuses',
  lune: 'la lumière de la lune', soleil: 'la chaleur du soleil',
  village: 'un village paisible', ruines: 'des ruines mystérieuses',
  cerisiers: 'des pétales de cerisier', brume: 'une brume mystique',
  eclair: 'des éclairs violents', pluie: 'une pluie douce',
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
  ELEMENTS.forEach(el => {
    const used = worldSlots.includes(el.id);
    const d    = document.createElement('div');
    d.className  = 'elem-tag' + (used ? ' used' : '');
    d.textContent = el.label;
    d.onclick = () => addToSlot(el.id);
    c.appendChild(d);
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

// ── Coherence ─────────────────────────────────────────────
function calcCoherence() {
  const filled = worldSlots.filter(Boolean);
  if (filled.length < 2) return 0;
  let score = 50;
  const tags = filled.map(id => ELEMENTS.find(e => e.id === id)?.tag);

  // Opposites penalty
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      if (OPPOSITES[tags[i]] === tags[j]) score -= 25;
    }
  }
  // Synergy bonus
  SYNERGIES.forEach(([a, b]) => {
    if (tags.includes(a) && tags.includes(b)) score += 15;
  });
  return Math.max(0, Math.min(100, score + (filled.length * 5)));
}

function updateWorldPreview() {
  const filled = worldSlots.filter(Boolean);
  const coh    = calcCoherence();
  const bar    = $('coherenceFill');

  bar.style.width      = filled.length < 2 ? '0%' : coh + '%';
  bar.style.background = coh < 30 ? 'var(--fail)' : coh < 60 ? 'var(--v1)' : 'var(--green)';
  $('coherenceVal').textContent = filled.length < 2 ? '—' : Math.round(coh) + '%';

  if (filled.length < 1) {
    $('worldPreviewText').textContent = 'Ajoutez des éléments pour composer votre monde...';
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

  if      (coh < 30) $('mondeHint').textContent = "⚠ Certains éléments s'annulent mutuellement !";
  else if (coh < 60) $('mondeHint').textContent = "Cette illusion manque de cohérence...";
  else               $('mondeHint').textContent = "✦ Belle synergie entre les éléments !";
}

// ── Validate & End ────────────────────────────────────────
function validerMonde() {
  const filled = worldSlots.filter(Boolean);
  if (filled.length < 2) { alert('Ajoutez au moins 2 éléments !'); return; }
  scores.monde = calcCoherence();
  hideAll(); show('phase-failles'); updateProgress(2); initFailles();
}
