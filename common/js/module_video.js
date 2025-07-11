var button = videojs.getComponent("Button");

var indexButton = videojs.extend(button, {
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("index");

        //<i class="fas fa-bars fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-bars fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function () {
        //TODO:
        //index modal toggle
        this.player().pause();
        $("#side-menu").css("overflow-y", "scroll");
        $("#side-menu").css("width", "30%");

        $(".video-wrap").css("backgroundColor", "rgba(0,0,0,0.4)");
        $(".video-dim").show();
    },
});
var replayButton = videojs.extend(button, {
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

        if (config.page_type[parseInt(currentPage)].type === "quiz") {
            document.location.reload();
        } else {
            this.player().currentTime(0);
            this.player().play();
        }
    },
});

var fullscreenToggleCustom = videojs.extend(button, {
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
                $(".player-dimensions.vjs-fluid").addClass("full-screen-height");
            } else {
                screenfull.exit();
                //<i class="fas fa-expand fa-lg"></i>
                $(".fa-compress").attr("class", "fas fa-expand fa-lg");
                $(".player-dimensions.vjs-fluid").removeClass("full-screen-height");
            }
        }
    },
});

var mapButton = videojs.extend(button, {
    constructor: function () {
        button.apply(this, arguments);
        this.controlText("Running Map");
        //this.addClass("fas");
        //this.addClass("fa-map-marked-alt");
        this.addClass("modal-button");
        this.setAttribute("data-target", "modal-map");

        //<i class="fas fa-map fa-lg"></i>
        var btnIcon = document.createElement("i");
        btnIcon.setAttribute("class", "fas fa-map fa-lg");
        this.el_.appendChild(btnIcon);
    },
    handleClick: function (obj) {
        $("#modal-map").addClass("is-active");
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
        goPrevPage();
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
        goNextPage();
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
//videojs.registerComponent("fullscreenToggleCustom", fullscreenToggleCustom);
videojs.registerComponent("mapButton", mapButton);
// videojs.registerComponent("helpButton", helpButton);
videojs.registerComponent("prevButton", prevButton);
videojs.registerComponent("currentPageStr", currentPageStr);
videojs.registerComponent("nextButton", nextButton);
var options = {
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
            { name: "fullscreenToggleCustom" },
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
