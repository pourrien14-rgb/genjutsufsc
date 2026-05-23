// ══════════════════════════════════════════════════════════
// BONUS 3 — LA CHASSE AUX OMBRES
// Des silhouettes de ninjas apparaissent. Certaines sont
// de "vrais" ninjas (à ignorer), d'autres sont des IMPOSTEURS
// avec un détail visuel différent (couleur, symbole, posture).
// Cliquer les imposteurs = +points. Cliquer un vrai = -vie.
// Les silhouettes disparaissent après 2-3s. 20 vagues.
// ══════════════════════════════════════════════════════════

const NINJA_VARIANTS = [
  { icon:'🥷', label:'Ninja', real:true  },
  { icon:'🧟', label:'Imposteur Mort-Vivant', real:false },
  { icon:'👺', label:'Oni Masqué', real:false },
  { icon:'🐍', label:'Serpent Déguisé', real:false },
  { icon:'🌚', label:'Ombre Corrompue', real:false },
];

let ombreWave     = 0,
    ombreTotal    = 12,
    ombreScore    = 0,
    ombreLives    = 3,
    ombreTimers   = [],  // setTimeout IDs for auto-despawn
    ombreActive   = false,
    ombreSpawnIv  = null;

function initBonusOmbres() {
  ombreWave = 0; ombreScore = 0; ombreLives = 3;
  ombreActive = true;
  ombreTimers.forEach(clearTimeout);
  ombreTimers = [];
  clearInterval(ombreSpawnIv);

  renderOmbreLives();
  $('ombres-score').textContent   = 'Score : 0';
  $('ombres-wave').textContent    = 'Vague 1 / ' + ombreTotal;
  $('ombres-feedback').textContent = 'Les ombres arrivent... frappez les imposteurs !';
  $('ombres-feedback').style.color = 'var(--dim)';
  $('ombres-field').innerHTML     = '';

  // Launch waves
  launchOmbreWave();
}

function renderOmbreLives() {
  const c = $('ombres-lives');
  c.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const d = document.createElement('div');
    d.className = 'ombres-life' + (i >= ombreLives ? ' lost' : '');
    d.textContent = i < ombreLives ? '🌀' : '💀';
    c.appendChild(d);
  }
}

function launchOmbreWave() {
  if (ombreWave >= ombreTotal || !ombreActive) { endBonusOmbres(); return; }
  $('ombres-wave').textContent = 'Vague ' + (ombreWave + 1) + ' / ' + ombreTotal;

  const field   = $('ombres-field');
  const count   = 2 + Math.floor(ombreWave / 3); // 2 → 5 ninjas per wave
  const impostCount = Math.ceil(count / 2.5);     // ~40% imposteurs

  // Pick random positions (grid 4 cols)
  const positions = shuffleArr([0,1,2,3,4,5,6,7].slice(0, count));
  const isImpostor = positions.map((_, i) => i < impostCount);
  const shuffledRole = shuffleArr(isImpostor);

  positions.forEach((pos, i) => {
    const impostor = shuffledRole[i];
    const variant  = impostor
      ? NINJA_VARIANTS[1 + Math.floor(Math.random() * (NINJA_VARIANTS.length - 1))]
      : NINJA_VARIANTS[0];

    const shadow = document.createElement('div');
    shadow.className = 'ombre-ninja' + (impostor ? ' ombre-impostor' : '');
    shadow.dataset.impostor = impostor ? '1' : '0';
    shadow.dataset.alive    = '1';
    shadow.style.gridColumn  = (pos % 4) + 1;
    shadow.style.gridRow     = Math.floor(pos / 4) + 1;
    shadow.textContent = variant.icon;

    // Hint glow for impostors (subtle — they pulse differently)
    if (impostor) {
      shadow.style.animationName = 'ombreImpostorPulse';
    }

    shadow.onclick = () => ombreClick(shadow, impostor);
    field.appendChild(shadow);

    // Auto-despawn
    const lifespan = 2200 - ombreWave * 80; // gets faster
    const t = setTimeout(() => autoDespawn(shadow, impostor), Math.max(lifespan, 900));
    ombreTimers.push(t);
  });

  // Next wave after all despawned
  const waveDelay = Math.max(lifespan_for_wave(ombreWave) + 400, 1200);
  ombreSpawnIv = setTimeout(() => {
    // Clear field
    field.innerHTML = '';
    ombreWave++;
    launchOmbreWave();
  }, Math.max(2600 - ombreWave * 80, 1400));
}

function lifespan_for_wave(w) { return Math.max(2200 - w * 80, 900); }

function ombreClick(el, isImpostor) {
  if (el.dataset.alive !== '1') return;
  el.dataset.alive = '0';
  el.style.pointerEvents = 'none';

  if (isImpostor) {
    ombreScore++;
    $('ombres-score').textContent = 'Score : ' + ombreScore;
    el.classList.add('ombre-caught');
    $('ombres-feedback').textContent = '✦ Imposteur éliminé !';
    $('ombres-feedback').style.color = 'var(--green)';
    setTimeout(() => el.remove(), 350);
  } else {
    // Hit a real ninja
    ombreLives--;
    renderOmbreLives();
    el.classList.add('ombre-wronghit');
    $('ombres-feedback').textContent = '✕ C\'était un vrai ninja !';
    $('ombres-feedback').style.color = 'var(--fail)';
    setTimeout(() => el.remove(), 350);
    if (ombreLives <= 0) {
      ombreActive = false;
      clearInterval(ombreSpawnIv);
      setTimeout(() => endBonusOmbres(), 600);
    }
  }
}

function autoDespawn(el, wasImpostor) {
  if (el.dataset.alive !== '1') return;
  el.dataset.alive = '0';
  el.style.pointerEvents = 'none';
  if (wasImpostor) {
    // Missed an impostor — minor penalty indicator
    el.classList.add('ombre-escaped');
    $('ombres-feedback').textContent = 'Un imposteur s\'est échappé...';
    $('ombres-feedback').style.color = 'var(--warn)';
  }
  setTimeout(() => el.remove(), 300);
}

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function endBonusOmbres() {
  ombreActive = false;
  clearInterval(ombreSpawnIv);
  ombreTimers.forEach(clearTimeout);
  // Max score = ombreTotal * ~2 imposteurs/vague
  const maxScore = Math.ceil(ombreTotal * 1.5);
  bonusScores.ombres = Math.min(100, Math.round(ombreScore / maxScore * 100));
  $('ombres-feedback').textContent = `Chasse terminée : ${ombreScore} imposteur${ombreScore>1?'s':''} éliminé${ombreScore>1?'s':''}`;
  $('ombres-feedback').style.color = 'var(--gold)';
  setTimeout(() => {
    hideAll(); show('phase-absorption'); updateProgress(3); initAbsorption();
  }, 1400);
}