// ══════════════════════════════════════════════════════════
// PHASE 4 — ABSORPTION
// Mechanic: mémorise la séquence affichée 5 secondes,
// puis elle disparaît et tu dois la reproduire en ordre.
// ══════════════════════════════════════════════════════════

const ORBE_TYPES = [
  { id: 'feu',     icon: '🔥', color: '#ff4422', glow: 'rgba(255,68,34,.4)'   },
  { id: 'eau',     icon: '💧', color: '#22aaff', glow: 'rgba(34,170,255,.4)'  },
  { id: 'vent',    icon: '🌬️', color: '#88ffcc', glow: 'rgba(136,255,204,.4)' },
  { id: 'foudre',  icon: '⚡', color: '#ffdd22', glow: 'rgba(255,221,34,.4)'  },
  { id: 'ombre',   icon: '🌑', color: '#8844ff', glow: 'rgba(136,68,255,.4)'  },
  { id: 'lumiere', icon: '✨', color: '#ffaaff', glow: 'rgba(255,170,255,.4)' },
];

let absRound       = 0,
    absTotal       = 8,
    absLives       = 3,
    absTarget      = [],
    absInput       = [],
    absShowingSeq  = false,
    absCountdownIv = null;

// ── Init ─────────────────────────────────────────────────
function initAbsorption() {
  absRound = 0; absLives = 3; absTarget = []; absInput = [];
  absShowingSeq = false;
  clearInterval(absCountdownIv);
  renderAbsLives();
  nextAbsRound();
}

function renderAbsLives() {
  const c = $('absLives');
  c.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.className = 'life-orbe' + (i >= absLives ? ' lost' : '');
    c.appendChild(d);
  }
}

// ── Round lifecycle ───────────────────────────────────────
function nextAbsRound() {
  if (absRound >= absTotal) { endAbsorption(); return; }

  absInput = [];
  clearInterval(absCountdownIv);

  // Grow sequence each round
  const seqLen = Math.min(2 + Math.floor(absRound / 2), 5);
  if (absTarget.length < seqLen) {
    const pick = ORBE_TYPES[Math.floor(Math.random() * ORBE_TYPES.length)];
    absTarget.push(pick.id);
  }

  $('absScore').textContent    = 'Séquence ' + (absRound + 1) + ' / ' + absTotal;
  $('absFeedback').textContent = 'Mémorisez la séquence...';
  $('absFeedback').style.color = 'var(--dim)';

  // Affiche la séquence cible avec les icônes visibles
  renderTargetSlots(true);
  renderOrbes();

  // Bloque les orbes pendant la mémorisation
  absShowingSeq = true;
  $('orbesZone').style.pointerEvents = 'none';

  // Temps de mémorisation progressif : court au début, plus long ensuite
  // Round 0→2s | Round 2→3s | Round 4→4s | Round 7→5s
  let countdown = Math.round(2 + (absRound / (absTotal - 1)) * 3);
  $('absFeedback').textContent = 'Mémorisez… ' + countdown + 's';
  $('absFeedback').style.color = 'var(--v2)';

  absCountdownIv = setInterval(() => {
    countdown--;
    if (countdown > 0) {
      $('absFeedback').textContent = 'Mémorisez… ' + countdown + 's';
    } else {
      clearInterval(absCountdownIv);
      hideTargetIcons();
    }
  }, 1000);
}

// ── Affiche / masque les icônes de la séquence cible ─────
function renderTargetSlots(showIcons) {
  const ts = $('targetSlots');
  ts.innerHTML = '';
  absTarget.forEach(id => {
    const o = ORBE_TYPES.find(x => x.id === id);
    const d = document.createElement('div');
    d.className   = 'target-slot';
    d.textContent = showIcons ? o.icon : '?';
    d.style.borderColor = o.color;
    d.style.color       = showIcons ? '' : 'var(--dim)';
    ts.appendChild(d);
  });
}

function hideTargetIcons() {
  // Remplace les icônes par "?" — la séquence est cachée
  renderTargetSlots(false);

  // Débloque les orbes : le joueur peut maintenant jouer
  absShowingSeq = false;
  $('orbesZone').style.pointerEvents = '';
  $('absFeedback').textContent = "Reproduisez l'ordre !";
  $('absFeedback').style.color = 'var(--cyan)';
}

// ── Render orbes ─────────────────────────────────────────
function renderOrbes() {
  const c = $('orbesZone');
  c.innerHTML = '';
  const shuffled = [...ORBE_TYPES].sort(() => Math.random() - .5);
  shuffled.forEach(o => {
    const d = document.createElement('div');
    d.className    = 'orbe';
    d.dataset.orbe = o.id;
    d.textContent  = o.icon;
    d.style.background  = o.color + '33';
    d.style.borderColor = o.color;
    d.style.boxShadow   = '0 0 12px ' + o.glow;
    d.onclick = () => absorbOrbe(o.id, d);
    c.appendChild(d);
  });
}

// ── Player input ──────────────────────────────────────────
function absorbOrbe(id, el) {
  if (absShowingSeq) return;

  const expected = absTarget[absInput.length];
  absInput.push(id);

  if (id === expected) {
    // Flash visuel de confirmation
    el.style.transform = 'scale(1.25)';
    el.style.filter    = 'brightness(2)';
    setTimeout(() => { el.style.transform = ''; el.style.filter = ''; }, 250);

    // Révèle le slot correspondant dans la cible
    const slots = $('targetSlots').children;
    if (slots[absInput.length - 1]) {
      const o = ORBE_TYPES.find(x => x.id === id);
      slots[absInput.length - 1].textContent  = o.icon;
      slots[absInput.length - 1].style.color  = '';
      slots[absInput.length - 1].classList.add('filled');
    }

    if (absInput.length === absTarget.length) {
      $('absFeedback').textContent = '✦ Séquence absorbée !';
      $('absFeedback').style.color = 'var(--green)';
      absRound++;
      setTimeout(() => nextAbsRound(), 800);
    }
  } else {
    el.classList.add('wrong-flash');
    setTimeout(() => el.classList.remove('wrong-flash'), 400);
    absLives--;
    renderAbsLives();
    $('absFeedback').textContent = '✕ Mauvais ordre !';
    $('absFeedback').style.color = 'var(--fail)';
    absInput = [];

    if (absLives <= 0) { endAbsorption(); return; }

    // Remet les "?" sur les slots non trouvés
    renderTargetSlots(false);
    setTimeout(() => {
      $('absFeedback').textContent = "Réessayez l'ordre...";
      $('absFeedback').style.color = 'var(--dim)';
    }, 600);
  }
}

// ── End ───────────────────────────────────────────────────
function endAbsorption() {
  clearInterval(absCountdownIv);
  const livesBonus  = absLives * 10;
  scores.absorption = Math.min(100, Math.round(absRound / absTotal * 100) + livesBonus);
  hideAll(); show('phase-reve'); updateProgress(4); initReve();
}
