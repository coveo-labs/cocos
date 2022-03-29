import {Result, buildQuickview, QuickviewState, Unsubscribe, loadRecentResultsActions  } from '@coveo/atomic/headless';
import {Component, h, Element, State} from '@stencil/core';
import {resultContext, } from '@coveo/atomic';
import {Bindings, initializeBindings} from '@coveo/atomic';
//import { QuickviewState } from '@coveo/headless/dist/definitions/controllers/quickview/headless-quickview';
/**
 * Code search preview result component
 *
 * Shows an icon to display a modal form (code-search-preview-modal, will be initialized automatically)
 *
 */
@Component({
  tag: 'code-search-preview-result-component',
  styleUrl: 'code-search-preview.css',
  shadow: true,
})



export class CodeSearchPreviewResultComponent {
  // The Headless result object to be resolved from the parent atomic-result component.
  public bindings!: Bindings;
  //public controller = buildQuickview(this.engine!, {options: {this.result}});
  public controller: any;
  @State() private result?: Result;
  @State() private loading?: Boolean;
  @Element() private host!: Element;
  private modalRef?: HTMLCodeSearchPreviewModalElement;
  private qvUnsubscribe: Unsubscribe = () => {};
  @State() private qvState!: QuickviewState;

  // We recommended fetching the result context using the `connectedCallback` lifecycle method
  // with async/await. Using `componentWillLoad` will hang the parent `atomic-search-interface` initialization.
  public async connectedCallback() {
    try {
      this.result = await resultContext(this.host);
      if (this.bindings==undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      this.controller = buildQuickview(this.bindings.engine!, {options: {result: this.result}})
      this.qvUnsubscribe = this.controller.subscribe(
        () => {
          this.qvState = this.controller.state;
          if (this.qvState.isLoading==false && this.qvState.content!='') {
            this.loading = false;
            //@ts-ignore
            this.modalRef && (this.modalRef.open(this.qvState.content, this.result.Title, this.host.offsetParent.scrollTop));
          }
        }
      );
      } catch (error) {
      console.error(error);
      this.host.remove();
    }
  }

  public async initialize() {
    if (document.getElementsByTagName('code-search-preview-modal').length==0) {
      this.modalRef = document.createElement('code-search-preview-modal');
      this.modalRef.id='codesearchpreviewmodal';
      this.loading=false;
      if (this.bindings==undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      //@ts-ignore
      this.bindings.interfaceElement.prepend(this.modalRef);
    } else {
      //@ts-ignore
      const modal: HTMLCodeSearchPreviewModalElement = document.querySelector('#codesearchpreviewmodal');
      this.modalRef = modal;
    }
    /*const modalRef: HTMLCodeSearchPreviewModalElement =
    document.querySelector('#codesearchpreview')!;*/
    //return modalRef;
  }

  public disconnectedCallback() {
    this.qvUnsubscribe();
  }

  private async enableModal() {
    await this.initialize();
    this.loading = true;
    //@ts-ignore
    let recent = loadRecentResultsActions(this.bindings.engine);
    //@ts-ignore
    await this.bindings.engine.dispatch(recent.pushRecentResult(this.result));
    this.controller.fetchResultContent();
  }

  public render() {
    // Do not render the component until the result object has been resolved.
    if (!this.result) {
      return;
    }
    let icon = <img src='source.svg' title='Click to open Code' part='image' onClick={() => this.enableModal()}></img>
    if (!this.result.hasHtmlVersion) {
      icon = <img src='nosource.svg' title='No code available'></img>
    }
    let loader='';
    if (this.loading) {
      loader = <div class="loader"></div>;
    }
    return (
      <div>
      {icon}
      {loader}
      </div>
    );
    
  }
}
