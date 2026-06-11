#!/usr/bin/env python3
"""Check which sentences still need MP3 generation."""
import json, re
from pathlib import Path

def slug(text):
    s = re.sub(r"[^a-z0-9]+", "-", text.lower().strip()).strip("-")
    return s[:80] or "sent"

have = set(Path("/tmp/have_mp3.txt").read_text().strip().split())
need = []
with open("data/training-core.jsonl") as f:
    for line in f:
        d = json.loads(line.strip())
        s = d.get("sentence", "")
        key = slug(s) + ".mp3"
        if key not in have:
            need.append(d)

print(f"Need to generate: {len(need)} sentences")
for d in need[:5]:
    print(f'  [{d["id"]}] {d["sentence"][:60]}')

# Write need list for batch gen
with open("/tmp/need_audio.jsonl", "w") as f:
    for d in need:
        f.write(json.dumps(d, ensure_ascii=False) + "\n")
print(f"Wrote {len(need)} to /tmp/need_audio.jsonl")
