#!/bin/bash
# subset jf-jinxuanlatte 2.1 OTF → WOFF2，只保留 src/ 內出現過的中文字 + ASCII
# 對應 thematters/design-system @ docs/freewrite-design-system/typography.md
# 商用 OTF 不在 repo（matters.town 已購授權，原檔由 ops 保管於本機 ~/Downloads/jf）
#
# 用法：
#   bash scripts/subset-jf-jinxuan.sh [path-to-otf-source-dir]
#
# Default source：~/Downloads/jf
# Default output：public/fonts/jf-jinxuan-{book,medium,extrabold,heavy,ultralight}.woff2
#
# 加新內容（新題目 / 新文章）後，若出現缺字，重跑此腳本擴充 corpus。

set -euo pipefail

SRC_DIR="${1:-$HOME/Downloads/jf}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/public/fonts"
CORPUS="/tmp/jf-corpus.txt"

if ! command -v pyftsubset >/dev/null 2>&1; then
  echo "error: pyftsubset not found. Install with: pip3 install --user 'fonttools[woff]' brotli zopfli"
  echo "       and add to PATH: export PATH=\"\$HOME/Library/Python/3.9/bin:\$PATH\""
  exit 1
fi

# Build extended corpus: landing src + freewrite 94 articles (lifeboat) + ASCII + CJK punctuation
LIFEBOAT_POSTS="${LIFEBOAT_POSTS:-$HOME/Documents/AI-Agent/matters-lifeboat/tmp/freewrite-backup/tmp/extracted/posts}"
python3 <<PY > "$CORPUS"
import os, glob
chars = set()
# 1. landing src
for f in glob.glob("$REPO_ROOT/src/**/*.astro", recursive=True) + \
         glob.glob("$REPO_ROOT/src/**/*.ts", recursive=True) + \
         glob.glob("$REPO_ROOT/src/**/*.css", recursive=True):
    for line in open(f):
        for ch in line:
            cp = ord(ch)
            if 0x4E00 <= cp <= 0x9FFF or 0x3000 <= cp <= 0x303F or 0xFF00 <= cp <= 0xFFEF:
                chars.add(ch)
# 2. lifeboat freewrite articles (cover usage chars)
posts = "$LIFEBOAT_POSTS"
if os.path.isdir(posts):
    for fn in os.listdir(posts):
        if fn.endswith('.md'):
            for ch in open(os.path.join(posts, fn)).read():
                cp = ord(ch)
                if 0x4E00 <= cp <= 0x9FFF or 0x3000 <= cp <= 0x303F or 0xFF00 <= cp <= 0xFFEF:
                    chars.add(ch)
# 3. ASCII + CJK Symbols/Punctuation + Fullwidth
chars.update(set("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#\$%&'()*+,-./:;<=>?@[]^_\`{|}~ "))
for cp in range(0x3000, 0x3040): chars.add(chr(cp))
for cp in range(0xFF00, 0xFFF0): chars.add(chr(cp))
print(''.join(sorted(chars)))
PY

CHAR_COUNT=$(wc -c < "$CORPUS")
echo "corpus: $CHAR_COUNT bytes (UTF-8) at $CORPUS"

mkdir -p "$OUT_DIR"

for w in book medium extrabold heavy ultralight; do
  src="$SRC_DIR/jf-jinxuanlatte-2.1-${w}.otf"
  if [ ! -f "$src" ]; then
    echo "skip $w: $src not found"
    continue
  fi
  out="$OUT_DIR/jf-jinxuan-${w}.woff2"
  pyftsubset "$src" \
    --text-file="$CORPUS" \
    --output-file="$out" \
    --flavor=woff2 \
    --layout-features='*' \
    --no-hinting >/dev/null
  echo "wrote $out ($(wc -c < "$out") bytes)"
done

echo "done. update src/components/BaseHead.astro @font-face URLs if you renamed weights."
