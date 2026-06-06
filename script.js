/* ============================================
   TypeBlitz — Game Logic
   ============================================ */

// --- Text Banks by Difficulty ---
const TEXT_BANK = {
  easy: [
    "The cat sat on the mat and looked at the dog with big brown eyes.",
    "I like to eat pizza and drink lemonade on hot summer days.",
    "She went to the park and played with her friends until sunset.",
    "The sun is warm and the birds sing in the tall green trees.",
    "He read a good book and then took a long nap after lunch.",
    "My dog runs fast and loves to play fetch in the yard all day.",
    "We went to the beach and built a sand castle near the water.",
    "The rain fell softly on the roof while we stayed inside and drank tea.",
    "A red ball rolled down the hill and into the pond with a splash.",
    "The old man sat on the bench and watched the children play in the park."
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog near the riverbank at dawn.",
    "Programming requires patience and dedication to master the fundamental concepts properly.",
    "Technology continues to evolve at a rapid pace, transforming how we live and work.",
    "The mountain trail was steep and winding, but the view from the top was breathtaking.",
    "Learning a new language opens doors to different cultures and perspectives around the world.",
    "The scientist carefully analyzed the data before drawing any meaningful conclusions from it.",
    "A balanced diet combined with regular exercise is essential for maintaining good health.",
    "The orchestra performed a beautiful symphony that captivated the entire audience for hours.",
    "Climate change presents significant challenges that require global cooperation to effectively address.",
    "The library contained thousands of books covering every topic imaginable from art to zoology."
  ],
  hard: [
    "Sophisticated algorithms power modern artificial intelligence systems, enabling unprecedented capabilities in natural language processing and computer vision.",
    "The juxtaposition of quantum mechanics and general relativity presents one of the most profound puzzles in contemporary theoretical physics.",
    "Entrepreneurial ventures require meticulous planning, unwavering perseverance, and the ability to adapt swiftly to rapidly changing market conditions.",
    "Cryptographic protocols ensure the confidentiality, integrity, and authenticity of digital communications across interconnected networks worldwide.",
    "The archaeological excavation uncovered extraordinary artifacts that significantly altered our understanding of ancient Mediterranean civilizations.",
    "Philosophical discourse on consciousness explores the enigmatic relationship between subjective experience and objective neurological processes.",
    "Biodiversity conservation necessitates comprehensive strategies that balance ecological preservation with sustainable economic development goals.",
    "The Renaissance period witnessed an extraordinary flourishing of artistic, scientific, and intellectual achievement that transformed European civilization."
  ],
  expert: [
    "const fibonacci = (n) => n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 2); console.log(fibonacci(10));",
    "SELECT u.name, COUNT(o.id) AS order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.name HAVING COUNT(o.id) > 5;",
    "The implementation of concurrent garbage collection algorithms in managed runtime environments requires careful synchronization between mutator threads and collector phases.",
    "docker run -d --name postgres-db -e POSTGRES_PASSWORD=secret -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:15-alpine",
    "#!/bin/bash\nfor file in $(find . -name '*.log' -mtime +30); do gzip \"$file\" && echo \"Compressed: $file\"; done",
    "Microservices architecture leverages containerization, service mesh infrastructure, and event-driven communication patterns to achieve horizontal scalability and fault isolation.",
    "The asymptotic complexity of Dijkstra's shortest-path algorithm with a Fibonacci heap is O(V log V + E), significantly outperforming naive implementations for sparse graphs.",
    "export default function middleware(req: NextRequest) { const token = req.cookies.get('auth-token')?.value; if (!token) return NextResponse.redirect(new URL('/login', req.url)); }"
  ]
};

// --- Speed Levels ---
const SPEED_LEVELS = [
  { min: 0, max: 20, label: 'Beginner', icon: '🐢', color: '#64748b' },
  { min: 20, max: 40, label: 'Average', icon: '🚶', color: '#3b82f6' },
  { min: 40, max: 60, label: 'Fast', icon: '🏃', color: '#8b5cf6' },
  { min: 60, max: 80, label: 'Pro', icon: '⚡', color: '#f59e0b' },
  { min: 80, max: 100, label: 'Speed Demon', icon: '🔥', color: '#ef4444' },
  { min: 100, max: Infinity, label: 'Legend', icon: '👑', color: '#ec4899' }
];

