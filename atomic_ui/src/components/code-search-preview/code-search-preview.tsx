import {
  Result,
  buildQuickview,
  QuickviewState,
  Unsubscribe,
  loadRecentResultsActions,
} from "@coveo/atomic/headless";
import { Component, h, Element, State } from "@stencil/core";
import { resultContext } from "@coveo/atomic";
import { Bindings, initializeBindings } from "@coveo/atomic";
/**
 * Code search preview result component
 *
 * Shows an icon to display a modal form (code-search-preview-modal, will be initialized automatically)
 *
 */
@Component({
  tag: "code-search-preview-result-component",
  styleUrl: "code-search-preview.css",
  shadow: true,
})
export class CodeSearchPreviewResultComponent {
  public bindings!: Bindings;
  public controller: any;
  @State() private result?: Result;
  @State() private loading?: Boolean;
  @Element() private host!: Element;
  private modalRef?: HTMLCodeSearchPreviewModalElement;
  private qvUnsubscribe: Unsubscribe = () => {};
  @State() private qvState!: QuickviewState;

  public async connectedCallback() {
    try {
      this.result = await resultContext(this.host);
      if (this.bindings == undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      this.controller = buildQuickview(this.bindings.engine!, {
        options: { result: this.result },
      });
      this.qvUnsubscribe = this.controller.subscribe(() => {
        this.qvState = this.controller.state;
        if (this.qvState.isLoading == false && this.qvState.content != "") {
          this.loading = false;
          let title = this.result?.title || "";
          let top = (this.host as HTMLElement).offsetParent?.scrollTop || 0;
          this.modalRef && this.modalRef.open(this.qvState.content, title, top);
        }
      });
    } catch (error) {
      console.error(error);
      this.host.remove();
    }
  }

  public async initialize() {
    if (
      document.getElementsByTagName("code-search-preview-modal").length == 0
    ) {
      this.modalRef = document.createElement("code-search-preview-modal");
      this.modalRef.id = "codesearchpreviewmodal";
      this.loading = false;
      if (this.bindings == undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      this.bindings.interfaceElement.prepend(this.modalRef);
    } else {
      const modal: HTMLCodeSearchPreviewModalElement = document.querySelector(
        "#codesearchpreviewmodal"
      ) as HTMLCodeSearchPreviewModalElement;
      this.modalRef = modal;
    }
  }

  public disconnectedCallback() {
    this.qvUnsubscribe();
  }

  private async enableModal() {
    await this.initialize();
    this.loading = true;
    let recent = loadRecentResultsActions(this.bindings.engine);
    if (this.result) {
      await this.bindings.engine.dispatch(recent.pushRecentResult(this.result));
    }
    this.controller.fetchResultContent();
  }

  public render() {
    // Do not render the component until the result object has been resolved.
    if (!this.result) {
      return;
    }
    let icon = (
      <img
        src="source.svg"
        title="Click to open Code"
        part="image"
        onClick={() => this.enableModal()}
      ></img>
    );
    if (!this.result.hasHtmlVersion) {
      icon = <img src="nosource.svg" title="No code available"></img>;
    }
    let loader = "";
    if (this.loading) {
      loader = <div class="loader"></div>;
    }
    return (
      <div>
        <h1 class="text-3xl font-bold underline">Hello world!</h1>
        <div>
          {icon}
          {loader}
        </div>
      </div>
    );
  }
}
