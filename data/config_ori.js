var config = {
    title: "[소통과 공감으로 조직을 활성화하라]",
    menu_study_sub_index: false, //menu study sub-index
    content_path: "../content/",
    competency_test: true,
    competency_test_path: "../CompetencyTest/index.html",
    cookie_expire: 1, //cookie expire day
    summary_path: "../document/summary/",
    learning_resources: true, // 학습자료 사용여부
    learning_resources_path: "../document/learning_resources/",
    learning_resources_list: [{
        title: "보충심화학습자료",
        file_name: "supplementary_learning.pdf"
    }], // 학습자료 리스트
    page_type: {
        "1": {
            title: "인트로",
            type: "",
            content_extension: "mp4"
        },
        "2": {
            title: "학습내용",
            type: "",
            content_extension: "mp4"
        },
        "3": {
            title: "학습목표",
            type: "",
            content_extension: "mp4"
        },
        "4": {
            title: "학습하기",
            type: "study",
            content_extension: "mp4"
        },
        "5": {
            title: "생각톡톡",
            type: "opinion",
            content_extension: "mp3"
        },
        "6": {
            title: "평가하기",
            type: "quiz",
            content_extension: "mp3"
        },
        "7": {
            title: "정리하기",
            type: "summary",
            content_extension: "mp3"
        },
        "8": {
            title: "Outro",
            type: "",
            content_extension: "mp4"
        }
    }
};