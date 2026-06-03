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
const resetButton = document.getElementById("resetButton");

function loadStamps() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
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

function isComplete() {
  return loadStamps().length >= STAMP_TOTAL;
}

function showMessage(text, type = "info") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function cleanUrl() {
  const clean = window.location.origin + window.location.pathname;
  window.history.replaceState({}, document.title, clean);
}

function getActionFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return {
    stamp: params.get("stamp"),
    finish: params.get("finish")
  };
}

function handleUrlAction() {
  const { stamp, finish } = getActionFromUrl();

  if (finish === "done") {
    if (isFinished()) {
      showMessage("この台紙はすでに景品受け取り済みです。", "success");
    } else if (isComplete()) {
      setFinished();
      showMessage("景品受け取り済みにしました。ご参加ありがとうございました。", "success");
    } else {
      showMessage("まだコンプリートしていません。景品交換はできません。", "warning");
    }
    cleanUrl();
    return;
  }

  if (!stamp) return;

  const normalized = stamp.padStart(2, "0");
  const number = Number(normalized);

  if (!Number.isInteger(number) || number < 1 || number > STAMP_TOTAL) {
    showMessage("このQRコードはスタンプラリー用ではありません。", "warning");
    cleanUrl();
    return;
  }

  if (isFinished()) {
    showMessage("この台紙は景品受け取り済みです。", "warning");
    cleanUrl();
    return;
  }

  const stamps = loadStamps();

  if (stamps.includes(normalized)) {
    showMessage(`${normalized}番のスタンプは取得済みです。`, "warning");
  } else {
    stamps.push(normalized);
    saveStamps(stamps);
    showMessage(`${normalized}番のスタンプを取得しました！`, "success");
  }

  cleanUrl();
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

resetButton.addEventListener("click", () => {
  const ok = confirm("台紙をリセットします。よろしいですか？");
  if (!ok) return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FINISHED_KEY);
  showMessage("台紙をリセットしました。", "info");
  renderBoard();
});

handleUrlAction();
renderBoard();
