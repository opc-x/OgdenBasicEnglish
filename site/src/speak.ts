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
  await new Promise<void>((resolve) => {
    // Chrome 在长句朗读 ~15s 后会静默暂停，周期性 pause/resume 保活
    const keepAlive = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        window.clearInterval(keepAlive);
        return;
      }
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }, 12000);
    const finish = () => {
      window.clearInterval(keepAlive);
      resolve();
    };
    u.onend = finish;
    u.onerror = finish;
    window.speechSynthesis.speak(u);
  });
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

/** 整句朗读（练习模块用）—— 句子级 MP3 优先，fallback 浏览器 TTS */
const sentenceAudioCache = new Map<string, boolean>();

function sentenceSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "s";
}

export async function hasSentenceAudio(text: string, sentenceId?: number): Promise<boolean> {
  const key = sentenceId ? String(sentenceId) : sentenceSlug(text);
  if (sentenceAudioCache.has(key)) return sentenceAudioCache.get(key)!;
  if (typeof window === "undefined") return false;
  try {
    const res = await fetch(`/audio/sentences/${key}.mp3`, { method: "HEAD" });
    const ok = res.ok;
    sentenceAudioCache.set(key, ok);
    return ok;
  } catch {
    sentenceAudioCache.set(key, false);
    return false;
  }
}

export async function speakText(text: string, sentenceId?: number): Promise<void> {
  if (typeof window === "undefined") return;
  stop();
  // 优先句子级 MP3（用ID查，fallback用slug）
  const key = sentenceId ? String(sentenceId) : sentenceSlug(text);
  if (await hasSentenceAudio(text, sentenceId)) {
    try { await playMp3(`/audio/sentences/${key}.mp3`); return; } catch { /* fall through */ }
  }
  // 单个词优先 Sonia 单词 MP3；句子整句走浏览器英式 TTS（禁止拆词拼读）
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 1 && (await hasSoniaAudio(text))) {
    try { await playMp3(audioUrl(text)); return; } catch { /* fall through */ }
  }
  await speakWithBrowser(text);
}

export { VOICE_ID };
