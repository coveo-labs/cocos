@code_facet*="*def*" OR @code_facet*=*def is?extension?folder(obj):*" OR @code_facet*="*is?extension?folder(obj):*" $qre(expression:'@code_facet*="*def*",modifier:200)  $qre(expression:'@code_facet*=*def is?extension?folder(obj):*',modifier:300) OR $qre(expression:'@code_facet*="*is?extension?folder(obj):*',modifier:200)


@code_facet*="*json.dumps*" OR @code_facet*="*headers=headers*" OR @code_facet*="*return filename.lower().*" $qre(expression:'@code_facet*="*json.dumps*"',modifier:200)  $qre(expression:'@code_facet*="*headers=headers*"',modifier:300) OR $qre(expression:'@code_facet*="*return filename.lower().*"',modifier:200)

@code_facet*="*json.dumps*" OR @code_facet*="*headers=headers*" OR @code_facet*="*return filename.lower().*" 