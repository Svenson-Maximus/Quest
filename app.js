const PASSWORD = "Danitas-Quest";
const SAVE_KEY = "danitas-quest-save-v1";
const UNLOCK_KEY = "danitas-quest-unlocked";
const BOOBOO_PASSWORD = "teamo";
const TRACKS = ["building", "gathering", "pathfinder"];
const XP_PER_QUEST = 100;
const XP_BOTTLE_AVERAGE = 7;
const TRACK_IMAGES = {
  building: "buildernew.png",
  gathering: "gatherernew.png",
  pathfinder: "pathfindernew.png"
};
const PROFILE_CARD_IMAGE = "profilecard.png";
const MEMORY_NOTE_KEY = "danitas-memory-notes-v1";
const SKILL_TREE_LINE_DURATION = 1400;
const SKILL_TREE_NODE_DURATION = 520;
const SKILL_TREE_STEP_GAP = 220;
const STORY_IMAGES = [
  {
    src: "storyimages/image.png",
    title: "Skycraft Memory I"
  }
];
const QUEST_ACTIVATION_SOUND = "minecraft-sound-effects-chest-sound-effect.mp3";
const QUEST_ACTIVATION_SOUND_START = 2.5;
const QUEST_ACTIVATION_SOUND_END = 3.5;
const QUEST_COMPLETE_SOUND_START = 4.3;
const QUEST_COMPLETE_SOUND_END = 4.9;
const PAGE_ENTRY_SOUND = "skairin.mp3";
const LEVEL_UP_SOUND = "42dfb7_skyrim_level_up_sound_effect.mp3";
const SKY_PARTICLE_COUNT = 200;
const PLAYER_TITLES = [
  { level: 1, title: "Hearthbound Wanderer", flavor: "The road has only just begun." },
  { level: 3, title: "Lantern Bearer", flavor: "Small duties now glow like proper vows." },
  { level: 5, title: "Hall Warden", flavor: "Home stands firmer when Danita returns." },
  { level: 8, title: "Relic Keeper", flavor: "Treasures become history instead of clutter." },
  { level: 11, title: "Road Regent", flavor: "Safe paths start to answer to her name." },
  { level: 15, title: "Mist Scribe", flavor: "The realm remembers because she writes it down." },
  { level: 20, title: "Starforged Chronicler", flavor: "Journeys and memories now shine as one tale." }
];

const gate = document.querySelector("#gate");
const app = document.querySelector("#app");
const blockSky = document.querySelector(".block-sky");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const passwordMessage = document.querySelector("#password-message");
const tracksEl = document.querySelector("#tracks");
const historyList = document.querySelector("#history-list");
const storySlider = document.querySelector("#story-slider");
const storyCounter = document.querySelector("#story-counter");
const exportButton = document.querySelector("#export-save");
const importInput = document.querySelector("#import-save");
const resetButton = document.querySelector("#reset-save");
const mainTitle = document.querySelector("#main-title");
const danitaView = document.querySelector("#danita-view");
const boobooView = document.querySelector("#booboo-view");
const menuToggle = document.querySelector("#menu-toggle");
const headerActions = document.querySelector("#header-actions");
const boobooViewButton = document.querySelector("#booboo-view-button");
const danitaViewButton = document.querySelector("#danita-view-button");
const revivalButton = document.querySelector("#revival-button");
const wishButton = document.querySelector("#wish-button");
const revivalModal = document.querySelector("#revival-modal");
const revivalContent = document.querySelector("#revival-content");
const imageModal = document.querySelector("#image-modal");
const imageModalTitle = document.querySelector("#image-modal-title");
const imageModalPreview = document.querySelector("#image-modal-preview");
const playerCardEl = document.querySelector("#player-card");
const skillTreeCard = document.querySelector("#skill-tree-card");
const wishBoardButton = document.querySelector("#wish-board-button");
const wishListEl = document.querySelector("#wish-list");
const wishModal = document.querySelector("#wish-modal");
const wishModalContent = document.querySelector("#wish-modal-content");

const REVIVAL_LEVEL_RITUALS = [
  {
    title: "Lantern of Returning Breath",
    description: "Mark the grave, then perform a quiet rite to call lost strength back without chasing danger.",
    objectives: [
      "Place 4 candles, torches, or lanterns around the grave.",
      "Stand at the headstone and leave 1 flower, sapling, or meaningful block.",
      "Wait through 1 calm sunset or sunrise moment before claiming the rite complete."
    ],
    hint: "Keep it ceremonial and safe. This quest is about honoring the death, not earning the levels through risk again.",
    reward: "Restored experience in flasks."
  },
  {
    title: "Bell of the Second Dawn",
    description: "Call the soul home with a small village rite instead of a dangerous march.",
    objectives: [
      "Visit the village bell or another central spot near the grave.",
      "Ring the bell once and walk one full circle around the grave.",
      "Place 1 candle, lantern, or flower to close the rite."
    ],
    hint: "This should take only a few minutes and keep Danita close to safety.",
    reward: "Restored experience in flasks."
  },
  {
    title: "Ash and Bread Offering",
    description: "A small household ritual can be enough to call back lost knowledge.",
    objectives: [
      "Place 1 campfire, candle, or lantern near the grave.",
      "Leave 1 bread, berry, or cooked food item in a chest or barrel beside it.",
      "Read or place a short sign naming what was lost before closing the rite."
    ],
    hint: "Any peaceful symbolic offering works as long as it feels intentional.",
    reward: "Restored experience in flasks."
  }
];

const REVIVAL_ITEM_RITUALS = [
  {
    title: "Ritual Book of Return",
    description: "Before reclaiming lost gear, Danita must write the ritual words and a short memory of the death, then leave them on a lectern.",
    objectives: [
      "Write in a book something for the ritual of return.",
      "Add a small thought about the death and how it happened.",
      "Place the written book on a lectern before opening the recovery commands."
    ],
    hint: "Keep it short and personal. The important part is that the book records both the ritual and the memory of the death.",
    reward: "Creative restore commands."
  },
  {
    title: "Ritual Book of Return",
    description: "Before reclaiming lost gear, Danita must write the ritual words and a short memory of the death, then leave them on a lectern.",
    objectives: [
      "Write in a book something for the ritual of return.",
      "Add a small thought about the death and how it happened.",
      "Place the written book on a lectern before opening the recovery commands."
    ],
    hint: "Keep it short and personal. The important part is that the book records both the ritual and the memory of the death.",
    reward: "Creative restore commands."
  },
  {
    title: "Ritual Book of Return",
    description: "Before reclaiming lost gear, Danita must write the ritual words and a short memory of the death, then leave them on a lectern.",
    objectives: [
      "Write in a book something for the ritual of return.",
      "Add a small thought about the death and how it happened.",
      "Place the written book on a lectern before opening the recovery commands."
    ],
    hint: "Keep it short and personal. The important part is that the book records both the ritual and the memory of the death.",
    reward: "Creative restore commands."
  }
];

let save = loadSave();
let audioContext;
let activationAudio;
let activationAudioStopTimer;
let completionAudio;
let completionAudioStopTimer;
let pageEntryAudio;
let levelUpAudio;
let wishDraft = createWishDraft();
let openWishId = null;
let wishModalMode = "compose";
let currentView = "danita";
let selectedBoobooWishId = null;
let boobooUnlocked = false;
let currentStoryIndex = 0;
let menuOpen = false;
let memoryNotes = loadMemoryNotes();
let skillTreeAnimated = false;

populateBlockSky();

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
    wishes: [],
    history: [],
    revival: defaultRevivalState()
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
    activeQuest: normalizeActiveQuest(candidate.activeQuest),
    tracks: { ...base.tracks, ...(candidate.tracks || {}) },
    wishes: Array.isArray(candidate.wishes) ? candidate.wishes.map(normalizeWish).filter(Boolean) : [],
    history: Array.isArray(candidate.history) ? candidate.history : [],
    revival: normalizeRevivalState(candidate.revival)
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
  } else if (merged.activeQuest) {
    const activeObjectives = QUESTS[merged.activeQuest.track].quests[merged.activeQuest.questIndex].objectives;
    merged.activeQuest.objectiveProgress = normalizeObjectiveProgress(merged.activeQuest.objectiveProgress, activeObjectives);
  }

  return merged;
}

function normalizeActiveQuest(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  return {
    track: candidate.track || "",
    questIndex: Number.isFinite(candidate.questIndex) ? candidate.questIndex : 0,
    title: candidate.title || "",
    activatedAt: candidate.activatedAt || new Date().toISOString(),
    objectiveProgress: Array.isArray(candidate.objectiveProgress) ? candidate.objectiveProgress : []
  };
}

function createWishDraft() {
  return {
    project: "",
    note: "",
    bribe: "",
    materials: Array.from({ length: 4 }, () => ({ name: "", quantity: "" }))
  };
}

function populateBlockSky() {
  if (!blockSky) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < SKY_PARTICLE_COUNT; index += 1) {
    const particle = document.createElement("span");
    const size = 2 + Math.random() * 4;
    const glow = 10 + Math.random() * 14;
    const duration = 10 + Math.random() * 16;
    const drift = Math.random() < 0.2 ? "rgba(240, 242, 214, 0.62)" : "rgba(184, 215, 216, 0.62)";

    particle.style.setProperty("--left", `${Math.random() * 100}%`);
    particle.style.setProperty("--top", `${-4 - Math.random() * 18}%`);
    particle.style.setProperty("--size", `${size.toFixed(2)}px`);
    particle.style.setProperty("--duration", `${duration.toFixed(2)}s`);
    particle.style.setProperty("--delay", `${(-Math.random() * duration).toFixed(2)}s`);
    particle.style.setProperty("--particle-opacity", (0.45 + Math.random() * 0.45).toFixed(2));
    particle.style.setProperty("--glow", `${glow.toFixed(2)}px`);
    particle.style.setProperty("--particle-glow", drift);
    particle.style.setProperty("--particle-color", Math.random() < 0.14 ? "rgba(255, 246, 210, 0.84)" : "rgba(240, 246, 244, 0.78)");
    fragment.appendChild(particle);
  }

  blockSky.replaceChildren(fragment);
}

