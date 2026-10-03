---
layout: archive
title: "CV"
permalink: /cv/
author_profile: false
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
- Jan. 2026 - Oct. 2026
- Research focus: GPU-accelerated FEM and hybrid FEM–neural operator coupling

Research Interests
======

- Computational mechanics
- Finite element methods
- Scientific machine learning
- Neural operators and surrogate modeling

Current Research
======

- GPU-accelerated finite element methods for computational mechanics
- Neural operator learning of mappings from interface displacement fields to subdomain stress fields
- Stress-based assembly of interface reaction forces
- Iterative coupling of finite element solvers and neural operators

Research Experience
======

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="fem-neural-operator">1. GPU-Accelerated Hybrid FEM–Neural Operator Coupling Framework</div>
    <div class="cv-project__term">Jan. 2026 - Present</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Lead Undergraduate Researcher; Advisor: <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a></em></span>
    <span><em>Johns Hopkins University</em></span>
  </div>
</div>

- **Hybrid FEM–NO Framework:** Developed a hybrid framework combining an outer finite element domain with a local neural-operator subdomain connected through a shared interface.
- **GPU-Accelerated Training Data:** Used JAX-FEM to generate displacement and stress fields for training the local neural operator.
- **Displacement-to-Stress Operator Learning:** Trained Transolver models to learn the operator mapping from prescribed interface displacement fields to local stress fields.
- **Stress-Based Interface Coupling:** Assembled interface reaction forces from the predicted stresses and returned them to the outer FEM solver, which updated the interface displacements for the next coupling iteration.

**Ongoing 3D Composite Extension:** We are extending the framework to a three-dimensional composite containing 100 fibers. Our goal is to train **a single shared neural operator for all 100 fibers**, using the same model parameters to map each fiber's interface displacement field to its 3D stress field. Stress-derived interface reactions would couple the fibers to the surrounding FEM matrix through iterative displacement–force exchange. Key questions include generalization across fibers and the influence of fiber-end effects on stress prediction and interface-force transfer.

<div class="research-gallery research-gallery--prototype">
  <figure class="research-card">
    <a href="/files/research/cylinder_subdomain_supports_1234.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_subdomain_supports_1234.png" alt="Cylinder model showing the gray outer FEM domain, green inner neural-operator subdomain, blue coupling interface, and supports along the straight edges." />
    </a>
    <figcaption>
      <strong>Cylinder Subdomain Position</strong><br>
      The local neural-operator subdomain (green) connects to the outer FEM domain (gray) through the coupling interface (blue).
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
    <a href="/files/research/cylinder_boundary_conditions.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_boundary_conditions.png" alt="Neural-operator cylinder subdomain with prescribed displacement functions on the inner and outer arcs, zero horizontal displacement on the left edge, and zero vertical displacement on the bottom edge." />
    </a>
    <figcaption>
      <strong>Boundary Displacement Conditions</strong><br>
      Prescribed displacement functions on the inner and outer arcs define the local subdomain boundary conditions, together with straight-edge constraints.
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
      <img src="/images/research/sweep_001_sigma_xx_continuous.png" alt="Continuous sigma xx stress-field ground truth, prediction, and absolute error at coupling sweep 001; relative L^2 error 0.6262 percent." />
    </a>
    <figcaption>
      <strong>Continuous Stress-Field Evaluation</strong><br>
      Ground truth, prediction, and absolute error for &sigma;<sub>xx</sub> at coupling sweep 001, with a relative L<sup>2</sup> error of 0.6262% for this field comparison.
    </figcaption>
  </figure>

  <figure class="research-card" id="cylinder-coupling-results">
    <a href="/files/research/cylinder_coupled_stress_comparison.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_coupled_stress_comparison.png" alt="Cylinder coupling results in nine panels: rows show sigma xx, sigma yy, and tau xy in MPa; columns compare the monolithic FEM reference, coupled FEM-NO solution, and absolute error. Dashed arcs mark the coupling interface." />
    </a>
    <figcaption>
      <strong>Cylinder Coupling Results</strong><br>
      Monolithic FEM reference and coupled FEM–NO stress fields (&sigma;<sub>xx</sub>, &sigma;<sub>yy</sub>, &tau;<sub>xy</sub>), with corresponding absolute-error maps.
    </figcaption>
  </figure>
