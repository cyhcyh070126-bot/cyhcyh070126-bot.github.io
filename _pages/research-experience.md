---
layout: single
title: "Research Experience"
permalink: /research-experience/
author_profile: true
---

I am currently working on a research-oriented mechanics learning pipeline centered on **single-hole local operator learning**. The goal is to train a **Transolver-based neural operator** that can generalize across different internal-hole shapes, boundary displacement functions, material parameters, and hole locations, and later serve as a reusable local building block for more complex perforated structures and coupled simulations.

## Current Project

### FEniCSx-Supervised Local Operator Learning for Single-Hole Domains

This project studies how to learn the mapping from **geometry, boundary displacement excitation, material parameters, and hole position** to the **full nodal displacement field** on a local mechanics domain containing a single internal hole. Here, *single-hole* does not mean that the final engineering structure must contain only one hole. Instead, it defines the **local closed computational unit** used to train the operator.

The current workflow is built around four main ideas:

- generate diverse hole geometries, including GRF-based irregular holes as well as standard circular and square holes
- vary boundary displacement functions, material branches, and hole positions so the operator is trained under multiple mechanics conditions
- mesh the domain with **Gmsh**, then directly use the **finite element nodes extracted from the mesh as point-cloud inputs**
- supervise the model with **FEniCSx ground-truth displacement fields**, so that strain and stress can later be recovered from the predicted displacement using finite element shape functions rather than being supervised separately

## What I Am Doing

- Building a dataset factory that creates mechanics samples across different stages, geometry families, material modes, and hole-position settings.
- Using GRF-based geometry generation to produce smooth irregular internal holes without sharp artificial corners.
- Meshing each domain with FEM-consistent discretization and extracting the resulting FEM nodes as the operator input point cloud.
- Applying boundary function libraries and solving the resulting PDEs with FEniCSx to generate displacement-field supervision.
- Training a JAX-based Transolver neural operator that predicts nodal displacement fields under varying geometry, boundary displacement functions, material settings, and hole positions on the plate.
- Evaluating whether displacement prediction alone is sufficient for later recovery of strain and stress quantities in a mechanically meaningful way.

## Why This Representation

Instead of uniformly sprinkling points inside the domain, this project uses the **actual FEM nodes extracted from the Gmsh mesh** as the point set. This gives two advantages:

1. the point cloud is already consistent with the finite element discretization used for the solver
2. once displacement is predicted on these nodes, standard FEM post-processing machinery can be reused directly to reconstruct derived mechanics quantities such as strain and stress efficiently

This makes the learning problem more physically grounded, keeps the representation aligned with the numerical solver, and is helpful for efficient downstream processing because later FEM-style operations can still be applied on top of the predicted field.

## Research Snapshots

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

## Current Direction

I am continuing to improve the full pipeline, including dataset generation, operator training, evaluation, and presentation. A major focus is making the whole workflow both **mechanically faithful** and **easy to generalize** to richer domain decompositions and future coupled simulations.
