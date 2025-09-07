/*
  application.js J20250907
*/

(() => {
  'use strict';

  // =============================
  // Utilities
  // =============================
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const to2 = (n) => String(n).padStart(2, '0');

  const getPathInfo = () => {
    const parts = location.pathname.split('/').filter(Boolean);
    const pageFile = parts[parts.length - 1] || '01.html';
    const chapter = parts[parts.length - 2] || '01';
    const page = (pageFile.split('.html')[0] || '01');
    return { chapter, page };
  };

  // =============================
  // State
  // =============================
  const state = {   //상태 관리. 현재 차시 번호, 페이지 번호, video.js 플레이어 인스턴스, 페이지 데이터 저장.
    chapter: '01',
    page: '01',
    player: /** @type {import('video.js').VideoJsPlayer|null} */ (null),
    pageInfo: null,
  };

  // =============================
  // Content URL resolver   
  // =============================
  function resolveContentUrl(cfg, data, chapter, page) {    //콘텐츠 URL 계산. <video> 또는 <audio> 태그 동적 삽입. 없으면 기본 규칙: {content_path}/{chapter}/{page}.{ext}
    // You can tailor this to your actual data schema.
    // Typical: cfg.content_path + data[chapterIndex].lecture_video.srcs[pageIndex]
    const chIndex = parseInt(chapter, 10) - 1;
    const pgIndex = parseInt(page, 10) - 1;
    const ch = Array.isArray(data) ? data[chIndex] : (data && data[chapter]);

    // Fallback: {content_path}/{chapter}/{page}.{ext}
    const ext = (cfg?.page_type && cfg.page_type[parseInt(page, 10)]?.content_extension) || 'mp4';
    if (ch && ch.lecture_video && Array.isArray(ch.lecture_video.srcs)) {
      const src = ch.lecture_video.srcs[pgIndex];
      if (src) return src; // allow absolute/relative direct use
    }
    return `${cfg?.content_path ?? '../content/'}${chapter}/${page}.${ext}`;
  }

  // =============================
  // DOM building
  // =============================
  function ensureMediaElement({ isAudio }) {
    let el = qs('#player');
    if (el) return el;

    const tag = isAudio ? 'audio' : 'video';
    el = document.createElement(tag);
    el.id = 'player';
    el.className = 'video-js vjs-default-skin';
    el.setAttribute('controls', '');
    el.setAttribute('preload', 'auto');
    // Policy-friendly defaults: allow autoplay but start muted; user can unmute via UI. j20250907 delete muted
    el.setAttribute('autoplay', '');
    el.setAttribute('playsinline', '');
    // el.setAttribute('muted', '');

    // Container: create if missing
    let wrap = qs('.video-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'video-wrap';
      document.body.prepend(wrap);
    }
    wrap.prepend(el);
    return el;
  }

  // =============================
  // Player init & events
  // =============================
  function initPlayer() {   //video.js 플레이어 생성. 생성 시 bindUnmuteOnFirstGesture, applyHashStartTime 연결.
    const isAudio = (config?.page_type && (config.page_type[parseInt(state.page, 10)]?.content_extension === 'mp3'));
    const el = ensureMediaElement({ isAudio });

    const options = {
      controls: true,
      preload: 'auto',
      autoplay: true,      // actual audio autoplay depends on policy; we start muted.
      muted: true,
      playsinline: true,
      controlBar: {
        volumePanel: { inline: false, vertical: true },
      },
      playbackRates: ['0.5', '1.0', '1.5', '2.0'],
      inactivityTimeout: 3000,
    };

    options.controlBar = Object.assign({}, options.controlBar, {       //전체화면 버튼 제거
        fullscreenToggle: false
    });

    if (!state.player) {
      state.player = window.videojs?.('player', options, function onReady() {
        const player = this;
        // Unmute hint: allow user gesture to enable sound
        bindUnmuteOnFirstGesture(player);
        applyHashStartTime(player);
      });
    } else {
      state.player.autoplay(true);
      state.player.muted(true);
    }
  }

  function bindUnmuteOnFirstGesture(player) {   //첫 사용자 클릭/키 입력 이벤트 발생 시 → player.muted(false)로 자동 해제.
    const handler = () => {
      // After first explicit user gesture in the document, we can allow sound.
      try { player.muted(false); } catch (_) {}
      document.removeEventListener('pointerdown', handler, true);
      document.removeEventListener('keydown', handler, true);
    };
    document.addEventListener('pointerdown', handler, true);
    document.addEventListener('keydown', handler, true);
  }

  function applyHashStartTime(player) {     //URL #time=123 있으면 → 해당 시간부터 재생.
    const seekFromHash = () => {
      const m = location.hash.match(/#time=(\d+(?:\.\d+)?)/);
      if (!m) return;
      const t = parseFloat(m[1]);
      if (!Number.isNaN(t)) {
        try { player.currentTime(t); } catch (_) {}
      }
    };
    seekFromHash();
    window.addEventListener('hashchange', seekFromHash);
  }

  // =============================
  // Load & play content
  // =============================
  function loadContent() {
    const src = resolveContentUrl(config, content_data, state.chapter, state.page);
    if (!state.player) initPlayer();
    state.player.src({ src });
    state.player.load();
    // If MEI/gesture allows, this will play; otherwise stays paused until user interacts.
    try { state.player.play(); } catch (_) {}
  }

  // =============================
  // Navigation
  // =============================
  function goTo(chapter, page) {
    location.href = `${chapter}/${page}.html`;
  }

  function goNextPage() {
    const total = Object.keys(config?.page_type || {}).length || 1;
    const next = Math.min(parseInt(state.page, 10) + 1, total);
    if (next === parseInt(state.page, 10)) return; // last page
    location.href = `${to2(next)}.html`;
  }

  function goPrevPage() {
    const prev = Math.max(parseInt(state.page, 10) - 1, 1);
    if (prev === parseInt(state.page, 10)) return; // first page
    location.href = `${to2(prev)}.html`;
  }

  // Expose minimal API (optional)
  window.App = {        //전역 API. 외부에서 JS 호출로도 제어 가능.
    goNextPage,
    goPrevPage,
    goTo,
    reload: () => location.reload(),
  };

  // =============================
  // Boot
  // =============================
  /*
    URL 파싱해서 state.chapter/page 결정.
    initPlayer() → loadContent() 실행.
    버튼(#prevBtn, #nextBtn)에 이벤트 바인딩.
    제목(lecture-title) 업데이트.
  */
  function boot() {
    const { chapter, page } = getPathInfo();
    state.chapter = chapter;
    state.page = page;

    // Map content_data to array if needed (compat with object form {"1": {...}})
    if (!Array.isArray(content_data)) {
      try { window.content_data = Object.keys(content_data).map(k => content_data[k]); } catch (_) {}
    }
    const chIdx = parseInt(state.chapter, 10) - 1;
    state.pageInfo = (Array.isArray(content_data) ? content_data[chIdx] : null) || {};

    initPlayer();
    loadContent();
    wireBasicUI();
  }

  function wireBasicUI() {
    // Optional: connect custom buttons if present in the DOM
    const prevBtn = qs('#prevBtn');
    const nextBtn = qs('#nextBtn');
    if (prevBtn) prevBtn.addEventListener('click', goPrevPage);
    if (nextBtn) nextBtn.addEventListener('click', goNextPage);

    // Title update (example)
    const h = qs('#lecture-title');
    if (h) h.textContent = `${parseInt(state.chapter, 10)}차시 강의`;
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();