# Palette tooling

This branch contains tooling to sync the Ubuntu MediaWiki skin's color palette with the latest version of the [Vanilla
Framework](https://github.com/canonical/vanilla-framework).

## Usage

Call the [`update-palette.yaml`](.github/workflows/update-palette.yaml) workflow from your own workflow.

### Example workflow

```yaml
name: Sync Vanilla Framework palette

on:
  workflow_dispatch:
    inputs:
      vanilla_ref:
        description: "Vanilla Framework ref (tag, branch, or SHA). Leave empty to use the latest stable release."
        default: ""
        required: false
        type: string
  schedule:
    - cron: "0 9 * * 1" # Every Monday at 09:00 UTC

jobs:
  sync:
    uses: canonical/ubuntu-mediawiki-skin/.github/workflows/update-palette.yaml@palette-tooling
    with:
      vanilla_ref: ${{ inputs.vanilla_ref || '' }}
    secrets: inherit
    permissions:
      contents: write
      pull-requests: write
```
