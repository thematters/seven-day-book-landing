#!/bin/bash
# subset GenSenRounded 源泉圓體 TW（Medium）OTF → WOFF2，
# 只保留「金句牆」內文會用到的字（freewrite-featured + quote-wall 全文）+ ASCII + 常用標點。
#
# 為什麼：粉圓（open-huninn）不含簡體，而金句是使用者產生、常含簡體。源泉圓體（衍生自
# 思源黑體，SIL OFL 1.1、可商用）繁簡通吃且是圓體，跟粉圓調性一致。全字集 OTF 有 15MB，
# subset 到實際用字後只剩 ~600KB。
#
# 用法：
#   bash scripts/subset-gensen.sh
#
# 依賴：pyftsubset（fonttools）+ brotli。若無：
#   pip3 install --user 'fonttools[woff]' brotli
#
# 金句更新（quote-wall.ts 重抓）後若出現缺字，重跑本腳本；理想是接進
# .github/workflows/refresh-quote-wall.yml，每次金句更新自動 re-subset。

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$REPO_ROOT/public/fonts/gensen-rounded-tw.subset.woff2"
LICENSE_OUT="$REPO_ROOT/public/fonts/GenSenRounded-SIL_OFL_1.1.txt"
CORPUS="/tmp/gensen-corpus.txt"
OTF="/tmp/GenSenRounded2TW-M.otf"
OTF_URL="https://cdn.jsdelivr.net/gh/ButTaiwan/gensen-font@2.100/otf/TW/GenSenRounded2TW-M.otf"
LICENSE_URL="https://raw.githubusercontent.com/ButTaiwan/gensen-font/master/SIL_Open_Font_License_1.1.txt"

if ! command -v pyftsubset >/dev/null 2>&1; then
  echo "error: pyftsubset not found. Install: pip3 install --user 'fonttools[woff]' brotli"
  exit 1
fi

# 下載全字集 OTF（15MB，不進 repo）
if [ ! -f "$OTF" ]; then
  echo "downloading GenSenRounded2TW-M.otf …"
  curl -sL "$OTF_URL" -o "$OTF"
fi
# 附授權（散布 OFL 字型必須一併附上）
curl -sL "$LICENSE_URL" -o "$LICENSE_OUT" || true

# 建 corpus：金句來源全文的中文字 + ASCII + 常用標點
python3 <<PY > "$CORPUS"
chars = set()
for f in ["$REPO_ROOT/src/data/freewrite-featured.ts",
          "$REPO_ROOT/src/data/quote-wall.ts"]:
    try:
        t = open(f, encoding="utf-8").read()
    except FileNotFoundError:
        continue
    for ch in t:
        o = ord(ch)
        if (0x3400 <= o <= 0x9FFF) or (0xF900 <= o <= 0xFAFF) or (0x20000 <= o <= 0x2A6DF):
            chars.add(ch)
chars.update("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#\$%&'()*+,-./:;<=>?@[]^_\`{|}~ ")
for o in range(0x3000, 0x3040): chars.add(chr(o))   # CJK 標點
for o in range(0xFF00, 0xFFF0): chars.add(chr(o))   # 全形
chars.update("—…‘’“”→↗✦・")
print(''.join(sorted(chars)))
PY

echo "corpus: $(wc -c < "$CORPUS") bytes"

pyftsubset "$OTF" \
  --text-file="$CORPUS" \
  --output-file="$OUT" \
  --flavor=woff2 \
  --layout-features='*' \
  --no-hinting \
  --desubroutinize >/dev/null

echo "wrote $OUT ($(wc -c < "$OUT") bytes)"
echo "done."