function normalizeWish(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const materials = Array.isArray(candidate.materials)
    ? candidate.materials
      .map((entry) => ({
        name: typeof entry?.name === "string" ? entry.name.trim() : "",
        quantity: typeof entry?.quantity === "string" || Number.isFinite(entry?.quantity)
          ? String(entry.quantity).trim()
          : ""
      }))
      .filter((entry) => entry.name && entry.quantity)
    : [];

  return {
    id: candidate.id || `wish-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: candidate.createdAt || new Date().toISOString(),
    project: candidate.project || "Unnamed Build Wish",
    note: candidate.note || "",
    bribe: candidate.bribe || "",
    materials,
    status: normalizeWishStatus(candidate.status),
    reviewedAt: candidate.reviewedAt || "",
    reviewedBy: candidate.reviewedBy || "",
    denialReason: candidate.denialReason || "",
    approvedItems: normalizeApprovedItems(candidate.approvedItems, materials),
    quest: candidate.quest && typeof candidate.quest === "object" ? {
      title: candidate.quest.title || "Booboo's Supply Run",
      description: candidate.quest.description || "",
      objectives: Array.isArray(candidate.quest.objectives) ? candidate.quest.objectives : []
    } : generateWishQuest({
      project: candidate.project || "Unnamed Build Wish",
      note: candidate.note || "",
      bribe: candidate.bribe || "",
      materials
    })
  };
}

function normalizeWishStatus(status) {
  return ["pending", "accepted", "denied"].includes(status) ? status : "pending";
}

function normalizeApprovedItems(candidate, fallbackMaterials = []) {
  const base = Array.isArray(candidate) ? candidate : [];
  const normalized = base
    .map((entry) => normalizeApprovedItem(entry))
    .filter(Boolean);

  if (normalized.length) {
    return normalized;
  }

  return fallbackMaterials.map((entry) => ({
    itemId: suggestItemId(entry.name),
    amount: entry.quantity
  }));
}

function normalizeApprovedItem(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const itemId = typeof candidate.itemId === "string"
    ? sanitizeItemId(candidate.itemId)
    : "";
  const amount = typeof candidate.amount === "string" || Number.isFinite(candidate.amount)
    ? String(candidate.amount).trim()
    : "";

  if (!itemId && !amount) {
    return null;
  }

  return {
    itemId,
    amount
  };
}

function defaultRevivalState() {
  return {
    deathCount: 0,
    current: null
  };
}

function normalizeRevivalState(candidate) {
  const base = defaultRevivalState();
  if (!candidate || typeof candidate !== "object") {
    return base;
  }

  return {
    deathCount: Number.isFinite(candidate.deathCount) ? candidate.deathCount : base.deathCount,
    current: normalizeRevivalJourney(candidate.current)
  };
}

function normalizeRevivalJourney(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const graveObjectives = [
    "Build a grave, cairn, or memorial marker inside the village.",
    "Add at least 1 sign, flower, candle, torch, or other personal detail.",
    "Place it somewhere Danita can revisit later as part of the story."
  ];

  return {
    id: candidate.id || `revival-${Date.now()}`,
    deathNumber: Number.isFinite(candidate.deathNumber) ? candidate.deathNumber : 1,
    startedAt: candidate.startedAt || new Date().toISOString(),
    graveBuilt: Boolean(candidate.graveBuilt),
    graveProgress: normalizeObjectiveProgress(candidate.graveProgress, graveObjectives),
    levelQuest: normalizeRevivalQuest(candidate.levelQuest),
    itemQuest: normalizeRevivalQuest(candidate.itemQuest),
    previousLevel: Number.isFinite(candidate.previousLevel) ? candidate.previousLevel : null,
    xpReward: candidate.xpReward && typeof candidate.xpReward === "object" ? {
      totalXp: Number.isFinite(candidate.xpReward.totalXp) ? candidate.xpReward.totalXp : 0,
      bottleCount: Number.isFinite(candidate.xpReward.bottleCount) ? candidate.xpReward.bottleCount : 0,
      commands: Array.isArray(candidate.xpReward.commands) ? candidate.xpReward.commands : []
    } : null
  };
}

function normalizeRevivalQuest(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }

  const objectives = Array.isArray(candidate.objectives) ? candidate.objectives : [];

  return {
    title: candidate.title || "Unnamed Rite",
    description: candidate.description || "",
    objectives,
    hint: candidate.hint || "",
    reward: candidate.reward || "",
    completed: Boolean(candidate.completed),
    objectiveProgress: normalizeObjectiveProgress(candidate.objectiveProgress, objectives)
  };
}

function normalizeObjectiveProgress(candidate, objectives) {
  return objectives.map((_, index) => Boolean(Array.isArray(candidate) && candidate[index]));
}

function areObjectivesComplete(progress) {
  return Array.isArray(progress) && progress.length > 0 && progress.every(Boolean);
}

function renderObjectiveList(objectives, options = {}) {
  const {
    checkboxes = false,
    progress = [],
    disabled = false,
    action = "",
    context = ""
  } = options;

  const className = checkboxes ? "objectives checklist" : "objectives";
  return `
    <ol class="${className}">
      ${objectives.map((objective, index) => {
        if (!checkboxes) {
          return `<li>${escapeHtml(objective)}</li>`;
        }

        const checkboxId = `${context}-objective-${index}`;
        return `
          <li>
            <label class="objective-check" for="${escapeHtml(checkboxId)}">
              <input
                id="${escapeHtml(checkboxId)}"
                type="checkbox"
                data-action="${escapeHtml(action)}"
                data-index="${index}"
                ${progress[index] ? "checked" : ""}
                ${disabled ? "disabled" : ""}
              >
              <span>${escapeHtml(objective)}</span>
            </label>
          </li>
        `;
      }).join("")}
    </ol>
  `;
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
  renderPlayerCard();
  renderSkillTreeCard();
  renderWishBoard();
  renderBoobooView();
  renderHistory();
  renderStorySlider();
  renderRevivalModal();
  renderWishModal();
  syncViewState();
}

function renderBoobooView() {
  const pendingCount = save.wishes.filter((wish) => wish.status === "pending").length;
  const selectedWish = save.wishes.find((wish) => wish.id === selectedBoobooWishId) || null;
  const reviewWish = selectedWish || save.wishes.find((wish) => wish.status === "pending") || save.wishes[0] || null;

  if (reviewWish) {
    selectedBoobooWishId = reviewWish.id;
  }

  if (!isBoobooUnlocked()) {
    boobooView.innerHTML = `
      <section class="booboo-shell">
        <article class="booboo-panel">
          <p class="eyebrow">Booboo Access</p>
          <h2>Enter The Booboo Page</h2>
          <p class="helper-copy">Pending letters wait here for approval. Use the password to open the review table.</p>
          <form id="booboo-password-form" class="booboo-password-form">
            <label class="field-label" for="booboo-password">Password</label>
            <div class="password-row">
              <input id="booboo-password" type="password" autocomplete="current-password" placeholder="Enter Booboo password">
              <button type="submit">Unlock</button>
            </div>
            <p id="booboo-password-message" class="form-message" role="status"></p>
          </form>
        </article>
      </section>
    `;
    return;
  }

  boobooView.innerHTML = `
    <section class="booboo-shell">
      <article class="booboo-panel">
        <div class="booboo-head">
          <div>
            <p class="eyebrow">Booboo Command Board</p>
            <h2>Letter Review</h2>
            <p class="helper-copy">${pendingCount} pending ${pendingCount === 1 ? "letter" : "letters"} waiting for approval.</p>
          </div>
          <div class="booboo-links">
            <a href="https://minecraft.wiki/w/Java_Edition_data_values/Items" target="_blank" rel="noreferrer">Minecraft Wiki Item IDs</a>
            <a href="https://mcutils.com/item-ids" target="_blank" rel="noreferrer">MC Utils Item Search</a>
          </div>
        </div>
        <div class="booboo-layout">
          <section class="booboo-list">
            ${renderBoobooWishList()}
          </section>
          <section class="booboo-review">
            ${reviewWish ? renderBoobooReview(reviewWish) : "<p class=\"wish-empty\">No letters exist yet.</p>"}
          </section>
        </div>
      </article>
    </section>
  `;
}

function renderBoobooWishList() {
  if (!save.wishes.length) {
    return "<p class=\"wish-empty\">No letters to review yet.</p>";
  }

  return save.wishes
    .slice()
    .reverse()
    .map((wish) => `
      <button
        type="button"
        class="booboo-list-item ${wish.id === selectedBoobooWishId ? "active" : ""}"
        data-action="select-booboo-wish"
        data-wish-id="${escapeHtml(wish.id)}"
      >
        <span class="wish-status ${escapeHtml(wish.status)}">${escapeHtml(formatWishStatus(wish.status))}</span>
        <strong>${escapeHtml(wish.project)}</strong>
        <span>${new Date(wish.createdAt).toLocaleString()}</span>
      </button>
    `)
    .join("");
}

function renderBoobooReview(wish) {
  return `
    <article class="booboo-review-card">
      <div class="booboo-review-head">
        <div>
          <span class="wish-status ${escapeHtml(wish.status)}">${escapeHtml(formatWishStatus(wish.status))}</span>
          <h3>${escapeHtml(wish.project)}</h3>
          <p class="helper-copy">Sent ${new Date(wish.createdAt).toLocaleString()}</p>
        </div>
      </div>
      <section class="wish-letter-section">
        <h3>Requested Materials</h3>
        <ul class="wish-material-list">
          ${wish.materials.map((entry) => `<li><strong>${escapeHtml(entry.quantity)}x</strong> ${escapeHtml(entry.name)}</li>`).join("")}
        </ul>
      </section>
      <section class="wish-letter-section">
        <h3>Danita's Note</h3>
        <p>${escapeHtml(wish.note || "No extra build note was written.")}</p>
      </section>
      <section class="wish-letter-section">
        <h3>Bribe / Sweetener</h3>
        <p>${escapeHtml(wish.bribe || "No extra bribery was offered.")}</p>
      </section>
      <section class="wish-letter-section">
        <h3>Quest Booboo Receives</h3>
        <p>${escapeHtml(wish.quest.description)}</p>
        <ol class="wish-quest-list">
          ${wish.quest.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
        </ol>
      </section>
      <section class="wish-letter-section">
        <h3>Booboo Command Builder</h3>
        <p class="helper-copy">Search the local suggestion list or type any valid Java item id manually. Accepted commands appear back on Danita's board.</p>
        <div class="approval-grid">
          ${wish.approvedItems.map((entry, index) => renderApprovedItemRow(entry, index)).join("")}
        </div>
        <div class="wish-actions">
          <button type="button" data-action="add-approved-item" data-wish-id="${escapeHtml(wish.id)}">Add Item</button>
        </div>
      </section>
      ${wish.status === "denied" ? `
        <section class="wish-letter-section">
          <h3>Denial Reason</h3>
          <p>${escapeHtml(wish.denialReason || "No reason saved.")}</p>
        </section>
      ` : ""}
      <div class="wish-actions approval-actions">
        <button type="button" data-action="accept-wish" data-wish-id="${escapeHtml(wish.id)}">Accept Letter</button>
        <button type="button" data-action="deny-wish" data-wish-id="${escapeHtml(wish.id)}" class="danger">Deny Letter</button>
      </div>
    </article>
  `;
}

function renderApprovedItemRow(entry, index) {
  const datalistId = `minecraft-item-options-${index}`;
  const suggestions = getMinecraftItemSuggestions(entry.itemId || "");

  return `
    <div class="approval-row">
      <div>
        <label class="field-label" for="approved-item-${index}">Minecraft Item</label>
        <input
          id="approved-item-${index}"
          type="text"
          class="approved-item-input"
          list="${datalistId}"
          data-action="approved-item-id"
          data-index="${index}"
          value="${escapeHtml(entry.itemId)}"
          placeholder="minecraft:oak_log or oak_log"
        >
        <datalist id="${datalistId}">
          ${suggestions.map((itemId) => `<option value="${escapeHtml(itemId)}">${escapeHtml(formatItemLabel(itemId))}</option>`).join("")}
        </datalist>
      </div>
      <div>
        <label class="field-label" for="approved-amount-${index}">Amount</label>
        <input
          id="approved-amount-${index}"
          type="number"
          min="1"
          step="1"
          data-action="approved-item-amount"
          data-index="${index}"
          value="${escapeHtml(entry.amount || "")}"
          placeholder="64"
        >
      </div>
      <div class="approval-row-actions">
        <code>${escapeHtml(buildGiveCommand(entry))}</code>
        <button type="button" data-action="remove-approved-item" data-index="${index}" class="secondary">Remove</button>
      </div>
    </div>
  `;
}

function syncViewState() {
  const showDanita = currentView === "danita";
  const showBooboo = currentView === "booboo";

  danitaView.classList.toggle("hidden", !showDanita);
  boobooView.classList.toggle("hidden", !showBooboo);
  danitaViewButton.classList.toggle("hidden", showDanita);
  boobooViewButton.classList.toggle("hidden", showBooboo);
  headerActions.classList.toggle("hidden", !menuOpen);
  menuToggle.setAttribute("aria-expanded", String(menuOpen));
}

function renderTrack(trackName) {
  const trackData = QUESTS[trackName];
  const state = save.tracks[trackName];
  const quest = trackData.quests[state.questIndex];
  const completedCount = state.completed.length;
  const totalCount = trackData.quests.length;
  const isActive = isCurrentQuestActive(trackName);
  const isLocked = Boolean(save.activeQuest) && !isActive;
  const objectiveProgress = isActive ? save.activeQuest.objectiveProgress : [];

  if (!quest) {
    return `
      <article class="quest-card ${trackName} ${isActive ? "active-quest" : ""}">
        <div class="track-head">
          ${renderTrackHeader(trackName, trackData, state, completedCount, totalCount)}
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
        ${renderTrackHeader(trackName, trackData, state, completedCount, totalCount)}
      </div>
      <div class="quest-body">
        <p class="quest-number">Quest ${state.questIndex + 1} of ${totalCount}</p>
        <h3 class="quest-title">${escapeHtml(quest.title)}</h3>
        ${renderQuestStatus(trackName, isActive, isLocked)}
        <p class="description">${escapeHtml(quest.description)}</p>
        <h4>Objectives</h4>
        ${renderObjectiveList(quest.objectives, {
          checkboxes: isActive,
          progress: objectiveProgress,
          disabled: !isActive,
          action: "toggle-objective",
          context: `${trackName}-${state.questIndex}`
        })}
        <details class="hint">
          <summary>How To Do It</summary>
          <p>${escapeHtml(quest.hint)}</p>
        </details>
        <div class="reward"><strong>Reward:</strong> ${escapeHtml(quest.reward)}</div>
        <div class="commands">
          <strong>Reward Command</strong>
          <div class="command-list">
            ${quest.commands.map((command) => `
              <div class="command-row">
                <code>${escapeHtml(command)}</code>
                <button type="button" data-action="copy-command" data-command="${escapeHtml(command)}">Copy</button>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="quest-actions">
          ${renderPrimaryAction(trackName, isActive, isLocked)}
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
    return `<button type="button" data-action="complete" data-track="${trackName}" ${areObjectivesComplete(save.activeQuest.objectiveProgress) ? "" : "disabled"}>Complete Active Quest</button>`;
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

function renderPlayerCard() {
  const profile = getPlayerProfile();
  const nextTitle = PLAYER_TITLES.find((entry) => entry.level > profile.playerLevel);

  playerCardEl.innerHTML = `
    <div class="player-card-head">
      <div>
        <p class="eyebrow">Player Card</p>
        <h2>${escapeHtml(save.player)}</h2>
      </div>
    </div>
    <div class="player-level-medallion card-corner">Lv ${profile.playerLevel}</div>
    <div class="profile-card-button">
      <img class="profile-card-image" src="${PROFILE_CARD_IMAGE}" alt="${escapeHtml(save.player)} profile card">
      <div class="profile-card-overlay">
        <strong>${escapeHtml(save.player)}</strong>
        <span>Danita</span>
      </div>
    </div>
    <div class="player-card-caption">
      <p class="eyebrow">Current Cosmetic Title</p>
      <strong>${escapeHtml(profile.currentTitle.title)}</strong>
      <span>${escapeHtml(profile.currentTitle.flavor)}</span>
    </div>
    <div class="player-card-meta">
      <p><strong>Overall Level:</strong> ${profile.playerLevel}</p>
      <p><strong>Total XP:</strong> ${profile.totalXp}</p>
      <p><strong>Quests Completed:</strong> ${profile.totalComplete}</p>
      <p><strong>Highest Path Level:</strong> ${profile.highestPathLevel}</p>
      <p><strong>Strongest Path:</strong> ${escapeHtml(profile.strongestPath)}</p>
      <p><strong>Next Cosmetic:</strong> ${nextTitle ? `${escapeHtml(nextTitle.title)} at Lv ${nextTitle.level}` : "All titles unlocked"}</p>
    </div>
  `;
}

function renderWishBoard() {
  if (!save.wishes.length) {
    wishListEl.innerHTML = "<p class=\"wish-empty\">No letters sent yet. Write a Skyrim-style material request to Booboo and it will stay here after sending.</p>";
    return;
  }

  wishListEl.innerHTML = save.wishes
    .slice()
    .reverse()
    .map((wish) => `
      <article class="wish-card">
        <div class="wish-card-head">
          <div>
            <span class="wish-status ${escapeHtml(wish.status)}">${escapeHtml(formatWishStatus(wish.status))}</span>
            <strong>${escapeHtml(wish.project)}</strong>
            <span>${new Date(wish.createdAt).toLocaleString()}</span>
          </div>
          <button type="button" data-action="open-wish" data-wish-id="${escapeHtml(wish.id)}">Open Letter</button>
        </div>
        <p>${escapeHtml(wish.quest.title)}</p>
        <div class="wish-material-preview">
          ${wish.materials.slice(0, 4).map((entry) => `<span>${escapeHtml(entry.quantity)}x ${escapeHtml(entry.name)}</span>`).join("")}
        </div>
      </article>
    `)
    .join("");
}

function renderWishModal() {
  if (wishModal.classList.contains("hidden")) {
    return;
  }

  if (wishModalMode === "read") {
    const wish = save.wishes.find((entry) => entry.id === openWishId);
    if (!wish) {
      closeWishModal();
      return;
    }

    wishModalContent.innerHTML = `
      <article class="wish-letter parchment">
        <p class="wish-seal">Booboo Supply Petition</p>
        <h2 id="wish-modal-title">${escapeHtml(wish.project)}</h2>
        <p class="wish-meta">Sent ${new Date(wish.createdAt).toLocaleString()}</p>
        <p class="wish-meta"><strong>Status:</strong> ${escapeHtml(formatWishStatus(wish.status))}</p>
        <section class="wish-letter-section">
          <h3>Requested Materials</h3>
          <ul class="wish-material-list">
            ${wish.materials.map((entry) => `<li><strong>${escapeHtml(entry.quantity)}x</strong> ${escapeHtml(entry.name)}</li>`).join("")}
          </ul>
        </section>
        <section class="wish-letter-section">
          <h3>Why Danita Wants It</h3>
          <p>${escapeHtml(wish.note || "No extra build note was written.")}</p>
        </section>
        <section class="wish-letter-section">
          <h3>Bribe / Sweetener</h3>
          <p>${escapeHtml(wish.bribe || "No extra bribery was offered.")}</p>
        </section>
        <section class="wish-letter-section">
          <h3>Quest Booboo Receives</h3>
          <p>${escapeHtml(wish.quest.description)}</p>
          <ol class="wish-quest-list">
            ${wish.quest.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
          </ol>
        </section>
        ${wish.status === "accepted" ? `
          <section class="wish-letter-section">
            <h3>Approved Copy Commands</h3>
            <div class="command-list">
              ${wish.approvedItems
                .filter((entry) => entry.itemId && entry.amount)
                .map((entry) => `
                  <div class="command-row">
                    <code>${escapeHtml(buildGiveCommand(entry))}</code>
                    <button type="button" data-action="copy-command" data-command="${escapeHtml(buildGiveCommand(entry))}">Copy</button>
                  </div>
                `).join("") || "<p>No approved copy commands saved yet.</p>"}
            </div>
          </section>
        ` : ""}
        ${wish.status === "denied" ? `
          <section class="wish-letter-section">
            <h3>Denied By Booboo</h3>
            <p>${escapeHtml(wish.denialReason || "No reason was written.")}</p>
          </section>
        ` : ""}
        <div class="wish-actions">
          <button type="button" data-action="delete-wish" data-wish-id="${escapeHtml(wish.id)}" class="danger">Delete Letter</button>
        </div>
      </article>
    `;
    return;
  }

  wishModalContent.innerHTML = `
    <article class="wish-letter parchment">
      <p class="wish-seal">Booboo Supply Petition</p>
      <h2 id="wish-modal-title">Write A Wish Letter</h2>
      <p class="wish-meta">Ask for building supplies, a project goal, and maybe a little bribery.</p>
      <div class="wish-form">
        <label class="field-label" for="wish-project">What is being built?</label>
        <input id="wish-project" type="text" value="${escapeHtml(wishDraft.project)}" placeholder="Example: village bathhouse roof">

        <label class="field-label" for="wish-note">Why is it needed?</label>
        <textarea id="wish-note" rows="4" placeholder="Explain the build, the mood, or what Danita wants finished.">${escapeHtml(wishDraft.note)}</textarea>

        <div class="wish-materials-head">
          <strong>Material List</strong>
          <button type="button" data-action="add-wish-row">Add Line</button>
        </div>
        <div class="wish-material-editor">
          ${wishDraft.materials.map((entry, index) => `
            <div class="wish-row">
              <input type="text" data-field="wish-material-name" data-index="${index}" value="${escapeHtml(entry.name)}" placeholder="Material">
              <input type="text" data-field="wish-material-quantity" data-index="${index}" value="${escapeHtml(entry.quantity)}" placeholder="Amount">
            </div>
          `).join("")}
        </div>

        <label class="field-label" for="wish-bribe">Bribe / sweet message</label>
        <textarea id="wish-bribe" rows="3" placeholder="Massage, compliment, snack promise, or anything persuasive.">${escapeHtml(wishDraft.bribe)}</textarea>

        <div class="wish-actions">
          <button type="button" data-action="send-wish">Send Letter</button>
          <button type="button" data-action="close-wish">Cancel</button>
        </div>
      </div>
    </article>
  `;
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
      <details class="history-item">
        <summary>
          <strong>${escapeHtml(entry.trackTitle)}: ${escapeHtml(entry.questTitle)}</strong>
          <span>${new Date(entry.completedAt).toLocaleString()}</span>
        </summary>
        <div class="history-detail">
          <p>${escapeHtml(entry.description || "No description saved for this older chronicle entry.")}</p>
          ${Array.isArray(entry.objectives) ? `
            <ol>
              ${entry.objectives.map((objective) => `<li>${escapeHtml(objective)}</li>`).join("")}
            </ol>
          ` : ""}
          <div><strong>Reward:</strong> ${escapeHtml(entry.reward)}</div>
          ${Array.isArray(entry.commands) ? `
            <div class="history-commands">
              ${entry.commands.map((command) => `<code>${escapeHtml(command)}</code>`).join("")}
            </div>
          ` : ""}
        </div>
      </details>
    `)
    .join("");
}

function renderStorySlider() {
  if (!storySlider || !storyCounter) return;

  if (!STORY_IMAGES.length) {
    storyCounter.textContent = "0 / 0";
    storySlider.innerHTML = "<p class=\"story-empty\">No story images have been added yet.</p>";
    return;
  }

  currentStoryIndex = Math.max(0, Math.min(currentStoryIndex, STORY_IMAGES.length - 1));
  const currentImage = STORY_IMAGES[currentStoryIndex];
  const currentNote = memoryNotes[currentImage.src] || "";
  storyCounter.textContent = `${currentStoryIndex + 1} / ${STORY_IMAGES.length}`;
  storySlider.innerHTML = `
    <button type="button" class="story-nav secondary" data-action="story-prev" ${STORY_IMAGES.length > 1 ? "" : "disabled"} aria-label="Previous story image">&larr;</button>
    <div class="story-memory-layout">
      <div class="story-slide-shell">
        ${STORY_IMAGES.map((image, index) => `
          <figure class="story-slide ${index === currentStoryIndex ? "active" : ""}">
            <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.title)}">
            <figcaption>${escapeHtml(image.title)}</figcaption>
          </figure>
        `).join("")}
      </div>
      <aside class="memory-note-card">
        <p class="eyebrow">Quick Note</p>
        <label class="field-label" for="memory-note">Memory Note</label>
        <textarea id="memory-note" class="memory-note-input" data-action="memory-note" rows="10" placeholder="Write a quick memory about this image...">${escapeHtml(currentNote)}</textarea>
      </aside>
    </div>
    <button type="button" class="story-nav secondary" data-action="story-next" ${STORY_IMAGES.length > 1 ? "" : "disabled"} aria-label="Next story image">&rarr;</button>
  `;
}

function renderSkillTreeCard() {
  const profile = getPlayerProfile();
  const nextTitle = PLAYER_TITLES.find((entry) => entry.level > profile.playerLevel);
  const journey = getJourneyMapData();
  if (!skillTreeCard) return;

  skillTreeCard.innerHTML = `
    <div class="journey-copy">
      <p class="eyebrow">Danita's Journey</p>
      <h2>Quest Skill Tree</h2>
      <p>The branches stay here beside the player card. Use the button to replay the progress animation.</p>
    </div>
    <div class="journey-stats">
      <p><strong>Overall Level:</strong> ${profile.playerLevel}</p>
      <p><strong>Total XP:</strong> ${profile.totalXp}</p>
      <p><strong>Quests Completed:</strong> ${profile.totalComplete}</p>
      <p><strong>Highest Path Level:</strong> ${profile.highestPathLevel}</p>
      <p><strong>Strongest Path:</strong> ${escapeHtml(profile.strongestPath)}</p>
      <p><strong>Next Cosmetic:</strong> ${nextTitle ? `${escapeHtml(nextTitle.title)} at Lv ${nextTitle.level}` : "All titles unlocked"}</p>
    </div>
    <div class="journey-stage ${skillTreeAnimated ? "animated" : ""}">
        ${journey.columns.map((column) => `
          <div class="journey-track-label top" style="--x:${column.x};">
            <strong>${escapeHtml(column.title)}</strong>
            <span>${escapeHtml(column.progress)}</span>
          </div>
        `).join("")}
        <svg class="journey-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${journey.segments.map((segment) => `
            <line
              class="journey-path ${escapeHtml(segment.track)}"
              style="--path-length:${segment.length.toFixed(2)}; --path-delay:${segment.delay}ms; --path-duration:${segment.duration}ms;"
              x1="${segment.from.x}"
              y1="${segment.from.y}"
              x2="${segment.to.x}"
              y2="${segment.to.y}"
            ></line>
          `).join("")}
        </svg>
        ${journey.nodes.map((node) => `
          <div
            class="journey-node completed ${escapeHtml(node.track)}"
            style="--x:${node.x}; --y:${node.y}; --delay:${node.delay}ms; --node-duration:${node.duration}ms;"
            title="${escapeHtml(node.label)}"
            aria-label="${escapeHtml(node.label)}"
          ></div>
        `).join("")}
    </div>
    <div class="skill-tree-actions">
      <button type="button" data-action="play-skill-tree" ${journey.completedCount ? "" : "disabled"}>Play Progress Animation</button>
    </div>
    ${journey.completedCount ? "" : "<p class=\"journey-empty\">No completed quests yet. Finish a quest and the first branch will appear here.</p>"}
  `;
}

function getPlayerProfile() {
  const states = TRACKS.map((track) => ({ name: track, ...save.tracks[track] }));
  const totalXp = states.reduce((sum, state) => sum + state.xp, 0);
  const totalComplete = states.reduce((sum, state) => sum + state.completed.length, 0);
  const playerLevel = Math.floor(totalXp / 300) + 1;
  const strongest = states.slice().sort((a, b) => b.level - a.level || b.xp - a.xp)[0];
  const highestPathLevel = Math.max(...states.map((state) => state.level));
  const currentTitle = PLAYER_TITLES.filter((entry) => entry.level <= playerLevel).slice(-1)[0] || PLAYER_TITLES[0];

  return {
    totalXp,
    totalComplete,
    playerLevel,
    highestPathLevel,
    strongestPath: QUESTS[strongest.name].title,
    currentTitle
  };
}

function getJourneyMapData() {
  const startX = 18;
  const spacingX = 32;
  const topY = 28;
  const stepY = 14;
  const columns = TRACKS.map((track, index) => {
    const completed = save.tracks[track].completed.length;
    return {
      track,
      x: startX + (index * spacingX),
      title: QUESTS[track].title,
      progress: `${completed} done`
    };
  });

  const nodes = [];
  columns.forEach((column) => {
    const total = save.tracks[column.track].completed.length;
    for (let index = 0; index < total; index += 1) {
      const y = topY + (index * stepY);
      nodes.push({
        track: column.track,
        questIndex: index,
        x: column.x,
        y,
        delay: 0,
        duration: SKILL_TREE_NODE_DURATION,
        label: `${QUESTS[column.track].title} quest ${index + 1}`
      });
    }
  });

  const trackQuestCounts = Object.fromEntries(TRACKS.map((track) => [track, 0]));
  const orderedProgress = [];

  save.history
    .filter((entry) => TRACKS.includes(entry.track))
    .forEach((entry, index) => {
      const questIndex = trackQuestCounts[entry.track];
      trackQuestCounts[entry.track] += 1;

      const node = nodes.find((item) => item.track === entry.track && item.questIndex === questIndex);
      if (!node) return;

      node.label = `${entry.trackTitle}: ${entry.questTitle}`;
      orderedProgress.push({
        index,
        track: entry.track,
        questIndex,
        node
      });
    });

  const segments = [];
  let elapsed = 0;
  orderedProgress.forEach((step) => {
    const { node, track, questIndex } = step;
    if (questIndex === 0) {
      node.delay = elapsed;
      elapsed += SKILL_TREE_NODE_DURATION + SKILL_TREE_STEP_GAP;
      return;
    }

    const from = nodes.find((item) => item.track === track && item.questIndex === questIndex - 1);
    if (!from) {
      node.delay = elapsed;
      elapsed += SKILL_TREE_NODE_DURATION + SKILL_TREE_STEP_GAP;
      return;
    }

    segments.push({
      track,
      from,
      to: node,
      delay: elapsed,
      duration: SKILL_TREE_LINE_DURATION,
      length: Math.sqrt(((node.x - from.x) ** 2) + ((node.y - from.y) ** 2))
    });
    elapsed += SKILL_TREE_LINE_DURATION;
    node.delay = elapsed;
    elapsed += SKILL_TREE_NODE_DURATION + SKILL_TREE_STEP_GAP;
  });

  return {
    columns,
    nodes,
    segments,
    completedCount: orderedProgress.length
  };
}

function loadMemoryNotes() {
  try {
    const raw = localStorage.getItem(MEMORY_NOTE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function persistMemoryNotes() {
  localStorage.setItem(MEMORY_NOTE_KEY, JSON.stringify(memoryNotes, null, 2));
}

function playSkillTreeAnimation() {
  if (!skillTreeCard) return;
  skillTreeAnimated = false;
  renderSkillTreeCard();
  window.requestAnimationFrame(() => {
    skillTreeAnimated = true;
    renderSkillTreeCard();
  });
}

function launchLevelUpDance() {
  const existing = document.querySelector(".level-up-dance");
  if (existing) existing.remove();

  const dance = document.createElement("div");
  dance.className = "level-up-dance";
  dance.setAttribute("aria-hidden", "true");
  dance.innerHTML = `
    <img src="danitadance.gif" alt="">
    <strong>Level Up</strong>
  `;
  document.body.appendChild(dance);
  window.setTimeout(() => dance.remove(), 7000);
}

function renderTrackHeader(trackName, trackData, state, completedCount, totalCount) {
  return `
    <div class="track-title-row">
      <div>
        <h2>${escapeHtml(trackData.title)}</h2>
        <p>${escapeHtml(trackData.subtitle)}</p>
      </div>
      <button class="track-image-button" type="button" data-action="open-track-image" data-track="${escapeHtml(trackName)}" aria-label="View ${escapeHtml(trackData.title)} image larger">
        <img class="track-image" src="${TRACK_IMAGES[trackName]}" alt="${escapeHtml(trackData.title)} crest">
      </button>
    </div>
    ${renderStats(state, completedCount, totalCount)}
  `;
}

function renderRevivalModal() {
  const journey = save.revival.current;

  if (!journey) {
    revivalContent.innerHTML = `
      <div class="modal-copy">
        <p class="eyebrow">Revival Rites</p>
        <h2 id="revival-title">Return After Death</h2>
        <p>Press the rite below after a death. It starts a short symbolic recovery quest inside the village, with a grave first, then level restoration and optional item restoration.</p>
      </div>
      <div class="revival-actions">
        <button type="button" data-action="start-revival">Begin Revival Rite</button>
      </div>
    `;
    return;
  }

  const showNextRites = journey.graveBuilt;
  const xpReward = renderXpReward(journey);

  revivalContent.innerHTML = `
    <div class="modal-copy">
      <p class="eyebrow">Revival Rites</p>
      <h2 id="revival-title">Death ${journey.deathNumber} Recovery</h2>
      <p>The first task is always to build a grave in the village. Once that is checked, two peaceful rites open: one to reclaim levels, one optional rite to restore items.</p>
    </div>

    <article class="revival-card primary">
      <div class="revival-card-head">
        <span class="revival-step">Step 1</span>
        <h3>Grave of the Fallen Journey</h3>
      </div>
      <p class="description">Raise a small grave or memorial in the village for this death before any revival reward is claimed.</p>
      ${renderObjectiveList([
        "Build a grave, cairn, or memorial marker inside the village.",
        "Add at least 1 sign, flower, candle, torch, or other personal detail.",
        "Place it somewhere Danita can revisit later as part of the story."
      ], {
        checkboxes: true,
        progress: journey.graveProgress,
        disabled: journey.graveBuilt,
        action: "toggle-grave-objective",
        context: `${journey.id}-grave`
      })}
      <div class="reward"><strong>Reward:</strong> The next revival rites unlock.</div>
      <div class="quest-actions">
        <button type="button" data-action="complete-grave" ${(journey.graveBuilt || !areObjectivesComplete(journey.graveProgress)) ? "disabled" : ""}>${journey.graveBuilt ? "Grave Completed" : "Mark Grave Complete"}</button>
      </div>
    </article>

    ${showNextRites ? renderRevivalQuestCard("level", journey.levelQuest, {
      step: "Step 2",
      buttonAction: "complete-level-rite",
      buttonLabel: journey.levelQuest.completed ? "Level Rite Completed" : "Mark Level Rite Complete",
      buttonDisabled: journey.levelQuest.completed
    }) : ""}

    ${showNextRites ? `
      <article class="revival-card reward-card">
        <div class="revival-card-head">
          <span class="revival-step">Level Reward</span>
          <h3>Restore Lost Levels</h3>
        </div>
        <p class="description">After finishing the rite, enter the level Danita had before the death. The reward generator will calculate the needed experience and prepare copy buttons.</p>
        <label class="field-label" for="revival-level-input">Level Before Death</label>
        <div class="level-reward-row">
          <input id="revival-level-input" type="text" inputmode="numeric" value="${journey.previousLevel ?? ""}" placeholder="Example: 27">
          <button type="button" data-action="generate-level-reward" ${journey.levelQuest.completed ? "" : "disabled"}>Create Reward</button>
        </div>
        <p class="helper-copy">Minecraft experience bottles are random, so the bottle count uses the usual average of 7 XP each. An exact XP command is included too.</p>
        ${xpReward}
      </article>
    ` : ""}

    ${showNextRites ? renderRevivalQuestCard("item", journey.itemQuest, {
      step: "Optional",
      buttonAction: "complete-item-rite",
      buttonLabel: journey.itemQuest.completed ? "Item Rite Completed" : "Mark Item Rite Complete",
      buttonDisabled: journey.itemQuest.completed,
      badge: "Optional"
    }) : ""}

    ${showNextRites ? `
      <article class="revival-card reward-card optional">
        <div class="revival-card-head">
          <span class="revival-step">Item Reward</span>
          <h3>Restore All Items</h3>
        </div>
        <p class="description">This optional reward just gives the creative-mode swap commands so lost items can be replaced, then the game can be returned to survival.</p>
        <div class="commands">
          <strong>Recovery Commands</strong>
          <div class="command-list">
            ${[
              "/gamemode creative @p",
              "/gamemode survival @p"
            ].map((command) => `
              <div class="command-row">
                <code>${escapeHtml(command)}</code>
                <button type="button" data-action="copy-command" data-command="${escapeHtml(command)}" ${journey.itemQuest.completed ? "" : "disabled"}>Copy</button>
              </div>
            `).join("")}
          </div>
        </div>
      </article>
    ` : ""}

    <div class="revival-actions">
      <button type="button" data-action="start-revival">Start New Death Rite</button>
    </div>
  `;
}

function renderRevivalQuestCard(type, quest, options) {
  return `
    <article class="revival-card ${type === "item" ? "optional" : ""}" data-quest-type="${escapeHtml(type)}">
      <div class="revival-card-head">
        <span class="revival-step">${escapeHtml(options.step)}</span>
        <h3>${escapeHtml(quest.title)}${options.badge ? ` <span class="quest-badge">${escapeHtml(options.badge)}</span>` : ""}</h3>
      </div>
      <p class="description">${escapeHtml(quest.description)}</p>
      ${renderObjectiveList(quest.objectives, {
        checkboxes: true,
        progress: quest.objectiveProgress,
        disabled: quest.completed,
        action: "toggle-revival-objective",
        context: `${quest.title.replace(/\s+/g, "-").toLowerCase()}-${type}`
      })}
      <details class="hint">
        <summary>How To Do It</summary>
        <p>${escapeHtml(quest.hint)}</p>
      </details>
      <div class="reward"><strong>Reward:</strong> ${escapeHtml(quest.reward)}</div>
      <div class="quest-actions">
        <button type="button" data-action="${escapeHtml(options.buttonAction)}" ${(options.buttonDisabled || !areObjectivesComplete(quest.objectiveProgress)) ? "disabled" : ""}>${escapeHtml(options.buttonLabel)}</button>
      </div>
    </article>
  `;
}

function renderXpReward(journey) {
  if (!journey.xpReward) {
    return `<div class="reward-note">No level reward generated yet.</div>`;
  }

  return `
    <div class="reward-note">
      <strong>Total XP:</strong> ${journey.xpReward.totalXp}<br>
      <strong>XP Bottles:</strong> ${journey.xpReward.bottleCount}
    </div>
    <div class="commands">
      <strong>Reward Commands</strong>
      <div class="command-list">
        ${journey.xpReward.commands.map((command) => `
          <div class="command-row">
            <code>${escapeHtml(command)}</code>
            <button type="button" data-action="copy-command" data-command="${escapeHtml(command)}">Copy</button>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

tracksEl.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  const trackName = button.dataset.track;
  if (action === "activate") activateQuest(trackName);
  if (action === "complete") completeQuest(trackName, button);
  if (action === "copy-command") await copySingleCommand(button);
  if (action === "open-track-image") openTrackImageModal(trackName);
});

tracksEl.addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox'][data-action='toggle-objective']");
  if (!input || !save.activeQuest) return;

  const index = Number.parseInt(input.dataset.index, 10);
  if (!Number.isFinite(index)) return;

  save.activeQuest.objectiveProgress[index] = input.checked;
  persist();
  render();
});

revivalButton.addEventListener("click", () => {
  menuOpen = false;
  syncViewState();
  openRevivalModal();
});

menuToggle.addEventListener("click", () => {
  menuOpen = !menuOpen;
  syncViewState();
});

boobooViewButton.addEventListener("click", () => {
  currentView = "booboo";
  menuOpen = false;
  render();
});

danitaViewButton.addEventListener("click", () => {
  lockBoobooView();
  currentView = "danita";
  menuOpen = false;
  render();
});

wishButton.addEventListener("click", () => {
  menuOpen = false;
  syncViewState();
  openWishComposeModal();
});

wishBoardButton.addEventListener("click", () => {
  openWishComposeModal();
});

wishListEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='open-wish']");
  if (!button) return;
  openWishReadModal(button.dataset.wishId);
});

