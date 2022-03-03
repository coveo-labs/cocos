# Setup
## Add Fields
Add the fields to your Coveo Organization.
Goto:

[Swagger](https://platform.cloud.coveo.com/docs?urls.primaryName=Field#/Fields/rest_organizations_paramId_indexes_fields_batch_create_post)


And insert the [Fields](Fields\\AddFields.json).

## Add Extension
Add the [Extension](IPE\\AddCodeContent.py).

** Make sure to enable 'Original File' **

## Add Sources
Add the Source.
* Insert your ApiKey
* Insert the JSON

Enable the extension `AddCodeContent`.


## Add Pipelines

## Create the UI
Install CLI

```cmd
coveo auth:login -o=cocospf4amx00
```

Create Atomic Page
```cmd
coveo ui:create:atomic atomic_ui
```
