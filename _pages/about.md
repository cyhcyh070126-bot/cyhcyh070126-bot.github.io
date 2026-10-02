---
permalink: /
title: "Yanghao Chen"
author_profile: true
home_page: true
redirect_from:
  - /about/
  - /about.html
---

Welcome to my personal website.

I am **Yanghao Chen**, an undergraduate student in Engineering Mechanics at **Tongji University**. My research lies at the intersection of computational mechanics and scientific machine learning, with a particular focus on integrating GPU-accelerated finite-element simulation with neural operators for PDE-governed engineering systems.

News
======

<div class="home-news">
  <div class="home-news__list">
    <article class="home-news__item">
      <div class="home-news__date">Sep 15, 2026*</div>
      <div class="home-news__content"><strong>3D fiber-reinforced composite extension:</strong> Extending the hybrid FEM–neural operator framework to a <strong>three-dimensional composite containing 100 fibers</strong>. The goal is to train a shared operator mapping interface displacement fields to 3D stress fields across fiber subdomains, then assemble stress-derived interface reactions for coupling with the surrounding FEM matrix. Current research questions include operator reuse across fibers and the influence of fiber-end effects on stress prediction and interface-force transfer. <a href="/cv/#research-experience">View the 3D composite mesh cross-section and ongoing work.</a></div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Aug 15, 2026*</div>
      <div class="home-news__content"><strong>3D bracket studies:</strong> Extended the mechanics data-generation and neural-operator workflow to three-dimensional bracket examples, exploring the mapping from interface displacement fields to local stress responses for hybrid FEM–neural operator coupling.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jul 15, 2026*</div>
      <div class="home-news__content"><strong>Cylinder coupling studies:</strong> Developed a cylinder example combining an outer FEM domain with a local neural operator. The operator maps interface displacements to subdomain stresses, from which interface reaction forces are assembled for iterative displacement–force exchange.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jan 2026</div>
      <div class="home-news__content">Began a visiting undergraduate research internship in the <a href="https://engineering.jhu.edu/case/" target="_blank" rel="noopener noreferrer">Department of Civil and Systems Engineering</a> at Johns Hopkins University, advised by <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a>, working on a GPU-accelerated hybrid FEM–neural operator coupling framework.</div>
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

<p><small>* The July–September dates are representative mid-month markers for the research timeline, not verified milestone dates.</small></p>

Current Research
======

My current research focuses on GPU-accelerated computational mechanics and scientific machine learning. I am developing hybrid FEM–neural operator solvers in which a local neural operator learns the mapping from interface displacement fields to subdomain stress fields. Interface reaction forces are assembled from the resulting stress fields and returned to the outer finite element solver through iterative coupling.

[View Research Experience in CV](/cv/#research-experience).

Quick Links
======

- [CV](/cv/)
- [GitHub](https://github.com/cyhcyh070126-bot)
- [Hugging Face](https://huggingface.co/CYHcyh66)
- [LinkedIn](https://www.linkedin.com/in/yanghao-chen-830677399/)
- [Tongji Email](mailto:2350083@tongji.edu.cn)
- [Gmail](mailto:cyhcyh070126@gmail.com)

Contact
======

You can reach me at [2350083@tongji.edu.cn](mailto:2350083@tongji.edu.cn).

My LinkedIn profile is [linkedin.com/in/yanghao-chen-830677399](https://www.linkedin.com/in/yanghao-chen-830677399/).

The site is published at [cyhcyh070126-bot.github.io](https://cyhcyh070126-bot.github.io).
