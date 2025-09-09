function startSurvey() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("page1").classList.add("visible");

  // 스크롤 잠금 해제
  document.querySelector(".wrapper").classList.remove("noscroll");
}

function goToExit() {
  window.location.href = "01.html";
}

function goToPage2() {
  for (let i = 1; i <= 5; i++) {
    if (!document.querySelector(`input[name="q${i}"]:checked`)) {
      alert(`${i}번 질문에 응답해주세요.`);
      return;
    }
  }
  document.getElementById('page1').classList.remove('visible');
  document.getElementById('page2').classList.add('visible');
}

function calculateResult() {
  let total = 0;
  for (let i = 1; i <= 10; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      alert(`${i}번 질문에 응답해주세요.`);
      return;
    }
    total += Number(selected.value);
  }

  const avg = total / 10;
  let level = "";
  if (avg < 3) {
    level = "초급자";
  } else if (avg <= 4) {
    level = "중급자";
  } else {
    level = "고급자";
  }

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = `
    <button class="result-close-btn" onclick="goToExit()">나가기</button>
    <div style="margin-top: 20px;">
      <h2>직무역량진단 결과</h2>
      <p>당신의 역량은 <strong>${level}</strong> 입니다. (평균: ${avg.toFixed(2)}점)</p>
      <p>나의 역량진단에 따라 보충 자료를 학습하세요.</p>

      <div class="card-container">
        <div class="card ${level === '초급자' ? 'highlight' : ''}">
          <h3>초급자</h3>
          <p>평균 3점 미만</p>
          <a href="content/1.pdf" download target="_black">보충자료 다운로드</a>
        </div>
        <div class="card ${level === '중급자' ? 'highlight' : ''}">
          <h3>중급자</h3>
          <p>평균 3~4점</p>
          <a href="content/2.pdf" download target="_black">보충자료 다운로드</a>
        </div>
        <div class="card ${level === '고급자' ? 'highlight' : ''}">
          <h3>고급자</h3>
          <p>평균 4점 초과</p>
          <a href="content/3.pdf" download target="_black">보충자료 다운로드</a>
        </div>
      </div>
    </div>
  `;

  document.getElementById('page2').classList.remove('visible');
}
