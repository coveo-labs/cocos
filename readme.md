# Setup
## Add Fields
Add the fields to your Coveo Organization.
Goto:

[Swagger](https://platform.cloud.coveo.com/docs?urls.primaryName=Field#/Fields/rest_organizations_paramId_indexes_fields_batch_create_post)


And insert the [Fields](Fields\\AddFields.json).

## Add Extension
Add the [Extension](IPE\\ReplaceCharactersBodyText.py).

** Make sure to enable 'Body Text' **

## Add Sources
Add the Source.
* Insert your ApiKey
* Insert the JSON

Enable the extension `ReplaceCharactersBodyText` as `post-conversion` script.


## Add Pipelines
The ones you need

## Create the UI
Install CLI

```cmd
coveo auth:login -o=cocospf4amx00
```

Create Atomic Page
```cmd
coveo ui:create:atomic atomic_ui
```

## In case of errors, update your headless installation
```cmd
npm i @coveo/atomic@latest @coveo/headless@latest
```

### Deploy to Netlify
Create a site in [Netlify](https://app.netlify.com/sites).
Copy that `siteId` and put it in `.netlify\state.json`.

```cmd
npm run site:deploy
```

The above will also update your app with the `.env` settings.

