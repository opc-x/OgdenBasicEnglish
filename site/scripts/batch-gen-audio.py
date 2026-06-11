#!/usr/bin/env python3
"""Batch-generate Sonia-Neural MP3 for all training sentences in main repo."""
import json, re, asyncio, sys
from pathlib import Path

VOICE = "en-GB-SoniaNeural"
# This file lives in <repo>/site/scripts/, so parents[2] = <repo>/
SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent.parent
AUDIO_DIR = ROOT / "site" / "public" / "audio" / "sentences"
DATA_FILE = ROOT / "data" / "training-core.jsonl"
OUT_FILE = ROOT / "data" / "training-with-audio.jsonl"

def slug(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower().strip("([])'\"\\[],.!?;:")).strip("-")
    return s[:80] or "sent"

async def gen_one(text: str, path: Path) -> bool:
    import edge_tts
    if path.exists():
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    comm = edge_tts.Communicate(text, VOICE)
    await comm.save(str(path))
    return True

async def main():
    items = []
    with open(DATA_FILE) as f:
        for line in f:
            if line.strip():
                items.append(json.loads(line))

    total = len(items)
    ok = 0
    skip = 0

    print(f"ROOT={ROOT} Voice={VOICE} sentences={total} out={AUDIO_DIR}", flush=True)

    for i, item in enumerate(items, 1):
        sent = item["sentence"]
        fname = f"{slug(sent)}.mp3"
        mp3_path = AUDIO_DIR / fname
        generated = await gen_one(sent, mp3_path)
        if generated:
            ok += 1
        else:
            skip += 1
        item["audio"] = f"/audio/sentences/{fname}"
        if i % 50 == 0 or i == total:
            print(f"  {i}/{total} — {ok} new, {skip} skip", flush=True)

    with open(OUT_FILE, "w") as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False) + "\n")

    print(f"\nDone: {ok} generated, {skip} skipped")
    print(f"Updated: {OUT_FILE} ({total} items)")

if __name__ == "__main__":
    asyncio.run(main())