storySlider.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || !STORY_IMAGES.length) return;

  if (button.dataset.action === "story-prev") {
    currentStoryIndex = (currentStoryIndex - 1 + STORY_IMAGES.length) % STORY_IMAGES.length;
    renderStorySlider();
  }

  if (button.dataset.action === "story-next") {
    currentStoryIndex = (currentStoryIndex + 1) % STORY_IMAGES.length;
    renderStorySlider();
  }
});

storySlider.addEventListener("input", (event) => {
  const input = event.target.closest("textarea[data-action='memory-note']");
  if (!input) return;
  const currentImage = STORY_IMAGES[currentStoryIndex];
  memoryNotes[currentImage.src] = input.value;
  persistMemoryNotes();
});

skillTreeCard.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='play-skill-tree']");
  if (!button) return;
  playSkillTreeAnimation();
});

revivalModal.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action], .modal-backdrop[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "close-revival") {
    closeRevivalModal();
    return;
  }

  if (action === "start-revival") {
    startRevivalJourney();
    return;
  }

  if (action === "complete-grave") {
    completeGraveRite(button);
    return;
  }

  if (action === "complete-level-rite") {
    completeLevelRite(button);
    return;
  }

  if (action === "complete-item-rite") {
    completeItemRite(button);
    return;
  }

  if (action === "generate-level-reward") {
    generateLevelReward();
    return;
  }

  if (action === "copy-command") {
    await copySingleCommand(button);
  }
});

