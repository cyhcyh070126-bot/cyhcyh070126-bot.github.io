---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
cv_page: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======

<div class="cv-school">
  <img class="cv-school__seal" src="{{ '/images/schools/tongji-university-seal.png' | relative_url }}" alt="Tongji University seal">
  <span>Tongji University, Shanghai, China</span>
</div>

- Bachelor of Engineering in Engineering Mechanics, School of Aerospace Engineering and Applied Mechanics
- Sep. 2023 - Present (Expected Jun. 2027)
- GPA: 87/100

<div class="cv-school">
  <img class="cv-school__seal" src="{{ '/images/schools/johns-hopkins-university-shield.svg' | relative_url }}" alt="Johns Hopkins University shield">
  <span>Johns Hopkins University, Baltimore, MD, USA</span>
</div>

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

- GPU-accelerated JAX-FEM data generation for mechanics
- Physics-Attention Transolver subdomain operators
- Boundary-to-field learning for multi-subdomain problems
- FEM-consistent displacement, strain, and interface-reaction supervision

Research Experience
======

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">1. GPU-Accelerated Neural Operator Framework for Multi-Subdomain Mechanics</div>
    <div class="cv-project__term">Jan. 2026 - Present</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Lead Undergraduate Researcher; Advisor: <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a></em></span>
    <span><em>Johns Hopkins University</em></span>
  </div>
</div>

- **Multi-Subdomain Framework:** Built a non-overlapping domain-decomposition framework for 2D cylinder, 3D bracket, and multi-fiber mechanics, integrating GPU-accelerated JAX-FEM simulations with Physics-Attention Transolver training.
- **FEM Data and Interface Representation:** Generated displacement, strain, and interface-reaction fields with JAX-FEM and organized boundary and interface conditions as inputs for subdomain operator learning.
- **Boundary-to-Field Operator Learning:** Trained local neural operators to infer full displacement fields from interface conditions while retaining the reaction information required for coupling with surrounding FEM domains.
- **FEM-Consistent Coupling:** Combined displacement, strain, and interface-reaction supervision to support full-field recovery and neural-operator/FEM coupling across multiple subdomains.

**Cylinder Subdomain Example:** Boundary conditions, domain decomposition, FEM-node representation, and a continuous stress-field comparison illustrate the neural-operator/FEM workflow.

<div class="research-gallery research-gallery--prototype">
  <figure class="research-card">
    <a href="/files/research/boundary_displacement_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/boundary_displacement_preview.png" alt="Quarter-annulus cylinder subdomain with prescribed inner and outer arc displacements and straight-edge constraints." />
    </a>
    <figcaption>
      <strong>Boundary Displacement Conditions</strong><br>
      Prescribed displacement functions on the inner and outer arcs define the cylinder subdomain boundary conditions, together with straight-edge constraints.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/domain_decomposition_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/domain_decomposition_preview.png" alt="Full cylinder-domain mesh, outer-domain mesh, and extracted quarter-annulus subdomain mesh." />
    </a>
    <figcaption>
      <strong>Domain Decomposition</strong><br>
      The full finite element mesh is partitioned into an outer domain and a local subdomain with an identified coupling interface.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/subdomain_point_cloud_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/subdomain_point_cloud_preview.png" alt="Subdomain location, finite element mesh, and point cloud with blue interior nodes and red boundary nodes." />
    </a>
    <figcaption>
      <strong>Subdomain Point Cloud</strong><br>
      The point cloud is built directly from 4,102 FEM nodes, with 3,847 interior nodes and 255 boundary nodes identified for operator learning.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/sweep_001_sigma_xx_continuous.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/sweep_001_sigma_xx_continuous.png" alt="Continuous sigma xx stress-field ground truth, prediction, and absolute error at coupling sweep 001; relative L2 error 0.6262 percent." />
    </a>
    <figcaption>
      <strong>Continuous Stress-Field Evaluation</strong><br>
      Ground truth, prediction, and absolute error for &sigma;<sub>xx</sub> at coupling sweep 001, with a relative L<sub>2</sub> error of 0.6262% for this field comparison.
    </figcaption>
  </figure>
</div>

<div class="cv-project cv-project--battery">
  <div class="cv-project__header">
    <div class="cv-project__title">2. ConvLSTM Modeling of Chemo-Mechanical Fields in Battery Materials</div>
    <div class="cv-project__term">Jun. 2025 - Oct. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Simulation Data Generation:** Automated statistically distributed polycrystalline NMC microstructure generation and electro-chemo-mechanical simulation through MATLAB-COMSOL LiveLink, producing aligned lithium-concentration and von Mises stress sequences.
