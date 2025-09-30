function startSurvey() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("page1").classList.add("visible");

  const wrapper = document.querySelector(".wrapper");
  wrapper.style.backgroundImage = 'url("../common/images/comp/progress1.png")'; 

  document.querySelector(".wrapper").classList.remove("noscroll");
}

function goToExit() {
  window.location.href = "01.html";
}

function goToPage(pageNum) {
  const currentPage = document.querySelector(".page.visible");

  if (currentPage) {
    const currentPageId = currentPage.id;
    const currentPageNum = parseInt(currentPageId.replace("page", ""));

    if (pageNum > currentPageNum && !validatePage(currentPageNum)) {
      return;
    }
  }

  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("visible"));
  document.getElementById(`page${pageNum}`).classList.add("visible");

  const wrapper = document.querySelector(".wrapper");
  wrapper.style.backgroundImage = `url('../common/images/comp/progress${pageNum}.png')`;
}


function validatePage(pageNum) {
  const start = (pageNum - 1) * 5 + 1;
  const end = start + 4;

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

  const pages = document.querySelectorAll(".page");
  pages.forEach(p => p.classList.remove("visible"));
  resultDiv.classList.add("visible");

  document.querySelector(".wrapper").classList.remove("noscroll");
}


///////////////////////////////////////////// 역량검사질문 /////////////////////////////////////////////
const questions = [
  "조직 내에서 인사조직의 역할과 기본적인 개념에 대해 얼마나 이해하고 있습니까ㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷㄷ?",
  "조직 내 수직적 및 수평적 커뮤니케이션의 특징을 구분하고, 각각의 사례를 파악할 수 있습니까?",
  "다양한 리더십 유형과 특성을 구분하고, 성과 중심 리더십의 핵심을 파악할 수 있습니까?",
  "조직문화에 적응하고 팀워크를 강화하기 위한 신입사원의 역할을 이해하고 실천할 수 있습니까?",
  "조직문화의 방향성을 설정하고 진단 도구를 개발하는 방법을 이해할 수 있습니까?",
  "조직문화 개선을 위한 과제를 도출하고, 실행 가능한 전략을 수립할 수 있습니까?",
  "조직구조의 개념을 이해하고, 이를 통해 업무 효율성을 분석할 수 있습니까?",
  "새로운 전략의 수용성을 높이고, 실행 활동의 성과를 분석하여 개선 방향을 도출할 수 있습니까?",
  "조직의 사업 전략에 맞춘 인력수요를 분석하고, 채용계획서를 작성할 수 있습니까?",
  "직무기술서를 기반으로 효과적인 채용 공고를 작성할 수 있습니까?",
  "서류, 면접 등 평가 전형 유형별 평가 기준을 설정하고, 디지털 선발 솔루션을 활용할 수 있습니까?",
  "신입사원 온보딩 교육의 구성 요소를 이해하고, 조직문화 정착을 위한 내부 커뮤니케이션 방안을 수립할 수 있습니까?",
  "핵심인재의 정의 기준을 이해하고, 정의-선발-육성-평가로 이어지는 관리체계의 연계 구조를 파악할 수 있습니까?",
  "다양한 기준에 따른 핵심인재 육성 방향을 설정하고, 교육 및 비교육 활동을 연계한 전략을 수립할 수 있습니까?",
  "핵심인재 평가 항목을 설정하고, 평가 결과를 활용하여 인재를 재분류하는 방식을 이해할 수 있습니까?",
  "핵심인재 평가 결과를 경영적 관점에서 활용하여 인재 분류(Pool 유지, In/Out 전략)를 결정할 수 있습니까?",
  "보고 체계와 조직문화의 상관관계를 파악하고, 효율적인 보고 체계를 설계하고 개선할 수 있습니까?",
  "인사평가제도를 진단하고, 개선 관점에 따라 평가계획서를 작성할 수 있습니까?",
  "KPI, MBO와 같은 성과지표 기반 목표관리 방식을 이해하고, 목표설정 프로세스를 실행할 수 있습니까?",
  "KPI 설정 기준을 이해하고, KPI 분석 결과를 조직문화 개선에 활용할 수 있습니까?",
  "평가자와 피평가자 교육 항목 및 운영 원칙을 이해하고, 면담 기법, 오류 방지 교육 등 커뮤니케이션 전략을 수립할 수 있습니까?",
  "인사평가 시행 절차의 전체 흐름을 이해하고, 시스템 기반의 결과 처리 및 관리 절차를 설계할 수 있습니까?",
  "인력운영관리계획 수립 절차를 이해하고, 경력개발계획서 작성 모형을 구성할 수 있습니까?",
  "소요인원 분석 기준을 이해하고, 연간 인력운영계획과 인력확보계획서를 작성할 수 있습니까?",
  "직무분석, 인건비 등을 고려하여 인력운영안을 수립하고, 승진심사 평가표를 작성할 수 있습니까?",
  "인력육성체계의 구성요소를 이해하고, 중장기 방향 및 연간교육계획서를 수립할 수 있습니까?",
  "교육과정 설계서 작성법을 이해하고, 환급교육과정 운영 유의사항을 파악할 수 있습니까?",
  "교육 운영 실무 프로세스를 이해하고, 환급교육 운영에 필요한 서류를 관리할 수 있습니까?",
  "다양한 교육성과 평가방법의 특징을 이해하고, 교육결과 보고서를 작성하여 개선 피드백을 적용할 수 있습니까?",
  "일 잘하는 구성원의 특성을 이해하고, 성과 창출을 위한 업무 습관 진단 및 개선 계획을 수립할 수 있습니까?"
];
//////////////////////////////////////////////////////////////////////////////////////////////////////


const perPage = 5;

function renderQuestions() {
  const wrapper = document.querySelector(".wrapper");
  let pageNum = 1;

  for (let i = 0; i < questions.length; i += perPage) {
    const page = document.createElement("div");
    page.id = `page${pageNum}`;
    page.className = "page";


    const container = document.createElement("div");
    container.className = "questions-container";

    for (let j = i; j < i + perPage && j < questions.length; j++) {
      const qNum = j + 1;
      container.innerHTML += `
        <div class="question-card">
          <div class="question-title">${qNum}. ${questions[j]}</div>
          <div class="options">
            <label><input type="radio" name="q${qNum}" value="5"> 매우 그렇다</label>
            <label><input type="radio" name="q${qNum}" value="4"> 다소 그런 편이다</label>
            <label><input type="radio" name="q${qNum}" value="3"> 보통이다</label>
            <label><input type="radio" name="q${qNum}" value="2"> 그렇지 않은 편이다</label>
            <label><input type="radio" name="q${qNum}" value="1"> 전혀 그렇지 않다</label>
          </div>
        </div>
      `;
    }

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";
    if (pageNum > 1) {
      btnGroup.innerHTML += `<button class="back-btn" onclick="goToPage(${pageNum - 1})"></button>`;
    }
    btnGroup.innerHTML += i + perPage < questions.length
      ? `<button class="next-btn" onclick="goToPage(${pageNum + 1})"></button>`
      : `<button class="result-btn" onclick="calculateResult()"></button>`;

    page.appendChild(container);
    page.appendChild(btnGroup);
    wrapper.appendChild(page);

    pageNum++;
  }
}



window.onload = renderQuestions;
