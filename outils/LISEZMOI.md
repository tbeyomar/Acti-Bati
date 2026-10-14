# Régénérer les PDF des plaquettes

À refaire après chaque modification d'une plaquette.

```
python3 outils/preparer-images.py . /tmp/pdfroot
npm i playwright-core   # une seule fois
ROOT=/tmp/pdfroot node outils/generer-pdf.mjs
python3 outils/tamponner-logo.py assets/logo-actibati.png pdf/*.pdf
```

- Les PDF sont écrits dans `pdf/`.
- La mise en page impression (A4 paysage, fond blanc pour économiser l'encre) est dans `assets/print.css`.
- `tamponner-logo.py` ajoute le petit logo Acti Bati en haut à droite de chaque page, sauf la couverture.
