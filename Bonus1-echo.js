// ══════════════════════════════════════════════════════════
// BONUS 1 — L'ÉCHO DU CHAKRA
// Mechanic : une séquence de pulses (court/long) s'affiche
// visuellement. Le joueur doit la reproduire en tapant.
// Court = tap rapide (<300ms), Long = tap tenu (>300ms).
// 4 rounds, séquence qui s'allonge.
// ══════════════════════════════════════════════════════════

let echoSeq       = [],   // ['S','L','S','L'…]  S=short L=long
    echoInput     = [],
    echoRound     = 0,
    echoTotal     = 4,
    echoPhase     = 'watch',  // 'watch' | 'play' | 'wait'
    echoPressTs   = 0,
    echoOk        = 0,
    echoShowIv    = null,
    echoLocked    = false;

const ECHO_COLORS = { S: '#e8980a', L: '#5fb3a8' };

function initBonusEcho() {
  echoSeq = []; echoInput = []; echoRound = 0; echoOk = 0;
  echoPhase = 'watch'; echoLocked = false;
  $('echo-round').textContent   = '1 / ' + echoTotal;
  $('echo-score').textContent   = '';
  $('echo-feedback').textContent = 'Observez le rythme du chakra...';
  $('echo-feedback').style.color = 'var(--dim)';
  $('echo-btn').disabled = true;
  $('echo-btn').textContent = 'Attendez...';
  $('echo-hint').textContent = 'Court ≤ 0.3s  ·  Long > 0.3s';
  renderEchoBulbs([]);
  setTimeout(() => nextEchoRound(), 600);
}

function nextEchoRound() {
  if (echoRound >= echoTotal) { endBonusEcho(); return; }
  echoInput = []; echoPhase = 'watch'; echoLocked = false;

  // Grow sequence
  const seqLen = 2 + echoRound;
  while (echoSeq.length < seqLen) {
    echoSeq.push(Math.random() < 0.5 ? 'S' : 'L');
  }

  $('echo-round').textContent = (echoRound + 1) + ' / ' + echoTotal;
  $('echo-feedback').textContent = 'Mémorisez...';
  $('echo-feedback').style.color = 'var(--dim)';
  $('echo-btn').disabled = true;
  $('echo-btn').textContent = '⏳ Regardez...';
  renderEchoBulbs([]);

  // Play the sequence visually
  playEchoSequence(() => {
    echoPhase = 'play';
    $('echo-feedback').textContent = 'Reproduisez le rythme !';
    $('echo-feedback').style.color = 'var(--v2)';
    $('echo-btn').disabled = false;
    $('echo-btn').textContent = '⚡ TENIR = LONG   |   TAP = COURT';
    renderEchoBulbs([]);
  });
}

function playEchoSequence(done) {
  const seq = echoSeq;
  let i = 0;
  const bulbs = seq.map(() => null);
  const step = () => {
    if (i >= seq.length) { setTimeout(done, 400); return; }
    const type = seq[i];
    const dur  = type === 'S' ? 200 : 550;
    // Light up bulb i
    const tmp = seq.map((t, idx) => idx < i ? t : null);
    tmp[i] = type;
    renderEchoBulbs(tmp, true);
    setTimeout(() => {
      renderEchoBulbs(seq.map((t, idx) => idx < i ? t : null));
      i++;
      setTimeout(step, 180);
    }, dur);
  };
  step();
}

function renderEchoBulbs(arr, highlight = false) {
  const c = $('echo-bulbs');
  c.innerHTML = '';
  const total = echoSeq.length;
  for (let i = 0; i < total; i++) {
    const b = document.createElement('div');
    b.className = 'echo-bulb';
    const v = arr[i];
    if (v === 'S') {
      b.classList.add('echo-s');
      b.style.background = ECHO_COLORS.S;
      b.style.boxShadow  = `0 0 12px ${ECHO_COLORS.S}`;
      b.textContent = '▪';
    } else if (v === 'L') {
      b.classList.add('echo-l');
      b.style.background = ECHO_COLORS.L;
      b.style.boxShadow  = `0 0 12px ${ECHO_COLORS.L}`;
      b.textContent = '━';
    } else {
      b.classList.add('echo-empty');
    }
    c.appendChild(b);
  }
}

// ── Tap handling ──────────────────────────────────────────
function echoPointerDown(e) {
  e.preventDefault();
  if (echoPhase !== 'play' || echoLocked) return;
  if (echoInput.length >= echoSeq.length) return;
  echoPressTs = Date.now();
  $('echo-btn').classList.add('echo-pressing');
}

function echoPointerUp(e) {
  e.preventDefault();
  if (echoPhase !== 'play' || echoLocked || echoPressTs === 0) return;
  const held = Date.now() - echoPressTs;
  echoPressTs = 0;
  $('echo-btn').classList.remove('echo-pressing');
  const type = held < 300 ? 'S' : 'L';
  echoInput.push(type);

  // Flash feedback
  const flashEl = $('echo-btn');
  flashEl.style.borderColor = type === 'S' ? ECHO_COLORS.S : ECHO_COLORS.L;
  setTimeout(() => flashEl.style.borderColor = '', 300);

  // Reveal
  const show = echoSeq.map((t, i) => i < echoInput.length ? echoInput[i] : null);
  renderEchoBulbs(show);

  // Check wrong immediately
  const idx = echoInput.length - 1;
  if (echoInput[idx] !== echoSeq[idx]) {
    echoLocked = true;
    $('echo-feedback').textContent = '✕ Mauvais rythme !';
    $('echo-feedback').style.color = 'var(--fail)';
    $('echo-btn').disabled = true;
    echoRound++;
    setTimeout(() => nextEchoRound(), 1200);
    return;
  }

  // Complete?
  if (echoInput.length === echoSeq.length) {
    echoOk++;
    echoLocked = true;
    $('echo-feedback').textContent = '✦ Rythme parfait !';
    $('echo-feedback').style.color = 'var(--green)';
    $('echo-btn').disabled = true;
    echoRound++;
    setTimeout(() => nextEchoRound(), 900);
  }
}

function endBonusEcho() {
  bonusScores.echo = Math.round(echoOk / echoTotal * 100);
  $('echo-feedback').textContent = `Écho maîtrisé : ${echoOk}/${echoTotal}`;
  $('echo-feedback').style.color = 'var(--gold)';
  $('echo-btn').style.display = 'none';
  setTimeout(() => {
    hideAll(); show('phase-monde'); updateProgress(1); initMonde();
  }, 1400);
}