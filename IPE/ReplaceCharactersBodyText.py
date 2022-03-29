#Replace non character characters by XcharcodeX in body_text
#Post Conversion script!!!

#Select 'Body Text' in the settings of the script
# Fields: 
#         code_coveocalls
#         code_extension
#         code_lines

import re
import json
#document.add_meta_data({"allmetadatavalues": json.dumps(document.get_meta_data())})

def getMeta(fieldtoset, content, regex, occurence):
    result=''
    if (re.search(regex, content)!='None'):
        try:
            result=re.search(regex, content).group(occurence)
            document.add_meta_data({fieldtoset:result})
            document.log(fieldtoset+' set to: '+result)
        except:
            result=''  
    return result    

def getMetaAll(fieldtoset, content, regex):
    result=''
    if (re.search(regex, content,re.MULTILINE)):
        try:
            result=set(re.findall(regex, content,re.MULTILINE))
            all=''
            for res in result:
               all=all+';'.join([_f for _f in res if _f])+';'
            document.add_meta_data({fieldtoset:all})
            document.log(fieldtoset+' set to: '+all)
        except:
            result=''  
    return result   


def replaceCharacters(text):
  new_text=''
  pattern = re.compile("[A-Za-z0-9.\(\) ]+")
  for ch in text:
    if pattern.fullmatch(ch) is not None:
      new_text+=ch
    else:
      #not AlphaNum, replace it
      new_text+='X'+str(ord(ch))+'X'

  return new_text+' '+text
    
# 1. Get Title, based on the title we try to get the extension
title=''
try:
	title=document.get_meta_data_value('title')[0]
except:
    pass

getMeta("code_extension", title, '(\.\w+)$', 1)

# 2. Get documentdata (the original content)
alldata=[]
alltext=''
try:
  original_data = document.get_data_stream('body_text')
  alltext = original_data.read()
  alldata = alltext.split('\n')
except:
  pass

# 3. Count the lines and replace special characters
new_data=[]
counter=1
for line in alldata:
   new_data.append(replaceCharacters(line))
   counter+=1

document.add_meta_data({'code_lines': counter-1})
document.add_meta_data({'code_facet': new_data})
# 4. Write back to documentdata
# 4.1 Get a modifiable stream
modified_stream = document.DataStream('body_text')
# 4.2 Overwrite the modifiable stream data with the previously altered data
modified_stream.write('\n'.join(new_data))
# 4.3 Add the modified stream to the item
document.add_data_stream(modified_stream)

# 5. Get Coveo Calls from text
getMetaAll("code_coveocalls", alltext, '()|(changeAnalyticsCustomData)|(initSearchbox)|(buildingQuery)|(preprocessResults)|(deferredQuerySuccess)|(doneBuildingQuery)|(duringFetchMoreQuery)|(duringQuery)|(newQuery)|(preprocessMoreResults)')

    
