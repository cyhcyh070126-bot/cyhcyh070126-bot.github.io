# Yanghao Chen Homepage

Source code for the personal website at [cyhcyh070126-bot.github.io](https://cyhcyh070126-bot.github.io).

## Overview

This repository contains the Jekyll-based source for Yanghao Chen's homepage. The site presents research interests, illustrated projects, a CV, and professional updates.

## Main Files

- `_config.yml`: site-wide settings, metadata, and sidebar information
- `_pages/about.md`: homepage content
- `_pages/cv.md`: markdown CV page
- `_data/navigation.yml`: top navigation bar
- `_data/projects.yml`: project summaries and repository links
- `files/Yanghao_Chen_CV.pdf`: downloadable one-page CV

The canonical CV is `/cv/`. Legacy `/cv-json/` and `/resume-json` links redirect
to this page so visitors reach the current version.

## Local Preview

1. Install Ruby, Bundler, and Node.js.
2. Run `bundle install`.
3. Start the local server with `bundle exec jekyll serve -l -H localhost`.
4. Open `http://localhost:4000`.

## Deployment

The production site is intended to be served from:

- `https://cyhcyh070126-bot.github.io`

This site is intended to be deployed as the GitHub Pages user site for the `cyhcyh070126-bot` account.
