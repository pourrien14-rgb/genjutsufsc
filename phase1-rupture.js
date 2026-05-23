// ══════════════════════════════════════════════════════════
// PHASE 1 — LA RUPTURE
// NEW MECHANIC: Moving needle — click when inside the zone
// Zone narrows and needle speeds up each round
// ══════════════════════════════════════════════════════════

const ILLUSIONS = [
  "Vous êtes dans un pré fleuri. Des papillons dansent. L'air sent la lavande et le miel...",
  "Votre village natal. Les rires des enfants. La fumée des cheminées au coucher du soleil...",
  "Un banquet fastueux. Des saveurs exquises. Des musiciens jouent des mélodies oubliées...",
  "Une forêt ancienne baignée de brume dorée. Chaque arbre murmure des secrets ancestraux...",
  "L'académie ninja jadis. Vos amis autour de vous. Le monde semble parfait et sans danger...",
];

// Zone config per round: [minZone%, maxZone%, speed (px/frame ~60fps normalized)]
const ROUND_CONFIGS = [
  { min: 30, max: 70, speed: 0.7 },   // Round 1 — large zone, slow
  { min: 35, max: 65, speed: 1.0 },   // Round 2
  { min: 40, max: 60, speed: 1.35 },  // Round 3
  { min: 43, max: 57, speed: 1.7 },   // Round 4
  { min: 46, max: 54, speed: 2.1 },   // Round 5 — tight zone, fast
];

let rRound    = 0,
    rSuccess  = 0,
    rFail     = 0,
    rTotal    = 5,
    rTimerIv  = null,
    rTimer    = 15,
    needlePos = 0,
    needleDir = 1,
    needleRaf = null,
    lastTs    = null,
    rCanStrike = false,
    rZone     = null;

// ── Init ──────────────────────────────────────────────────
function initRupture() {
  rRound = 0; rSuccess = 0; rFail = 0;
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

  rZone = ROUND_CONFIGS[rRound];
  rTimer = 15; rCanStrike = false;

  // Update UI
  $('illusionText').textContent = ILLUSIONS[rRound % ILLUSIONS.length];
  $('ruptFeedback').textContent = '';
  $('ruptFeedback').style.color = 'var(--text)';
  $('ruptRoundLabel').textContent = `Round ${rRound + 1}/${rTotal}`;
  $('ruptTimer').textContent = `${rTimer}s`;
  $('ruptTimer').style.color = 'var(--v2)';
  $('strikeBtn').disabled = false;
  $('strikeBtn').style.opacity = '1';
  $('timingTrack').classList.remove('in-zone');

  // Set zone position
  const zone = $('timingZone');
  const lm   = $('zoneLeftMarker');
  const rm   = $('zoneRightMarker');
  zone.style.left  = rZone.min + '%';
  zone.style.width = (rZone.max - rZone.min) + '%';
  lm.style.left    = rZone.min + '%';
  rm.style.left    = rZone.max + '%';

  $('zoneMinLabel').textContent = rZone.min + '%';
  $('zoneMaxLabel').textContent = rZone.max + '%';

  // Start needle
  needlePos = Math.random() * 100;
  needleDir = Math.random() < .5 ? 1 : -1;
  lastTs = null;
  if (needleRaf) cancelAnimationFrame(needleRaf);
  needleRaf = requestAnimationFrame(animateNeedle);
  rCanStrike = true;

  // Countdown timer
  clearInterval(rTimerIv);
  rTimerIv = setInterval(() => {
    rTimer--;
    $('ruptTimer').textContent = `${rTimer}s`;
    if (rTimer <= 5) $('ruptTimer').style.color = 'var(--fail)';
    if (rTimer <= 0) {
      clearInterval(rTimerIv);
      timeoutFail();
    }
  }, 1000);
}

// ── Needle animation ─────────────────────────────────────
function animateNeedle(ts) {
  if (!lastTs) lastTs = ts;
  const dt = (ts - lastTs) / 16.67; // normalize to 60fps
  lastTs = ts;

  needlePos += needleDir * rZone.speed * dt;
  if (needlePos >= 100) { needlePos = 100; needleDir = -1; }
  if (needlePos <= 0)   { needlePos = 0;   needleDir = 1;  }

  $('timingNeedle').style.left = needlePos + '%';

  // Highlight track when in zone
  const inZone = needlePos >= rZone.min && needlePos <= rZone.max;
  $('timingTrack').classList.toggle('in-zone', inZone);

  needleRaf = requestAnimationFrame(animateNeedle);
}

// ── Strike action ─────────────────────────────────────────
function strikeNow() {
  if (!rCanStrike) return;
  rCanStrike = false;
  cancelAnimationFrame(needleRaf);
  clearInterval(rTimerIv);
  $('strikeBtn').disabled = true;

  const inZone = needlePos >= rZone.min && needlePos <= rZone.max;
  if (inZone) {
    ruptSuccess();
  } else {
    ruptFail();
  }
}

// ── Also trigger on track click ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('timingTrack');
  if (track) track.addEventListener('click', strikeNow);
});

// ── Success / Fail ────────────────────────────────────────
function ruptSuccess() {
  $('ruptFeedback').textContent = '✦ Illusion brisée !';
  $('ruptFeedback').style.color = 'var(--green)';
  $('strikeBtn').classList.add('success-flash');
  setTimeout(() => $('strikeBtn').classList.remove('success-flash'), 400);
  const d = $('rd' + rRound); if (d) d.classList.add('ok');
  rSuccess++; rRound++;
  setTimeout(() => nextRuptRound(), 1100);
}

function ruptFail() {
  $('ruptFeedback').textContent = "✕ Hors de la zone !";
  $('ruptFeedback').style.color = 'var(--fail)';
  $('strikeBtn').classList.add('fail-flash');
  setTimeout(() => $('strikeBtn').classList.remove('fail-flash'), 400);
  const d = $('rd' + rRound); if (d) d.classList.add('fail');
  rFail++; rRound++;
  setTimeout(() => nextRuptRound(), 1100);
}

function timeoutFail() {
  cancelAnimationFrame(needleRaf);
  rCanStrike = false;
  $('ruptFeedback').textContent = "✕ Trop lent — l'illusion vous retient !";
  $('ruptFeedback').style.color = 'var(--fail)';
  const d = $('rd' + rRound); if (d) d.classList.add('fail');
  rFail++; rRound++;
  setTimeout(() => nextRuptRound(), 1200);
}

// ── End ───────────────────────────────────────────────────
function endRupture() {
  cancelAnimationFrame(needleRaf);
  clearInterval(rTimerIv);
  scores.rupture = Math.round(rSuccess / rTotal * 100);
  setTimeout(() => {
    hideAll(); show('phase-monde'); updateProgress(1); initMonde();
  }, 800);
}

// Stubs expected by resetAll
let rInterval = null;