// --- Game State ---
let state = {
  difficulty: 'easy',
  currentText: '',
  charIndex: 0,
  isStarted: false,
  isFinished: false,
  startTime: null,
  timerInterval: null,
  errors: 0,
  totalTyped: 0,
  correctChars: 0,
  wpmHistory: [],
  wpmSampleInterval: null,
  bestWpm: parseInt(localStorage.getItem('typeblitz_best_wpm') || '0'),
  totalTests: parseInt(localStorage.getItem('typeblitz_total_tests') || '0')
};

// --- DOM Elements ---
const $ = (sel) => document.getElementById(sel);

const dom = {
  textDisplay: $('textDisplay'),
  typeInput: $('typeInput'),
  timerDisplay: $('timerDisplay'),
  wpmDisplay: $('wpmDisplay'),
  accuracyDisplay: $('accuracyDisplay'),
  scoreDisplay: $('scoreDisplay'),
  levelBadge: $('levelBadge'),
  levelIcon: $('levelIcon'),
  levelText: $('levelText'),
  timerRingFill: $('timerRingFill'),
  bestWpmValue: $('bestWpmValue'),
  totalTestsValue: $('totalTestsValue'),
  resultsPanel: $('resultsPanel'),
  typingZone: $('typingZone'),
  resultWpm: $('resultWpm'),
  resultAccuracy: $('resultAccuracy'),
  resultTime: $('resultTime'),
  resultScore: $('resultScore'),
  resultChars: $('resultChars'),
  resultErrors: $('resultErrors'),
  resultsLevelIcon: $('resultsLevelIcon'),
  resultsLevelText: $('resultsLevelText'),
  wpmChart: $('wpmChart'),
  difficultySelector: $('difficultySelector'),
  diffSlider: $('diffSlider'),
  statsBar: $('statsBar'),
  wpmCard: $('wpmCard'),
  typingHint: $('typingHint')
};

// --- Initialize ---
function init() {
  createParticles();
  updateHeaderStats();
  loadNewText();
  bindEvents();
}

// --- Background Particles ---
function createParticles() {
  const container = document.getElementById('bgParticles');
  const colors = ['rgba(124, 58, 237, 0.15)', 'rgba(168, 85, 247, 0.1)', 'rgba(192, 132, 252, 0.08)', 'rgba(59, 130, 246, 0.1)'];

  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(particle);
  }
}

// --- Header Stats ---
function updateHeaderStats() {
  dom.bestWpmValue.textContent = state.bestWpm > 0 ? state.bestWpm : '—';
  dom.totalTestsValue.textContent = state.totalTests;
}

// --- Load Text ---
function loadNewText() {
  const bank = TEXT_BANK[state.difficulty];
  let text = bank[Math.floor(Math.random() * bank.length)];

  // Avoid same text
  while (text === state.currentText && bank.length > 1) {
    text = bank[Math.floor(Math.random() * bank.length)];
  }

  state.currentText = text;
  renderText();
}

// --- Render Text Display ---
function renderText() {
  dom.textDisplay.innerHTML = '';

  state.currentText.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;

    if (i === 0) {
      span.classList.add('current');
    }

    dom.textDisplay.appendChild(span);
  });
}

// --- Difficulty ---
function setDifficulty(diff) {
  state.difficulty = diff;

  // Update active button
  document.querySelectorAll('.diff-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-difficulty="${diff}"]`).classList.add('active');

  // Move slider
  const idx = ['easy', 'medium', 'hard', 'expert'].indexOf(diff);
  dom.diffSlider.style.transform = `translateX(${idx * 100}%)`;

  resetGame();
  loadNewText();
}

// --- Bind Events ---
function bindEvents() {
  // Typing input
  dom.typeInput.addEventListener('input', handleTyping);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      resetGame();
      loadNewText();
      dom.typeInput.focus();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      resetGame();
      loadNewText();
    }
  });

  // Difficulty buttons
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => setDifficulty(btn.dataset.difficulty));
  });

  // Result buttons
  $('btnRetry').addEventListener('click', () => {
    resetGame();
    renderText();
    dom.typeInput.focus();
  });

  $('btnNewText').addEventListener('click', () => {
    resetGame();
    loadNewText();
    dom.typeInput.focus();
  });

  // Focus input on text display click
  dom.textDisplay.addEventListener('click', () => dom.typeInput.focus());
}

