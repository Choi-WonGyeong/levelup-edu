/*
  module_video.js j20250907
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
    return keys.length || 8; // sensible default
  }
  function pageTitle(cfg, i) {
    var e = (cfg && cfg.page_type && cfg.page_type[String(i)]) || null;
    return (e && e.title) ? e.title : (to2(i) + '차시');
  }

  // Inject minimal CSS (once) so every chapter page gets the styles
  function ensureStyles() {
    if (qs('#mv-refactor-style')) return;
    var css = [
      '.vjs-custom-control{font-size:14px;color:#fff;display:flex;align-items:center;gap:8px;}',
      '.vjs-custom-control--menu .dropdown-menu{position:absolute;top:auto;bottom:calc(100% + 8px);left:0;}',
      '.vjs-custom-control--menu { padding: 3px 0px 0px 10px; }',
      '.dropdown-menu{  min-width: 160px; max-height: 220px; overflow-y: auto;\
            background: rgba(0,0,0,.65); color:#fff; padding:6px 0; border-radius:8px;\
            z-index: 9999; box-shadow: 0 6px 20px rgba(0,0,0,.25);}',
      '.dropdown-menu div{padding:8px 14px; text-align:left;}',
      '.dropdown-menu div:hover{background: rgba(255,255,255,.12);}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'mv-refactor-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // Overlay close handler (00.html -> postMessage('close-intro'))
  function bindOverlayClose() {
    window.addEventListener('message', function (event) {
      if (event && event.data === 'close-intro') {
        var overlay = qs('#intro-overlay');
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
    });
  }

  // Wait for player created by application.js
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

  function buildControls(player, cfg, pageNum, maxPage) {
    var controlBar = player && player.controlBar && player.controlBar.el ? player.controlBar.el() : null;
    if (!controlBar) return;

    // TOC (dropdown)
    var tocBtn = (function(){
      var btn = document.createElement('div');
      btn.className = 'vjs-custom-control vjs-custom-control--menu';
      btn.style.position = 'relative';
      btn.title = '목차';
      btn.textContent = '📖';
      var dd = document.createElement('div');
      dd.className = 'dropdown-menu';
      for (var i = 1; i <= maxPage; i++) {
        var item = document.createElement('div');
        item.textContent = pageTitle(cfg, i);
        (function(target){ item.onclick = function(){ location.href = to2(target) + '.html'; }; })(i);
        dd.appendChild(item);
      }
      btn.appendChild(dd);
      btn.addEventListener('click', function(e){
        e.stopPropagation();
        dd.style.display = (dd.style.display === 'block') ? 'none' : 'block';
      });
      document.addEventListener('click', function(){ dd.style.display = 'none'; });
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

    // Prefer existing navigation functions from application.js
    var hasGoPrev = typeof window.goPrevPage === 'function';
    var hasGoNext = typeof window.goNextPage === 'function';

    prevBtn.addEventListener('click', function(){
      if (hasGoPrev) return window.goPrevPage();
      if (pageNum > 1) location.href = to2(pageNum - 1) + '.html';
      else alert('처음 페이지입니다.');
    });
    nextBtn.addEventListener('click', function(){
      if (hasGoNext) return window.goNextPage();
      if (pageNum < maxPage) location.href = to2(pageNum + 1) + '.html';
      else alert('마지막 페이지입니다.');
    });

    // Layout wrappers
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

    // Mount
    controlBar.insertBefore(leftWrap, controlBar.firstChild);
    controlBar.appendChild(rightWrap);

    // Default volume
    try { player.volume(0.5); } catch (e) {}
  }

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
