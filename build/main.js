"use strict";
// // 1.popup 작성, popup에서 받은 데이터로 element 만들기
// // 2. create element(li click) -> popup 데이터 받아서 처리
// // 3. drag drop 작성, 어디에 놓을건지?
class MakeModal {
    constructor() { }
    MakeModal(E) {
        let text = document.querySelector(".ModalTopBarLeft");
        let label = document.querySelector('label[for=".ModalContentInput"]');
        let title = E.textContent;
        if (title == "IMAGE" || title == "VIDEO") {
            title = "URL";
        }
        else {
            title = "Content";
        }
        if (MakeModal.window && text) {
            label.textContent = title;
            MakeModal.window.style.display = "flex";
            text.textContent = E.textContent;
        }
        return window;
    }
    RemoveModal() {
        let title = document.querySelector(".ModalTitleInput");
        let content = document.querySelector(".ModalContentInput");
        if (title && content && MakeModal.window) {
            MakeModal.window.style.display = "none";
            title.value = "";
            content.value = "";
        }
    }
    ModalValue() {
        var _a;
        let target = (_a = document.querySelector(".ModalTopBarLeft")) === null || _a === void 0 ? void 0 : _a.textContent;
        let title = document.querySelector(".ModalTitleInput")
            .value;
        if (title == "")
            title = "undefined";
        let content = document.querySelector(".ModalContentInput").value;
        if (content == "")
            content = "undefined";
        if (target && title && content)
            return {
                target,
                title,
                content,
            };
        else {
            throw new Error("Error");
        }
    }
}
MakeModal.window = document.getElementById("modal");
class MakeNodeContent {
    constructor(target, ElementTag) {
        this.target = target;
        this.ElementTag = ElementTag;
    }
    checkValue() {
        switch (this.target.target) {
            case "IMAGE":
                return `<img src="${this.target.content}" width="100%" height="100%" />`;
            case "VIDEO":
                let Video = this.target.content;
                if (Video.includes("https://www.youtube.com/watch?v=")) {
                    Video = Video.replace("https://www.youtube.com/watch?v=", "https://www.youtube.com/embed/");
                    return `<embed class="ytplayer" type="text/html" width="100%" height="100%"
          src="${Video}" frameborder="0"></embed>`;
                }
                else if (Video.includes("https://youtu.be/")) {
                    Video = Video.replace("https://youtu.be/", "https://www.youtube.com/embed/");
                    return `<embed class="ytplayer" type="text/html" width="100%" height="100%"
          src="${Video}" frameborder="0"></embed>`;
                }
            case "NOTE":
                return this.target.content;
                break;
            case "TASK":
                let value = this.target.content.split("\n");
                let newValue = "";
                value.forEach((E) => {
                    newValue += `<li>${E}</li>`;
                });
                return newValue;
                break;
            default:
                console.log("no case");
                break;
        }
        return "undefined";
    }
    createElement() {
        var _a, _b;
        if (this.target.target == "TASK") {
            let contentBox = document.createElement("section");
            let contentBoxLeft = document.createElement("div");
            let contentBoxRight = document.createElement("ol");
            contentBox.className = "ContentBox";
            contentBoxLeft.className = "ContentLeft";
            contentBoxRight.className = "ContentRight";
            contentBox.setAttribute("draggable", "true");
            contentBoxRight.innerHTML = this.checkValue();
            contentBoxLeft.innerText = this.target.title;
            (_a = document.querySelector("#ContentList")) === null || _a === void 0 ? void 0 : _a.appendChild(contentBox);
            contentBox.appendChild(contentBoxLeft);
            contentBox.appendChild(contentBoxRight);
            return;
        }
        let contentBox = document.createElement("section");
        let contentBoxLeft = document.createElement("div");
        let contentBoxRight = document.createElement("div");
        contentBox.className = "ContentBox";
        contentBoxLeft.className = "ContentLeft";
        contentBoxRight.className = "ContentRight";
        contentBox.setAttribute("draggable", "true");
        contentBoxRight.innerHTML = this.checkValue();
        contentBoxLeft.innerText = this.target.title;
        (_b = document.querySelector("#ContentList")) === null || _b === void 0 ? void 0 : _b.appendChild(contentBox);
        contentBox.appendChild(contentBoxLeft);
        contentBox.appendChild(contentBoxRight);
    }
}
let MakeModalForContent = new MakeModal();
let AddContentArea = document.querySelectorAll("#ContentAddAerea li");
for (const I of AddContentArea) {
    I.addEventListener("click", (e) => {
        MakeModalForContent.MakeModal(I);
    });
}
let commitBtn = document.querySelector(".ModalSumbitBtn");
commitBtn === null || commitBtn === void 0 ? void 0 : commitBtn.addEventListener("click", (e) => {
    let MakeForContent = new MakeNodeContent(MakeModalForContent.ModalValue());
    MakeForContent.createElement();
    MakeForContent.checkValue();
    MakeModalForContent.RemoveModal();
});
let closeBtn = document.querySelector(".ModalClose");
closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener("click", () => {
    MakeModalForContent.RemoveModal();
});
// drag and drop
let dragged;
document.addEventListener("dragstart", function (event) {
    // 드래그한 요소에 대한 참조 변수
    dragged = event.target;
    // 요소를 반투명하게 함
    event.target.style.opacity = "0.5";
}, false);
document.addEventListener("dragend", function (event) {
    // 투명도를 리셋
    event.target.style.opacity = "";
}, false);
/* 드롭 대상에서 이벤트 발생 */
document.addEventListener("dragover", function (event) {
    // 드롭을 허용하도록 prevetDefault() 호출
    if (event.target.parentNode.className ==
        "ContentBox") {
        event.preventDefault();
    }
}, false);
document.addEventListener("dragenter", function (event) {
    // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
    if (event.target.parentNode.className ==
        "ContentBox") {
        event.target.style.color = "black";
    }
}, false);
document.addEventListener("dragleave", function (event) {
    // 요소를 드래그하여 드롭하려던 대상으로부터 벗어났을 때 배경색 리셋
    if (event.target.parentNode.className ==
        "ContentBox") {
        event.target.style.color = "black";
    }
}, false);
document.addEventListener("drop", function (event) {
    // 기본 액션을 막음 (링크 열기같은 것들)
    event.preventDefault();
    // 드래그한 요소를 드롭 대상으로 이동
    if (event.target.parentNode.className ==
        "ContentBox") {
        event.target.style.background = "";
        let evtTarget = event.target.parentNode;
        let dragTarget = dragged;
        let contentList = document.querySelector("#ContentList");
        let contentBoxs = document.querySelectorAll(".ContentBox");
        let reuslt = Array.from(contentBoxs).findIndex((e) => e == dragTarget);
        let reuslt2 = Array.from(contentBoxs).findIndex((e) => e == evtTarget);
        if (reuslt < reuslt2) {
            contentList === null || contentList === void 0 ? void 0 : contentList.insertBefore(evtTarget, dragTarget);
        }
        else {
            contentList === null || contentList === void 0 ? void 0 : contentList.insertBefore(dragTarget, evtTarget);
        }
    }
}, true);
let list = document.querySelector("#ContentList");
list === null || list === void 0 ? void 0 : list.addEventListener("click", (e) => {
    var _a;
    try {
        let target = (_a = e.target.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (target)
            list === null || list === void 0 ? void 0 : list.removeChild(target);
    }
    catch (error) {
        return;
    }
});
