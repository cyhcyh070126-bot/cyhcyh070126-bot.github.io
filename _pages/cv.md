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

<div class="cv-school">Tongji University, Shanghai, China</div>

- Bachelor of Engineering in Engineering Mechanics, School of Aerospace Engineering and Applied Mechanics
- Sep. 2023 - Present (Expected Jun. 2027)
- GPA: 87/100

<div class="cv-school">Johns Hopkins University, Baltimore, MD, USA</div>

- Visiting Undergraduate Research Intern, Department of Civil and Systems Engineering
- Jul. 2026 - Oct. 2026
- Research focus: Transolver framework and physics-informed neural operators for PDEs

Research Interests
======

- Computational mechanics
- Finite element methods
- Scientific machine learning
- Neural operators and surrogate modeling

Current Research
======

- Data-driven operators for mechanics problems
- FEM-consistent data generation and supervision
- Surrogate models for displacement and stress prediction
- Reproducible scientific computing workflows

<div id="research-experience"></div>

Research Experience
======

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">1. FEniCSx-Supervised Local Operator Learning for Single-Hole Domains</div>
    <div class="cv-project__term">Jan. 2026 - Present</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Lead Undergraduate Researcher; Advisor: <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a></em></span>
    <span><em>Johns Hopkins University</em></span>
  </div>
</div>

- **Operator Learning Objective:** Developed a Transolver-based local neural operator for predicting nodal displacement fields under varying hole geometries, boundary conditions, material parameters, and hole locations.
- **FEniCSx Supervision Pipeline:** Constructed a FEM-consistent data factory that generates GRF/circle/square hole geometries, assigns boundary-function libraries, and produces displacement-field ground truth with FEniCSx.
- **FEM-Node Point Cloud Representation:** Used actual Gmsh/FEM nodes rather than uniformly sampled points so that the learning representation remains aligned with the finite-element discretization.
- **FEM-Consistent Post-Processing:** Preserved displacement-based FEM consistency so that strain and stress fields can be recovered efficiently through downstream finite-element post-processing.

<div class="research-gallery">
  <figure class="research-card research-card--grf">
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
    <div class="cv-project__title">2. ConvLSTM Modeling of Chemo-Mechanical Fields and Damage in Battery Materials</div>
    <div class="cv-project__term">Sep. 2025 - Dec. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Synthetic Data Generation:** Developed a MATLAB-COMSOL LiveLink workflow for statistically distributed polycrystalline NMC microstructures and electro-chemo-mechanical simulation sequences of lithium concentration and von Mises stress.
- **Conditional ConvLSTM Surrogate:** Implemented a three-layer ConvLSTM model, conditioning autoregressive predictions of two-dimensional concentration and stress fields on grain orientation and C-rate information.
- **Training Pipeline:** Combined MSE-SSIM hybrid loss, scheduled sampling, and patch-based training to improve structural fidelity and reduce long-horizon error accumulation.
- **Damage Evolution:** Evaluated predictions against finite-element reference sequences and used microcrack-density post-processing to infer damage evolution from predicted stress fields.

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
    <div class="cv-project__term">Dec. 2024 - Jun. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Project Objective:** Developed a domain-specific AI teaching assistant for Mechanics of Materials based on the Qwen 2.5 7B foundation model.
- **Instruction Dataset Curation:** Built and published two Mechanics-of-Materials instruction datasets on Hugging Face: [Material-mechanics](https://huggingface.co/datasets/CYHcyh66/Material-mechanics) and [Material-mechanics-merge](https://huggingface.co/datasets/CYHcyh66/Material-mechanics-merge).
- **LoRA Fine-Tuning:** Published the [LoRA-adapted checkpoint](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant) and [merged model](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged) after domain adaptation on Google Colab.
- **Model Improvement:** Improved formula rendering, explanation structure, and domain-specific response quality for Mechanics-of-Materials learning scenarios.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/llm_finetuning_workflow_v2.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/llm_finetuning_workflow_v2.png" alt="Workflow diagram showing self-built mechanics dataset construction, Hugging Face dataset publication, Qwen2.5 7B LoRA fine-tuning on Google Colab, fine-tuned model publication, and the final AI teaching assistant." />
    </a>
    <figcaption>
      <strong>LLM Fine-Tuning Workflow</strong><br>
      A domain-specific workflow from custom Mechanics-of-Materials dataset curation and Hugging Face publication to Qwen2.5 7B LoRA fine-tuning on Google Colab and the final AI teaching assistant.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">4. Physics-Informed Neural Networks for Shock Capturing in Nonlinear Conservation Laws</div>
    <div class="cv-project__term">Jan. 2026 - Mar. 2026</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xianyang (Tom) Chen</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Problem Setting:** Developed PyTorch benchmarks for inviscid Burgers and Buckley-Leverett conservation laws, with shock-focused solution and local-error diagnostics.
- **Comparative PINN Study:** Implemented and compared Vanilla, Gradient-Weighted, Weak, XPINN, relaxation, and global/adaptive artificial-viscosity PINNs; enforced Rankine-Hugoniot interface conditions in the XPINN formulation.
- **Evaluation:** Assessed residual reweighting, viscosity regularization, weak constraints, and domain decomposition through training convergence, shock profiles, and local reconstruction errors.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/pinn_workflow_v2.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/pinn_workflow_v2.png" alt="Workflow diagram showing the shock problem, Vanilla PINN smearing, PINN architecture, stabilization strategies, and sharper shock reconstruction." />
    </a>
    <figcaption>
      <strong>PINN Shock-Capturing Workflow</strong><br>
      A method-oriented overview from shock-dominated conservation-law problems and Vanilla PINN smearing to PINN architectures, stabilization strategies, and sharper local shock reconstruction.
    </figcaption>
  </figure>
</div>

Profile Summary
======

I work at the intersection of mechanics, numerical simulation, and machine learning. My current interests include operator learning for PDE-governed systems, data generation pipelines based on finite element simulations, and robust surrogate models for scientific applications.

Skills
======

- **Programming:** Python, MATLAB, Linux, Git
- **Machine Learning Frameworks:** JAX, PyTorch
- **Scientific Machine Learning:** Neural Operators, DeepONet, Transolver, PINNs, CNN, ConvLSTM
- **Computational Mechanics:** Finite Element Methods, FEniCSx, Gmsh, COMSOL, MATLAB, ABAQUS
- **Large Language Model:** LoRA Fine-Tuning, Dataset Curation
- **Visualization:** Matplotlib, Origin
- **Languages:** Chinese, English, Cantonese

Contact
======

- Email: [2350083@tongji.edu.cn](mailto:2350083@tongji.edu.cn)
- Website: [cyhcyh070126-bot.github.io](https://cyhcyh070126-bot.github.io)
- GitHub: [cyhcyh070126-bot](https://github.com/cyhcyh070126-bot)
- Hugging Face: [CYHcyh66](https://huggingface.co/CYHcyh66)

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

