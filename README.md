<!-------------------------------------------------
   _____   _   _      _____
  / ____| (_) | |    / ____|
 | |  __   _  | |_  | (___     __ _  __   __   ___
 | | |_ | | | | __|  \___ \   / _` | \ \ / /  / _ \
 | |__| | | | | |_   ____) | | (_| |  \ V /  |  __/
  \_____| |_|  \__| |_____/   \__,_|   \_/    \___|
-------------------------------------------------->

<center>
  <img src="https://vault.hailiga.org/Projects/GitSave/images/GitSave.png" width="200px">
</center>

# GitSave Intro

GitSave automatically commit to Git on save.

Updates coming soon, v2.0.0 is out! You can now set your defaults in Extension Settings!

Support on typing out GPG passphrase if not in chache will be out in v3.0.0 update. Currently an error will show if GPG failed to sign.

## Content

For most up to date README please refer to [GitHub Repo](https://gitsave.anth.dev)

1. [Features](#Features)
    1. [Example GIFs](#Example-GIFs)
2. [Installation](#Installation)
    1. [Using Visual Studio Code Marketplace](#Using-Visual-Studio-Code-Marketplace)
    2. [Using GitHub](#Using-GitHub)
3. [Usage](#Usage)
4. [Docs](#Docs)
5. [Requirements](#Requirements)
6. [Extension Settings](#Extension-Settings)
    1. [Operation](#Operation)
    2. [Customization](#Customization)
    3. [Notification](#Notification)
7. [Known Issues](#Known-Issues)
8. [Release Notes](#Release-Notes)
9. [Contributing](#Contributing)
    - [Feedback](#Feedback)
10. [Security](#Security)
11. [License](#License)

## Features

Does what the description said, runs the following lines on save:

```bash
git add {{ Current File }}
git commit {{ Current File }} -m "Update at {{ Timestamp }}"
```

### Example GIFs

#### Saving with Control + S

<center>
  <img src="https://vault.hailiga.org/Projects/GitSave/images/Control-S.gif" width="50%">
</center>

#### Saving with VS Code Auto Save

<center>
  <img src="https://vault.hailiga.org/Projects/GitSave/images/Auto-Save.gif" width="50%">
</center>

#### Using VS Code Terminal

<center>
  <img src="https://vault.hailiga.org/Projects/GitSave/images/VSC-Terminal.gif" width="50%">
</center>

## Installation

### Using Visual Studio Code Marketplace

VS Code Marketplace Listing: https://marketplace.visualstudio.com/items?itemName=Anthonykung.gitsave

1. Search for GitSave on Visual Studio Code Marketplace

2. Install the extension

3. Enable the extension

4. You're all set!

### Using GitHub

GitHub Repo: https://github.com/Anthonykung/GitSave

1. Clone this repo to your `<user home>/.vscode/extensions` directory

2. Enable the Extension

3. You're all set!

## Usage

Enable GitSave using Command Palette `GitSave: Enable` - Disabled by default

Disable GitSave using Command Palette `GitSave: Disable`

Run GPG Test using Command Palette `GitSave: GPG Test`

Note: If commit with GPG, cache GPG passphrase and run GPG Test before using GitSave.

Show GitSave commit terminal using Command Palette `GitSave: Show commit terminal` - Disabled by default

Hide GitSave commit terminal using Command Palette `GitSave: Hide commit terminal`

## Docs

Documentation coming soon

## Requirements

You'll just need VS Code with Git enabled.

## Extension Settings

<center>
  <img src="https://vault.hailiga.org/Projects/GitSave/images/Configuration.png" width="50%">
</center>

### Operation

- `enableByDefault`

  Set whether to enable GitSave by default

- `enableCommitSigning`

  Enable or disable GPG commit signing, require GPG passphrase cached (coming soon, disable `Use Terminal` for GPG commit for now)

- `enablePushOnCommit`

  Enable Git push on commit (coming soon)

- `useTerminal`

  Use VS Code Terminal for commit, opens a VS Code Terminal and commit. Useful for error checking.

- `showCommitTerminal`

  Show terminal on commit, useful for error checking.

### Customization

- `commitMessage`

  Customize your commit message, use [: fileName :] and [: timestamp :] (coming soon)

### Notification

- `showDisabledMessages`

  Shows a message if GitSave is not enabled

- `showActivationMessages`

  Shows a message whenever GitSave is activated

- `showCommitMessages`

  Shows a message when GitSave commit is called

## Known Issues

No known issues

## Release Notes

## v2.1.2

- Updated Images

## v2.1.1

- Updated README

## v2.1.0

- Added auto update configuration on change
- Added additional debug logging
- Added hide disable message command to Command Palette

## v2.0.0

- Revert back to absolute path
- Added CLI error reporting
- Enable GPG support
- Allow option to VS Code terminal or child processes

See [CHANGELOG.md](./CHANGELOG.md) for more

## Contributing

Thank you for your interest in contributing GitSave ☺

You can contribute by using either the pull request or creating issues. More information on Contributing Guideline (coming soon).

### Feedback

We love your feedback! Tell us what you think about the extension and any ideas that you might have using [GitHub Discussion](https://github.com/Anthonykung/GitSave/discussions)!

## Security

We take any security risks seriously, if you have found or suspected a vulnerability or anything that might compromise our security, we would very much appreciate it if you can report it to [bugs@anth.dev](mailto:bugs@anth.dev).

## License

Apache 2.0 LICENSE

GitSave - Automatically commit to Git on save

Copyright 2021 Anthony Kung

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

```
   http://www.apache.org/licenses/LICENSE-2.0
```

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
