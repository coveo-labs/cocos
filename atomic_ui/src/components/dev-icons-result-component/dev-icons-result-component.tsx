import {Result} from '@coveo/atomic/headless';
import {Component, h, Element, State, Prop} from '@stencil/core';
import {resultContext} from '@coveo/atomic';

/**
 * Sample custom Atomic result component, to be used inside an Atomic Result Template.
 *
 * This component showcases a component that conditionally renders the author of a result, with a fallback to display "anonymous" in the event that no author is available for a document, for educational purposes.
 *
 * In a real life scenario, we recommend using [result-field-condition](https://docs.coveo.com/en/atomic/latest/reference/result-template-components/atomic-field-condition/) and [atomic-result-text](https://docs.coveo.com/en/atomic/latest/reference/result-template-components/atomic-result-text/).
 */
@Component({
  tag: 'dev-icons-result-component',
  styleUrl: 'dev-icons-result-component.css',
  shadow: true,
})
export class DevIconsResultComponent {
  // The Headless result object to be resolved from the parent atomic-result component.
  @State() private result?: Result;
  @Element() private host!: Element;
  @Prop() public currentResult?: Result;

  // We recommended fetching the result context using the `connectedCallback` lifecycle method
  // with async/await. Using `componentWillLoad` will hang the parent `atomic-search-interface` initialization.
  public async connectedCallback() {
    try {
      if (this.currentResult) {
        this.result = this.currentResult;
      } else {
        this.result = await resultContext(this.host);
      }
    } catch (error) {
      console.error(error);
      this.host.remove();
    }
  }

  public render() {
    // Do not render the component until the result object has been resolved.
    if (!this.result) {
      return;
    }
    const default_icon = 'empty.svg';
    const iconlist=[{"ext":".py", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original-wordmark.svg'},
    {"ext":"vscode", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original-wordmark.svg'},
    {"ext":".json", "icon":'json.svg'},
    {"ext":".ts", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'},
    {"ext":".tsx", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg'},
    {"ext":".js", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'},
    {"ext":".cpp", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'},
    {"ext":".c", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg'},
    {"ext":".coffee", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/coffeescript/coffeescript-original-wordmark.svg'},
    {"ext":".cs", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg'},
    {"ext":".css", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg'},
    {"ext":".gitignore", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg'},
    {"ext":".go", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original-wordmark.svg'},
    {"ext":".h", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg'},
    {"ext":".hpp", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'},
    {"ext":".html", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original-wordmark.svg'},
    {"ext":".java", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original-wordmark.svg'},
    {"ext":".markdown", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg'},
    {"ext":".md", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg'},
    {"ext":".php", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg'},
    {"ext":".scala", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original-wordmark.svg'},
    {"ext":".scss", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original-wordmark.svg'},
    {"ext":".sh", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'},
    {"ext":".svg", "icon":'svg.svg'},
    {"ext":".swift", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original-wordmark.svg'},
    {"ext":".tf", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original-wordmark.svg'},
    {"ext":".txt", "icon":'txt.svg'},
    {"ext":".unix", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unix/unix-original.svg'},
    {"ext":".vue", "icon":'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original-wordmark.svg'},
    {"ext":".xaml", "icon":'json.svg'},
    {"ext":".yaml", "icon":'json.svg'},
    {"ext":".yml", "icon":'json.svg'}
    
               ];
    
    const code_extension = this.result.raw['code_extension'] || '';
    let icon = iconlist.find(obj => obj.ext === code_extension);
    let icon_image = "";
    if (icon === undefined) {
      icon_image = default_icon;
    } else {
      icon_image = icon.icon;
    }
    return (
      <img part="code_image" src={icon_image}/>
    );
  }
}