// --- Handle Typing ---
function handleTyping(e) {
  const inputVal = dom.typeInput.value;
  const chars = dom.textDisplay.querySelectorAll('.char');

  // Start timer on first keypress
  if (!state.isStarted && !state.isFinished) {
    startTimer();
    state.isStarted = true;
    dom.textDisplay.classList.add('active');
    dom.levelBadge.classList.add('active');
  }

  if (state.isFinished) return;

  const typedLength = inputVal.length;

  // Update character states
  let errors = 0;
  let correctChars = 0;

  for (let i = 0; i < chars.length; i++) {
    chars[i].classList.remove('correct', 'incorrect', 'current', 'char-flash');

    if (i < typedLength) {
      if (inputVal[i] === state.currentText[i]) {
        chars[i].classList.add('correct');
        correctChars++;
        // Flash animation for newly typed correct char
        if (i === typedLength - 1) {
          chars[i].classList.add('char-flash');
        }
      } else {
        chars[i].classList.add('incorrect');
        errors++;
        // Shake on error
        if (i === typedLength - 1) {
          dom.textDisplay.classList.add('shake');
          setTimeout(() => dom.textDisplay.classList.remove('shake'), 300);
        }
      }
    } else if (i === typedLength) {
      chars[i].classList.add('current');
    }
  }

  state.charIndex = typedLength;
  state.errors = errors;
  state.correctChars = correctChars;
  state.totalTyped = typedLength;

  // Update live stats
  updateLiveStats();

  // Check if complete
  if (typedLength >= state.currentText.length) {
    finishGame();
  }
}

// --- Timer ---
function startTimer() {
  state.startTime = Date.now();

  state.timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
    dom.timerDisplay.textContent = formatTime(elapsed);

    // Update timer ring (max 120s)
    const pct = Math.min((elapsed / 120) * 100, 100);
    dom.timerRingFill.setAttribute('stroke-dasharray', `${pct}, 100`);
  }, 100);

  // Sample WPM every 2 seconds for chart
  state.wpmSampleInterval = setInterval(() => {
    const wpm = calculateWPM();
    state.wpmHistory.push(wpm);
  }, 2000);
}

function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function calculateWPM() {
  if (!state.startTime) return 0;
  const elapsed = (Date.now() - state.startTime) / 1000 / 60; // minutes
  if (elapsed === 0) return 0;
  const words = state.correctChars / 5;
  return Math.round(words / elapsed);
}

function calculateAccuracy() {
  if (state.totalTyped === 0) return 100;
  return Math.round((state.correctChars / state.totalTyped) * 100);
}

function calculateScore() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  // Score formula: WPM * accuracy percentage * difficulty multiplier
  const diffMultiplier = { easy: 1, medium: 1.5, hard: 2, expert: 3 };
  return Math.round(wpm * (accuracy / 100) * (diffMultiplier[state.difficulty] || 1));
}

// --- Update Live Stats ---
function updateLiveStats() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  const score = calculateScore();

  dom.wpmDisplay.textContent = wpm;
  dom.accuracyDisplay.textContent = `${accuracy}%`;
  dom.scoreDisplay.textContent = score;

  // Update level badge
  const level = getSpeedLevel(wpm);
  dom.levelIcon.textContent = level.icon;
  dom.levelText.textContent = `${level.label} · ${wpm} WPM`;
  dom.levelBadge.style.borderColor = level.color;
  dom.levelBadge.style.boxShadow = `0 0 20px ${level.color}30`;

  // WPM card color
  if (wpm > 0) {
    dom.wpmDisplay.style.color = level.color;
  }

  // Animate score
  dom.scoreDisplay.classList.remove('score-pop');
  void dom.scoreDisplay.offsetWidth;
  dom.scoreDisplay.classList.add('score-pop');
}

function getSpeedLevel(wpm) {
  return SPEED_LEVELS.find(l => wpm >= l.min && wpm < l.max) || SPEED_LEVELS[0];
}

