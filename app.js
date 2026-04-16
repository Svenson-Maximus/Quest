const PASSWORD = "Danitas-Quest";
const SAVE_KEY = "danitas-quest-save-v1";
const UNLOCK_KEY = "danitas-quest-unlocked";
const TRACKS = ["building", "gathering", "pathfinder"];
const XP_PER_QUEST = 100;

const gate = document.querySelector("#gate");
const app = document.querySelector("#app");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const passwordMessage = document.querySelector("#password-message");
const tracksEl = document.querySelector("#tracks");
const historyList = document.querySelector("#history-list");
const totalCompleteEl = document.querySelector("#total-complete");
const highestLevelEl = document.querySelector("#highest-level");
const currentFocusEl = document.querySelector("#current-focus");
const exportButton = document.querySelector("#export-save");
const importInput = document.querySelector("#import-save");
const resetButton = document.querySelector("#reset-save");

let save = loadSave();
let audioContext;

function defaultSave() {
  const tracks = {};
  TRACKS.forEach((track) => {
    tracks[track] = { questIndex: 0, xp: 0, level: 1, completed: [] };
  });
  return {
    player: "Danita",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    activeQuest: null,
    tracks,
    history: []
  };
}

function loadSave() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return defaultSave();
  try {
    return normalizeSave(JSON.parse(raw));
  } catch {
    return defaultSave();
  }
}

function normalizeSave(candidate) {
  const base = defaultSave();
  const merged = {
    ...base,
    ...candidate,
    activeQuest: candidate.activeQuest || null,
    tracks: { ...base.tracks, ...(candidate.tracks || {}) },
    history: Array.isArray(candidate.history) ? candidate.history : []
  };

  TRACKS.forEach((track) => {
    merged.tracks[track] = {
      ...base.tracks[track],
      ...(candidate.tracks && candidate.tracks[track] ? candidate.tracks[track] : {})
    };
    merged.tracks[track].level = calculateLevel(merged.tracks[track].xp);
  });

  if (!isValidActiveQuest(merged.activeQuest, merged)) {
    merged.activeQuest = null;
  }

  return merged;
}

function persist() {
  save.updatedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(save, null, 2));
}

function calculateLevel(xp) {
  return Math.floor(xp / 200) + 1;
}

function unlock() {
  localStorage.setItem(UNLOCK_KEY, "true");
  gate.classList.add("hidden");
  app.classList.remove("hidden");
  render();
}

function isUnlocked() {
  return localStorage.getItem(UNLOCK_KEY) === "true";
}

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (passwordInput.value.trim() === PASSWORD) {
    passwordMessage.textContent = "";
    unlock();
    return;
  }
  passwordMessage.textContent = "That is not the quest phrase, Danita.";
  passwordInput.select();
});

function render() {
  tracksEl.innerHTML = TRACKS.map(renderTrack).join("");
  renderSummary();
  renderHistory();
}

function renderTrack(trackName) {
  const trackData = QUESTS[trackName];
  const state = save.tracks[trackName];
  const quest = trackData.quests[state.questIndex];
  const completedCount = state.completed.length;
  const totalCount = trackData.quests.length;
  const isActive = isCurrentQuestActive(trackName);
  const isLocked = Boolean(save.activeQuest) && !isActive;

  if (!quest) {
    return `
      <article class="quest-card ${trackName} ${isActive ? "active-quest" : ""}">
        <div class="track-head">
          <h2>${escapeHtml(trackData.title)}</h2>
          <p>${escapeHtml(trackData.subtitle)}</p>
          ${renderStats(state, completedCount, totalCount)}
        </div>
        <div class="finished">
          <h3>Path Complete</h3>
          <p>Danita has finished every written quest in this path.</p>
        </div>
      </article>
    `;
  }

  return `
    <article class="quest-card ${trackName} ${isActive ? "active-quest" : ""}">
      <div class="track-head">
        <h2>${escapeHtml(trackData.title)}</h2>
        <p>${escapeHtml(trackData.subtitle)}</p>
        ${renderStats(state, completedCount, totalCount)}
      </div>
      <div class="quest-body">
        <p class="quest-number">Quest ${state.questIndex + 1} of ${totalCount}</p>
        <h3 class="quest-title">${escapeHtml(quest.title)}</h3>
        ${renderQuestStatus(trackName, isActive, isLocked)}
        <p class="description">${escapeHtml(quest.description)}</p>
        <h4>Objectives</h4>
        <ol class="objectives">
          ${quest.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
        </ol>
        <details class="hint">
          <summary>How To Do It</summary>
          <p>${escapeHtml(quest.hint)}</p>
        </details>
        <div class="reward"><strong>Reward:</strong> ${escapeHtml(quest.reward)}</div>
        <div class="commands">
          <strong>Reward Command</strong>
          <pre>${escapeHtml(quest.commands.join("\n"))}</pre>
        </div>
        <div class="quest-actions">
          ${renderPrimaryAction(trackName, isActive, isLocked)}
          <button type="button" data-action="copy" data-track="${trackName}">Copy Reward</button>
        </div>
      </div>
    </article>
  `;
}

