//application js

var has_block = false;

var overlay_contnet, title, subtitle;
title = '<h5 class="title is-5">' + page_info.title + "</h5>";
subtitle = '<h6 class="subtitle is-6">' + config.page_type[parseInt(currentPage)].title + "</h6>";
overlay_contnet =
    '<div class="vjs-overlay vjs-overlay-top-left vjs-overlay-background"><div class="column">' +
    subtitle +
    "</div></div>";

function closeNav() {
    //document.getElementById("side-menu").style.width = "0";
    $("#side-menu").css("width", "0");
    setTimeout(function () {
        $("#side-menu").css("overflow-y", "hidden");
    }, 400);

    $(".video-dim").hide();
    //player.play();
}

function goNextPage() { // 다음 페이지, currentPage, totalPage 값을 기준으로 .html 파일로 전환
    console.log("has_block : " + has_block);

    var target = parseInt(currentPage, 10) + 1;
    if (has_block) {
        $("#modal-require-quiz-process p.comment").html("평가하기의 모든 항목을 확인해주세요."); // has_block 변수가 true면 모달 띄움

        $("#modal-require-quiz-process").addClass("is-active");
        setTimeout(function () {}, 3000);
    } else {
        if (target <= totalPage) {
            document.location.href = numToNDigitStr(target, 2) + ".html";
        } else {
            alert("마지막 페이지 입니다.");
        }
    }
}

function goPrevPage() { // 이전 페이지
    var target = parseInt(currentPage, 10) - 1;
    if (target >= 1) {
        document.location.href = numToNDigitStr(target, 2) + ".html";
    } else {
        alert("첫 페이지 입니다.");
    }
}

function contentUrl() {
    var content_path, content_name, content_extension;
    content_path = config.content_path + currentChapter;
    content_name = currentPage;
    content_extension = config.page_type[parseInt(currentPage)].content_extension;

    return content_path + "/" + content_name + "." + content_extension;
}

function extraContentInit(element, target) {
    //console.log("extraContentInit");

    $(target).show().append(element);
    // $(".content-wrap")opinion-pic
    //     .show()
    //     .append(element);
}

function opinionElementInit() { // 의견 입력창, 삭제 예정
    var opinion_element =
        '<div id="opinion"><div class="opinion-wrap columns is-marginless animated fadeIn"><div id="opinion-question-area" class="column"><div class="opinion-question-inner-wrap"><div><br><br><br><br></div><div id="opinion-question-sub-title" class="media animated pulse delay-0_5s"><div class="media-left"> <figure class="image is-24x24"> <img src="../common/images/opinion/opinion_symbol.png"> </figure></div><div class="media-content"><p>sub title here</p></div></div><div id="opinion-question-body" class="exam animated fadeIn delay-0_75s"><p>body here</p></div></div><div class="opinion-question-inner-wrap"><div class="form"><textarea name="input-area" id="input-area" rows="5" placeholder="※의견을 입력하세요."></textarea><div class="actions"> <button id="btn-save" class="btn">저장하기</button> <button id="btn-opinion" class="btn button is-primary is-large modal-button" data-target="modal-opinion"> 전문가 의견보기 </button></div></div></div></div></div></div>';
    extraContentInit(opinion_element, $(".content-wrap"));
    $("#opinion-question-title .media-content").html(page_info.opinion.title);
    $("#opinion-question-sub-title .media-content").html(page_info.opinion.sub_title);
    $("#opinion-question-body").html(page_info.opinion.body);

    if (page_info.opinion.modal_content) {
        $("#opinion-modal-content").html(page_info.opinion.modal_content);
    } else {
        $("#btn-opinion").hide();
        $("#opinion-modal-content").hide();
    }

    var opinion_name = "opinion_" + encodeURIComponent(page_info.title) + "_" + currentChapter;
    if (Cookies.get(opinion_name)) {
        $("#opinion-question-area #input-area").val(decodeURIComponent(Cookies.get(opinion_name)));
    }

    $("button#btn-save").click(function () {
        if ($("#input-area").val().length > 0) {
            Cookies.set(opinion_name, encodeURIComponent($("#input-area").val()), {
                expires: config.cookie_expire
            }); // 쿠키저장
            //console.log(encodeURIComponent($("#input-area").val()));

            $("#modal-opinion-alert p.comment").html("저장 되었습니다.");
            $("#modal-opinion-alert").addClass("is-active");
            setTimeout(function () {
                $("#modal-opinion-alert").removeClass("is-active");
                clearTimeout(this);
            }, 3000);
        } else {
            $("#modal-opinion-alert p.comment").html("내용을<br/>입력해주세요.");
            $("#modal-opinion-alert").addClass("is-active");
            setTimeout(function () {
                $("#modal-opinion-alert").removeClass("is-active");
                clearTimeout(this);
            }, 3000);
        }
    });
}

