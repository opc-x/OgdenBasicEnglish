#!/usr/bin/env python3
"""从 training-core.jsonl 重新生成 trainingData.ts"""
import json

data_path = "data/training-core.jsonl"
out_path = "site/src/practice/trainingData.ts"

sentences = []
with open(data_path) as f:
    for line in f:
        line = line.strip()
        if line:
            sentences.append(json.loads(line))

header = '''// Auto-generated Ogden BE850 training data with Chinese translations
// Source: data/training-core.jsonl
// DO NOT EDIT MANUALLY — regenerate with scripts/regenerate-trainingData.py

export type TrainingSentence = {
  id: number; step: number; type: string; sentence: string;
  zh?: string; operator?: string; direction?: string;
  noun?: string; replaces?: string; scene?: string;
  audio?: string;
};

export const TRAINING_SENTENCES: TrainingSentence[] = [
'''

footer = '];\n'

with open(out_path, 'w') as f:
    f.write(header)
    for s in sentences:
        sentence = s.get('sentence', '')
        if not sentence:
            continue
        # 构建对象
        obj = {
            'id': s.get('id', 0),
            'step': s.get('step', 1),
            'type': s.get('type', 'op_direction'),
            'sentence': sentence,
        }
        if s.get('zh'):
            obj['zh'] = s['zh']
        if s.get('operator'):
            obj['operator'] = s['operator']
        if s.get('direction'):
            obj['direction'] = s['direction']
        if s.get('noun'):
            obj['noun'] = s['noun']
        if s.get('replaces'):
            obj['replaces'] = s['replaces']
        if s.get('scene'):
            obj['scene'] = s['scene']
        if s.get('audio'):
            obj['audio'] = s['audio']
        
        f.write('  ' + json.dumps(obj, ensure_ascii=False) + ',\n')
    f.write(footer)

print(f"Generated {len(sentences)} sentences → {out_path}")