revivalModal.addEventListener("change", (event) => {
  const input = event.target.closest("input[type='checkbox'][data-action]");
  if (!input || !save.revival.current) return;

  const action = input.dataset.action;
  const index = Number.parseInt(input.dataset.index, 10);
  if (!Number.isFinite(index)) return;

  if (action === "toggle-grave-objective") {
    save.revival.current.graveProgress[index] = input.checked;
  }

  if (action === "toggle-revival-objective") {
    const card = input.closest(".revival-card");
    const isItemCard = card?.dataset.questType === "item";
    const targetQuest = isItemCard ? save.revival.current.itemQuest : save.revival.current.levelQuest;
    targetQuest.objectiveProgress[index] = input.checked;
  }

  persist();
  renderRevivalModal();
});

imageModal.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action='close-image']");
  if (!button) return;
  closeImageModal();
});

boobooView.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "booboo-password-form") return;
  event.preventDefault();
  const input = boobooView.querySelector("#booboo-password");
  const message = boobooView.querySelector("#booboo-password-message");
  if (!(input instanceof HTMLInputElement) || !message) return;

  if (input.value.trim() === BOOBOO_PASSWORD) {
    unlockBoobooView();
    render();
    return;
  }

  message.textContent = "That is not the Booboo password.";
  input.select();
});

