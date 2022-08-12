<a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>

# asdf-parse-tool-versions

Parses asdf [.tool-versions](http://asdf-vm.com/manage/configuration.html#tool-versions) file extracting version information.

Returns a JSON string as output with this format: 

```
{"golang":"1.12.5","ruby":"2.7.0"}
```

Each tool has it's own key where value is the value in the `.tool-versions` file.

The action also exports all versions as environment variables with the format `<tool>_VERSION` (i.e. `GOLANG_VERSION`).

## Usage

```yaml
---
name: run on master

on:
  push:
    branches:
      - main

jobs:
  nightly:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: gather versions
        uses: endorama/asdf-parse-tool-versions@v1
        id: versions

      - name: install Go
        uses: actions/setup-go@v1
        with: 
          go-version: "${{ env.GOLANG_VERSION }}"

      # OR using action output
      - name: install Go
        uses: actions/setup-go@v1
        with: 
          go-version: "${{ steps.versions.outputs.tools.golang }}"

      # ...
``` 

