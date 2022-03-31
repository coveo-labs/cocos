import { Bindings, initializeBindings } from "@coveo/atomic";
import {
  loadSearchActions,
  loadSearchAnalyticsActions,
} from "@coveo/atomic/headless";

import { Component, Prop, Method, Element, h, State } from "@stencil/core";

enum CodeSearchMode {
  Code,
  Native,
}

/**
 * Code Search Component
 *
 * This Component enables a 'Code Search/Native Search' Switch
 * Code Search: use a regex on a field (default)
 * Native Search: normal search
 *
 */
@Component({
  tag: "code-search-component",
  styleUrl: "code-search-component.css",
  shadow: false,
})
export class CodeSearchComponent {
  private bindings?: Bindings;
  private checkbox!: HTMLInputElement;
  private checkboxDQ!: HTMLInputElement;
  private checkboxDebug!: HTMLInputElement;
  private currentSearchString: string;

  constructor() {
    this.mode = CodeSearchMode.Code;
    this.currentSearchString = "";
  }
  @Element() private host!: Element;
  @Prop() type: string = "round";
  @Prop() checkedColor: string = "#2196F3";
  @Prop() uncheckedColor: string = "#ccc";
  @Prop({ mutable: true }) checked: boolean = true;
  @Prop({ mutable: true }) checkedDQ: boolean = true;
  @Prop({ mutable: true }) checkedDebug: boolean = false;

  @State() private mode!: CodeSearchMode;

  private replaceQuery(query: String) {
    let newquery = "";
    var re = new RegExp("[A-Za-z0-9.(), ]+");
    for (var i = 0; i < query.length; i++) {
      let char = query.charAt(i);
      if (re.test(char)) {
        //Valid Char
        newquery += char;
      } else {
        //Not valid char
        newquery += "X" + char.charCodeAt(0) + "X";
      }
    }
    newquery = newquery.replace(/[\(\)]+/gm, " ");
    return newquery;
  }