boobooView.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const wishId = button.dataset.wishId;
  const action = button.dataset.action;

  if (action === "select-booboo-wish" && wishId) {
    selectedBoobooWishId = wishId;
    renderBoobooView();
    return;
  }

  if (action === "add-approved-item" && wishId) {
    updateApprovedItemsFromBoobooForm(wishId, false);
    addApprovedItem(wishId);
    return;
  }

  if (action === "remove-approved-item") {
    const activeWish = getSelectedBoobooWish();
    const index = Number.parseInt(button.dataset.index || "", 10);
    if (!activeWish || !Number.isFinite(index)) return;
    updateApprovedItemsFromBoobooForm(activeWish.id, false);
    activeWish.approvedItems.splice(index, 1);
    persist();
    render();
    return;
  }

  if (action === "accept-wish" && wishId) {
    updateApprovedItemsFromBoobooForm(wishId, false);
    acceptWish(wishId, button);
    return;
  }

  if (action === "deny-wish" && wishId) {
    denyWish(wishId);
  }
});

boobooView.addEventListener("input", (event) => {
  const input = event.target.closest("input[data-action]");
  if (!input) return;
  const activeWish = getSelectedBoobooWish();
  if (!activeWish) return;
  updateApprovedItemsFromBoobooForm(activeWish.id, false);

  const row = input.closest(".approval-row");
  const commandPreview = row?.querySelector("code");
  if (row && commandPreview) {
    commandPreview.textContent = buildGiveCommand({
      itemId: row.querySelector("[data-action='approved-item-id']")?.value || "",
      amount: row.querySelector("[data-action='approved-item-amount']")?.value || ""
    });
  }
});

