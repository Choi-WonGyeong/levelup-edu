//content_data = Object.values(content_data);
content_data = Object.keys(content_data).map(function (e) {
    return content_data[e];
});

var path = document.location.pathname;
var tmp = path.split("/");
var currentChapter = tmp[tmp.length - 2];
var currentPage = tmp[tmp.length - 1].split(".html")[0];
var totalPage = Object.keys(config.page_type).length;
var page_info = content_data[parseInt(currentChapter) - 1];

window.oncontextmenu = function () {
    return false;
};

//move page function
function numToNDigitStr(num, n) {
    if (num >= Math.pow(10, n - 1)) {
        return num;
    }
    return "0" + numToNDigitStr(num, n - 1);
}

var JS = document.createElement("script");
JS.type = "text/javascript";
JS.charset = "UTF-8";
JS.src = "https://www.levelup-edu.kr/common/js/content_tracking.js";
document.getElementsByTagName('head')[0].appendChild(JS);