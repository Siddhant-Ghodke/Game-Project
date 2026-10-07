// ---------- Questions ----------
// Topics: Pigeonhole (boxes), Arrangements (order matters), Choosing (order does not matter)
const LEVELS = [
  {
    name: "Level 1 – Warm Up", points: 10,
    questions: [
      { t: "Boxes", q: "You put 4 balls into 3 boxes. At least how many balls must one box have?", o: ["1", "2", "3", "4"], a: 1, e: "Put 1 ball in each box. That uses 3 balls. The 4th ball must go in a box that already has one, so some box has 2." },
      { t: "Arrangements", q: "In how many ways can 3 friends stand in a line?", o: ["3", "6", "9", "12"], a: 1, e: "First spot: 3 choices, second: 2, third: 1. So 3 × 2 × 1 = 6." },
      { t: "Choosing", q: "You have 4 shirts and 2 pants. How many different outfits can you make?", o: ["6", "8", "4", "16"], a: 1, e: "Each shirt goes with each pant: 4 × 2 = 8." },
      { t: "Boxes", q: "There are 13 kids in a class. Must at least 2 of them have birthdays in the same month?", o: ["Yes", "No"], a: 0, e: "There are only 12 months. With 13 kids, at least two must share a month." },
      { t: "Choosing", q: "In how many ways can you pick 2 fruits from apple, banana and mango?", o: ["2", "3", "6", "9"], a: 1, e: "The pairs are: apple-banana, apple-mango, banana-mango. That is 3." },
    ],
  },
  {
    name: "Level 2 – Easy Steps", points: 20,
    questions: [
      { t: "Arrangements", q: "How many ways can you arrange the letters of the word CAT?", o: ["3", "6", "9", "27"], a: 1, e: "3 different letters: 3 × 2 × 1 = 6." },
      { t: "Boxes", q: "A drawer has red and black socks. How many socks must you take out (without looking) to be sure you have a matching pair?", o: ["2", "3", "4", "5"], a: 1, e: "There are 2 colors. With 3 socks, two must be the same color." },
      { t: "Choosing", q: "Pick 2 players from 4 players. How many different pairs can you pick?", o: ["6", "8", "12", "4"], a: 0, e: "Each pair is counted twice: (4 × 3) ÷ 2 = 6." },
      { t: "Arrangements", q: "3 runners race. How many ways can they finish in 1st and 2nd place?", o: ["3", "6", "9", "2"], a: 1, e: "1st place: 3 choices. 2nd place: 2 choices. 3 × 2 = 6." },
      { t: "Boxes", q: "10 letters go into 3 mailboxes. At least how many letters must one mailbox get?", o: ["3", "4", "5", "2"], a: 1, e: "If each box had only 3, that is 9 letters. The 10th makes one box have 4." },
      { t: "Choosing", q: "A pizza shop has 4 toppings. You can pick any 3. How many choices do you have?", o: ["4", "12", "24", "3"], a: 0, e: "Picking 3 of 4 is the same as leaving out 1 of 4. So 4 ways." },
    ],
  },
  {
    name: "Level 3 – A Small Step Up", points: 30,
    questions: [
      { t: "Arrangements", q: "How many 3-digit codes can you make using digits 1, 2, 3, 4 if no digit repeats?", o: ["12", "24", "64", "36"], a: 1, e: "4 choices, then 3, then 2: 4 × 3 × 2 = 24." },
      { t: "Boxes", q: "A bag has red, green and yellow balls. How many must you pick to be sure of getting 3 of the same color?", o: ["6", "7", "8", "9"], a: 1, e: "You could get 2 of each color = 6 balls with no triple. The 7th ball makes 3 of one color." },
      { t: "Choosing", q: "6 people meet. Everyone shakes hands with everyone else once. How many handshakes?", o: ["12", "15", "30", "36"], a: 1, e: "Pick 2 people out of 6: (6 × 5) ÷ 2 = 15." },
      { t: "Arrangements", q: "How many ways can you arrange the letters of the word BOOK?", o: ["24", "12", "6", "8"], a: 1, e: "4 letters give 24, but the two O's look the same, so divide by 2: 24 ÷ 2 = 12." },
      { t: "Boxes", q: "There are 25 students and 4 buses. At least how many students must be on one bus?", o: ["6", "7", "5", "8"], a: 1, e: "4 buses × 6 = 24. The 25th student makes one bus have 7." },
      { t: "Choosing", q: "From 5 boys and 3 girls, pick 1 boy and 1 girl. How many ways?", o: ["8", "15", "28", "56"], a: 1, e: "5 choices for the boy and 3 for the girl: 5 × 3 = 15." },
      { t: "Arrangements", q: "4 books are put on a shelf. In how many ways can they be arranged?", o: ["16", "24", "12", "8"], a: 1, e: "4 × 3 × 2 × 1 = 24." },
    ],
  },
  {
    name: "Level 4 – Keep Going", points: 40,
    questions: [
      { t: "Arrangements", q: "How many 3-digit codes can you make from 1, 2, 3, 4, 5 with no repeated digit?", o: ["30", "60", "125", "15"], a: 1, e: "5 choices, then 4, then 3: 5 × 4 × 3 = 60." },
      { t: "Choosing", q: "Pick a team of 3 from 6 players. How many teams can you pick?", o: ["18", "20", "60", "120"], a: 1, e: "Each team is counted 6 times: (6 × 5 × 4) ÷ (3 × 2 × 1) = 20." },
      { t: "Boxes", q: "A bag has balls in 4 colors, with many of each color. How many must you take without looking to be sure of 3 of one color?", o: ["9", "12", "8", "13"], a: 0, e: "You could take 2 of each color, or 8 balls. The 9th gives 3 of one color." },
      { t: "Arrangements", q: "How many ways can you arrange the letters in APPLE?", o: ["120", "60", "24", "48"], a: 1, e: "5 × 4 × 3 × 2 × 1 = 120. The two P's are the same, so 120 ÷ 2 = 60." },
      { t: "Choosing", q: "Pick 2 shirts from 5 shirts and 1 pair of pants from 3 pairs. How many choices do you have?", o: ["15", "30", "45", "8"], a: 1, e: "There are (5 × 4) ÷ 2 = 10 shirt pairs. 10 × 3 = 30 choices." },
      { t: "Arrangements", q: "5 friends stand in a line. Sam must be first. How many ways can they stand?", o: ["5", "24", "120", "20"], a: 1, e: "Sam is fixed. Arrange the other 4: 4 × 3 × 2 × 1 = 24." },
    ],
  },
  {
    name: "Level 5 – Final Step", points: 50,
    questions: [
      { t: "Choosing", q: "Pick a team of 3 from 7 players. How many teams can you pick?", o: ["21", "35", "70", "210"], a: 1, e: "(7 × 6 × 5) ÷ (3 × 2 × 1) = 35." },
      { t: "Arrangements", q: "How many 4-digit codes can you make from 1, 2, 3, 4, 5 with no repeated digit?", o: ["60", "120", "625", "20"], a: 1, e: "5 × 4 × 3 × 2 = 120." },
      { t: "Arrangements", q: "5 friends stand in a line. Sam and Jo must stand next to each other. How many ways can they stand?", o: ["120", "48", "24", "60"], a: 1, e: "Keep Sam and Jo together as one pair. Arrange 4 groups: 24 ways. The pair can swap places: 24 × 2 = 48." },
      { t: "Choosing", q: "A team has 7 players. Pick 3, but Sam must be picked. How many teams can you pick?", o: ["35", "15", "21", "10"], a: 1, e: "Sam is already picked. Pick 2 of the other 6: (6 × 5) ÷ 2 = 15." },
      { t: "Boxes", q: "A bag has balls in 4 colors, with many of each color. How many must you take without looking to be sure of 4 of one color?", o: ["12", "13", "16", "10"], a: 1, e: "You could take 3 of each color, or 12 balls. The 13th gives 4 of one color." },
      { t: "Choosing", q: "Pick 2 boys from 4 boys and 1 girl from 3 girls. How many teams can you pick?", o: ["12", "18", "24", "7"], a: 1, e: "Pick the boys: (4 × 3) ÷ 2 = 6 ways. Pick the girl: 3 ways. 6 × 3 = 18." },
    ],
  },
];

