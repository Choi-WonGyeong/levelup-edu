function detectLessonNo() {
  const path = (location.pathname || '').replace(/\\/g, '/');
  const parts = path.split('/').filter(Boolean);

  for (let i = parts.length - 2; i >= 0; i--) {
    if (/^\d{1,2}$/.test(parts[i])) {
      return String(parseInt(parts[i], 10)).padStart(2, '0');
    }
  }

  const bodyAttr = document.body?.getAttribute('data-lesson');
  if (bodyAttr && /^\d{1,2}$/.test(bodyAttr)) {
    return String(parseInt(bodyAttr, 10)).padStart(2, '0');
  }

  return '01';
}

const lessonNo = detectLessonNo();


document.addEventListener('DOMContentLoaded', () => {
  if (window.videojs && document.getElementById('player')) {
    window.summaryPlayer = window.videojs('player', {
      controls: true,
      preload: 'auto'
    });

  }

  if (typeof content_data !== 'object') {
    console.warn('content_data 없음. data.js 확인');
    return;
  }

  const entry = content_data[lessonNo];
  const target = document.getElementById('content-text');
  if (!entry || !target) return;

  const sum = entry.summary || {};
  const keys = Object.keys(sum).sort((a, b) => Number(a) - Number(b));

  if (!keys.length) {
    target.innerHTML = '<h3>요약 없음</h3>';
  } else {
    const html = keys.map(k => {
      const sec = sum[k] || {};
      const title = sec.title || `섹션 ${k}`;
      const body = (sec.body?.content || []).join('<br>');
      return `<h3>${title}</h3><p>${body}</p>`;
    }).join('');
    target.innerHTML = html;
  }

  const pdf = document.getElementById('summary-pdf');
  if (pdf) pdf.href = `../document/summary/${lessonNo}.pdf`;
});

window.addEventListener('load', () => {
  setTimeout(() => {
    const scr = document.getElementById('content-screen');
    if (scr) scr.style.display = 'block';
  }, 500);
});
