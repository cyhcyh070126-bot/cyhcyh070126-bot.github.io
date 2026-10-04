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

<p><a href="{{ '/files/Yanghao_Chen_CV.pdf' | relative_url }}" target="_blank" rel="noopener noreferrer">View CV (PDF)</a> <span class="cv-links__separator">|</span> <a href="{{ '/projects/' | relative_url }}">Project repositories</a></p>

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
- Scientific machine learning
- Neural operators and surrogate modeling
- GPU-accelerated scientific computing

Current Research
======

- Hybrid FEM–neural operator solvers based on non-overlapping domain decomposition
- Neural operator learning for subdomain stress prediction
- Iterative exchange of interface forces and displacements
- Shared neural operators for 3D fiber-reinforced composites

<h1 id="research-projects"><span id="research-experience">Research Projects</span></h1>

<nav class="cv-project-nav" aria-label="Jump to a research project">
  {% for project in site.data.projects %}
  <a href="#{{ project.id }}">{{ project.short_title }}</a>
  {% endfor %}
</nav>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="fem-neural-operator">1. GPU-Accelerated Hybrid FEM–Neural Operator Solver</div>
    <div class="cv-project__term">Jan. 2026 - Present</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Lead Undergraduate Researcher <span class="cv-project__separator">|</span> Advisor: <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a></em></span>
    <span><em>Johns Hopkins University</em></span>
  </div>
</div>

- **Non-overlapping Domain Decomposition and Hybrid Solver:** Developed a hybrid FEM–neural operator solver based on non-overlapping domain decomposition, with FEM and neural-operator subdomains connected through a shared interface.
- **GPU-Accelerated Data Generation:** Sampled interface displacement fields using Gaussian random fields (GRFs) and used GPU-accelerated JAX-FEM simulations to generate displacement and stress data for neural-operator training.
- **Neural Operator Training:** Trained Transolver in JAX to learn mappings from interface displacement fields to stress fields within the neural-operator subdomain.
- **Iterative Interface Coupling:** Computed interface reaction forces from predicted stresses in the neural-operator subdomain and transferred them to the FEM solver. The FEM solver used these forces to compute updated interface displacements and returned them to the neural operator for the next coupling iteration.

**Ongoing 3D Composite Extension:** We are extending the hybrid solver to a 100-fiber composite with non-overlapping fiber and matrix subdomains. FEM solves the matrix subdomain, while a shared neural operator computes stress fields in all fiber subdomains, using component-specific weights shared across all fibers. The two solvers exchange interface forces and displacements iteratively. We apply periodic boundary conditions to eliminate fiber-end effects.

<div class="research-gallery research-gallery--prototype">
  <figure class="research-card">
    <a href="/files/research/cylinder_subdomain_supports_1234.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_subdomain_supports_1234.png" alt="Cylinder model showing the FEM subdomain in gray, neural-operator subdomain in green, shared interface in blue, and supports along the straight edges." />
    </a>
    <figcaption>
      <strong>Cylinder Subdomain Layout</strong><br>
      The FEM subdomain (gray) and neural-operator subdomain (green) are connected through a shared interface (blue).
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/domain_decomposition_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/domain_decomposition_preview.png" alt="Full cylinder-domain mesh and its non-overlapping FEM and neural-operator subdomain meshes." />
    </a>
    <figcaption>
      <strong>Non-overlapping Domain Decomposition</strong><br>
      The mesh is partitioned into non-overlapping FEM and neural-operator subdomains with a shared interface.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/cylinder_boundary_conditions.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_boundary_conditions.png" alt="Neural-operator cylinder subdomain with prescribed displacement functions on the inner and outer arcs, zero horizontal displacement on the left edge, and zero vertical displacement on the bottom edge." />
    </a>
    <figcaption>
      <strong>GRF-Sampled Boundary Displacements</strong><br>
      Sampled displacement fields on the inner and outer arcs using Gaussian random fields (GRFs). Set horizontal displacement to zero on the left edge and vertical displacement to zero on the bottom edge.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/subdomain_point_cloud_preview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/subdomain_point_cloud_preview.png" alt="Subdomain location, finite element mesh, and point cloud with blue interior nodes and red boundary nodes." />
    </a>
    <figcaption>
      <strong>Subdomain Mesh and Point Cloud</strong><br>
      Constructed the point cloud from 4,102 finite element nodes, including 3,847 interior nodes (blue) and 255 boundary nodes (red), for neural-operator training.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/sweep_001_sigma_xx_continuous.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/sweep_001_sigma_xx_continuous.png" alt="Predicted sigma xx stress field, FEM reference, and absolute error map; relative L2 error 0.6262 percent." />
    </a>
    <figcaption>
      <strong>&sigma;<sub>xx</sub> Stress Prediction and Error</strong><br>
      Compared the predicted &sigma;<sub>xx</sub> stress field with the FEM reference. The relative L<sup>2</sup> error is 0.6262%, and the absolute error map shows the spatial error distribution.
    </figcaption>
  </figure>

  <figure class="research-card" id="cylinder-coupling-results">
    <a href="/files/research/cylinder_coupled_stress_comparison.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/cylinder_coupled_stress_comparison.png" alt="Cylinder coupling results in nine panels: rows show sigma xx, sigma yy, and tau xy in MPa; columns compare the monolithic FEM reference, coupled FEM-NO solution, and absolute error. Dashed arcs mark the coupling interface." />
    </a>
    <figcaption>
      <strong>Coupled FEM–Neural Operator Results</strong><br>
      Compared the &sigma;<sub>xx</sub>, &sigma;<sub>yy</sub>, and &tau;<sub>xy</sub> components of the coupled FEM–neural operator solution with the full FEM reference and plotted the absolute error for each component.
    </figcaption>
  </figure>
