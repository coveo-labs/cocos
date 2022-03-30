import {Bindings, initializeBindings} from '@coveo/atomic';
import {
  loadSearchActions,
  loadSearchAnalyticsActions
} from '@coveo/atomic/headless';

import {Component, Prop,  Method, Element, h, State} from '@stencil/core';

enum CodeSearchMode{
  Code,
  Native
};

/**
 * Code Search Component
 *
 * This Component enables a 'Code Search/Native Search' Switch
 * Code Search: use a regex on a field (default)
 * Native Search: normal search
 *
 */
@Component({
  tag: 'code-search-component',
  styleUrl: 'code-search-component.css',
  shadow: false,
})
export class CodeSearchComponent {
  private bindings?: Bindings;
  private checkbox!: HTMLInputElement;
  private checkboxDQ!: HTMLInputElement;
  private currentSearchString: String;

  constructor() {
    this.mode = CodeSearchMode.Code;
    this.currentSearchString = '';
  }
  @Element() private host!: Element;
  @Prop() type: string = "round";
  @Prop() checkedColor: string = "#2196F3";
  @Prop() uncheckedColor: string = "#ccc";
  @Prop({mutable: true}) checked: boolean = true;
  @Prop({mutable: true}) checkedDQ: boolean = true;
  
  @State() private mode!: CodeSearchMode;

  componentDidLoad() {
    //this.background.style.setProperty('background', this.checked ? this.checkedColor : this.uncheckedColor)
  }

  private replaceQuery(query:String) {
    let newquery='';
    var re = new RegExp('[A-Za-z0-9.\(\), ]+');
    for (var i = 0; i < query.length; i++) {
      let char=query.charAt(i);
      if (re.test(char)) {
        //Valid Char
        newquery+=char;
      } else {
        //Not valid char
        newquery+='X'+char.charCodeAt(0)+'X';
      }
    }
    newquery = newquery.replace(/[\(\)]+/gm,' ');
    return newquery;
  }