// ---------- State ----------
const TIME = 30;
let level = 0, qi = 0, lives = 3, score = 0, timer = null, timeLeft = TIME;
let results = []; // per level: "good" | "bad"
let allResults = [];
let answered = false;
let soundEnabled = true;
let audioContext = null;

const $ = (id) => document.getElementById(id);
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

function drawTrack(el, list, total, current) {
  el.innerHTML = "";
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div");
    d.className = "dot " + (list[i] || (i === current ? "now" : ""));
    d.textContent = list[i] === "good" ? "✓" : list[i] === "bad" ? "✗" : i + 1;
    el.appendChild(d);
  }
}

// ---------- Background layers ----------
const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const SYMBOLS = ["π", "Σ", "√", "∞", "×", "÷", "%", "∫"];
const RING_LENGTH = 119.4;

function buildBackdrop() {
  if (REDUCED) return;
  const sym = $("symbols");
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = SYMBOLS[i % SYMBOLS.length];
    s.style.left = `${(Math.random() * 95).toFixed(1)}%`;
    s.style.top = `${(Math.random() * 92).toFixed(1)}%`;
    s.style.fontSize = `${(1.6 + Math.random() * 4.2).toFixed(2)}rem`;
    s.style.setProperty("--dur", `${(14 + Math.random() * 14).toFixed(1)}s`);
    s.style.animationDelay = `${(-Math.random() * 12).toFixed(1)}s`;
    sym.appendChild(s);
  }
  const dust = $("particles");
  for (let i = 0; i < 130; i++) {
    const p = document.createElement("span");
    const size = 1.5 + Math.random() * 3.2;
    p.style.width = `${size.toFixed(1)}px`;
    p.style.height = `${size.toFixed(1)}px`;
    p.style.left = `${(Math.random() * 100).toFixed(1)}%`;
    p.style.top = `${(Math.random() * 100).toFixed(1)}%`;
    p.style.opacity = (.25 + Math.random() * .55).toFixed(2);
    p.style.setProperty("--dx", `${((Math.random() - .5) * 46).toFixed(1)}px`);
    p.style.setProperty("--dy", `${((Math.random() - .5) * 46).toFixed(1)}px`);
    p.style.setProperty("--dur", `${(10 + Math.random() * 16).toFixed(1)}s`);
    p.style.animationDelay = `${(-Math.random() * 20).toFixed(1)}s`;
    dust.appendChild(p);
  }
}

