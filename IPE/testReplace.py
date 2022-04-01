import re

def replaceCharacters(text):
  new_text=''
  pattern = re.compile("[A-Za-z0-9.\(\), ]+")
  for ch in text:
    if pattern.fullmatch(ch) is not None:
      new_text+=ch
    else:
      #not AlphaNum, replace it
      new_text+='X'+str(ord(ch))+'X'

  
  return new_text+' '+text


def getClassNames(fieldtoset, content, regex):
    result=[]
    if (re.search(regex, content)!='None'):
        try:
            matches=re.finditer(regex, content, re.MULTILINE)
            for matchNum, match in enumerate(matches, start=1):
              if (match.group(1)):
                print (match.group(1))
                result.append(match.group(1))
              if (match.group(2)):
                print (match.group(2))
                result.append(match.group(2))
              if (match.group(3)):
                print (match.group(3))
                result.append(match.group(3))
            #document.add_meta_data({fieldtoset:result})
            #document.log(fieldtoset+' set to: '+result)
        except:
            result=[]
    #document.add_meta_data({fieldtoset:result}) 

text = "title=document.get_meta_data_value('title')[0]"
text = """uickviewState,
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
export namespace CodeSearchPreviewResultComponent3 {
@Component({
  tag: "code-search-preview-result-component",
  styleUrl: "code-search-preview.css",
  shadow: true,
})
export class CodeSearchPreviewResultComponent2 {

export interface CodeSearchPreviewResultComponent2inter {

export namespace CodeSearchPreviewResultComponent {
  public bindings!: Bindings;
  public controller: any;
  @State() private result?: Result;
  @State() private loading?: Boolean;
  @Element() private host!: Element;
  private modalRef?: HTMLCodeSearchPrevi"""

print (getClassNames("code_extension", text, r"^[\w ]*class (\w*)|^[\w ]*interface (\w*)|^[\w ]*namespace (\w*)"))

#print (text)
#text=replaceCharacters(text)
#print (text)

#text = "tag: 'atomic-result-printable-uri',"
#print (text)
#text=replaceCharacters(text)
#print (text)

# f = open("ReplaceCharacters.py", "r")
# alltext = f.read()
# f.close()
# texts = alltext.split('\n')
# for text in texts:
#   print(text)
#   text=replaceCharacters(text)
#   print (text)
