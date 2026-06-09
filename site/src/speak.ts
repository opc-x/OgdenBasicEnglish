/** 用浏览器内置 TTS 朗读英文单词；优先选柔和女声（如 macOS 的 Samantha）。 */

let cachedVoice: SpeechSynthesisVoice | null = null;
let triedLoad = false;

const FEMALE_HINTS = /samantha|victoria|karen|moira|tessa|fiona|serena|zira|female|woman|allison|ava|susan/i;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const en = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
  const pool = en.length ? en : voices;
  return (
    pool.find((v) => FEMALE_HINTS.test(v.name)) ||
    pool.find((v) => /en-US/i.test(v.lang)) ||
    pool[0] ||
    null
  );
}

function ensureVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  cachedVoice = pickVoice();
  if (!triedLoad && typeof window !== "undefined" && window.speechSynthesis) {
    triedLoad = true;
    window.speechSynthesis.onvoiceschanged = () => {
      cachedVoice = pickVoice();
    };
  }
  return cachedVoice;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(word: string): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(word);
  u.lang = "en-US";
  u.rate = 0.82; // 稍慢，柔和清晰
  u.pitch = 1.08; // 略高，更温柔
  const v = ensureVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

// 预热：页面加载后让浏览器尽早加载语音列表
if (typeof window !== "undefined" && window.speechSynthesis) {
  ensureVoice();
}
