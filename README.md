# GitSave README

![GitSave Icon](./images/GitSave.png)

GitSave automatically commit to Git on save.

## Features

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

## v1.0.0

- Changed commit to use reletive path
- Added Terminal reuse

See CHANGELOG.md for more