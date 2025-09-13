// ================= 공통: 페이지/차시 정보 =================
const currentFile = location.pathname.split('/').pop();
const pageNum = parseInt((currentFile || '').split('.')[0], 10);
const paddedNum = String(pageNum).padStart(2, '0');
const lessonNo = detectLessonNo();
const lessonWZ = detectLessonNoWith_Zero();
const maxPage = 7;


function detectLessonNo() {
  const path = (location.pathname || '').replace(/\\/g, '/');
  const parts = path.split('/').filter(Boolean);

  // 1) URL 경로의 상위 폴더에서 1~2자리 숫자 찾기: …/02/06.html
  for (let i = parts.length - 2; i >= 0; i--) {
    if (/^\d{1,2}$/.test(parts[i])) return parseInt(parts[i], 10);
  }

  // 2) <body data-lesson="2"> 로 명시된 경우
  const bodyAttr = document.body?.getAttribute('data-lesson');
  if (bodyAttr && /^\d{1,2}$/.test(bodyAttr)) return parseInt(bodyAttr, 10);

  // 3) 쿼리스트링 ?lesson=2 또는 해시 #lesson=2
  const qs = new URLSearchParams(location.search);
  const fromQuery = qs.get('lesson') || (location.hash.match(/lesson=(\d{1,2})/)?.[1]);
  if (fromQuery) return parseInt(fromQuery, 10);

  // 4) 전역 변수로 주입된 경우
  if (typeof window.LESSON_NO === 'number') return window.LESSON_NO;

  // 5) 실패 시 기본값
  return 1;
}

function detectLessonNoWith_Zero() {
  const path = (location.pathname || '').replace(/\\/g, '/');
  const parts = path.split('/').filter(Boolean);

  // 1) …/02/06.html 처럼 상위 폴더에서 추출
  for (let i = parts.length - 2; i >= 0; i--) {
    if (/^\d{1,2}$/.test(parts[i])) return String(parseInt(parts[i], 10)).padStart(2, '0');
  }

  // 2) <body data-lesson="2">
  const bodyAttr = document.body?.getAttribute('data-lesson');
  if (bodyAttr && /^\d{1,2}$/.test(bodyAttr)) return String(parseInt(bodyAttr, 10)).padStart(2, '0');

  // 3) ?lesson=2 또는 #lesson=2
  const qs = new URLSearchParams(location.search);
  const fromQuery = qs.get('lesson') || (location.hash.match(/lesson=(\d{1,2})/)?.[1]);
  if (fromQuery) return String(parseInt(fromQuery, 10)).padStart(2, '0');

  // 4) 전역 상수
  if (typeof window.LESSON_NO === 'number') return String(window.LESSON_NO).padStart(2, '0');

  // 5) 기본값
  return '01';
}

