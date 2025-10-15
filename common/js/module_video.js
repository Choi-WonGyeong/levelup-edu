/*
  module_video.js — side-sheet INSIDE player (j20251015)
*/
(function () {
  'use strict';

  // =============================
  // Utilities
  // =============================
  function qs(sel, root) { return (root || document).querySelector(sel); }
  function to2(n) { return String(n).padStart(2, '0'); }
  function getPathInfo() {
    var parts = location.pathname.split('/').filter(Boolean);
    var file = parts[parts.length - 1] || '01.html';
    var chapter = parts[parts.length - 2] || '01';
    var page = (file.split('.html')[0] || '01');
    return { chapter: chapter, page: page };
  }
  function pageCount(cfg) {
    var pt = (cfg && cfg.page_type) || {};
    var keys = Object.keys(pt);
    return keys.length || 8;
  }
  function pageTitle(cfg, i) {
    var e = (cfg && cfg.page_type && cfg.page_type[String(i)]) || null;
    return (e && e.title) ? e.title : (to2(i) + '차시');
  }

  // =============================
  // Inject CSS
  // =============================
  function ensureStyles() {
    if (qs('#mv-refactor-style')) return;
    var css = [
      /* video.js 커스텀 컨트롤 */
      '.vjs-custom-control{font-size:14px;color:#fff;display:flex;align-items:center;gap:8px;}',
      '.vjs-custom-control--menu { padding: 3px 0 0 10px; }',

      /* 플레이어 내부 사이드 시트 */
      '.vjs-side-sheet{position:absolute;top:0;left:0;width:280px;height:100%;' +
      'background:rgba(0,0,0,.88);color:#fff;transform:translateX(-100%);' +
      'transition:transform .25s ease;z-index:40;display:flex;flex-direction:column;}',
      '.vjs-side-sheet.on{transform:translateX(0);}',

      /* 플레이어 내부 오버레이 */
      '.vjs-side-overlay{position:absolute;inset:0;background:rgba(0,0,0,.35);' +
      'opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:39;}',
      '.vjs-side-overlay.on{opacity:1;pointer-events:auto;}',

      /* 헤더/바디 */
      '.vjs-sheet-header{display:flex;justify-content:space-between;align-items:center;' +
      'padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.2);font-size:16px;}',
      '.vjs-close-btn{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;}',
      '.vjs-sheet-body{flex:1;overflow-y:auto;padding:12px;}',
      '.vjs-sheet-item{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.1);cursor:pointer;}',
      '.vjs-sheet-item:hover{background:rgba(255,255,255,.15);}'

    ].join('');
    var style = document.createElement('style');
    style.id = 'mv-refactor-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // =============================
  // Overlay close handler (00.html -> postMessage('close-intro'))
  // =============================
  function bindOverlayClose() {
    window.addEventListener('message', function (event) {
      if (event && event.data === 'close-intro') {
        var overlay = qs('#intro-overlay');
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
    });
  }

  // =============================
  // Wait for video.js player
  // =============================
  function waitForPlayer(cb, tries) {
    tries = tries || 60; // ~6s
    var id = qs('#player') ? 'player' : (qs('#lecture-video') ? 'lecture-video' : null);
    if (!id) {
      if (tries <= 0) return;
      return setTimeout(function(){ waitForPlayer(cb, tries-1); }, 100);
    }
    var p = (window.videojs && window.videojs.getPlayer) ? window.videojs.getPlayer(id) : (window.videojs ? window.videojs(id) : null);
    if (p && typeof p.ready === 'function') {
      return p.ready(function(){ cb(p, id); });
    }
    if (tries <= 0) return;
    setTimeout(function(){ waitForPlayer(cb, tries-1); }, 100);
  }

  // =============================
  // Build custom controls
  // =============================
  function buildControls(player, cfg, pageNum, maxPage) {
    var controlBar = player && player.controlBar && player.controlBar.el ? player.controlBar.el() : null;
    var playerEl = player && player.el ? player.el() : null;
    if (!controlBar || !playerEl) return;

    // 플레이어 루트에 relative 보장(오버레이/시트 절대위치 기준)
    var cs = window.getComputedStyle(playerEl);
    if (cs.position === 'static') playerEl.style.position = 'relative';

    // 📖 TOC 버튼 → 플레이어 내부 사이드시트
    var tocBtn = (function(){
      var btn = document.createElement('div');
      btn.className = 'vjs-custom-control vjs-custom-control--menu';
      btn.title = '목차';
      btn.textContent = '📖';

      // 내부 오버레이 & 시트
      var overlay = document.createElement('div');
      overlay.className = 'vjs-side-overlay';
      playerEl.appendChild(overlay);

      var sheet = document.createElement('div');
      sheet.className = 'vjs-side-sheet';
      sheet.innerHTML = (
        '<div class="vjs-sheet-header">' +
          '<span>목차</span>' +
          '<button class="vjs-close-btn" type="button" aria-label="닫기">✕</button>' +
        '</div>' +
        '<div class="vjs-sheet-body"></div>'
      );
      playerEl.appendChild(sheet);

      // 항목 채우기
      var body = sheet.querySelector('.vjs-sheet-body');
      for (var i = 1; i <= maxPage; i++) {
        var item = document.createElement('div');
        item.textContent = pageTitle(cfg, i);
        item.className = 'vjs-sheet-item';
        (function(target){
          item.onclick = function(){ location.href = to2(target) + '.html'; };
        })(i);
        body.appendChild(item);
      }

      // 열기/닫기
      function openSheet(e){
        if (e) e.stopPropagation();
        sheet.classList.add('on');
        overlay.classList.add('on');
      }
      function closeSheet(){
        sheet.classList.remove('on');
        overlay.classList.remove('on');
      }

      btn.addEventListener('click', openSheet);
      sheet.querySelector('.vjs-close-btn').addEventListener('click', closeSheet);
      overlay.addEventListener('click', closeSheet);
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

      // 비디오 클릭 시 시트가 열려있으면 닫힘(선택)
      playerEl.addEventListener('click', function(e){
        if (sheet.classList.contains('on')) {
          // 컨트롤 버튼 자체 클릭은 제외
          var t = e.target;
          if (!sheet.contains(t) && t !== btn) closeSheet();
        }
      });

      return btn;
    })();

    // Prev / Next / Page display
    function makeBtn(text, title) {
      var b = document.createElement('div');
      b.className = 'vjs-custom-control';
      b.textContent = text;
      if (title) b.title = title;
      b.style.cursor = 'pointer';
      return b;
    }
    var prevBtn = makeBtn('◀', '이전');
    var nextBtn = makeBtn('▶', '다음');
    var pageDisp = document.createElement('div');
    nextBtn.style.margin = '0 8px 0 0px';
    pageDisp.className = 'vjs-custom-control';
    pageDisp.textContent = to2(pageNum) + '/' + to2(maxPage);

    var hasGoPrev = typeof window.goPrevPage === 'function';
    var hasGoNext = typeof window.goNextPage === 'function';

    prevBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if (hasGoPrev) return window.goPrevPage();
      if (pageNum > 1) location.href = to2(pageNum - 1) + '.html';
      else alert('처음 페이지입니다.');
    });
    nextBtn.addEventListener('click', function(e){
      e.stopPropagation();
      if (hasGoNext) return window.goNextPage();
      if (pageNum < maxPage) location.href = to2(pageNum + 1) + '.html';
      else alert('마지막 페이지입니다.');
    });

    // 좌/우 래퍼에 장착
    var leftWrap = document.createElement('div');
    leftWrap.className = 'vjs-custom-control';
    leftWrap.style.marginRight = '8px';
    leftWrap.appendChild(tocBtn);

    var rightWrap = document.createElement('div');
    rightWrap.className = 'vjs-custom-control';
    rightWrap.style.marginLeft = 'auto';
    rightWrap.appendChild(prevBtn);
    rightWrap.appendChild(pageDisp);
    rightWrap.appendChild(nextBtn);

    controlBar.insertBefore(leftWrap, controlBar.firstChild);
    controlBar.appendChild(rightWrap);

    try { player.volume(0.5); } catch (e) {}
  }

  // =============================
  // Boot
  // =============================
  function boot() {
    ensureStyles();
    bindOverlayClose();

    var cfg = window.config || {};
    var info = getPathInfo();
    var pageNum = parseInt(info.page, 10) || 1;
    var maxPage = pageCount(cfg);

    waitForPlayer(function(player){
      buildControls(player, cfg, pageNum, maxPage);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