</div>

<div class="research-gallery research-gallery--single research-gallery--composite">
  <figure class="research-card" id="fiber-composite">
    <a href="/files/research/composite_n100_mesh_overview.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/composite_n100_mesh_overview.png" alt="Bottom cross-section of a three-dimensional finite element mesh for a 100-fiber reinforced composite, with a local fiber–matrix close-up. This is a cross-sectional view of a 3D model, not a 2D simulation or a prediction result." />
    </a>
    <figcaption>
      <strong>3D Composite Mesh with 100 Fibers</strong><br>
      Cross-sectional view of the 3D composite mesh containing 100 fibers, with a close-up of the fiber–matrix interfaces.
    </figcaption>
  </figure>
</div>

<div class="cv-project cv-project--battery">
  <div class="cv-project__header">
    <div class="cv-project__title" id="convlstm-battery">2. ConvLSTM Prediction of Concentration and Stress Fields in Battery Materials</div>
    <div class="cv-project__term">Jun. 2025 - Oct. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher <span class="cv-project__separator">|</span> Advisor: <a href="https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Automated Simulation and Data Generation:** Generated polycrystalline NMC microstructures and automated MATLAB–COMSOL simulations to produce time-aligned image sequences of lithium concentration and von Mises stress.
- **Concentration and Stress Prediction:** Trained separate conditional ConvLSTM models in PyTorch to predict future image sequences of lithium concentration and von Mises stress, using past image sequences, grain-orientation maps, and C-rate inputs.
- **Model Training:** Trained the models with MSE and SSIM losses, using scheduled sampling to select reference or model-predicted frames as inputs during training.
- **Prediction Evaluation:** Compared predicted lithium concentration and von Mises stress image sequences with COMSOL reference sequences and analyzed error accumulation during autoregressive prediction.

<div class="research-gallery research-gallery--three">
  <figure class="research-card">
    <a href="/images/research/battery_concentration.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_concentration.gif" alt="Animated concentration evolution from the COMSOL-based dataset." />
    </a>
    <figcaption>
      <strong>Lithium Concentration Evolution</strong><br>
      Simulated lithium concentration evolution in a polycrystalline NMC particle using MATLAB–COMSOL.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_von_mises.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_von_mises.gif" alt="Animated von Mises stress evolution under the same microstructure and loading condition." />
    </a>
    <figcaption>
      <strong>von Mises Stress Evolution</strong><br>
      Simulated von Mises stress evolution in the same particle under the same loading conditions.
    </figcaption>
  </figure>

  <figure class="research-card research-card--grain-orientation">
    <a href="/images/research/battery_orientation_input.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_orientation_input.png" alt="Grain orientations relative to the global x-axis, folded into 0 to 90 degrees and encoded from violet to pink. Each orientation beta is the local radial angle alpha plus the deviation theta from the radial direction." />
    </a>
    <figcaption>
      <strong>Grain Orientation Map</strong><br>
      Encoded grain orientations relative to the global x-axis as a color map for the conditional ConvLSTM models.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_pipeline.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_convlstm_pipeline.png" alt="ConvLSTM prediction pipeline with concentration, grain orientation, and C-rate inputs." />
    </a>
    <figcaption>
      <strong>Conditional ConvLSTM Prediction</strong><br>
      Used separate conditional ConvLSTM models to predict future concentration and stress image sequences from past image sequences, grain-orientation maps, and C-rate inputs.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_cell_clean.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_convlstm_cell_clean.png" alt="Internal structure of the ConvLSTM cell used in the model." />
    </a>
    <figcaption>
      <strong>ConvLSTM Cell Structure</strong><br>
      Used convolutional input, forget, and output gates to update the cell and hidden states across the image sequence.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_scheduled_sampling.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_scheduled_sampling.png" alt="Scheduled sampling strategy for autoregressive sequence training." />
    </a>
    <figcaption>
      <strong>Scheduled Sampling</strong><br>
      Selected reference or model-predicted frames as inputs during training to prepare the models for autoregressive prediction.
    </figcaption>
  </figure>

