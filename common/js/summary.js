//var arr_summary = Object.values(page_info.summary);
var arr_summary = Object.keys(page_info.summary).map(function (e) { // page_info.summary가 객체 형태라 Object.values 대신 Object.keys().map() 사용
    return page_info.summary[e];
}); // 요약 페이지들의 데이터 배열



function showPage(target) {
    $("section.page").removeClass("active");
    $(".indicator").removeClass("active");
    $('section[id="summary-page-' + target + '"]').addClass("active"); // 지정한 target 페이지를 표시하고 나머지는 숨김
    $('li[id="goto-page-' + target + '"]').addClass("active");
}

var show_2 = false;
var show_3 = false;

function showNext() { // 요약 페이지 2번, 3번을 모두 방문한 경우 공지 메세지를 표시
    if (show_2 && show_3) {
        $("#notice").show();
        $("#notice").addClass("slideInUp");
        $("#next-notice").show();
    }
}

$(document).ready(function () { // 문서 로드 후 실행
    $(".print-area .print.title").html(config.title); // 문서 상단에 과목명 출력
    $(".print-area .print.subtitle").html(page_info.title); // 문서 상단에 차시명 출력
    $(arr_summary).each(function (index, element) {
        var active = index === 0 ? "active" : "";
        // var summary_num = "<span>" + (index + 1) + ". </span>";
        // var summary_page = "<section id='summary-page-" + (index + 1) + "' class='page " + active + "'>";
        // summary_page += "<h2 class='page-title'>" + summary_num + element.title + "</h2>";
        // summary_page += "<ul>" + element.body + "</ul></section>";
        // $(".summary-content").append(summary_page);

        var summary_page = document.createElement("section"); // 각 요약 항목마다 section 요소를 만들어 .summary-content에 삽입
        summary_page.setAttribute("class", "page " + active);
        summary_page.setAttribute("id", "summary-page-" + (index + 1));
        var summary_title = document.createElement("h4");
        summary_title.setAttribute("class", "title is-5 page-title");
        var summary_title_text = document.createTextNode(index + 1 + ". " + element.title); // 페이지 제목
        summary_title.appendChild(summary_title_text);
        var summary_body = document.createElement("ol");
        summary_body.setAttribute("class", "page-body");
        summary_body.setAttribute("type", "1");

        var print_summary_page = document.createElement("div");
        print_summary_page.setAttribute("class", "print-summary-page content"); // 인쇄용 print-summary-page도 생성
        var print_summary_title = document.createElement("h4");
        print_summary_title.setAttribute("class", "summary-page-title");
        var print_summary_title_text = document.createTextNode(index + 1 + ". " + element.title);
        print_summary_title.appendChild(print_summary_title_text);
        var print_summary_body = document.createElement("ol");
        print_summary_body.setAttribute("class", "summary-page-body");
        print_summary_body.setAttribute("type", "1");

        //console.log(element.body.text_indent);

        element.body.text_indent.forEach(function (obj, index, array) {
            var text_indent = element.body.text_indent[index]; // 들여쓰기
            var content = element.body.content[index]; // 본문 내용
            //console.log(text_indent + " : " + content);

            var summary_list = document.createElement("li");
            var print_summary_list = document.createElement("li");
            summary_list.setAttribute("class", "text-padding-left-" + text_indent);
            print_summary_list.setAttribute("class", "text-padding-left-" + text_indent);
            var summary_text = document.createTextNode(content);
            var print_summary_text = document.createTextNode(content);

            // content split br tag
            content.split("<br>").forEach(function (element) {
                summary_list.appendChild(document.createTextNode(element));
                summary_list.appendChild(document.createElement("br"));

                print_summary_list.appendChild(document.createTextNode(element));
                print_summary_list.appendChild(document.createElement("br"));
            });

            //summary_list.appendChild(summary_text);
            //print_summary_list.appendChild(print_summary_text);

            summary_body.appendChild(summary_list);
            print_summary_body.appendChild(print_summary_list);
        });

        //console.log(summary_body);

        summary_page.appendChild(summary_title);
        summary_page.appendChild(summary_body);
        $(".summary-content").append(summary_page);

        var paginate = "<li id='goto-page-" + (index + 1) + "' class='indicator " + active + "'>1</li>"; // 페이지 하단에 이동용 버튼 생성
        $("#paginate").append(paginate);

        print_summary_page.appendChild(print_summary_title);
        print_summary_page.appendChild(print_summary_body);
        $(".print-area").append(print_summary_page);
    });

    $("#paginate .indicator").each(function (index, element) {
        $(this).click(function () { // 클릭 이벤트로 해당 페이지 표시
            showPage(index + 1);
            if (index == 1) {
                show_2 = true;
                showNext();
            } else if (index > 1) {
                show_3 = true;
                showNext();
            }
        });
    });

    $("#btn-print").click(function () { // 인쇄 및 다운로드
        window.print();
    });

    $("button#btn-download").click(function () { // 브라우저 기본 인쇄 기능 호출
        var path = config.summary_path + currentChapter + ".pdf"; // 설정된 경로에서 현재 차시 요약 PDF 열기
        window.open(path, "_blank");
    });
});