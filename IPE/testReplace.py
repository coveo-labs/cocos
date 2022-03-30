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

text = "title=document.get_meta_data_value('title')[0]"

print (text)
text=replaceCharacters(text)
print (text)

text = "tag: 'atomic-result-printable-uri',"
print (text)
text=replaceCharacters(text)
print (text)

# f = open("ReplaceCharacters.py", "r")
# alltext = f.read()
# f.close()
# texts = alltext.split('\n')
# for text in texts:
#   print(text)
#   text=replaceCharacters(text)
#   print (text)
