//var arr_quiz = Object.values(page_info.quiz);
var arr_quiz = Object.keys(page_info.quiz).map(function (e) {
    return page_info.quiz[e];
});


var answers = [];
var current_step = 1;
var try_count = 1;

var required_add = [false, false, false];
has_block = false;
has_add_quiz = false;
has_reading = false;

var quiz_length = Object.keys(page_info.quiz).length;

function makeQuiz(step) {
    var check_html = '<button class="next-btn quiz-buttons animated flipInX delay-1s">다음 문제</button>';
    if (step === quiz_length)
        check_html = '<button class="result-btn quiz-buttons animated flipInX delay-1s">결과 확인</button>';
    var quiz_num_text = "Q" + step;
    var quiz_html =
        '\
    <div id="step-' +
        step +
        '" class="steps animated slideInRight">\
      <div class="rubric">\
        <div class="quiz-number q-' +
        step +
        '">' +
        "Quiz . " +
        step +
        '</div>\
        <p class="quiz-title">question ' +
        quiz_num_text +
        ' here</p>\
      </div>\
      <div class="notice-wrap">\
        <p class="notice"></p>\
      </div>\
      <div class="choices">\
        <ul>\
        </ul>\
      </div>\
      <div class="check">\
        <button class="check-btn quiz-buttons animated flipInX">정답확인</button>\
        ' +
        check_html +
        '\
      </div>\
      <div class="result-area animated slideInUp">\
        <div class="correct-area ">\
          <p class="correct-title">정답</p>\
          <p class="correct-number"></p>\
        </div>\
        <div class="explain-area ">\
          <p class="explain-title">해설</p>\
          <p class="explain-body">explain here</p>\
        </div>\
      </div>\
    </div>\
  ';
    return quiz_html;
}

function quizInit() {
    try_count = 1;
    current_step = 1;
    answers = [];
    $("#result").hide();
    $("#assessment").show();
    $(".result-area").hide();
    $(".notice").html("");
    $(".next-area").hide();
    // $(".check-v").hide();
    $(".choices li").removeClass("selected");
    $(".choices li.disabled").removeClass("disabled");
    $(".check-area").hide();
    $(".next-btn").hide();
    $(".result-btn").hide();
    $(".check-btn").show();
    $("#step-1").addClass("active");
    $(".result-ox").removeClass("is_x");
    $("button.check-btn").hide();

    has_block = false;
}

function setResult() {
    var correct_count = 0;
    for (var i = 0; i < quiz_length; i++) {
        if (parseInt(arr_quiz[i].correct) === answers[i]) {
            correct_count++;
            // $(".result-" + (i + 1))
            //     .find(".result-add")
            //     .hide();
            $(".result-" + (i + 1))
                .find(".result-ox")
                .removeClass("is_x");
            required_add[i] = false;
        } else {
            $(".result-" + (i + 1))
                .find(".result-ox")
                .addClass("is_x");
            // $(".result-" + (i + 1))
            //     .find(".result-add")
            //     .fadeIn()
            //     .fadeOut()
            //     .fadeIn()
            //     .fadeOut()
            //     .fadeIn()
            //     .show();

            required_add[i] = true;
        }
    }
    $(".result-count").html(correct_count);

    if (correct_count >= quiz_length) {
        has_reading = false;
        has_add_quiz = false;
        has_block = false;
        $(".feed-success").show();
        $(".feed-failed").hide();
    } else {
        has_reading = false;
        has_add_quiz = false;
        has_block = false;
        $(".feed-success").hide();
        $(".feed-failed").show();
    }
}

