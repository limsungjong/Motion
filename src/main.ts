// // 1.popup 작성, popup에서 받은 데이터로 element 만들기
// // 2. create element(li click) -> popup 데이터 받아서 처리
// // 3. drag drop 작성, 어디에 놓을건지?

type liContenName =
  | ".ContentImage"
  | ".ContentVideo"
  | ".ContentNote"
  | ".ContentTask";

type InputContentValue = {
  target: string;
  title: string;
  content: string;
};

interface NewModal {
  MakeModal(E: Element): void; // 창 만들기
  RemoveModal(): void; // 창 닫기
  ModalValue(): InputContentValue; // 창에서 만든 값 받기
}
interface NewNode {
  createElement(): void;
}

class MakeModal implements NewModal {
  private static window = document.getElementById("modal");
  constructor() {}

  MakeModal(E: Element) {
    let text = document.querySelector(".ModalTopBarLeft");
    let label = document.querySelector('label[for=".ModalContentInput"]');
    let title = E.textContent;
    if (title == "IMAGE" || title == "VIDEO") {
      title = "URL";
    } else {
      title = "Content";
    }
    if (MakeModal.window && text) {
      (label as Element).textContent = title;
      MakeModal.window.style.display = "flex";
      text.textContent = E.textContent;
    }
    return window;
  }

  RemoveModal(): void {
    let title = document.querySelector(".ModalTitleInput") as HTMLInputElement;
    let content = document.querySelector(
      ".ModalContentInput"
    ) as HTMLInputElement;
    if (title && content && MakeModal.window) {
      MakeModal.window.style.display = "none";
      title.value = "";
      content.value = "";
    }
  }

  ModalValue(): InputContentValue {
    let target = document.querySelector(".ModalTopBarLeft")?.textContent;
    let title = (document.querySelector(".ModalTitleInput") as HTMLInputElement)
      .value;
    if (title == "") title = "undefined";
    let content = (
      document.querySelector(".ModalContentInput") as HTMLInputElement
    ).value;
    if (content == "") content = "undefined";
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

class MakeNodeContent implements NewNode {
  constructor(private target: InputContentValue, public ElementTag?: string) {}
  checkValue(): string {
    switch (this.target.target) {
      case "IMAGE":
        return `<img src="${this.target.content}" width="100%" height="100%" />`;

      case "VIDEO":
        let Video = this.target.content;
        if (Video.includes("https://www.youtube.com/watch?v=")) {
          Video = Video.replace(
            "https://www.youtube.com/watch?v=",
            "https://www.youtube.com/embed/"
          );
          return `<embed class="ytplayer" type="text/html" width="100%" height="100%"
          src="${Video}" frameborder="0"></embed>`;
        } else if (Video.includes("https://youtu.be/")) {
          Video = Video.replace(
            "https://youtu.be/",
            "https://www.youtube.com/embed/"
          );
          return `<embed class="ytplayer" type="text/html" width="100%" height="100%"
          src="${Video}" frameborder="0"></embed>`;
        }

      case "NOTE":
        return this.target.content;
        break;
      case "TASK":
        let value = this.target.content.split("\n");
        let newValue: string = "";
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

      document.querySelector("#ContentList")?.appendChild(contentBox);
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

    document.querySelector("#ContentList")?.appendChild(contentBox);
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
commitBtn?.addEventListener("click", (e) => {
  let MakeForContent = new MakeNodeContent(MakeModalForContent.ModalValue());
  MakeForContent.createElement();
  MakeForContent.checkValue();
  MakeModalForContent.RemoveModal();
});

let closeBtn = document.querySelector(".ModalClose");
closeBtn?.addEventListener("click", () => {
  MakeModalForContent.RemoveModal();
});

// drag and drop

let dragged: EventTarget | null;

document.addEventListener(
  "dragstart",
  function (event) {
    // 드래그한 요소에 대한 참조 변수
    dragged = event.target;

    // 요소를 반투명하게 함
    (event.target as HTMLElement).style.opacity = "0.5";
  },
  false
);

document.addEventListener(
  "dragend",
  function (event) {
    // 투명도를 리셋
    (event.target as HTMLElement).style.opacity = "";
  },
  false
);

/* 드롭 대상에서 이벤트 발생 */
document.addEventListener(
  "dragover",
  function (event) {
    // 드롭을 허용하도록 prevetDefault() 호출
    if (
      ((event.target as Node).parentNode as HTMLElement).className ==
      "ContentBox"
    ) {
      event.preventDefault();
    }
  },
  false
);

document.addEventListener(
  "dragenter",
  function (event) {
    // 요소를 드롭하려는 대상 위로 드래그했을 때 대상의 배경색 변경
    if (
      ((event.target as Node).parentNode as HTMLElement).className ==
      "ContentBox"
    ) {
      (event.target as HTMLElement).style.color = "black";
    }
  },
  false
);

document.addEventListener(
  "dragleave",
  function (event) {
    // 요소를 드래그하여 드롭하려던 대상으로부터 벗어났을 때 배경색 리셋
    if (
      ((event.target as Node).parentNode as HTMLElement).className ==
      "ContentBox"
    ) {
      (event.target as HTMLElement).style.color = "black";
    }
  },
  false
);

document.addEventListener(
  "drop",
  function (event) {
    // 기본 액션을 막음 (링크 열기같은 것들)
    event.preventDefault();

    // 드래그한 요소를 드롭 대상으로 이동
    if (
      ((event.target as Node).parentNode as HTMLElement).className ==
      "ContentBox"
    ) {
      (event.target as HTMLElement).style.background = "";
      let evtTarget = (event.target as Node).parentNode as Element;
      let dragTarget = dragged as Element;
      let contentList = document.querySelector("#ContentList");
      let contentBoxs = document.querySelectorAll(".ContentBox");
      let reuslt = Array.from(contentBoxs).findIndex((e) => e == dragTarget);
      let reuslt2 = Array.from(contentBoxs).findIndex((e) => e == evtTarget);
      if (reuslt < reuslt2) {
        contentList?.insertBefore(evtTarget, dragTarget);
      } else {
        contentList?.insertBefore(dragTarget, evtTarget);
      }
    }
  },
  true
);

let list = document.querySelector("#ContentList");
list?.addEventListener("click", (e) => {
  try {
    let target = (e.target as Node).parentElement?.parentElement;
    if (target) list?.removeChild(target);
  } catch (error) {
    return;
  }
});
