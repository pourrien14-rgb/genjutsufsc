// ══════════════════════════════════════════════════════════
// PARTICLES — CULTE DU SOLEIL / SUNA
// ══════════════════════════════════════════════════════════
(function () {
  const c = document.getElementById('spirits');
  const sandCols = ['#c8a050', '#d4a017', '#a07030', '#e8b860', '#b88840', '#8c6030'];
  for (let i = 0; i < 60; i++) {
    const s = document.createElement('div');
    s.className = 'spirit';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (5 + Math.random() * 12) + 's';
    s.style.animationDelay = (-Math.random() * 15) + 's';
    s.style.setProperty('--drift', (Math.random() * 160 - 80) + 'px');
    const w = 1 + Math.random() * 2.5;
    const h = 1 + Math.random() * 1.5;
    s.style.width  = w + 'px';
    s.style.height = h + 'px';
    s.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
    const col = sandCols[Math.floor(Math.random() * sandCols.length)];
    s.style.background = col;
    s.style.boxShadow  = `0 0 ${w*1.5}px ${col}`;
    c.appendChild(s);
  }
})();

// ══════════════════════════════════════════════════════════
// GLOBAL STATE
// ══════════════════════════════════════════════════════════
const scores = { rupture: 0, monde: 0, failles: 0, absorption: 0, reve: 0 };
const bonusScores = { echo: 0, miroir: 0, ombres: 0, fil: 0, oeil: 0 };

const ALL = [
  'menu','rupture','monde','failles','absorption','reve','result',
  'bonus-echo','bonus-miroir','bonus-ombres','bonus-fil','bonus-oeil'
];

let _runningAll = false;

// ══════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════
const $ = id => document.getElementById(id);
function show(id)  { const e = $(id); if (e) e.style.display = 'block'; }
function hide(id)  { const e = $(id); if (e) e.style.display = 'none'; }
function hideAll() { ALL.forEach(s => hide('phase-' + s)); }
function scCol(s)  { return s >= 80 ? '#d4a017' : s >= 60 ? '#e8980a' : s >= 40 ? '#c85a00' : '#555'; }

function updateProgress(active) {
  $('progressBar').style.display = 'flex';
  for (let i = 0; i < 5; i++) {
    const el = $('ps' + i);
    el.className = 'prog-step';
    if (i < active)        el.classList.add('done');
    else if (i === active) el.classList.add('active');
  }
}

// ══════════════════════════════════════════════════════════
// FLOW — phases + bonus intercalés
// ══════════════════════════════════════════════════════════
function startAll() {
  _runningAll = true;
  hideAll();
  show('phase-rupture');
  updateProgress(0);
  initRupture();
}

const PHASE_LAUNCHERS = [
  () => { _runningAll=false; show('phase-rupture');    updateProgress(0); initRupture();    },
  () => { _runningAll=false; show('phase-monde');      updateProgress(1); initMonde();      },
  () => { _runningAll=false; show('phase-failles');    updateProgress(2); initFailles();    },
  () => { _runningAll=false; show('phase-absorption'); updateProgress(3); initAbsorption(); },
  () => { _runningAll=false; show('phase-reve');       updateProgress(4); initReve();       },
];

function startPhase(index) {
  hideAll();
  $('progressBar').style.display = 'flex';
  PHASE_LAUNCHERS[index]();
}

function afterRupture() {
  if (_runningAll) { hideAll(); show('phase-bonus-echo');   initBonusEcho();   }
  else             { hideAll(); show('phase-monde');      updateProgress(1); initMonde(); }
}
function afterMonde() {
  if (_runningAll) { hideAll(); show('phase-bonus-miroir'); initBonusMiroir(); }
  else             { hideAll(); show('phase-failles');    updateProgress(2); initFailles(); }
}
function afterFailles() {
  if (_runningAll) { hideAll(); show('phase-bonus-ombres'); initBonusOmbres(); }
  else             { hideAll(); show('phase-absorption'); updateProgress(3); initAbsorption(); }
}
function afterAbsorption() {
  if (_runningAll) { hideAll(); show('phase-bonus-fil');    initBonusFil();    }
  else             { hideAll(); show('phase-reve');       updateProgress(4); initReve(); }
}
function afterReve() {
  if (_runningAll) { hideAll(); show('phase-bonus-oeil');   initBonusOeil();   }
  else             { showResult(); }
}

// ══════════════════════════════════════════════════════════
// RESET
// ══════════════════════════════════════════════════════════
function resetAll() {
  [fTimerIv, rTimerIv, rInterval, revTimerIv].forEach(iv => clearInterval(iv));
  Object.keys(scores).forEach(k => scores[k] = 0);
  Object.keys(bonusScores).forEach(k => bonusScores[k] = 0);
  _runningAll = false;
  hideAll();
  $('progressBar').style.display = 'none';
  show('phase-menu');
}