wishModal.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action], .modal-backdrop[data-action]");
  if (!button) return;

  syncWishDraftFromForm();
  const action = button.dataset.action;

  if (action === "close-wish") {
    closeWishModal();
    return;
  }

  if (action === "add-wish-row") {
    wishDraft.materials.push({ name: "", quantity: "" });
    renderWishModal();
    return;
  }

  if (action === "send-wish") {
    submitWishDraft();
    return;
  }

  if (action === "delete-wish") {
    deleteWish(button.dataset.wishId);
    return;
  }

  if (action === "copy-command") {
    copySingleCommand(button);
  }
});

wishModal.addEventListener("input", (event) => {
  if (!event.target.closest(".wish-form")) return;
  syncWishDraftFromForm();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !imageModal.classList.contains("hidden")) {
    closeImageModal();
  }

  if (event.key === "Escape" && !wishModal.classList.contains("hidden")) {
    closeWishModal();
  }

  if (event.key === "Escape" && !revivalModal.classList.contains("hidden")) {
    closeRevivalModal();
  }

  if (event.key === "Escape" && menuOpen) {
    menuOpen = false;
    syncViewState();
  }
});

mainTitle.addEventListener("click", () => {
  launchDragon();
});

function openRevivalModal() {
  if (!save.revival.current) {
    startRevivalJourney();
  }

  revivalModal.classList.remove("hidden");
  revivalModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  renderRevivalModal();
}

function closeRevivalModal() {
  revivalModal.classList.add("hidden");
  revivalModal.setAttribute("aria-hidden", "true");
  syncBodyModalState();
}

function openTrackImageModal(trackName) {
  const trackData = QUESTS[trackName];
  const imageSrc = TRACK_IMAGES[trackName];
  if (!trackData || !imageSrc) return;

  imageModalTitle.textContent = trackData.title;
  imageModalPreview.src = imageSrc;
  imageModalPreview.alt = `${trackData.title} crest`;
  imageModal.classList.remove("hidden");
  imageModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
}

function closeImageModal() {
  imageModal.classList.add("hidden");
  imageModal.setAttribute("aria-hidden", "true");
  imageModalPreview.src = "";
  imageModalPreview.alt = "";
  syncBodyModalState();
}

function openWishComposeModal() {
  wishDraft = createWishDraft();
  openWishId = null;
  wishModalMode = "compose";
  wishModal.classList.remove("hidden");
  wishModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  renderWishModal();
}

function openWishReadModal(wishId) {
  openWishId = wishId;
  wishModalMode = "read";
  wishModal.classList.remove("hidden");
  wishModal.setAttribute("aria-hidden", "false");
  syncBodyModalState();
  renderWishModal();
}