function renderQuestStatus(trackName, isActive, isLocked) {
  if (isActive) {
    return `<div class="quest-status active">Active oath. Finish this quest before choosing another.</div>`;
  }

  if (isLocked) {
    const active = getActiveQuestDetails();
    return `<div class="quest-status locked">Locked while ${escapeHtml(active.title)} is active in ${escapeHtml(active.trackTitle)}.</div>`;
  }

  return `<div class="quest-status ready">Ready to activate.</div>`;
}

function renderPrimaryAction(trackName, isActive, isLocked) {
  if (isActive) {
    return `<button type="button" data-action="complete" data-track="${trackName}">Complete Active Quest</button>`;
  }

  if (isLocked) {
    return `<button type="button" disabled>Another Quest Active</button>`;
  }

  return `<button type="button" data-action="activate" data-track="${trackName}">Activate Quest</button>`;
}

function renderStats(state, completedCount, totalCount) {
  return `
    <div class="track-stats">
      <div><strong>Level</strong><span>${state.level}</span></div>
      <div><strong>XP</strong><span>${state.xp}</span></div>
      <div><strong>Done</strong><span>${completedCount}/${totalCount}</span></div>
    </div>
  `;
}

function renderSummary() {
  const states = TRACKS.map((track) => ({ name: track, ...save.tracks[track] }));
  const totalComplete = states.reduce((sum, state) => sum + state.completed.length, 0);
  const highest = Math.max(...states.map((state) => state.level));
  const leader = states.slice().sort((a, b) => b.level - a.level || b.xp - a.xp)[0];
  totalCompleteEl.textContent = totalComplete;
  highestLevelEl.textContent = highest;
  currentFocusEl.textContent = QUESTS[leader.name].title;
}

function renderHistory() {
  if (!save.history.length) {
    historyList.innerHTML = "<p>No quests completed yet. Danita's chronicle begins with the first finished task.</p>";
    return;
  }

  historyList.innerHTML = save.history
    .slice()
    .reverse()
    .slice(0, 12)
    .map((entry) => `
      <div class="history-item">
        <strong>${escapeHtml(entry.trackTitle)}: ${escapeHtml(entry.questTitle)}</strong>
        <p>${new Date(entry.completedAt).toLocaleString()} - Reward: ${escapeHtml(entry.reward)}</p>
      </div>
    `)
    .join("");
}

tracksEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const trackName = button.dataset.track;
  if (action === "activate") activateQuest(trackName);
  if (action === "complete") completeQuest(trackName, button);
  if (action === "copy") await copyReward(trackName, button);
});

function activateQuest(trackName) {
  if (save.activeQuest) return;

  const state = save.tracks[trackName];
  const quest = QUESTS[trackName].quests[state.questIndex];
  if (!quest) return;

  save.activeQuest = {
    track: trackName,
    questIndex: state.questIndex,
    title: quest.title,
    activatedAt: new Date().toISOString()
  };
  persist();
  render();
}

function completeQuest(trackName, triggerElement) {
  const state = save.tracks[trackName];
  const trackData = QUESTS[trackName];
  const quest = trackData.quests[state.questIndex];
  if (!quest) return;
  if (!isCurrentQuestActive(trackName)) return;

  const previousLevel = state.level;
  state.xp += XP_PER_QUEST;
  state.level = calculateLevel(state.xp);
  const leveledUp = state.level > previousLevel;
  state.completed.push({
    title: quest.title,
    reward: quest.reward,
    completedAt: new Date().toISOString()
  });
  state.questIndex += 1;
  save.activeQuest = null;
  save.history.push({
    track: trackName,
    trackTitle: trackData.title,
    questTitle: quest.title,
    reward: quest.reward,
    completedAt: new Date().toISOString()
  });
  persist();
  render();
  celebrateQuestCompletion(leveledUp, triggerElement);
}

