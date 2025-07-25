const currentFile = location.pathname.split('/').pop();
const pageNum = parseInt(currentFile.split('.')[0]);
const paddedNum = String(pageNum).padStart(2, '0');
const maxPage = 7;

const videoEl = document.getElementById('lecture-video');
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/${paddedNum}.mp3`;
sourceEl.type = "audio/mp3";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video');

const quizData = [
  { q: "Q1. OX 퀴즈 첫 번째 문제입니다.", answer: "O" },
  { q: "Q2. 두 번째 문제입니다.", answer: "O" },
  { q: "Q3. 마지막 문제입니다.", answer: "O" }
];
let currentQuiz = 0;
let correctCount = 0;
let answered = false;

function showQuiz() {
  document.getElementById('quiz-container').classList.add('active');
  loadQuiz();
}

function loadQuiz() {
  const questionEl = document.getElementById('quiz-question');
  const feedbackEl = document.getElementById('quiz-feedback');
  feedbackEl.style.display = "none";
  if (currentQuiz < quizData.length) {
    questionEl.innerText = quizData[currentQuiz].q;
  } else {
    document.getElementById('quiz-container').innerHTML = `
      <h3>퀴즈 완료!</h3>
      <p>맞힌 개수: ${correctCount} / ${quizData.length}</p>
      <button onclick="retryQuiz()">다시 풀기</button>
    `;
  }
}

function answer(userAnswer) {
  if (answered) return;
  answered = true;

  const feedbackEl = document.getElementById('quiz-feedback');
  const correctAnswer = quizData[currentQuiz].answer;
  const numberStr = `${currentQuiz + 1}번째 문제입니다.`;

  if (userAnswer === correctAnswer) {
    feedbackEl.innerText = `정답입니다! ✅`;
    feedbackEl.style.color = "lightgreen";
    correctCount++;
  } else {
    feedbackEl.innerText = `${numberStr}`;
    feedbackEl.style.color = "red";
  }

  feedbackEl.style.display = "block";

  setTimeout(() => {
    answered = false;
    currentQuiz++;
    loadQuiz();
  }, 1500);
}

window.retryQuiz = function () {
  currentQuiz = 0;
  correctCount = 0;
  answered = false;

  document.getElementById('quiz-container').innerHTML = `
    <div class="quiz-question" id="quiz-question"></div>
    <div class="quiz-buttons">
      <button onclick="answer('O')">O</button>
      <button onclick="answer('X')">X</button>
    </div>
    <div id="quiz-feedback" style="display:none;"></div>
  `;

  loadQuiz();
};

player.on('ended', () => {
  showQuiz();
});

// 사용자 정의 버튼 및 페이지 이동
const tocButton = player.controlBar.addChild('button', { name: 'TocButton' });
tocButton.addClass('vjs-custom-control');
tocButton.el().innerHTML = '📖';

const dropdown = document.createElement('div');
dropdown.className = 'dropdown-menu';
for (let i = 1; i <= maxPage; i++) {
  const padded = String(i).padStart(2, '0');
  const item = document.createElement('div');
  item.innerText = `${padded}차시`;
  item.onclick = () => location.href = `${padded}.html`;
  dropdown.appendChild(item);
}
tocButton.el().appendChild(dropdown);
tocButton.on('click', () => dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block');
document.addEventListener('click', e => {
  if (!tocButton.el().contains(e.target)) dropdown.style.display = 'none';
});

const prevButton = player.controlBar.addChild('button', {
  name: 'PrevButton',
  text: '이전'
});
prevButton.addClass('vjs-custom-control');
prevButton.el().innerHTML = '◀';
prevButton.on('click', () => {
  if (pageNum > 1) location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
  else alert("처음 페이지입니다.");
});

const nextButton = player.controlBar.addChild('button', {
  name: 'NextButton',
  text: '다음'
});
nextButton.addClass('vjs-custom-control');
nextButton.el().innerHTML = '▶';
nextButton.on('click', () => {
  if (pageNum < maxPage) location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
  else alert("마지막 페이지입니다.");
});

const pageDisplay = player.controlBar.addChild('component');
pageDisplay.addClass('vjs-custom-control');
pageDisplay.el().innerText = `${paddedNum}/${String(maxPage).padStart(2, '0')}`;

const leftWrapper = document.createElement('div');
leftWrapper.style.display = 'flex';
leftWrapper.style.alignItems = 'center';
leftWrapper.className = 'vjs-custom-control';

const rightWrapper = document.createElement('div');
rightWrapper.style.display = 'flex';
rightWrapper.style.alignItems = 'center';
rightWrapper.style.marginLeft = 'auto';
rightWrapper.className = 'vjs-custom-control';

leftWrapper.appendChild(tocButton.el());
rightWrapper.appendChild(prevButton.el());
rightWrapper.appendChild(pageDisplay.el());
rightWrapper.appendChild(nextButton.el());

player.ready(() => {
  const controlBar = player.controlBar.el();
  controlBar.insertBefore(leftWrapper, controlBar.firstChild);
  controlBar.appendChild(rightWrapper);
  player.volume(0.5);
});
