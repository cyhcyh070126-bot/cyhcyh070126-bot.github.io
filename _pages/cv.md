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

Tongji University, Shanghai, China

- Bachelor of Engineering in Engineering Mechanics, School of Aerospace Engineering and Applied Mechanics
- Sept 2023 - Present (Expected Jun 30, 2027)
- GPA: 86/100 (3.3/4.0)

Johns Hopkins University, Baltimore, MD, USA

- Incoming Visiting Undergraduate Scholar, Department of Civil and Systems Engineering
- July 2026 - September 2026
- Research focus: Transolver framework and physics-informed neural operators for PDEs

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
    <div class="cv-project__title">1. FEniCSx-Supervised Local Operator Learning for Single-Hole Domains</div>
    <div class="cv-project__term">Current</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Research Project</em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Operator Learning Objective:** Training a Transolver-based neural operator to predict full nodal displacement fields under varying internal-hole shapes, boundary displacement functions, material parameters, and hole positions on the plate.
- **Dataset and Supervision Pipeline:** Building a mechanics data factory that generates GRF/circle/square hole geometries, assigns boundary-function libraries, and uses FEniCSx to produce displacement-field ground truth for supervised learning.
- **FEM-Node Point Cloud Representation:** Using the actual FEM nodes extracted from the Gmsh mesh as point-cloud inputs instead of uniformly sampled points, which keeps the learning representation aligned with the finite element discretization.
- **Mechanics-Oriented Efficiency:** Preserving FEM consistency so that once displacement is predicted, later FEM-style post-processing can still be applied efficiently for strain and stress recovery rather than learning every derived quantity separately.

<div class="research-gallery">
  <figure class="research-card">
    <a href="/files/research/grf_hole_extraction_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/grf_hole_extraction_preview.png" alt="Preview of GRF-based hole extraction and placement." />
    </a>
    <figcaption>
      <strong>GRF Hole Generation</strong><br>
      A GRF field is windowed, thresholded, and converted into a smooth internal hole before placement on the plate.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/plate_partition_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/plate_partition_preview.png" alt="Preview of plate partition and subdomain finite element mesh." />
    </a>
    <figcaption>
      <strong>FEM-Consistent Meshing</strong><br>
      The local subdomain is extracted from the whole plate mesh while preserving a mechanics-consistent finite element discretization.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/plate_mesh_point_cloud_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/plate_mesh_point_cloud_preview.png" alt="Preview showing the FE mesh and the Transolver input point cloud extracted from FEM nodes." />
    </a>
    <figcaption>
      <strong>FEM Node Point Cloud</strong><br>
      The Transolver input point cloud is built directly from FEM mesh nodes, which keeps learning and later FEM-based post-processing tightly aligned.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/prediction.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/prediction_preview.png" alt="Prediction comparison between ground truth, prediction, and error fields." />
    </a>
    <figcaption>
      <strong>Transolver Operator Prediction</strong><br>
      A Transolver-based neural operator predicts displacement fields across varying hole shapes, boundary displacement functions, materials, and positions, and is evaluated against FEniCSx reference solutions.
    </figcaption>
  </figure>
</div>

<div class="cv-project cv-project--battery">
  <div class="cv-project__header">
    <div class="cv-project__title">2. Deep-Learning-Based Prediction of Chemo-Mechanical Evolution in Battery Active Materials</div>
    <div class="cv-project__term">Sep 2025 - Mar 2026</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Research Project, ADVISED BY Ying Zhao</em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Dataset Generation Pipeline:** Built an end-to-end MATLAB and COMSOL workflow to generate randomized polycrystalline battery-particle microstructures together with transient concentration and stress field sequences.
- **ConvLSTM Surrogate Modeling:** Reproduced and extended a ConvLSTM-based surrogate model that uses concentration history, grain-orientation information, and C-rate conditions as multi-channel inputs.
- **Training Strategy:** Trained the model with MSE and SSIM losses and adopted a scheduled sampling strategy to improve multi-step autoregressive rollout stability.
- **Evaluation and Visualization:** Evaluated prediction quality on unseen samples through concentration/stress animations and frame-by-frame summary visualizations.

