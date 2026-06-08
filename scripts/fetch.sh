#!/usr/bin/env bash
# Re-fetch Ogden BE850 mirrors into be850-distillery
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p corpus/vocabulary corpus/grammar corpus/guides downloads

echo "== vocabulary & grammar mirrors =="
curl -fsSL -o downloads/ogdens-basic-english-850.pdf \
  "https://turpentinewith.files.wordpress.com/2013/01/ogdens-basic-english.pdf"
curl -fsSL -o corpus/vocabulary/basic-english-850.txt \
  "https://raw.githubusercontent.com/ChristopherA/iambic-mnemonic/master/word-lists/basic-english-850.txt"
curl -fsSL -o corpus/grammar/begr-1937.html \
  "https://zbenglish.net/sites/basic/begr.html"
curl -fsSL -o corpus/vocabulary/words-ogden-order.html \
  "https://zbenglish.net/sites/basic/words.html"
curl -fsSL -o corpus/vocabulary/words-alphabetic.html \
  "https://zbenglish.net/sites/basic/wordalph.html"
curl -fsSL -o corpus/guides/basiceng-index.html \
  "https://zbenglish.net/sites/basic/basiceng.html"
curl -fsSL -o corpus/guides/books-catalog.html \
  "https://zbenglish.net/sites/basic/books.html"

if [[ "${1:-}" == "--with-etp" ]]; then
  echo "== English Through Pictures Book 1 (3.4MB) =="
  curl -fsSL -o downloads/english-through-pictures-book1.pdf \
    "https://ia800706.us.archive.org/6/items/EnglishThroughPictures_201901/English%20Through%20Pictures%2C%20Book%201.pdf"
fi

if [[ "${1:-}" == "--archive" ]]; then
  echo "== Archive.org items (may require manual borrow) =="
  echo "  Learning Basic English: https://archive.org/details/in.ernet.dli.2015.166025"
  echo "  BBE Bible: https://archive.org/details/BBEFreePDFBibleinBasicEnglish"
fi

echo "Done. See manifest.json for inventory."
