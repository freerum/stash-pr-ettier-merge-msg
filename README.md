# Stash PR-ettier Merge Message

Chrome extension that auto-updates Stash's Pull-Request Merge message to the PR's title.
Makes for prettier repository commit messages.

## Overview

Changes Stash's Pull-Request Merge message to the PR's title. Results in prettier repository commit messages
Changes the Stash/BitBucket Pull-Request merge message from the default "Merge Pull Request #<pr-number> from <branch-name> to <target-branch-name>"message to the PR's title. This also results in more readable and useful commit message in the Repository commit list page.

For instance, if the PR's title is "Fixed JSE in submit action" the default "Merge Pull Request #999 from ~YOU/bug-fix-branch to master" gets replaced with "Fixed JSE in submit action (PR# 999)"

The PR's description is also copied over into the merge message as markdown text. Images uploaded to the PR description are replaced with links to the images.

## Chrome Store

This is a private extension and is available at:

https://chrome.google.com/webstore/detail/stash-pr-ettier-merge-mes/njopgmffafhfoaeiedchalkhpkklchgb/
