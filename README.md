# GitSave README

![GitSave Icon](./images/GitSave.png)

GitSave automatically commit to Git on save.

## Features

Does what the description said, runs `git commit {{ Current File}} -m "Update at {{ Timestamp }}"` on save.

## Usage

Enable GitSave using Command Palette `GitSave: Enable` - Disabled by default

Disable GitSave using Command Palette `GitSave: Disable`

Run GPG Test using Command Palette `GitSave: GPG Test`

Note: If commit with GPG, cache GPG passphrase and run GPG Test before using GitSave.

## Requirements

You'll just need VS Code with Git enabled.

## Extension Settings

Configuration currently unavailable

## Known Issues

No known issues

## Release Notes

## v0.3.3

Fixed command not found error

See CHANGELOG.md for more