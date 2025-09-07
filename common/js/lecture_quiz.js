// ====== 퀴즈 데이터 ======
const quizData = [
  { q: "Q1. 조직 성과는 인사 조직이 효과적으로\n 기능하고 있는지를 평가하는 기준이 될 수 없다.", answer: "O" },
  { q: "Q2. 두 번째 문제입니다.", answer: "O" },
  { q: "Q3. 마지막 문제입니다.", answer: "O" }
];

let currentQuiz = 0;
let correctCount = 0;
let answered = false;

// ====== 퀴즈 표시 ======
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
    feedbackEl.innerText = `틀렸습니다! ❌ 정답: ${correctAnswer}`;;
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

  document.getElementById('quiz-feedback').style.display = 'none';
  loadQuiz(); 
};

// ====== 시작화면 → 퀴즈 전환 ======
window.startQuiz = function () {
  document.getElementById('start-screen').style.display = 'none';
  showQuiz();
};


window.addEventListener('DOMContentLoaded', () => {
  const btnO = document.getElementById('btnO');
  const btnX = document.getElementById('btnX');

  btnO.addEventListener('click', () => answer('O'));
  btnX.addEventListener('click', () => answer('X'));
});
