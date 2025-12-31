// ====== Helpers ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function showScreen(id){
  $$(".screen").forEach(s => s.classList.remove("isActive"));
  $(id).classList.add("isActive");
  clearFeedback();
}

function setFeedback(text, ok){
  const box = $("#feedbackBox");
  if(!box) return;
  box.textContent = text;
  box.classList.remove("ok","bad");
  box.classList.add(ok ? "ok" : "bad");
}

function clearFeedback(){
  const box = $("#feedbackBox");
  if(!box) return;
  box.textContent = "";
  box.classList.remove("ok","bad");
}

function normalize(s){
  return String(s ?? "").trim().toLowerCase();
}

function shuffleArray(arr){
  const a = [...arr];
  for(let i=a.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ====== Footer Year ======
$("#copyrightYear").textContent = String(new Date().getFullYear());

// ====== Stufe + Tickets ======
const LEVEL_KEY = "latinTrainerLevel";
const TICKET_KEY = "latinTrainerTickets";

function getLevel(){
  return Number(localStorage.getItem(LEVEL_KEY) || "1");
}
function setLevel(v){
  const safe = Math.max(1, Number(v) || 1);
  localStorage.setItem(LEVEL_KEY, String(safe));
  $("#levelValue").textContent = String(safe);
  return safe;
}

function getTickets(){
  return Number(localStorage.getItem(TICKET_KEY) || "0");
}
function setTickets(v){
  const safe = Math.max(0, Number(v) || 0);
  localStorage.setItem(TICKET_KEY, String(safe));
  $("#ticketValue").textContent = String(safe);
  updateArenaButton();
  return safe;
}

function updateArenaButton(){
  const btn = $("#btnArena");
  if(!btn) return;
  const t = getTickets();
  btn.disabled = t <= 0;
  btn.textContent = t > 0 ? `🛡️ Arena (Ticket: ${t})` : "🛡️ Arena (kein Ticket)";
}

setLevel(getLevel());
setTickets(getTickets());

// ====== Game Data (Beispiele – du ersetzt später) ======
const gameData = {
  verben: [
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Merkmale: 1. Ps. Sg. Ind. Akt. — Welche Form(en) passen?",
      options: ["amo", "amas", "amamus"],
      correct: ["amo"],
      explain: "1. Person Singular Präsens Aktiv: amo."
    },
    { type: "input", title: "Setze die passende Form ein!",
      prompt: "Puella ____ (amare) poetam.",
      answer: "amat",
      explain: "3. Person Singular Präsens Aktiv: amat."
    },
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Merkmale: 3. Ps. Pl. Ind. Akt. — Welche Form(en) passen?",
      options: ["amant", "amat", "amatis"],
      correct: ["amant"],
      explain: "3. Person Plural Präsens Aktiv: amant."
    },
    { type: "input", title: "Setze die passende Form ein!",
      prompt: "Servi ____ (laborare) in agro.",
      answer: "laborant",
      explain: "3. Person Plural Präsens Aktiv: laborant."
    },
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Merkmale: 2. Ps. Pl. Ind. Akt. — Welche Form(en) passen?",
      options: ["amatis", "amamus", "amant"],
      correct: ["amatis"],
      explain: "2. Person Plural Präsens Aktiv: amatis."
    },
  ],

  kasus: [
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Angabe: Akk. Sg. — Welche Form(en) passen?",
      options: ["puellam", "puellae", "puella"],
      correct: ["puellam"],
      explain: "Akkusativ Singular von puella: puellam."
    },
    { type: "input", title: "Setze die passende Form ein!",
      prompt: "Marcus ____ videt. (die Puella, Akk. Sg.)",
      answer: "puellam",
      explain: "Objekt im Akkusativ Singular: puellam."
    },
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Angabe: Gen. Pl. — Welche Form(en) passen?",
      options: ["puellarum", "puellas", "puellae"],
      correct: ["puellarum"],
      explain: "Genitiv Plural: puellarum."
    },
    { type: "input", title: "Setze die passende Form ein!",
      prompt: "Liber est ____ . (der Puellae, Dat. Pl.)",
      answer: "puellis",
      explain: "Dativ Plural: puellis."
    },
    { type: "mcq", title: "Wähle die richtige Form aus!",
      prompt: "Angabe: Dat. Sg. — Welche Form(en) passen?",
      options: ["puellae", "puellā", "puellam"],
      correct: ["puellae"],
      explain: "Dativ Singular: puellae."
    },
  ],

  satzanalyse: [
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere das Prädikat des Satzes!",
      sentence:["Puella","poetam","amat."],
      correctTokens:[2],
      hint:"Hinweis: Es gibt genau 1 Prädikat.",
      explain:"Prädikat = Verbform: amat."
    },
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere das Subjekt des Satzes!",
      sentence:["Servus","in","agro","laborat."],
      correctTokens:[0],
      hint:"Hinweis: Es gibt genau 1 Subjekt.",
      explain:"Subjekt = Wer/was? Servus."
    },
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere das Akkusativobjekt des Satzes!",
      sentence:["Marcus","puellam","videt."],
      correctTokens:[1],
      hint:"Hinweis: Es gibt genau 1 Akkusativobjekt.",
      explain:"Akkusativobjekt = puellam."
    },
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere das Dativobjekt des Satzes!",
      sentence:["Magister","puellae","librum","dat."],
      correctTokens:[1],
      hint:"Hinweis: Es gibt genau 1 Dativobjekt.",
      explain:"Dativobjekt = puellae."
    },
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere das Genitivobjekt des Satzes!",
      sentence:["Timor","hostium","magnus","est."],
      correctTokens:[1],
      hint:"Hinweis: Es gibt hier 1 Genitivform.",
      explain:"Genitivform = hostium."
    },
    {
      type:"analysis", title:"Satzanalyse",
      prompt:"Markiere Ablativformen im Satz!",
      sentence:["Cum","amicō","in","urbē","ambulamus."],
      correctTokens:[1,3],
      hint:"Hinweis: Es gibt hier mehrere Ablative.",
      explain:"Ablative: amicō und urbē."
    },
  ]
};

