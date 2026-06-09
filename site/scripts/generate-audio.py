#!/usr/bin/env python3
"""用 edge-tts（en-GB-SoniaNeural，与 jingyu 一致）生成 850 词 MP3。"""

from __future__ import annotations

import asyncio
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "02-vocabulary" / "audio"
WORDS_FILE = ROOT / "02-vocabulary" / "basic-english-850.txt"
VOICE = "en-GB-SoniaNeural"


def slug(word: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", word.lower()).strip("-")
    return s[:60] or "word"


async def gen_one(word: str, out: Path) -> None:
    import edge_tts

    out.parent.mkdir(parents=True, exist_ok=True)
    comm = edge_tts.Communicate(word, VOICE)
    await comm.save(str(out))


async def run(words: list[str], force: bool) -> int:
    n = 0
    for i, w in enumerate(words, 1):
        path = OUT / f"{slug(w)}.mp3"
        if path.exists() and not force:
            continue
        await gen_one(w, path)
        n += 1
        if i % 25 == 0:
            print(f"  … {i}/{len(words)}", flush=True)
    return n


def main() -> None:
    force = "--force" in sys.argv
    if not WORDS_FILE.exists():
        print(f"missing {WORDS_FILE}", file=sys.stderr)
        sys.exit(1)
    words = [ln.strip() for ln in WORDS_FILE.read_text(encoding="utf-8").splitlines() if ln.strip()]
    print(f"voice={VOICE} words={len(words)} out={OUT}")
    n = asyncio.run(run(words, force))
    print(f"generated {n} new mp3")


if __name__ == "__main__":
    main()
