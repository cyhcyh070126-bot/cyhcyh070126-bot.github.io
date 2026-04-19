---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======

Detailed education information will be added here as this page is expanded.

Research Interests
======

- Computational mechanics
- Finite element methods
- Scientific machine learning
- Neural operators and surrogate modeling
- Data-driven simulation

Current Focus
======

- Learning-based operators for mechanics problems
- FEM-consistent data generation and supervision
- Surrogate models for displacement and stress recovery
- Reproducible scientific computing workflows

Research Experience
======

### FEniCSx-Supervised Local Operator Learning for Single-Hole Domains

I am currently building a mechanics learning pipeline that uses GRF-based internal hole generation, Gmsh finite element meshes, and FEniCSx ground-truth supervision to train neural operators for nodal displacement prediction. The central idea is to use FEM nodes directly as point-cloud inputs, so that predicted displacements remain consistent with later stress and strain recovery.

- Geometry families: GRF, circle, square
- Solver supervision: FEniCSx
- Learning target: nodal displacement field
- Main tools: Python, JAX, FEniCSx, Gmsh

Project page: [Research Experience](/research-experience/)

Profile Summary
======

I work at the intersection of mechanics, numerical simulation, and machine learning. My current interests include operator learning for PDE-governed systems, data generation pipelines based on finite element simulations, and robust surrogate models for scientific applications.

Skills
======

- Python
- JAX
- FEniCSx
- Gmsh
- Numerical simulation
- Scientific visualization

Contact
======

- Email: [cyhcyh070126@gmail.com](mailto:cyhcyh070126@gmail.com)
- Website: [cyhcyh070126-bot.github.io](https://cyhcyh070126-bot.github.io)
- GitHub: [cyhcyh070126-bot](https://github.com/cyhcyh070126-bot)

Publications
======

<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

Talks
======

<ul>{% for post in site.talks reversed %}
  {% include archive-single-talk-cv.html  %}
{% endfor %}</ul>

Teaching
======

<ul>{% for post in site.teaching reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

Service and Leadership
======

This section will be updated as the site content grows.
