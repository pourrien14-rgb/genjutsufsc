// ══════════════════════════════════════════════════════════
// PHASE 1 — LA RUPTURE
// Mechanic: hold button to build pressure, release above 75% threshold
// Must succeed 5 times with random illusions showing between rounds
// ══════════════════════════════════════════════════════════

const ILLUSIONS = [
  "Vous êtes dans un pré fleuri. Des papillons dansent. L'air sent la lavande et le miel...",
  "Votre village natal. Les rires des enfants. La fumée des cheminées au coucher du soleil...",
  "Un banquet fastueux. Des saveurs exquises. Des musiciens jouent des mélodies oubliées...",
  "Une forêt ancienne baignée de brume dorée. Chaque arbre murmure des secrets ancestraux...",
  "L'académie ninja jadis. Vos amis autour de vous. Le monde semble parfait et sans danger...",
];

let rHolding = false,
    rPressure = 0,
    rInterval = null,
    rTimer    = 15,
    rTimerIv  = null,
    rSuccess  = 0,
    rFail     = 0,
    rTotal    = 5,
    rRound    = 0;

// ── Init ─────────────────────────────────────────────────
function initRupture() {
  rSuccess = 0; rFail = 0; rRound = 0; rPressure = 0;
  buildRuptProgress();
  nextRuptRound();
}

function buildRuptProgress() {
  const c = $('ruptProgress');
  c.innerHTML = '';
  for (let i = 0; i < rTotal; i++) {
    const d = document.createElement('div');
    d.className = 'rup-dot';
    d.id = 'rd' + i;
    c.appendChild(d);
  }
}

// ── Round lifecycle ───────────────────────────────────────
function nextRuptRound() {
  if (rRound >= rTotal) { endRupture(); return; }

  rPressure = 0; rHolding = false; rTimer = 15;
  $('illusionText').textContent = ILLUSIONS[rRound % ILLUSIONS.length];
  $('ruptFeedback').textContent = '';
  $('ruptFeedback').style.color = 'var(--text)';
  $('pressureFill').style.width = '0%';
  $('pressureNum').textContent  = '0%';
  $('ruptTimer').style.color    = 'var(--cyan)';
  $('ruptTimer').textContent    = '15';

  clearInterval(rTimerIv);
  rTimerIv = setInterval(() => {
    rTimer--;
    $('ruptTimer').textContent = rTimer;
    if (rTimer <= 5)  $('ruptTimer').style.color = 'var(--fail)';
    if (rTimer <= 0)  { clearInterval(rTimerIv); ruptFail(); }
  }, 1000);
}

// ── Hold mechanics ────────────────────────────────────────
function holdStart() {
  if (rHolding) return;
  rHolding = true;
  $('holdBtn').classList.add('held');
  clearInterval(rInterval);

  rInterval = setInterval(() => {
    rPressure = Math.min(100, rPressure + 2.5);
    $('pressureFill').style.width   = rPressure + '%';
    $('pressureNum').textContent    = Math.round(rPressure) + '%';

    const col = rPressure < 50 ? 'var(--v1)' : rPressure < 75 ? 'var(--v2)' : 'var(--cyan)';
    $('pressureFill').style.background = `linear-gradient(90deg,var(--v1),${col})`;

    if (rPressure >= 100) { holdEnd(); ruptSuccess(); }
  }, 50);
}

function holdEnd() {
  if (!rHolding) return;
  rHolding = false;
  $('holdBtn').classList.remove('held');
  clearInterval(rInterval);
  if (rPressure > 0 && rPressure < 100) {
    if (rPressure >= 75) ruptSuccess();
    else ruptFail();
  }
}

// ── Success / Fail ────────────────────────────────────────
function ruptSuccess() {
  clearInterval(rTimerIv); clearInterval(rInterval);
  $('ruptFeedback').textContent  = '✦ Illusion brisée !';
  $('ruptFeedback').style.color  = 'var(--green)';
  const d = $('rd' + rRound); if (d) d.classList.add('ok');
  rSuccess++; rRound++;
  rPressure = 0; $('pressureFill').style.width = '0%';
  setTimeout(() => nextRuptRound(), 900);
}

function ruptFail() {
  clearInterval(rTimerIv); clearInterval(rInterval);
  $('ruptFeedback').textContent  = "✕ L'illusion vous retient !";
  $('ruptFeedback').style.color  = 'var(--fail)';
  const d = $('rd' + rRound); if (d) d.classList.add('fail');
  rFail++; rRound++;
  rPressure = 0; $('pressureFill').style.width = '0%';
  setTimeout(() => nextRuptRound(), 900);
}

// ── End ───────────────────────────────────────────────────
function endRupture() {
  scores.rupture = Math.round(rSuccess / rTotal * 100);
  clearInterval(rTimerIv); clearInterval(rInterval);
  setTimeout(() => {
    hideAll(); show('phase-monde'); updateProgress(1); initMonde();
  }, 800);
}
