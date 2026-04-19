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

<div id="research-experience"></div>

Research Experience
======

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">FEniCSx-Supervised Local Operator Learning for Single-Hole Domains</div>
    <div class="cv-project__term">Current</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Research Project</em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- Operator Learning Objective: Training a Transolver-based neural operator to predict full nodal displacement fields under varying internal-hole shapes, boundary displacement functions, material parameters, and hole positions on the plate.
- Dataset and Supervision Pipeline: Building a mechanics data factory that generates GRF/circle/square hole geometries, assigns boundary-function libraries, and uses FEniCSx to produce displacement-field ground truth for supervised learning.
- FEM-Node Point Cloud Representation: Using the actual FEM nodes extracted from the Gmsh mesh as point-cloud inputs instead of uniformly sampled points, which keeps the learning representation aligned with the finite element discretization.
- Mechanics-Oriented Efficiency: Preserving FEM consistency so that once displacement is predicted, later FEM-style post-processing can still be applied efficiently for strain and stress recovery rather than learning every derived quantity separately.

<div class="research-gallery">
  <figure class="research-card">
    <a href="/files/research/grf_hole_extraction_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/grf_hole_extraction_preview.png" alt="Preview of GRF-based hole extraction and placement." />
    </a>
    <figcaption>
      GRF Hole Generation<br>
      A GRF field is windowed, thresholded, and converted into a smooth internal hole before placement on the plate.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/plate_partition_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/plate_partition_preview.png" alt="Preview of plate partition and subdomain finite element mesh." />
    </a>
    <figcaption>
      FEM-Consistent Meshing<br>
      The local subdomain is extracted from the whole plate mesh while preserving a mechanics-consistent finite element discretization.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/plate_mesh_point_cloud_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/plate_mesh_point_cloud_preview.png" alt="Preview showing the FE mesh and the Transolver input point cloud extracted from FEM nodes." />
    </a>
    <figcaption>
      FEM Node Point Cloud<br>
      The Transolver input point cloud is built directly from FEM mesh nodes, which keeps learning and later FEM-based post-processing tightly aligned.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/prediction.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/prediction_preview.png" alt="Prediction comparison between ground truth, prediction, and error fields." />
    </a>
    <figcaption>
      Transolver Operator Prediction<br>
      A Transolver-based neural operator predicts displacement fields across varying hole shapes, boundary displacement functions, materials, and positions, and is evaluated against FEniCSx reference solutions.
    </figcaption>
  </figure>
</div>

Current direction:

I am continuing to improve the full pipeline, including dataset generation, operator training, evaluation, and presentation. A major focus is making the whole workflow both mechanically faithful and easy to generalize to richer domain decompositions and future coupled simulations.

Profile Summary
======

I work at the intersection of mechanics, numerical simulation, and machine learning. My current interests include operator learning for PDE-governed systems, data generation pipelines based on finite element simulations, and robust surrogate models for scientific applications.

Skills
======

<div class="cv-skill-table">
  <div class="cv-skill-row">
    <div class="cv-skill-label">Programming</div>
    <div class="cv-skill-value">Python, MATLAB, Linux</div>
  </div>
  <div class="cv-skill-row">
    <div class="cv-skill-label">Deep Learning</div>
    <div class="cv-skill-value">JAX, PyTorch, Neural Operators, Transolver</div>
  </div>
  <div class="cv-skill-row">
    <div class="cv-skill-label">Scientific Computing</div>
    <div class="cv-skill-value">FEniCSx, Gmsh, Finite Element Methods, Computational Mechanics</div>
  </div>
  <div class="cv-skill-row">
    <div class="cv-skill-label">Visualization</div>
    <div class="cv-skill-value">Matplotlib, Scientific Visualization, Field Visualization</div>
  </div>
  <div class="cv-skill-row">
    <div class="cv-skill-label">Languages</div>
    <div class="cv-skill-value">Chinese, English</div>
  </div>
</div>

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
