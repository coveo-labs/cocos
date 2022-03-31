import { Component, h } from "@stencil/core";
import defaultTemplate from "./default.html";

/**
 * Component used to manage results & result templates.
 * See https://docs.coveo.com/en/atomic/latest/usage/create-a-result-list/
 */
@Component({
  tag: "results-manager",
  shadow: false,
})
export class ResultsManager {
  public render() {
    return (
      <atomic-result-list fields-to-include="code_origin,code_org,code_repo,code_branch,code_extension">
        <atomic-result-template>
          <template innerHTML={defaultTemplate}></template>
        </atomic-result-template>
      </atomic-result-list>
    );
  }
}