</div>

<div class="research-gallery research-gallery--single research-gallery--composite">
  <figure class="research-card" id="fiber-composite">
    <a href="/files/research/composite_n100_mesh_overview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/composite_n100_mesh_overview.png" alt="Bottom cross-section of a three-dimensional finite element mesh for a 100-fiber reinforced composite, with a local fiber–matrix close-up. This is a cross-sectional view of a 3D model, not a 2D simulation or a prediction result." />
    </a>
    <figcaption>
      <strong>3D Fiber Composites (Ongoing)</strong><br>
      Our goal is to use one shared neural operator for all 100 fibers, with FEM handling the surrounding matrix.
    </figcaption>
  </figure>
</div>

<div class="cv-project cv-project--battery">
  <div class="cv-project__header">
    <div class="cv-project__title" id="convlstm-battery">2. ConvLSTM Modeling of Chemo-Mechanical Fields in Battery Materials</div>
    <div class="cv-project__term">Jun. 2025 - Oct. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Automated Simulation Workflow:** Generated polycrystalline NMC microstructures and ran coupled lithium-transport and solid-mechanics simulations through COMSOL LiveLink for MATLAB, exporting time-aligned concentration and von Mises stress images.
- **Conditional ConvLSTM Models:** Trained separate three-layer ConvLSTM models to autoregressively predict RGB images of concentration or stress, conditioned on past field frames, grain-orientation maps, and C-rate inputs.
- **Multi-Step Training:** Combined MSE and SSIM losses on 128×128 patches extracted from 512×512 RGB images, with scheduled sampling for multi-step autoregressive prediction.
- **Prediction Assessment:** Compared predicted sequences with COMSOL-rendered reference images using MSE, SSIM, and pixel-wise error maps to assess image agreement over successive forecast steps.

<div class="research-gallery research-gallery--three">
  <figure class="research-card">
    <a href="/images/research/battery_concentration.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_concentration.gif" alt="Animated concentration evolution from the COMSOL-based dataset." />
    </a>
    <figcaption>
      <strong>Lithium Concentration Evolution</strong><br>
      Time-resolved lithium-concentration images exported from COMSOL simulations.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_von_mises.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_von_mises.gif" alt="Animated von Mises stress evolution under the same microstructure and loading condition." />
    </a>
    <figcaption>
      <strong>von Mises Stress Evolution</strong><br>
      Time-dependent von Mises stress response under the same microstructure and loading condition.
    </figcaption>
  </figure>

  <figure class="research-card research-card--grain-orientation">
    <a href="/images/research/battery_orientation_input.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_orientation_input.png" alt="Grain orientations relative to the global x-axis, folded into 0 to 90 degrees and encoded from violet to pink. Each orientation beta is the local radial angle alpha plus the deviation theta from the radial direction." />
    </a>
    <figcaption>
      <strong>Grain Orientation Map</strong><br>
      Colors represent each grain’s orientation relative to the global x-axis, folded into the range 0°–90°.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_pipeline.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_convlstm_pipeline.png" alt="ConvLSTM prediction pipeline with concentration, grain orientation, and C-rate inputs." />
    </a>
    <figcaption>
      <strong>ConvLSTM Prediction Pipeline</strong><br>
      Past field images, grain-orientation maps, and C-rate inputs condition autoregressive prediction. Separate models forecast concentration or stress images.
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
      During training, scheduled sampling selects ground-truth or predicted frames as inputs to subsequent prediction steps.
    </figcaption>
  </figure>

</div>

<div class="research-gallery research-gallery--single research-gallery--composite">
  <figure class="research-card" id="battery-prediction-summary">
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
    <div class="cv-project__title" id="burgers-pinn">3. PINNs for Shock Capturing in the Burgers Equation</div>
    <div class="cv-project__term">Nov. 2025 - Mar. 2026</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xianyang (Tom) Chen</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Burgers Shock Problem:** Studied a one-dimensional Riemann problem with discontinuous initial data, using the analytical inviscid solution as a reference for the evolving shock profile and trajectory.
