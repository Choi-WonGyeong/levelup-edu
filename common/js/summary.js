//var arr_summary = Object.values(page_info.summary);
var arr_summary = Object.keys(page_info.summary).map(function (e) {
    return page_info.summary[e];
});



function showPage(target) {
    $("section.page").removeClass("active");
    $(".indicator").removeClass("active");
    $('section[id="summary-page-' + target + '"]').addClass("active");
    $('li[id="goto-page-' + target + '"]').addClass("active");
}

var show_2 = false;
var show_3 = false;

function showNext() {
    if (show_2 && show_3) {
        $("#notice").show();
        $("#notice").addClass("slideInUp");
        $("#next-notice").show();
    }
}

$(document).ready(function () {
    $(".print-area .print.title").html(config.title);
    $(".print-area .print.subtitle").html(page_info.title);
    $(arr_summary).each(function (index, element) {
        var active = index === 0 ? "active" : "";
        // var summary_num = "<span>" + (index + 1) + ". </span>";
        // var summary_page = "<section id='summary-page-" + (index + 1) + "' class='page " + active + "'>";
        // summary_page += "<h2 class='page-title'>" + summary_num + element.title + "</h2>";
        // summary_page += "<ul>" + element.body + "</ul></section>";
        // $(".summary-content").append(summary_page);

        var summary_page = document.createElement("section");
        summary_page.setAttribute("class", "page " + active);
        summary_page.setAttribute("id", "summary-page-" + (index + 1));
        var summary_title = document.createElement("h4");
        summary_title.setAttribute("class", "title is-5 page-title");
        var summary_title_text = document.createTextNode(index + 1 + ". " + element.title);
        summary_title.appendChild(summary_title_text);
        var summary_body = document.createElement("ol");
        summary_body.setAttribute("class", "page-body");
        summary_body.setAttribute("type", "1");

        var print_summary_page = document.createElement("div");
        print_summary_page.setAttribute("class", "print-summary-page content");
        var print_summary_title = document.createElement("h4");
        print_summary_title.setAttribute("class", "summary-page-title");
        var print_summary_title_text = document.createTextNode(index + 1 + ". " + element.title);
        print_summary_title.appendChild(print_summary_title_text);
        var print_summary_body = document.createElement("ol");
        print_summary_body.setAttribute("class", "summary-page-body");
        print_summary_body.setAttribute("type", "1");

        //console.log(element.body.text_indent);

        element.body.text_indent.forEach(function (obj, index, array) {
            var text_indent = element.body.text_indent[index];
            var content = element.body.content[index];
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

        var paginate = "<li id='goto-page-" + (index + 1) + "' class='indicator " + active + "'>1</li>";
        $("#paginate").append(paginate);

        print_summary_page.appendChild(print_summary_title);
        print_summary_page.appendChild(print_summary_body);
        $(".print-area").append(print_summary_page);
    });

    $("#paginate .indicator").each(function (index, element) {
        $(this).click(function () {
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

    $("#btn-print").click(function () {
        window.print();
    });

    $("button#btn-download").click(function () {
        var path = config.summary_path + currentChapter + ".pdf";
        window.open(path, "_blank");
    });
});