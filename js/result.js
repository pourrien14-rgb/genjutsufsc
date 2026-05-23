// ══════════════════════════════════════════════════════════
// RÉSULTAT
// ══════════════════════════════════════════════════════════

const RESULT_DATA = {
  legendary: {
    quality: 'MAÎTRE DU GENJUTSU',
    color:   'var(--gold)',
    symbol:  '⛩️',
    name:    'Grand Maître du Sanctuaire',
    flavor:  '"L\'illusion vous obéit.\nLe réel vous appartient.\nLe Sanctuaire s\'incline devant vous."',
  },
  high: {
    quality: "NINJA DE L'ILLUSION",
    color:   'var(--v2)',
    symbol:  '🌀',
    name:    "Architecte d'Illusions",
    flavor:  '"Vous avez maîtrisé les cinq épreuves.\nL\'art de l\'illusion coule dans vos veines."',
  },
  mid: {
    quality: 'APPRENTI ILLUSIONNISTE',
    color:   'var(--v1)',
    symbol:  '🔮',
    name:    'Tisserand de Rêves',
    flavor:  '"Le chemin est tracé.\nL\'illusion commence à répondre à votre appel."',
  },
  low: {
    quality: 'NOVICE DU SANCTUAIRE',
    color:   '#888',
    symbol:  '👁️',
    name:    'Novice du Voile',
    flavor:  '"Le Sanctuaire vous a vu essayer.\nRevenez quand vous serez prêt."',
  },
};

function getTier(avg) {
  if (avg >= 80) return 'legendary';
  if (avg >= 60) return 'high';
  if (avg >= 40) return 'mid';
  return 'low';
}

function showResult() {
  hideAll();
  $('progressBar').style.display = 'flex';
  for (let i = 0; i < 5; i++) $('ps' + i).className = 'prog-step done';

  const avg  = Math.round(
    (scores.rupture + scores.monde + scores.failles + scores.absorption + scores.reve) / 5
  );
  const tier = getTier(avg);
  const d    = RESULT_DATA[tier];

  $('resSymbol').textContent      = d.symbol;
  $('resQuality').textContent     = d.quality;
  $('resQuality').style.color     = d.color;
  $('resName').textContent        = '— ' + d.name + ' —';
  $('resFlavor').innerHTML        = d.flavor.replace(/\n/g, '<br>');

  // Scores grid
  const sg = $('scoresGrid');
  sg.innerHTML = '';
  [['Rupture', 'rupture'], ['Création', 'monde'], ['Failles', 'failles'],
   ['Absorption', 'absorption'], ['Rêve', 'reve']].forEach(([lbl, k]) => {
    const cell = document.createElement('div');
    cell.className = 'score-cell';
    cell.innerHTML =
      `<div class="score-cell-label">${lbl}</div>` +
      `<div class="score-cell-value" style="color:${scCol(scores[k])}">${scores[k]}%</div>`;
    sg.appendChild(cell);
  });

  $('nameInput').value             = '';
  $('nameRow').style.display       = 'flex';
  $('nameConfirmed').style.display = 'none';
  show('phase-result');
}

function confirmName() {
  const v = $('nameInput').value.trim();
  if (!v) return;
  $('nameRow').style.display       = 'none';
  $('nameConfirmed').textContent   = '⛩ ' + v + ' ⛩';
  $('nameConfirmed').style.display = 'block';
}
