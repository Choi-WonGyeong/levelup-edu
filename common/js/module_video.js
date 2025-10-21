(function () {
  'use strict';

  // ===== 경로/라벨 (필요 시 수정) ==================================
  var CHAR1_SRC   = '../common/images/menu/char1.png';
  var CHAR2_SRC   = '../common/images/menu/char2.png';
  var POSTIT_SRC  = '../common/images/menu/postit.png';
  var RES_LABEL   = '보충심화학습자료';
  var RES_HREF    = '../document/learning_resources/supplementary_learning(원본).pdf';

  // ===== Utils ===================================================
  function qs(sel, root){ return (root || document).querySelector(sel); }
  function to2(n){ return String(n).padStart(2, '0'); }
  function getPathInfo(){
    var parts = location.pathname.split('/').filter(Boolean);
    var file = parts[parts.length - 1] || '01.html';
    var page = (file.split('.html')[0] || '01');
    return { page: page };
  }
  function pageCount(cfg){
    var pt = (cfg && cfg.page_type) || {};
    var keys = Object.keys(pt);
    return keys.length || 8;
  }
  function pageTitle(cfg, i){
    var e = (cfg && cfg.page_type && cfg.page_type[String(i)]) || null;
    return (e && e.title) ? e.title : (to2(i) + '차시');
  }

  // ===== Styles (스샷 스타일 + postit hover) =====================
  function ensureStyles(){
    if (qs('#mv-refactor-style')) return;
    var css =
      /* 커스텀 컨트롤 */
      '.vjs-custom-control{display:flex;align-items:center;gap:8px;color:#fff;font-size:14px;}' +

      /* 오버레이/시트 */
      '.vjs-side-overlay{position:absolute;inset:0;background:rgba(0,0,0,.35);' +
        'opacity:0;pointer-events:none;transition:opacity .25s ease;z-index:39;}' +
      '.vjs-side-overlay.on{opacity:1;pointer-events:auto;}' +

      '.vjs-side-sheet{position:absolute;top:0;left:0;width:220px;height:100%;' +
        'background:#fff;border:2px solid #ffc595ff;border-left:6px solid #f0a66a;' +
        'box-shadow:0 4px 20px rgba(0,0,0,.08);' +
        'transform:translateX(-100%);transition:transform .25s ease;z-index:40;' +
        'display:flex;flex-direction:column;overflow:hidden;}' +
      '.vjs-side-sheet.on{transform:translateX(0);}' +

      /* 헤더 */
      '.vjs-sheet-header{position:relative;display:flex;align-items:center;justify-content:flex-start;' +
        'gap:8px;padding:14px 16px 8px 25px;font-size:18px;font-weight:800;color:#222;}' +
      '.vjs-sheet-header .title{letter-spacing:-.3px; display:inline-block; transform:translateY(15px); }' +
      '.vjs-sheet-header .underline{position:absolute;left:-1px;right:14px;bottom:0;' +
        'height:6px;background:#f0a66a;border-radius:2px;}' +
      // X 버튼
      '.vjs-side-sheet .vjs-sheet-header .vjs-close-btn{margin-left:auto;background:#9aa0a6 !important;color:#fff !important;border:none !important;border-radius:45%;width:30px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;cursor:pointer;appearance:none;-webkit-appearance:none;line-height:1;transform:translateY(5px);}'+
      '.vjs-side-sheet .vjs-sheet-header .vjs-close-btn:focus{outline:2px solid rgba(0,0,0,.2);outline-offset:2px;}'+



      /* 바디 (hover 배경이 깔릴 수 있도록 relative) */
      '.vjs-sheet-body{position:relative;flex:1;overflow-y:auto;padding:12px 8px 10px 8px;overscroll-behavior:contain;scrollbar-width:thin;}' +

      /* 섹션 타이틀 */
      '.vjs-section-title{margin:12px 6px 8px 6px;font-size:17px;font-weight:800;color:#222;position:relative;}' +
      '.vjs-section-title .u{display:block;margin-top:4px;margin-left:-6px;width:calc(100% + 14px);height:5px;background:#f0a66a;border-radius:2px;}' +

      /* 항목: postit 배경을 ::before로 깔고, 텍스트는 위에 */
      '.vjs-sheet-item{position:relative;margin:4px 6px 4px 6px;padding:6px 8px 8px 14px;' +
      'cursor:pointer;color:#222;border-radius:6px;}' +
      '.vjs-sheet-item .txt{position:relative;z-index:2;font-size:15px;line-height:1.35;font-weight:700;}' +
      '.vjs-sheet-item .line{margin-top:6px;margin-left:-10px;width:90px;height:4px;background:#ffc595ff;border-radius:2px;}' +
      '.vjs-sheet-item--wide .line{ width: 150px; }'+


      /* 포스트잇 배경 (hover/active에서만 표시) */
      '.vjs-sheet-item::before{content:"";position:absolute;z-index:1;left:-50px;right:10px;top:3px;' +
      'height:35px;background:url(' + POSTIT_SRC + ') no-repeat 0 0/100% 100%;' +
      'opacity:0;transform:translateX(-6px);transition:opacity .12s ease,transform .12s ease;}' +
      '.vjs-sheet-item:hover::before, .vjs-sheet-item.is-active::before{opacity:1;transform:translateX(0);}' +

      /* 외부 링크 */
      '.vjs-sheet-link{color:#0b63bd;text-decoration:none;position:relative;z-index:2;font-size:15px;}' +
      '.vjs-sheet-link:hover{text-decoration:underline;}' +

      /* 푸터 캐릭터 */
      '.vjs-sheet-footer{padding:8px 10px 12px 10px;display:flex;justify-content:center;gap:24px;}' +
      '.vjs-sheet-footer img{height:75px;width:auto;object-fit:contain;}' +

      /* 좌 컨트롤 여백 */
      '.vjs-custom-control--menu{padding:3px 0 0 10px;}';

    var style = document.createElement('style');
    style.id = 'mv-refactor-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ===== Close intro =============================
  function bindOverlayClose(){
    window.addEventListener('message', function (event) {
      if (event && event.data === 'close-intro') {
        var overlay = qs('#intro-overlay');
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
    });
  }

  // ===== Wait player ===========================================
  function waitForPlayer(cb, tries){
    tries = tries || 60;
    var id = qs('#player') ? 'player' : (qs('#lecture-video') ? 'lecture-video' : null);
    if (!id){
      if (tries <= 0) return;
      return setTimeout(function(){ waitForPlayer(cb, tries-1); }, 100);
    }
    var p = (window.videojs && window.videojs.getPlayer)
      ? window.videojs.getPlayer(id)
      : (window.videojs ? window.videojs(id) : null);
    if (p && typeof p.ready === 'function'){
      return p.ready(function(){ cb(p, id); });
    }
    if (tries <= 0) return;
    setTimeout(function(){ waitForPlayer(cb, tries-1); }, 100);
  }

  // ===== Build controls ========================================
  function buildControls(player, cfg, pageNum, maxPage){
    var controlBar = player && player.controlBar && player.controlBar.el ? player.controlBar.el() : null;
    var playerEl = player && player.el ? player.el() : null;
    if (!controlBar || !playerEl) return;

    var cs = window.getComputedStyle(playerEl);
    if (cs.position === 'static') playerEl.style.position = 'relative';

    // 📖 버튼(시트)
    var tocBtn = (function(){
      var btn = document.createElement('div');
      btn.className = 'vjs-custom-control vjs-custom-control--menu';
      btn.title = '목차';
      btn.textContent = '📖';

      var overlay = document.createElement('div');
      overlay.className = 'vjs-side-overlay';
      playerEl.appendChild(overlay);

      var sheet = document.createElement('div');
      sheet.className = 'vjs-side-sheet';
      sheet.innerHTML =
        '<div class="vjs-sheet-header">' +
          '<span class="title">목차</span>' +
          '<button class="vjs-close-btn" type="button" aria-label="닫기">×</button>' +
          '<span class="underline"></span>' +
        '</div>' +
        '<div class="vjs-sheet-body"></div>' +
        '<div class="vjs-sheet-footer">' +
          '<img alt="char1" class="char1" src="'+ CHAR1_SRC + '"/>' +
          '<img alt="char2" class="char2" src="'+ CHAR2_SRC + '"/>' +
        '</div>';
      playerEl.appendChild(sheet);

      var body = sheet.querySelector('.vjs-sheet-body');

      // 항목 생성
      var items = [];
      for (var i = 1; i <= maxPage; i++){
        var item = document.createElement('div');
        item.className = 'vjs-sheet-item';
        item.innerHTML =
          '<div class="txt">'+ pageTitle(cfg, i) +'</div>' +
          '<div class="line"></div>';
        (function(target, el){
          // 클릭 시 현재 선택 고정(포스트잇 그대로) 후 페이지 이동
          el.addEventListener('click', function(e){
            e.stopPropagation();
            setActive(el);
            location.href = to2(target) + '.html';
          });
        })(i, item);
        body.appendChild(item);
        items.push(item);
      }

      // 구분 타이틀: 학습자료
      var sec = document.createElement('div');
      sec.className = 'vjs-section-title';
      sec.innerHTML = '학습자료<div class="u"></div>';
      body.appendChild(sec);

      // 학습자료 링크 (새 탭)
      var res = document.createElement('div');
      res.className = 'vjs-sheet-item vjs-sheet-item--wide';   // ← 보조 클래스 추가
      res.innerHTML =
        '<a class="vjs-sheet-link" href="'+ RES_HREF +'" target="_blank" rel="noopener">'+ RES_LABEL +'</a>' +
        '<div class="line"></div>';   // 밑줄 유지
      res.addEventListener('click', function(e){ e.stopPropagation(); });
      body.appendChild(res);

      // 현재 페이지를 active로
      function setActive(el){
        items.forEach(function(it){ it.classList.remove('is-active'); });
        if (el) el.classList.add('is-active');
      }

      // 열기/닫기
      function openSheet(e){
        if (e) e.stopPropagation();
        sheet.classList.add('on');
        overlay.classList.add('on');
        items.forEach(function(it){ it.classList.remove('is-active'); });
      }
      function closeSheet(){
        sheet.classList.remove('on');
        overlay.classList.remove('on');
      }
      btn.addEventListener('click', openSheet);
      sheet.querySelector('.vjs-close-btn').addEventListener('click', closeSheet);
      overlay.addEventListener('click', closeSheet);
      document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeSheet(); });

      // 시트 열려 있을 때 바깥 클릭 → 닫기
      playerEl.addEventListener('click', function(e){
        if (sheet.classList.contains('on')) {
          var t = e.target;
          if (!sheet.contains(t) && t !== btn) closeSheet();
        }
      });

      return btn;
    })();

    // Prev / Next / Page display
    function makeBtn(text, title){
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
    pageDisp.className = 'vjs-custom-control';
    pageDisp.textContent = to2(pageNum) + '/' + to2(maxPage);
    nextBtn.style.margin = '0 8px 0 0';

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

    // 좌/우 컨트롤 배치
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

    try { player.volume(0.5); } catch(e){}
  }

  // ===== Boot ===================================================
  function boot(){
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

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
