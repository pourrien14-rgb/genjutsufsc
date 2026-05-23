// ══════════════════════════════════════════════════════════
// PHASE 5 — LE RÊVE PARTAGÉ
// Mechanic: memory card game with spirits / dream symbols
// ══════════════════════════════════════════════════════════

const REVE_SYMBOLS = ['🌙', '⭐', '🌀', '🔮', '⛩️', '🦋', '🌸', '👁️'];

let revCards    = [],
    revFlipped  = [],
    revMatched  = [],
    revTries    = 0,
    revTimer    = 90,
    revTimerIv  = null,
    revBlocked  = false;

// ── Init ─────────────────────────────────────────────────
function initReve() {
  revFlipped = []; revMatched = []; revTries = 0;
  revTimer   = 90; revBlocked = false;

  const deck = [...REVE_SYMBOLS, ...REVE_SYMBOLS].sort(() => Math.random() - .5);
  revCards   = deck;

  renderReveGrid();
  $('reveTimer').style.color    = 'var(--cyan)';
  $('revePairs').textContent    = 'Paires : 0 / ' + REVE_SYMBOLS.length;
  $('reveTentatives').textContent = 'Tentatives : 0';
  $('reveFeedback').textContent = '';

  clearInterval(revTimerIv);
  revTimerIv = setInterval(() => {
    revTimer--;
    $('reveTimer').textContent = revTimer;
    if (revTimer <= 20) $('reveTimer').style.color = 'var(--fail)';
    if (revTimer <= 0)  { clearInterval(revTimerIv); endReve(); }
  }, 1000);
}

// ── Render grid ───────────────────────────────────────────
function renderReveGrid() {
  const g = $('reveGrid');
  g.innerHTML = '';
  revCards.forEach((sym, i) => {
    const d = document.createElement('div');
    d.className    = 'reve-card hidden-face';
    d.dataset.idx  = i;
    d.dataset.sym  = sym;
    d.onclick      = () => flipCard(i, d);
    g.appendChild(d);
  });
}

// ── Card flip logic ───────────────────────────────────────
function flipCard(i, el) {
  if (revBlocked)           return;
  if (revFlipped.includes(i)) return;
  if (revMatched.includes(i)) return;

  el.textContent = revCards[i];
  el.classList.add('revealed');
  el.classList.remove('hidden-face');
  revFlipped.push(i);

  if (revFlipped.length === 2) {
    revBlocked = true;
    revTries++;
    $('reveTentatives').textContent = 'Tentatives : ' + revTries;

    const [a, b] = revFlipped;

    if (revCards[a] === revCards[b]) {
      // Match!
      revMatched.push(a, b);
      const cards = document.querySelectorAll('.reve-card');
      cards[a].classList.add('matched');
      cards[b].classList.add('matched');
      $('reveFeedback').textContent = '✦ Paire trouvée !';
      $('reveFeedback').style.color = 'var(--green)';
      $('revePairs').textContent    = 'Paires : ' + (revMatched.length / 2) + ' / ' + REVE_SYMBOLS.length;
      revFlipped  = [];
      revBlocked  = false;

      if (revMatched.length === revCards.length) {
        clearInterval(revTimerIv);
        setTimeout(() => endReve(), 500);
      }
    } else {
      // No match
      $('reveFeedback').textContent = "Ce n'est pas la même âme...";
      $('reveFeedback').style.color = 'var(--fail)';

      setTimeout(() => {
        const cards = document.querySelectorAll('.reve-card');
        [a, b].forEach(idx => {
          cards[idx].classList.add('wrong-pair');
          setTimeout(() => {
            cards[idx].textContent = '';
            cards[idx].classList.remove('revealed', 'wrong-pair');
            cards[idx].classList.add('hidden-face');
          }, 400);
        });
        revFlipped = [];
        revBlocked = false;
        $('reveFeedback').textContent = '';
      }, 700);
    }
  }
}

// ── End ───────────────────────────────────────────────────
function endReve() {
  const matched   = revMatched.length / 2;
  const total     = REVE_SYMBOLS.length;
  const timeBonus = Math.max(0, revTimer) * 0.5;
  scores.reve     = Math.min(100, Math.round(matched / total * 100 + timeBonus));
  clearInterval(revTimerIv);
  setTimeout(() => showResult(), 800);
}
