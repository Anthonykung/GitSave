# GitSave README

![GitSave Icon](./images/GitSave.png)

GitSave automatically commit to Git on save.

## Features

Updates coming soon, v2.0.0 is out! You can now set your defaults in Extension Settings!

Support on typing out GPG passphrase if not in chache will be out in v3.0.0 update. Currently an error will show if GPG failed to sign.

Does what the description said, runs the following lines on save:

```bash
git add {{ Current File }}
git commit {{ Current File }} -m "Update at {{ Timestamp }}"
```

## Usage

Enable GitSave using Command Palette `GitSave: Enable` - Disabled by default

Disable GitSave using Command Palette `GitSave: Disable`

Run GPG Test using Command Palette `GitSave: GPG Test`

Note: If commit with GPG, cache GPG passphrase and run GPG Test before using GitSave.

Show GitSave commit terminal using Command Palette `GitSave: Show commit terminal` - Disabled by default

Hide GitSave commit terminal using Command Palette `GitSave: Hide commit terminal`

## Requirements

You'll just need VS Code with Git enabled.

## Extension Settings

Configuration currently unavailable

## Known Issues

No known issues

## Release Notes

## v2.0.0

- Revert back to absolute path
- Added CLI error reporting
- Enable GPG support
- Allow option to VS Code terminal or child processes

See CHANGELOG.md for more
