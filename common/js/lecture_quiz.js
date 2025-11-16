// =============================
// 페이지/플레이어 기본 값
// =============================
const parts = location.pathname.split('/').filter(Boolean);
const videoEl = document.getElementById('lecture-video');
const currentFile = location.pathname.split('/').pop();
const pageNum = parseInt(currentFile.split('.')[0], 10) || 5;
const folderName = parts[parts.length - 2];
const maxPage = 6;
const paddedNum = String(pageNum).padStart(2, '0');

// =============================
// data.js -> quizData (1~3번만)
// =============================
function toOX(c) { return String(c) === "O" ? 'O' : 'X'; }

function buildQuizDataFromDataJs(chapterKey) {
  const bucket = (window.content_data && window.content_data[chapterKey] && window.content_data[chapterKey].quiz) || {};
  const ids = Object.keys(bucket).sort((a,b)=>+a-+b).slice(0,3);
  if (!ids.length) {
    return [
      { q: 'Q1. 문제를 준비 중입니다.', answer: 'O' },
      { q: 'Q2. 문제를 준비 중입니다.', answer: 'O' },
      { q: 'Q3. 문제를 준비 중입니다.', answer: 'O' },
    ];
  }
  return ids.map((id,i)=>{
    const q = bucket[id];
    return { q: `Q${i+1}. ${q.question}`, answer: toOX(q.correct), explain: q.explain || '' };
  });
}
const quizData = buildQuizDataFromDataJs(folderName);

// =============================
// 상태값
// =============================
let currentQuiz = 0;
let correctCount = 0;
let answered = false;

