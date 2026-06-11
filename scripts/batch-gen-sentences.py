#!/usr/bin/env python3
"""Batch generate MP3 for training sentences using edge-tts + Sonia Neural."""
import json, os, subprocess, sys, time

DATA = os.path.join(os.path.dirname(__file__), "..", "data", "training-core.jsonl")
OUT  = os.path.join(os.path.dirname(__file__), "..", "site", "public", "audio", "sentences")
VOICE = "en-GB-SoniaNeural"

os.makedirs(OUT, exist_ok=True)

sentences = []
with open(DATA) as f:
    for line in f:
        sentences.append(json.loads(line))

# 已有MP3的跳过
existing = set(f.replace(".mp3","") for f in os.listdir(OUT) if f.endswith(".mp3"))

todo = [s for s in sentences if str(s["id"]) not in existing]
print(f"总句数: {len(sentences)}, 已有MP3: {len(existing)}, 待生成: {len(todo)}", flush=True)

ok = 0
fail = 0
for i, s in enumerate(todo):
    sid = str(s["id"])
    text = s.get("sentence","").strip()
    if not text:
        continue
    out_path = os.path.join(OUT, f"{sid}.mp3")
    try:
        subprocess.run(
            ["edge-tts", "--voice", VOICE, "--text", text, "--write-media", out_path],
            check=True, timeout=30,
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        ok += 1
        if (i+1) % 50 == 0:
            print(f"  {i+1}/{len(todo)} 完成", flush=True)
    except Exception as e:
        fail += 1
        print(f"  ✗ ID {sid}: {e}", flush=True)

print(f"\nDone: {ok} 成功, {fail} 失败", flush=True)
