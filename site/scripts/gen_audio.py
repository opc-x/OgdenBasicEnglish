import os
import sys
import json
import subprocess
import re

def main():
    # Paths relative to site directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    site_dir = os.path.dirname(script_dir)
    training_data_path = os.path.join(site_dir, "src/practice/trainingData.ts")
    audio_dir = os.path.join(site_dir, "public/audio/sentences")
    
    # Virtualenv edge-tts executable path
    venv_bin_dir = os.path.join(script_dir, ".venv-tts", "bin")
    edge_tts_path = os.path.join(venv_bin_dir, "edge-tts")
    if not os.path.exists(edge_tts_path):
        # Fallback to system edge-tts if not in venv
        edge_tts_path = "edge-tts"

    print(f"Using edge-tts path: {edge_tts_path}")
    print(f"Audio output directory: {audio_dir}")
    os.makedirs(audio_dir, exist_ok=True)

    if not os.path.exists(training_data_path):
        print(f"Error: {training_data_path} not found!")
        sys.exit(1)

    sentences_to_generate = []
    
    # Parse TS file line-by-line to extract JSON objects
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
                    # Ignore lines that are not valid JSON (e.g. comments, metadata)
                    pass

    total = len(sentences_to_generate)
    print(f"Found {total} sentences needing audio generation.")
    
    if total == 0:
        print("All sentences already have audio. Nothing to do!")
        return

    completed = 0
    failed = 0
    for idx, (s_id, text, mp3_path) in enumerate(sentences_to_generate):
        print(f"[{idx+1}/{total}] Generating audio for ID {s_id}: \"{text}\"")
        
        # Clean text slightly (ensure no weird quotes or trailing spaces)
        clean_text = text.strip()
        
        # Call edge-tts
        # Retry up to 3 times
        success = False
        for attempt in range(3):
            try:
                res = subprocess.run(
                    [edge_tts_path, "--voice", "en-GB-SoniaNeural", "--text", clean_text, "--write-media", mp3_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                if res.returncode == 0 and os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 0:
                    success = True
                    break
                else:
                    print(f"  Attempt {attempt+1} failed: {res.stderr.strip()}")
            except Exception as e:
                print(f"  Attempt {attempt+1} error: {e}")
        
        if success:
            completed += 1
        else:
            failed += 1
            print(f"  Failed to generate audio for ID {s_id} after 3 attempts.")

    print(f"Audio generation complete: {completed} succeeded, {failed} failed.")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
