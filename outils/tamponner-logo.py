# Ajoute le petit logo Acti Bati en haut à droite de chaque page (sauf la couverture).
# Usage : python3 tamponner-logo.py <logo.png> <fichier.pdf> [...]
import io, sys
from pypdf import PdfReader, PdfWriter
from reportlab.lib.units import mm
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

logo = ImageReader(sys.argv[1])
lw, lh = logo.getSize()
H_LOGO = 9 * mm
W_LOGO = H_LOGO * lw / lh

for path in sys.argv[2:]:
    reader = PdfReader(path)
    writer = PdfWriter()
    for i, page in enumerate(reader.pages):
        if i > 0:
            w, h = float(page.mediabox.width), float(page.mediabox.height)
            buf = io.BytesIO()
            c = canvas.Canvas(buf, pagesize=(w, h))
            c.drawImage(logo, w - 13 * mm - W_LOGO, h - 4.5 * mm - H_LOGO, W_LOGO, H_LOGO, mask='auto')
            c.save()
            buf.seek(0)
            page.merge_page(PdfReader(buf).pages[0])
        writer.add_page(page)
    writer.compress_identical_objects(remove_duplicates=True)
    with open(path, 'wb') as f:
        writer.write(f)
    print(path, 'ok')