function quizElementInit() { // 퀴즈 시작 버튼, 결과 출력 템플릿
    //quiz
    var quiz_length = Object.keys(page_info.quiz).length;
    var quiz_element =
        '<div id="quiz" class="container is-fullhd"><div id="intro" class="columns is-marginless"><div class="quiz-intro-right intro-wrap animated fadeInRight column"> <section class="intro-section"><h2 class="intro-title">' 
		+
        '<div><br><br><br><br><br><br><br><br><br><br><br></div><button id="start-quiz">start</button> </section></div></div><div id="assessment" class=""></div><div id="result" class=""><div class="result-title"><img src="../common/images/quiz/resulttitle.png" alt=""></div><div class="result-message"><p>총 ' +
        quiz_length +
        '문항 중 <span class="result-count"></span>문항을 맞히셨습니다.</p></div><div class="result-feedback"><p class="feedback-message feed-success">효과적인 학습을 하셨네요!</p><p class="feedback-message feed-failed">아쉽게 틀린 문항이 있으시네요.</p></div><div class="result-table"></div><div class="actions has-text-centered"><button id="retry">다시풀기</button></div></div></div>';
    extraContentInit(quiz_element, $(".content-wrap"));
}

function summaryElementInit() { // 학습 요약 화면과 출력용 HTML 템플릿 구성
    //summary
    var summary_element =
        '<div class="summary-wrap"><div class="actions"> <button id="btn-print" class="btn">인쇄하기</button> <button id="btn-download" class="btn">다운로드</button></div><div class="summary-content"></div><ul id="paginate"></ul></div>';
    var summary_print_element =
        '<section class="print-area"><h1 class="print title"></h1><h2 class="print subtitle"></h2></section>';
    extraContentInit(summary_element, $(".content-wrap"));
    extraContentInit(summary_print_element, $("main"));
}

function contentInit() { // 콘텐츠 타입별 초기화
    //set title
    document.title = config.title;

    var content_element = "";
    if (config.page_type[parseInt(currentPage)].content_extension === "mp3") { // 현재 페이지가 mp3일 경우 audio 태그 삽입
        //audio
        //console.log('audio');
        content_element =
            '<audio id="player" class="video-js vjs-has-started" controls preload="auto" autoplay="autoplay" playsinline poster="" ></audio>';
        $(".video-wrap").prepend(content_element);
        options.inactivityTimeout = 0;
    } else { // 현재 페이지가 mp4일 경우 video 태그 삽입
        //video
        //console.log('video');
        content_element =
            '<video id="player" class="video-js vjs-has-started" controls preload="auto" autoplay="autoplay" playsinline poster="" ></video>';
        $(".video-wrap").prepend(content_element);
    }

    var player;
    if (player === undefined) {
        if (parseInt(currentChapter) === 1 && parseInt(currentPage) === 1 && config.competency_test) { // 모달 띄움
            $("#player").attr("autoplay", false);
            $("#modal-competency-test").addClass("is-active");
        }
        videojs("player", options, function () {
            var obj = this;
            obj.src({
                //src: "./mov/" + currentPage + ".mp4"
                src: contentUrl(),
            });
            $("#player").append(overlay_contnet);

            obj.on("play", function () {
                $(".vjs-overlay").hide();
            });
            obj.on("pause", function () {
                $(".vjs-overlay").show();
            });

            obj.on("loadedmetadata", function () {
                if (document.location.hash.split("#time=")[1] !== undefined) { // 특정 해시값(#time=xx)이 있으면 그 시점으로 이동
                    console.log("ready : " + obj.readyState());
                    obj.currentTime(document.location.hash.split("#time=")[1]);

                    //sile menu hide;
                }
            });

            window.addEventListener("hashchange", function () {
                if (document.location.hash.split("#time=")[1] !== undefined) {
                    obj.currentTime(document.location.hash.split("#time=")[1]);
                    //sile menu hide;
                }
            });
        });
    } else {
        player.src({
            src: contentUrl(),
        });
        player.load();
    }

    //contnet page number set
    $(".current-page-str").html(currentPage + "/" + numToNDigitStr(totalPage, 2));
}

