# Yanghao Chen

[![Website: Visit](https://img.shields.io/badge/Website-Visit-007EC6.svg)](https://cyhcyh070126-bot.github.io/)
[![Research: Projects](https://img.shields.io/badge/Research-Projects-00897B.svg)](https://cyhcyh070126-bot.github.io/projects/)
[![CV: PDF](https://img.shields.io/badge/CV-PDF-8A2BE2.svg)](https://cyhcyh070126-bot.github.io/files/Yanghao_Chen_CV.pdf)
[![Jekyll: Site](https://img.shields.io/badge/Jekyll-Site-CC0000.svg?logo=jekyll&logoColor=white)](#local-development)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-222222.svg?logo=github&logoColor=white)](#publish)
[![Hugging Face: Models](https://img.shields.io/badge/Hugging_Face-Models-FFD21E.svg?logo=huggingface&logoColor=white)](https://huggingface.co/CYHcyh66)

**Computational Mechanics · Scientific Machine Learning · Differentiable Programming and Simulation**

---

I am a final-year Engineering Mechanics undergraduate at Tongji University.
My research focuses on combining machine learning with numerical methods for
mechanics, including neural operators, finite element methods, and
GPU-accelerated simulation.

This repository contains the Jekyll source for my academic website: research
background, illustrated projects, code and model releases, and CV.

🌐 **[Visit my website](https://cyhcyh070126-bot.github.io/)** · [Research projects](https://cyhcyh070126-bot.github.io/projects/) · [Web CV](https://cyhcyh070126-bot.github.io/cv/)

---

## Start here

| To explore | Open |
| --- | --- |
| Research background, current work, and updates | [Homepage](https://cyhcyh070126-bot.github.io/) |
| Project summaries and available code | [Research projects](https://cyhcyh070126-bot.github.io/projects/) |
| Education, research experience, figures, and animations | [Web CV](https://cyhcyh070126-bot.github.io/cv/) |
| Download a concise CV | [CV PDF](https://cyhcyh070126-bot.github.io/files/Yanghao_Chen_CV.pdf) |
| Run the website locally | [Local preview](#local-development) |

The public website can be browsed without installing anything. To run a
research example, use the code repositories linked below; each has its own
installation and data instructions.

## Research

My work spans language-model fine-tuning for mechanics of materials, time-dependent physical-field prediction, physics-informed learning, and hybrid numerical solvers. I currently study how neural operators can be coupled with finite element solvers through shared subdomain interfaces.

| Project | Focus | Resources |
| --- | --- | --- |
| **GPU-accelerated Hybrid Finite Element–Neural Operator Solver** | Ongoing research in non-overlapping domain decomposition. JAX-FEM and Transolver exchange interface displacements and reaction forces iteratively. | [Research details](https://cyhcyh070126-bot.github.io/cv/#fem-neural-operator) |
| **ConvLSTM for Battery Materials** | Autoregressive concentration and stress image prediction from MATLAB–COMSOL simulations. The public release includes a concentration checkpoint and a 5C prediction example. | [Research details](https://cyhcyh070126-bot.github.io/cv/#convlstm-battery) · [Code and example](https://github.com/cyhcyh070126-bot/convlstm-battery-field-prediction) |
| **PINNs for Burgers Shocks** | Comparison of standard and fixed-artificial-viscosity PINNs against the analytical inviscid solution, examining shock profiles and prediction errors. | [Research details](https://cyhcyh070126-bot.github.io/cv/#burgers-pinn) · [Code](https://github.com/cyhcyh070126-bot/burgers-pinn) |
| **LLM Fine-Tuning for Mechanics of Materials** | LoRA fine-tuning of Qwen2.5-7B using curated instruction data for questions and concept explanations in mechanics of materials. | [Research details](https://cyhcyh070126-bot.github.io/cv/#mechanics-llm) · [Models & datasets](https://huggingface.co/CYHcyh66) |

The hybrid solver is an ongoing project presented through research figures and
descriptions on the site. Its project card links to those details; it does not
currently link to a released solver repository.

## Local Development

The site is built with Jekyll and published through GitHub Pages. With Ruby and
Bundler installed, clone the repository and start a local server:

```sh
git clone https://github.com/cyhcyh070126-bot/cyhcyh070126-bot.github.io.git
cd cyhcyh070126-bot.github.io
bundle install
bundle exec jekyll serve --livereload --host localhost
```

Open [localhost:4000](http://localhost:4000). Jekyll builds the site into `_site/`
and watches for content changes. Restart the server after changing `_config.yml`.

The [`Gemfile`](Gemfile) defines the site dependencies. No research dataset,
model checkpoint, MATLAB installation, or GPU is needed to preview the website.

### JavaScript changes

The JavaScript bundles are included in the repository. If you edit the JavaScript sources, install Node.js and npm, then rebuild the bundles:

```sh
npm install
npm run build:js
```

For continuous JavaScript rebuilding during development, use `npm run watch:js` in a separate terminal.

## Update the website

Choose the source file for the content you want to change:

| Location | Contents |
| --- | --- |
| [`_pages/about.md`](_pages/about.md) | Homepage text, research updates, skills, and contact links |
| [`_pages/cv.md`](_pages/cv.md) | Web CV and detailed research descriptions |
| [`_pages/projects.html`](_pages/projects.html) | Project overview page |
| [`_data/projects.yml`](_data/projects.yml) | Project summaries, preview images, captions, and resource links |
| [`_data/navigation.yml`](_data/navigation.yml) | Main navigation links |
| [`_config.yml`](_config.yml) | Site metadata, author profile, and Jekyll settings |
| [`images/research/`](images/research/) | Research figures and animations |
| [`files/`](files/) | Downloadable documents, including the CV PDF |
| [`files/research/`](files/research/) | Research PDFs opened from project figures |
| [`_includes/`](_includes/) and [`_layouts/`](_layouts/) | Shared page components and layouts |
| [`_sass/`](_sass/) and [`assets/`](assets/) | Styles, scripts, fonts, and other site assets |
| [`scripts/build-js.cjs`](scripts/build-js.cjs) | JavaScript bundle generation |

The project overview reads [`_data/projects.yml`](_data/projects.yml); the
illustrated CV is maintained in [`_pages/cv.md`](_pages/cv.md). The downloadable
CV is a separate PDF, so editing the web CV does not regenerate it. The current
CV page is `/cv/`; legacy `/cv-json/` and `/resume-json` URLs redirect there.

After editing, check the local page and its links at both desktop and mobile
widths. For a static build without the preview server, run:

```sh
bundle exec jekyll build
```

### Publish

Commit the intended source changes and push them to the repository's publishing
branch. Check the GitHub Pages deployment status in
[Actions](https://github.com/cyhcyh070126-bot/cyhcyh070126-bot.github.io/actions)
before checking the [live website](https://cyhcyh070126-bot.github.io/).
Deployment settings are managed under **Settings → Pages**. When updating a PDF
or figure, open the linked file on the live site as well as its containing page.

## Contact

For research correspondence: [2350083@tongji.edu.cn](mailto:2350083@tongji.edu.cn).

## Acknowledgments

The website is adapted from [Academic Pages](https://github.com/academicpages/academicpages.github.io), which builds on [Minimal Mistakes](https://github.com/mmistakes/minimal-mistakes). See [LICENSE](LICENSE) for the repository's license notice.
