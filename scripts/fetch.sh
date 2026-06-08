#!/usr/bin/env bash
# Re-fetch Ogden BE850 mirrors into OgdenBasicEnglish
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p 02-vocabulary 04-practice reference/mirrors

echo "== vocabulary =="
curl -fsSL -o 02-vocabulary/ogdens-basic-english-850.pdf \
  "https://turpentinewith.files.wordpress.com/2013/01/ogdens-basic-english.pdf"
curl -fsSL -o 02-vocabulary/basic-english-850.txt \
  "https://raw.githubusercontent.com/ChristopherA/iambic-mnemonic/master/word-lists/basic-english-850.txt"

echo "== reference mirrors =="
curl -fsSL -o reference/begr-1937.html \
  "https://zbenglish.net/sites/basic/begr.html"
curl -fsSL -o reference/mirrors/words-ogden-order.html \
  "https://zbenglish.net/sites/basic/words.html"
curl -fsSL -o reference/mirrors/words-alphabetic.html \
  "https://zbenglish.net/sites/basic/wordalph.html"
curl -fsSL -o reference/mirrors/basiceng-index.html \
  "https://zbenglish.net/sites/basic/basiceng.html"
curl -fsSL -o reference/mirrors/books-catalog.html \
  "https://zbenglish.net/sites/basic/books.html"

if [[ "${1:-}" == "--with-etp" ]]; then
  echo "== English Through Pictures Book 1 (3.4MB) =="
  curl -fsSL -o 04-practice/english-through-pictures-book1.pdf \
    "https://ia800706.us.archive.org/6/items/EnglishThroughPictures_201901/English%20Through%20Pictures%2C%20Book%201.pdf"
fi

echo "Done. See manifest.json for inventory."
