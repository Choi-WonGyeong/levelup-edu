// const videoEl = document.getElementById('lecture-video');
// const currentFile = location.pathname.split('/').pop(); // e.g., "01.html"
// const pageNum = parseInt(currentFile.split('.')[0]);
// const maxPage = 7;
// const paddedNum = String(pageNum).padStart(2, '0');

// // 비디오 소스 추가
// const sourceEl = document.createElement('source');
// sourceEl.src = `../content/01/${paddedNum}.mp4`;
// sourceEl.type = "video/mp4";
// videoEl.appendChild(sourceEl);

// const player = videojs('lecture-video');
// const VjsButton = videojs.getComponent('Button');

// // 드롭다운 (목차) 버튼
// const tocButton = player.controlBar.addChild('button', {
//   name: 'TocButton',
//   text: '목차'
// });
// tocButton.addClass('vjs-custom-control');
// tocButton.el().innerHTML = '📖';

// // 드롭다운 메뉴 요소 생성
// const dropdown = document.createElement('div');
// dropdown.className = 'dropdown-menu';
// for (let i = 1; i <= maxPage; i++) {
//   const item = document.createElement('div');
//   const padded = String(i).padStart(2, '0');
//   item.innerText = `${padded}차시`;
//   item.onclick = () => {
//     location.href = `${padded}.html`;
//   };
//   dropdown.appendChild(item);
// }
// tocButton.el().appendChild(dropdown);

// // 드롭다운 열기/닫기
// tocButton.on('click', () => {
//   dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
// });
// document.addEventListener('click', (e) => {
//   if (!tocButton.el().contains(e.target)) {
//     dropdown.style.display = 'none';
//   }
// });

// // 이전 버튼
// const prevButton = player.controlBar.addChild('button', {
//   name: 'PrevButton',
//   text: '이전'
// });
// prevButton.addClass('vjs-custom-control');
// prevButton.el().innerHTML = '◀';
// prevButton.on('click', () => {
//   if (pageNum > 1) {
//     location.href = `${String(pageNum - 1).padStart(2, '0')}.html`;
//   } else {
//     alert("처음 페이지입니다.");
//   }
// });

// // 다음 버튼
// const nextButton = player.controlBar.addChild('button', {
//   name: 'NextButton',
//   text: '다음'
// });
// nextButton.addClass('vjs-custom-control');
// nextButton.el().innerHTML = '▶';
// nextButton.on('click', () => {
//   if (pageNum < maxPage) {
//     location.href = `${String(pageNum + 1).padStart(2, '0')}.html`;
//   } else {
//     alert("마지막 페이지입니다.");
//   }
// });

// // PDF 다운로드 버튼, 툴팁은 추후에 css 추가 후 수정 예정
// const downloadButton = player.controlBar.addChild('button', { name: 'DownloadButton' });
// downloadButton.addClass('vjs-custom-control');
// downloadButton.el().innerHTML = '<span title="학습 자료 다운로드">📥</span>';
// downloadButton.el().classList.add('download-btn');

// const pdfPath = `../document/summary/01.pdf`; // pdf 여기서 바꾸면 됨
// downloadButton.on('click', () => {
//   window.open(pdfPath, '_blank');
// });


// // 현재 페이지 표시
// const pageDisplay = player.controlBar.addChild('component');
// pageDisplay.addClass('vjs-custom-control');
// pageDisplay.el().innerText = `${paddedNum}/${String(maxPage).padStart(2, '0')}`;

// // 버튼 정렬
// const leftWrapper = document.createElement('div');
// leftWrapper.style.display = 'flex';
// leftWrapper.style.alignItems = 'center';
// leftWrapper.className = 'vjs-custom-control';

// const rightWrapper = document.createElement('div');
// rightWrapper.style.display = 'flex';
// rightWrapper.style.alignItems = 'center';
// rightWrapper.className = 'vjs-custom-control';

// leftWrapper.appendChild(tocButton.el());
// rightWrapper.appendChild(prevButton.el());
// rightWrapper.appendChild(pageDisplay.el());
// rightWrapper.appendChild(nextButton.el());
// rightWrapper.appendChild(downloadButton.el());

// player.ready(() => {
//   const controlBar = player.controlBar.el();
//   controlBar.insertBefore(leftWrapper, controlBar.firstChild);
//   controlBar.appendChild(rightWrapper);
//   player.volume(0.5);
// });