<div class="research-gallery research-gallery--three">
  <figure class="research-card">
    <a href="/images/research/battery_concentration.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_concentration.gif" alt="Animated concentration evolution from the COMSOL-based dataset." />
    </a>
    <figcaption>
      <strong>Concentration GIF</strong><br>
      Transient concentration evolution generated from the COMSOL-based dataset.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_von_mises.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_von_mises.gif" alt="Animated von Mises stress evolution under the same microstructure and loading condition." />
    </a>
    <figcaption>
      <strong>Von&nbsp;Mises&nbsp;Stress&nbsp;GIF</strong><br>
      Time-dependent von Mises stress response under the same microstructure and loading condition.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_pipeline.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_convlstm_pipeline.png" alt="ConvLSTM prediction pipeline with concentration, grain orientation, and C-rate inputs." />
    </a>
    <figcaption>
      <strong>ConvLSTM Prediction Pipeline</strong><br>
      Multi-channel inputs are stacked and processed by a ConvLSTM network for future field prediction.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_cell_clean.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_convlstm_cell_clean.png" alt="Internal structure of the ConvLSTM cell used in the model." />
    </a>
    <figcaption>
      <strong>ConvLSTM Cell Design</strong><br>
      The internal gating structure of the ConvLSTM cell used for spatiotemporal feature propagation.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_scheduled_sampling.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_scheduled_sampling.png" alt="Scheduled sampling strategy for autoregressive sequence training." />
    </a>
    <figcaption>
      <strong>Scheduled Sampling</strong><br>
      A scheduled sampling strategy is used during training to reduce error accumulation in autoregressive prediction.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_prediction_summary.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_prediction_summary.png" alt="Prediction summary comparing ground truth, model prediction, and error heatmaps across multiple frames." />
    </a>
    <figcaption>
      <strong>Prediction Summary</strong><br>
      Representative rollout results comparing ground truth, model prediction, and error heatmaps over multiple future frames.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">3. LLM Fine-Tuning for a Mechanics-of-Materials AI Teaching Assistant</div>
    <div class="cv-project__term">Current</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Research Project</em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Project Objective:** Developed a domain-specific AI teaching assistant for Mechanics of Materials based on the Qwen 2.5 7B foundation model.
- **Instruction Dataset Curation:** Built a custom Mechanics-of-Materials instruction dataset covering concept explanations, formula-based questions, and worked examples, and published the dataset on [Hugging Face](https://huggingface.co/CYHcyh66).
- **LoRA Fine-Tuning Workflow:** Performed LoRA-based fine-tuning of Qwen 2.5 7B on Google Colab using a lightweight supervised adaptation pipeline for domain-specific educational question answering.
- **Model Improvement and Evaluation:** Improved the model's ability to generate clearer formula notation, more structured explanations, and more discipline-specific answers for Mechanics-of-Materials learning scenarios.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/llm_finetuning_workflow.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/llm_finetuning_workflow.png" alt="Workflow diagram showing mechanics dataset construction, Hugging Face publication, Qwen2.5 7B LoRA fine-tuning on Google Colab, and the final AI teaching assistant." />
    </a>
    <figcaption>
      <strong>LLM Fine-Tuning Workflow</strong><br>
      A domain-specific workflow from custom Mechanics-of-Materials dataset curation and Hugging Face publication to Qwen2.5 7B LoRA fine-tuning on Google Colab and the final AI teaching assistant.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">4. PINN Methods for Shock-Dominated Conservation Laws</div>
    <div class="cv-project__term">Previous</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Research Project</em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Project Objective:** Investigated physics-informed neural network methods for one-dimensional shock-dominated conservation laws, with experiments on Burgers and Buckley-Leverett-type transport problems.
- **Baseline and Comparative Study:** Implemented and compared multiple PINN variants, including Vanilla PINN, Gradient-Weighted PINN, Weak PINN, XPINNs, and relaxation-based PINN formulations.
- **Shock-Stabilization Strategies:** Explored residual-based weighting, global and adaptive artificial viscosity, domain decomposition, weak-form constraints, and relaxation systems to reduce solution smearing near discontinuities.
- **Evaluation and Visualization:** Analyzed training convergence and shock-profile reconstruction through solution plots, zoomed shock-region comparisons, and method-by-method visual diagnostics.

Profile Summary
======

I work at the intersection of mechanics, numerical simulation, and machine learning. My current interests include operator learning for PDE-governed systems, data generation pipelines based on finite element simulations, and robust surrogate models for scientific applications.

Skills
======

- **Programming:** Python, MATLAB, Linux
- **Machine Learning Frameworks:** JAX, PyTorch, Hugging Face
- **Deep Learning:** Neural Networks, ConvLSTM, Sequence Modeling
- **Large Language Models:** Instruction Dataset Curation, LoRA Fine-Tuning, Instruction Tuning, Google Colab
- **Computational Mechanics:** Finite Element Methods, Computational Mechanics
- **Scientific Computing Tools:** FEniCSx, Gmsh, COMSOL Multiphysics, MATLAB LiveLink, ABAQUS
- **Scientific Machine Learning:** Neural Operators, Operator Learning, PINNs, DeepONet
- **Visualization:** Matplotlib, Origin, RStudio
- **Languages:** Chinese, English

Contact
======

- Email: [2350083@tongji.edu.cn](mailto:2350083@tongji.edu.cn)
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
