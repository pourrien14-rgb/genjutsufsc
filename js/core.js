// ══════════════════════════════════════════════════════════
// PARTICLES
// ══════════════════════════════════════════════════════════
(function () {
  const c = document.getElementById('spirits');
  const cols = ['#7b2fff', '#00e5ff', '#ff6de0', '#b04fff', '#ffd700', '#00ff88'];
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('div');
    s.className = 'spirit';
    s.style.left = Math.random() * 100 + '%';
    s.style.animationDuration = (4 + Math.random() * 9) + 's';
    s.style.animationDelay = (-Math.random() * 12) + 's';
    s.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
    const sz = 1 + Math.random() * 3;
    s.style.width = s.style.height = sz + 'px';
    s.style.background = cols[Math.floor(Math.random() * cols.length)];
    c.appendChild(s);
  }
})();

// ══════════════════════════════════════════════════════════
// GLOBAL STATE
// ══════════════════════════════════════════════════════════
const scores = { rupture: 0, monde: 0, failles: 0, absorption: 0, reve: 0 };
const ALL = ['menu', 'rupture', 'monde', 'failles', 'absorption', 'reve', 'result'];

// ══════════════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════════════
const $ = id => document.getElementById(id);

function show(id)    { const e = $(id); if (e) e.style.display = 'block'; }
function hide(id)    { const e = $(id); if (e) e.style.display = 'none'; }
function hideAll()   { ALL.forEach(s => hide('phase-' + s)); }

function scCol(s) {
  return s >= 80 ? '#ffd700' : s >= 60 ? '#b04fff' : s >= 40 ? '#7b2fff' : '#888';
}

function updateProgress(active) {
  $('progressBar').style.display = 'flex';
  for (let i = 0; i < 5; i++) {
    const el = $('ps' + i);
    el.className = 'prog-step';
    if (i < active)        el.classList.add('done');
    else if (i === active) el.classList.add('active');
  }
}

// Lancer toutes les épreuves dans l'ordre
function startAll() {
  hideAll();
  show('phase-rupture');
  updateProgress(0);
  initRupture();
}

// Lancer une épreuve spécifique directement depuis le menu (0-4)
const PHASE_LAUNCHERS = [
  () => { show('phase-rupture');    updateProgress(0); initRupture();    },
  () => { show('phase-monde');      updateProgress(1); initMonde();      },
  () => { show('phase-failles');    updateProgress(2); initFailles();    },
  () => { show('phase-absorption'); updateProgress(3); initAbsorption(); },
  () => { show('phase-reve');       updateProgress(4); initReve();       },
];

function startPhase(index) {
  hideAll();
  $('progressBar').style.display = 'flex';
  PHASE_LAUNCHERS[index]();
}

// ══════════════════════════════════════════════════════════
// RESET
// ══════════════════════════════════════════════════════════
function resetAll() {
  clearInterval(fTimerIv);
  clearInterval(rTimerIv);
  clearInterval(rInterval);
  clearInterval(revTimerIv);
  document.removeEventListener('keydown', () => {});
  Object.keys(scores).forEach(k => scores[k] = 0);
  hideAll();
  $('progressBar').style.display = 'none';
  show('phase-menu');
}