// ====== Game State ======
let currentMode = null;
let rounds = [];
let roundIndex = 0;
let injuries = 0;

let selected = new Set();
let selectedTokens = new Set();

let lastSolution = { answer: "", explain: "" };

// ====== Render Trainer ======
function startMode(mode){
  currentMode = mode;

  const base = gameData[mode];
  rounds = (mode === "satzanalyse") ? [...base] : shuffleArray(base);

  roundIndex = 0;
  injuries = 0;

  $("#modeTitle").textContent =
    mode === "verben" ? "Verben"
    : mode === "kasus" ? "Kasus"
    : "Satzanalyse";

  $("#injuryNow").textContent = "0";
  $("#roundNow").textContent = "1";
  $("#roundTotal").textContent = String(rounds.length);

  showScreen("#screen-game");
  renderRound();
}

function renderRound(){
  clearFeedback();
  selected.clear();
  selectedTokens.clear();
  $("#userInput").value = "";

  const r = rounds[roundIndex];
  $("#roundNow").textContent = String(roundIndex + 1);
  $("#taskTypeTitle").textContent = r.title;

  $("#mcqArea").classList.add("hidden");
  $("#inputArea").classList.add("hidden");
  $("#analysisArea").classList.add("hidden");

  if(r.type === "mcq"){
    $("#mcqArea").classList.remove("hidden");
    $("#mcqPrompt").textContent = r.prompt;

    const wrap = $("#mcqOptions");
    wrap.innerHTML = "";

    r.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "optionBtn";
      btn.type = "button";
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        if(selected.has(opt)){
          selected.delete(opt);
          btn.classList.remove("isSelected");
        } else {
          selected.add(opt);
          btn.classList.add("isSelected");
        }
      });
      wrap.appendChild(btn);
    });

  } else if(r.type === "input"){
    $("#inputArea").classList.remove("hidden");
    $("#inputPrompt").textContent = r.prompt;

  } else if(r.type === "analysis"){
    $("#analysisArea").classList.remove("hidden");
    $("#analysisPrompt").textContent = r.prompt;

    const sentenceEl = $("#analysisSentence");
    sentenceEl.innerHTML = "";

    r.sentence.forEach((tok, idx) => {
      const span = document.createElement("span");
      span.className = "token";
      span.textContent = tok;
      span.addEventListener("click", () => {
        if(selectedTokens.has(idx)){
          selectedTokens.delete(idx);
          span.classList.remove("isSelected");
        } else {
          selectedTokens.add(idx);
          span.classList.add("isSelected");
        }
      });
      sentenceEl.appendChild(span);
    });

    $("#analysisHint").textContent = r.hint || "";
  }
}

