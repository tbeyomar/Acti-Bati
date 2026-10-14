# Régénérer les PDF des plaquettes

À refaire après chaque modification d'une plaquette.

```
python3 outils/preparer-images.py . /tmp/pdfroot
npm i playwright-core   # une seule fois
ROOT=/tmp/pdfroot node outils/generer-pdf.mjs
```

Les PDF sont écrits dans `pdf/`. La mise en page impression est dans `assets/print.css`.