- **Conditional ConvLSTM Surrogate:** Trained a three-layer ConvLSTM that conditions autoregressive two-dimensional concentration- and stress-field predictions on grain-orientation and C-rate information.
- **Long-Horizon Training:** Combined an MSE-SSIM hybrid loss, scheduled sampling, and patch-based training to preserve spatial structure and limit error accumulation over multi-step rollouts.
- **Field Prediction Evaluation:** Compared predicted concentration and stress sequences with COMSOL reference fields through frame-wise visualizations and spatial error maps.

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
    <div class="cv-project__title">3. PINNs for Shock Capturing in Nonlinear Conservation Laws</div>
    <div class="cv-project__term">Nov. 2025 - Mar. 2026</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xianyang (Tom) Chen</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Problem Formulation:** Created PyTorch benchmarks for inviscid Burgers and Buckley-Leverett equations, with reference solutions and diagnostics focused on discontinuities and local shock errors.
- **Comparative PINN Study:** Implemented and compared Vanilla, gradient-weighted, weak-form, XPINN, relaxation, and global/adaptive artificial-viscosity PINNs.
- **Shock-Stabilization Strategies:** Examined residual reweighting, viscosity regularization, weak constraints, and domain decomposition, including Rankine-Hugoniot interface conditions in the XPINN formulation.
- **Evaluation and Diagnostics:** Assessed each method through convergence histories, field profiles, and local reconstruction errors to distinguish global accuracy from shock-region performance.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/pinn_shock_problem_framework.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/pinn_shock_problem_framework.png" alt="Schematic of the Burgers Riemann problem and PINN framework, including coordinate inputs, automatic differentiation, and PDE, initial-condition, and boundary-condition losses." />
    </a>
    <figcaption>
      <strong>Shock Problem and PINN Framework</strong><br>
      A schematic overview of the Burgers Riemann problem and PINN training with PDE, initial-condition, and boundary-condition losses.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_motion.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_motion.gif" alt="Animation of the exact entropy solution of the inviscid Burgers equation, with left state 1, right state 0, and shock position x_s(t) = t/2." />
    </a>
    <figcaption>
      <strong>Burgers Shock Motion</strong><br>
      The exact entropy solution propagates at shock speed 0.5 for left and right states of 1 and 0. This animation illustrates the analytical reference solution, not a PINN prediction.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_trajectory.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_trajectory.gif" alt="Animation of the analytical Burgers shock trajectory x_s(t) = 0.5t in the space-time plane." />
    </a>
    <figcaption>
      <strong>Burgers Shock Trajectory</strong><br>
      The shock follows the exact path x<sub>s</sub>(t) = 0.5t in the space-time plane. This animation shows the analytical trajectory, not a learned shock location.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title">4. Domain-Specific LLM Fine-Tuning for Materials Mechanics</div>
    <div class="cv-project__term">Sep. 2024 - Apr. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Project Objective:** Adapted the Qwen2.5-7B foundation model for materials-mechanics question answering and structured explanations of engineering concepts.
- **Instruction Dataset Curation:** Curated and published two instruction datasets covering stress analysis, constitutive laws, and failure theories: [Material-mechanics](https://huggingface.co/datasets/CYHcyh66/Material-mechanics) and [Material-mechanics-merge](https://huggingface.co/datasets/CYHcyh66/Material-mechanics-merge).
- **Parameter-Efficient Fine-Tuning:** Applied LoRA-based fine-tuning on Google Colab to specialize Qwen2.5-7B while retaining a compact adaptation workflow.
- **Open-Source Publication:** Released both the [LoRA-adapted checkpoint](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant) and the [merged model](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged) on Hugging Face.

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

Skills
======

- **Scientific Machine Learning:** PyTorch, JAX, Neural Operators (Transolver, DeepONet), PINNs, ConvLSTM
- **Computational Mechanics:** Finite Element Methods, FEniCSx, Gmsh, COMSOL Multiphysics, ABAQUS
- **Scientific Computing & Tools:** Python, MATLAB, Linux, Git/GitHub, MATLAB LiveLink
- **Domain LLM Development:** Qwen2.5, LoRA/PEFT Fine-Tuning, Instruction Dataset Curation
- **Visualization:** Matplotlib, Origin
- **Languages:** Chinese (native), Cantonese, English

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

