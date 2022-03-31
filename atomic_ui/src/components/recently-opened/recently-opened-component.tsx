import { Bindings, initializeBindings } from "@coveo/atomic";
import {
  buildRecentResultsList,
  RecentResultsList,
  RecentResultsState,
  Unsubscribe,
} from "@coveo/atomic/headless";

import { Component, Element, h, State } from "@stencil/core";

/**
 * Recently Opened Component
 *
 * This Component shows the recently opened documents
 *
 */
@Component({
  tag: "recently-opened-component",
  styleUrl: "recently-opened-component.css",
  shadow: true,
})
export class RecentlyOpenedComponent {
  private recentQueriesListController?: RecentResultsList;
  private bindings?: Bindings;

  private recentQueriesListUnsubscribe: Unsubscribe = () => {};
  constructor() {}
  @Element() private host!: Element;
  @State() private recentState!: RecentResultsState;

  componentDidLoad() {}

  public async connectedCallback() {
    try {
      // Wait for the Atomic bindings to be resolved.
      this.bindings = await initializeBindings(this.host);

      // Initialize controllers.

      this.recentQueriesListController = buildRecentResultsList(
        this.bindings.engine,
        {
          initialState: { results: this.retrieveLocalStorage() },
          options: { maxLength: 10 },
        }
      );

      // Subscribe to controller state changes.
      this.recentQueriesListUnsubscribe =
        this.recentQueriesListController.subscribe(() => this.updateState());
    } catch (error) {
      console.error(error);
    }
  }

  private updateState() {
    if (this.recentQueriesListController) {
      this.recentState = this.recentQueriesListController.state;
      this.updateLocalStorage();
    }
  }

  private retrieveLocalStorage() {
    let jsond = localStorage.getItem("RECENT");
    if (jsond) {
      return JSON.parse(jsond).slice(0, 10);
    } else return [];
  }

  private updateLocalStorage() {
    return localStorage.setItem(
      "RECENT",
      JSON.stringify(
        this.recentQueriesListController?.state.results.slice(0, 10)
      )
    );
  }

  public disconnectedCallback() {
    this.recentQueriesListUnsubscribe();
  }
  //

  public renderResults() {
    return this.recentState?.results?.map((result) => (
      <li>
        <dev-icons-result-component
          class="small"
          currentResult={result}
        ></dev-icons-result-component>{" "}
        <a class="recentListItem" target="_blank" href={result.clickUri}>
          {result.title}
        </a>
      </li>
    ));
  }
  public render() {
    if (this.recentState?.results?.length == 0) {
      return <span></span>;
    } else
      return (
        <div>
          <span class="title">Recently Viewed</span>
          <ul class="recentList">{this.renderResults()}</ul>
        </div>
      );
  }
}
