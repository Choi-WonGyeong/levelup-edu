//content_data = Object.values(content_data);
content_data = Object.keys(content_data).map(function (e) {
    return content_data[e];
});

// 여기부터
var path = document.location.pathname;
var tmp = path.split("/");
var currentChapter = tmp[tmp.length - 2];
var currentPage = tmp[tmp.length - 1].split(".html")[0];
// 여기까지 현재 URL에서 챕터 및 페이지 번호 추출

var totalPage = Object.keys(config.page_type).length; // 전체 페이지 수 계산
var page_info = content_data[parseInt(currentChapter) - 1]; // 현재 페이지 정보 설정

window.oncontextmenu = function () { // 마우스 우클릭 방지
    return false;
};

//move page function
function numToNDigitStr(num, n) {
    if (num >= Math.pow(10, n - 1)) {
        return num;
    }
    return "0" + numToNDigitStr(num, n - 1);
}

// 외부 스크립트 동적 로딩
var JS = document.createElement("script");
JS.type = "text/javascript";
JS.charset = "UTF-8";
JS.src = "https://www.levelup-edu.kr/common/js/content_tracking.js";
document.getElementsByTagName('head')[0].appendChild(JS);