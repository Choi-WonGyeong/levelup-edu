const quizData = [
  { q: "Q1. 조직 성과는 인사 조직이 효과적으로 기능하고 있는지를 평가하는 기준이 될 수 없다.", answer: "O" },
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
    showResult();
  }
}

function answer(userAnswer) {
  if (answered) return;
  answered = true;

  const feedbackEl = document.getElementById('quiz-feedback');
  const correctAnswer = quizData[currentQuiz].answer;

  // O/X 버튼 숨기기
  document.getElementById('btnO').style.display = 'none';
  document.getElementById('btnX').style.display = 'none';

  // 정답 overlay 보여주기
  const overlay = document.getElementById('correct-overlay');
  overlay.style.display = 'block';

  if (userAnswer === correctAnswer) {
    feedbackEl.innerText = `정답입니다! ✅`;
    feedbackEl.style.color = "lightgreen";
    correctCount++;
  } else {
    feedbackEl.innerText = `틀렸습니다! ❌ 정답: ${correctAnswer}`;
    feedbackEl.style.color = "red";
  }

  feedbackEl.style.display = "block";

  setTimeout(() => {
    answered = false;
    currentQuiz++;
    overlay.style.display = 'none';
    document.getElementById('btnO').style.display = 'inline-block';
    document.getElementById('btnX').style.display = 'inline-block';
    loadQuiz();
  }, 150);
}

function showResult() {
  document.getElementById('quiz-container').classList.remove('active');
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.style.display = 'flex';
  document.getElementById('result-score').innerHTML =
  `총 ${quizData.length}문항 중 <span class="highlight">${correctCount}</span>문항을 맞히셨습니다.`;
}

window.retryQuiz = function () {
  currentQuiz = 0;
  correctCount = 0;
  answered = false;

  document.getElementById('quiz-feedback').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  document.getElementById('quiz-container').classList.add('active');
  loadQuiz();
};

window.startQuiz = function () {
  document.getElementById('start-screen').style.display = 'none';
  showQuiz();
};
window.addEventListener('DOMContentLoaded', () => {
  const btnO = document.getElementById('btnO');
  const btnX = document.getElementById('btnX');
  const retryBtn = document.getElementById('retry-btn');

  btnO.addEventListener('click', () => answer('O'));
  btnX.addEventListener('click', () => answer('X'));

  retryBtn.addEventListener('click', () => {
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    currentQuiz = 0;
    correctCount = 0;
    answered = false;
  });
});

