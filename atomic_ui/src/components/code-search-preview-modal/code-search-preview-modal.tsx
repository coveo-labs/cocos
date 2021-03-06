import {
  Component,
  h,
  Method,
  State,
  Prop,
  Element,
  Watch,
} from "@stencil/core";

import { Bindings } from "@coveo/atomic";

import hljs from "highlight.js";

export type ModalStatus = "closed" | "opened" | "beingClosed";

/**
 * The `atomic-refine-modal` is automatically created as a child of the `atomic-search-interface` when the `atomic-refine-toggle` is initialized.
 *
 * When the modal is opened, the class `atomic-modal-open` is added to the body, allowing further customization.
 *
 * @part container - The container of the modal's content.
 * @part header - The header of the modal, containing the title.
 * @part close-button - The button in the header that closes the modal.
 * @part section-title - The title for each section.
 * @part select - The `<select>` element of the drop-down list.
 * @part filter-clear-all - The button that resets all actively selected facet values.
 * @part footer-button - The button in the footer that closes the modal.
 */
@Component({
  tag: "code-search-preview-modal",
  styleUrl: "code-search-preview-modal.css",
  shadow: false,
})
export class CodeSearchPreviewModal {
  private closeButton?: HTMLElement;
  public bindings!: Bindings;
  @State() html!: string;
  @State() title!: string;
  @State() top!: number;
  @Element() public host!: HTMLElement;

  constructor() {}

  @Prop({ mutable: true }) openButton?: HTMLElement;

  @Prop({ reflect: true, mutable: true }) modalStatus!: ModalStatus;
  @Watch("modalStatus")
  watchEnabled(modalStatus: ModalStatus) {
    const modalOpenedClass = "atomic-modal-opened";

    switch (modalStatus) {
      case "opened":
        document.body.classList.add(modalOpenedClass);
        this.host.classList.add(modalOpenedClass);
        //Causes visibility issues
        this.host.classList.remove("hydrated");
        this.focusOnCloseButton();
        break;
      case "closed":
        this.host.classList.remove(modalOpenedClass);
        document.body.classList.remove(modalOpenedClass);
        this.host.classList.remove("hydrated");
        this.focusOnOpenButton();
        break;
    }
  }
  private focusOnCloseButton() {
    this.closeButton?.focus();
  }

  private focusOnOpenButton() {
    this.openButton?.focus();
  }

  private clean(code: string) {
    let areaElement = document.createElement("textarea");
    areaElement.innerHTML = code;

    code = areaElement.value;
    areaElement.remove();
    return code;
  }
  @Method() public async open(code: string, filename: string, top: number) {
    this.modalStatus = "opened";
    //The code contains HTML (no /text is available)
    //We need to get the contents between <body></body>

    let highlightCodeRegex =
      /<body>[\w\W]*<div>[\w\W]*<pre>([\w\W]*)<\/pre>[\w\W]*<\/div>[\w\W]*<\/body>/gm;
    let m = highlightCodeRegex.exec(code);
    if (m != null) {
      code = m[1];
      //decode
      try {
        //First remove Word Tags
        let wordTagRegex = /(<CoveoTaggedWord id='[\W\w]+'>)/gm;
        code = code.replace(wordTagRegex, "");
        //Remove any highlights which might be in there
        let highlightRegex =
          /(<span id='CoveoHighlight[\W\w]*?>)(.*?)(<\/span>)/gm;
        //Remove it and create a fake prefix, so we can highlight it later again
        code = code.replace(highlightRegex, "XOXB$2XOXE");
        code = this.clean(code);
      } catch (error) {
        console.log(error);
      }
      code = code.replace(/&lt;/gm, "<");
      code = code.replace(/&gt;/gm, ">");
    }
    let htmlvalue = hljs.highlightAuto(code).value;

    htmlvalue = htmlvalue.replace(/XOXB/gm, '<span class="highlight">');
    htmlvalue = htmlvalue.replace(/XOXE/gm, "</span>");

    this.html = htmlvalue;
    this.title = filename;
    this.top = top;
  }

  private renderHeader() {
    return (
      <div
        part="header"
        class="header w-full flex justify-between text-xl centered py-6"
      >
        <span class="title">{this.title}</span>
        <img
          src="close.svg"
          class="btn-text-transparent grid place-items-center img"
          part="close-button"
          onClick={() => this.dismiss()}
          ref={(closeButton) => (this.closeButton = closeButton)}
        ></img>
      </div>
    );
  }

  private renderCode() {
    return <div class="mycode" innerHTML={this.html}></div>;
  }
  private dismiss() {
    setTimeout(() => {
      this.modalStatus = "closed";
    }, 500);
    this.modalStatus = "beingClosed";
  }

  /*
            class={`modal-content container w-screen  fixed flex flex-col  bg-background text-on-background left-0 top-0 z-10  ${
          class={`coveo-modal-content w-screen  fixed flex flex-col  bg-background text-on-background left-0 top-0 z-10  ${
          class={`container2 w-screen h-screen fixed flex flex-col justify-between bg-background text-on-background left-0 top-0 z-10   ${
        <div class={`background ${isOpened ? 'atomic-modal-opened':''}`} onClick={() => this.dismiss()} >
overflow-auto px-6 grow">
          style={setTop}
            */
  public render() {
    if (this.modalStatus === "closed") {
      return;
    }

    const isOpened = this.modalStatus === "opened";
    const setTop = { top: Math.round(this.top + 50) + "px" };
    return (
      <atomic-focus-trap active={isOpened}>
        <div
          class={`background ${isOpened ? "atomic-modal-opened" : ""}`}
          onClick={() => this.dismiss()}
        >
          <div
            part="container"
            style={setTop}
            onClick={(e) => {
              e.stopPropagation();
            }}
            class={`container2   ${
              isOpened
                ? "animate-scaleUpRefineModal"
                : "animate-slideDownRefineModal"
            }`}
            aria-modal={isOpened.toString()}
          >
            <div class="px-6">{this.renderHeader()}</div>

            <div class="contents">
              <div class="adjust-for-scroll-bar2">
                <aside class="centered2">{this.renderCode()}</aside>
              </div>
            </div>
          </div>
        </div>
      </atomic-focus-trap>
    );
  }
}
