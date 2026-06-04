const STAMP_TOTAL=20;
const STORAGE_KEY="festival_stamp_rally_v3_secure_random";
const OLD_STORAGE_KEY_1="festival_stamp_rally_v2_with_time";
const OLD_STORAGE_KEY_2="festival_stamp_rally_v1";
const FINISHED_KEY="festival_stamp_rally_finished_v1";
const RESET_TOKEN="reset_91483161618b7fdfb9536438";
const FINISH_TOKEN="finish_b317a280f7c7e543842e";
const STAMP_MAP=[
  {
    "number": "01",
    "token": "a7f3c9d2",
    "image": "img_03435f282b81.png"
  },
  {
    "number": "02",
    "token": "m4k8q1v6",
    "image": "img_6f690724e338.png"
  },
  {
    "number": "03",
    "token": "r9p2x5n1",
    "image": "img_90836bfb27b3.png"
  },
  {
    "number": "04",
    "token": "z6t1h8w3",
    "image": "img_4ec81eb81905.png"
  },
  {
    "number": "05",
    "token": "c5u9e2b7",
    "image": "img_620df7b882e4.png"
  },
  {
    "number": "06",
    "token": "v2d8s4j9",
    "image": "img_171783afdc51.png"
  },
  {
    "number": "07",
    "token": "k7n3y6a1",
    "image": "img_16c4d067982c.png"
  },
  {
    "number": "08",
    "token": "p8w5r2t4",
    "image": "img_0601ebd157dd.png"
  },
  {
    "number": "09",
    "token": "h3x9c6m2",
    "image": "img_c5f8bef19628.png"
  },
  {
    "number": "10",
    "token": "q1b7z4e8",
    "image": "img_ec8a9f31e5de.png"
  },
  {
    "number": "11",
    "token": "n6f2v9k3",
    "image": "img_a7ff22c539d8.png"
  },
  {
    "number": "12",
    "token": "t4m8p1x7",
    "image": "img_823a45fc17c2.png"
  },
  {
    "number": "13",
    "token": "e9j3r6s2",
    "image": "img_9cd14ea11b8e.png"
  },
  {
    "number": "14",
    "token": "w5a1q8d4",
    "image": "img_fc80ad2d97d3.png"
  },
  {
    "number": "15",
    "token": "y2c7h9n5",
    "image": "img_a2e67db3c383.png"
  },
  {
    "number": "16",
    "token": "s8v4k2p6",
    "image": "img_165039e97a32.png"
  },
  {
    "number": "17",
    "token": "b3t9m5x1",
    "image": "img_adacb5521e59.png"
  },
  {
    "number": "18",
    "token": "d7q2w6a8",
    "image": "img_5360dbd858b7.png"
  },
  {
    "number": "19",
    "token": "x1e5n9r3",
    "image": "img_0deaa6f82e20.png"
  },
  {
    "number": "20",
    "token": "u6h4z2c8",
    "image": "img_c85af1fe2332.png"
  }
];

const stampBoard=document.getElementById("stampBoard");
const countText=document.getElementById("countText");
const completeText=document.getElementById("completeText");
const progressBar=document.getElementById("progressBar");
const messageBox=document.getElementById("messageBox");
const completeArea=document.getElementById("completeArea");
const finishedArea=document.getElementById("finishedArea");

