"""Draw the Burgers/PINN overview from exact geometry and mathematical text.

Run from any directory with Python and matplotlib. The 2-3-3-1 network is
explicitly schematic; the implemented model has eight hidden layers of width 64.
"""

from pathlib import Path
import math

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Circle, FancyArrowPatch, FancyBboxPatch

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "images" / "research"
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "mathtext.fontset": "dejavusans",
    "svg.fonttype": "path",
    "pdf.fonttype": 42,
})

W, H = 2400, 1070
fig = plt.figure(figsize=(24, 10.7), facecolor="white")
ax = fig.add_axes([0, 0, 1, 1])
ax.set_xlim(0, W)
ax.set_ylim(H, 0)
ax.axis("off")

NAVY = "#20344b"
BLUE = "#2166ac"
TEAL = "#147d75"
ORANGE = "#bd672c"
GRAY = "#71808e"
RED = "#ba4540"


def text(x, y, s, size=18, color=NAVY, weight="normal", ha="left", va="center", **kw):
    return ax.text(x, y, s, fontsize=size, color=color, weight=weight,
                   ha=ha, va=va, zorder=6, **kw)


def box(x, y, w, h, fill="white", edge="#d6dfe6", radius=12, lw=1.2):
    ax.add_patch(FancyBboxPatch((x, y), w, h,
                 boxstyle=f"round,pad=0,rounding_size={radius}",
                 facecolor=fill, edgecolor=edge, linewidth=lw, zorder=1))


def line(points, color=GRAY, lw=1.5, z=2, style="-"):
    ax.plot([p[0] for p in points], [p[1] for p in points],
            color=color, linewidth=lw, linestyle=style,
            solid_capstyle="round", zorder=z)


def arrow(points, color=BLUE, lw=1.8):
    if len(points) > 2:
        line(points[:-1], color, lw)
    ax.add_patch(FancyArrowPatch(points[-2], points[-1],
                 arrowstyle="-|>", mutation_scale=15,
                 linewidth=lw, color=color, shrinkA=0, shrinkB=0, zorder=3))


def node(x, y, label=None, output=False):
    ax.add_patch(Circle((x, y), 21, facecolor="#fff0df" if output else "#e5f0fb",
                        edgecolor=ORANGE if output else BLUE, linewidth=1.4, zorder=5))
    if label:
        text(x, y, label, size=21, ha="center")


def edge(a, b):
    dx, dy = b[0]-a[0], b[1]-a[1]
    length = math.hypot(dx, dy)
    r = 21
    line([(a[0]+r*dx/length, a[1]+r*dy/length),
          (b[0]-r*dx/length, b[1]-r*dy/length)], "#71808e", 1.5)


text(W/2, 48, "Shock Problem and PINN Framework", size=30, weight="bold", ha="center")
box(30, 96, 695, 944, "#f8fbff", "#b6d0e7", 18)
box(750, 96, 1620, 944, "#f8fcfb", "#b7d6d0", 18)
text(60, 142, "1   Problem Setup", size=25, color=BLUE, weight="bold")
text(780, 142, "2   PINN Framework", size=25, color=TEAL, weight="bold")
text(60, 190, "1D inviscid Burgers Riemann problem", size=19)

box(60, 227, 635, 103)
text(82, 251, "Governing equation", size=15, color=GRAY, weight="bold")
text(82, 291, r"$u_t+u\,u_x=0,\quad x\in[-1,1],\ t\in(0,1]$", size=21)
box(60, 347, 635, 103)
text(82, 371, "Initial condition", size=15, color=GRAY, weight="bold")
text(82, 411, r"$u(x,0)=1\ (x<0),\quad u(x,0)=0\ (x>0)$", size=21)
box(60, 467, 635, 103)
text(82, 491, "Boundary conditions", size=15, color=GRAY, weight="bold")
text(82, 531, r"$u(-1,t)=1,\qquad u(1,t)=0$", size=21)


def shock_plot(x, y, width, title, shock, show_shock=False):
    box(x, y, width, 259)
    text(x+16, y+27, title, size=17, weight="bold")
    left, right = x+40, x+width-25
    top, bottom = y+74, y+215
    zero = (left+right)/2
    sx = left+(shock+1)*(right-left)/2
    arrow([(left, bottom), (right+7, bottom)], NAVY, 1.1)
    arrow([(left, bottom), (left, top-12)], NAVY, 1.1)
    line([(left, top), (sx, top), (sx, bottom), (right, bottom)], BLUE, 2.3)
    if show_shock:
        line([(sx, top-9), (sx, bottom+4)], RED, 1.3, z=4, style="--")
        text(x+width/2, y+60, r"$x_s(t)=t/2$", size=16, color=RED, ha="center")
    text(left-12, top, "1", size=14, ha="right")
    text(left-12, bottom, "0", size=14, ha="right")
    for px, label in [(left, "−1"), (zero, "0"), (right, "1")]:
        text(px, bottom+18, label, size=14, ha="center")
    text(right+8, bottom+19, r"$x$", size=15)
    text(left-17, top-18, r"$u$", size=15)


