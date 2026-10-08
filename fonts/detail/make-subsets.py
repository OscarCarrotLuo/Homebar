"""Rebuild the detail-page font subsets after drink names or ingredients change.

Run from the project root:
    python3 fonts/detail/make-subsets.py --src /folder/with/source/fonts

All Chinese faces are Simplified Chinese (mainland) builds, so 草字头, 令, 教 and similar characters
take their mainland shapes. Put these OFL source files in --src (downloaded from the authors):
  SweiSpringSugarCJKsc-Regular.ttf, SweiSpringSugarCJKsc-Light.ttf
      https://github.com/max32002/swei-spring  (folder "CJK SC")
  SourceHanSerifCN-Light.otf
      https://github.com/adobe-fonts/source-han-serif  (release branch, SubsetOTF/CN)
Ma Shan Zheng (a mainland calligraphy face), Caveat and Cormorant Garamond come from the earlier
subsets kept in git history. Licences are the *-OFL.txt files beside this script."""
import argparse, os, re, subprocess, tempfile
from fontTools import subset
from fontTools.ttLib import TTFont

parser = argparse.ArgumentParser()
parser.add_argument('--src', default=os.path.expanduser('~/Library/Fonts'), help='folder holding the source fonts')
SRC = parser.parse_args().src
ROOT = os.getcwd()
OUT = os.path.join(ROOT, 'fonts/detail')
menu = open(os.path.join(ROOT, 'menu-data.js'), encoding='utf-8').read()
data = open(os.path.join(ROOT, 'drink-data.js'), encoding='utf-8').read()
names = ''.join(re.findall(r"\['([^']+)','[^']+'\]", menu))
english = ''.join(re.findall(r"\['[^']+','([^']+)'\]", menu))
essentials = ''.join(re.findall(r"'([^'a-z0-9-]+)'", data[data.index('const essentials'):]))
common = ' ·.,&’\'-0123456789'

def from_git(name):
    path = os.path.join(tempfile.gettempdir(), name)
    with open(path, 'wb') as f:
        f.write(subprocess.check_output(['git', 'show', f'47decc5:fonts/detail/{name}']))
    return path

jobs = [
    (os.path.join(SRC, 'SweiSpringSugarCJKsc-Regular.ttf'), 'SweiSpringSugarSC-Regular.woff', names + essentials + common),
    (os.path.join(SRC, 'SweiSpringSugarCJKsc-Light.ttf'), 'SweiSpringSugarSC-Light.woff', names + essentials + common),
    (os.path.join(SRC, 'SourceHanSerifCN-Light.otf'), 'SourceHanSerifCN-Light.woff', names + common),
    (from_git('MaShanZheng-0.ttf'), 'MaShanZheng.woff', names + common),
    (from_git('Caveat-0.ttf'), 'Caveat.woff', english + common),
    (from_git('Cormorant-0.ttf'), 'Cormorant-Italic.woff', english + common),
]
for src, dst, text in jobs:
    font = TTFont(src, fontNumber=0)
    opts = subset.Options(); opts.flavor = 'woff'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
    s = subset.Subsetter(opts); s.populate(text=''.join(sorted(set(text)))); s.subset(font)
    font.flavor = 'woff'; font.save(os.path.join(OUT, dst))
    missing = [c for c in set(text) if c.strip() and ord(c) not in font.getBestCmap()]
    print(f'{dst:32s} {os.path.getsize(os.path.join(OUT, dst))//1024:4d} KB  missing: {"".join(missing) or "none"}')
