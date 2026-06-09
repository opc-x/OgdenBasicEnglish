/** 发音：edge-tts MP3（en-GB-SoniaNeural）优先；仅无音频时回退英式 TTS */

const AUDIO_BASE = "/assets/audio";
const VOICE_ID = "en-GB-SoniaNeural";

let currentAudio: HTMLAudioElement | null = null;
let voicesReady: Promise<SpeechSynthesisVoice[]> | null = null;

function slug(word: string): string {
  const s = word.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return s.slice(0, 60) || "word";
}

export function audioUrl(word: string): string {
  return `${AUDIO_BASE}/${slug(word)}.mp3`;
}

function stop(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) {
    return Promise.resolve([]);
  }
  if (!voicesReady) {
    voicesReady = new Promise((resolve) => {
      const pick = () => resolve(window.speechSynthesis.getVoices());
      pick();
      window.speechSynthesis.onvoiceschanged = () => {
        pick();
        window.speechSynthesis.onvoiceschanged = null;
      };
    });
  }
  return voicesReady;
}

function pickBritishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const gb = voices.filter((v) => /^en-GB/i.test(v.lang));
  return (
    gb.find((v) => /sonia/i.test(v.name)) ??
    gb.find((v) => /kate|serena|martha|fiona|female/i.test(v.name)) ??
    gb[0] ??
    voices.find((v) => /^en-GB/i.test(v.lang))
  );
}

async function speakWithBrowser(text: string): Promise<void> {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const voices = await loadVoices();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-GB";
  u.rate = 0.92;
  const voice = pickBritishVoice(voices);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

function playMp3(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.preload = "auto";
    const done = () => {
      audio.removeEventListener("ended", done);
      resolve();
    };
    audio.addEventListener("ended", done);
    audio.onerror = () => reject(new Error("audio error"));
    audio.play().catch(reject);
  });
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && ("Audio" in window || "speechSynthesis" in window);
}

/** 是否有预生成 Sonia MP3（HEAD 探测，结果缓存） */
const audioCache = new Map<string, boolean>();

export async function hasSoniaAudio(word: string): Promise<boolean> {
  const key = slug(word);
  if (audioCache.has(key)) return audioCache.get(key)!;
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch(audioUrl(word), { method: "HEAD" });
    const ok = res.ok;
    audioCache.set(key, ok);
    return ok;
  } catch {
    audioCache.set(key, false);
    return false;
  }
}

export async function speak(word: string): Promise<void> {
  if (typeof window === "undefined") return;
  stop();
  const url = audioUrl(word);
  try {
    if (await hasSoniaAudio(word)) {
      await playMp3(url);
      return;
    }
  } catch {
    /* fall through */
  }
  await speakWithBrowser(word);
}

/** 整句朗读（练习模块用） */
export async function speakText(text: string): Promise<void> {
  if (typeof window === "undefined") return;
  stop();
  await speakWithBrowser(text);
}

export { VOICE_ID };
