import {
  Result,
  loadSearchActions,
  loadSearchAnalyticsActions,
  loadQueryActions,
} from "@coveo/atomic/headless";
import { Component, h, Element, State, Prop } from "@stencil/core";
import { resultContext } from "@coveo/atomic";
import { Bindings, initializeBindings } from "@coveo/atomic";
/**
 * Code search preview result component
 *
 * Shows an icon to display a modal form (code-search-preview-modal, will be initialized automatically)
 *
 */
@Component({
  tag: "find-usage-result-component",
  styleUrl: "find-usage-component.css",
  shadow: true,
})
export class FindUsageResultComponent {
  // The Headless result object to be resolved from the parent atomic-result component.
  public bindings!: Bindings;
  public controller: any;
  @State() private result?: Result;
  @Element() private host!: Element;
  @Prop() public field?: string;
  @Prop() public tooltip?: string;
  @Prop() public icon?: string;

  public async connectedCallback() {
    try {
      this.result = await resultContext(this.host);
      if (this.bindings == undefined) {
        this.bindings = await initializeBindings(this.host);
      }
    } catch (error) {
      console.error(error);
      this.host.remove();
    }
  }

  private async executeNewSearch(query: string) {
    if (this.bindings != undefined) {
      const searchActions = loadSearchActions(this.bindings.engine);
      const queryActions = loadQueryActions(this.bindings.engine);
      const analyticsActions = loadSearchAnalyticsActions(this.bindings.engine);
      const queryString = { q: query };
      await this.bindings.engine.dispatch(
        queryActions.updateQuery(queryString)
      );
      let action = searchActions.executeSearch(
        analyticsActions.logInterfaceLoad()
      );
      await this.bindings.engine.dispatch(action);
    }
  }

  private findUsage() {
    let searchString = "";
    //Strip prefix and suffix
    if (this.field) {
      if (this.field == "title") {
        searchString = this.result?.title || "";
      } else {
        if (this.result?.raw[this.field]) {
          searchString = Array.isArray(this.result.raw[this.field])
            ? (this.result.raw[this.field] as Array<string>).join(" OR ")
            : (this.result.raw[this.field] as string);
        }
      }
    }
    try {
      if (searchString.includes(".")) {
        searchString = searchString
          .split(".")
          .slice(0, -1)
          .join(".")
          .substring(searchString.lastIndexOf("/") + 1);
      }
    } catch (error) {
      //Do nothing
    }
    this.executeNewSearch(searchString);
  }

  public render() {
    // Do not render the component until the result object has been resolved.
    if (!this.result) {
      return;
    }
    let icon = (
      <img
        src={this.icon}
        title={this.tooltip}
        part="image"
        onClick={() => this.findUsage()}
      ></img>
    );
    return <div>{icon}</div>;
  }
}