  private removeSpecial(text:String) {
    var re = new RegExp(/(X(\d+)X)/gm);
    let newtext=text;
    const matches = text.matchAll(re);
    for (const m of matches) {
      let charcode=parseInt(m[2]);
      newtext=newtext.replace(m[1],String.fromCharCode(charcode));
      //break;
    }
    re = new RegExp(/(&#x(\d*))/gm);
    const matcheshex = text.matchAll(re);
    for (const m of matcheshex) {
      let charcode=parseInt(m[2],16);
      newtext=newtext.replace(m[1],String.fromCharCode(charcode));
      //break;
    }
    //@ts-ignore
    return unescape(newtext);
  }

  private clean(string:any) {
    return string.replace(/'/gm,'"')
  }

  /*private cleanEx(code:string) {
    return (code+"").replace(/&#\d+;/gm,function(s) {
      //@ts-ignore
      return String.fromCharCode(s.match(/\d+/gm)[0]);
  })
  }*/

  private escape(string:any) {
    return this.clean(string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
  }

  private getHighlights(str:any, words:any) {
    //@ts-ignore
    let newwords = [];
    words.map((word:string)=> {
      //@ts-ignore
      if (word!=='') {
      newwords.push(this.escape(word));
      }
    });
    //@ts-ignore
    let regex = RegExp(newwords.join('|'), 'gi'); // case insensitive
    //@ts-ignore
    let high = [];
    let match = null;
    if (words.length === 1 && !words[0]) {
      //@ts-ignore
      return high;
    }
  
    while ((match = regex.exec(str))) {
      high.push({ offset: match.index, length: match[0].length });
    }
    return high;
  }

  @Method() public async fixResults(response:any) {
    if (this.mode==CodeSearchMode.Code) {
      let query = this.currentSearchString.split(' ');
      response.body.results.forEach((result:any) => {
        //Modify the excerpt
        let test = this.removeSpecial(result.excerpt);
        result.excerpt = test;// this.cleanEx(test);
        //remove highlights because they contain the wrong position.
        result.excerptHighlights=this.getHighlights(test, query);
        return result;
      });
      return response;
    }
    else return response;
  }

  public buildAQ(body:any) {
    let aq='';
    body.facets.map((facet:any)=>{
       let field = facet.field;
       //@ts-ignore
       let values = [];
       facet.currentValues.map((value:any)=>{
         if (value.state=="selected") {
            values.push('"'+value.value+'"');
         }
       });
       
       if (values.length>0) {
         //@ts-ignore
        aq+= " @"+field+"=("+values.join(',')+")";
       }
    });
    return aq;
  }

  @Method() public async fixQuery(request:any, clientOrigin:any) {
    if (clientOrigin === 'searchApiFetch') {
      if (this.bindings==undefined) {
        this.bindings = await initializeBindings(this.host);
      }
      if (this.mode==CodeSearchMode.Code && request.url.indexOf('/html?')==-1) {
        //Rewrite the query
        const body = JSON.parse(request.body);
        // E.g., modify facet requests
        // body.facets = [...];
        this.currentSearchString = body.q;
        body.q = this.replaceQuery(body.q);
        if (this.checkboxDQ) {
          body.dq = this.currentSearchString + this.buildAQ(body);
        }
        request.body = JSON.stringify(body);
  
      } else 
      {
        //Do nothing
      }
    }
    return request;
  }
  private async enableCodeSearch(){
    //this.bindings.engine.
     this.mode=CodeSearchMode.Code;
     this.executeSearch();

  }

  private async executeSearch() {
    if (this.bindings!=undefined) {
      const searchActions = loadSearchActions(this.bindings.engine);
      const analyticsActions = loadSearchAnalyticsActions(this.bindings.engine);
      let action = searchActions.executeSearch(analyticsActions.logInterfaceLoad());
      await this.bindings.engine.dispatch(action);
    } 

  }
  private enableNativeSearch(){
    this.mode=CodeSearchMode.Native;
    this.executeSearch();

  }


  private toggleSwitch() {
    //this.checkbox.checked = !this.checkbox.checked;
    this.checked = this.checkbox.checked;
    //this.background.style.setProperty('background', this.checked ? this.checkedColor : this.uncheckedColor)
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
    //this.checkbox.checked = !this.checkbox.checked;
    this.checkedDQ = this.checkboxDQ.checked;
    //this.background.style.setProperty('background', this.checked ? this.checkedColor : this.uncheckedColor)
    if (this.checkedDQ) {
      this.checked = this.checkbox.checked;
      this.checkbox.checked = true;
      this.enableCodeSearch();
    } else {
      this.executeSearch();
    }
  }

  private renderLabel() {
    let text="";
    if (this.mode==CodeSearchMode.Code) {
      text="Code Search";
  } else {
    text="Native Search";
  }

  return (
      <label
        class="m-2 font-bold text-sm cursor-pointer"
        part="label"
        
      >
        {text}
      </label>
    );
  }

  private renderLabelDQ() {
    let text="";
    if (this.checkedDQ) {
      text="Add DQ";
  } else {
    text="Not using DQ";
  }

  return (
      <label
        class="m-2 font-bold text-sm cursor-pointer"
        part="label"
        
      >
        {text}
      </label>
    );
  }

  public render() {
    return (
      <div  class="codeSearch flex items-center flex-wrap text-on-background">
          <input type="checkbox" class="first" title="Code search will replace special characters" onClick={this.toggleSwitch.bind(this)}  ref={el => this.checkbox = el as HTMLInputElement} checked={this.checked}/>
        {this.renderLabel()}
        <input type="checkbox" title="Add the current query also as DQ to the query" onClick={this.toggleSwitchDQ.bind(this)}  ref={el => this.checkboxDQ = el as HTMLInputElement} checked={this.checkedDQ}/>
        {this.renderLabelDQ()}
      </div>
    );
  
  }
}
