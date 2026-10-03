"""Preserve the reference bitmap and overlay exact neural connections in SVG/PDF."""

import base64
import math
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image
from pypdf import PdfReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "images/research/pinn_framework_reference_v7.png"
SVG = ROOT / "images/research/pinn_shock_problem_framework_v7.svg"
PDF = ROOT / "files/research/pinn_shock_problem_framework_v7.pdf"
WIDTH, HEIGHT = 1416, 797


def main():
    with Image.open(BASE) as bitmap:
        assert bitmap.size == (WIDTH, HEIGHT)
    for name, filename in (("ReferenceSerif", "times.ttf"),
                           ("ReferenceSerifItalic", "timesi.ttf"),
                           ("ReferenceSerifBold", "timesbd.ttf")):
        pdfmetrics.registerFont(TTFont(name, str(Path("C:/Windows/Fonts") / filename)))
    pdfmetrics.registerFont(TTFont("ReferenceMath", "C:/Windows/Fonts/cambria.ttc", subfontIndex=1))
    encoded = base64.b64encode(BASE.read_bytes()).decode("ascii")
    elements = [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">',
        '<title>Shock Problem and PINN Framework</title>',
        '<desc>The original reference figure with eighteen precisely drawn neural-network connections.</desc>',
        f'<image width="{WIDTH}" height="{HEIGHT}" href="data:image/png;base64,{encoded}"/>',
    ]
    drawing = canvas.Canvas(str(PDF), pagesize=(WIDTH, HEIGHT), pageCompression=1)
    drawing.setTitle("Shock Problem and PINN Framework")
    drawing.setAuthor("Yanghao Chen")
    drawing.drawImage(str(BASE), 0, 0, width=WIDTH, height=HEIGHT)

    def color(value):
        return tuple(int(value[i:i + 2], 16) / 255 for i in (1, 3, 5))

    def rect(x, y, width, height, fill):
        elements.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" fill="{fill}"/>')
        drawing.setFillColorRGB(*color(fill))
        drawing.rect(x, HEIGHT - y - height, width, height, stroke=0, fill=1)

    def line(x1, y1, x2, y2, stroke, width=1.1, dash=None):
        pattern = f' stroke-dasharray="{dash[0]} {dash[1]}"' if dash else ""
        elements.append(f'<line x1="{x1:.3f}" y1="{y1:.3f}" x2="{x2:.3f}" y2="{y2:.3f}" stroke="{stroke}" stroke-width="{width}"{pattern}/>')
        drawing.setStrokeColorRGB(*color(stroke))
        drawing.setLineWidth(width)
        drawing.setDash(dash or [])
        drawing.line(x1, HEIGHT - y1, x2, HEIGHT - y2)
        drawing.setDash([])

    def circle(x, y, radius, fill, stroke):
        elements.append(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="1.2"/>')
        drawing.setFillColorRGB(*color(fill))
        drawing.setStrokeColorRGB(*color(stroke))
        drawing.setLineWidth(1.2)
        drawing.circle(x, HEIGHT - y, radius, stroke=1, fill=1)

    def text(x, y, content, size=22):
        elements.append(f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Times New Roman,Times,serif" font-style="italic" font-size="{size}" fill="#071957">{escape(content)}</text>')
        drawing.setFillColorRGB(*color("#071957"))
        drawing.setFont("ReferenceSerifItalic", size)
        drawing.drawCentredString(x, HEIGHT - y, content)

    def label(x, y, content, size=22, bold=False, italic=False, fill="#071957", math_font=False):
        style = ' font-style="italic"' if italic else ''
        weight = ' font-weight="bold"' if bold else ''
        family = "Cambria Math,serif" if math_font else "Times New Roman,Times,serif"
        elements.append(f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{fill}"{style}{weight}>{escape(content)}</text>')
        drawing.setFillColorRGB(*color(fill))
        drawing.setFont("ReferenceMath" if math_font else "ReferenceSerifBold" if bold else "ReferenceSerifItalic" if italic else "ReferenceSerif", size)
        drawing.drawString(x, HEIGHT - y, content)

    def math_runs(x, y, runs, size=25):
        """Set inline mathematical symbols with matching SVG/PDF subscript offsets."""
        cursor = x
        for content, italic, subscript in runs:
            run_size = size * 0.62 if subscript else size
            run_y = y + size * 0.19 if subscript else y
            # Times New Roman lacks this mathematical glyph on Windows.
            # Explicit fallback prevents missing-glyph squares in the PDF.
            pieces = []
            for index, piece in enumerate(content.split("∈")):
                if index:
                    pieces.append(("∈", True))
                pieces.append((piece, False))
            for piece, math_font in pieces:
                label(cursor, run_y, piece, run_size, italic=italic, math_font=math_font)
                font = "ReferenceMath" if math_font else "ReferenceSerifItalic" if italic else "ReferenceSerif"
                cursor += pdfmetrics.stringWidth(piece, font, run_size)
        return cursor

    def rounded_rect(x, y, width, height, fill, stroke, radius=7):
        elements.append(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="0.9"/>')
        drawing.setFillColorRGB(*color(fill))
        drawing.setStrokeColorRGB(*color(stroke))
        drawing.setLineWidth(0.9)
        drawing.roundRect(x, HEIGHT - y - height, width, height, radius, stroke=1, fill=1)

    def arrow_head(x, y, angle, stroke="#173e83", size=7):
        points = [(x, y)]
        for side in (-1, 1):
            points.append((x - size * math.cos(angle) + side * size * 0.43 * math.sin(angle),
                           y - size * math.sin(angle) - side * size * 0.43 * math.cos(angle)))
        elements.append('<polygon points="' + " ".join(f"{a:.3f},{b:.3f}" for a, b in points) + f'" fill="{stroke}"/>')
        path = drawing.beginPath()
        path.moveTo(points[0][0], HEIGHT - points[0][1])
        for a, b in points[1:]:
            path.lineTo(a, HEIGHT - b)
        path.close()
        drawing.setFillColorRGB(*color(stroke))
        drawing.drawPath(path, stroke=0, fill=1)

    # Keep the original left-hand layout, but use restrained flat fills and
    # deterministic typography in place of the generated gradients and glyphs.
    rect(16, 89, 637, 65, "#eef5fb")
    circle(53, 121, 27, "#066ec2", "#066ec2")
    label(41, 138, "1", 47, bold=True, fill="#ffffff")
    label(97, 134, "Problem Setup", 35, bold=True)
    rect(26, 198, 621, 243, "#ffffff")
    for y, height, first_label, second_label in (
            (200, 68, "Governing", "equation"),
            (278, 82, "Initial", "condition"),
            (370, 68, "Boundary", "condition")):
        rounded_rect(27, y, 619, height, "#ffffff", "#c1d8ea")
        rounded_rect(28, y + 1, 143, height - 2, "#edf4fa", "#edf4fa", 6)
        label(43, y + 27, first_label, 21, bold=True)
        label(43, y + 50, second_label, 21, bold=True)
    math_runs(192, 242, [
        ("u", True, False), ("t", True, True), (" + ", False, False),
        ("uu", True, False), ("x", True, True),
        (" = 0,     ", False, False), ("x", True, False),
        (" ∈ [−1, 1],     ", False, False), ("t", True, False),
        (" ∈ (0, 1]", False, False)], 25)
    math_runs(192, 326, [("u", True, False), ("(", False, False),
        ("x", True, False), (", 0) =", False, False)], 26)
    label(297, 338, "{", 61)
    math_runs(328, 310, [("1,     ", False, False), ("x", True, False), (" < 0,", False, False)], 25)
    math_runs(328, 345, [("0,     ", False, False), ("x", True, False), (" > 0.", False, False)], 25)
    math_runs(192, 414, [("u", True, False), ("(−1, ", False, False),
        ("t", True, False), (") = 1,    ", False, False),
        ("u", True, False), ("(1, ", False, False), ("t", True, False),
        (") = 0,    ", False, False), ("t", True, False),
        (" ∈ (0, 1]", False, False)], 24)
    rounded_rect(27, 688, 619, 86, "#f3f7fb", "#c1d8ea")
    for y, content in ((713, "Wave speed is determined by u"),
                       (738, "The left high-u region propagates faster"),
                       (763, "Characteristic lines merge and form a shock")):
        circle(47, y - 6, 4, "#086dc1", "#086dc1")
        label(65, y, content, 21)

    # Only mask the old network drawing and the starts of its outgoing links.
    # Heading, brackets, layer labels, equations and the left-hand plots are untouched.
    rect(677, 238, 256, 200, "#fbfdff")
    rect(933, 238, 6, 200, "#ffffff")
    rect(940, 244, 15, 194, "#f5fcf6")
    line(934, 238, 934, 438, "#70b3ff", 0.9, (4, 3))
    line(939, 244, 939, 438, "#8acc93", 0.9, (4, 3))

    inputs = [(703, 324, 19), (703, 388, 19)]
    first = [(763, 280, 16), (763, 324, 16), (763, 402, 16)]
    second = [(828, 280, 16), (828, 324, 16), (828, 402, 16)]
    output = [(892, 353, 18)]
    edge_count = 0
    for sources, targets in ((inputs, first), (first, second), (second, output)):
        for x1, y1, radius1 in sources:
            for x2, y2, radius2 in targets:
                distance = math.hypot(x2 - x1, y2 - y1)
                dx, dy = (x2 - x1) / distance, (y2 - y1) / distance
                end_x, end_y = x2 - radius2 * dx, y2 - radius2 * dy
                line(x1 + radius1 * dx, y1 + radius1 * dy,
                     end_x, end_y, "#586575", 0.85)
                arrow_head(end_x, end_y, math.atan2(dy, dx), "#586575", 3.5)
                edge_count += 1
    assert edge_count == 18

    for x, y, radius in inputs + first + second:
        circle(x, y, radius, "#d1e7fa", "#203b85")
    circle(892, 353, 18, "#ffd2d2", "#e7434b")
    text(703, 331, "x")
    text(703, 395, "t")
    for x in (763, 828):
        for y in (354, 363, 372):
            circle(x, y, 1.55, "#102157", "#102157")

    # An explicit Greek-font span avoids fallback problems in the PDF output.
    elements.append('<text x="865" y="317" font-family="Times New Roman,Times,serif" font-style="italic" font-size="18" fill="#071957">u<tspan baseline-shift="sub" font-size="12">θ</tspan>(x,t)</text>')
    drawing.setFillColorRGB(*color("#071957"))
    drawing.setFont("ReferenceSerifItalic", 18)
    drawing.drawString(865, HEIGHT - 317, "u")
    drawing.setFont("ReferenceSerifItalic", 12)
    drawing.drawString(874, HEIGHT - 320, "θ")
    drawing.setFont("ReferenceSerifItalic", 18)
    drawing.drawString(882, HEIGHT - 317, "(x,t)")

    # Rejoin the three existing differentiation links without extra segments.
    elements.append('<path d="M910 353 C934 353 938 286 956 286" fill="none" stroke="#173e83" stroke-width="1.4"/>')
    path = drawing.beginPath()
    path.moveTo(910, HEIGHT - 353)
    path.curveTo(934, HEIGHT - 353, 938, HEIGHT - 286, 956, HEIGHT - 286)
    drawing.setStrokeColorRGB(*color("#173e83"))
    drawing.setLineWidth(1.4)
    drawing.drawPath(path, stroke=1, fill=0)
    arrow_head(956, 286, 0)
    line(910, 353, 956, 353, "#173e83", 1.4)
    arrow_head(956, 353, 0)
    line(906, 365, 956, 422, "#173e83", 1.4)
    arrow_head(956, 422, math.atan2(57, 50))

    elements.append('</svg>')
    SVG.write_text("\n".join(elements), encoding="utf-8")
    drawing.showPage()
    drawing.save()
    exported = PdfReader(str(PDF))
    assert len(exported.pages) == 1
    assert "Problem Setup" in exported.pages[0].extract_text()
    print(f"Created SVG/PDF: {edge_count} exact neural connections; reference retained as background")


if __name__ == "__main__":
    main()