$(document).ready(function () {
    for (var i = 0; i < quiz_length; i++) {
        $("#assessment").append(makeQuiz(i + 1));

        $("#step-" + (i + 1) + " .quiz-title").html(arr_quiz[i].question);
        $("#step-" + (i + 1) + " .correct-number").html(arr_quiz[i].answer);
        $("#step-" + (i + 1) + " .explain-body").html(arr_quiz[i].explain);

        var choices_quiz = arr_quiz[i].choices;
        for (var j = 0; j < choices_quiz.length; j++) {
            var choice = document.createElement("li");
            var choice_span = document.createElement("span");
            var choice_num = document.createTextNode(j + 1);
            choice_span.appendChild(choice_num);
            //choice_span.append(choice_num);
            //choice.append(choice_span);
            choice.appendChild(choice_span);

            choice.setAttribute("id", "step-" + (i + 1) + "_choice-" + (j + 1));
            choice.setAttribute("class", "choice_" + (j + 1));
            var choice_str = document.createTextNode(choices_quiz[j]);
            choice.appendChild(choice_str);
            //choice.append(choice_str);
            $("#step-" + (i + 1) + " .choices ul").append(choice);
        }

        //result cell
        //<div class="result-1 result-cell"><div class="result-ox"></div></div>
        var result_cell = document.createElement("div");
        var result_cell_text = document.createElement("p");
        var cell_text = "Q" + (i + 1);
        var result_cell_text_str = document.createTextNode(cell_text);
        result_cell_text.appendChild(result_cell_text_str);
        result_cell.setAttribute("class", "result-cell result-" + (i + 1));
        var result_ox = document.createElement("div");
        result_ox.setAttribute("class", "result-ox");
        result_cell.appendChild(result_cell_text);
        result_cell.appendChild(result_ox);
        $(".result-table").append(result_cell);
    }

    $("#step-1").addClass("active");

    setResult();

    $("#start-quiz").click(function () {
        $("#intro").addClass("animated slideOutLeft");
        $("#assessment")
            .addClass("animated slideInRight")
            .show();
    });

    $("#assessment .choices li").click(function () {
        var selected = $(this)
            .attr("id")
            .split("_");
        var selected_step = parseInt(selected[0].split("-")[1], 10) - 1;
        var selected_choice = parseInt(selected[1].split("-")[1], 10);
        answers[selected_step] = selected_choice;
        current_step = selected_step;
        $("#step-" + (current_step + 1))
            .find(".choices li")
            .removeClass("selected");
        $(this).addClass("selected");
        $("button.check-btn").show();
    });

    $("#assessment button.check-btn").click(function () {
        //$(".notice").hide();
        var current_step_selector = $("#assessment #step-" + (current_step + 1));
        if (answers[current_step] !== undefined && answers[current_step] !== "undefined") {
            try_count++;

            if (parseInt(arr_quiz[current_step].correct) === answers[current_step]) {
                //$("#sound_o")[0].play();
                $(current_step_selector)
                    .find(".result-area")
                    .css("display", "flex");

                $(current_step_selector)
                    .find(".notice")
                    .html("맞았습니다.");
                $(current_step_selector)
                    .find(".check-btn")
                    .hide();
                $(current_step_selector)
                    .find(".choices li")
                    .addClass("disabled");
                if (current_step < quiz_length - 1) {
                    $(current_step_selector)
                        .find(".next-btn")
                        .show();
                } else {
                    $(current_step_selector)
                        .find(".result-btn")
                        .show();
                }
            } else {
                //$("#sound_x")[0].play();
                $("button.check-btn").fadeOut();
                $(current_step_selector)
                    .find(".notice")
                    .html("틀렸습니다.");
                if (try_count <= 1) {
                    $("#modal-alert").addClass("is-active");
                    setTimeout(function () {
                        $("#modal-alert").removeClass("is-active");
                        // $(".choices .check-v").hide();
                        // $(current_step_selector)
                        //     .find(".rubric .notice-incorrect")
                        //     .hide();
                    }, 1000);
                } else {
                    $(current_step_selector)
                        .find(".result-area")
                        .css("display", "flex");

                    $(current_step_selector)
                        .find(".check-btn")
                        .hide();
                    $(current_step_selector)
                        .find(".choices li")
                        .addClass("disabled");
                    if (current_step < quiz_length - 1) {
                        $(current_step_selector)
                            .find(".next-btn")
                            .show();
                    } else {
                        $(current_step_selector)
                            .find(".result-btn")
                            .show();
                    }
                }
            }

            // $("#assessment .choices .check-v").show();
            // $("#assessment .choices .check-v").css("top", 30 * answers[current_step] - 40);

            if (try_count >= 2 || arr_quiz[current_step].correct === answers[current_step]) {
                $(current_step_selector)
                    .find(".choices li.choice_" + arr_quiz[current_step].correct)
                    .addClass("correct_li");
            }
        } else {
            alert("답안을 선택해주세요.");
        }
    });

    $("#assessment button.next-btn").click(function () {
        current_step++;
        try_count = 1;
        // $("#assessment .choices .check-v").hide();
        $("#assessment .choices li").removeClass("correct_li");
        $("#assessment .steps").removeClass("active");
        $("#assessment #step-" + (current_step + 1)).addClass("active");
        $("button.check-btn").hide();
    });

    $("#assessment button.result-btn").click(function () {
        correct_count = 0;
        current_step = 1;
        try_count = 0;
        // $("#assessment .choices .check-v").hide();
        $("#assessment .steps").removeClass("active");
        $("#assessment").hide();
        $("#result").css("display", "flex");
        setResult();
        for (var i = 0; i < quiz_length; i++) {
            if (parseInt(arr_quiz[i].correct) === answers[i]) {
                correct_count++;
            }
        }
        $("#notice").show();
        $("#notice").addClass("slideInUp");
    });

    $("button#retry").click(function () {
        quizInit();
    });
});