// --- Finish Game ---
function finishGame() {
  state.isFinished = true;
  clearInterval(state.timerInterval);
  clearInterval(state.wpmSampleInterval);

  // Capture one final WPM sample
  state.wpmHistory.push(calculateWPM());

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();
  const score = calculateScore();
  const elapsed = Math.floor((Date.now() - state.startTime) / 1000);
  const level = getSpeedLevel(wpm);

  // Update best WPM
  if (wpm > state.bestWpm) {
    state.bestWpm = wpm;
    localStorage.setItem('typeblitz_best_wpm', wpm.toString());
  }

  // Update total tests
  state.totalTests++;
  localStorage.setItem('typeblitz_total_tests', state.totalTests.toString());
  updateHeaderStats();

  // Populate results
  dom.resultWpm.textContent = wpm;
  dom.resultAccuracy.textContent = `${accuracy}%`;
  dom.resultTime.textContent = formatTime(elapsed);
  dom.resultScore.textContent = score;
  dom.resultChars.textContent = state.currentText.length;
  dom.resultErrors.textContent = state.errors;
  dom.resultsLevelIcon.textContent = level.icon;
  dom.resultsLevelText.textContent = level.label;
  dom.resultsPanel.querySelector('.results-level').style.borderColor = level.color;
  dom.resultsPanel.querySelector('.results-level').style.color = level.color;

  // Hide typing zone, show results
  dom.typingZone.style.display = 'none';
  dom.resultsPanel.classList.remove('hidden');

  // Draw WPM chart
  drawWPMChart();
}

// --- WPM Chart ---
function drawWPMChart() {
  const canvas = dom.wpmChart;
  const ctx = canvas.getContext('2d');

  // Set actual canvas resolution
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const data = state.wpmHistory;

  if (data.length < 2) return;

  const maxWpm = Math.max(...data, 20);
  const padding = { top: 10, right: 20, bottom: 30, left: 40 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px Inter';
    ctx.textAlign = 'right';
    const val = Math.round(maxWpm - (maxWpm / 4) * i);
    ctx.fillText(val, padding.left - 8, y + 4);
  }

  // Build points
  const points = data.map((v, i) => ({
    x: padding.left + (i / (data.length - 1)) * chartW,
    y: padding.top + chartH - (v / maxWpm) * chartH
  }));

  // Gradient fill
  const gradient = ctx.createLinearGradient(0, padding.top, 0, h - padding.bottom);
  gradient.addColorStop(0, 'rgba(124, 58, 237, 0.3)');
  gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

  ctx.beginPath();
  ctx.moveTo(points[0].x, h - padding.bottom);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    const xc = (points[i - 1].x + points[i].x) / 2;
    const yc = (points[i - 1].y + points[i].y) / 2;
    ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
  }
  ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

  const lineGradient = ctx.createLinearGradient(0, 0, w, 0);
  lineGradient.addColorStop(0, '#7c3aed');
  lineGradient.addColorStop(0.5, '#a855f7');
  lineGradient.addColorStop(1, '#c084fc');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Dots
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = i === points.length - 1 ? '#ec4899' : '#a855f7';
    ctx.fill();
    ctx.strokeStyle = '#0a0a0f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // X-axis labels
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '10px Inter';
  ctx.textAlign = 'center';
  points.forEach((p, i) => {
    if (i % Math.ceil(data.length / 6) === 0 || i === data.length - 1) {
      ctx.fillText(`${(i + 1) * 2}s`, p.x, h - 8);
    }
  });
}

// --- Reset Game ---
function resetGame() {
  clearInterval(state.timerInterval);
  clearInterval(state.wpmSampleInterval);

  state.charIndex = 0;
  state.isStarted = false;
  state.isFinished = false;
  state.startTime = null;
  state.errors = 0;
  state.totalTyped = 0;
  state.correctChars = 0;
  state.wpmHistory = [];

  dom.typeInput.value = '';
  dom.timerDisplay.textContent = '0s';
  dom.wpmDisplay.textContent = '0';
  dom.wpmDisplay.style.color = '';
  dom.accuracyDisplay.textContent = '100%';
  dom.scoreDisplay.textContent = '0';
  dom.timerRingFill.setAttribute('stroke-dasharray', '0, 100');

  dom.levelIcon.textContent = '🐢';
  dom.levelText.textContent = 'Ready to type?';
  dom.levelBadge.style.borderColor = '';
  dom.levelBadge.style.boxShadow = '';
  dom.levelBadge.classList.remove('active');

  dom.textDisplay.classList.remove('active');

  // Show typing zone, hide results
  dom.typingZone.style.display = '';
  dom.resultsPanel.classList.add('hidden');
}

// --- Start ---
document.addEventListener('DOMContentLoaded', init);
