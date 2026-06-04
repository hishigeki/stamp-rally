const STAMP_TOTAL = 20;
const STORAGE_KEY = "festival_stamp_rally_final";
const OLD_STORAGE_KEY_1 = "festival_stamp_rally_v3_secure_random";
const OLD_STORAGE_KEY_2 = "festival_stamp_rally_v2_with_time";
const OLD_STORAGE_KEY_3 = "festival_stamp_rally_v1";
const FINISHED_KEY = "festival_stamp_rally_finished_v1";

const FINISH_TOKEN = "finish_02da22fb2ee5b0329bdd5bda";
const RESET_TOKEN = "reset_adc70d06b0b6aca3ce0702ab";

const STAMP_MAP = [
  {
    "number": "01",
    "token": "gglxoOTFRyRQw4sw",
    "image": "img_395085070829ac1f.png"
  },
  {
    "number": "02",
    "token": "7cNjP2O1CITzqyY5",
    "image": "img_973fa505949e11f4.png"
  },
  {
    "number": "03",
    "token": "YAxDEG2uApEIypxL",
    "image": "img_0da1171cac4b1b10.png"
  },
  {
    "number": "04",
    "token": "8C8htikJbfd1Ibyy",
    "image": "img_f3b269fef2c48fd7.png"
  },
  {
    "number": "05",
    "token": "eArqXlHVuXiHK8bH",
    "image": "img_877e04208546de82.png"
  },
  {
    "number": "06",
    "token": "hkFPSPKDRZtpC3jl",
    "image": "img_bc7b63b3a35098c6.png"
  },
  {
    "number": "07",
    "token": "An6Xw5hbSQgNa9Bp",
    "image": "img_f43129daf7f7ec29.png"
  },
  {
    "number": "08",
    "token": "BRGHDF1PEclJzEfR",
    "image": "img_0aadc56a17362816.png"
  },
  {
    "number": "09",
    "token": "gvcHi4V3RxpWAVaQ",
    "image": "img_c62dd57e118c16f9.png"
  },
  {
    "number": "10",
    "token": "XhT9tdt8sie6YlPA",
    "image": "img_2d9990a2723c6d81.png"
  },
  {
    "number": "11",
    "token": "mBgr6ujyACK0l4pT",
    "image": "img_9e0dee1cc69212f9.png"
  },
  {
    "number": "12",
    "token": "hG5NyyzWO62LPtgY",
    "image": "img_60598b3f8f4ebd29.png"
  },
  {
    "number": "13",
    "token": "ybjsl0bQBRz2gf7Q",
    "image": "img_5d8559c8524c2243.png"
  },
  {
    "number": "14",
    "token": "yuk8DrXFZvpwa36m",
    "image": "img_bf5f112cd8cbfc8d.png"
  },
  {
    "number": "15",
    "token": "LA2fSQMCZJzDPuRx",
    "image": "img_fa7b8d1a8b0419ae.png"
  },
  {
    "number": "16",
    "token": "yOSUOPzU7Lo3Fo3j",
    "image": "img_20b2e8466ebd9d03.png"
  },
  {
    "number": "17",
    "token": "O2AsiXstKeirVTPH",
    "image": "img_fba2ca540663ccbd.png"
  },
  {
    "number": "18",
    "token": "c6d7vkkK3FqogMb8",
    "image": "img_9afd91b90f35f406.png"
  },
  {
    "number": "19",
    "token": "GxR7MzANxU4yhpxJ",
    "image": "img_8aa2b129209f3a28.png"
  },
  {
    "number": "20",
    "token": "Yj5mcvPGCK3U3YGl",
    "image": "img_914d7a29620332a6.png"
  }
];

const stampBoard = document.getElementById("stampBoard");
const countText = document.getElementById("countText");
const completeText = document.getElementById("completeText");
const progressBar = document.getElementById("progressBar");
const messageBox = document.getElementById("messageBox");
const completeArea = document.getElementById("completeArea");
const finishedArea = document.getElementById("finishedArea");

function nowText() {
  const d = new Date();
  return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

function loadStamps() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    } catch(e) {}
  }
  return [];
}

function saveStamps(stamps) {
  const map = new Map();
  for (const item of stamps) if (!map.has(item.id)) map.set(item.id, item);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(map.values()).sort((a,b)=>a.id.localeCompare(b.id))));
}

function isFinished() { return localStorage.getItem(FINISHED_KEY) === "true"; }
function setFinished() { localStorage.setItem(FINISHED_KEY, "true"); }
function isComplete() { return loadStamps().length >= STAMP_TOTAL; }

function showMessage(text, type="info") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function cleanUrl() {
  window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
}

function findStampByToken(token) {
  return STAMP_MAP.find(item => item.token === token);
}

function resetByAdminQr(token) {
  if (token !== RESET_TOKEN) {
    showMessage("このリセットQRは無効です。", "warning");
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OLD_STORAGE_KEY_1);
  localStorage.removeItem(OLD_STORAGE_KEY_2);
  localStorage.removeItem(OLD_STORAGE_KEY_3);
  localStorage.removeItem(FINISHED_KEY);
  showMessage("管理者QRにより台紙をリセットしました。", "success");
}

function handleUrlAction() {
  const params = new URLSearchParams(window.location.search);
  const stampToken = params.get("s");
  const finish = params.get("finish");
  const reset = params.get("reset");

  if (reset) {
    resetByAdminQr(reset);
    cleanUrl();
    return;
  }

  if (finish === FINISH_TOKEN) {
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

  if (!stampToken) return;

  const info = findStampByToken(stampToken);
  if (!info) {
    showMessage("このQRコードはスタンプラリー用ではありません。", "warning");
    cleanUrl();
    return;
  }

  if (isFinished()) {
    showMessage("この台紙は景品受け取り済みです。", "warning");
    cleanUrl();
    return;
  }

  const id = info.number;
  const stamps = loadStamps();

  if (stamps.some(item => item.id === id)) {
    showMessage(`${id}番のスタンプは取得済みです。`, "warning");
  } else {
    stamps.push({id:id, time:nowText()});
    saveStamps(stamps);
    showMessage(`${id}番のスタンプを取得しました！`, "success");
  }
  cleanUrl();
}

function renderBoard() {
  const stamps = loadStamps();
  const finished = isFinished();
  stampBoard.innerHTML = "";

  for (const item of STAMP_MAP) {
    const id = item.number;
    const slot = document.createElement("div");
    slot.className = "stamp-slot";
    slot.dataset.number = id;

    const stamp = stamps.find(s => s.id === id);
    if (stamp) {
      const img = document.createElement("img");
      img.src = `images/${item.image}`;
      img.alt = `${id}番のスタンプ`;

      const time = document.createElement("div");
      time.className = "stamp-time";
      time.textContent = stamp.time;

      slot.appendChild(img);
      slot.appendChild(time);
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
  } else if (count >= STAMP_TOTAL) {
    completeText.textContent = "コンプリート";
    completeArea.classList.remove("hidden");
    finishedArea.classList.add("hidden");
  } else {
    completeText.textContent = `あと ${STAMP_TOTAL - count} 個`;
    completeArea.classList.add("hidden");
    finishedArea.classList.add("hidden");
  }
}

handleUrlAction();
renderBoard();