// ====== Win/Lose Trainer ======
function loseTrainer(){
  const old = getLevel();
  const newLvl = setLevel(old - 1);

  $("#solutionBox").style.display = "block";
  $("#solutionAnswer").textContent = lastSolution.answer || "—";
  $("#solutionExplain").textContent = lastSolution.explain || "";

  $("#loseText").innerHTML =
    `Du hast zu viele Verletzungen erlitten. 😕<br>` +
    `Du steigst 1 Level ab (mindestens Stufe 1).<br>` +
    `<strong>Neue Stufe: ${newLvl}</strong>`;

  showScreen("#screen-lose");
}

function winTrainer(){
  const old = getLevel();
  const newLvl = setLevel(old + 1);

  // pro 5 Level Ticket
  if(newLvl % 5 === 0){
    setTickets(getTickets() + 1);
  }

  $("#winText").innerHTML =
    `Du bist 1 Level aufgestiegen! 🎉<br>` +
    `<strong>Neue Stufe: ${newLvl}</strong><br>` +
    `Du kannst stolz auf deine Lateinkenntnisse sein!`;

  $("#solutionBox").style.display = "none";
  showScreen("#screen-win");
}

function addInjuryAndMaybeLose(){
  injuries += 1;
  $("#injuryNow").textContent = String(injuries);
  if(injuries >= 2) loseTrainer();
}

function nextRound(){
  roundIndex += 1;
  if(roundIndex >= rounds.length) winTrainer();
  else renderRound();
}

// ====== Checks ======
function captureSolution(r){
  if(r.type === "mcq"){
    lastSolution.answer = (r.correct || []).join(", ");
    lastSolution.explain = r.explain || "";
  } else if(r.type === "input"){
    lastSolution.answer = r.answer || "";
    lastSolution.explain = r.explain || "";
  } else if(r.type === "analysis"){
    lastSolution.answer = "Richtig: " + (r.correctTokens || []).join(", ");
    lastSolution.explain = r.explain || "";
  }
}

function checkMcq(){
  const r = rounds[roundIndex];
  captureSolution(r);

  const correctSet = new Set(r.correct);
  const sel = selected;

  let ok = sel.size === correctSet.size;
  if(ok){
    for(const c of correctSet){
      if(!sel.has(c)) { ok = false; break; }
    }
  }

  if(ok){
    setFeedback("Richtig! ✅", true);
    setTimeout(nextRound, 500);
  } else {
    setFeedback("Leider falsch. ❌ Versuch es nochmal!", false);
    selected.clear();
    $$("#mcqOptions .optionBtn").forEach(b => b.classList.remove("isSelected"));
    addInjuryAndMaybeLose();
  }
}

function checkInput(){
  const r = rounds[roundIndex];
  captureSolution(r);

  const typed = normalize($("#userInput").value);
  const ans = normalize(r.answer);

  if(typed && typed === ans){
    setFeedback("Richtig! ✅", true);
    setTimeout(nextRound, 500);
  } else {
    setFeedback("Leider falsch. ❌ Versuch es nochmal!", false);
    $("#userInput").value = "";
    $("#userInput").focus();
    addInjuryAndMaybeLose();
  }
}

function checkAnalysis(){
  const r = rounds[roundIndex];
  captureSolution(r);

  const correct = new Set(r.correctTokens);
  const sel = selectedTokens;

  let ok = sel.size === correct.size;
  if(ok){
    for(const c of correct){
      if(!sel.has(c)) { ok = false; break; }
    }
  }

  if(ok){
    setFeedback("Richtig markiert! ✅", true);
    setTimeout(nextRound, 500);
  } else {
    setFeedback("Nicht ganz. ❌ Versuch es nochmal!", false);
    selectedTokens.clear();
    $$("#analysisSentence .token").forEach(t => t.classList.remove("isSelected"));
    addInjuryAndMaybeLose();
  }
}

// ====== Navigation Buttons ======
$("#btnToRules").addEventListener("click", () => showScreen("#screen-rules"));
$("#btnToMenu").addEventListener("click", () => showScreen("#screen-menu"));

// NUR die echten Trainings-Modi:
$$("[data-mode]").forEach(btn => {
  btn.addEventListener("click", () => startMode(btn.dataset.mode));
});

$("#btnBackToMenu").addEventListener("click", () => showScreen("#screen-menu"));
$("#btnLoseToMenu").addEventListener("click", () => {
  $("#solutionBox").style.display = "none";
  showScreen("#screen-menu");
});
$("#btnWinToMenu").addEventListener("click", () => showScreen("#screen-menu"));

$("#btnCheckMcq").addEventListener("click", checkMcq);
$("#btnCheckInput").addEventListener("click", checkInput);
$("#btnCheckAnalysis").addEventListener("click", checkAnalysis);

