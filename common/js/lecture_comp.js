function startSurvey() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("page1").classList.add("visible");

  // 스크롤 잠금 해제
  document.querySelector(".wrapper").classList.remove("noscroll");
}

function goToExit() {
  window.location.href = "01.html";
}

function goToPage(pageNum) {
  // 현재 보이는 페이지 찾기
  const currentPage = document.querySelector(".page.visible");
  if (currentPage) {
    // 현재 페이지 번호 가져오기
    const currentPageId = currentPage.id; // 예: "page3"
    const currentPageNum = parseInt(currentPageId.replace("page", ""));

    // 현재 페이지의 문항 검사
    if (!validatePage(currentPageNum)) {
      return; // 응답 누락 시 이동 막기
    }
  }

  // 모든 페이지 숨기고 이동
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("visible"));
  document.getElementById(`page${pageNum}`).classList.add("visible");
}

// 특정 페이지 응답 체크 함수
function validatePage(pageNum) {
  const start = (pageNum - 1) * 5 + 1; // 페이지별 시작 문항 번호
  const end = start + 4; // 페이지별 끝 문항 번호

  for (let i = start; i <= end; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    if (!selected) {
      alert(`${i}번 문항에 응답해주세요.`);
      return false;
    }
  }
  return true;
}

function calculateResult() {
  // 마지막 페이지 응답 검사
  if (!validatePage(6)) return;

  let total = 0;
  for (let i = 1; i <= 30; i++) {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    total += Number(selected.value);
  }

  const avg = total / 30;
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
          <a href="content/1.pdf" download target="_blank">보충자료 다운로드</a>
        </div>
        <div class="card ${level === '중급자' ? 'highlight' : ''}">
          <h3>중급자</h3>
          <p>평균 3~4점</p>
          <a href="content/2.pdf" download target="_blank">보충자료 다운로드</a>
        </div>
        <div class="card ${level === '고급자' ? 'highlight' : ''}">
          <h3>고급자</h3>
          <p>평균 4점 초과</p>
          <a href="content/3.pdf" download target="_blank">보충자료 다운로드</a>
        </div>
      </div>
    </div>
  `;

  // 결과 화면 표시
  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("visible"));
  resultDiv.classList.add("visible");

  // 스크롤 허용
  document.querySelector(".wrapper").classList.remove("noscroll");
}