function celebrateQuestCompletion(leveledUp, triggerElement) {
  playQuestSound(leveledUp);
  launchCelebration(leveledUp, triggerElement);
}

function getAudioContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  return audioContext;
}

function playQuestSound(leveledUp) {
  const context = getAudioContext();
  if (!context) return;

  const now = context.currentTime;
  if (leveledUp) {
    [392, 523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      playBellTone(context, frequency, now + index * 0.095, 0.62);
    });
    return;
  }

  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    playTootTone(context, frequency, now + index * 0.105, index === 3 ? 0.34 : 0.18);
  });
}

function playBellTone(context, frequency, start, duration, peak = 0.16) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.04);
}

function playPluckedTone(context, frequency, start) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.995, start + 0.18);
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency * 2.4, start);
  filter.Q.setValueAtTime(5, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.08, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + 0.25);
}

function playTootTone(context, frequency, start, duration) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(frequency, start);
  oscillator.frequency.setValueAtTime(frequency * 1.01, start + 0.035);
  oscillator.frequency.setValueAtTime(frequency, start + 0.07);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1250, start);
  filter.Q.setValueAtTime(7, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.075, start + 0.012);
  gain.gain.setValueAtTime(0.075, start + duration * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.03);
}

function launchCelebration(leveledUp, triggerElement) {
  const burst = document.createElement("div");
  burst.className = `celebration-burst ${leveledUp ? "level-up" : ""}`;
  burst.setAttribute("aria-hidden", "true");

  if (!leveledUp && triggerElement) {
    const rect = triggerElement.getBoundingClientRect();
    burst.style.left = `${rect.left + rect.width / 2}px`;
    burst.style.top = `${rect.top + rect.height / 2}px`;
  }

  const count = leveledUp ? 48 : 54;
  for (let index = 0; index < count; index += 1) {
    const spark = document.createElement("span");
    const angle = (Math.PI * 2 * index) / count;
    const distance = leveledUp ? 220 + Math.random() * 120 : 150 + Math.random() * 140;
    spark.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    spark.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    spark.style.setProperty("--spin", `${Math.random() * 540 - 270}deg`);
    spark.style.animationDelay = `${Math.random() * 80}ms`;
    spark.className = index % 3 === 0 ? "confetti" : "spark";
    burst.appendChild(spark);
  }

  if (leveledUp) {
    const label = document.createElement("strong");
    label.textContent = "Level Up";
    burst.appendChild(label);
  }

  document.body.appendChild(burst);
  window.setTimeout(() => burst.remove(), 1300);
}

function isCurrentQuestActive(trackName) {
  if (!save.activeQuest) return false;
  return save.activeQuest.track === trackName && save.activeQuest.questIndex === save.tracks[trackName].questIndex;
}

function getActiveQuestDetails() {
  if (!save.activeQuest) {
    return { title: "no quest", trackTitle: "no path" };
  }

  const trackData = QUESTS[save.activeQuest.track];
  return {
    title: save.activeQuest.title || trackData.quests[save.activeQuest.questIndex]?.title || "the current quest",
    trackTitle: trackData.title
  };
}

function isValidActiveQuest(activeQuest, candidateSave) {
  if (!activeQuest) return true;
  if (!TRACKS.includes(activeQuest.track)) return false;
  const state = candidateSave.tracks[activeQuest.track];
  return Boolean(state && state.questIndex === activeQuest.questIndex && QUESTS[activeQuest.track].quests[state.questIndex]);
}

async function copyReward(trackName, button) {
  const state = save.tracks[trackName];
  const quest = QUESTS[trackName].quests[state.questIndex];
  if (!quest) return;

  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(quest.commands.join("\n"));
    button.textContent = "Copied";
  } catch {
    button.textContent = "Copy Failed";
  }
  window.setTimeout(() => { button.textContent = original; }, 1400);
}

exportButton.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(save, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "danitas-quest-save.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", async () => {
  const file = importInput.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    save = normalizeSave(JSON.parse(text));
    persist();
    render();
  } catch {
    alert("That save file could not be imported.");
  } finally {
    importInput.value = "";
  }
});

resetButton.addEventListener("click", () => {
  if (!window.confirm("Reset Danita's quest progress on this browser?")) return;
  save = defaultSave();
  persist();
  render();
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

if (isUnlocked()) {
  unlock();
} else {
  gate.classList.remove("hidden");
  app.classList.add("hidden");
  passwordInput.focus();
}
