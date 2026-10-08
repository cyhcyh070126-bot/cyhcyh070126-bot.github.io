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
{% include cv-pdf-url.html %}

<p><a href="{{ cv_pdf_url }}" target="_blank" rel="noopener noreferrer">View CV (PDF)</a> <span class="cv-links__separator">|</span> <a href="{{ '/files/Yanghao_Chen_Research_Statement.pdf' | relative_url | append: '?v=' | append: cv_pdf_version }}" target="_blank" rel="noopener noreferrer">Research Statement (PDF)</a> <span class="cv-links__separator">|</span> <a href="{{ '/projects/' | relative_url }}">Project repositories</a></p>

Education
======

<div class="cv-school">
  <img class="cv-school__seal" src="{{ '/images/schools/tongji-university-seal-128.png' | relative_url }}" alt="Tongji University seal" width="128" height="128" decoding="async" fetchpriority="high" srcset="/images/schools/tongji-university-seal-128.png 128w, /images/schools/tongji-university-seal-256.png 256w, /images/schools/tongji-university-seal.png 1280w" sizes="40px">
  <span>Tongji University, Shanghai, China</span>
</div>

- Bachelor of Engineering in Engineering Mechanics, School of Aerospace Engineering and Applied Mechanics
- Sep. 2023 - Present (Expected Jun. 2027)
- GPA: 87/100

<div class="cv-school">
  <img class="cv-school__seal" src="{{ '/images/schools/johns-hopkins-university-shield.svg' | relative_url }}" alt="Johns Hopkins University shield" width="128" height="128" decoding="async" fetchpriority="high">
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
- Differentiable computing and simulation

Current Research
======

- Hybrid FEM–neural operator solvers based on non-overlapping domain decomposition
- Neural operator learning for subdomain stress prediction
- Iterative exchange of interface forces and displacements
- Shared neural operators for 3D fiber-reinforced composites

<h1 id="research-projects"><span id="research-experience">Research Projects</span></h1>

