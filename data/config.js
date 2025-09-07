// config.js j20250907
// Minimal, clean configuration object
var config = {
    title: "[TEST_20250907]",


    // Base path to media (video/audio) contents
    content_path: "../content/",


    // Enable/disable features
    competency_test: false,
    competency_test_path: "../CompetencyTest/index.html",


    // If true, show sub-index under study pages (hook points for your UI)
    menu_study_sub_index: false,


    // Optional document sections
    summary_path: "../document/summary/",
    learning_resources: true,
    learning_resources_path: "../document/learning_resources/",
    learning_resources_list: [
        { title: "보충 심화 학습자료", file_name: "supplementary_learning.pdf" }
    ],


    // Page type map (key = page number string in folder, e.g., "01.html" → key "1")
    // content_extension decides default file extension when resolving media url
    page_type: {
        "1": { title: "Intro", type: "", content_extension: "mp4" },
        "2": { title: "학습내용", type: "", content_extension: "mp4" },
        "3": { title: "학습목표", type: "", content_extension: "mp4" },
        "4": { title: "학습하기", type: "study", content_extension: "mp4" },
        "5": { title: "퀴즈", type: "quiz", content_extension: "mp4" },
        "6": { title: "의견", type: "opinion", content_extension: "mp4" },
        "7": { title: "요약", type: "summary", content_extension: "mp4" },
        "8": { title: "Outro", type: "", content_extension: "mp4" }
    }
};