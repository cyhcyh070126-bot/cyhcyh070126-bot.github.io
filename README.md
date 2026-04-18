# Yang Haochen Homepage

Source code for the personal website at [yanghaochen.github.io](https://yanghaochen.github.io).

## Overview

This repository contains the Jekyll-based source for Yang Haochen's homepage. The site is used to present research interests, projects, publications, and professional updates.

## Main Files

- `_config.yml`: site-wide settings, metadata, and sidebar information
- `_pages/about.md`: homepage content
- `_pages/cv.md`: markdown CV page
- `_data/navigation.yml`: top navigation bar
- `_data/cv.json`: JSON-backed CV content

## Local Preview

1. Install Ruby, Bundler, and Node.js.
2. Run `bundle install`.
3. Start the local server with `bundle exec jekyll serve -l -H localhost`.
4. Open `http://localhost:4000`.

## Deployment

The production site is intended to be served from:

- `https://yanghaochen.github.io`

To make the custom domain work, GitHub Pages settings and DNS still need to point to this repository.
