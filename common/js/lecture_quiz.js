// lecture_quiz.js (full with judge → explain → next, Q-badge at top-right)

const quizData = [
  { q: "Q1. 조직 성과는 인사 조직이 효과적으로 기능하고 있는지를 평가하는 기준이 될 수 없다.", answer: "O" },
  { q: "Q2. 두 번째 문제입니다.", answer: "O" },
  { q: "Q3. 마지막 문제입니다.", answer: "O" }
];

let currentQuiz = 0;
let correctCount = 0;
let answered = false;

// ========== 01.html과 동일한 video.js 플레이어 ==========
const videoEl = document.getElementById('lecture-video');
const currentFile = location.pathname.split('/').pop(); // 예: "05.html"
const pageNum = parseInt(currentFile.split('.')[0], 10) || 5;
const maxPage = 7;
const paddedNum = String(pageNum).padStart(2, '0');

// 인트로 소스
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/quiz.mp4`;
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video');

// 컨트롤(목차/이전/다음/다운로드/페이지)
const tocButton = player.controlBar.addChild('button', { name: 'TocButton' });
tocButton.addClass('vjs-custom-control');
tocButton.el().innerHTML = '📖';

const dropdown = document.createElement('div');
dropdown.className = 'dropdown-menu';
for (let i = 1; i <= maxPage; i++) {
  const padded = String(i).padStart(2, '0');
  const item = document.createElement('div');
  item.innerText = `${padded}차시`;
  item.onclick = () => (location.href = `${padded}.html`);
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

const leftWrapper = document.createElement('div');
leftWrapper.className = 'vjs-custom-control';
leftWrapper.style.display = 'flex';
leftWrapper.style.alignItems = 'center';

const rightWrapper = document.createElement('div');
rightWrapper.className = 'vjs-custom-control';
rightWrapper.style.display = 'flex';
rightWrapper.style.alignItems = 'center';

leftWrapper.appendChild(tocButton.el());
rightWrapper.appendChild(prevButton.el());
rightWrapper.appendChild(pageDisplay.el());
rightWrapper.appendChild(nextButton.el());
rightWrapper.appendChild(downloadButton.el());

player.ready(() => {
  const controlBar = player.controlBar.el();
  controlBar.insertBefore(leftWrapper, controlBar.firstChild);
  controlBar.appendChild(rightWrapper);
  player.volume(0.5);
});

// ========== 오버레이/퀴즈 요소 ==========
const startBtn      = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const quizResult    = document.getElementById('quiz-result');
const questionEl    = document.getElementById('quiz-question');
const feedbackEl    = document.getElementById('quiz-feedback');
const overlayEl     = document.getElementById('correct-overlay'); // 사용하지 않지만 DOM 존재
const btnO          = document.getElementById('btnO');
const btnX          = document.getElementById('btnX');
const retryBtn      = document.getElementById('retry-btn');

// 플레이어 DOM 안으로 옮겨 정확히 비디오 위에 표시
player.ready(() => {
  const container = player.el();
  [startBtn, quizContainer, quizResult].forEach((el) => {
    if (el && !container.contains(el)) container.appendChild(el);
  });
});

// START 표시/숨김
function hideStartBtn() { if (startBtn) startBtn.style.display = 'none'; }
function showStartBtn() { if (startBtn) startBtn.style.display = 'block'; }
player.on('loadstart', hideStartBtn);
player.on('loadedmetadata', hideStartBtn);
player.on('playing', hideStartBtn);
player.on('pause', hideStartBtn);
player.on('ended', () => setTimeout(showStartBtn, 0));

// ===== 새 오버레이(판정/해설), next, Q-badge 생성 =====
const stageImg = document.createElement('img');  // correct.png / wrong.png / *_comment.png
stageImg.id = 'stage-img';
stageImg.style.display = 'none';

const nextBtn = document.createElement('img');   // next.png (우하단)
nextBtn.id = 'next-btn';
nextBtn.src = '../common/images/quiz/next.png';
nextBtn.style.display = 'none';

const qBadge = document.createElement('div');    // 해설 단계 우상단 문제 배지
qBadge.id = 'q-badge';
qBadge.style.display = 'none';

player.ready(() => {
  const container = player.el();
  container.appendChild(stageImg);
  container.appendChild(nextBtn);
  container.appendChild(qBadge);
});

// 상태 플래그
let inJudge = false;      // 판정 단계(correct.png / wrong.png)
let inExplain = false;    // 해설 단계(correct_comment.png / wrong_comment.png)
let judgeTimer = null;

// 유틸
function showQBadge(text) {
  qBadge.textContent = text;     // 순수 텍스트
  qBadge.style.display = 'block';
}
function hideQBadge() {
  qBadge.style.display = 'none';
}

// 모드 전환
function enterJudgeMode(isCorrect) {
  inJudge = true; inExplain = false;

  // 배경 흰색 + O/X 버튼 숨김 + 질문 흐리게
  quizContainer.classList.add('plain-mode');
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

function enterExplainMode(isCorrect) {
  inExplain = true;

  // 본문 질문 숨기고, 우상단 배지에 문제 노출
  questionEl.classList.remove('dim-question');
  questionEl.classList.add('hidden-question');
  const qText = quizData[currentQuiz]?.q || '';
  showQBadge(qText);

  stageImg.src = isCorrect
    ? '../common/images/quiz/correct_comment.png'
    : '../common/images/quiz/wrong_comment.png';
  stageImg.style.display = 'block';

  nextBtn.style.display = 'block';
}

function exitOverlayModes() {
  inJudge = false; inExplain = false; clearTimeout(judgeTimer);

  stageImg.style.display = 'none';
  nextBtn.style.display  = 'none';
  hideQBadge();

  questionEl.classList.remove('dim-question', 'hidden-question');
  quizContainer.classList.remove('plain-mode');
}

// ========== 퀴즈 로직 ==========
function loadQuiz() {
  feedbackEl.style.display = 'none';
  if (currentQuiz < quizData.length) {
    questionEl.innerText = quizData[currentQuiz].q;
  } else {
    showResult();
  }
}

function answer(userAnswer) {
  if (answered || inJudge || inExplain) return;
  answered = true;

  const correctAnswer = quizData[currentQuiz].answer;
  const isCorrect = (userAnswer === correctAnswer);

  if (isCorrect) correctCount++;
  enterJudgeMode(isCorrect);   // 판정 단계 진입
}

function goNext() {
  currentQuiz++;
  answered = false;

  exitOverlayModes();

  if (currentQuiz < quizData.length) {
    loadQuiz();
  } else {
    showResult();
  }
}

function showResult() {
  quizContainer.classList.remove('active');
  quizResult.style.display = 'flex';
  document.getElementById('result-score').innerHTML =
    `총 ${quizData.length}문항 중 <span class="highlight">${correctCount}</span>문항을 맞히셨습니다.`;
}

window.retryQuiz = function () {
  currentQuiz = 0;
  correctCount = 0;
  answered = false;

  exitOverlayModes();
  feedbackEl.style.display = 'none';
  quizResult.style.display = 'none';
  quizContainer.classList.add('active');
  loadQuiz();
};

window.startQuiz = function () {
  hideStartBtn();
  player.pause();                 // 영상 멈춤 (컨트롤바 유지)
  quizContainer.classList.add('active');
  loadQuiz();
};

// 버튼 바인딩
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
  nextBtn.addEventListener('click', goNext);
});