function closeWishModal() {
  wishModal.classList.add("hidden");
  wishModal.setAttribute("aria-hidden", "true");
  openWishId = null;
  wishModalMode = "compose";
  syncBodyModalState();
}

function syncBodyModalState() {
  const hasOpenModal = !revivalModal.classList.contains("hidden")
    || !imageModal.classList.contains("hidden")
    || !wishModal.classList.contains("hidden");
  document.body.classList.toggle("modal-open", hasOpenModal);
}

function syncWishDraftFromForm() {
  if (wishModalMode !== "compose") return;

  const projectInput = document.querySelector("#wish-project");
  const noteInput = document.querySelector("#wish-note");
  const bribeInput = document.querySelector("#wish-bribe");

  if (!projectInput || !noteInput || !bribeInput) return;

  wishDraft.project = projectInput.value;
  wishDraft.note = noteInput.value;
  wishDraft.bribe = bribeInput.value;
  wishDraft.materials = Array.from(document.querySelectorAll(".wish-row")).map((row) => ({
    name: row.querySelector("[data-field='wish-material-name']")?.value || "",
    quantity: row.querySelector("[data-field='wish-material-quantity']")?.value || ""
  }));
}

function isBoobooUnlocked() {
  return boobooUnlocked;
}

function unlockBoobooView() {
  boobooUnlocked = true;
}

function lockBoobooView() {
  boobooUnlocked = false;
}

function getSelectedBoobooWish() {
  return save.wishes.find((wish) => wish.id === selectedBoobooWishId) || null;
}

function updateApprovedItemsFromBoobooForm(wishId, saveChanges = true) {
  const wish = save.wishes.find((entry) => entry.id === wishId);
  if (!wish) return;

  const rows = Array.from(boobooView.querySelectorAll(".approval-row"));
  wish.approvedItems = rows
    .map((row) => ({
      itemId: sanitizeItemId(row.querySelector("[data-action='approved-item-id']")?.value || ""),
      amount: String(row.querySelector("[data-action='approved-item-amount']")?.value || "").trim()
    }))
    .filter((entry) => entry.itemId || entry.amount);

  if (!wish.approvedItems.length) {
    wish.approvedItems = [{ itemId: "", amount: "" }];
  }

  if (saveChanges) {
    persist();
    render();
  }
}

function addApprovedItem(wishId) {
  const wish = save.wishes.find((entry) => entry.id === wishId);
  if (!wish) return;
  wish.approvedItems.push({ itemId: "", amount: "" });
  persist();
  render();
}

function acceptWish(wishId, triggerElement) {
  const wish = save.wishes.find((entry) => entry.id === wishId);
  if (!wish) return;

  const approvedItems = wish.approvedItems
    .map((entry) => normalizeApprovedItem(entry))
    .filter((entry) => entry?.itemId && entry?.amount);

  if (!approvedItems.length) {
    window.alert("Add at least one valid Minecraft item and amount before accepting the letter.");
    return;
  }

  wish.status = "accepted";
  wish.reviewedAt = new Date().toISOString();
  wish.reviewedBy = "Booboo";
  wish.denialReason = "";
  wish.approvedItems = approvedItems;
  persist();
  render();
  launchBoobooAcceptance(getEffectOrigin(triggerElement));
}

function denyWish(wishId) {
  const wish = save.wishes.find((entry) => entry.id === wishId);
  if (!wish) return;

  const denialReason = window.prompt("Why is this letter denied?", wish.denialReason || "");
  if (denialReason === null) return;

  wish.status = "denied";
  wish.reviewedAt = new Date().toISOString();
  wish.reviewedBy = "Booboo";
  wish.denialReason = denialReason.trim();
  persist();
  render();
}

function sanitizeItemId(value) {
  const trimmed = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (!trimmed) return "";
  return trimmed.startsWith("minecraft:") ? trimmed : `minecraft:${trimmed}`;
}

function suggestItemId(name) {
  const normalizedName = String(name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  if (!normalizedName) {
    return "";
  }

  const exactMatch = MINECRAFT_ITEM_LIBRARY.find((entry) => entry === normalizedName);
  if (exactMatch) {
    return `minecraft:${exactMatch}`;
  }

  const partialMatch = MINECRAFT_ITEM_LIBRARY.find((entry) => entry.includes(normalizedName) || normalizedName.includes(entry));
  return partialMatch ? `minecraft:${partialMatch}` : `minecraft:${normalizedName}`;
}

function getMinecraftItemSuggestions(query) {
  const normalizedQuery = String(query || "")
    .trim()
    .toLowerCase()
    .replace(/^minecraft:/, "")
    .replace(/\s+/g, "_");

  const customMaterialIds = save.wishes
    .flatMap((wish) => wish.materials)
    .map((entry) => suggestItemId(entry.name).replace(/^minecraft:/, ""))
    .filter(Boolean);

  const suggestionPool = Array.from(new Set([...customMaterialIds, ...MINECRAFT_ITEM_LIBRARY]));
  const filtered = normalizedQuery
    ? suggestionPool.filter((entry) => entry.includes(normalizedQuery))
    : suggestionPool;

  return filtered.slice(0, 60).map((entry) => `minecraft:${entry}`);
}

function formatItemLabel(itemId) {
  return itemId
    .replace(/^minecraft:/, "")
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildGiveCommand(entry) {
  if (!entry?.itemId || !entry?.amount) {
    return "/give @p minecraft:item 64";
  }
  return `/give @p ${sanitizeItemId(entry.itemId)} ${entry.amount}`;
}

function formatWishStatus(status) {
  if (status === "accepted") return "Accepted";
  if (status === "denied") return "Denied";
  return "Pending";
}

function submitWishDraft() {
  syncWishDraftFromForm();

  const materials = wishDraft.materials
    .map((entry) => ({ name: entry.name.trim(), quantity: entry.quantity.trim() }))
    .filter((entry) => entry.name && entry.quantity);

  const project = wishDraft.project.trim();
  if (!project || !materials.length) {
    window.alert("Write what Danita is building and add at least one material with an amount.");
    return;
  }

  const wish = normalizeWish({
    createdAt: new Date().toISOString(),
    project,
    note: wishDraft.note.trim(),
    bribe: wishDraft.bribe.trim(),
    materials
  });

  save.wishes.push(wish);
  if (save.wishes.length > 16) {
    save.wishes = save.wishes.slice(-16);
  }
  selectedBoobooWishId = wish.id;
  persist();
  render();
  openWishReadModal(wish.id);
}

function generateWishQuest(wish) {
  const firstMaterials = wish.materials.slice(0, 3).map((entry) => `${entry.quantity} ${entry.name}`);
  const materialSummary = firstMaterials.join(", ");
  const bribeLine = wish.bribe ? "Collect the promised bribe, comfort, or sweetener from Danita." : "Collect whatever gratitude Danita offers when the delivery is done.";

  return {
    title: `Booboo's ${wish.project} Supply Run`,
    description: `Danita has asked for ${materialSummary || "building supplies"} so the ${wish.project} can move forward without stalling.`,
    objectives: [
      `Review the request for ${wish.project} and gather the listed materials.`,
      `Deliver ${wish.materials.map((entry) => `${entry.quantity} ${entry.name}`).join(", ")} to the build stash or project site.`,
      wish.note ? `Keep Danita's note in mind: ${wish.note}` : `Check in with Danita so the supplies match the build she wants finished.`,
      bribeLine
    ]
  };
}

function deleteWish(wishId) {
  const wish = save.wishes.find((entry) => entry.id === wishId);
  if (!wish) return;
  if (!window.confirm(`Delete the letter for "${wish.project}"?`)) return;

  save.wishes = save.wishes.filter((entry) => entry.id !== wishId);
  if (selectedBoobooWishId === wishId) {
    selectedBoobooWishId = save.wishes[0]?.id || null;
  }
  persist();
  render();
  closeWishModal();
}

function startRevivalJourney() {
  const nextDeath = (save.revival.deathCount || 0) + 1;
  save.revival.deathCount = nextDeath;
  save.revival.current = createRevivalJourney(nextDeath);
  persist();
  render();
  openRevivalModal();
}

function createRevivalJourney(deathNumber) {
  return {
    id: `revival-${Date.now()}`,
    deathNumber,
    startedAt: new Date().toISOString(),
    graveBuilt: false,
    graveProgress: [false, false, false],
    levelQuest: createRevivalQuest(REVIVAL_LEVEL_RITUALS, deathNumber),
    itemQuest: createRevivalQuest(REVIVAL_ITEM_RITUALS, deathNumber + 1),
    previousLevel: null,
    xpReward: null
  };
}

function createRevivalQuest(pool, indexSeed) {
  const template = pool[(indexSeed - 1) % pool.length];
  return {
    ...template,
    objectives: [...template.objectives],
    objectiveProgress: template.objectives.map(() => false),
    completed: false
  };
}

function completeGraveRite(button) {
  const journey = save.revival.current;
  if (!journey || journey.graveBuilt) return;
  if (!areObjectivesComplete(journey.graveProgress)) return;

  journey.graveBuilt = true;
  save.history.push({
    track: "revival",
    trackTitle: "Revival",
    questTitle: "Grave of the Fallen Journey",
    description: "A memorial grave was built in the village to begin the return after death.",
    objectives: [
      "Build the grave in the village.",
      "Mark it with a personal sign, light, flower, or offering.",
      "Open the next revival rites."
    ],
    reward: "The level and item rites are now available.",
    commands: [],
    completedAt: new Date().toISOString()
  });
  persist();
  render();
  celebrateQuestCompletion(false, getEffectOrigin(button));
}

function completeLevelRite(button) {
  const journey = save.revival.current;
  if (!journey || !journey.graveBuilt || journey.levelQuest.completed) return;
  if (!areObjectivesComplete(journey.levelQuest.objectiveProgress)) return;

  journey.levelQuest.completed = true;
  persist();
  render();
  celebrateQuestCompletion(false, getEffectOrigin(button));
}

function completeItemRite(button) {
  const journey = save.revival.current;
  if (!journey || !journey.graveBuilt || journey.itemQuest.completed) return;
  if (!areObjectivesComplete(journey.itemQuest.objectiveProgress)) return;

  journey.itemQuest.completed = true;
  save.history.push({
    track: "revival",
    trackTitle: "Revival",
    questTitle: journey.itemQuest.title,
    description: journey.itemQuest.description,
    objectives: journey.itemQuest.objectives,
    reward: "Creative recovery commands unlocked.",
    commands: ["/gamemode creative @p", "/gamemode survival @p"],
    completedAt: new Date().toISOString()
  });
  persist();
  render();
  celebrateQuestCompletion(false, getEffectOrigin(button));
}

function generateLevelReward() {
  const journey = save.revival.current;
  if (!journey || !journey.levelQuest.completed) return;

  const input = document.querySelector("#revival-level-input");
  const previousLevel = Number.parseInt(input?.value || "", 10);
  if (!Number.isFinite(previousLevel) || previousLevel < 0) {
    window.alert("Enter the level Danita had before death.");
    return;
  }

  const totalXp = getTotalExperienceForLevel(previousLevel);
  const bottleCount = Math.ceil(totalXp / XP_BOTTLE_AVERAGE);
  journey.previousLevel = previousLevel;
  journey.xpReward = {
    totalXp,
    bottleCount,
    commands: [
      ...buildBottleCommands(bottleCount),
      `/experience add @p ${totalXp} points`
    ]
  };
  persist();
  render();
}

function buildBottleCommands(totalBottles) {
  const commands = [];
  let remaining = totalBottles;

  while (remaining > 0) {
    const stackSize = Math.min(remaining, 64);
    commands.push(`/give @p experience_bottle ${stackSize}`);
    remaining -= stackSize;
  }

  return commands;
}

function getTotalExperienceForLevel(level) {
  if (level <= 16) {
    return (level * level) + (6 * level);
  }

  if (level <= 31) {
    return Math.round((2.5 * level * level) - (40.5 * level) + 360);
  }

  return Math.round((4.5 * level * level) - (162.5 * level) + 2220);
}

function activateQuest(trackName) {
  if (save.activeQuest) return;

  const state = save.tracks[trackName];
  const quest = QUESTS[trackName].quests[state.questIndex];
  if (!quest) return;

  save.activeQuest = {
    track: trackName,
    questIndex: state.questIndex,
    title: quest.title,
    activatedAt: new Date().toISOString(),
    objectiveProgress: quest.objectives.map(() => false)
  };
  persist();
  render();
  playQuestActivationSound();
}

function playQuestActivationSound() {
  playSegmentedAudio("activate");
}

function playSegmentedAudio(type) {
  const isActivation = type === "activate";
  const audio = getSegmentAudio(isActivation);
  const start = isActivation ? QUEST_ACTIVATION_SOUND_START : QUEST_COMPLETE_SOUND_START;
  const end = isActivation ? QUEST_ACTIVATION_SOUND_END : QUEST_COMPLETE_SOUND_END;

  if (isActivation) {
    window.clearTimeout(activationAudioStopTimer);
  } else {
    window.clearTimeout(completionAudioStopTimer);
  }

  audio.pause();
  audio.currentTime = start;
  audio.volume = isActivation ? 0.85 : 0.9;

  const playPromise = audio.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Browsers may block audio if the click did not count as a user gesture.
    });
  }

  const timer = window.setTimeout(() => {
    audio.pause();
    audio.currentTime = start;
  }, (end - start) * 1000);

  if (isActivation) {
    activationAudioStopTimer = timer;
  } else {
    completionAudioStopTimer = timer;
  }
}

