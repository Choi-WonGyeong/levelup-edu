const videoEl = document.getElementById('lecture-video');
const currentFile = location.pathname.split('/').pop(); // e.g., "01.html"
const pageNum = parseInt(currentFile.split('.')[0]);
const maxPage = 7;
const paddedNum = String(pageNum).padStart(2, '0');

// 비디오 소스 추가
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/${paddedNum}.mp4`;
sourceEl.type = "video/mp4";
videoEl.appendChild(sourceEl);

const player = videojs('lecture-video');
const VjsButton = videojs.getComponent('Button');

// === sidemenu는 module_video.js에서 자동 생성됨 ===

// 이전 버튼
const prevButton = player.controlBar.addChild('button', {
  name: 'PrevButton',
  text: '이전'
});
prevButton.addClass('vjs-custom-control');
prevButton.el().innerHTML = '◀';
prevButton.on('click', () => {
  if (pageNum > 1) {
    location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
  } else {
    alert("처음 페이지입니다.");
  }
});

// 다음 버튼
const nextButton = player.controlBar.addChild('button', {
  name: 'NextButton',
  text: '다음'
});
nextButton.addClass('vjs-custom-control');
nextButton.el().innerHTML = '▶';
nextButton.on('click', () => {
  if (pageNum < maxPage) {
    location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
  } else {
    alert("마지막 페이지입니다.");
  }
});

// PDF 다운로드 버튼
const downloadButton = player.controlBar.addChild('button', { name: 'DownloadButton' });
downloadButton.addClass('vjs-custom-control');
downloadButton.el().innerHTML = '<span title="학습 자료 다운로드">📥</span>';
downloadButton.el().classList.add('download-btn');
const pdfPath = `../document/summary/01.pdf`;
downloadButton.on('click', () => {
  window.open(pdfPath, '_blank');
});

// 현재 페이지 표시
const pageDisplay = player.controlBar.addChild('component');
pageDisplay.addClass('vjs-custom-control');
pageDisplay.el().innerText = `${paddedNum}/${String(maxPage).padStart(2, '0')}`;

// 버튼 정렬
const rightWrapper = document.createElement('div');
rightWrapper.style.display = 'flex';
rightWrapper.style.alignItems = 'center';
rightWrapper.className = 'vjs-custom-control';

rightWrapper.appendChild(prevButton.el());
rightWrapper.appendChild(pageDisplay.el());
rightWrapper.appendChild(nextButton.el());
rightWrapper.appendChild(downloadButton.el());

player.ready(() => {
  const controlBar = player.controlBar.el();
  controlBar.appendChild(rightWrapper);
  player.volume(0.5);
});
