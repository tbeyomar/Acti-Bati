# Copie le site dans un dossier temporaire avec des images JPEG allégées,
# pour que les PDF restent légers (envoi par email).
# Usage : python3 preparer-images.py <site> <dossier-temporaire>
import glob, shutil, sys
from PIL import Image
site, dest = sys.argv[1], sys.argv[2]
shutil.rmtree(dest, ignore_errors=True)
shutil.copytree(site, dest, ignore=shutil.ignore_patterns('.git', '*.pdf', 'outils'))
for f in glob.glob(dest + '/*/img/*.webp') + glob.glob(dest + '/assets/*.webp'):
    im = Image.open(f)
    if 'A' in im.getbands():
        continue
    im = im.convert('RGB')
    im.thumbnail((1800, 1800))
    im.save(f, 'JPEG', quality=78, optimize=True)
