/*
content_init.js j20250907
*/
(() => {
    'use strict';


    const qs = (sel, root = document) => root.querySelector(sel);
    const to2 = (n) => String(n).padStart(2, '0');


    function getPathInfo() {
        const parts = location.pathname.split('/').filter(Boolean);
        const file = parts[parts.length - 1] || '01.html';
        const chapter = parts[parts.length - 2] || '01';
        const page = (file.split('.html')[0] || '01');
        return { chapter, page };
    }


    function toArrayLike(objOrArray) {
        if (Array.isArray(objOrArray)) return objOrArray;
        if (objOrArray && typeof objOrArray === 'object') {
            return Object.keys(objOrArray).sort((a, b) => +a - +b).map(k => objOrArray[k]);
        }
        return [];
    }


    function boot() {
        const { chapter, page } = getPathInfo();
        const cfg = window.config || {};
        const data = toArrayLike(window.content_data);
        const chIndex = Math.max(0, parseInt(chapter, 10) - 1);
        const pageInfo = data[chIndex] || {};


        const totalPage = Object.keys(cfg.page_type || {}).length || 1;


        // Expose minimal info for other modules (e.g., application.js)
        window.Page = {
            chapter, page, totalPage, pageInfo,
            to2,
            goPrev() { const p = Math.max(1, parseInt(page, 10) - 1); location.href = `${to2(p)}.html`; },
            goNext() { const p = Math.min(totalPage, parseInt(page, 10) + 1); location.href = `${to2(p)}.html`; },
        };


        // Title update if element present
        const titleEl = qs('#lecture-title');
        if (titleEl) titleEl.textContent = `${parseInt(chapter, 10)}차시 강의`;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();