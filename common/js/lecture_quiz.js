// lecture_quiz.js (full, final)

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

// 소스: 인트로 영상
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/quiz.mp4`;
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video');

// 컨트롤 구성 (01.html 동일)
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

// ===== 오버레이 요소 참조 및 위치 고정(비디오 위) =====
const startBtn      = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-container');
const quizResult    = document.getElementById('quiz-result');
const questionEl    = document.getElementById('quiz-question');
const feedbackEl    = document.getElementById('quiz-feedback');
const overlayEl     = document.getElementById('correct-overlay');
const btnO          = document.getElementById('btnO');
const btnX          = document.getElementById('btnX');
const retryBtn      = document.getElementById('retry-btn');

// 플레이어 DOM 안으로 옮겨 비디오 위에 정확히 오버레이
player.ready(() => {
  const container = player.el();
  [startBtn, quizContainer, quizResult].forEach((el) => {
    if (el && !container.contains(el)) container.appendChild(el);
  });
});

// START 버튼 표시/숨김
function hideStartBtn() { if (startBtn) startBtn.style.display = 'none'; }
function showStartBtn() { if (startBtn) startBtn.style.display = 'block'; }

// 재생 중에는 항상 숨김
player.on('loadstart', hideStartBtn);
player.on('loadedmetadata', hideStartBtn);
player.on('playing', hideStartBtn);
player.on('pause', hideStartBtn); // 수동 일시정지에도 안 뜨게

// 끝났을 때만 표시
player.on('ended', () => setTimeout(showStartBtn, 0));

// (선택) 자동재생 차단 시 버튼 노출 원하면 주석 해제
// const p = player.play?.(); if (p && p.catch) p.catch(() => showStartBtn());

// ===== 퀴즈 로직 =====
function loadQuiz() {
  feedbackEl.style.display = 'none';
  if (currentQuiz < quizData.length) {
    questionEl.innerText = quizData[currentQuiz].q;
  } else {
    showResult();
  }
}

function answer(userAnswer) {
  if (answered) return;
  answered = true;

  const correctAnswer = quizData[currentQuiz].answer;

  btnO.style.display = 'none';
  btnX.style.display = 'none';
  overlayEl.style.display = 'block';

  if (userAnswer === correctAnswer) {
    feedbackEl.innerText = '정답입니다! ✅';
    feedbackEl.style.color = 'lightgreen';
    correctCount++;
  } else {
    feedbackEl.innerText = `틀렸습니다! ❌ 정답: ${correctAnswer}`;
    feedbackEl.style.color = 'red';
  }
  feedbackEl.style.display = 'block';

  setTimeout(() => {
    answered = false;
    currentQuiz++;
    overlayEl.style.display = 'none';
    btnO.style.display = 'inline-block';
    btnX.style.display = 'inline-block';
    loadQuiz();
  }, 150);
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
  feedbackEl.style.display = 'none';
  quizResult.style.display = 'none';
  quizContainer.classList.add('active');
  loadQuiz();
};

// START 클릭 → 퀴즈 시작
window.startQuiz = function () {
  hideStartBtn();
  player.pause();                 // 영상 멈춤 (컨트롤바 유지)
  quizContainer.classList.add('active'); // 퀴즈 오버레이
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
    quizContainer.classList.add('active');
    loadQuiz();
  });
});
