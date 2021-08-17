# Arweave-upload-file v1

## Overview

This action will allow you to upload a file to the Arweave permaweb in an easy manner during your action workflows, with just a couple inputs.

It uses [Arweave-deploy](https://github.com/ArweaveTeam/arweave-deploy) under the hood, wrapping the CLI into an easy-to-use action for developers or any interested party.

If your use case requires the upload of a directory, please refer to [rgbrota/arweave-upload-directory](https://github.com/rgbrota/arweave-upload-directory).
## Usage

See [action.yml](action.yml).

### Inputs

The action expects the following inputs:

| Input | Type | Required | Default | Description |
| --- | --- | :---: | :---: | --- |
| `key_file_content` | JSON | ✔️ | - | The content of the Arweave key file JSON used to upload the data. It should be setup as a secret inside the repository. |
| `file_path` | String | ✔️ | - | Path of the file to be uploaded. |
| `ipfs` | Boolean | ❌ | `false` | Upload to IPFS as well (experimental). |
| `package` | Boolean | ❌ | `false` | Package HTML dependencies into a single self-contained file. |
### Outputs

The action also has the following outputs:

| Output | Type | Description |
| --- | --- | --- |
| `arweave_url` | String | Arweave URL where the uploaded file will be available once mined. |
| `ipfs_url` | String | IPFS URL where the uploaded file will be available once mined, if the input ```ipfs``` was set to true. |
| `cost` | Integer | Total cost of the transaction in the Arweave blockchain currency, AR. |
### Examples
#### Upload a file - basic usage

```yaml
steps:
- uses: actions/checkout@v2

- uses: rgbrota/arweave-upload-file@v1
    with:
        key_file_content: ${{ secrets.xx }}
        file_path: 'xx'
```

#### Upload a file - Arweave + IPFS

```yaml
steps:
- uses: actions/checkout@v2

- uses: rgbrota/arweave-upload-file@v1
    with:
        key_file_content: ${{ secrets.xx }}
        file_path: 'xx'
        ipfs: true
```

#### Upload a file - Packing HTML and dependencies

```yaml
steps:
- uses: actions/checkout@v2

- uses: rgbrota/arweave-upload-file@v1
    with:
        key_file_content: ${{ secrets.xx }}
        file_path: 'xx'
        package: true
```