function indexInit() {  // 인덱스 구성
    var index_str = '<ul class="menu-list">';
    $.each(config.page_type, function (key, value) { // 좌측 사이드 메뉴 구성
        var indexActive = parseInt(currentPage) === parseInt(key) ? "is-active" : "";
        var subIndex = "";
        // console.log("key :" + key);
        // console.log("title :" + value.title);
        // console.log("type :" + value.type);
        var href = numToNDigitStr(key, 2) + ".html";

        if (value.type === "study" && page_info.hasOwnProperty("lecture_video") && config.menu_study_sub_index) { // study 타입이면 arrSubTitle을 서브 인덱스로 포함
            subIndex = '<ul class="sub-index">';
            $.each(page_info.lecture_video.arrSubTitle, function (key, value) {
                //console.log(href);
                // console.log("arrSubTitle : " + page_info.lecture_video.arrSubTitle[key]);
                // console.log("arrHashTime : " + page_info.lecture_video.arrHashTime[key]);

                //arrHashTime
                subIndex +=
                    '<li><a href="' +
                    href +
                    "#time=" +
                    page_info.lecture_video.arrHashTime[key] +
                    '">' +
                    page_info.lecture_video.arrSubTitle[key] +
                    "</a></li>";
            });
            subIndex += "</ul>";
        }
        index_str +=
            '<li><a class="' + indexActive + '" href="' + href + '">' + value.title + "</a>" + subIndex + "</li>";
    });
    index_str += "</ul>"; //end chapter

    // learning resources start
    if (config.learning_resources) { // 학습자료 목록 링크 생성
        index_str += "<p class='menu-label'><h2>학습자료</h2></p>";
        index_str += '<ul class="menu-list">';
        $.each(config.learning_resources_list, function (key, value) {
            var title = value.title;
            var link = config.learning_resources_path + value.file_name;

            index_str += "<li><a href='" + link + "' target='_blank'>" + title + "</a></li>";
        });
        index_str += "</ul>";
    }

    $(".menu-content-wrap").html(index_str);
}

function runningMapInit() { // 러닝맵 표시
    // running map
    content_data.forEach(function (element, index) {
        var newChapter = document.createElement("div");
        var chapterName = document.createTextNode(element.title); // 챕터 제목 목록 표시
        newChapter.appendChild(chapterName);

        if (Number(currentChapter) - 1 === index) {
            newChapter.classList.add("has-text-primary"); // 현재 챕터 강조
            //$(".subtitle").html(element);
        }

        $("#map-chapter-list").append(newChapter);
    });
}

// 전체 실행 흐름
$(function () {
    contentInit(); // 페이지 진입 시 실행되는 초기화 코드
    indexInit();
    runningMapInit();

    // 어떤 type인지에 따라 콘텐츠 로딩 방식 결정 (opinion, quiz, summary, etc.)
    //alert(config.page_type[parseInt(currentPage)].type);
    if (config.page_type[parseInt(currentPage)].type === "opinion") { 
        opinionElementInit();
    } else if (config.page_type[parseInt(currentPage)].type === "quiz") {
        quizElementInit();
    } else if (config.page_type[parseInt(currentPage)].type === "summary") {
        summaryElementInit();
    } else {
        $(".content-wrap").empty();
        $(".content-wrap").hide();
    }

    if (!config.competency_test) {
        $("#index-btn-competency-test").hide();
    }

    //competency-test link
    $("#competency-test").click(function () { // 역량 진단 검사 버튼(competency-test) 클릭 시 새 창 열기
        //location.href = competency_test_path;
        window.open(
            config.competency_test_path,
            "_blank",
            "toolbar=no,scrollbars=yes,resizable=yes,width=1024,height=700"
        );
    });
    /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
    $(".video-dim").click(closeNav);

    // Functions
    function getAll(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
    }

    // Modal
    // 모달 제어 기능 (열기/닫기)
    var rootEl = document.documentElement;
    var $modals = getAll(".modal");
    var $modalButtons = getAll(".modal-button");
    var $modalCloses = getAll(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button");

    if ($modalButtons.length > 0) {
        $modalButtons.forEach(function ($el) {
            $el.addEventListener("click", function () {
                var target = $el.dataset.target;
                openModal(target);
            });
        });
    }

    if ($modalCloses.length > 0) {
        $modalCloses.forEach(function ($el) {
            $el.addEventListener("click", function () {
                closeModals();
            });
        });
    }

    function openModal(target) { // ./modal-button 클릭 시 해당 data-target의 모달 표시, data-target은 opinion에 있는데 삭제 예정이라 코드 수정 예정
        var $target = document.getElementById(target);
        //rootEl.classList.add("is-clipped");
        $target.classList.add("is-active");
    }

    function closeModals() { // 배경 클릭하거나 닫기 버튼 누르면 모든 모달 닫힘
        //rootEl.classList.remove("is-clipped");
        $modals.forEach(function ($el) {
            $el.classList.remove("is-active");
        });
    }
});