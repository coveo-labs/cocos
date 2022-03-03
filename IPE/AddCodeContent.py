#Add Line Numbers to each line
#Add them to a facet value

#Select 'Original File' in the settings of the script
# Fields: code_facet
#         code_coveocalls
#         code_extension
#         code_lines

import string
import re


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

title=''
try:
	title=document.get_meta_data_value('title')[0]
except:
    pass
alldata=[]
alltext=''
try:
  original_data = document.get_data_stream('documentdata')
  alltext = original_data.read().decode()
  alldata = alltext.split('\n')
except:
  pass
  
new_data=[]
counter=1
for line in alldata:
   new_data.append(str(counter)+' '+line)
   counter+=1

getMeta("code_extension", title, '(\.\w+)$', 1)

document.add_meta_data({'code_facet': '\n'.join(new_data)})
document.add_meta_data({'code_lines': counter-1})

getMetaAll("code_coveocalls", alltext, '()|(changeAnalyticsCustomData)|(initSearchbox)|(buildingQuery)|(preprocessResults)|(deferredQuerySuccess)|(doneBuildingQuery)|(duringFetchMoreQuery)|(duringQuery)|(newQuery)|(preprocessMoreResults)')


 