// =============================
// 비디오 초기화
// =============================
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/quiz.mp4`;
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video', {
  inactivityTimeout: 0,
  controls: true,
  controlBar: { fullscreenToggle: false } // 전체화면 제거
});

// =============================
// 📖 사이드 시트 UI (module_video.js 기반)
// =============================
const CHAR1_SRC   = '../common/images/menu/char1.png';
const CHAR2_SRC   = '../common/images/menu/char2.png';
const POSTIT_SRC  = '../common/images/menu/postit.png';
const RES_LABEL   = '보충심화학습자료';
const RES_HREF    = '../document/learning_resources/supplementary_learning(원본).pdf';

function ensureStyles(){
  if (document.getElementById('mv-refactor-style')) return;
  const css =
    '.vjs-sheet-item .txt { text-align: left; }' +
    '.vjs-custom-control{display:flex;align-items:center;gap:8px;color:#fff;font-size:14px;}' +
    '.vjs-side-overlay{position:absolute;height:590px;top:0px;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:99998;}'+
    '.vjs-side-overlay.on{opacity:1;pointer-events:auto;}'+
    '.vjs-side-sheet{position:absolute;top:0;left:0;width:220px;height:590px;background:#fff;border:2px solid #ffc595ff;border-left:6px solid #f0a66a;box-shadow:0 4px 20px rgba(0,0,0,.08);transform:translateX(-100%);transition:transform .25s ease;z-index:99999;display:flex;flex-direction:column;overflow:hidden;}'+
    '.vjs-side-sheet.on{transform:translateX(0);}'+
    '.vjs-sheet-header{position:relative;display:flex;align-items:center;justify-content:flex-start;gap:8px;padding:14px 16px 8px 25px;font-size:18px;font-weight:800;color:#222;}' +
    '.vjs-sheet-header .title{letter-spacing:-.3px; display:inline-block;}' +
    '.vjs-sheet-header .title {' +
      'font-size: 30px;' +           // 글씨 크기 키우기
      // 'font-weight: 900;' +          // 굵게
      'color: #222;' +               // 색상 (기존 유지)
      'margin-left: -5px;' +         // 왼쪽으로 약간 이동
      'text-align: left;' +          // 왼쪽 정렬
    '}' +

    '.vjs-section-title {' +
      'margin: 20px 6px 8px 6px;' +  // 위 여백 약간 늘림
      'font-size: 20px;' +           // 글씨 크기 키움
      'font-weight: 800;' +
      'color: #222;' +
      'text-align: left;' +          // 왼쪽 정렬
      'padding-left: 4px;' +         // 살짝 안쪽으로
    '}' +
    '.vjs-sheet-header .underline{position:absolute;left:-1px;right:14px;bottom:0;' +
        'height:6px;background:#f0a66a;border-radius:2px;}' +
    '.vjs-side-sheet .vjs-sheet-header .vjs-close-btn{margin-left:auto;background:#9aa0a6;color:#fff;border:none;border-radius:45%;width:30px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:pointer;}' +
    '.vjs-sheet-body{position:relative;flex:1;overflow-y:auto;padding:12px 8px 10px 8px;scrollbar-width:thin;}' +
    '.vjs-section-title{margin:12px 6px 8px 6px;font-size:17px;font-weight:800;color:#222;position:relative;}' +
    '.vjs-section-title .u{display:block;margin-top:4px;margin-left:-6px;width:calc(100% + 14px);height:5px;background:#f0a66a;border-radius:2px;}' +
    '.vjs-sheet-item{position:relative;margin:4px 6px;padding:6px 8px 8px 14px;cursor:pointer;color:#222;border-radius:6px;}' +
    '.vjs-sheet-item .txt{position:relative;z-index:2;font-size:15px;line-height:1.35;font-weight:700;}' +
    '.vjs-sheet-item .line{margin-top:6px;margin-left:-10px;width:90px;height:4px;background:#ffc595ff;border-radius:2px;}' +
    '.vjs-sheet-item--wide .line{width:150px;}' +
    '.vjs-sheet-item::before{content:"";position:absolute;z-index:1;left:-50px;right:10px;top:3px;height:35px;background:url('+POSTIT_SRC+') no-repeat 0 0/100% 100%;opacity:0;transform:translateX(-6px);transition:opacity .12s ease,transform .12s ease;}' +
    '.vjs-sheet-item:hover::before,.vjs-sheet-item.is-active::before{opacity:1;transform:translateX(0);}' +
    '.vjs-sheet-link{' +
      'color:#0b63bd;' +        // 글씨 색 (기존 파란색 유지)
      'text-decoration:none;' +
      'position:relative;' +
      'z-index:2;' +
      'font-size:15px;' +       // ← 글씨 크기 키움 (기존 15px)
      'text-align:left;' +      // ← 왼쪽 정렬
      'display:block;' +        // ← 왼쪽 정렬 적용되도록 block 변환
      'padding-left:4px;' +     // ← 약간 들여쓰기
    '}' +
    '.vjs-sheet-link:hover{text-decoration:underline;}' + 
    '.vjs-sheet-footer{padding:8px 10px 12px 10px;display:flex;justify-content:center;gap:24px;}' +
    '.vjs-sheet-footer img{height:75px;width:auto;object-fit:contain;}';
  const style = document.createElement('style');
  style.id = 'mv-refactor-style';
  style.textContent = css;
  document.head.appendChild(style);
}
ensureStyles();

// ===== 버튼 구성 =====
const tocButton = player.controlBar.addChild('button', { name: 'TocButton' });
tocButton.addClass('vjs-custom-control');
tocButton.el().innerHTML = '📖';

player.ready(() => {
  const playerEl = player.el();

  // overlay + sheet 생성
  const overlay = document.createElement('div');
  overlay.className = 'vjs-side-overlay';
  playerEl.appendChild(overlay);

  const sheet = document.createElement('div');
  sheet.className = 'vjs-side-sheet';
  sheet.innerHTML =
    '<div class="vjs-sheet-header">' +
      '<span class="title">목차</span>' +
      '<button class="vjs-close-btn" type="button" aria-label="닫기">×</button>' +
      '<span class="underline"></span>' +
    '</div>' +
    '<div class="vjs-sheet-body"></div>' +
    '<div class="vjs-sheet-footer">' +
      '<img alt="char1" class="char1" src="'+ CHAR1_SRC + '"/>' +
      '<img alt="char2" class="char2" src="'+ CHAR2_SRC + '"/>' +
    '</div>';
  playerEl.appendChild(sheet);

  const body = sheet.querySelector('.vjs-sheet-body');
  const items = [];

// 페이지 목록 (data.js 내용 반영)
// 페이지 목록 (config.js 데이터 기반)
if (window.config && window.config.page_type) {
  const pageEntries = Object.entries(window.config.page_type)
    .sort((a, b) => Number(a[0]) - Number(b[0]));

  pageEntries.forEach(([num, info]) => {
    const padded = String(num).padStart(2, '0');
    const title = info.title || '';
    const item = document.createElement('div');
    item.className = 'vjs-sheet-item';
    item.innerHTML = `
      <div class="txt">${title}</div>
      <div class="line"></div>
    `;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      location.href = `${padded}.html`;
    });
    body.appendChild(item);
  });
} else {
  // fallback (config.js가 없을 경우)
  for (let i = 1; i <= maxPage; i++) {
    const num = String(i).padStart(2, '0');
    const item = document.createElement('div');
    item.className = 'vjs-sheet-item';
    item.innerHTML = `<div class="txt">${num}페이지</div><div class="line"></div>`;
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      location.href = `${num}.html`;
    });
    body.appendChild(item);
  }
}

  // 학습자료 추가
  const sec = document.createElement('div');
  sec.className = 'vjs-section-title';
  sec.innerHTML = '학습자료<div class="u"></div>';
  body.appendChild(sec);

  const res = document.createElement('div');
  res.className = 'vjs-sheet-item vjs-sheet-item--wide';
  res.innerHTML =
        '<a class="vjs-sheet-link" href="'+ RES_HREF +'" target="_blank" rel="noopener">'+ RES_LABEL +'</a>' +
        '<div class="line"></div>';   // 밑줄 유지
  res.addEventListener('click', function(e){ e.stopPropagation(); });
  body.appendChild(res);

  // 열기/닫기
  const openSheet = e => { e?.stopPropagation(); sheet.classList.add('on'); overlay.classList.add('on'); };
  const closeSheet = () => { sheet.classList.remove('on'); overlay.classList.remove('on'); };
  tocButton.el().addEventListener('click', openSheet);
  overlay.addEventListener('click', closeSheet);
  sheet.querySelector('.vjs-close-btn').addEventListener('click', closeSheet);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
});

// ===== Prev / Next / Page 표시 =====
const prevButton = player.controlBar.addChild('button',{name:'PrevButton'});
// prevButton.addClass('vjs-custom-control');
prevButton.addClass('mv-prev-btn');   // ← 추가
prevButton.el().innerHTML = '◀';
prevButton.on('click',()=>{
  if (pageNum>1) location.href=`${String(pageNum-1).padStart(2,'0')}.html`;
  else alert('처음 페이지입니다.');
});
prevButton.el().style.marginRight = '2px';

const nextButton = player.controlBar.addChild('button',{name:'NextButton'});
// nextButton.addClass('vjs-custom-control');
nextButton.addClass('mv-next-btn');   // ← 추가
nextButton.el().innerHTML = '▶';
nextButton.on('click',()=>{
  if (pageNum<maxPage) location.href=`${String(pageNum+1).padStart(2,'0')}.html`;
  else alert('마지막 페이지입니다.');
});
nextButton.el().style.marginLeft  = '1px';
nextButton.el().style.marginRight = '12px';   // ← 여기 숫자 조절하면서 보기

const pageDisplay = player.controlBar.addChild('component');
// pageDisplay.addClass('vjs-custom-control');
pageDisplay.addClass('mv-page-display');   // ← 선택 사항, 필요하면 추가
pageDisplay.el().innerText = `${paddedNum}/${String(maxPage).padStart(2,'0')}`;
pageDisplay.el().style.marginLeft = '1px';
pageDisplay.el().style.marginRight = '1px';

// ===== 컨트롤바 배치 =====
player.ready(()=>{
  const controlBar = player.controlBar.el();
  const leftWrap = document.createElement('div');
  leftWrap.className='vjs-custom-control';
  leftWrap.style.display='flex';
  leftWrap.style.alignItems='center';
  leftWrap.appendChild(tocButton.el());
  const rightWrap=document.createElement('div');
  rightWrap.className='vjs-custom-control';
  rightWrap.style.display='flex';
  rightWrap.style.alignItems='center';
  rightWrap.style.marginLeft='auto';
  rightWrap.style.paddingRight = '10px';
  rightWrap.style.gap = '0px';
  rightWrap.appendChild(prevButton.el());
  rightWrap.appendChild(pageDisplay.el());
  rightWrap.appendChild(nextButton.el());
  controlBar.insertBefore(leftWrap, controlBar.firstChild);
  controlBar.appendChild(rightWrap);
  try { player.volume(0.5); } catch(e){}
});

// =============================
// 퀴즈 로직 (기존 그대로 유지)
// =============================
const startBtn=document.getElementById('start-btn');
const quizContainer=document.getElementById('quiz-container');
const quizResult=document.getElementById('quiz-result');
const questionEl=document.getElementById('quiz-question');
const feedbackEl=document.getElementById('quiz-feedback');
const btnO=document.getElementById('btnO');
const btnX=document.getElementById('btnX');
const retryBtn=document.getElementById('retry-btn');

const stageImg=document.createElement('img');
stageImg.id='stage-img';
stageImg.style.display='none';
const nextImgBtn=document.createElement('img');
nextImgBtn.id='next-btn';
nextImgBtn.src='../common/images/quiz/next.png';
nextImgBtn.style.display='none';
const resultImgBtn=document.createElement('img');
resultImgBtn.id='result-btn';
resultImgBtn.src='../common/images/quiz/result.png';
resultImgBtn.style.display='none';
const qBadge=document.createElement('div');
qBadge.id='q-badge';
qBadge.style.display='none';
const explainBox=document.createElement('div');
explainBox.id='explain-box';
explainBox.style.display='none';

player.ready(()=>{
  const container=player.el();
  [startBtn,quizContainer,quizResult,stageImg,nextImgBtn,resultImgBtn,qBadge,explainBox]
    .forEach(el=>{if(el&&!container.contains(el))container.appendChild(el);});
});

function hideStartBtn(){if(startBtn)startBtn.style.display='none';}
function showStartBtn(){if(startBtn)startBtn.style.display='block';}
player.on('loadstart',hideStartBtn);
player.on('loadedmetadata',hideStartBtn);
player.on('playing',hideStartBtn);
player.on('pause',hideStartBtn);
player.on('ended',()=>setTimeout(showStartBtn,0));

let inJudge=false,inExplain=false,judgeTimer=null;
function showQBadge(t){qBadge.textContent=t;qBadge.style.display='block';}
function hideQBadge(){qBadge.style.display='none';}

function enterJudgeMode(isCorrect){
  inJudge=true;inExplain=false;
  quizContainer.classList.add('plain-mode');
  quizContainer.classList.remove('explain-mode');
  questionEl.classList.remove('hidden-question');
  questionEl.classList.add('dim-question');
  hideQBadge();
  stageImg.src=isCorrect?'../common/images/quiz/correct.png':'../common/images/quiz/wrong.png';
  stageImg.style.display='block';
  clearTimeout(judgeTimer);
  judgeTimer=setTimeout(()=>enterExplainMode(isCorrect),2000);
}
function enterExplainMode(isCorrect){
  inExplain=true;
  questionEl.classList.remove('dim-question');
  questionEl.classList.add('hidden-question');
  quizContainer.classList.add('explain-mode');
  const qText=quizData[currentQuiz]?.q||'';
  showQBadge(qText);
  stageImg.src=isCorrect?'../common/images/quiz/correct_comment.png':'../common/images/quiz/wrong_comment.png';
  stageImg.style.display='block';
  const exp=(quizData[currentQuiz]?.explain||'').replace(/\n/g,'<br>');
  explainBox.innerHTML=exp;
  explainBox.style.display=exp?'block':'none';
  const isLast=(currentQuiz===quizData.length-1);
  nextImgBtn.style.display=isLast?'none':'block';
  resultImgBtn.style.display=isLast?'block':'none';
}
function exitOverlayModes(){
  inJudge=false;inExplain=false;clearTimeout(judgeTimer);
  stageImg.style.display='none';nextImgBtn.style.display='none';resultImgBtn.style.display='none';
  hideQBadge();explainBox.style.display='none';explainBox.innerHTML='';
  questionEl.classList.remove('dim-question','hidden-question');
  quizContainer.classList.remove('plain-mode','explain-mode');
}
function loadQuiz(){feedbackEl.style.display='none';if(currentQuiz<quizData.length)questionEl.innerText=quizData[currentQuiz].q;else showResult();}
function answer(userAnswer){
  if(answered||inJudge||inExplain)return;
  answered=true;
  const correctAnswer=quizData[currentQuiz].answer;
  const isCorrect=(userAnswer===correctAnswer);
  if(isCorrect)correctCount++;
  enterJudgeMode(isCorrect);
}
function goNext(){
  explainBox.style.display='none';explainBox.innerHTML='';
  stageImg.style.display='none';
  currentQuiz++;answered=false;
  exitOverlayModes();
  if(currentQuiz<quizData.length)loadQuiz();else showResult();
}
function showResult(){
  explainBox.style.display='none';explainBox.innerHTML='';
  quizContainer.classList.remove('active');
  quizResult.style.display='flex';
  document.getElementById('result-score').innerHTML=`총 ${quizData.length}문항 중 <span class="highlight">${correctCount}</span>문항을 맞히셨습니다.`;
}

window.retryQuiz=function(){
  currentQuiz=0;correctCount=0;answered=false;exitOverlayModes();
  feedbackEl.style.display='none';quizResult.style.display='none';quizContainer.classList.add('active');loadQuiz();
};
window.startQuiz=function(){
  hideStartBtn();player.pause();quizContainer.classList.add('active');loadQuiz();
};
window.addEventListener('DOMContentLoaded',()=>{
  btnO.addEventListener('click',()=>answer('O'));
  btnX.addEventListener('click',()=>answer('X'));
  retryBtn.addEventListener('click',()=>{
    quizResult.style.display='none';currentQuiz=0;correctCount=0;answered=false;
    exitOverlayModes();quizContainer.classList.add('active');loadQuiz();
  });
  nextImgBtn.addEventListener('click',goNext);
  resultImgBtn.addEventListener('click',()=>{exitOverlayModes();showResult();});
});

// =============================
// 04.html 전용 autoplay unlock
// =============================
function autoplayUnlock() {
    const video = document.getElementById('lecture-video');

    // videojs 플레이어가 생성될 때까지 기다림
    function wait() {
        if (!video || !video.player) {
            return setTimeout(wait, 100);
        }

        // video.js player 객체
        const player = video.player;

        // autoplay unlock: mute → play() → 성공 시 신뢰획득
        player.muted(true);

        const p = player.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                console.log("Autoplay unlock success");
                player.muted(false); // 필요하면 이후 unmute
            }).catch(err => {
                console.warn("Autoplay unlock failed:", err);
            });
        }
    }

    wait();
}

// 페이지 로드 후 자동 실행
document.addEventListener("DOMContentLoaded", autoplayUnlock);