// ====== Hold-to-Reset (lange drücken) ======
let resetTimer = null;
const resetBtn = $("#btnResetLevel");

function doReset(){
  localStorage.setItem(LEVEL_KEY, "1");
  localStorage.setItem(TICKET_KEY, "0");
  setLevel(1);
  setTickets(0);
  alert("Fortschritt zurückgesetzt. Stufe = 1, Tickets = 0.");
}

resetBtn.addEventListener("pointerdown", () => {
  resetBtn.dataset.holding = "1";
  resetTimer = setTimeout(() => {
    if(resetBtn.dataset.holding === "1") doReset();
  }, 1200);
});
["pointerup","pointerleave","pointercancel"].forEach(ev => {
  resetBtn.addEventListener(ev, () => {
    resetBtn.dataset.holding = "0";
    clearTimeout(resetTimer);
  });
});

// =======================
// ====== ARENA GAME ======
// =======================

const arenaBtn = $("#btnArena");

arenaBtn.addEventListener("click", () => {
  if(getTickets() <= 0){
    alert("Du hast kein Ticket. Du bekommst 1 Ticket pro 5 Level!");
    return;
  }
  setTickets(getTickets() - 1); // Ticket verbrauchen
  startArena();
});

// ---- Arena State ----
let arena = {
  running:false,
  time:30,
  lives:5,
  score:0,
  targetCorrectSet:new Set(),
  drops:[],
  player:{ x:260, y:315, size:44 }, // Schild-Emoji Größe
  rafId:null,
  spawnHandle:null,
  targetHandle:null,
  timerHandle:null
};

function pickArenaTarget(){
  // 1) Such dir hier aus, welche Arena-Aufgabe du willst:
  // "akk_sg" oder "pers1_sg"
  arena.targetType = "akk_sg";

  // 2) Pool: alle MCQ-Aufgaben aus Verben + Kasus
  const pool = [...gameData.verben, ...gameData.kasus].filter(x => x.type === "mcq");

  // 3) Zielmenge zusammenbauen (alle richtigen Lösungen aus passenden Aufgaben)
  const targetSet = new Set();

  if(arena.targetType === "akk_sg"){
    // passt, wenn in der Prompt sowas vorkommt wie "Akk. Sg."
    pool
      .filter(item => (item.prompt || "").toLowerCase().includes("akk. sg"))
      .forEach(item => (item.correct || []).forEach(c => targetSet.add(c)));

    arena.targetLabel = "Fange alle Akk. Sg.-Formen!";
  }

  if(arena.targetType === "pers1_sg"){
    // passt, wenn in der Prompt sowas vorkommt wie "1. ps. sg."
    pool
      .filter(item => (item.prompt || "").toLowerCase().includes("1. ps. sg"))
      .forEach(item => (item.correct || []).forEach(c => targetSet.add(c)));

    arena.targetLabel = "Fange alle 1. Ps. Sg.-Formen!";
  }

  // Fallback: falls du noch keine passenden Aufgaben im Pool hast
  if(targetSet.size === 0){
    arena.targetLabel = "Fange alle richtigen Formen!";
    pool.forEach(item => (item.correct || []).forEach(c => targetSet.add(c)));
  }

  arena.targetCorrectSet = targetSet;
  $("#arenaTarget").textContent = arena.targetLabel;
}


function spawnDrop(){
  const pool = [...gameData.verben, ...gameData.kasus].filter(x => x.type === "mcq");

  // Welche Items "gehören" zum aktuellen Ziel?
  let relevantItems = pool;

  if(arena.targetType === "akk_sg"){
    relevantItems = pool.filter(item => (item.prompt || "").toLowerCase().includes("akk. sg"));
  }

  if(arena.targetType === "pers1_sg"){
    relevantItems = pool.filter(item => (item.prompt || "").toLowerCase().includes("1. ps. sg"));
  }

  // Fallback, falls relevantItems leer ist
  if(relevantItems.length === 0) relevantItems = pool;

  // Wir wollen sowohl richtige als auch falsche Drops:
  // -> Token kommt aus Options irgendeines relevanten Items
  const item = relevantItems[Math.floor(Math.random()*relevantItems.length)];
  const token = item.options[Math.floor(Math.random()*item.options.length)];

  arena.drops.push({
    text: token,
    x: Math.random() * 480 + 20,
    y: -20,
    vy: 2.2 + Math.random()*1.6,
    r: 18
  });
}


