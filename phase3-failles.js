// ══════════════════════════════════════════════════════════
// PHASE 3 — LES FAILLES
// Mechanic: read a scene with hidden incoherences, click on wrong words
// ══════════════════════════════════════════════════════════

const SCENES = [
  {
    text: "Le soleil de minuit brillait comme un phare. Kaleb traversa la forêt enneigée sous la chaleur de juillet. Son ombre se projetait dans quatre directions simultanément. Au loin, le château flottait bien ancré dans le sol. Il entendit des voix venant du futur l'appeler par son vrai prénom.",
    failles: [
      { word: "soleil de minuit",        reason: "Le soleil ne brille pas à minuit" },
      { word: "chaleur de juillet",      reason: "Contradictoire avec 'enneigée'" },
      { word: "quatre directions",       reason: "Une ombre ne va que d'un côté" },
      { word: "flottait bien ancré",     reason: "Contradiction : flotter ≠ ancré" },
      { word: "futur",                   reason: "On ne peut entendre des voix du futur" },
    ],
  },
  {
    text: "La rivière coulait vers le haut de la colline en murmurant doucement. Les poissons volaient entre les branches des chênes centenaires. Sur la rive, un vieux pêcheur attendait depuis demain. Sa canne à pêche n'avait aucun fil, pourtant le brochet mordit à l'hameçon invisible. L'eau était parfaitement sèche et transparente.",
    failles: [
      { word: "vers le haut",                reason: "L'eau coule toujours vers le bas" },
      { word: "volaient entre les branches", reason: "Les poissons vivent dans l'eau, pas en vol" },
      { word: "depuis demain",               reason: "On ne peut attendre depuis le futur" },
      { word: "aucun fil",                   reason: "Un hameçon sans fil ne peut accrocher" },
      { word: "parfaitement sèche",          reason: "L'eau ne peut pas être sèche" },
    ],
  },
  {
    text: "La nuit était aussi lumineuse que la nuit. Yuki marchait sans bruit sur des graviers crissants. Son reflet dans le lac la regardait de dos. Elle porta à ses lèvres le verre d'eau solide et but d'un trait. Au bout du chemin, la porte fermée s'ouvrait sur le même couloir.",
    failles: [
      { word: "lumineuse que la nuit",           reason: "Comparaison circulaire sans sens" },
      { word: "sans bruit sur des graviers crissants", reason: "Contradiction : sans bruit mais crissants" },
      { word: "regardait de dos",                reason: "Un reflet reproduit la face, pas le dos" },
      { word: "eau solide",                      reason: "L'eau solide est de la glace, pas buvable" },
      { word: "la porte fermée s'ouvrait",       reason: "Contradiction : fermée mais s'ouvre" },
    ],
  },
];

let fScene      = 0,
    fSelected   = [],
    fFound      = [],
    fTimer      = 60,
    fTimerIv    = null,
    fSceneScore = 0;

// ── Init ─────────────────────────────────────────────────
function initFailles() {
  fScene = 0; fSelected = []; fFound = []; fSceneScore = 0; fTimer = 60;
  $('faillesTimer').style.color = 'var(--cyan)';
  clearInterval(fTimerIv);

  fTimerIv = setInterval(() => {
    fTimer--;
    $('faillesTimer').textContent = fTimer;
    if (fTimer <= 10) $('faillesTimer').style.color = 'var(--fail)';
    if (fTimer <= 0)  { clearInterval(fTimerIv); endFailles(); }
  }, 1000);

  renderScene();
}

// ── Render ────────────────────────────────────────────────
function renderScene() {
  const sc = SCENES[fScene];
  $('sceneNum').textContent = (fScene + 1) + '/' + SCENES.length;
  $('faillesBadges').innerHTML = '';
  $('faillesFound').textContent = '0 failles';
  $('faillesCounter').innerHTML =
    'Failles trouvées : 0 / <span id="faillesMax">' + sc.failles.length + '</span>';
  fSelected = []; fFound = [];

  // Build clickable text — replace failles with spans (longest first)
  let txt = sc.text;
  const sorted = [...sc.failles].sort((a, b) => b.word.length - a.word.length);
  sorted.forEach(f => {
    const origIdx = sc.failles.indexOf(f);
    txt = txt.replace(
      f.word,
      `<span class="faille-word" data-fi="${origIdx}" onclick="clickFaille(${origIdx})">${f.word}</span>`
    );
  });
  $('sceneText').innerHTML = txt;
}

// ── Interaction ───────────────────────────────────────────
function clickFaille(idx) {
  if (fFound.includes(idx)) return;
  const sc   = SCENES[fScene];
  const word = sc.failles[idx].word;
  const span = document.querySelector(`[data-fi="${idx}"]`);
  if (!span) return;

  fFound.push(idx);
  span.classList.add('correct');
  fSceneScore += 20;

  const b = document.createElement('div');
  b.className   = 'faille-badge ok';
  b.textContent = '✓ ' + word.slice(0, 20);
  $('faillesBadges').appendChild(b);

  const max = sc.failles.length;
  $('faillesFound').textContent = fFound.length + ' failles';
  $('faillesCounter').innerHTML =
    'Failles trouvées : ' + fFound.length + ' / <span id="faillesMax">' + max + '</span>';
}

function validerFailles() {
  const sc = SCENES[fScene];
  // Mark unfound as missed
  sc.failles.forEach((f, i) => {
    if (!fFound.includes(i)) {
      const span = document.querySelector(`[data-fi="${i}"]`);
      if (span) span.classList.add('wrong');
      const b = document.createElement('div');
      b.className   = 'faille-badge miss';
      b.textContent = '✕ ' + f.word.slice(0, 20);
      $('faillesBadges').appendChild(b);
    }
  });

  fScene++;
  if (fScene >= SCENES.length) { setTimeout(() => endFailles(), 1200); return; }
  setTimeout(() => renderScene(), 1200);
}

// ── End ───────────────────────────────────────────────────
function endFailles() {
  clearInterval(fTimerIv);
  const total    = SCENES.reduce((a, s) => a + s.failles.length, 0);
  scores.failles = Math.min(100, Math.round(fSceneScore / total * 100 * SCENES.length / 20));
  hideAll(); show('phase-absorption'); updateProgress(3); initAbsorption();
}