let pointerFrame = 0;
function trackPointer(x, y) {
  if (REDUCED || pointerFrame) return;
  pointerFrame = window.requestAnimationFrame(() => {
    pointerFrame = 0;
    const root = document.documentElement.style;
    root.setProperty("--mx", `${x}px`);
    root.setProperty("--my", `${y}px`);
    root.setProperty("--par-x", `${((x / window.innerWidth - .5) * 26).toFixed(1)}px`);
    root.setProperty("--par-y", `${((y / window.innerHeight - .5) * 26).toFixed(1)}px`);
  });
}
window.addEventListener("pointermove", (e) => trackPointer(e.clientX, e.clientY));

function paintRing() {
  $("ringFill").style.strokeDashoffset = `${(RING_LENGTH * (1 - Math.max(0, timeLeft) / TIME)).toFixed(1)}`;
  $("ring").classList.toggle("warn", timeLeft <= 15 && timeLeft > 7);
  $("ring").classList.toggle("danger", timeLeft <= 7);
}

function paintProgress() {
  const total = LEVELS[level].questions.length;
  const pct = total ? Math.round((results.length / total) * 100) : 0;
  $("progressFill").style.width = `${pct}%`;
  $("progressBar").setAttribute("aria-valuenow", String(pct));
}

let scoreShown = 0;
function showScore(target) {
  const el = $("score");
  const from = scoreShown;
  const delta = target - from;
  scoreShown = target;
  if (!delta || REDUCED) { el.textContent = target; return; }
  const started = Date.now();
  const step = () => {
    const t = Math.min(1, (Date.now() - started) / 600);
    el.textContent = Math.round(from + delta * (1 - Math.pow(1 - t, 3)));
    if (t < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
  const pill = $("scorePill");
  pill.classList.remove("sparkle");
  pill.classList.add("sparkle");
  setTimeout(() => pill.classList.remove("sparkle"), 900);
}

function flashCard(kind) {
  const card = $("card");
  card.classList.remove("flash-good", "flash-bad", "shake");
  void card.offsetWidth;
  card.classList.add(kind);
  setTimeout(() => card.classList.remove(kind), 900);
}

function burst(color) {
  if (REDUCED) return;
  const host = $("effects");
  for (let n = 0; n < 14; n++) {
    const p = document.createElement("i");
    p.className = "burst";
    p.style.left = `${(44 + Math.random() * 12).toFixed(1)}%`;
    p.style.top = `${(38 + Math.random() * 14).toFixed(1)}%`;
    p.style.background = color;
    p.style.setProperty("--bx", `${((Math.random() - .5) * 280).toFixed(1)}px`);
    p.style.setProperty("--by", `${(-40 - Math.random() * 190).toFixed(1)}px`);
    host.appendChild(p);
    setTimeout(() => p.remove(), 900);
  }
}

function updateHud() {
  $("levelName").textContent = LEVELS[level].name;
  $("lives").textContent = "❤️".repeat(lives) + "🤍".repeat(3 - lives);
  showScore(score);
  $("timer").textContent = timeLeft;
  paintRing();
}

function initSound() {
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    if (!audioContext) audioContext = new Audio();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
  } catch { audioContext = null; }
}
function playSound(kind) {
  if (!soundEnabled || !audioContext) return;
  const notes = kind === "level" ? [523, 659, 784, 1047] : kind === "good" ? [659, 880] : [260, 196];
  try {
    notes.forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const start = audioContext.currentTime + index * .14;
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.1, start + .015);
      gain.gain.exponentialRampToValueAtTime(.001, start + .28);
      oscillator.connect(gain); gain.connect(audioContext.destination);
      oscillator.start(start); oscillator.stop(start + .3);
    });
  } catch { /* Sound is optional; gameplay continues. */ }
}
function celebrate(count = 26) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const host = $("effects");
  host.replaceChildren();
  for (let n = 0; n < count; n++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * .35}s`;
    host.appendChild(piece);
  }
  setTimeout(() => host.replaceChildren(), 2400);
}
function startGame() {
  initSound();
  level = 0; lives = 3; score = 0; allResults = [];
  scoreShown = 0;
  $("score").textContent = "0";
  startLevel();
}

function startLevel() {
  qi = 0; results = [];
  show("game");
  loadQuestion();
}

function loadQuestion() {
  answered = false;
  const card = $("card");
  card.classList.remove("shake", "flash-good", "flash-bad");
  const Q = LEVELS[level].questions[qi];
  $("topic").textContent = Q.t;
  const qEl = $("question");
  qEl.textContent = Q.q;
  qEl.style.animation = "none";
  void qEl.offsetWidth;
  qEl.style.animation = "";
  $("feedback").classList.add("hidden");
  const box = $("options");
  box.innerHTML = "";
  Q.o.forEach((txt, i) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = txt;
    b.onclick = () => answer(i);
    box.appendChild(b);
  });
  drawTrack($("track"), results, LEVELS[level].questions.length, qi);
  paintProgress();
  timeLeft = TIME;
  updateHud();
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    $("timer").textContent = timeLeft;
    paintRing();
    if (timeLeft <= 0) answer(-1);
  }, 1000);
}

function answer(i) {
  if (answered) return;
  answered = true;
  clearInterval(timer);
  const Q = LEVELS[level].questions[qi];
  const btns = document.querySelectorAll(".opt");
  btns.forEach((b) => (b.disabled = true));
  btns[Q.a].classList.add("right");
  const ok = i === Q.a;
  if (ok) {
    const bonus = Math.floor(timeLeft / 3);
    const gained = LEVELS[level].points + bonus;
    score += gained;
    results.push("good");
    $("fbTitle").textContent = `Correct! +${gained} points`;
    celebrate();
    flashCard("flash-good");
    burst("var(--good)");
  } else {
    lives--;
    results.push("bad");
    if (i >= 0) btns[i].classList.add("wrong");
    $("fbTitle").textContent = i < 0 ? "Time is up! -1 life" : "Not quite! -1 life";
    flashCard("flash-bad");
    burst("var(--bad)");
    const hearts = $("lives");
    hearts.classList.add("hurt");
    setTimeout(() => hearts.classList.remove("hurt"), 700);
  }
  playSound(ok ? "good" : "bad");
  $("feedback").classList.remove("good", "bad");
  $("feedback").classList.add(ok ? "good" : "bad");
  $("answerIcon").textContent = ok ? "✓" : "✗";
  $("fbText").textContent = Q.e;
  $("feedback").classList.remove("hidden");
  drawTrack($("track"), results, LEVELS[level].questions.length, -1);
  paintProgress();
  updateHud();
  $("nextBtn").textContent = lives <= 0 ? "See Results" : qi === LEVELS[level].questions.length - 1 ? "Finish Level" : "Next";
}

function next() {
  if (!answered) return;
  if (lives <= 0) return endGame(false);
  qi++;
  if (qi < LEVELS[level].questions.length) return loadQuestion();
  allResults.push(...results);
  if (level === LEVELS.length - 1) return endGame(true);
  const good = results.filter((r) => r === "good").length;
  $("luTitle").textContent = `${LEVELS[level].name.split(" –")[0]} Clear!`;
  $("luText").textContent = `You got ${good} of ${results.length} right. Score: ${score}. Lives left: ${lives}.`;
  drawTrack($("luTrack"), results, results.length, -1);
  $("nextReady").textContent = `Ready for Level ${level + 2}!`;
  $("luBtn").textContent = `Start Level ${level + 2} →`;
  show("levelUp");
  playSound("level");
  celebrate(60);
}

function endGame(won) {
  if (!won) allResults.push(...results);
  const good = allResults.filter((r) => r === "good").length;
  $("endTitle").textContent = won ? "🏆 You Win!" : "Game Over";
  $("endText").textContent = `Final score: ${score}. Correct answers: ${good} of ${allResults.length}.`;
  drawTrack($("endTrack"), allResults, allResults.length, -1);
  show("end");
  $("againBtn").focus({ preventScroll: true });
  if (won) { playSound("level"); celebrate(80); }
}

function resetWarmup() {
  document.querySelectorAll(".mini-choice").forEach((b) => b.classList.remove("right", "wrong"));
  $("warmupFeedback").textContent = " ";
}

function backToStart() {
  clearInterval(timer);
  resetWarmup();
  show("start");
}

$("startBtn").onclick = startGame;
$("nextBtn").onclick = next;
$("luBtn").onclick = () => { level++; startLevel(); };
$("againBtn").onclick = startGame;
$("homeBtn").onclick = backToStart;


$("soundBtn").onclick = () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) initSound();
  $("soundBtn").textContent = soundEnabled ? "♫" : "♪̸";
  $("soundBtn").setAttribute("aria-label", soundEnabled ? "Mute sound" : "Enable sound");
  $("soundBtn").setAttribute("aria-pressed", String(!soundEnabled));
  $("soundBtn").title = soundEnabled ? "Mute sound" : "Enable sound";
};
document.querySelectorAll(".mini-choice").forEach(button => {
  button.onclick = () => {
    initSound();
    const ok = button.dataset.value === "6";
    document.querySelectorAll(".mini-choice").forEach(b => b.classList.remove("right", "wrong"));
    button.classList.add(ok ? "right" : "wrong");
    $("warmupFeedback").textContent = ok ? "Yes! 2 × 3 = 6. You're ready!" : "Try again. Pick one shirt and one pair of pants.";
    playSound(ok ? "good" : "bad");
    if (ok) celebrate(16);
  };
});
const art = new URLSearchParams(window.location.search).get("art");
if (art && art.startsWith("/") && !art.startsWith("//")) $("gameArt").src = art;

buildBackdrop();
