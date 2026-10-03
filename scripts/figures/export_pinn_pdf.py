"""Embed the approved PINN image in a one-page PDF without resampling."""

from pathlib import Path
import fitz


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "images/research/pinn_shock_problem_framework_v6.png"
OUTPUT = ROOT / "files/research/pinn_shock_problem_framework_v6.pdf"
PREVIEW = ROOT / "local/pinn-pdf-v6-preview.png"


def main():
    pixmap = fitz.Pixmap(str(SOURCE))
    width = 1200
    height = width * pixmap.height / pixmap.width
    document = fitz.open()
    page = document.new_page(width=width, height=height)
    page.insert_image(page.rect, filename=str(SOURCE))
    document.set_metadata({
        "title": "Shock Problem and PINN Framework",
        "author": "Yanghao Chen",
        "subject": "Inviscid Burgers Riemann problem and PINN training",
    })
    document.save(str(OUTPUT), deflate=True)
    document.close()

    with fitz.open(str(OUTPUT)) as exported:
        assert len(exported) == 1
        embedded = exported[0].get_images(full=True)
        assert len(embedded) == 1
        assert embedded[0][2:4] == (pixmap.width, pixmap.height)
        exported[0].get_pixmap(matrix=fitz.Matrix(1.5, 1.5)).save(str(PREVIEW))
        print(f"Saved {OUTPUT.name}: one page, original {pixmap.width}x{pixmap.height} image preserved")


if __name__ == "__main__":
    main()
