---
permalink: /
title: "Yanghao Chen"
author_profile: true
home_page: true
redirect_from:
  - /about/
  - /about.html
---

Hi, I'm Yanghao Chen, a final-year undergraduate at **[Tongji University](https://www.tongji.edu.cn/)**. I study Engineering Mechanics in the **[School of Aerospace Engineering and Applied Mechanics](https://aero-mech.tongji.edu.cn/31828/list.htm)**. My research interests lie in <strong class="research-keyword">scientific machine learning</strong> and computational mechanics.

My research began with fine-tuning <strong class="research-keyword">large language models</strong> using LoRA on Google Colab to improve their ability to answer questions in mechanics of materials. I then developed <strong class="research-keyword">ConvLSTM</strong> models to forecast the evolution of concentration and stress fields in battery materials using images from MATLAB–COMSOL simulations. My work on <strong class="research-keyword">physics-informed neural networks (PINNs)</strong> examined the Burgers equation, comparing standard and artificial-viscosity formulations to understand how they represent propagating shocks.

Together, these experiences have shaped my current focus on AI-accelerated scientific computing. I study <strong class="research-keyword">neural operators</strong>, which learn mappings between function spaces, and their integration with finite element methods in <strong class="research-keyword">hybrid solvers</strong>. By combining these approaches with <strong class="research-keyword">GPU acceleration</strong>, I aim to make large-scale mechanics simulations more efficient and scalable.

At Tongji, I have been fortunate to work under the guidance of **[Prof. Ying Zhao](https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm)** and **[Prof. Xianyang (Tom) Chen](https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm)**. I am currently a visiting undergraduate research intern in the [Department of Civil and Systems Engineering](https://engineering.jhu.edu/case/) at **[Johns Hopkins University](https://www.jhu.edu/)**, working with **[Prof. Somdatta Goswami](https://engineering.jhu.edu/case/faculty/somdatta-goswami/)** in [Centrum IntelliPhysics](https://sites.google.com/view/centrum-intelliphysics/home).

News
======

<div class="home-news">
  <div class="home-news__list">
    <article class="home-news__item">
      <div class="home-news__date">Sep 2026</div>
      <div class="home-news__content"><strong>3D fiber-reinforced composite extension:</strong> Extending the hybrid FEM–neural operator framework to a <strong>three-dimensional composite containing 100 fibers</strong>. The goal is to train <strong>a single shared neural operator for all 100 fibers</strong>, using the same model parameters to map each fiber's interface displacement field to its 3D stress field. Interface reactions assembled from these predicted stresses are then passed to the surrounding FEM matrix in the proposed coupling scheme. Current research questions include generalization across fibers and the influence of fiber-end effects on stress prediction and interface-force transfer. <a href="/cv/#research-experience">View the 3D composite mesh cross-section and ongoing work.</a></div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Aug 2026</div>
      <div class="home-news__content"><strong>3D bracket studies:</strong> Extended the mechanics data-generation and neural-operator workflow to three-dimensional bracket examples, exploring the mapping from interface displacement fields to local stress responses for hybrid FEM–neural operator coupling.</div>
    </article>
    <article class="home-news__item">
      <div class="home-news__date">Jul 2026</div>
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