</div>

<div class="research-gallery research-gallery--single research-gallery--composite">
  <figure class="research-card" id="battery-prediction-summary">
    <a href="/images/research/battery_prediction_summary.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_prediction_summary.png" alt="Prediction summary comparing ground truth, model prediction, and error heatmaps across multiple frames." />
    </a>
    <figcaption>
      <strong>Concentration Sequence Prediction</strong><br>
      Compared autoregressive concentration predictions with COMSOL reference images and analyzed error accumulation across successive prediction steps using error maps.
    </figcaption>
  </figure>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="burgers-pinn">3. PINNs for Shock Capturing in the Burgers Equation</div>
    <div class="cv-project__term">Nov. 2025 - Mar. 2026</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher <span class="cv-project__separator">|</span> Advisor: <a href="https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xianyang (Tom) Chen</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Burgers Shock Problem:** Studied shock propagation in the one-dimensional inviscid Burgers equation with discontinuous initial conditions, using the analytical solution as a reference.
- **Standard PINN:** Trained a PINN in PyTorch using PDE-residual, initial-condition, and boundary-condition losses, with automatic differentiation to compute the derivatives in the PDE residual.
- **Artificial-Viscosity PINN:** Added an artificial-viscosity term with a fixed coefficient to the PDE residual and trained a second PINN to predict the shock profile.
- **Prediction Comparison:** Compared standard and artificial-viscosity PINN predictions against the analytical inviscid solution, analyzing shock location, transition width, and errors near the discontinuity.

<div class="research-gallery research-gallery--pinn">
  <figure class="research-card research-card--pinn-overview" id="pinn-framework">
    <a href="/files/research/pinn_shock_problem_framework_v8.pdf" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/pinn_shock_problem_framework_v8.svg" alt="Burgers Riemann problem setup for x in [-1, 1] and t in (0, 1], with analytical shock sketches and a PINN coordinate network. Automatic differentiation forms the inviscid PDE residual; initial-condition and boundary-condition evaluations separately connect to their full loss sums. The three weighted losses drive the training loop." />
    </a>
    <figcaption>
      <strong>Burgers Problem and PINN Training</strong><br>
      Defined the inviscid Burgers shock problem with initial and boundary conditions. Trained the PINN using PDE-residual, initial-condition, and boundary-condition losses.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_motion.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_motion.gif" alt="Animation of the exact entropy solution of the inviscid Burgers equation, with left state 1, right state 0, and shock position x_s(t) = t/2." />
    </a>
    <figcaption>
      <strong>Analytical Shock Evolution</strong><br>
      Illustrated the analytical solution of the inviscid Burgers equation, with a discontinuity moving at a constant speed of 0.5.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_trajectory.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_trajectory.gif" alt="Animation of the analytical Burgers shock trajectory x_s(t) = 0.5t in the space-time plane." />
    </a>
    <figcaption>
      <strong>Analytical Shock Trajectory</strong><br>
      Tracked the analytical shock position along x<sub>s</sub>(t) = 0.5t in the space–time plane.
    </figcaption>
  </figure>

  <div class="pinn-prediction-comparison" id="pinn-prediction-comparison">
  <figure class="research-card">
    <a href="/images/research/burgers_standard_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_standard_pinn_prediction.gif" alt="Animation comparing the standard PINN prediction with the exact solution of the inviscid Burgers equation." />
    </a>
    <figcaption>
      <strong>Standard PINN Prediction</strong><br>
      Compared the standard PINN prediction with the analytical inviscid solution over time, examining the shock location and transition width.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" alt="Animation comparing a constant-artificial-viscosity PINN profile with the analytical inviscid Burgers shock reference." />
    </a>
    <figcaption>
      <strong>Artificial-Viscosity PINN Prediction</strong><br>
      Compared the PINN prediction with fixed artificial viscosity against the analytical inviscid solution, examining the shock location and transition width.
    </figcaption>
  </figure>
  </div>
