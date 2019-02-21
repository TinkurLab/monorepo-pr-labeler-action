# 🚊 Monorepo PR Repo Labeler - GitHub Action

A [GitHub Action](https://github.com/features/actions) that labels pull requests with the modules(s) that are impacted in a [monorepo](https://en.wikipedia.org/wiki/Monorepo).

## How It Works

This GitHub Action runs when an [`pull_request` event webhook](https://developer.github.com/v3/activity/events/types/#issuesevent) is fired in your GitHub repo. The action checks if any of the files in the pull request are in a module (ex. `/directory1/...` from the root of the monorepo). If one or more modules are found, the pull request is labeled with a label for each module repo. Directories that beging with a dot (ex. `/.directory/`) are ignored.

## Examples

Example of PR that has changes in two modules:
![GitHub Logo](./docs/labels.png)

Example of monorepo module structure:
![GitHub Logo](./docs/repos.png)

## Installation

To use this GitHub Action, you must have access to [GitHub Actions](https://github.com/features/actions). GitHub Actions are currently only available in private beta (you must [apply for access](https://github.com/features/actions)) and only work in private repos.

To setup this action:

1. Create a `.github/main.workflow` in your GitHub repo.
2. Add the following code to the `main.workflow` file and commit it to the repo's `master` branch.

```
workflow "Monorepo PR Repo Labeler" {
  resolves = ["Label PR Monorepos"]
  on = "pull_request"
}

action "Label PR Monorepos" {
  uses = "adamzolyak/monorepo-pr-labeler-action@master"
  secrets = ["GITHUB_TOKEN"]
}
```

Optionally add a `BASE_DIRS` config under `env` if modules are located within a directory. You can add one (ex. `directory1`) or more directories (ex. `directory1|directory2|...`) in the config.

```
workflow "Monorepo PR Repo Labeler" {
  resolves = ["Label PR Monorepos"]
  on = "pull_request"
}

action "Label PR Monorepos" {
  uses = "adamzolyak/monorepo-pr-labeler-action@master"
  secrets = ["GITHUB_TOKEN"]
  env = {
    BASE_DIRS = "directory1|directory2"
  }
}
```

3. Whenever you open, edit, close, etc a pull request, the action will run!

## Contributing

If you have suggestions for how this GitHub Action could be improved, or want to report a bug, open an issue! Or pull request! We'd love all and any contributions. For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2018 Adam Zolyak <adam@tinkurlab.com> (www.tinkurlab.com)