<div class="cv-project">
  <div class="cv-project__header">
    <div class="cv-project__title" id="fem-neural-operator">1. GPU-Accelerated Hybrid FEM–Neural Operator Solver</div>
    <div class="cv-project__term">Jan. 2026 - Present</div>
  </div>
  <div class="cv-project__meta">
    <span><em>Lead Undergraduate Researcher<span class="cv-project__separator">|</span>Advisor: <a href="https://engineering.jhu.edu/case/faculty/somdatta-goswami/" target="_blank" rel="noopener noreferrer">Prof. Somdatta Goswami</a></em></span>
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
      <picture><source type="image/webp" srcset="/images/research/cylinder_subdomain_supports_1234.display-640.webp 640w, /images/research/cylinder_subdomain_supports_1234.display-1280.webp 1280w, /images/research/cylinder_subdomain_supports_1234.display-1600.webp 1600w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/cylinder_subdomain_supports_1234.png" alt="Cylinder model showing the FEM subdomain in gray, neural-operator subdomain in green, shared interface in blue, and supports along the straight edges." loading="lazy" decoding="async" width="1600" height="1600" style="background-image:url('data:image/webp;base64,UklGRtQCAABXRUJQVlA4IMgCAADQEQCdASpaAFoAPt1kq1KopKOio5QMARAbiWUAVBd26zHrn9+MqKHEyFFe7fB/BqmhTbBBb0fQUo5C9KVtce5HKRIZzIrtRlHfuo5GKN62wW/XSD5t0ndQwMURkra+iO06BC7WMmqk8NJe8vako7eNuzK99TTtjoK1e4YIWhApJs0O+qXZCGNfgVzh8NF2ADYxpffJZu+gAP738fO1ESeAWkDDPr7Ymx0ssVZfL9sMbufqlhceWmgN53ctetGisfLJDr4UGJKVAc/VXZh5gNlqOhIuUUGGpo5r/06J6A8aFZdAxzvI74WGs76VPNPtySJHDTGo4oR4m4s+Ezvc5fOr32qw/U6I+Xm3YwOKrdIK/NTNCt85LNmPx8IVqLywRRDWs6Gz65J8l/TLZZaKobtfFvwzsILU7A9gyQvPX+FWtAUfrB5m2vfJLhONTGTkUeLkszzYIhatbPfhEE/WqY2atL/OoN3Qcrm0QdBCh4LGoJ5Sf5mkBDH9FoVkm7srdYGs0LGpZwUGkdQ0+81bcaQaUhrUXMLZTL/7wXXs4HQgzMeIHV+e1LetxcXnZWpPAJKuq/n/70LeQCBCW6t1krsq5/6H8Ggg7BhTKIS6vg/wOD0DpPQFwnl7wjtnN4dy3hzcGrTFEtHp0L+z3+WxHpV2Ig4XqtN5ynqcgHMfuD5RbFTXzoOIOVnOdtMPPqjK3A5WhRYYsDnT24iZflNAbN7TEMnAL3eTIPUlAtJM1k2M8GJfFoZJukUiNEBI2QkekBW1sWaGftlPWH1jE0Ox/67tupagWvGLMV5k+MJLcO0FwPhSqygpo2E75tr3X7UAaqww3N7SytoOWRaQbzm5ROOqXqPyZsBzISJTwvt/BMgzBauhi+JG1ddCvuU2n8Bhb/04W9rMN2iw5ac+Cc2xAWUnkXVnCke6LIcFezRDBvdWoCMYXpBaAAAA');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>Cylinder Subdomain Layout</strong><br>
      The FEM subdomain (gray) and neural-operator subdomain (green) are connected through a shared interface (blue).
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/domain_decomposition_preview.pdf" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/domain_decomposition_preview.display-640.webp 640w, /images/research/domain_decomposition_preview.display-1280.webp 1280w, /images/research/domain_decomposition_preview.display-1920.webp 1920w, /images/research/domain_decomposition_preview.webp 2592w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/domain_decomposition_preview.png" alt="Full cylinder-domain mesh and its non-overlapping FEM and neural-operator subdomain meshes." loading="lazy" decoding="async" width="2592" height="749" style="background-image:url('data:image/webp;base64,UklGRqwBAABXRUJQVlA4IKABAADwCwCdASp4ACMAPt1kp06opaMiLBOcQRAbiWkACwRXCqrg+iJYTrAic8vYADZeozUwWcVnDTAvRA2/F3xCAbyJdbAy/TRmib3xJvMPpDVetJUvssl942rSeKvl1vh+muszMpfGOOl8AAD++qUowmi6zv5V+swA1Kbj9xuGMy+PZnYrx6RLDNfEmMlCcqRJAQtB8+8gpmfZEZShOFPdZZ27sTuAL2eGROeWi5f88sBd0lEzS5it9kJ0MuTR2O4KaCRqxgk3xznz1Ea0PIV2m56PZEJvTmnmhwGdQ29w1DJ3dZ9NVTj6FHQQSLrJQUTWbXNHClUZ5JG1SWMTMl6XsJCTH8L2vbVc+HjWAT4xo7cB00vgQNV7/xT6RADt0uZ91pMo42m64ddyvmRkTL9ywsRABaqCN9VhId/tBSRha6oCOJzFu86fv/LpaW3rnE4KQIP+OqIDhaGMLzcGhwCOY5UCH8UJkmeGXFh3cH7vxwYvV0DmbntIqMKO7d6Wnvt9RKAhbjTc757+rAeghO/09lJLiymUnEeAahB37vwAAAAAAA==');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>Non-overlapping Domain Decomposition</strong><br>
      The mesh is partitioned into non-overlapping FEM and neural-operator subdomains with a shared interface.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/cylinder_boundary_conditions.pdf" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/cylinder_boundary_conditions.display-640.webp 640w, /images/research/cylinder_boundary_conditions.display-1280.webp 1280w, /images/research/cylinder_boundary_conditions.display-1540.webp 1540w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/cylinder_boundary_conditions.png" alt="Neural-operator cylinder subdomain with prescribed displacement functions on the inner and outer arcs, zero horizontal displacement on the left edge, and zero vertical displacement on the bottom edge." loading="lazy" decoding="async" width="1540" height="1600" style="background-image:url('data:image/webp;base64,UklGRnYCAABXRUJQVlA4IGoCAADQDwCdASpXAFoAPt1qrlGopaQjpXK6aRAbiWcA1o23uXqyWViwI0rk8x4K/44gGMgippewvgeUXqRxAwjJaYERUas0Y+MoFT0OnCkajsxL0jerXC5DV43Mmy9o/qpZyQvBpKor6ZSp8OZKjpTT/V2NpVN4jiuTiTs5yMPUvKLE2wVJtCqpPtgA/vSgvMYBn8OngV71Cg6hwx0DbYDgZo5iY5UEwWu2N/kMwFW7AijSF5ZjlM4IUZ3wQOmlS8GARse7RyCN2/2VsZlNVfIKlJ8icQRApYwioNMBhEPO5uhDjgUOrUq57NLnGts2x5+RWrahSAOAUx2iIAaX0vFwjhcKcIELdHMAtp28JG+C+a5z4iebgCusAjc6JSZiA/1SDnMLqq+MyizDXd/+5SloI1D3a8DFysx3XmFttCPrOv5WJZRvfK8//hi/yyy1HjnLqjr9efaWQXfVJY0hLcdK6lpqmIKVtFhQMGHbMvralYn6kBsGKU+Pt1pZTa8YDpMObP7S+zp6KGI76c/E8sIylwlPeViHEOsoaRodW5qYv3k0BT0eBsuqyenJufjjVJAb8hkFmIhceSJ0FmMWjV0Ursu0Av8ZyEn0dcLpgoeMIWABdOUK0SA7mq4V+nt8hJ0WNK62dUS15YdTi73jWTQxODmlZZaUbcJSgTdeEw2iCfnU7cHeIyr07eu0XGQnIuqMPG1EZdXl9tfZ0mxeDA7S5Rtqb+Z/HV72NlTo3DnlM2U6/qPMPR0foIdKu/AxFOsxE7sP0ppK5fdaGgUGpPLm0Jfc5Fjw90JhI0110+6ACsIT1hkNonVKswAAAAA=');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>GRF-Sampled Boundary Displacements</strong><br>
      Sampled displacement fields on the inner and outer arcs using Gaussian random fields (GRFs). Set horizontal displacement to zero on the left edge and vertical displacement to zero on the bottom edge.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/subdomain_point_cloud_preview.pdf" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/subdomain_point_cloud_preview.display-640.webp 640w, /images/research/subdomain_point_cloud_preview.display-1280.webp 1280w, /images/research/subdomain_point_cloud_preview.display-1920.webp 1920w, /images/research/subdomain_point_cloud_preview.webp 2592w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/subdomain_point_cloud_preview.png" alt="Subdomain location, finite element mesh, and point cloud with blue interior nodes and red boundary nodes." loading="lazy" decoding="async" width="2592" height="749" style="background-image:url('data:image/webp;base64,UklGRoYBAABXRUJQVlA4IHoBAADQDACdASp4ACMAPt1gqVEopKOjrBHLMRAbiWUA1M25ca6eVqOsPblq9EHYfnCY0DHiuR29dffnxKcksHP1rHuk8vdmFV+RB+x2HoYzlvCHJtzLHnmfjv8I7ozESGX+zLEeruluIlZuPfL6CbSFbQAA/voRV81OU0gd8SrQClpAHcGyyeZX4ry2+154TvDWPhfIBNpVPSnFAnIzXTCF+4YJhbeHluxYM6cfXzskJrL7wq7pPwpDwDuVdgq5Q+THPPaKjdehOFBZFCSYraigmNAMZteSYxcwiQqVegHHcfUyqC4EQvWzjPSyxOvLFu1sNX0CeIC4BxYvQhe7klX34RODpwx4dk1hSkA+9IIw2oKUN+VDVlVL3eJgZ8l+B8FQuLiKzL1rO9Six5fN8aQHdA5xBhie4G8TjFrusYWU++PBJKGk9JEgGYrXAjksaYUw3DClKpZwgRzN5ClICQ5tGj2xetessMPAzQ4y935u6LHATe10ofyQyAAAAAA=');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>Subdomain Mesh and Point Cloud</strong><br>
      Constructed the point cloud from 4,102 finite element nodes, including 3,847 interior nodes (blue) and 255 boundary nodes (red), for neural-operator training.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/files/research/sweep_001_sigma_xx_continuous.pdf" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/sweep_001_sigma_xx_continuous.display-640.webp 640w, /images/research/sweep_001_sigma_xx_continuous.display-1280.webp 1280w, /images/research/sweep_001_sigma_xx_continuous.display-1920.webp 1920w, /images/research/sweep_001_sigma_xx_continuous.webp 3543w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/sweep_001_sigma_xx_continuous.png" alt="Predicted sigma xx stress field, FEM reference, and absolute error map; relative L2 error 0.6262 percent." loading="lazy" decoding="async" width="3543" height="1239" style="background-image:url('data:image/webp;base64,UklGRh4DAABXRUJQVlA4IBIDAACwEQCdASp4ACoAPtFapkyoJaOiMBVeqQAaCWoAx9hCLvujxy4Tm3eu2/ed1/2PJQYPCnAgBgak9nFgka7ujCmyuckaY4y6cidAP4hRoMQz30QekpwQvghcQcj3r3OM3WjCOC0EnWj4yb3nbE9ELnH0IDfRs6IKHCvw1uva5yxItS9ncCD9fTs+wxyf8cJa2M06cV+Wl/wA/vqki1KANUIw6CSQXBK24qinihsBySlwfzkb7XRphFqZ99vjYHpMBTFDVSMg0NB8l4UMNIM8G/ObfLCwMsPP0hl5AL69HtpfF8Mk+/AAgLzQdfHiNNRtYhQoXcPNeqpd1mI+H2sNCxjgOVvtaoCRLfmfKR9pYtI0kKV6oZPJpbcuZ3JMuVCGK1IpLWUvtvDccyk0fugSEk3f5rJlIZiVOIZCWOUxY5o79/N1r3zNLTGGnm/v3hRX/d4BUW/d1EnpYKodvKDV4kdkcvRKGnfe7MvGQlA8UpfxixmQOjkV/MBSMLFkLI8rAlHxFnmve47kW9rmWOfQBARhO6+akuV3KUQVukHIF9JLqK7iY7MWEwepe2dcOPZJJQtunll+zYgufCHfviQPvFBKC85ru5lGyj8tXnlh3+91dHjW78nA1/f1eBANiNBBeUA+y6sxhbxVd8vjqZgPojkHHKTmZliwmWgMd3C/lDPAwCmcMRQZIW+7H9raptbHVdkD7nKkVOGfB59Q63nieHh6YUUyG63s/Hdjdae3PzT4oc+87T/jaE1I+PJUZnT0LehZRDgMI3XYu2wkN2OgSv6Gh4/jwYGImX8Ua6oEMMMF87JnV9HWzgTzBrTXMk0b+eQrwEpXho7abJ1U4STpwVOYplhH97FqWCqHjFCTMuVzRH9ao/lw6jJjX3mavcg/k5/Be5W8QHEuD5KB74ukdVAD/YEcGz+QI3Ge1JzWPbhrbxjhOvMd4chB0BziLMe8NLCcUfrZN2C487ffRjaZCG+Gnjxohs/GQCSafdRiMrjfmcGW311C88xxZ+H1mrv7teUd6w6tZGpSqidSE3vGxJMoAAA=');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>&sigma;<sub>xx</sub> Stress Prediction and Error</strong><br>
      Compared the predicted &sigma;<sub>xx</sub> stress field with the FEM reference. The relative L<sup>2</sup> error is 0.6262%, and the absolute error map shows the spatial error distribution.
    </figcaption>
  </figure>

  <figure class="research-card" id="cylinder-coupling-results">
    <a href="/files/research/cylinder_coupled_stress_comparison.pdf" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/cylinder_coupled_stress_comparison.display-640.webp 640w, /images/research/cylinder_coupled_stress_comparison.display-1280.webp 1280w, /images/research/cylinder_coupled_stress_comparison.display-1920.webp 1920w, /images/research/cylinder_coupled_stress_comparison.webp 2200w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/cylinder_coupled_stress_comparison.png" alt="Cylinder coupling results in nine panels: rows show sigma xx, sigma yy, and tau xy in MPa; columns compare the monolithic FEM reference, coupled FEM-NO solution, and absolute error. Dashed arcs mark the coupling interface." loading="lazy" decoding="async" width="2200" height="1841" style="background-image:url('data:image/webp;base64,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');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
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
      <picture><source type="image/webp" srcset="/images/research/composite_n100_mesh_overview.display-640.webp 640w, /images/research/composite_n100_mesh_overview.display-1280.webp 1280w, /images/research/composite_n100_mesh_overview.display-1920.webp 1920w, /images/research/composite_n100_mesh_overview.webp 2400w" sizes="(max-width: 900px) calc(100vw - 48px), 1100px" /><img src="/images/research/composite_n100_mesh_overview.png" alt="Bottom cross-section of a three-dimensional finite element mesh for a 100-fiber reinforced composite, with a local fiber–matrix close-up. This is a cross-sectional view of a 3D model, not a 2D simulation or a prediction result." loading="lazy" decoding="async" width="2400" height="1362" style="background-image:url('data:image/webp;base64,UklGRugDAABXRUJQVlA4INwDAADwFQCdASp4AEQAPt1qq0+opiOiKBgK8RAbiWkzmR4VFQs3vEdtD3u7OcAY9LcQKsc+nlUfxJN4AtEhu5+iPDDh8JGs/Zp20a+r1n4NnrV0oCyV13a9GXQDhmdPTf7Vzl+Jtcaiz8TSn8RuIB4zQ1f+3ecndSZJiL3sdvS63Wex/4fqsTkfsmxGIFfqKmcuYRQOk8CGoyvJneo4R64as0kn/EmaFFWbsRSZvXYPQLffAjd7/M+OA6EQAP75aJR8zfTJt9adOsscKKTH4H23SevzzEG+FAMszDo+fT9eyeHONHcMgvm6n0s++A/lAGw6GYQr1Dn6+z3C309gyotF1wAubqFfnlvKtxMSe+YGNiFXecS8WsEqBa6Wfy4NLAnznVxnt+kGAvqwQHmceS2BvQBxMoVC5yFP8wM/Z5HFnXjuoBksQlNswPLr6l98kK6egP0HxiqKfW4Ax+gYGM0d+0X8/qRtWyZD3lhU2H6bP/JSvqvCs+vmrhZY5v4dSXyT91Wv7LtVOcgqyw3Zxh75M4E1adxQ/7ARx5mM46dMr6/cem0oG7lDgoifwto90F2U+oxQ3Ycr9VFYMjdudFYThvb/0WLX9tjxfuiK7NR5Y9pXvWszbHMH6LM7iv2Et3kqlkzjmwVtj3Q0/BEIHgGI+KBKx8PTgZjkkZr8A+ilwhA61nHkzdubiAKChZpFVq8A1FrgwG+25ZYTUCoDdRUG2bqBusupRXivyvZQThdGLHhRPSZaixTd3ANZc5OToBCyCIplSXiAB/vYBTtjUmGEkdFZYdsB2tRWIfUNvmN40pjPZm1Jz/8D1zeq/RwM0176ThVwT8lilGqgDJ230y4tvPTPyy8vU+hmE5c4G5JdfR1aHD6kgpm0NhHECAtD0ttP2dKdOENLfTsq6cjLjwIeVjOOWssEMa4eNOUBquuwnxcTNcxX9aFUsxEYdhmnks6BJiBJlcBZLlpGU6JM6vj8uXPGINekcniLOIzI1qEcKF0fpc6n9k3XfSyazpcZRz7AAJKPTpgaKABcbMqhx6nHvtQoJnyRb5imItg3hImso5oC8PlVDXqVdpzG7gVJ/gy1Mn6UGzOy1xNOCJAA+tVSvyOaeuarXjAwJoyN2bHVFV336A4sHIw1IbQLT2QWNsyypsIPN08jRs67tZa0G/ukr+DrRsZ6o2BQeDPLvSjyBcTHcy+gKRyNYjvfHZprOPR/SZVjHApHBc+7nKcselFzHsg/w50V3LaKiDMgNcN3UiBwwaExkftmdQYVAOqn1d36hrNcol3w403BqkhPz5YVS0gGTZC++O2CX2JAAAAA');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
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
    <span><em>Undergraduate Researcher<span class="cv-project__separator">|</span>Advisor: <a href="https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
    <span><em>Tongji University</em></span>
  </div>