function nowText(){const d=new Date();return `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;}
function loadStamps(){
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){try{const data=JSON.parse(raw);if(Array.isArray(data))return data;}catch(e){}}
  const oldTimeRaw=localStorage.getItem(OLD_STORAGE_KEY_1);
  if(oldTimeRaw){try{const oldData=JSON.parse(oldTimeRaw);if(Array.isArray(oldData)){const converted=oldData.filter(x=>x&&x.id).map(x=>({id:x.id,time:x.time||"取得済み"}));saveStamps(converted);return converted;}}catch(e){}}
  const oldRaw=localStorage.getItem(OLD_STORAGE_KEY_2);
  if(oldRaw){try{const oldData=JSON.parse(oldRaw);if(Array.isArray(oldData)){const converted=oldData.map(id=>({id:id,time:"取得済み"}));saveStamps(converted);return converted;}}catch(e){}}
  return [];
}
function saveStamps(stamps){const map=new Map();for(const item of stamps){if(!map.has(item.id))map.set(item.id,item);}localStorage.setItem(STORAGE_KEY,JSON.stringify(Array.from(map.values()).sort((a,b)=>a.id.localeCompare(b.id))));}
function isFinished(){return localStorage.getItem(FINISHED_KEY)==="true";}
function setFinished(){localStorage.setItem(FINISHED_KEY,"true");}
function isComplete(){return loadStamps().length>=STAMP_TOTAL;}
function showMessage(text,type="info"){messageBox.textContent=text;messageBox.className=`message ${type}`;}
function cleanUrl(){window.history.replaceState({},document.title,window.location.origin+window.location.pathname);}
function findStampByToken(token){return STAMP_MAP.find(item=>item.token===token);}
function resetByAdminQr(token){if(token!==RESET_TOKEN){showMessage("このリセットQRは無効です。","warning");return;}localStorage.removeItem(STORAGE_KEY);localStorage.removeItem(OLD_STORAGE_KEY_1);localStorage.removeItem(OLD_STORAGE_KEY_2);localStorage.removeItem(FINISHED_KEY);showMessage("管理者QRにより台紙をリセットしました。","success");}
function handleUrlAction(){
  const params=new URLSearchParams(window.location.search);
  const stampToken=params.get("s");
  const finish=params.get("finish");
  const reset=params.get("reset");
  if(reset){resetByAdminQr(reset);cleanUrl();return;}
  if(finish===FINISH_TOKEN){if(isFinished()){showMessage("この台紙はすでに景品受け取り済みです。","success");}else if(isComplete()){setFinished();showMessage("景品受け取り済みにしました。ご参加ありがとうございました。","success");}else{showMessage("まだコンプリートしていません。景品交換はできません。","warning");}cleanUrl();return;}
  if(!stampToken)return;
  const info=findStampByToken(stampToken);
  if(!info){showMessage("このQRコードはスタンプラリー用ではありません。","warning");cleanUrl();return;}
  if(isFinished()){showMessage("この台紙は景品受け取り済みです。","warning");cleanUrl();return;}
  const id=info.number;
  const stamps=loadStamps();
  if(stamps.some(item=>item.id===id)){showMessage(`${id}番のスタンプは取得済みです。`,"warning");}
  else{stamps.push({id:id,time:nowText()});saveStamps(stamps);showMessage(`${id}番のスタンプを取得しました！`,"success");}
  cleanUrl();
}
function renderBoard(){
  const stamps=loadStamps();
  const finished=isFinished();
  stampBoard.innerHTML="";
  for(const item of STAMP_MAP){
    const id=item.number;
    const slot=document.createElement("div");
    slot.className="stamp-slot";
    slot.dataset.number=id;
    const stamp=stamps.find(s=>s.id===id);
    if(stamp){
      const img=document.createElement("img");
      img.src=`images/${item.image}`;
      img.alt=`${id}番のスタンプ`;
      const time=document.createElement("div");
      time.className="stamp-time";
      time.textContent=stamp.time;
      slot.appendChild(img);
      slot.appendChild(time);
    }else{slot.classList.add("empty");}
    stampBoard.appendChild(slot);
  }
  const count=stamps.length;
  countText.textContent=`${count} / ${STAMP_TOTAL}`;
  progressBar.style.width=`${(count/STAMP_TOTAL)*100}%`;
  if(finished){completeText.textContent="終了";completeArea.classList.add("hidden");finishedArea.classList.remove("hidden");}
  else if(count>=STAMP_TOTAL){completeText.textContent="コンプリート";completeArea.classList.remove("hidden");finishedArea.classList.add("hidden");}
  else{completeText.textContent=`あと ${STAMP_TOTAL-count} 個`;completeArea.classList.add("hidden");finishedArea.classList.add("hidden");}
}
handleUrlAction();
renderBoard();
