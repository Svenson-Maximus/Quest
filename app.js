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

function defaultSave() {
  const tracks = {};
  TRACKS.forEach((track) => {
    tracks[track] = { questIndex: 0, xp: 0, level: 1, completed: [] };
  });
  return {
    player: "Danita",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

  if (!quest) {
    return `
      <article class="quest-card ${trackName}">
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
    <article class="quest-card ${trackName}">
      <div class="track-head">
        <h2>${escapeHtml(trackData.title)}</h2>
        <p>${escapeHtml(trackData.subtitle)}</p>
        ${renderStats(state, completedCount, totalCount)}
      </div>
      <div class="quest-body">
        <p class="quest-number">Quest ${state.questIndex + 1} of ${totalCount}</p>
        <h3 class="quest-title">${escapeHtml(quest.title)}</h3>
        <p class="description">${escapeHtml(quest.description)}</p>
        <h4>Objectives</h4>
        <ol class="objectives">
          ${quest.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
        </ol>
        <div class="hint"><strong>Hint:</strong> ${escapeHtml(quest.hint)}</div>
        <div class="reward"><strong>Reward:</strong> ${escapeHtml(quest.reward)}</div>
        <div class="commands">
          <strong>Reward Command</strong>
          <pre>${escapeHtml(quest.commands.join("\n"))}</pre>
        </div>
        <div class="quest-actions">
          <button type="button" data-action="complete" data-track="${trackName}">Complete Quest</button>
          <button type="button" data-action="copy" data-track="${trackName}">Copy Reward</button>
        </div>
      </div>
    </article>
  `;
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
  if (action === "complete") completeQuest(trackName);
  if (action === "copy") await copyReward(trackName, button);
});

function completeQuest(trackName) {
  const state = save.tracks[trackName];
  const trackData = QUESTS[trackName];
  const quest = trackData.quests[state.questIndex];
  if (!quest) return;

  state.xp += XP_PER_QUEST;
  state.level = calculateLevel(state.xp);
  state.completed.push({
    title: quest.title,
    reward: quest.reward,
    completedAt: new Date().toISOString()
  });
  state.questIndex += 1;
  save.history.push({
    track: trackName,
    trackTitle: trackData.title,
    questTitle: quest.title,
    reward: quest.reward,
    completedAt: new Date().toISOString()
  });
  persist();
  render();
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
