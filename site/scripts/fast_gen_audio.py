import os
import sys
import json
import asyncio
import re
import edge_tts

VOICE = "en-GB-SoniaNeural"
CONCURRENCY = 20

async def gen_one(text: str, path: str, s_id: int, sem: asyncio.Semaphore):
    async with sem:
        for attempt in range(3):
            try:
                # clean text
                clean_text = text.strip()
                communicate = edge_tts.Communicate(clean_text, VOICE)
                await communicate.save(path)
                if os.path.exists(path) and os.path.getsize(path) > 0:
                    print(f"Generated audio for ID {s_id}: \"{clean_text}\"")
                    return True
            except Exception as e:
                print(f"Attempt {attempt+1} failed for ID {s_id}: {e}")
                await asyncio.sleep(1)
        print(f"FAILED to generate audio for ID {s_id} after 3 attempts.")
        return False

async def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    site_dir = os.path.dirname(script_dir)
    training_data_path = os.path.join(site_dir, "src/practice/trainingData.ts")
    audio_dir = os.path.join(site_dir, "public/audio/sentences")
    
    os.makedirs(audio_dir, exist_ok=True)
    
    if not os.path.exists(training_data_path):
        print(f"Error: {training_data_path} not found!")
        sys.exit(1)
        
    sentences_to_generate = []
    
    with open(training_data_path, 'r', encoding='utf-8') as f:
        for line in f:
            match = re.search(r'^\s*({.*}),?\s*$', line)
            if match:
                try:
                    s_data = json.loads(match.group(1))
                    s_id = s_data.get("id")
                    sentence_text = s_data.get("sentence")
                    if s_id and sentence_text:
                        mp3_path = os.path.join(audio_dir, f"{s_id}.mp3")
                        if not os.path.exists(mp3_path) or os.path.getsize(mp3_path) == 0:
                            sentences_to_generate.append((s_id, sentence_text, mp3_path))
                except Exception as e:
                    pass
                    
    total = len(sentences_to_generate)
    print(f"Found {total} sentences needing audio generation.")
    
    if total == 0:
        print("All sentences already have audio. Nothing to do!")
        return
        
    sem = asyncio.Semaphore(CONCURRENCY)
    tasks = []
    for s_id, text, mp3_path in sentences_to_generate:
        tasks.append(gen_one(text, mp3_path, s_id, sem))
        
    results = await asyncio.gather(*tasks)
    succeeded = sum(1 for r in results if r)
    failed = total - succeeded
    print(f"Audio generation complete: {succeeded} succeeded, {failed} failed.")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
