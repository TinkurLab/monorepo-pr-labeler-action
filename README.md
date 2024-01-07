# 🚊 Monorepo PR Repo Labeler - GitHub Action

A [GitHub Action](https://github.com/features/actions) that labels pull requests with the modules(s) that are impacted in a [monorepo](https://en.wikipedia.org/wiki/Monorepo).

## How It Works

This GitHub Action runs when an [`pull_request` event webhook](https://developer.github.com/v3/activity/events/types/#issuesevent) is fired in your GitHub repo. The action checks if any of the files in the pull request are in a module (ex. `/module1/...`, `/module2/...`, from the root of the monorepo). If one or more modules are found, the pull request is labeled with a label for each module repo.

Details

- Directories that beginning with a dot (ex. `/.directory/`) are ignored.
- The action supports configuring a list of one or more base directories if modules are within base directories (ex. `/base_directory1/module1/`, `/base_directory1/module2/`, `/base_directory2/module3/`) such as within [Lerna projects](https://github.com/lerna/lerna)
- The action supports configuring label prefix and label suffix for labeling.
- The action supports use on GHES instances!

Note: If you're migrating from version 2.x to 3.x, the automatic prefix `📁 Repo: <repo>` is now optional. If you want to keep this prefix or add a different prefix, see "Adding a custom prefix or suffix to labels" below.

## Examples

Example of PR that has changes in two modules:
![GitHub Logo](./docs/labels.png)

Example of monorepo module structure:
![GitHub Logo](./docs/repos.png)

## Installation

To setup this action:

1. Create a `.github/worksflows/main.yml` in your GitHub repo ([more info](https://help.github.com/en/articles/configuring-a-workflow)).
2. Add the following code to the `main.yml` file and commit it to the repo's `master` branch.

```yaml
name: Monorepo PR Repo Labeler

on: pull_request

jobs:
  labelPR:
    name: Label PR With Repo(s)
    runs-on: ubuntu-latest
    steps:
      - name: Label PRs
        uses: tinkurlab/monorepo-pr-labeler-action
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BASE_DIRS: 'directory1|directory2' # optional
        with:
          prefix: 'sample_prefix' # optional
          suffix: 'sample_suffix' # optional
          separator: ' ' # optional
```

### Options

- Optionally add a `BASE_DIRS` variable under `env` if modules are located within one or more base directory(ies). You can configure one (ex. `base_directory1`) or more directories (ex. `base_directory1|bae_directory2|...`). If `BASE_DIRS` isn't specified, the action will assume the base directories in the repo are your modules (ex. `base_directory1` is a module).
- Add `prefix` or `suffix` under `with` if you wish to add prefix or suffix the repo name in the label respectively.
- Add `separator` under `with` if you wish to add a separator between the prefix, label, and suffix. For example, using a single space character `' '` will add a space between them. By default, no separator is added.

### Example: Repos in sub directories

The following configuration will look for repos within the `folderA` and `folderB` directories:

```yaml
name: Monorepo PR Repo Labeler

on: pull_request

jobs:
  labelPR:
    name: Label PR With Repo(s)
    runs-on: ubuntu-latest
    steps:
      - name: Label PRs
        uses: TinkurLab/monorepo-pr-labeler-action
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BASE_DIRS: 'folderA|folderB' # optional
```

### Example: Adding a custom prefix or suffix to labels

The following configuration will prefix each label with `🗂` and add a space after the prefix - ex.`🗂 Repo A`, `🗂 Repo B`, etc:

```yaml
name: Monorepo PR Repo Labeler

on: pull_request

jobs:
  labelPR:
    name: Label PR With Repo(s)
    runs-on: ubuntu-latest
    steps:
      - name: Label PRs
        uses: tinkurlab/monorepo-pr-labeler-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          prefix: '🗂' # optional
          separator: ' ' # optional
```

## Upgrading

You can pin the action version (ex. `uses: tinkurlab/monorepo-pr-labeler-action@4.x.x`) to avoid issues due to breaking changes in major version updates.

### Upgrading to v4.x.x or >

Version 4.x.x changes the previous functionlity of v3.x.x which automatically added a space between the package name a prefix (if configured) or a suffix (if configured) when labeling pull requests. Starting with version 4.0.0, if a prefix or suffix is configured, an optional seperator can be configured via the `separator: ' '` property. This property can be used to add a space or other seperator. If no `separator` property is configured, no space or other seperator will be included in the label. It is recommended that you update your action configuration before upgrading to v4.x.x.

## Contributing

If you have suggestions for how this GitHub Action could be improved, or want to report a bug, open an issue! Or pull request! We'd love all and any contributions. For more, check out the [Contributing Guide](CONTRIBUTING.md).

## Maintainers

This repo is maintained by:

- Adam Zolyak @adamzolyak
- Anshul Sahni @anshulsahni

## License

[ISC](LICENSE) © 2022 Adam Zolyak <adam@tinkurlab.com> (www.tinkurlab.com)

![analytics](https://grabify.link/T53Q8F)