</div>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="mechanics-llm">4. Domain-Specific LLM Fine-Tuning for Mechanics of Materials</div>
    <div class="cv-project__term">Sep. 2024 - Apr. 2025</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Undergraduate Researcher <span class="cv-project__separator">|</span> Advisor: <a href="https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Mechanics Question Answering:** Adapted Qwen2.5-7B for question answering and concept explanation in mechanics of materials.
- **Instruction Dataset Construction:** Built instruction–response datasets from textbooks and technical literature, covering stress analysis, constitutive laws, and failure theories in mechanics of materials.
- **LoRA Fine-Tuning:** Fine-tuned Qwen2.5-7B on the instruction–response datasets using LoRA on Google Colab.
- **Public Release:** Released two instruction–response datasets ([Material-mechanics](https://huggingface.co/datasets/CYHcyh66/Material-mechanics) and [Material-mechanics-merge](https://huggingface.co/datasets/CYHcyh66/Material-mechanics-merge)) and two fine-tuned Qwen2.5-based model checkpoints ([AI_Material_mechanics_assistant](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant) and [AI_Material_mechanics_assistant_merged](https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged)) on Hugging Face for question answering in mechanics of materials.

<div class="research-gallery research-gallery--single">
  <figure class="research-card">
    <a href="/images/research/llm_finetuning_workflow_v2.png" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/llm_finetuning_workflow_v2.png" alt="Workflow diagram showing self-built mechanics dataset construction, Hugging Face dataset publication, Qwen2.5 7B LoRA fine-tuning on Google Colab, fine-tuned model publication, and the final AI teaching assistant." />
    </a>
    <figcaption>
      <strong>LLM Fine-Tuning and Release Workflow</strong><br>
      Built instruction–response datasets for mechanics of materials, fine-tuned Qwen2.5-7B using LoRA on Google Colab, and released the datasets and model checkpoints on Hugging Face.
    </figcaption>
  </figure>
</div>

Skills
======

- **Scientific Machine Learning:** PyTorch, JAX, Neural Operators (Transolver, DeepONet), PINNs, ConvLSTM
- **Computational Mechanics:** JAX-FEM, FEniCSx, Abaqus, COMSOL Multiphysics (LiveLink for MATLAB), Gmsh
- **Programming & Tools:** Python, MATLAB, Linux, Git/GitHub
- **Visualization:** Matplotlib, Origin
- **LLM Fine-Tuning:** Qwen2.5, LoRA, Instruction Dataset Curation
- **Languages:** Mandarin Chinese (native), Cantonese, English

Contact
======

<ul class="quick-links">
  <li><a href="mailto:2350083@tongji.edu.cn"><i class="fas fa-envelope quick-links__icon" aria-hidden="true"></i><span>Tongji Email</span></a></li>
  <li><a href="mailto:cyhcyh070126@gmail.com"><i class="far fa-envelope quick-links__icon" aria-hidden="true"></i><span>Gmail</span></a></li>
  <li><a href="https://github.com/cyhcyh070126-bot"><i class="fab fa-github quick-links__icon" aria-hidden="true"></i><span>GitHub</span></a></li>
  <li><a href="https://huggingface.co/CYHcyh66"><img class="quick-links__icon" src="{{ '/assets/icons/huggingface.svg' | relative_url }}" width="24" height="24" alt="" aria-hidden="true" /><span>Hugging Face</span></a></li>
  <li><a href="https://www.linkedin.com/in/yanghao-chen-830677399/"><i class="fab fa-linkedin quick-links__icon quick-links__icon--linkedin" aria-hidden="true"></i><span>LinkedIn</span></a></li>
</ul>

{% if site.publications.size > 0 %}

Publications
======

<ul>{% for post in site.publications reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

{% endif %}
{% if site.talks.size > 0 %}

Talks
======

<ul>{% for post in site.talks reversed %}
  {% include archive-single-talk-cv.html  %}
{% endfor %}</ul>

{% endif %}
{% if site.teaching.size > 0 %}

Teaching
======

<ul>{% for post in site.teaching reversed %}
  {% include archive-single-cv.html %}
{% endfor %}</ul>

{% endif %}

