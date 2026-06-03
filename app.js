const STAMP_TOTAL = 20;
const STORAGE_KEY = "festival_stamp_rally_v1";
const FINISHED_KEY = "festival_stamp_rally_finished_v1";

const stampBoard = document.getElementById("stampBoard");
const countText = document.getElementById("countText");
const completeText = document.getElementById("completeText");
const progressBar = document.getElementById("progressBar");
const messageBox = document.getElementById("messageBox");
const completeArea = document.getElementById("completeArea");
const finishedArea = document.getElementById("finishedArea");
const finishInput = document.getElementById("finishInput");
const finishButton = document.getElementById("finishButton");
const resetButton = document.getElementById("resetButton");

function loadStamps() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data;
    return [];
  } catch (e) {
    return [];
  }
}

function saveStamps(stamps) {
  const unique = [...new Set(stamps)].sort();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
}

function isFinished() {
  return localStorage.getItem(FINISHED_KEY) === "true";
}

function setFinished() {
  localStorage.setItem(FINISHED_KEY, "true");
}

function getStampFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const stamp = params.get("stamp");
  if (!stamp) return null;

  const normalized = stamp.padStart(2, "0");
  const number = Number(normalized);

  if (!Number.isInteger(number) || number < 1 || number > STAMP_TOTAL) {
    return "invalid";
  }

  return normalized;
}

function addStampFromUrl() {
  const stamp = getStampFromUrl();
  if (!stamp) return;

  if (stamp === "invalid") {
    showMessage("このQRコードはスタンプラリー用ではありません。", "warning");
    return;
  }

  if (isFinished()) {
    showMessage("この台紙は景品受け取り済みです。", "warning");
    return;
  }

  const stamps = loadStamps();

  if (stamps.includes(stamp)) {
    showMessage(`${stamp}番のスタンプは取得済みです。`, "warning");
  } else {
    stamps.push(stamp);
    saveStamps(stamps);
    showMessage(`${stamp}番のスタンプを取得しました！`, "success");
  }

  // QR読取後も同じURLを再読込して重複表示しにくくする
  const cleanUrl = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, cleanUrl);
}

function showMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function renderBoard() {
  const stamps = loadStamps();
  const finished = isFinished();

  stampBoard.innerHTML = "";

  for (let i = 1; i <= STAMP_TOTAL; i++) {
    const id = String(i).padStart(2, "0");
    const slot = document.createElement("div");
    slot.className = "stamp-slot";
    slot.dataset.number = id;

    if (stamps.includes(id)) {
      const img = document.createElement("img");
      img.src = `images/stamp${id}.png`;
      img.alt = `${id}番のスタンプ`;
      slot.appendChild(img);
    } else {
      slot.classList.add("empty");
    }

    stampBoard.appendChild(slot);
  }

  const count = stamps.length;
  countText.textContent = `${count} / ${STAMP_TOTAL}`;
  progressBar.style.width = `${(count / STAMP_TOTAL) * 100}%`;

  if (finished) {
    completeText.textContent = "終了";
    completeArea.classList.add("hidden");
    finishedArea.classList.remove("hidden");
    showMessage("景品受け取り済みです。ご参加ありがとうございました。", "success");
    return;
  }

  if (count >= STAMP_TOTAL) {
    completeText.textContent = "コンプリート";
    completeArea.classList.remove("hidden");
    finishedArea.classList.add("hidden");
  } else {
    completeText.textContent = `あと ${STAMP_TOTAL - count} 個`;
    completeArea.classList.add("hidden");
    finishedArea.classList.add("hidden");
  }
}

finishButton.addEventListener("click", () => {
  const value = finishInput.value.trim();
  if (value === "済") {
    setFinished();
    renderBoard();
  } else {
    showMessage("景品を受け取った後、「済」と入力してください。", "warning");
  }
});

resetButton.addEventListener("click", () => {
  const ok = confirm("台紙をリセットします。よろしいですか？");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FINISHED_KEY);
  showMessage("台紙をリセットしました。", "info");
  renderBoard();
});

addStampFromUrl();
renderBoard();
