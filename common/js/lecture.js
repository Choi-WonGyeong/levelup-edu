(function () {
  'use strict';

  // ==== 기본 설정 ====
  const videoEl = document.getElementById('lecture-video');
  const currentFile = location.pathname.split('/').pop(); // e.g., "01.html"
  const pageNum = parseInt(currentFile.split('.')[0]);
  const maxPage = 7;
  const paddedNum = String(pageNum).padStart(2, '0');
  const pdfPath = `../document/summary/01.pdf`;

  // ==== 비디오 소스 ====
  const sourceEl = document.createElement('source');
  sourceEl.src = `../content/01/${paddedNum}.mp4`;
  sourceEl.type = "video/mp4";
  videoEl.appendChild(sourceEl);

  const player = videojs('lecture-video');

  // ==== 사이드 메뉴 ====
  const overlay = document.createElement('div');
  overlay.className = 'vjs-side-overlay';
  const sheet = document.createElement('div');
  sheet.className = 'vjs-side-sheet';
  sheet.innerHTML = `
    <div class="vjs-sheet-header">
      <span class="title">목차</span>
      <button class="vjs-close-btn" type="button" aria-label="닫기">×</button>
      <span class="underline"></span>
    </div>
    <div class="vjs-sheet-body"></div>
    <div class="vjs-sheet-footer">
      <img src="../common/images/menu/char1.png" alt="char1"/>
      <img src="../common/images/menu/char2.png" alt="char2"/>
    </div>
  `;
  player.el().appendChild(overlay);
  player.el().appendChild(sheet);

  const body = sheet.querySelector('.vjs-sheet-body');
  for (let i = 1; i <= maxPage; i++) {
    const padded = String(i).padStart(2, '0');
    const item = document.createElement('div');
    item.className = 'vjs-sheet-item';
    item.innerHTML = `<div class="txt">${padded}차시</div><div class="line"></div>`;
    item.onclick = () => (location.href = `${padded}.html`);
    body.appendChild(item);
  }

  const sec = document.createElement('div');
  sec.className = 'vjs-section-title';
  sec.innerHTML = '학습자료<div class="u"></div>';
  body.appendChild(sec);

  const res = document.createElement('div');
  res.className = 'vjs-sheet-item';
  res.innerHTML = `<a class="vjs-sheet-link" href="../document/learning_resources/supplementary_learning(원본).pdf" target="_blank">보충심화학습자료</a><div class="line"></div>`;
  body.appendChild(res);

  // 메뉴 열기/닫기
  function openSheet() {
    sheet.classList.add('on');
    overlay.classList.add('on');
  }
  function closeSheet() {
    sheet.classList.remove('on');
    overlay.classList.remove('on');
  }
  sheet.querySelector('.vjs-close-btn').onclick = closeSheet;
  overlay.onclick = closeSheet;

  // ==== 비디오 컨트롤 ====
  player.ready(() => {
    const controlBar = player.controlBar.el();

    // 📖 버튼
    const menuBtn = document.createElement('div');
    menuBtn.className = 'vjs-custom-control vjs-custom-control--menu';
    menuBtn.textContent = '📖';
    menuBtn.onclick = openSheet;

    // 이전/다음/페이지표시
    const prevBtn = document.createElement('div');
    prevBtn.className = 'vjs-custom-control';
    prevBtn.textContent = '◀';
    prevBtn.onclick = () => {
      if (pageNum > 1) location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
      else alert('처음 페이지입니다.');
    };

    const nextBtn = document.createElement('div');
    nextBtn.className = 'vjs-custom-control';
    nextBtn.textContent = '▶';
    nextBtn.onclick = () => {
      if (pageNum < maxPage) location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
      else alert('마지막 페이지입니다.');
    };

    const pageDisp = document.createElement('div');
    pageDisp.className = 'vjs-custom-control';
    pageDisp.textContent = `${paddedNum}/${String(maxPage).padStart(2, '0')}`;

    // 📥 다운로드 버튼
    const downloadBtn = document.createElement('div');
    downloadBtn.className = 'vjs-custom-control download-btn';
    downloadBtn.innerHTML = '<span title="학습 자료 다운로드">📥</span>';
    downloadBtn.onclick = () => window.open(pdfPath, '_blank');

    // 배치
    const leftWrap = document.createElement('div');
    leftWrap.className = 'vjs-custom-control';
    leftWrap.appendChild(menuBtn);

    const rightWrap = document.createElement('div');
    rightWrap.className = 'vjs-custom-control';
    rightWrap.style.marginLeft = 'auto';
    rightWrap.appendChild(prevBtn);
    rightWrap.appendChild(pageDisp);
    rightWrap.appendChild(nextBtn);
    rightWrap.appendChild(downloadBtn);

    controlBar.insertBefore(leftWrap, controlBar.firstChild);
    controlBar.appendChild(rightWrap);

    player.volume(0.5);
  });
})();