shock_plot(60, 599, 304, "Initial condition", 0)
shock_plot(381, 599, 314, "Entropy shock: t = 0.5", 0.25, True)
box(60, 883, 635, 125, "#eaf2fa", "#cadcea")
text(82, 916, r"$x_s(t)=t/2,\qquad s=(u_L+u_R)/2=0.5$", size=21)
text(82, 956, "The faster left state forms a moving shock.", size=18)
text(82, 984, "Blue profiles: analytical inviscid reference.", size=16, color=GRAY)

# All 18 connections are drawn behind opaque nodes, with clipped endpoints.
box(795, 185, 1525, 254, "white", "#c8d8e5")
text(817, 215, "Coordinate network (schematic)", size=18, weight="bold", color=BLUE)
layers = [[(855, 282), (855, 354)],
          [(1130, 264), (1130, 318), (1130, 372)],
          [(1420, 264), (1420, 318), (1420, 372)],
          [(1740, 318)]]
for first, second in zip(layers[:-1], layers[1:]):
    for a in first:
        for b in second:
            edge(a, b)
for k, layer in enumerate(layers):
    for j, point in enumerate(layer):
        label = [r"$x$", r"$t$"][j] if k == 0 else None
        node(*point, label=label, output=k == 3)
text(1790, 318, r"$u_\theta(x,t)$", size=25)
text(855, 405, "Inputs", size=15, color=GRAY, ha="center")
text(1275, 405, "Hidden layers abbreviated", size=15, color=GRAY, ha="center")
text(1870, 405, "Output", size=15, color=GRAY, ha="center")

# The output branches directly to IC and BC; only the PDE branch needs AD.
arrow([(1740, 339), (1740, 463), (1047.5, 463), (1047.5, 650)])
line([(1740, 463), (2077.5, 463)], BLUE, 1.8)
arrow([(1562.5, 463), (1562.5, 650)])
arrow([(2077.5, 463), (2077.5, 492)])
box(1835, 492, 485, 132, "#e9f5f1", "#b6d8cf")
text(2077.5, 516, "Automatic differentiation", size=17, weight="bold", ha="center", color=TEAL)
box(1858, 552, 94, 55, "white", "#9bc7bb")
box(1980, 552, 94, 55, "white", "#9bc7bb")
text(1905, 579, r"$u_t$", size=23, ha="center")
text(2027, 579, r"$u_x$", size=23, ha="center")
box(2110, 545, 190, 65, "white", "#9bc7bb")
text(2205, 577, r"$r=u_t+u_\theta u_x$", size=21, ha="center")
arrow([(1952, 568), (1964, 568), (1964, 538), (2165, 538), (2165, 545)], TEAL, 1.5)
arrow([(2074, 590), (2110, 590)], TEAL, 1.5)
arrow([(2205, 610), (2205, 638), (2077.5, 638), (2077.5, 650)])

for x, title, formula, coordinates in [
    (805, "Initial-condition loss", r"$\mathcal{L}_{\rm IC}=\frac{1}{N_i}\sum_{j=1}^{N_i}|u_\theta(x_i^j,0)-u_0(x_i^j)|^2$", r"Initial points: $(x,0)$"),
    (1320, "Boundary-condition loss", r"$\mathcal{L}_{\rm BC}=\frac{1}{N_b}\sum_{j=1}^{N_b}|u_\theta(x_b^j,t_b^j)-g(x_b^j,t_b^j)|^2$", r"Boundary points: $(x_b,t)$"),
    (1835, "PDE-residual loss", r"$\mathcal{L}_{\rm PDE}=\frac{1}{N_f}\sum_{j=1}^{N_f}|r_\theta(x_f^j,t_f^j)|^2$", r"Interior points: $(x,t)$"),
]:
    box(x, 650, 485, 150, "white", "#c8d8e5")
    text(x+242.5, 675, title, size=19, weight="bold", ha="center")
    text(x+242.5, 748, formula, size=20, ha="center")

arrow([(1047.5, 800), (1047.5, 822), (1562.5, 822), (1562.5, 845)])
line([(2077.5, 800), (2077.5, 822), (1562.5, 822)], BLUE, 1.8)
line([(1562.5, 800), (1562.5, 822)], BLUE, 1.8)
box(1207.5, 845, 710, 66, "#eef0fa", "#c9cde8")
text(1562.5, 879, r"$\mathcal{L}=\mathcal{L}_{\rm PDE}+\mathcal{L}_{\rm IC}+\mathcal{L}_{\rm BC}$", size=24, ha="center")
arrow([(1562.5, 911), (1562.5, 943)])
box(1207.5, 943, 710, 78, "#eaf2fa", "#bcd0e3")
text(1562.5, 965, "Backpropagation / optimizer", size=18, weight="bold", ha="center")
text(1562.5, 997, r"$\theta\leftarrow\theta-\eta\nabla_\theta\mathcal{L}$", size=24, ha="center")
arrow([(1917.5, 982), (2344, 982), (2344, 355), (2320, 355)])
text(2322, 828, r"Update $\theta$", size=15, rotation=90, ha="center", va="bottom")

OUT.mkdir(parents=True, exist_ok=True)
for suffix, kwargs in [("svg", {}), ("pdf", {}), ("png", {"dpi": 200})]:
    fig.savefig(OUT / f"pinn_shock_problem_framework_v2.{suffix}",
                facecolor="white", **kwargs)
plt.close(fig)
print("Saved SVG, PDF and 4800 x 2140 PNG; network connections: 6 + 9 + 3 = 18.")