// ================= data.js → #content-text 바인딩 =================
document.addEventListener('DOMContentLoaded', () => {
  // content_data 가 먼저 로드되어 있어야 함
  if (typeof content_data !== 'object') {
    console.warn('content_data 를 찾을 수 없습니다. data.js 로드 순서를 확인하세요.');
    return;
  }

  const entry = content_data[String(lessonNo)];
  const target = document.getElementById('content-text');

  if (!target) {
    console.warn('#content-text 요소가 없습니다.');
    return;
  }

  if (!entry) {
    target.innerHTML = `<h3>콘텐츠 준비 중</h3><p>해당 차시(${lessonNo}) 데이터가 없습니다.</p>`;
    return;
  }

  // 문서 제목 보강
  if (entry.title) document.title = entry.title;

  // summary 섹션 렌더
  const sum = entry.summary || {};
  const keys = Object.keys(sum).sort((a, b) => Number(a) - Number(b));

  if (keys.length === 0) {
    target.innerHTML = `<h3>요약 없음</h3><p>이 차시에는 summary 항목이 없습니다.</p>`;
    return;
  }

  const html = keys.map(k => {
    const sec = sum[k] || {};
    const title = sec.title || `섹션 ${k}`;
    const bodyHtml = (sec.body && Array.isArray(sec.body.content))
      ? sec.body.content.join('<br>')
      : '';
    return `<h3>${escapeHtml(title)}</h3><p>${bodyHtml}</p>`;
  }).join('');

  target.innerHTML = html;

  // (선택) 차시별 PDF 경로 동기화 (페이지 컨트롤의 버튼 외, 본문 내 다운로드 anchor가 있을 경우 반영)
  const pdfLink = document.querySelector('#pdf-actions a');
  console.warn(lessonWZ);
  if (pdfLink) pdfLink.href = `../document/summary/${lessonWZ}.pdf`;
});

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// ========== 기존 video.js 관련 코드 (원본 유지) ==========
const videoEl = document.getElementById('lecture-video');
if (videoEl) {  // 06.html에는 없을 수 있으니 안전 처리
  const sourceEl = document.createElement('source');
  sourceEl.src = `../content/01/${paddedNum}.mp3`;
  sourceEl.type = "audio/mp3";
  videoEl.appendChild(sourceEl);

  // ✅ 소스 추가 후 videojs 초기화
  const player = videojs('lecture-video');

  player.on('ended', () => {
    const eduCont = document.getElementById('education-container');
    if (eduCont) eduCont.style.display = 'block';
  });

  let currentEdu = 1;
  const totalEdu = 2;

  function updateEduView() {
    for (let i = 1; i <= totalEdu; i++) {
      const el = document.getElementById(`edu-${i}`);
      if (el) el.classList.remove('active');
    }
    const cur = document.getElementById(`edu-${currentEdu}`);
    if (cur) cur.classList.add('active');
  }

  function nextEdu() {
    if (currentEdu < totalEdu) {
      currentEdu++;
      updateEduView();
    } else {
      alert("마지막 입니다.");
    }
  }

  function prevEdu() {
    if (currentEdu > 1) {
      currentEdu--;
      updateEduView();
    } else {
      alert("처음 입니다.");
    }
  }

  // 📌 HTML에서 직접 호출할 수 있게 window에 등록
  window.nextEdu = nextEdu;
  window.prevEdu = prevEdu;

  // 사용자 정의 버튼 추가
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
  tocButton.on('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
  document.addEventListener('click', e => {
    if (!tocButton.el().contains(e.target)) dropdown.style.display = 'none';
  });

  const prevButton = player.controlBar.addChild('button', { name: 'PrevButton' });
  prevButton.addClass('vjs-custom-control');
  prevButton.el().innerHTML = '◀';
  prevButton.on('click', () => {
    if (pageNum > 1)
      location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
    else
      alert("처음 페이지입니다.");
  });

  const nextButton = player.controlBar.addChild('button', { name: 'NextButton' });
  nextButton.addClass('vjs-custom-control');
  nextButton.el().innerHTML = '▶';
  nextButton.on('click', () => {
    if (pageNum < maxPage)
      location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
    else
      alert("마지막 페이지입니다.");
  });

  // PDF 다운로드 버튼
  const downloadButton = player.controlBar.addChild('button', { name: 'DownloadButton' });
  downloadButton.addClass('vjs-custom-control');
  downloadButton.el().innerHTML = '<span title="학습 자료 다운로드">📥</span>';
  const pdfPath = `../document/summary/${lessonWZ}.pdf`;
  downloadButton.on('click', () => {
    window.open(pdfPath, '_blank');
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
  rightWrapper.appendChild(downloadButton.el());

  player.ready(() => {
    const controlBar = player.controlBar.el();
    controlBar.insertBefore(leftWrapper, controlBar.firstChild);
    controlBar.appendChild(rightWrapper);

    player.volume(0.5);
  });
}

// 2초 후 content 표시, 임의로 넣어놓음
window.addEventListener('load', () => {
  setTimeout(() => {
    const cs = document.getElementById('content-screen');
    if (cs) cs.style.display = 'block';
  }, 2000);
});
