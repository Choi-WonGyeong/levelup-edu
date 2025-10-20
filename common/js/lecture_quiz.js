const quizData = [
  { q: "Q1. 조직 성과는 인사 조직이 효과적으로 기능하고 있는지를 평가하는 기준이 될 수 없다.", answer: "O" },
  { q: "Q2. 두 번째 문제입니다.", answer: "O" },
  { q: "Q3. 마지막 문제입니다.", answer: "O" }
];

let currentQuiz = 0;
let correctCount = 0;
let answered = false;

// ===== video.js 플레이어 =====
const videoEl = document.getElementById('lecture-video');
const currentFile = location.pathname.split('/').pop();
const pageNum = parseInt(currentFile.split('.')[0], 10) || 5;
const maxPage = 7;
const paddedNum = String(pageNum).padStart(2, '0');

// 인트로 소스 (quiz.mp4)
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/quiz.mp4`;
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

// 컨트롤바 항상 보이게 옵션 추가
const player = videojs('lecture-video', {
  inactivityTimeout: 0,
  controls: true
});

// ===== 커스텀 컨트롤 (01.html 동일) =====
const tocButton = player.controlBar.addChild('button', { name: 'TocButton' });
tocButton.addClass('vjs-custom-control');
tocButton.el().innerHTML = '📖';

const dropdown = document.createElement('div');
dropdown.className = 'dropdown-menu';
for (let i = 1; i <= maxPage; i++) {
  const p = String(i).padStart(2, '0');
  const item = document.createElement('div');
  item.innerText = `${p}차시`;
  item.onclick = () => (location.href = `${p}.html`);
  dropdown.appendChild(item);
}
tocButton.el().appendChild(dropdown);
tocButton.on('click', () => {
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});
document.addEventListener('click', (e) => {
  if (!tocButton.el().contains(e.target)) dropdown.style.display = 'none';
});

const prevButton = player.controlBar.addChild('button', { name: 'PrevButton' });
prevButton.addClass('vjs-custom-control');
prevButton.el().innerHTML = '◀';
prevButton.on('click', () => {
  if (pageNum > 1) location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
  else alert('처음 페이지입니다.');
});

const nextButton = player.controlBar.addChild('button', { name: 'NextButton' });
nextButton.addClass('vjs-custom-control');
nextButton.el().innerHTML = '▶';
nextButton.on('click', () => {
  if (pageNum < maxPage) location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
  else alert('마지막 페이지입니다.');
});

const downloadButton = player.controlBar.addChild('button', { name: 'DownloadButton' });
downloadButton.addClass('vjs-custom-control');
downloadButton.el().innerHTML = '<span title="학습 자료 다운로드">📥</span>';
downloadButton.el().classList.add('download-btn');
const pdfPath = `../document/summary/01.pdf`;
downloadButton.on('click', () => window.open(pdfPath, '_blank'));

const pageDisplay = player.controlBar.addChild('component');
pageDisplay.addClass('vjs-custom-control');
pageDisplay.el().innerText = `${paddedNum}/${String(maxPage).padStart(2, '0')}`;

// ===== 오버레이/퀴즈 요소 참조 =====
const startBtn      = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const quizResult    = document.getElementById('quiz-result');
const questionEl    = document.getElementById('quiz-question');
const feedbackEl    = document.getElementById('quiz-feedback');
const overlayEl     = document.getElementById('correct-overlay'); // (미사용)
const btnO          = document.getElementById('btnO');
const btnX          = document.getElementById('btnX');
const retryBtn      = document.getElementById('retry-btn');

// 새 오버레이들 생성 (판정/해설 이미지, next/result 버튼, 우상단 문제텍스트)
const stageImg = document.createElement('img');   // correct/wrong & *_comment
stageImg.id = 'stage-img';
stageImg.style.display = 'none';

const nextImgBtn = document.createElement('img'); // next.png
nextImgBtn.id = 'next-btn';
nextImgBtn.src = '../common/images/quiz/next.png';
nextImgBtn.style.display = 'none';

const resultImgBtn = document.createElement('img'); // result.png
resultImgBtn.id = 'result-btn';
resultImgBtn.src = '../common/images/quiz/result.png';
resultImgBtn.style.display = 'none';

const qBadge = document.createElement('div');     // 우상단 문제 텍스트
qBadge.id = 'q-badge';
qBadge.style.display = 'none';

// ===== 모든 초기 DOM 작업을 하나의 ready 블록에서 =====
player.ready(() => {
  // 컨트롤바 항상 보이도록
  player.userActive(true);

  // 커스텀 버튼 정렬
  const controlBar = player.controlBar.el();
  const leftWrapper = document.createElement('div');
  leftWrapper.className = 'vjs-custom-control';
  leftWrapper.style.display = 'flex';
  leftWrapper.style.alignItems = 'center';
  leftWrapper.appendChild(tocButton.el());

  const rightWrapper = document.createElement('div');
  rightWrapper.className = 'vjs-custom-control';
  rightWrapper.style.display = 'flex';
  rightWrapper.style.alignItems = 'center';
  rightWrapper.appendChild(prevButton.el());
  rightWrapper.appendChild(pageDisplay.el());
  rightWrapper.appendChild(nextButton.el());
  rightWrapper.appendChild(downloadButton.el());

  controlBar.insertBefore(leftWrapper, controlBar.firstChild);
  controlBar.appendChild(rightWrapper);

  // 오버레이 요소들을 플레이어 엘리먼트 내부로 이동 (비디오 위 정확히 오버레이)
  const container = player.el();
  [startBtn, quizContainer, quizResult, stageImg, nextImgBtn, resultImgBtn, qBadge]
    .forEach((el) => { if (el && !container.contains(el)) container.appendChild(el); });

  // 초기 볼륨
  player.volume(0.5);
});

// ===== START 버튼 표시/숨김 (인트로 끝나면 표시) =====
function hideStartBtn(){ if (startBtn) startBtn.style.display='none'; }
function showStartBtn(){ if (startBtn) startBtn.style.display='block'; }
player.on('loadstart', hideStartBtn);
player.on('loadedmetadata', hideStartBtn);
player.on('playing', hideStartBtn);
player.on('pause', hideStartBtn);
player.on('ended', () => setTimeout(showStartBtn, 0));

// ===== 상태 플래그 =====
let inJudge = false;
let inExplain = false;
let judgeTimer = null;

// ===== 배지 on/off =====
function showQBadge(text){ qBadge.textContent = text; qBadge.style.display = 'block'; }
function hideQBadge(){ qBadge.style.display = 'none'; }

// ===== 모드 전환 =====
function enterJudgeMode(isCorrect){
  inJudge = true; inExplain = false;

  quizContainer.classList.add('plain-mode');
  quizContainer.classList.remove('explain-mode');
  questionEl.classList.remove('hidden-question');
  questionEl.classList.add('dim-question');
  hideQBadge();

  stageImg.src = isCorrect
    ? '../common/images/quiz/correct.png'
    : '../common/images/quiz/wrong.png';
  stageImg.style.display = 'block';

  clearTimeout(judgeTimer);
  judgeTimer = setTimeout(() => enterExplainMode(isCorrect), 2000);
}

function enterExplainMode(isCorrect){
  inExplain = true;

  // 질문 숨김 + 해설 모드 전환
  questionEl.classList.remove('dim-question');
  questionEl.classList.add('hidden-question');
  quizContainer.classList.add('explain-mode');

  // 우측 상단 문제 텍스트
  const qText = quizData[currentQuiz]?.q || '';
  showQBadge(qText);

  // 해설 이미지
  stageImg.src = isCorrect
    ? '../common/images/quiz/correct_comment.png'
    : '../common/images/quiz/wrong_comment.png';
  stageImg.style.display = 'block';

  // 마지막 문제면 result, 아니면 next
  const isLast = (currentQuiz === quizData.length - 1);
  nextImgBtn.style.display   = isLast ? 'none'  : 'block';
  resultImgBtn.style.display = isLast ? 'block' : 'none';
}

function exitOverlayModes(){
  inJudge = false; inExplain = false; clearTimeout(judgeTimer);

  stageImg.style.display = 'none';
  nextImgBtn.style.display = 'none';
  resultImgBtn.style.display = 'none';
  hideQBadge();

  questionEl.classList.remove('dim-question','hidden-question');
  quizContainer.classList.remove('plain-mode','explain-mode');
}

// ===== 퀴즈 로직 =====
function loadQuiz(){
  feedbackEl.style.display = 'none';
  if (currentQuiz < quizData.length){
    questionEl.innerText = quizData[currentQuiz].q;
  } else {
    showResult();
  }
}

function answer(userAnswer){
  if (answered || inJudge || inExplain) return;
  answered = true;

  const correctAnswer = quizData[currentQuiz].answer;
  const isCorrect = (userAnswer === correctAnswer);
  if (isCorrect) correctCount++;

  enterJudgeMode(isCorrect);
}

function goNext(){
  currentQuiz++;
  answered = false;

  exitOverlayModes();

  if (currentQuiz < quizData.length){
    loadQuiz();
  } else {
    showResult();
  }
}

function showResult(){
  quizContainer.classList.remove('active');
  quizResult.style.display = 'flex';
  document.getElementById('result-score').innerHTML =
    `총 ${quizData.length}문항 중 <span class="highlight">${correctCount}</span>문항을 맞히셨습니다.`;
}

// ===== 공개 API =====
window.retryQuiz = function (){
  currentQuiz = 0;
  correctCount = 0;
  answered = false;

  exitOverlayModes();
  feedbackEl.style.display = 'none';
  quizResult.style.display = 'none';
  quizContainer.classList.add('active');
  loadQuiz();
};

window.startQuiz = function (){
  hideStartBtn();
  player.pause(); // 인트로 멈춤(컨트롤바 유지)
  quizContainer.classList.add('active');
  loadQuiz();
};

window.addEventListener('DOMContentLoaded', () => {
  btnO.addEventListener('click', () => answer('O'));
  btnX.addEventListener('click', () => answer('X'));

  retryBtn.addEventListener('click', () => {
    quizResult.style.display = 'none';
    currentQuiz = 0;
    correctCount = 0;
    answered = false;
    exitOverlayModes();
    quizContainer.classList.add('active');
    loadQuiz();
  });

  nextImgBtn.addEventListener('click', goNext);

  // result 버튼 → 결과 화면
  resultImgBtn.addEventListener('click', () => {
    exitOverlayModes();
    showResult();
  });
});
