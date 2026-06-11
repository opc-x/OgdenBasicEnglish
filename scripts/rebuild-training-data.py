#!/usr/bin/env python3
"""Rebuild trainingData.ts from training-core.jsonl with MP3 audio fields."""
import json, os, glob

DATA_FILE = '../data/training-core.jsonl'
MP3_DIR = 'src/practice/../../../site/public/audio/sentences'
OUT_FILE = 'src/practice/trainingData.ts'

# Load data
with open(DATA_FILE) as f:
    data = [json.loads(l) for l in f]

# Find all MP3 files
mp3_files = set()
for f in glob.glob(os.path.join(MP3_DIR, '*.mp3')):
    name = os.path.basename(f).replace('.mp3', '')
    mp3_files.add(name)

print(f'Loaded {len(data)} sentences, found {len(mp3_files)} MP3 files')

# Generate TypeScript
lines = [
    '// Auto-generated Ogden BE850 training data with Chinese translations',
    'export type TrainingSentence = {',
    '  id: number; step: number; type: string; sentence: string;',
    '  zh?: string; operator?: string; direction?: string;',
    '  noun?: string; replaces?: string; scene?: string; audio?: string;',
    '};',
    '',
    'export const TRAINING_SENTENCES: TrainingSentence[] = [',
]

audio_count = 0
for s in data:
    obj = {
        'id': s['id'],
        'step': s['step'],
        'type': s['type'],
        'sentence': s['sentence']
    }
    if s.get('zh'): obj['zh'] = s['zh']
    if s.get('operator'): obj['operator'] = s['operator']
    if s.get('direction'): obj['direction'] = s['direction']
    if s.get('noun'): obj['noun'] = s['noun']
    if s.get('replaces'): obj['replaces'] = s['replaces']
    if s.get('scene'): obj['scene'] = s['scene']
    
    # Check for MP3 by ID
    sid = str(s['id'])
    if sid in mp3_files:
        obj['audio'] = f'/audio/sentences/{sid}.mp3'
        audio_count += 1
    
    lines.append(f'  {json.dumps(obj, ensure_ascii=False)},')

lines.append('];')
lines.append('')

with open(OUT_FILE, 'w') as f:
    f.write('\n'.join(lines))

print(f'Generated {OUT_FILE} with {len(data)} sentences, {audio_count} with audio')
