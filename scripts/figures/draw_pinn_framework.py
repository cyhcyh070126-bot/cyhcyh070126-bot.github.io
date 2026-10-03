"""Draw the complete PINN overview as vector artwork, without raster assets.

Run with a Python environment containing matplotlib, numpy and PyMuPDF.
All geometry, text, math, plots and connections are authored here. The SVG
uses outlined glyphs; the PDF embeds TrueType fonts and contains no images.
"""

from pathlib import Path
import math
import xml.etree.ElementTree as ET

import fitz
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib import font_manager
from matplotlib.patches import Circle, FancyBboxPatch, Polygon, Rectangle
import numpy as np


ROOT = Path(__file__).resolve().parents[2]
STEM = "pinn_shock_problem_framework_v8"
PDF = ROOT / "files/research" / f"{STEM}.pdf"
SVG = ROOT / "images/research" / f"{STEM}.svg"
QA = ROOT / "local"
W, H, DPI = 2400, 1280, 100
INK = "#102451"
BLUE = "#086bc4"
GREEN = "#087145"
RED = "#cc3941"
PURPLE = "#7954ba"
WIRE = "#596777"
TEXTS = []


def main():
    for filename in ("times.ttf", "timesbd.ttf", "timesi.ttf"):
        font_path = Path("C:/Windows/Fonts") / filename
        if font_path.exists():
            font_manager.fontManager.addfont(str(font_path))
    matplotlib.rcParams.update({
        "font.family": "Times New Roman",
        "mathtext.fontset": "stix",
        "pdf.fonttype": 42,
        "ps.fonttype": 42,
        "svg.fonttype": "path",
        "svg.hashsalt": "yanghao-pinn-vector-v8",
        "axes.unicode_minus": False,
        "savefig.facecolor": "white",
    })
    fig = plt.figure(figsize=(W / DPI, H / DPI), dpi=DPI)
    ax = fig.add_axes((0, 0, 1, 1))
    ax.set(xlim=(0, W), ylim=(H, 0))
    ax.set_aspect("equal")
    ax.set_axis_off()

    def text(x, y, value, size=30, color=INK, bold=False, ha="left", **kwargs):
        artist = ax.text(x, y, value, fontsize=size * 72 / DPI, color=color,
                         fontweight="bold" if bold else "normal",
                         ha=ha, va="center", zorder=8, **kwargs)
        TEXTS.append(artist)
        return artist

    def box(x, y, width, height, fill="white", edge="#c4d9eb", radius=12, lw=1.2, dashed=False):
        patch = FancyBboxPatch((x, y), width, height,
                               boxstyle=f"round,pad=0,rounding_size={radius}",
                               facecolor=fill, edgecolor=edge, linewidth=lw,
                               linestyle=(0, (4, 3)) if dashed else "solid", zorder=1)
        ax.add_patch(patch)
        return patch

    def line(points, color=INK, lw=1.5, dashed=False, zorder=3):
        x, y = zip(*points)
        ax.plot(x, y, color=color, linewidth=lw, solid_capstyle="round",
                solid_joinstyle="round", linestyle=(0, (4, 3)) if dashed else "solid",
                zorder=zorder)

    def arrow(points, color=INK, lw=1.5, head=10, dashed=False, zorder=4):
        line(points, color, lw, dashed, zorder)
        x, y = points[-1]
        px, py = points[-2]
        angle = math.atan2(y - py, x - px)
        ux, uy = math.cos(angle), math.sin(angle)
        tri = [(x, y), (x - head * ux + head * 0.42 * uy,
                        y - head * uy - head * 0.42 * ux),
               (x - head * ux - head * 0.42 * uy,
                y - head * uy + head * 0.42 * ux)]
        ax.add_patch(Polygon(tri, closed=True, facecolor=color, edgecolor="none", zorder=zorder))

    def circle(x, y, radius, fill, edge=INK, lw=1.3, zorder=6):
        ax.add_patch(Circle((x, y), radius, facecolor=fill, edgecolor=edge,
                            linewidth=lw, zorder=zorder))

    def fit_formula(x, y, formula, max_width, size=31, color=INK):
        artist = text(x, y, formula, size=size, ha="center", color=color)
        fig.canvas.draw()
        width = artist.get_window_extent(fig.canvas.get_renderer()).width
        if width > max_width:
            artist.set_fontsize(artist.get_fontsize() * max_width / width)
        return artist

    # Overall layout: the same blue problem / green method division as the reference.
    text(W / 2, 67, "Shock Problem and PINN Framework", 70, bold=True, ha="center")
    box(20, 130, 890, 1115, edge="#81bde8", radius=20, lw=1.4)
    box(940, 130, 1440, 1115, edge="#82caa4", radius=20, lw=1.4)
    box(22, 132, 886, 98, fill="#edf5fc", edge="#edf5fc", radius=18)
    box(942, 132, 1436, 98, fill="#edf8f1", edge="#edf8f1", radius=18)
    for cx, fill, number in ((74, BLUE, "1"), (997, GREEN, "2")):
        circle(cx, 181, 37, fill, fill)
        text(cx, 184, number, 58, color="white", bold=True, ha="center")
    text(131, 181, "Problem Setup", 51, bold=True)
    text(1056, 181, "PINN Framework", 51, color="#10492f", bold=True)
    text(47, 268, "Consider the 1D inviscid Burgers Riemann problem.", 31)

    # Equation cards are flat vector shapes; every mathematical symbol is typeset.
    for y, height, label in ((309, 106, "Governing\nequation"),
                             (433, 126, "Initial\ncondition"),
                             (577, 112, "Boundary\ncondition")):
        box(44, y, 842, height, edge="#c8ddeb")
        box(45, y + 1, 190, height - 2, fill="#edf5fc", edge="#edf5fc", radius=10)
        text(65, y + height / 2, label, 29, bold=True, linespacing=1.1)
    fit_formula(559, 362, r"$u_t+u u_x=0,\quad x\in[-1,1],\quad t\in(0,1]$", 607, 34)
    text(262, 496, r"$u(x,0)=$", 35)
    text(437, 495, r"$\{$", 92)
    text(481, 468, r"$1,\quad x<0,$", 34)
    text(481, 524, r"$0,\quad x>0.$", 34)
    fit_formula(559, 633, r"$u(-1,t)=1,\quad u(1,t)=0,\quad t\in(0,1]$", 607, 32)

    # Three analytical sketches, drawn from the exact Riemann solution.
    plot_specs = ((44, 240, "(a) Initial condition"),
                  (298, 333, "(b) Characteristics"),
                  (645, 241, "(c) Solution profile"))
    for x, width, title in plot_specs:
        box(x, 712, width, 354, edge="#c8ddeb", radius=10)
        box(x + 1, 713, width - 2, 53, fill="#f0f6fc", edge="#f0f6fc", radius=9)
        text(x + width / 2, 739, title, 25, bold=True, ha="center")

    def profile_axes(xleft, xright):
        yzero, yone = 945, 828
        arrow([(xleft, yzero + 10), (xleft, 801)], "#283847", 1.2, 8)
        arrow([(xleft - 8, yzero), (xright + 12, yzero)], "#283847", 1.2, 8)
        text(xleft - 8, 785, r"$u$", 27, ha="center")
        text(xright + 18, yzero, r"$x$", 27)
        for value in (-1, 0, 1):
            x = xleft + (value + 1) / 2 * (xright - xleft)
            line([(x, yzero - 4), (x, yzero + 5)], "#283847", 1)
            text(x, yzero + 29, rf"${value}$", 24, ha="center")
        text(xleft - 13, yzero, "$0$", 24, ha="right")
        text(xleft - 13, yone, "$1$", 24, ha="right")
        return yzero, yone

    zero, one = profile_axes(84, 250)
    line([(84, one), (167, one)], "#006bea", 2.5)
    line([(167, one), (167, zero)], "#006bea", 1.8, dashed=True)
    line([(167, zero), (250, zero)], "#006bea", 2.5)
    text(164, 1020, r"$t=0$", 27, ha="center")

    # Characteristics satisfy dx/dt=u: unit-slope lines on the left and
    # vertical lines on the right, terminated when they meet x_s(t)=t/2.
    def xt(x, t):
        return 337 + (x + 1) * 132, 945 - t * 145

    arrow([(337, 953), (337, 783)], "#283847", 1.2, 8)
    arrow([(326, 945), (615, 945)], "#283847", 1.2, 8)
    text(328, 773, "$t$", 27)
    text(620, 945, "$x$", 27)
    for initial in np.linspace(-1, -0.125, 8):
        end = min(1.0, -2 * initial)
        line([xt(initial, 0), xt(initial + end, end)], "#387bec", 1.05)
    for initial in np.linspace(0.125, 1.0, 8):
        end = min(1.0, 2 * initial)
        line([xt(initial, 0), xt(initial, end)], "#da963f", 1.05)
    arrow([xt(0, 0), xt(0.5, 1)], RED, 1.8, 8, dashed=True)
    for value in (-1, 0, 1):
        x, y = xt(value, 0)
        line([(x, y - 4), (x, y + 5)], "#283847", 1)
        text(x, y + 27, rf"${value}$", 23, ha="center")
    text(546, 780, r"$x_s(t)=t/2$", 26, color=RED, ha="center")
    for y, color, label, dashed in ((1000, "#387bec", r"Characteristics ($u=1$)", False),
                                     (1026, "#da963f", r"Characteristics ($u=0$)", False),
                                     (1052, RED, r"Shock path $x_s(t)=t/2$", True)):
        line([(314, y), (343, y)], color, 1.8, dashed)
        text(352, y, label, 23)

    zero, one = profile_axes(686, 850)
    shock_x = 686 + 1.25 / 2 * 164
    line([(686, one), (shock_x, one), (shock_x, zero), (850, zero)], "#006bea", 2.5)
    line([(shock_x, 806), (shock_x, one - 4)], RED, 1.5, dashed=True)
    text(770, 789, r"$x_s(t)=t/2$", 26, color=RED, ha="center")
    text(766, 1020, r"$t=0.5,\quad x_s=0.25$", 25, ha="center")

    box(44, 1085, 842, 133, fill="#f3f7fb", edge="#c8ddeb")
    for y, content in ((1115, r"Characteristic speed: $dx/dt=u$."),
                       (1151, "Characteristics converge toward the shock."),
                       (1189, r"Shock speed: $s=(u_L+u_R)/2=0.5$.")):
        circle(68, y, 5, BLUE, BLUE, lw=0)
        text(88, y, content, 29)

    # Network, differentiation and the three full loss expressions.
    box(962, 271, 425, 655, fill="#fbfdff", edge="#84b6df", dashed=True)
    box(1410, 271, 365, 433, fill="#f6fbf7", edge="#9bcbab", dashed=True)
    box(1810, 271, 548, 655, fill="#fffcf8", edge="#e0b38e", dashed=True)
    box(964, 273, 421, 66, fill="#edf5fc", edge="#edf5fc", radius=8)
    box(1412, 273, 361, 85, fill="#edf8f1", edge="#edf8f1", radius=8)
    box(1812, 273, 544, 66, fill="#fff2e9", edge="#fff2e9", radius=8)
    text(1174, 306, "Neural Network", 34, bold=True, ha="center")
    text(1592, 315, "Automatic\nDifferentiation", 31, color="#184e35", bold=True,
         ha="center", linespacing=0.98)
    text(2084, 306, "Physics-informed Losses", 33, color="#7c2726", bold=True, ha="center")

    inputs = [(1009, 465, 29), (1009, 635, 29)]
    hidden1 = [(1111, y, 25) for y in (410, 530, 700)]
    hidden2 = [(1220, y, 25) for y in (410, 530, 700)]
    output = [(1330, 520, 29)]
    for sources, targets in ((inputs, hidden1), (hidden1, hidden2), (hidden2, output)):
        for x1, y1, r1 in sources:
            for x2, y2, r2 in targets:
                d = math.hypot(x2 - x1, y2 - y1)
                ux, uy = (x2 - x1) / d, (y2 - y1) / d
                arrow([(x1 + r1 * ux, y1 + r1 * uy),
                       (x2 - r2 * ux, y2 - r2 * uy)], WIRE, 1.05, 5.4)
    for x, y, radius in inputs + hidden1 + hidden2:
        circle(x, y, radius, "#d5e7f8", "#244878")
    circle(1330, 520, 29, "#ffd8d7", RED)
    text(1009, 465, "$x$", 37, ha="center")
    text(1009, 635, "$t$", 37, ha="center")
    text(1328, 432, r"$u_\theta(x,t)$", 31, ha="center")
    for x in (1111, 1220):
        for y in (594, 610, 626):
            circle(x, y, 2.6, INK, INK, lw=0)
    for center, width, label in ((1009, 68, "Input"), (1111, 74, "Hidden\nlayer"),
                                 (1220, 74, "Hidden\nlayer"), (1330, 74, "Output")):
        line([(center - width / 2, 758), (center - width / 2, 768),
              (center + width / 2, 768), (center + width / 2, 758)], INK, 1.3)
        text(center, 806, label, 27, ha="center", linespacing=1.05)

    # Forward flow: an explicit shared output branch, separate derivative ports,
    # and separate initial/boundary evaluation paths (never from the residual).
    line([(1359, 520), (1394, 520)], INK, 1.8)
    line([(1394, 410), (1394, 630)], INK, 1.5)
    circle(1394, 520, 2.5, INK, INK, lw=0)
    for y, value in ((410, r"$u_\theta$"), (520, r"$u_t$"), (630, r"$u_x$")):
        arrow([(1394, y), (1438, y)], INK, 1.5, 9)
        box(1438, y - 31, 72, 62, fill="#eef8eb", edge="#78a96c", radius=7)
        text(1474, y, value, 34, ha="center")
    box(1562, 443, 196, 148, fill="#f4effc", edge="#a285cb", radius=10)
    text(1660, 480, r"$r_\theta(x,t)$", 30, ha="center")
    fit_formula(1660, 541, r"$=u_t+u_\theta u_x$", 177, 30)
    arrow([(1510, 410), (1538, 410), (1538, 469), (1562, 469)], INK, 1.5, 8)
    arrow([(1510, 520), (1562, 520)], INK, 1.5, 8)
    arrow([(1510, 630), (1538, 630), (1538, 565), (1562, 565)], INK, 1.5, 8)

    losses = [
        (360, "PDE residual", "#fff3f2", "#e3a3a2", RED,
         r"$\mathcal{L}_{\mathrm{PDE}}=\frac{1}{N_f}\sum_{i=1}^{N_f}\left|r_\theta(x_f^i,t_f^i)\right|^2$"),
        (558, "Initial condition", "#f0f7fe", "#9fc2e7", BLUE,
         r"$\mathcal{L}_{\mathrm{IC}}=\frac{1}{N_i}\sum_{i=1}^{N_i}\left|u_\theta(x_i,0)-u_0(x_i)\right|^2$"),
        (762, "Boundary condition", "#f1f9f0", "#a3c59e", GREEN,
         r"$\mathcal{L}_{\mathrm{BC}}=\frac{1}{N_b}\sum_{i=1}^{N_b}\left|u_\theta(x_b^i,t_b^i)-g(x_b^i,t_b^i)\right|^2$"),
    ]
    for y, title, fill, edge, color, formula in losses:
        box(1830, y, 508, 145, fill=fill, edge=edge, radius=9)
        text(2084, y + 27, title, 27, color=color, bold=True, ha="center")
        fit_formula(2084, y + 91, formula, 474, 32)
    arrow([(1758, 517), (1788, 517), (1788, 433), (1830, 433)], RED, 1.7, 10)
    line([(1375, 520), (1375, 874)], "#526878", 1.2)
    circle(1375, 520, 2.6, INK, INK, lw=0)
    arrow([(1375, 765), (1794, 765), (1794, 631), (1830, 631)], BLUE, 1.8, 10)
    text(1572, 740, r"$u_\theta(x_i,0)$", 30, color=BLUE, ha="center")
    arrow([(1375, 874), (1794, 874), (1794, 835), (1830, 835)], GREEN, 1.8, 10)
    text(1572, 847, r"$u_\theta(x_b^i,t_b^i)$", 30, color=GREEN, ha="center")

    # Weighted loss and the closed optimization loop.
    arrow([(2084, 926), (2084, 962)], BLUE, 2, 12)
    box(1770, 962, 582, 92, fill="#f3eefb", edge="#9b7dcb", radius=10, lw=1.4)
    fit_formula(2061, 1008,
                r"$\mathcal{L}=\lambda_f\mathcal{L}_{\mathrm{PDE}}+\lambda_i\mathcal{L}_{\mathrm{IC}}+\lambda_b\mathcal{L}_{\mathrm{BC}}$",
                541, 37)
    arrow([(2084, 1054), (2084, 1090)], BLUE, 2, 12)
    box(1490, 1090, 700, 126, fill="#edf5fc", edge="#70a8d8", radius=12, lw=1.4)
    text(1840, 1118, "Training Loop", 32, bold=True, ha="center")
    text(1840, 1151, "Backpropagation / Optimizer", 28, ha="center")
    text(1840, 1190, r"$\theta\ \leftarrow\ \theta-\eta\nabla_\theta\mathcal{L}$", 35, ha="center")
    arrow([(1490, 1153), (1124, 1153), (1124, 926)], BLUE, 2.2, 14)
    text(1240, 1118, r"Update $\theta$", 32, color=BLUE, bold=True, ha="center")

    # Final exports use only vector primitives and embedded fonts.
    fig.canvas.draw()
    renderer = fig.canvas.get_renderer()
    for artist in TEXTS:
        bounds = artist.get_window_extent(renderer)
        assert bounds.x0 >= 0 and bounds.y0 >= 0 and bounds.x1 <= W and bounds.y1 <= H, artist.get_text()
    fig.savefig(PDF, format="pdf", metadata={"Title": "Shock Problem and PINN Framework", "Author": "Yanghao Chen"})
    fig.savefig(SVG, format="svg", metadata={"Title": "Shock Problem and PINN Framework", "Description": "Complete vector drawing of the Burgers Riemann problem and PINN training workflow."})
    plt.close(fig)

    # Structural checks catch accidental bitmap embedding; rendered previews
    # inspect the full composition and the equations / arrows at high zoom.
    tree = ET.parse(SVG)
    assert not tree.findall(".//{http://www.w3.org/2000/svg}image")
    with fitz.open(PDF) as document:
        assert len(document) == 1
        page = document[0]
        assert page.get_images(full=True) == [], "PDF unexpectedly contains a raster image"
        assert len(page.get_drawings()) > 100
        assert "Problem Setup" in page.get_text()
        page.get_pixmap(matrix=fitz.Matrix(1, 1)).save(QA / "pinn-v8-vector-overview.png")
        scale = page.rect.width / W
        detail = fitz.Rect(960 * scale, 360 * scale, 2350 * scale, 920 * scale)
        page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=detail).save(QA / "pinn-v8-vector-detail.png")
        print(f"PDF: {len(page.get_images(full=True))} raster images, {len(page.get_drawings())} vector paths, {len(page.get_fonts())} embedded font resources")
    print(f"Saved {PDF}\nSaved {SVG}")


if __name__ == "__main__":
    main()
