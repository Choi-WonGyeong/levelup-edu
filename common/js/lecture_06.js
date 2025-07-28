const currentFile = location.pathname.split('/').pop();
const pageNum = parseInt(currentFile.split('.')[0]);
const paddedNum = String(pageNum).padStart(2, '0');
const maxPage = 7;

const videoEl = document.getElementById('lecture-video');
const sourceEl = document.createElement('source');
sourceEl.src = `../content/01/${paddedNum}.mp3`;
sourceEl.type = "audio/mp3";
videoEl.appendChild(sourceEl);

// ✅ 소스 추가 후 videojs 초기화
const player = videojs('lecture-video');

player.on('ended', () => {
  document.getElementById('education-container').style.display = 'block';
});

let currentEdu = 1;
const totalEdu = 2;

function updateEduView() {
  for (let i = 1; i <= totalEdu; i++) {
    document.getElementById(`edu-${i}`).classList.remove('active');
  }
  document.getElementById(`edu-${currentEdu}`).classList.add('active');
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
tocButton.on('click', () => dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block');
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
const pdfPath = `../document/summary/01.pdf`;
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
