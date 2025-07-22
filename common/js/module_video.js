var button = videojs.getComponent("Button");

var indexButton = videojs.extend(button, { // 왼쪽 사이드 인덱스 메뉴 열기
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("index");

        //<i class="fas fa-bars fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-bars fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function () { // 메뉴 열면
        //TODO:
        //index modal toggle
        this.player().pause(); // 영상 재생 멈추고
        $("#side-menu").css("overflow-y", "scroll");
        $("#side-menu").css("width", "30%");

        $(".video-wrap").css("backgroundColor", "rgba(0,0,0,0.4)"); // 반투명 배경 활성화
        $(".video-dim").show();
    },
});
var replayButton = videojs.extend(button, { // 현재 콘텐츠 다시 보기
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("replay");

        //<i class="fas fa-redo fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-redo fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function () {
        //console.log("type : " + config.page_type[parseInt(currentPage)].type);

        if (config.page_type[parseInt(currentPage)].type === "quiz") { // 현재 페이지가 quiz 타입이면 페이지 전체 리로드
            document.location.reload();
        } else { // 아니면 영상 처음부터 재생
            this.player().currentTime(0);
            this.player().play();
        }
    },
});

var fullscreenToggleCustom = videojs.extend(button, { // 전체 화면 토글, screenfull.js 라이브러리 사용, 근데 정의만 되어있고 실제로 사용되지 않았음
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Full Screen");

        //<i class="fas fa-expand fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-expand fa-lg");
        btnIcon.setAttribute("id", "btnFullscreenToggle");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function (obj) {
        var video_wrap = document.getElementsByClassName("video-wrap")[0];
        if (screenfull.isEnabled) {
            console.log(screenfull.isFullscreen);
            if (!screenfull.isFullscreen) {
                screenfull.request(video_wrap);
                //<i class="fas fa-compress fa-lg"></i>
                $(".fa-expand").attr("class", "fas fa-compress fa-lg");
                $(".player-dimensions.vjs-fluid").addClass("full-screen-height"); // .player-dimensions.vjs-fluid에 클래스 추가로 높이 조절
            } else {
                screenfull.exit();
                //<i class="fas fa-expand fa-lg"></i>
                $(".fa-compress").attr("class", "fas fa-expand fa-lg");
                $(".player-dimensions.vjs-fluid").removeClass("full-screen-height"); // .player-dimensions.vjs-fluid에 클래스 제거로 높이 조절
            }
        }
    },
});

var mapButton = videojs.extend(button, { // 러닝맵 모달 열기
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Running Map");
        //this.addClass("fas");
        //this.addClass("fa-map-marked-alt");
        this.addClass("modal-button"); // Bulma 모달용 구조
        this.setAttribute("data-target", "modal-map"); // Bulma 모달용 구조

        //<i class="fas fa-map fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-map fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function (obj) {
        $("#modal-map").addClass("is-active"); // modal-map에 is-active 클래스 추가(모달 표시)
    },
});
// var helpButton = videojs.extend(button, {
//     constructor: function() {
//         button.apply(this, arguments);
//         this.controlText("Toggle Help");
//         this.addClass("vjs-icon-help");
//         this.addClass("vjs-icon-control");
//     },
//     handleClick: function() {
//         alert("HELP");
//     }
// });
var prevButton = videojs.extend(button, {
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Prev");

        //<i class="fas fa-arrow-left fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-arrow-left fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function () {
        goPrevPage(); // application.js에 정의되어 있음
    },
});
var nextButton = videojs.extend(button, {
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Next");

        //<i class="fas fa-arrow-right fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-arrow-right fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function () {
        goNextPage(); // application.js에 정의되어 있음
    },
});
var currentPageStr = videojs.extend(button, {
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Current Page");
        this.addClass("current-page-str");
    },
});

videojs.registerComponent("indexButton", indexButton);
videojs.registerComponent("replayButton", replayButton);
// videojs.registerComponent("scriptButton", scriptButton);
//videojs.registerComponent("fullscreenToggleCustom", fullscreenToggleCustom); // 이 부분 주석으로 인해 사용되지 않음을 알 수 있음
videojs.registerComponent("mapButton", mapButton);
// videojs.registerComponent("helpButton", helpButton);
videojs.registerComponent("prevButton", prevButton);
videojs.registerComponent("currentPageStr", currentPageStr);
videojs.registerComponent("nextButton", nextButton);

var options = { // Video.js 플레이어가 로딩될 때 어떤 버튼이 어떤 순서로 표시될지 지정
    fluid: true,
    controlBar: {
        children: [
            { name: "indexButton" },
            { name: "progressControl" },
            { name: "currentTimeDisplay" },
            { name: "timeDivider" },
            { name: "durationDisplay" },
            { name: "playToggle", addClass: "vjs-icon-control" },
            { name: "replayButton" },
            // { name: "playbackRateMenuButton" },
            // { name: "scriptButton" },
            { name: "volumePanel" },
            { name: "fullscreenToggleCustom" }, // 실제로는 적용 안됨
            //{ name: "fullscreenToggle" },
            { name: "mapButton" },
            // { name: "helpButton" },
            { name: "prevButton" },
            { name: "currentPageStr" },
            { name: "nextButton" },
        ],
        volumePanel: {
            inline: false,
            vertical: true,
        },
    },
    playbackRates: ["0.5", "1", "1.5", "2.0"],
    inactivityTimeout: 3000,
};
