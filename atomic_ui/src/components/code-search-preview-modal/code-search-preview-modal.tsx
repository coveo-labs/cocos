import {Component, h,Method, State, Prop, Element, Watch} from '@stencil/core';

import {
  Bindings
} from '@coveo/atomic';

import hljs from 'highlight.js';

export type ModalStatus = 'closed' | 'opened' | 'beingClosed';

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
  tag: 'code-search-preview-modal',
  styleUrl: 'code-search-preview-modal.css',
  shadow: false,
})


export class CodeSearchPreviewModal  {
  private closeButton?: HTMLElement;
  public bindings!: Bindings;
  //@ts-ignore
  @State() html!: string;
  //@ts-ignore
  @State() title!: string;
  //@ts-ignore
  @State() top!: number;
  @Element() public host!: HTMLElement;

  constructor(){
    //this.html = '';
  }

  @Prop({mutable: true}) openButton?: HTMLElement;

  @Prop({reflect: true, mutable: true}) modalStatus!: ModalStatus;
  @Watch('modalStatus')
  watchEnabled(modalStatus: ModalStatus) {
    const modalOpenedClass = 'atomic-modal-opened';

    switch (modalStatus) {
      case 'opened':
        document.body.classList.add(modalOpenedClass);
        this.host.classList.add(modalOpenedClass);
        this.focusOnCloseButton();
        break;
      case 'closed':
        this.host.classList.remove(modalOpenedClass);
        document.body.classList.remove(modalOpenedClass);
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

  /*@Method() public initialize() {
    this.modalStatus = 'closed';
  }*/

  private clean(code:string) {
      let areaElement = document.createElement("textarea");
      areaElement.innerHTML = code;
  
      code = areaElement.value;
      areaElement.remove();
      return code;
  }
  @Method() public async open(code:string, filename:string, top: number) {
    this.modalStatus = 'opened';
    //The code contains HTML (no /text is available)
    //We need to get the contents between <body></body>
    
    let highlightCodeRegex = /<body>[\w\W]*<div>[\w\W]*<pre>([\w\W]*)<\/pre>[\w\W]*<\/div>[\w\W]*<\/body>/gm;
    let m = highlightCodeRegex.exec(code);
    if (m!=null) {
      code = m[1];
      //decode
      try {
        //First remove Word Tags
        let wordTagRegex=/(<CoveoTaggedWord id='[\W\w]+'>)/gm;
        code = code.replace(wordTagRegex,'');
        //Remove any highlights which might be in there
        let highlightRegex =/(<span id='CoveoHighlight[\W\w]*?>)(.*?)(<\/span>)/gm;
        //Remove it and create a fake prefix, so we can highlight it later again
        code = code.replace(highlightRegex,'XOXB$2XOXE');
        code = this.clean(code);
      } 
      catch(error)
      {
           console.log(error);
      }
      code = code.replace(/&lt;/gm,'<');
      code = code.replace(/&gt;/gm,'>');
    }
    let htmlvalue = hljs.highlightAuto(code).value;
    
    htmlvalue = htmlvalue.replace(/XOXB/gm,'<span class="highlight">');
    htmlvalue = htmlvalue.replace(/XOXE/gm,'</span>');

    this.html = htmlvalue;
    this.title = filename;
    this.top = top;

  }


  /*private getIcon() {
    return (<svg viewBox="0 0 22 22"><g transform="matrix(.7071 -.7071 .7071 .7071 -3.142 11)"><path d="m9-3.4h2v26.9h-2z"/><path d="m-3.4 9h26.9v2h-26.9z"/></g></svg>);
  }*/

  private renderHeader() {
    return (
      <div
        part="header"
        class="header w-full flex justify-between text-xl centered py-6"
      >
      <span class="title">{this.title}</span>
         <img src='close.svg'
          class="btn-text-transparent grid place-items-center img"
          part="close-button"
          onClick={() => this.dismiss()}
          ref={(closeButton) => (this.closeButton = closeButton)}
        >
        </img>
      </div>
    );
    //return (<div></div>);
  }


  private renderFooter() {
    return (<div></div>);
    // return (
    //   <div class="px-6 py-4 w-full border-neutral border-t bg-background z-10 shadow-lg">
    //     <Button
    //       style="primary"
    //       part="footer-button"
    //       class="centered p-3 flex text-lg justify-center"
    //       onClick={() => this.dismiss()}
    //     >
          
    //     </Button>
    //   </div>
    // );
  }

  private renderCode(){
    return (<div class="mycode"  innerHTML={this.html}></div>);
  }
  private dismiss() {
    setTimeout(() => {
      this.modalStatus = 'closed';
    }, 500);
    this.modalStatus = 'beingClosed';
  }

  /*
            class={`modal-content container w-screen  fixed flex flex-col  bg-background text-on-background left-0 top-0 z-10  ${
          class={`coveo-modal-content w-screen  fixed flex flex-col  bg-background text-on-background left-0 top-0 z-10  ${
*/
  public render() {
    if (this.modalStatus === 'closed') {
      return;
    }

    const isOpened = this.modalStatus === 'opened';
    const setTop = {'top':Math.round(this.top+100)+'px'};
    return (
      <atomic-focus-trap active={isOpened}>
        <div class={`background ${isOpened ? 'atomic-modal-opened':''}`} onClick={() => this.dismiss()} >
        <div
          part="container"
          style={setTop}
          onClick={(e)=>{e.stopPropagation();}}
          class={`container w-screen h-screen fixed flex flex-col justify-between bg-background text-on-background left-0 top-0 z-10   ${
            isOpened
              ? 'animate-scaleUpRefineModal'
              : 'animate-slideDownRefineModal'
          }`}
          aria-modal={isOpened.toString()}
        >
          <div class="px-6">{this.renderHeader()}</div>
          
          <div class="overflow-auto px-6 grow">
            <div class="adjust-for-scroll-bar">
              <aside class="centered">
              {this.renderCode()}
              </aside>
            </div>
          </div>
          {this.renderFooter()}
        </div>
        </div>
      </atomic-focus-trap>
    );
  }
}