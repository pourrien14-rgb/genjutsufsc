// ══════════════════════════════════════════════════════════
// BONUS 2 — LE MIROIR BRISÉ
// Un sceau ninja 5×5 est affiché avec la moitié droite masquée.
// Le joueur doit reconstruire la symétrie en cliquant les bonnes cases.
// 3 patterns progressifs.
// ══════════════════════════════════════════════════════════

const MIROIR_PATTERNS = [
  // 5×5 grid, 0=off 1=on — symétrie horizontale
  [
    [0,1,0,0,0],
    [1,1,1,0,0],
    [0,1,1,0,0],
    [1,1,1,0,0],
    [0,1,0,0,0],
  ],
  [
    [1,0,1,0,0],
    [1,1,0,0,0],
    [0,1,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
  ],
  [
    [0,1,1,0,0],
    [1,0,1,0,0],
    [1,1,0,0,0],
    [1,0,1,0,0],
    [0,1,1,0,0],
  ],
];

// Mirror: col 0↔4, 1↔3, 2 stays
function mirrorPattern(p) {
  return p.map(row => {
    const r = [...row];
    r[3] = r[1]; r[4] = r[0];
    return r;
  });
}

let miroirRound   = 0,
    miroirTotal   = 3,
    miroirGrid    = [],   // 5×5 full solution
    miroirPlayer  = [],   // 5×5 player state (right half only)
    miroirOk      = 0,
    miroirErrors  = 0;

function initBonusMiroir() {
  miroirRound = 0; miroirOk = 0; miroirErrors = 0;
  $('miroir-feedback').textContent = 'Reconstruisez la symétrie du sceau...';
  $('miroir-feedback').style.color = 'var(--dim)';
  $('miroir-score').textContent = '1 / ' + miroirTotal;
  nextMiroirRound();
}

function nextMiroirRound() {
  if (miroirRound >= miroirTotal) { endBonusMiroir(); return; }
  const half = MIROIR_PATTERNS[miroirRound];
  miroirGrid = mirrorPattern(half.map(r => [...r]));
  // Player starts with only the left half visible (cols 0-2),
  // right cols (3,4) are unknown — player clicks to reveal
  miroirPlayer = miroirGrid.map(row => row.map((v, c) => c <= 2 ? v : -1)); // -1 = unknown
  $('miroir-score').textContent = (miroirRound + 1) + ' / ' + miroirTotal;
  $('miroir-errors').textContent = 'Erreurs : 0';
  miroirErrors = 0;
  renderMiroir();
}

function renderMiroir() {
  const c = $('miroir-grid');
  c.innerHTML = '';
  for (let r = 0; r < 5; r++) {
    for (let col = 0; col < 5; col++) {
      const cell = document.createElement('div');
      cell.className = 'miroir-cell';
      const pv = miroirPlayer[r][col];
      if (pv === -1) {
        // Right half — clickable unknown
        cell.classList.add('miroir-unknown');
        cell.dataset.r = r; cell.dataset.c = col;
        cell.onclick = () => miroirClick(r, col);
        cell.textContent = '?';
      } else if (pv === 1) {
        cell.classList.add('miroir-on');
        if (col <= 2) cell.classList.add('miroir-given');
      } else {
        cell.classList.add('miroir-off');
        if (col <= 2) cell.classList.add('miroir-given');
      }
      c.appendChild(cell);
    }
  }
  // Divider col 2→3
  renderMiroirLine();
}

function renderMiroirLine() {
  const g = $('miroir-grid');
  // Add axis indicator via CSS variable
  g.style.setProperty('--axis', '2');
}

function miroirClick(r, col) {
  if (col <= 2) return; // given side
  if (miroirPlayer[r][col] !== -1) return; // already revealed
  const correct = miroirGrid[r][col];
  // Toggle: player says "on" first click
  miroirPlayer[r][col] = 1; // assume player clicks = "on"

  if (correct === 1) {
    // Correct!
    const c = $('miroir-grid');
    const cells = c.querySelectorAll('.miroir-unknown');
    // find and update
    renderMiroir();
    checkMiroirComplete();
  } else {
    // Wrong — this cell should be OFF, player clicked it (="on") which is wrong
    miroirErrors++;
    $('miroir-errors').textContent = 'Erreurs : ' + miroirErrors;
    miroirPlayer[r][col] = 0; // mark as off (wrong answer)
    const idx = r * 5 + col;
    const allCells = $('miroir-grid').children;
    if (allCells[idx]) {
      allCells[idx].classList.add('miroir-wrong-flash');
      setTimeout(() => { if(allCells[idx]) allCells[idx].classList.remove('miroir-wrong-flash'); }, 400);
    }
    renderMiroir();
    checkMiroirComplete();
  }
}

function checkMiroirComplete() {
  // Check if all right-half cells are decided
  const rightCells = [];
  for (let r = 0; r < 5; r++) {
    for (let col = 3; col < 5; col++) {
      rightCells.push({ r, col, pv: miroirPlayer[r][col], sol: miroirGrid[r][col] });
    }
  }
  const allDecided = rightCells.every(x => x.pv !== -1);
  if (!allDecided) return;

  const correct = rightCells.filter(x => x.pv === x.sol).length;
  const total   = rightCells.length;
  if (correct === total) {
    miroirOk++;
    $('miroir-feedback').textContent = '✦ Symétrie parfaite !';
    $('miroir-feedback').style.color = 'var(--green)';
  } else {
    $('miroir-feedback').textContent = `${correct}/${total} cases correctes`;
    $('miroir-feedback').style.color = 'var(--warn)';
  }
  miroirRound++;
  setTimeout(() => nextMiroirRound(), 1200);
}

// Right-half cells where grid=0: player must explicitly "pass" (right-click or double-click = skip)
// Simpler: add a "Valider" button that auto-fills remaining unknowns as 0
function validerMiroir() {
  // Fill remaining unknowns as 0 (player chose not to click = off)
  for (let r = 0; r < 5; r++) {
    for (let col = 3; col < 5; col++) {
      if (miroirPlayer[r][col] === -1) miroirPlayer[r][col] = 0;
    }
  }
  renderMiroir();
  checkMiroirComplete();
}

function endBonusMiroir() {
  bonusScores.miroir = Math.round(miroirOk / miroirTotal * 100);
  $('miroir-feedback').textContent = `Miroir : ${miroirOk}/${miroirTotal} sceau${miroirOk>1?'x':''} reconstruits`;
  $('miroir-feedback').style.color = 'var(--gold)';
  setTimeout(() => {
    hideAll(); show('phase-failles'); updateProgress(2); initFailles();
  }, 1400);
}