- **Standard PINN:** Implemented a PyTorch network mapping spatial and temporal coordinates to the solution, trained with PDE-residual, initial-condition, and boundary-condition losses.
- **Constant Artificial Viscosity:** Added a constant diffusion term to the PDE residual and used automatic differentiation to compute the second spatial derivative for the regularized formulation.
- **Shock-Profile Analysis:** Compared standard and regularized PINN profiles with the analytical inviscid reference, using profile plots and local views to examine shock smearing and deviations near the discontinuity.

<div class="research-gallery research-gallery--pinn">
  <figure class="research-card research-card--pinn-overview" id="pinn-framework">
    <a href="/images/research/pinn_shock_problem_framework_v4.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/pinn_shock_problem_framework_v4.png" alt="Schematic of the inviscid Burgers Riemann problem and PINN framework: coordinate inputs x and t feed a neural network, automatic differentiation forms the PDE residual, and separate paths lead to the initial-condition and boundary-condition losses. All three losses are written as full sums. The analytical shock travels at speed 0.5." />
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
      Exact entropy solution with u<sub>L</sub> = 1, u<sub>R</sub> = 0 and shock speed 0.5. Analytical reference, not a PINN prediction.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_trajectory.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_trajectory.gif" alt="Animation of the analytical Burgers shock trajectory x_s(t) = 0.5t in the space-time plane." />
    </a>
    <figcaption>
      <strong>Burgers Shock Trajectory</strong><br>
      Exact shock path x<sub>s</sub>(t) = 0.5t in the space-time plane. Analytical reference, not a learned trajectory.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_standard_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_standard_pinn_prediction.gif" alt="Animation comparing the standard PINN prediction with the exact solution of the inviscid Burgers equation." />
    </a>
    <figcaption>
      <strong>Standard PINN Prediction</strong><br>
      Standard PINN profiles compared with the analytical inviscid shock solution, showing the predicted transition around the moving discontinuity.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" alt="Animation comparing a constant-artificial-viscosity PINN profile with the analytical inviscid Burgers shock reference." />
    </a>
    <figcaption>
      <strong>Constant-Viscosity PINN Prediction</strong><br>
      PINN profiles with constant artificial viscosity, compared with the analytical inviscid shock solution as a common reference.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="mechanics-llm">4. Domain-Specific LLM Fine-Tuning for Mechanics of Materials</div>
    <div class="cv-project__term">Sep. 2024 - Apr. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher; Advisor: <a href="http://www.yingzhaotj.cn/col.jsp?id=106" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Mechanics Question Answering:** Adapted Qwen2.5-7B to answer questions and explain concepts in mechanics of materials.
- **Instruction Dataset Curation:** Curated instruction-response examples from textbooks and technical literature covering stress analysis, constitutive laws, and failure theories.
- **Parameter-Efficient Fine-Tuning:** Applied LoRA fine-tuning on Google Colab to adapt the base model to mechanics questions and explanatory responses.
- **Public Releases:** Published the [Material-mechanics](https://huggingface.co/datasets/CYHcyh66/Material-mechanics) and [Material-mechanics-merge](https://huggingface.co/datasets/CYHcyh66/Material-mechanics-merge) datasets, together with the [fine-tuned checkpoint](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant) and [merged model](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged), on Hugging Face.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/llm_finetuning_workflow_v2.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/llm_finetuning_workflow_v2.png" alt="Workflow diagram showing self-built mechanics dataset construction, Hugging Face dataset publication, Qwen2.5 7B LoRA fine-tuning on Google Colab, fine-tuned model publication, and the final AI teaching assistant." />
    </a>
    <figcaption>
      <strong>LLM Fine-Tuning Workflow</strong><br>
      Instruction dataset curation, Qwen2.5-7B fine-tuning with LoRA, and public release of datasets and model checkpoints for question answering in mechanics of materials.
    </figcaption>
  </figure>
</div>

Skills
======

- **Scientific Machine Learning:** PyTorch, JAX, Neural Operators (Transolver, DeepONet), PINNs, ConvLSTM
- **Computational Mechanics:** Finite Element Methods, FEniCSx, Gmsh, COMSOL Multiphysics, ABAQUS
- **Scientific Computing & Tools:** Python, MATLAB, Linux, Git/GitHub, LiveLink for MATLAB
- **LLM Fine-Tuning:** Qwen2.5, LoRA/PEFT, Instruction Dataset Curation
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