function getSegmentAudio(isActivation) {
  if (isActivation) {
    if (!activationAudio) {
      activationAudio = new Audio(QUEST_ACTIVATION_SOUND);
      activationAudio.preload = "auto";
    }
    return activationAudio;
  }

  if (!completionAudio) {
    completionAudio = new Audio(QUEST_ACTIVATION_SOUND);
    completionAudio.preload = "auto";
  }
  return completionAudio;
}

function playPageEntrySound() {
  if (!pageEntryAudio) {
    pageEntryAudio = new Audio(PAGE_ENTRY_SOUND);
    pageEntryAudio.preload = "auto";
  }

  pageEntryAudio.currentTime = 0;
  pageEntryAudio.volume = 0.72;
  const playPromise = pageEntryAudio.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Browsers can block page-entry audio unless Danita has just clicked Enter.
    });
  }
}

function playLevelUpAudio() {
  if (!levelUpAudio) {
    levelUpAudio = new Audio(LEVEL_UP_SOUND);
    levelUpAudio.preload = "auto";
  }

  levelUpAudio.pause();
  levelUpAudio.currentTime = 0;
  levelUpAudio.volume = 0.9;
  const playPromise = levelUpAudio.play();
  if (playPromise) {
    playPromise.catch(() => {
      // Keep the visual level-up effect even if the browser blocks audio.
    });
  }
}

function completeQuest(trackName, triggerElement) {
  const state = save.tracks[trackName];
  const trackData = QUESTS[trackName];
  const quest = trackData.quests[state.questIndex];
  if (!quest) return;
  if (!isCurrentQuestActive(trackName)) return;
  if (!areObjectivesComplete(save.activeQuest.objectiveProgress)) return;

  const effectOrigin = getEffectOrigin(triggerElement);
  const previousLevel = state.level;
  state.xp += XP_PER_QUEST;
  state.level = calculateLevel(state.xp);
  const leveledUp = state.level > previousLevel;
  state.completed.push({
    title: quest.title,
    reward: quest.reward,
    description: quest.description,
    objectives: quest.objectives,
    commands: quest.commands,
    completedAt: new Date().toISOString()
  });
  state.questIndex += 1;
  save.activeQuest = null;
  save.history.push({
    track: trackName,
    trackTitle: trackData.title,
    questTitle: quest.title,
    description: quest.description,
    objectives: quest.objectives,
    reward: quest.reward,
    commands: quest.commands,
    completedAt: new Date().toISOString()
  });
  persist();
  render();
  celebrateQuestCompletion(leveledUp, effectOrigin);
}

function celebrateQuestCompletion(leveledUp, effectOrigin) {
  playQuestSound(leveledUp);
  launchCelebration(leveledUp, effectOrigin);
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
  if (leveledUp) {
    playSegmentedAudio("complete");
    playLevelUpAudio();
    launchLevelUpDance();
    return;
  }

  playSegmentedAudio("complete");
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

function playTrumpetTone(context, frequency, start, duration) {
  const oscillator = context.createOscillator();
  const overtone = context.createOscillator();
  const gain = context.createGain();
  const overtoneGain = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = "sawtooth";
  overtone.type = "square";
  oscillator.frequency.setValueAtTime(frequency, start);
  overtone.frequency.setValueAtTime(frequency * 2, start);
  oscillator.frequency.linearRampToValueAtTime(frequency * 1.015, start + 0.035);
  oscillator.frequency.linearRampToValueAtTime(frequency, start + 0.08);

  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency * 2.8, start);
  filter.Q.setValueAtTime(2.8, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.11, start + 0.025);
  gain.gain.setValueAtTime(0.11, start + duration * 0.55);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  overtoneGain.gain.setValueAtTime(0.025, start);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(filter);
  overtone.connect(overtoneGain);
  overtoneGain.connect(filter);
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  overtone.start(start);
  oscillator.stop(start + duration + 0.03);
  overtone.stop(start + duration + 0.03);
}

function launchCelebration(leveledUp, effectOrigin) {
  const burst = document.createElement("div");
  burst.className = `celebration-burst ${leveledUp ? "level-up" : ""}`;
  burst.setAttribute("aria-hidden", "true");

  if (!leveledUp && effectOrigin) {
    burst.style.left = `${effectOrigin.x}px`;
    burst.style.top = `${effectOrigin.y}px`;
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

function launchBoobooAcceptance(effectOrigin) {
  launchCelebration(false, effectOrigin);

  const banner = document.createElement("div");
  banner.className = "booboo-accept-banner";
  banner.setAttribute("aria-hidden", "true");
  banner.textContent = "Letter Accepted";
  document.body.appendChild(banner);
  window.setTimeout(() => banner.remove(), 1500);
}

function launchDragon() {
  const existingDragon = document.querySelector(".dragon-flight");
  if (existingDragon) existingDragon.remove();

  const dragon = document.createElement("div");
  dragon.className = "dragon-flight";
  dragon.setAttribute("aria-hidden", "true");
  dragon.innerHTML = `
    <div class="dragon">
      <span class="wing wing-left"></span>
      <span class="wing wing-right"></span>
      <span class="body"></span>
      <span class="neck"></span>
      <span class="head"></span>
      <span class="tail"></span>
      <span class="flame"></span>
    </div>
  `;

  document.body.appendChild(dragon);
  window.setTimeout(() => dragon.remove(), 5200);
}

function getEffectOrigin(element) {
  if (!element) return null;
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
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

async function copySingleCommand(button) {
  const command = button.dataset.command;
  if (!command) return;

  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(command);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Failed";
  }
  window.setTimeout(() => { button.textContent = original; }, 1200);
}

exportButton.addEventListener("click", () => {
  playPageEntrySound();
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
    closeRevivalModal();
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
  closeRevivalModal();
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