  private removeSpecial(text: string) {
    var re = new RegExp(/(X(\d+)X)/gm);
    let newtext = text;
    const matches = text.matchAll(re);
    for (const m of matches) {
      let charcode = parseInt(m[2]);
      newtext = newtext.replace(m[1], String.fromCharCode(charcode));
    }
    re = new RegExp(/(&#x(\d*))/gm);
    const matcheshex = text.matchAll(re);
    for (const m of matcheshex) {
      let charcode = parseInt(m[2], 16);
      newtext = newtext.replace(m[1], String.fromCharCode(charcode));
    }
    return unescape(newtext);
  }

  private clean(string: string) {
    return string.replace(/'/gm, '"');
  }

  private escape(string: string) {
    return this.clean(string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
  }

  private getHighlights(str: string, words: string[]) {
    let newwords: string[] = [];
    words.map((word: string) => {
      if (word !== "") {
        newwords.push(this.escape(word));
      }
    });
    let regex = RegExp(newwords.join("|"), "gi"); // case insensitive
    let high: any[] = [];
    let match = null;
    if (words.length === 1 && !words[0]) {
      return high;
    }

    while ((match = regex.exec(str))) {
      high.push({ offset: match.index, length: match[0].length });
    }
    return high;
  }

  @Method() public async fixResults(response: any) {
    if (this.mode == CodeSearchMode.Code) {
      let query = this.currentSearchString.split(" ");
      response.body.results.forEach((result: any) => {
        //Modify the excerpt
        let test = this.removeSpecial(result.excerpt);
        result.excerpt = test;
        //remove highlights because they contain the wrong position.
        result.excerptHighlights = this.getHighlights(test, query);
        return result;
      });
      return response;
    } else return response;
  }

  public buildAQ(body: any) {
    let aq = "";
    body.facets.map((facet: any) => {
      let field = facet.field;
      let values: string[] = [];
      facet.currentValues.map((value: any) => {
        if (value.state == "selected") {
          values.push('"' + value.value + '"');
        }
      });

      if (values.length > 0) {
        aq += " @" + field + "=(" + values.join(",") + ")";
      }
    });
    return aq;
  }

  public cleanQuery(query: string) {
    query = query.replace(/[^A-Za-z0-9. ]+/gm, " ");
    return query;
  }

  @Method() public async fixQuery(request: any, clientOrigin: any) {
    if (clientOrigin === "searchApiFetch") {
      if (this.bindings == undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      if (
        this.mode == CodeSearchMode.Code &&
        request.url.indexOf("/html?") == -1
      ) {
        //Rewrite the query
        const body = JSON.parse(request.body);
        // E.g., modify facet requests
        // body.facets = [...];
        this.currentSearchString = body.q;
        body.q = this.replaceQuery(body.q);
        if (this.checkedDebug) body.debug = true;
        if (this.checkedDQ) {
          body.dq =
            this.cleanQuery(this.currentSearchString) + this.buildAQ(body);
        }
        request.body = JSON.stringify(body);
      } else {
        //Do nothing
      }
    }
    return request;
  }
  private async enableCodeSearch() {
    this.mode = CodeSearchMode.Code;
    this.executeSearch();
  }

  private async executeSearch() {
    if (this.bindings != undefined) {
      const searchActions = loadSearchActions(this.bindings.engine);
      const analyticsActions = loadSearchAnalyticsActions(this.bindings.engine);
      let action = searchActions.executeSearch(
        analyticsActions.logInterfaceLoad()
      );
      await this.bindings.engine.dispatch(action);
    }
  }
  private enableNativeSearch() {
    this.mode = CodeSearchMode.Native;
    this.executeSearch();
  }

  private toggleSwitch() {
    this.checked = this.checkbox.checked;
    if (this.checked) {
      this.enableCodeSearch();
    } else {
      //Disable DQ, does not makes sense to do it
      this.checkboxDQ.checked = false;
      this.checkedDQ = this.checkboxDQ.checked;
      this.enableNativeSearch();
    }
  }

  private toggleSwitchDQ() {
    this.checkedDQ = this.checkboxDQ.checked;
    if (this.checkedDQ) {
      this.checked = this.checkbox.checked;
      this.checkbox.checked = true;
      this.enableCodeSearch();
    } else {
      this.executeSearch();
    }
  }

  private toggleSwitchDebug() {
    this.checkedDebug = this.checkboxDebug.checked;
    this.executeSearch();
  }

  private renderLabel() {
    let text = "";
    if (this.mode == CodeSearchMode.Code) {
      text = "Code Search";
    } else {
      text = "Native Search";
    }

    return (
      <label class="m-2 font-bold text-sm cursor-pointer" part="label">
        {text}
      </label>
    );
  }

  private renderLabelDQ() {
    let text = "";
    if (this.checkedDQ) {
      text = "Add DQ";
    } else {
      text = "Not using DQ";
    }

    return (
      <label class="m-2 font-bold text-sm cursor-pointer" part="label">
        {text}
      </label>
    );
  }

  private renderLabelDebug() {
    let text = "";
    if (this.checkedDebug) {
      text = "Debug enabled";
    } else {
      text = "Debug disabled";
    }

    return (
      <label class="m-2 font-bold text-sm cursor-pointer" part="label">
        {text}
      </label>
    );
  }

  public render() {
    return (
      <div class="codeSearch  items-center flex-wrap text-on-background">
        <div>
          <input
            type="checkbox"
            class="first"
            title="Code search will replace special characters"
            onClick={this.toggleSwitch.bind(this)}
            ref={(el) => (this.checkbox = el as HTMLInputElement)}
            checked={this.checked}
          />
          {this.renderLabel()}
        </div>
        <div>
          <input
            type="checkbox"
            class="first"
            title="Add the current query also as DQ to the query"
            onClick={this.toggleSwitchDQ.bind(this)}
            ref={(el) => (this.checkboxDQ = el as HTMLInputElement)}
            checked={this.checkedDQ}
          />
          {this.renderLabelDQ()}
        </div>
        <div>
          <input
            type="checkbox"
            title="Debug Query"
            onClick={this.toggleSwitchDebug.bind(this)}
            ref={(el) => (this.checkboxDebug = el as HTMLInputElement)}
            checked={this.checkedDebug}
          />
          {this.renderLabelDebug()}
        </div>
      </div>
    );
  }
}