function startArena(){
  arena.running = true;
  arena.time = 30;
  arena.lives = 5;
  arena.score = 0;
  arena.drops = [];
  arena.player.x = 260;

  $("#arenaTime").textContent = String(arena.time);
  $("#arenaLives").textContent = String(arena.lives);
  $("#arenaFeedback").textContent = "Fange die richtige Form und weiche falschen aus!";

  pickArenaTarget();
  showScreen("#screen-arena");

  const canvas = $("#arenaCanvas");
  const ctx = canvas.getContext("2d");

  // iPad fix: verhindert Scrollen / “Seite zieht”
  canvas.style.touchAction = "none";

  function draw(){
    ctx.clearRect(0,0,canvas.width, canvas.height);

    // Schild-Spieler
    ctx.font = `${arena.player.size}px system-ui`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🛡️", arena.player.x, arena.player.y);

    // Drops
    ctx.font = "16px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    arena.drops.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI*2);
      ctx.stroke();
      ctx.fillText(d.text, d.x, d.y);
    });
  }

  function update(){
    arena.drops.forEach(d => d.y += d.vy);

    // Schild-Hitbox (ungefähr)
    const shieldW = 44;
    const shieldH = 44;
    const px1 = arena.player.x - shieldW/2;
    const px2 = arena.player.x + shieldW/2;
    const py1 = arena.player.y - shieldH/2;
    const py2 = arena.player.y + shieldH/2;

    arena.drops = arena.drops.filter(d => {
      const hit = (d.x >= px1 && d.x <= px2 && d.y + d.r >= py1 && d.y - d.r <= py2);

      if(hit){
        if(arena.targetCorrectSet.has(d.text)){
          arena.score += 1;
          $("#arenaFeedback").textContent = "✅ Richtig gefangen!";
        } else {
          arena.lives -= 1;
          $("#arenaLives").textContent = String(arena.lives);
          $("#arenaFeedback").textContent = "❌ Falsch! Leben -1";
        }
        return false;
      }

      return d.y < canvas.height + 40;
    });

    if(arena.lives <= 0){
      endArena("Schade 😕 — keine Leben mehr!");
    }
  }

  function loop(){
    if(!arena.running) return;
    update();
    draw();
    arena.rafId = requestAnimationFrame(loop);
  }

  function endArena(msg){
    arena.running = false;

    if(arena.rafId) cancelAnimationFrame(arena.rafId);
    arena.rafId = null;

    clearInterval(arena.spawnHandle);
    clearInterval(arena.targetHandle);
    clearInterval(arena.timerHandle);

    $("#arenaFeedback").textContent = `${msg} (Punkte: ${arena.score})`;
  }

  // Timer
  arena.timerHandle = setInterval(() => {
    if(!arena.running) return;
    arena.time -= 1;
    $("#arenaTime").textContent = String(arena.time);
    if(arena.time <= 0){
      endArena("⏱️ Zeit vorbei! Arena beendet.");
    }
  }, 1000);

  // Spawns
  arena.spawnHandle = setInterval(() => {
    if(arena.running) spawnDrop();
  }, 650);

  // Ziel wechselt
  arena.targetHandle = setInterval(() => {
    if(arena.running) pickArenaTarget();
  }, 6000);

  // Controls: Keyboard (Mac) + Pointer (iPad)
  function setPlayerFromClientX(clientX){
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    arena.player.x = Math.max(30, Math.min(canvas.width - 30, x));
  }

  function onKey(e){
    if(!arena.running) return;
    if(e.key === "ArrowLeft") arena.player.x -= 14;
    if(e.key === "ArrowRight") arena.player.x += 14;
    arena.player.x = Math.max(30, Math.min(canvas.width - 30, arena.player.x));
  }

  function onPointerDown(e){
    if(!arena.running) return;
    canvas.setPointerCapture(e.pointerId);
    setPlayerFromClientX(e.clientX);
    e.preventDefault();
  }

  function onPointerMove(e){
    if(!arena.running) return;
    if(e.buttons === 0 && e.pointerType !== "touch") return;
    setPlayerFromClientX(e.clientX);
    e.preventDefault();
  }

  function onPointerUp(e){
    try { canvas.releasePointerCapture(e.pointerId); } catch {}
  }

  window.addEventListener("keydown", onKey);
  canvas.addEventListener("pointerdown", onPointerDown, { passive:false });
  canvas.addEventListener("pointermove", onPointerMove, { passive:false });
  canvas.addEventListener("pointerup", onPointerUp);

  // Exit button
  $("#btnArenaExit").onclick = () => {
    endArena("Arena beendet.");
    showScreen("#screen-menu");
  };

  loop();
}

// initial
updateArenaButton();
