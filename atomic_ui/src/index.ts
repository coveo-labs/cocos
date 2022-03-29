async function renewAccessToken() {
  const response = await fetch('.netlify/functions/token');
  const {token} = await response.json();
  return token;
}

async function main() {
  await customElements.whenDefined('atomic-search-interface');
  await customElements.whenDefined('code-search-component');
  const searchInterface: HTMLAtomicSearchInterfaceElement =
    document.querySelector('#search')!;
  const codeSearch: HTMLCodeSearchComponentElement =
    document.querySelector('#codesearch')!;

  const platformUrl = process.env.PLATFORM_URL!;
  const organizationId = process.env.ORGANIZATION_ID!;
  await searchInterface.initialize({
    accessToken: await renewAccessToken(),
    renewAccessToken,
    organizationId,
    platformUrl,
    preprocessRequest: (request, clientOrigin) => {
      if (codeSearch!=null) {
      return codeSearch.fixQuery(request, clientOrigin);
      }
      else return request;
    },
    search: {
      preprocessSearchResponseMiddleware: (response) => {
        if (codeSearch!=null) {
          return codeSearch.fixResults(response);
          //return response;
          }
          else return response;
      }
    },
  });


  searchInterface.executeFirstSearch();

  searchInterface.i18n.addResourceBundle('en', 'caption-code_origin', {
    GitHub: 'GitHub'
   });
}

main();