</div>

- **Automated Simulation and Data Generation:** Generated polycrystalline NMC microstructures and automated MATLAB–COMSOL simulations to produce time-aligned image sequences of lithium concentration and von Mises stress.
- **Concentration Field and Stress Field Prediction:** Trained separate conditional ConvLSTM models in PyTorch to predict future image sequences of lithium concentration and von Mises stress, using past image sequences, grain-orientation maps, and C-rate inputs.
- **Model Training:** Trained the models with MSE and SSIM losses, using scheduled sampling to select reference or model-predicted frames as inputs during training.
- **Prediction Evaluation:** Compared predicted lithium concentration and von Mises stress image sequences with COMSOL reference sequences and analyzed error accumulation during autoregressive prediction.

<div class="research-gallery research-gallery--three">
  <figure class="research-card">
    <a href="/images/research/battery_concentration.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_concentration.gif" alt="Animated concentration evolution from the COMSOL-based dataset." loading="lazy" decoding="async" width="640" height="480" style="background-image:url('data:image/webp;base64,UklGRjoCAABXRUJQVlA4IC4CAABwDgCdASp4AFoAPt1orU8opiSiK1eJCRAbiUAZ+ggq4+25cS30DKdYH6QJmsobkr21SsDb4YqSHqb/vr6e3eCt8qi6QhRpB2xbbZPjU4soM14FAH1o5p6jap9v2Da08YMEtCkuoTSmtvxYEIm1P5oiRcec+n7Z172m7twAAP71CPr4NLFhu+arQT+ct9NDPkmA/AiL1ByPHmzUm7X5suGOaB9Mbqb3TEJD1t4LhBtvf5P0FbBSFUP9uSFQ+J6W9T8/6MGoxcP+Cbl7XCUTfEbyth25gZ3wSYgKXK4/oLKWJ62/1TCwI93XspbcV5t+gDvY/j15ksZR5Q7mwckq6yPjabQPWfggJraeg4ZLqwPKiZj0RwjnBlE1fKwa6NLvPQKl0CqvNW7YF94TsrNTkleatV8tsNR4lpJGy8NLwlXrFucH0/f3MULhxki1OWYHZoSrQyEFo74r94ynPA///wzg/7ZoCaJo0SPDdPFHH93dt+QcS2VOFXaT73Q68FgFYFaYHNCrL7AhCbbOK9Gxn00VvOLSpqfH755r8vrmJkEw7foAa3QHwUyG16MrLOLpYyZXk2wUU3MQUbK8lmzPwzed9De3hn+3JcLpEdFNCzaYRJMNr9cr+PR+6fYbXFJRQTbuBXmy7YFA/44qZopD+73tu5Nl5WqJPUxKOPeA/FyT6z8PeflBBMWuA+GeyzVRneCubsrGZYtWwf0rYQPsDr5fUc2nl9P723074AAAAAA=');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>Lithium Concentration Evolution</strong><br>
      Simulated lithium concentration evolution in a polycrystalline NMC particle using MATLAB–COMSOL.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_von_mises.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/battery_von_mises.gif" alt="Animated von Mises stress evolution under the same microstructure and loading condition." loading="lazy" decoding="async" width="640" height="480" style="background-image:url('data:image/webp;base64,UklGRtQCAABXRUJQVlA4IMgCAADwEwCdASp4AFoAPt1sqlCopiOiqLTqSRAbiWk9xeBphMgadsEcNgI2fPZP/KZd4N3lBq6J5nv3/zn//KPXzKilogv+VP0qNI19NfNFdMeCgL0CfRyHZJdUr2Aoybo+rwZUFRcxFjbiMVBC0kdEopIsoZfA41dOusqITgnqH20ydD9Fb6n8B8V73EMwTd9dDng3Pi0UeV5E/Sz/T9IcRdz0bOQnJzTVgXAA/vZQkxOSk/EQXZMs0wVvwJxsOYQOJeDa6C0RzVK3c7pkwzI7VUi514ke+dDZjVPHuvlugVOBeNv8kZm1/HOX+725TjeacOvR3YCp86gsEbm+nMCq5pmoaTDustxknrQuXjaDnZ04CY4B55r84UZKE4slOr9WK89eHLSQvR68Xl8INxxoh36T9heHCppnKvPHJiQOGXmNiDLOOB9C8CqsnRv2rTJw8ZFgTEg3WEKsHaAlRoeEMH6zgCaEzxNrQpUXzbmtjQkm5BdSFv9dbU2xukwFlxPC+AaZMhVGYkbgj62eVwT1DVz4sA+EuhOZBTCKbezHo1PrEf9TEBUMvO/DQ/GtJthtj9CqqQqWT+9DJuh3rWrQ0G5kgTylKsWoJchqAo1XTiSfSHLsyL5/eIRPigy9xmrao+6cd+vZwmLUMwsDJWGThJfFWiU1LRwzZayJmXWcssw/AcfdnNXpP5s/aBZZARgGliMi7RytWYoxiYlkqQUqjYJ1vzB1c1gJX8vMrVhskg7Qmzx4Y9EOGqzJk/3q7rTrT16ycE78M9llIYAukfxFlFGOACRC6w/JLqC9YPrs8XpvzNaw72+5b/km+CNfkOXKPGJjWy97hPuSEsl0S7J/yCO1YMjX9+PiivqSwc4ftraZuyJAx/LYYMEWym4Bt2tExAcz7bsTdSfKp4IW2P6t9ugsbRYEc50Nk719n7sqIPuFZEYKEAAAAAAA');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>von Mises Stress Evolution</strong><br>
      Simulated von Mises stress evolution in the same particle under the same loading conditions.
    </figcaption>
  </figure>

  <figure class="research-card research-card--grain-orientation">
    <a href="/images/research/battery_orientation_input.png" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/battery_orientation_input.display-512.webp 512w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/battery_orientation_input.png" alt="Grain orientations relative to the global x-axis, folded into 0 to 90 degrees and encoded from violet to pink. Each orientation beta is the local radial angle alpha plus the deviation theta from the radial direction." loading="lazy" decoding="async" width="512" height="512" style="background-image:url('data:image/webp;base64,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');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>Grain Orientation Map</strong><br>
      Encoded grain orientations relative to the global x-axis as a color map for the conditional ConvLSTM models.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_pipeline.png" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/battery_convlstm_pipeline.display-640.webp 640w, /images/research/battery_convlstm_pipeline.display-834.webp 834w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/battery_convlstm_pipeline.png" alt="ConvLSTM prediction pipeline with concentration, grain orientation, and C-rate inputs." loading="lazy" decoding="async" width="834" height="480" style="background-image:url('data:image/webp;base64,UklGRpQEAABXRUJQVlA4IIgEAACwGACdASp4AEUAPt1eqE4opSOiLnK8WRAbiWYAzMRsUClydt1ztHo53k/easBVs0c+/QB2gyyod/KJWa+ASNIPRfHU4zvLA2sMrtL6HYz8dr32UIHoWl9RvyKBmDerAitnb2t28K64+MLQ30viBGo4eZ3fLdluAI1cGAQSYLOC+aZV+mPnzR4D1xzpJ+C88aENxBaPkxzj90PNYPoqkBvfoaEYw2F++EN2eCZhxF6tNJyxn0/VyyPAZiUK8Jf9MDb0u249k5YL9PtJTkVAAAD+3L34vE5wuvWiRi3+Z+HO93DC7OAZW4YMK+jOqnnajNo0IcZKt2k+to1z/k4IwV+64gCuq97oA3nM/+h/nW/EJ4eyZpbwX3GDxhJGH/jE3Y7BpZIBO+O7HJNn1zHkvKhTnZGKHi8jMy6hhbJrGc01SGbq3QMpLvnd4JPZwjcHME+k/SZpQH6+C6JgMUeKGyVfsZhjoP2ZvTIgjmax2D25ZO5RKy6DnkIMtqybuz1fJn/cXKNF7+BUNi7rJ0aKlJ0zKEPqmLmRvzEfTR5sJnKBqZbMj+BIZ2YixeQG7Cv/0LcWZhQf2qrHZMfs+/IUAflzkAF+89i6zgIDkLKtFhGBqGtkcw7mAWSBLpRzDZrNyGA4Mdgz6wch13cg237DvABJN4gsK4fHX95wD7yzMAY2x0sbB2vsjfWSi51oaNcnE03X5IGtPqXSo9Lyk4hmq2wh2xXpIkz8zXQ5xHdQXrR+aEfDn6zHjo5ZLxNLFctv+NgCGtNBCTBDXoCyyL1sMJrKuiBoiCFFfpIz3ZXkyH73Plc159iQ06ekTgl+oO49fOV4M4cMvcWz1dLJVcKLOhcXBp1a7sL2mhOcFg2NdAFStk0ivr7oz9rSEscZ32QRF1f3N37klTGpn6rX/ksRbChjCOlGoVZgGRtsEil3wWkmcg9CL0q9GWQm/qzwk+ejsq8vPLW2zIUha/bZQxukHpG0DLz8YpwdAUfmp+BrfatP5O12ybIYN9O+5exC1TfGM9Iei92v/4G5k8AVtiIZeJgIkPZJLOzBN3hfH9h+m9AID+PgO6T3dPd8vEb5sgU47eV9YdB/OEo4wTYCiUn/qBx55a+Avp6bL/dBrS2lWjvb57b6vZJORS++SVFlBJJNbx84p2terbzwXxw0+OClp3gbAEwIApU1wZ2xDV1N81YEpfzHFIJmAlP/ywWod5WkcOwiDYKp+Wu9fOsD6Cyy4/BNksBz1LoCAAyhm9zt/Ar2IFhSEwI98sDo8ORjQZkXbgMmHAW6WCZzRV3Iihgk79fKch6eYLOMhi3HISbd9rfePe/P8turRrGZaLF8xOAnFXlIt9X6DO2qTrn7XQp8Dui+0PIgyrxC9YRIhUJMVBV3FDe0Nu+jT3BnB4cYULpDeTCiiheyHSbXsU4nfgbhBts4cLQVbIIabPVlwb/2jKNUI3uYpTDLolK0G8TbV1WASdHNukU4wUXRZFqiFxcR9ES/eGGZYa9ACax7SM/RT944dh2ltg0Ma1e9DoAsSsm2eTF4QUqgAAAAAA==');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>Conditional ConvLSTM Prediction</strong><br>
      Used separate conditional ConvLSTM models to predict future concentration and stress image sequences from past image sequences, grain-orientation maps, and C-rate inputs.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_convlstm_cell_clean.png" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/battery_convlstm_cell_clean.display-640.webp 640w, /images/research/battery_convlstm_cell_clean.display-715.webp 715w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/battery_convlstm_cell_clean.png" alt="Internal structure of the ConvLSTM cell used in the model." loading="lazy" decoding="async" width="715" height="513" style="background-image:url('data:image/webp;base64,UklGRm4EAABXRUJQVlA4IGIEAAAQFgCdASp4AFYAPt1qrFEopiQjpLSb4RAbiWUA1Z2bCAbe/n27JywFWzvrsd4Pw0UK3EyrQaV5Hn2Rgl2+Qg37qnUUQmyVOKKjQyaPshs3JHUw+FrI63DJdzdtmsVS8MvRtX5ugKcZBb+oZp5LUbAQXbW8e6VYoxfZKqXUtoEOD/2cmr6FIEu83+EPAYzgrglvcgFVJbjkhN5GPVy3LgecNDg94i5kPyITwAy1TVyp06yuUQ6qb+o1gAD+9W02Tews8vL9BZj09oMbA2RQBGQWmAUDeM/fLschEyReP39w4eYrvdVGm1Ul+Myq2PjnvYF/47jzvdTiONOZlkZRegLwHkoQXPFO2EQ6Gi2m+6cNQbiCPbBWRkdw3B2XGLoSWUhKNCYn1VsR5K8R/o1boFJ4VGYHJHGLwRurCKZ3kz0w6ElL1l2ksGyLBpBuKaVOICawR4MDpkL+nDkQYe4+0+BfcDugiB1RRsNxnaBH6Eg6PUGik3QaUbCaUDG/ubyWxsvJ47bEiHm4A/CyZTHZsNpgPIJTXJMwZp6Mw/E1W8qjl3cXPfhtGiefc3UnQw9dd/XXWjXXmc4dEOs25hkysYKfQXlgphP7wUzaxs4pXnKbUQYL3piMwkJKxnWRhvFwXtj8WatuiNdh4atkOUt2kmVIWOZhRz7GF7D1lX5LYILXmHtwdat9G4+XflmpNMZyHP7hMTuBV9LZy4A0xKbbIy2daUxXX0H1GjcPfPU6MNZpzBk2CCXdCQCbP3yI6Cn2CQFlkfopBJkRR9/vgp54OWiuu+sNDnQsYFuL9rH4aiXFZ9VoGj8LB74NGSwvPSH54DAgDueBQrx4eh8uD17ptNBCM94kB90pJMOFwt5MB7OTc7bIC2OvegRQZMFL9mFCnUjTGxMQ7ot8cjNwAOYo7NVs5bOpDwAaFIrnAOu490h+s5FirdB6iInHus9Kl5if97rjfa7EvC5iZKdHXjgVQiySh5Ca7x2LidrfAk1ktQsXteGWh8kBcOwd07P7Aw3Bk62kLUPNmUVDFSymObwL+zyxTb4Bwj6nzZP/EIJ8zcIrT6mIYF99oNzwqYD8rZcnG8osl6u8Q3WSDRAMD8ZiHAnu+kTQ2XsCRjkDxOstH6SSBaHxgSOl27Bd5XLU1aD+0lVSY2KVRWZ4aLClVz8vFmBFSaNGsECvo+uTmMqM5meJAFxNp5IE8cak9HkWMSavcGWht+rbuiH1k2dOovuXzXdgQqAV09DaAuTU9C3UGPtTzmni2fzUi6xyeRTuDqGD6js2nRxSRn6/HmEypyxSQOxyjVa433BS9XOmtLjo7DNsrb/BSdyYLAGWansLl7bNkxxWmCusHR8osFoQWMBf5/2A/YpjQUMpEjOr8TQtbL3om2TpIKr5DG16lcL13vpckB4MRgnolmr/gEiruF1czjkN9KJTcdSffOFuS/+Tz5CPdrwvc1I+aRFMWZwpfOTKSfkA5DzyjKzOc3IX8Tg1kAAAAAA=');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>ConvLSTM Cell Structure</strong><br>
      Used convolutional input, forget, and output gates to update the cell and hidden states across the image sequence.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/battery_scheduled_sampling.png" target="_blank" rel="noopener noreferrer">
      <picture><source type="image/webp" srcset="/images/research/battery_scheduled_sampling.display-560.webp 560w" sizes="(max-width: 900px) calc(100vw - 48px), (max-width: 1280px) 50vw, 640px" /><img src="/images/research/battery_scheduled_sampling.png" alt="Scheduled sampling strategy for autoregressive sequence training." loading="lazy" decoding="async" width="560" height="419" style="background-image:url('data:image/webp;base64,UklGRhQFAABXRUJQVlA4IAgFAABQGACdASp4AFoAPt1iqlCopSOiphHNURAbiWUA0TMs5LTKOyTrNmMsuDlh6SzG36RWg3/BPwAO6PAS6LpSwZnHq8I0pgWiC+lleWQ0qeURkULjf1NQITiI8mtEWs69onhh2W/U3K7it+3GWl+xCH3bDfNb91iVYz0b9840qhb0I04VsTdGWaJUd4F+ddgETUSpZS6k78dL9pv6ZRHPIXAu3Vqao/5+dBa/MXy11Rwa4WRHlmvoSuZ4NlHRZBCiFI+BEEQBna9EZ3UAUAD+9lCZD9sn0GmAX9uW7yu+A3j4x5ktzX5pxhc2voEIfVpxupc0XYKhzw0/47zRqoe4RTinQgF2HHp97Hh2ieHZmdak0J0cN0xFPLzgaRYF9dNkiMkXaW5jPY7pVdWadkGxpY8MmjqmShTkYLxg6rvlB9O5lB/RveFcmjUShgDvpq0xgfW1gt+kxB3e/PyRixUvTJUm7B8lpI9LNiwWcAu2uXxm376SX0t03I1q/ig5z+QOjI43T/qSyWDTzgo+0Oon83BHAEBpukwrIpDMN1LpuKHHabig5CNohpNuOy1OuxPDJQQsDBfisZESgwfiNlBUtf6pIIHdiAW2eYwu6+Xjv5RYxw8LGcDITw5Xei4cF9ld/L70OjUJWxUevLO7wMZRV8+OEkZMBLjTM9ncQ2MfxqV9lFoal7/WgiYbR4J9QlYkZPoZvwpoh+O+CZ1j+/MTZQPCIgikbJ8V6jMBQTsB94AZbIwRdlbRf2Fo1rwQzx2Z+hltBaHGxr6PAhJNgIo/ouvRTZiEeC0rbexKuEBOyvf4cHKiBFV+Kr6+CdmzzIUWBySQxFR0Dx5/g5Ua1iSIy985N7C/z8wu/84JmM1OscBzYc88PcNH4+unZexA/mWkw6i98Kq5sZKTgMyYGmfijXRD+w2IjA22TpLv43h1IO+3EymO6r61Q3mt+YvE8a3ol7nbxKAnHAQsHj4K3NOWdSTsqrtUaj12UqLi2NyA13CEstS/h4ar9lda1fUfzX+Jg+bIhL1Bd0B6JvOadQi7bup7dKdgPB+5aMQLDRpUmRh7ILJ5kREiiFRX+zPOKF7ZN2vLQQmjUMdRH0TjjgnB300PbS7j3lhd/Qn8Pk1q/Crhmo7vnKhNXkIH4pSDWAbznGujYkgY1kYnXJWDkSjOwwk2Tg/vX0srXZyYH6kUCsPhNbBp6C+9wFPuKwnNjD3EvLw5ciAQZK8aFSSdMgrh7uPw+hMPKYcWBxPpjZyy/aDOkWjfWnFVJfpOB85p5np1E7Hl2QvSq2D4Ocs0RzoXazNPZIMMcPr5Nj3+gsVq1cyJ3kHJ0RA5+12LQTqLikCfGm3NnebcwNNv5NIxpSz26T9JBnZfNekTx+a/wHhZRFXwRBluhc63xO+c8t9hfail0/KS38Y0wIJSaqSiAAmiGok5Qp785aFNjiC+y0A8EfAz9oB6iVZpQ7MGeUA3YhgK+K75HFEBfw47FZLeGE0u24f8CPgZUhFykiG8RI/B08cTsvj2qi1AnlHba3pHAKZ6lA7h1yyzNqKBCb3HJLLOkqi1LbZLzpaAf/8axac7XPTHylWZDHNZjW2ljpLN9lbnNQ5cbikrx1HqHrAWAqwDvS5NkiMuCvbAA45arhHXWMA1sluJE9CDMQkMkV+Qn8lGMveCpt3KQkAmZpTT0OXiIAcCVWaRxE8eEp0zc2J9tQ4Di3r6YZGJQAAA');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
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
      <picture><source type="image/webp" srcset="/images/research/battery_prediction_summary.display-640.webp 640w, /images/research/battery_prediction_summary.display-1280.webp 1280w, /images/research/battery_prediction_summary.display-1920.webp 1920w, /images/research/battery_prediction_summary.webp 2332w" sizes="(max-width: 1280px) calc(100vw - 48px), 1232px" /><img src="/images/research/battery_prediction_summary.png" alt="Prediction summary comparing ground truth, model prediction, and error heatmaps across multiple frames." loading="lazy" decoding="async" width="2332" height="1145" style="background-image:url('data:image/webp;base64,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');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
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
    <span><em>Undergraduate Researcher<span class="cv-project__separator">|</span>Advisor: <a href="https://aero-mech.tongji.edu.cn/50/cc/c22274a348364/page.htm" target="_blank" rel="noopener noreferrer">Prof. Xianyang (Tom) Chen</a></em></span>
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
      <img src="/images/research/pinn_shock_problem_framework_v8.svg" alt="Burgers Riemann problem setup for x in [-1, 1] and t in (0, 1], with analytical shock sketches and a PINN coordinate network. Automatic differentiation forms the inviscid PDE residual; initial-condition and boundary-condition evaluations separately connect to their full loss sums. The three weighted losses drive the training loop." loading="lazy" decoding="async" width="1728" height="922" style="background-image:url('data:image/webp;base64,UklGRm4DAABXRUJQVlA4IGIDAADQFACdASp4AEAAPt1kqU8opaQiKxLryRAbiWcAz+OdXDdja7t7qDMSnmPBp/EigAggDGWkYyyeHuODQL0IIz95knbS/sOtizLJdvzrDksiEnaB9Wn3T12daXwELhIBeFLb90q4GciAZp14AhlaEECRBb//uv7f+4DTACOAvb5TRF2IHa8DM6wS6Bs+H0EsbqD7DUgrotBNc08ba9oMEswGSXRCRv/KeKe2ESHCUQAAAP72BdJ3fAitkEruMT1zO7dUPfiX1FyFeX0mWhlae9haTmLjv3w0K+bt6y0uQT5dw0HPpJ2eEwuBW+XbD7AvMHorYxQLqT4cvhRphp7rri4Phcm+7e0fNtHB3DzCa/788w6oWd/lxiTyBdQvKo7QCyihd1dhtNpMDY585imllOg8O45S4wv17n8k5TLlyJw++QOLYmRj6SyCMs9n43Zjn1ROF2PGb7FE3reDSLfuUDUn1UWTTykIOpvQoM1XAfMWkll5tegzs9WheppY1lUcDd23gUlhYDioEb8bvaW7AV6mshKacG6h2lZl6D6E5BOHcrDx8ShjXvv3l4Hj8ObpUPOQvIxseFt64o7C7momURAJUtz9eN4ZNLL3U2vfgCyzMLLqnnZcDQAphERyU92y2O036hqQ4HzgyuHGPdyeGggwzoVwYUzHFo+hYrwiZ8hY6/3MwKiq+HQpDVPxky1mxOFgFI8e/eWctG/B5zYNxOMbIE860IwtOc/66Z8eUsUsJ+etGmcV+muPMmKX7ZbNeRnuloOXmIKXnDfEJktT1Ipb6KvqsQGrGXZDGoeaM6BLpCreQoM1tPrg2oxswOrZsHsF4+mj+HPx2pmMMavjZSI5JswsnPkA74ywg35hKpxyXZqqlFbDaGIicO57F/Vnrdu+S63B2VAsQCx/V4ldCQ//5gZe0LrtLQf50+WPXSlKBTpqmqf05VK/RbuzNnmGES4WhqcMI/WR662BINWMKGD1CG7jLl6TgO0JlG9vCyvjCcnG6lUwuxYPUl6YOzrfEjEhSqAVqM5ZANZ/KdoMh+Mx1WplzTKig3udLWV4AMjx5NQBQ1V9TTp5IhsFA6giGbxlC+Bqq+EtIeTYPsVGktY/VN/WSgApl05ej3hD2gan8+/s4UI6cEvjy5LWlAO9C4AAAA==');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>Burgers Problem and PINN Training</strong><br>
      Defined the inviscid Burgers shock problem with initial and boundary conditions. Trained the PINN using PDE-residual, initial-condition, and boundary-condition losses.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_motion.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_motion.gif" alt="Animation of the exact entropy solution of the inviscid Burgers equation, with left state 1, right state 0, and shock position x_s(t) = t/2." loading="lazy" decoding="async" width="960" height="900" style="background-image:url('data:image/webp;base64,UklGRkoCAABXRUJQVlA4ID4CAABwEACdASpgAFoAPt1qq1EopiOioqzZEBuJZwAu/99OsdY0U49AxcIv40qNMTwXqb6LZ9WZz2pZ1zG4SJZDgC5WOrUsLTvsWJu91MRocLPLysxvV/xfiwZJYIsftfgJXJpmkwZ/2X+xRWlzpMFZsB71hY6xqEgYlBdsIykQaV1o6BBca+SPtLyV5CBIAAD+9fvOg37e0p/SBK6etpwo22ELx3qdLENOhs3DRH/SCQtT84a6+IVa5VdswRygKx38wWT55XluYQx/MTyHj7F0CALYTPKVBOHty4KfKK2E7/8c+nR4ODhWfGOZHKMJu6xROfkc6XgoGHGl3JGGa1bfIqs4GITGepIei+YkyqCgE+ojJrM13rMMdYmQYSLaviU5bs5z27T0ul6rFd6bC4v9TH7CimQvU1HxatL+Zw7ernsgLN0XxdOVglhuvakJ62U0wscSV21397PWxiJnue7he6BZopEaxvOZadHgCx2t2peP3Ba95CLL8lS7+iiuaP/crzFB0GsFO4EHpZwPXuszcA1aqhuj++owlXnMi5ISoamY5rXifAO324EZW9SPjTEV56jqPB1NG2Xqw8ta4UYtwmRrON8yZ+tOOJ3cpG1ahKS4U0bYhCkklQwtr8H7TbNTCx4j1iexXGmct+dONZQa2mKav7HDCEgRtotmVO8ALSAFFnPxtDU8aAgMHmbAnZhAUwvWzAiDhOOeBUcmu5mjnrcPauMURp968wPyixOhP/Uu/jLZCuDibsaW9cCgsBwA');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>Analytical Shock Evolution</strong><br>
      Illustrated the analytical solution of the inviscid Burgers equation, with a discontinuity moving at a constant speed of 0.5.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_shock_trajectory.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_shock_trajectory.gif" alt="Animation of the analytical Burgers shock trajectory x_s(t) = 0.5t in the space-time plane." loading="lazy" decoding="async" width="960" height="900" style="background-image:url('data:image/webp;base64,UklGRgICAABXRUJQVlA4IPYBAABwDQCdASpgAFoAPt1srFGopiQiocx5EBuJaQ3M4J+fUyNUzjUHTwN/kiVrO+o6DP8I92kTR8NyqbMLvLS3SnNO/u2CJ5n1t/3ze+HfqYBfm7pYlMcwb7vofVWAf4Bksb4D5oZObSCixhWS1gG7qrdeCJMtwAD+9W+GPjLk24nE4SzjrVAGr+nYjUHowmGy0jNsGYpByibNPa+CkKwc/+cU6gT3zn/pYLJ8IHU1ynBrypigd3+BdfZrPAquvYh7Q1/lo2FY+0LVmTIsXWZJrV6vac9zB5cozXm20McD+3jt1UMPqyEatvj4wubX2s+4TSOTveG1rOatiFx7qKxyOd6tAtU0nXhfJkmA0A14HwqYogt7mILgxvW65ebFpawr0wHtvo8m1tjnsM4Au2NcvaAnX5GMpQ8a46uOFUgZdF229UBoPhNJ6OffprTd/omG5Q7KSmqWr6X/LtQOaCEnWRalFjJqB796QTSGpUR5DxUDrPTATKx6ve+ISqeJtBTSKOcnWEA3BoU6errVWU6EetsrWIoH8iseSAmSZxBje0mCBCitYaOFWdSGwDQ3pVN57Q5VyvwD0a2I6a3fDfUW5JJ/J4SZus11d9rdniq6yduHxtaSJZ1FfTIiS88Q4ioBMmmbp/g0jlL5ZygOWmlksOMHVh0bkAAA');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>Analytical Shock Trajectory</strong><br>
      Tracked the analytical shock position along x<sub>s</sub>(t) = 0.5t in the space–time plane.
    </figcaption>
  </figure>

  <div class="pinn-prediction-comparison" id="pinn-prediction-comparison">
  <figure class="research-card">
    <a href="/images/research/burgers_standard_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_standard_pinn_prediction.gif" alt="Animation comparing the standard PINN prediction with the exact solution of the inviscid Burgers equation." loading="lazy" decoding="async" width="960" height="900" style="background-image:url('data:image/webp;base64,UklGRsACAABXRUJQVlA4ILQCAACQEQCdASpgAFoAPt1kqVAopSOiqBOcuRAbiWcAfl5Dd1IhQW1BpgFPOexThUEpvej/lvKGTFgdBhKDhXAMj33I2Molpsjr/hghkn8G7a+6DDM8sA5nq1gUWBSgH3hTLaJ01Ujp+TazlDjLf46x/RlSFKMF69DO4MJvZa/8RqpQdlW7TbPOJ7FISCjPfncLtCe3WC4O+AD+9qjuxJtXIFCuZzbO2LDc0+rMmxSVpIZTuFQh4ozjZY15ja9vzYEc9Uq8EHI9c0LVrq2juG8XM1+nIHrK+mSkqCone0K1nGNYqzqPRb6c7PV8/RBmU8mciZV33lCD8LmY0pr6A5Avvb/GCQMbbsX9ED3uKV7SPw4w18oTzEOk+OzrTXSWrwoiZNptfHcKENvRaNZ/B0r7kbava0QTrk07ENMrJnOB/tRryVr8XCaWFVYHf/oFiCihw6t0TANY+Wtcc+LPawf3NLu0PbS3twLNINrnRFCv91rWm6X3zzZRwd1j/0IARzNPl+1DEucKW4Dbqpv/F/+jYMMIfKSVbgvfOY/78tlGFZFEQD+iOBkh20KmkgGMCmKgGIkhG/MRMIo59ChUzgbAw3gNVtS9u/5dUDNJESae1fCbhhpQB7knepXvKQjfdUNChFKEv3XaYrz8pa/VZQaX/dn9OBUUI+fKEFem7bq3w742dgwVc8bCtLxC0LUzrw1oPOsegOkGXadjWoHpbgRIVMyzTMLhBSxSePYjm3fCJKUZO3tPVvi/yig1ttScaMLaKeFqXsXBzLA4RIci7AoLwYM7jPC1bgOSmTpJuAei1f6vYwZ4lbMyKNmd9712IbKHmxzj8uGoKq9yyPkYSjHrIcTtgHDG5RNWgDugiXxFaPwWn0Nj4JOrs1BJhyJx1tiRNtJTYYKUOi+CNa2Ka7/WhIu7TIAAAA==');background-size:contain;background-position:center;background-repeat:no-repeat" />
    </a>
    <figcaption>
      <strong>Standard PINN Prediction</strong><br>
      Compared the standard PINN prediction with the analytical inviscid solution over time, examining the shock location and transition width.
    </figcaption>
  </figure>

  <figure class="research-card">
    <a href="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" target="_blank" rel="noopener noreferrer">
      <img src="/images/research/burgers_artificial_viscosity_pinn_prediction.gif" alt="Animation comparing a constant-artificial-viscosity PINN profile with the analytical inviscid Burgers shock reference." loading="lazy" decoding="async" width="960" height="900" style="background-image:url('data:image/webp;base64,UklGRpwCAABXRUJQVlA4IJACAABwEACdASpgAFoAPt1kqVIopKOipHZsoRAbiWcAU/NQAp5HjDZnLKBuGjCp3yEWJUuR+8VvtfJonWyERqJnkQbJ6lTVcbg1q7ugNwoSSSdnWIU8PHsdhXfQNsynXrlJGlaNynyT+iQvwkN0olY8I/B0FebyCFBhefHISzCzmiuo9LGDZi++ZdbvfY/gAAD+9qks9r5XaGueO2CYrskUVTAQMby3wscRt0M2i0yJVnES1B0bU286aUpUq2PVnHgIcg2CCDyH/GMQuTL7nVUu8j/FugI3lFMeSefqB1c7TanfJMZh/etujM8o/CNxlQIDo8gEdfuSvLij3c4j2lu26+7aJ9X0fv+vMJHbkrNFm7HCj7R54MHJN6LG03itWDEVZCDqB1Rs4C02gb/TyTcWqFsxHx0+4m/wr8L8IqycTtomvdRkZR4Dk9LGIUDyok+RQgzAM2ebq/xwq24Od1mLlUFmghM02k65o4Oo+I8XUePYb9AOtX4HWYtpBAVn+mar+N772pnFbHoaI4ktqkAChsZPqwfGRj1sZL5uenYwLgV1OOKfNhcihQogL1/F2M6upukId3DmaYkBZ8VTFWv2/IfSwU+yNBeMngyhvRXRcKA/piQC6URXug5RyvIkGR9UY2XJ7W5Ofy1dqyehrWCUzYyh4Q/t8z6VOSXm385qczX7xKAFRQN6U4l+O2bhm0D6GIAC+HFjYXmuULsjEUHU8wjZgKysUcoKiMOXQH0+J7NuVhh9mauDMYdhR6mE6LAHSDUEXsFiRlA7TJqc+vnKSVcf6jNonrTLQHzrjV4TJm05TiMy38VzxAKz16i8qFcYmDQ3GZJ5kxy9VXEYozD1aZJSOQVsCpsbUFn1vWvMKNUAAA==');background-size:contain;background-position:center;background-repeat:no-repeat" />
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
    <span><em>Undergraduate Researcher<span class="cv-project__separator">|</span>Advisor: <a href="https://aero-mech.tongji.edu.cn/3a/6b/c26961a211563/page.htm" target="_blank" rel="noopener noreferrer">Prof. Ying Zhao</a></em></span>
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
      <picture><source type="image/webp" srcset="/images/research/llm_finetuning_workflow_v2.display-640.webp 640w, /images/research/llm_finetuning_workflow_v2.display-1280.webp 1280w, /images/research/llm_finetuning_workflow_v2.display-1920.webp 1920w, /images/research/llm_finetuning_workflow_v2.webp 2816w" sizes="(max-width: 1280px) calc(100vw - 48px), 1232px" /><img src="/images/research/llm_finetuning_workflow_v2.png" alt="Workflow diagram showing self-built mechanics dataset construction, Hugging Face dataset publication, Qwen2.5 7B LoRA fine-tuning on Google Colab, fine-tuned model publication, and the final AI teaching assistant." loading="lazy" decoding="async" width="2816" height="1536" style="background-image:url('data:image/webp;base64,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');background-size:contain;background-position:center;background-repeat:no-repeat" /></picture>
    </a>
    <figcaption>
      <strong>LLM Fine-Tuning and Release Workflow</strong><br>
      Built instruction–response datasets for mechanics of materials, fine-tuned Qwen2.5-7B using LoRA on Google Colab, and released the datasets and model checkpoints on Hugging Face.
    </figcaption>
  </figure>
</div>

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

