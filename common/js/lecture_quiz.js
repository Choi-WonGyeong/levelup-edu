// lecture_quiz.js (full, judge→explain→next, 1024x600)

const quizData = [
  { q: "Q1. 조직 성과는 인사 조직이 효과적으로 기능하고 있는지를 평가하는 기준이 될 수 없다.", answer: "O" },
  { q: "Q2. 두 번째 문제입니다.", answer: "O" },
  { q: "Q3. 마지막 문제입니다.", answer: "O" }
];

let currentQuiz = 0;
let correctCount = 0;
let answered = false;

// ===== 01.html 과 동일한 video.js 플레이어 세팅 =====
const videoEl = document.getElementById('lecture-video');
const currentFile = location.pathname.split('/').pop(); // 예: "05.html"
const pageNum = parseInt(currentFile.split('.')[0], 10) || 5;
const maxPage = 7;
const paddedNum = String(pageNum).padStart(2, '0');

// 인트로 영상 소스
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/quiz.mp4`;  // 필요시 조정
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video');

// ===== 01.html 컨트롤 =====
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

// ===== 퀴즈/오버레이 요소 =====
const startBtn      = document.getElementById('start-btn');      // ../common/images/quiz/start.png
const quizContainer = document.getElementById('quiz-container'); // bgr.png 배경
const quizResult    = document.getElementById('quiz-result');
const questionEl    = document.getElementById('quiz-question');
const feedbackEl    = document.getElementById('quiz-feedback');
const btnO          = document.getElementById('btnO');
const btnX          = document.getElementById('btnX');
const retryBtn      = document.getElementById('retry-btn');

// 플레이어 DOM 안에 붙여서 1024×600 캔버스 위에 정확히 표시
player.ready(() => {
  const container = player.el();
  [startBtn, quizContainer, quizResult].forEach((el) => {
    if (el && !container.contains(el)) container.appendChild(el);
  });
});

// START 버튼 표시/숨김
function hideStartBtn(){ if (startBtn) startBtn.style.display='none'; }
function showStartBtn(){ if (startBtn) startBtn.style.display='block'; }

player.on('loadstart', hideStartBtn);
player.on('loadedmetadata', hideStartBtn);
player.on('playing', hideStartBtn);
player.on('pause', hideStartBtn);
player.on('ended', () => setTimeout(showStartBtn, 0));   // 인트로 끝났을 때만 노출

// ===== 새 오버레이: 판정/해설 이미지 + next 버튼 =====
const stageImg = document.createElement('img');  // correct.png / wrong.png / *_comment.png
stageImg.id = 'stage-img';
stageImg.style.display = 'none';

const nextGoBtn = document.createElement('img'); // next.png (우하단)
nextGoBtn.id = 'next-btn';
nextGoBtn.src = '../common/images/quiz/next.png';
nextGoBtn.style.display = 'none';

player.ready(() => {
  const container = player.el();
  container.appendChild(stageImg);
  container.appendChild(nextGoBtn);
});

// 상태 플래그
let inJudge = false;    // 정답/오답 이미지 단계
let inExplain = false;  // 해설 이미지 단계
let judgeTimer = null;

// 모드 전환
function enterJudgeMode(isCorrect){
  inJudge = true; inExplain = false;

  quizContainer.classList.remove('explain-mode'); // 안전 초기화
  quizContainer.classList.add('plain-mode');      // 흰 배경 + OX 숨김
  questionEl.classList.add('dim-question');       // 질문 흐리게

  stageImg.src = isCorrect
    ? '../common/images/quiz/correct.png'
    : '../common/images/quiz/wrong.png';
  stageImg.style.display = 'block';

  clearTimeout(judgeTimer);
  judgeTimer = setTimeout(() => enterExplainMode(isCorrect), 2000);
}

function enterExplainMode(isCorrect){
  inExplain = true;
  quizContainer.classList.add('explain-mode');

  stageImg.src = isCorrect
    ? '../common/images/quiz/correct_comment.png'
    : '../common/images/quiz/wrong_comment.png';
  stageImg.style.display = 'block';

  // ★ 마지막 문제면 result.png, 아니면 next.png
  const isLast = (currentQuiz === quizData.length - 1);
  nextGoBtn.src = isLast
    ? '../common/images/quiz/result.png'
    : '../common/images/quiz/next.png';

  nextGoBtn.style.display = 'block';
}

function exitOverlayModes(){
  inJudge = false; inExplain = false;
  clearTimeout(judgeTimer);

  stageImg.style.display = 'none';
  nextGoBtn.style.display = 'none';

  questionEl.classList.remove('dim-question');
  quizContainer.classList.remove('plain-mode', 'explain-mode');
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
  enterJudgeMode(isCorrect); // 2초 뒤 해설 진입
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

window.retryQuiz = function(){
  currentQuiz = 0; correctCount = 0; answered = false;
  exitOverlayModes();
  feedbackEl.style.display = 'none';
  quizResult.style.display = 'none';
  quizContainer.classList.add('active');
  loadQuiz();
};

window.startQuiz = function(){
  hideStartBtn();
  player.pause();                       // 영상 멈춤(컨트롤 유지)
  quizContainer.classList.add('active');
  loadQuiz();
};

// 버튼 바인딩
window.addEventListener('DOMContentLoaded', () => {
  btnO.addEventListener('click', () => answer('O'));
  btnX.addEventListener('click', () => answer('X'));
  retryBtn.addEventListener('click', () => {
    quizResult.style.display = 'none';
    currentQuiz = 0; correctCount = 0; answered = false;
    exitOverlayModes();
    quizContainer.classList.add('active');
    loadQuiz();
  });
  nextGoBtn.addEventListener('click', goNext);
});
