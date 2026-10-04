---
permalink: /
title: "Yanghao Chen"
author_profile: true
home_page: true
redirect_from:
  - /about/
  - /about.html
---

Hi! I'm Yanghao Chen, a final-year undergraduate at **[Tongji University](https://www.tongji.edu.cn/)**, studying Engineering Mechanics in the **[School of Aerospace Engineering and Applied Mechanics](https://aero-mech.tongji.edu.cn/31828/list.htm)**. My interests center on <strong class="research-keyword">scientific machine learning</strong> and computational mechanics.

My research began with fine-tuning <strong class="research-keyword">large language models</strong> using LoRA on Google Colab for question answering in mechanics of materials. I then developed <strong class="research-keyword">ConvLSTM</strong> models to predict lithium concentration and von Mises stress image sequences in battery materials using MATLAB–COMSOL simulation data. I also studied shock propagation with <strong class="research-keyword">physics-informed neural networks (PINNs)</strong>, comparing standard and artificial-viscosity formulations against the analytical inviscid solution.

Together, these experiences have shaped my interest in combining machine learning with numerical methods for scientific simulation. My current research focuses on <strong class="research-keyword">neural operators</strong>, which learn mappings between function spaces, and <strong class="research-keyword">hybrid FEM–neural operator solvers</strong> based on non-overlapping domain decomposition. I aim to combine AI-based models with <strong class="research-keyword">GPU-accelerated numerical computing</strong> to make engineering simulations more efficient and scalable.

At Tongji, I have been fortunate to work under the guidance of **[Prof. Ying Zhao](https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm)** and **[Prof. Xianyang (Tom) Chen](https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm)**. From January to October 2026, I was an undergraduate research intern in the [Department of Civil and Systems Engineering](https://engineering.jhu.edu/case/) at **[Johns Hopkins University](https://www.jhu.edu/)**, working with **[Prof. Somdatta Goswami](https://engineering.jhu.edu/case/faculty/somdatta-goswami/)** in [Centrum IntelliPhysics](https://sites.google.com/view/centrum-intelliphysics/home).

News
======

<div class="home-news">
  <div class="home-news__list">
    <article class="home-news__item">
      <div class="home-news__date">Sep 2026</div>
      <div class="home-news__content"><strong>3D Composite Extension:</strong> Extending the hybrid FEM–neural operator solver to a 100-fiber composite. A shared neural operator computes stress fields across all fiber subdomains, with component-specific weights shared across fibers. Periodic boundary conditions eliminate fiber-end effects. <a href="/cv/#fiber-composite">View the composite mesh.</a></div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Aug 2026</div>
      <div class="home-news__content"><strong>3D Bracket Studies:</strong> Extended the workflow to 3D bracket problems, using GRFs to sample interface displacement fields and tractions on internal surfaces. Trained neural operators to predict subdomain stress fields from these inputs.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jul 2026</div>
      <div class="home-news__content"><strong>Cylinder Studies:</strong> Developed a hybrid FEM–neural operator solver for a cylinder problem, using GRFs to sample displacement fields on both inner and outer arcs. Coupled the FEM and neural-operator subdomains through iterative exchange of interface forces and displacements.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jul 2026</div>
      <div class="home-news__content">Transitioned to an on-site undergraduate research internship at Johns Hopkins University to continue working with <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a>.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jan 2026</div>
      <div class="home-news__content">Began a remote undergraduate research internship in the <a href="https://engineering.jhu.edu/case/" target="_blank" rel="noopener noreferrer">Department of Civil and Systems Engineering</a> at Johns Hopkins University, advised by <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a>, working on a GPU-accelerated hybrid FEM–neural operator solver.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Nov 2025</div>
      <div class="home-news__content">Developed standard and artificial-viscosity PINNs for one-dimensional Burgers shock problems, with analytical-reference comparisons of the predicted solution profiles.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jun 2025</div>
      <div class="home-news__content">Began developing a MATLAB–COMSOL data-generation workflow and separate ConvLSTM models for concentration and stress image prediction in battery materials.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Apr 2025</div>
      <div class="home-news__content">Released two Qwen2.5-based checkpoints for question answering in mechanics of materials—the <a href="https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant" target="_blank" rel="noopener noreferrer">fine-tuned checkpoint</a> and <a href="https://huggingface.co/CYHcyh66/AI_Material_mechanics_assistant_merged" target="_blank" rel="noopener noreferrer">merged model</a>—together with the <a href="https://huggingface.co/datasets/CYHcyh66/Material-mechanics" target="_blank" rel="noopener noreferrer">Material-mechanics</a> and <a href="https://huggingface.co/datasets/CYHcyh66/Material-mechanics-merge" target="_blank" rel="noopener noreferrer">Material-mechanics-merge</a> instruction datasets on Hugging Face.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Sep 2024</div>
      <div class="home-news__content">Started curating instruction data and developing an LLM fine-tuning workflow for question answering in mechanics of materials.</div>
    </article>
  </div>
</div>

Current Research
======

I am developing GPU-accelerated hybrid FEM–neural operator solvers based on non-overlapping domain decomposition. FEM and neural-operator subdomains are connected through shared interfaces. Neural operators learn mappings from interface displacement fields to subdomain stress fields. Interface reaction forces computed from predicted stresses are transferred to the FEM solver. The FEM solver uses these forces to compute updated interface displacements and returns them to the neural operators for the next coupling iteration.

[View Research Projects in CV](/cv/#research-projects).

Quick Links
======

<ul class="quick-links">
  <li><a href="{{ '/cv/' | relative_url }}"><i class="far fa-file-alt quick-links__icon" aria-hidden="true"></i><span>CV</span></a></li>
  <li><a href="https://github.com/cyhcyh070126-bot"><i class="fab fa-github quick-links__icon" aria-hidden="true"></i><span>GitHub</span></a></li>
  <li><a href="https://huggingface.co/CYHcyh66"><img class="quick-links__icon" src="{{ '/assets/icons/huggingface.svg' | relative_url }}" width="24" height="24" alt="" aria-hidden="true" /><span>Hugging Face</span></a></li>
</ul>

Contact
======

<ul class="quick-links">
  <li><a href="mailto:2350083@tongji.edu.cn"><i class="fas fa-envelope quick-links__icon" aria-hidden="true"></i><span>Tongji Email</span></a></li>
  <li><a href="mailto:cyhcyh070126@gmail.com"><i class="far fa-envelope quick-links__icon" aria-hidden="true"></i><span>Gmail</span></a></li>
  <li><a href="https://www.linkedin.com/in/yanghao-chen-830677399/"><i class="fab fa-linkedin quick-links__icon quick-links__icon--linkedin" aria-hidden="true"></i><span>LinkedIn</span></a></li>
</ul>
