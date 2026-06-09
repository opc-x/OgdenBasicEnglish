/**
 * 为 word-annotations.json 中缺 img 的词批量补图：
 * 1. Wikipedia REST summary 缩略图
 * 2. Wikimedia Commons 搜索
 * 3. 程序化 SVG（data URI）兜底
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ANN_PATH = join(__dirname, "../src/word-annotations.json");

const OPERATORS = new Set([
  "come", "get", "give", "go", "keep", "let", "make", "put", "seem", "take",
  "be", "do", "have", "say", "see", "send", "may", "will",
]);

const COLORS = {
  black: "#1a1a1a", white: "#f5f5f0", red: "#dc2626", brown: "#92400e",
  grey: "#6b7280", green: "#16a34a", blue: "#2563eb", yellow: "#eab308",
};

const PREP_VISUAL = {
  about: "ring", across: "cross", after: "right", against: "block", among: "dots",
  at: "dot", before: "left", between: "between", by: "side", down: "down",
  from: "from", in: "in", off: "off", on: "on", over: "over", through: "through",
  to: "to", under: "under", up: "up", with: "with", as: "as", for: "for",
  of: "of", till: "till", than: "than", north: "north", south: "south",
  east: "east", west: "west", forward: "forward", here: "here", there: "there",
  near: "near", far: "far", out: "out", together: "together",
};

function svgData(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function wrapSvg(inner, bg = "#f7f5f0") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect width="200" height="150" fill="${bg}"/>${inner}</svg>`;
}

function colorSvg(hex) {
  return svgData(wrapSvg(
    `<rect x="40" y="30" width="120" height="90" rx="12" fill="${hex}" stroke="#d4cfc4" stroke-width="2"/>` +
    `<circle cx="100" cy="75" r="28" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="3"/>`
  ));
}

function prepSvg(kind) {
  const s = "#b45309", m = "#2c2825", f = "#d4cfc4";
  const map = {
    ring: `<circle cx="100" cy="75" r="35" fill="none" stroke="${s}" stroke-width="4"/><circle cx="100" cy="75" r="8" fill="${m}"/>`,
    cross: `<path d="M30 75 H170 M100 20 V130" stroke="${f}" stroke-width="3"/><path d="M55 75 H145" stroke="${s}" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="75" r="6" fill="${m}"/>`,
    right: `<circle cx="55" cy="75" r="10" fill="${m}"/><path d="M70 75 H150" stroke="${s}" stroke-width="4"/><path d="M140 65 L155 75 L140 85" fill="none" stroke="${s}" stroke-width="4"/>`,
    left: `<circle cx="145" cy="75" r="10" fill="${m}"/><path d="M130 75 H50" stroke="${s}" stroke-width="4"/><path d="M60 65 L45 75 L60 85" fill="none" stroke="${s}" stroke-width="4"/>`,
    down: `<path d="M100 25 V110" stroke="${s}" stroke-width="5"/><path d="M85 95 L100 115 L115 95" fill="none" stroke="${s}" stroke-width="4"/>`,
    up: `<path d="M100 125 V40" stroke="${s}" stroke-width="5"/><path d="M85 55 L100 35 L115 55" fill="none" stroke="${s}" stroke-width="4"/>`,
    in: `<rect x="55" y="45" width="90" height="60" rx="6" fill="none" stroke="${m}" stroke-width="3"/><circle cx="100" cy="75" r="12" fill="${s}"/>`,
    on: `<rect x="40" y="85" width="120" height="12" rx="3" fill="${m}"/><circle cx="100" cy="65" r="14" fill="${s}"/>`,
    under: `<rect x="40" y="55" width="120" height="12" rx="3" fill="${m}"/><circle cx="100" cy="95" r="14" fill="${s}"/>`,
    over: `<rect x="40" y="55" width="120" height="12" rx="3" fill="${m}"/><circle cx="100" cy="40" r="14" fill="${s}" opacity="0.85"/>`,
    between: `<rect x="35" y="50" width="18" height="50" rx="4" fill="${m}"/><rect x="147" y="50" width="18" height="50" rx="4" fill="${m}"/><circle cx="100" cy="75" r="12" fill="${s}"/>`,
    with: `<circle cx="70" cy="75" r="14" fill="${m}"/><circle cx="130" cy="75" r="14" fill="${s}"/><path d="M84 75 H116" stroke="${f}" stroke-width="3" stroke-dasharray="4 3"/>`,
    dot: `<circle cx="100" cy="75" r="35" fill="none" stroke="${f}" stroke-width="2" stroke-dasharray="5 4"/><circle cx="100" cy="75" r="10" fill="${s}"/>`,
    block: `<rect x="60" y="50" width="30" height="50" rx="4" fill="${m}"/><path d="M100 75 H155" stroke="${s}" stroke-width="4"/><path d="M145 68 L158 75 L145 82" fill="none" stroke="${s}" stroke-width="3"/>`,
    dots: `<circle cx="60" cy="55" r="8" fill="${m}"/><circle cx="100" cy="75" r="8" fill="${m}"/><circle cx="140" cy="95" r="8" fill="${m}"/><circle cx="100" cy="75" r="16" fill="none" stroke="${s}" stroke-width="3"/>`,
    through: `<rect x="45" y="60" width="110" height="30" rx="6" fill="none" stroke="${m}" stroke-width="3"/><path d="M30 75 H170" stroke="${s}" stroke-width="4"/><circle cx="100" cy="75" r="6" fill="${s}"/>`,
    to: `<circle cx="45" cy="75" r="8" fill="${f}"/><circle cx="155" cy="75" r="12" fill="${s}"/><path d="M58 75 H138" stroke="${s}" stroke-width="4"/>`,
    from: `<circle cx="45" cy="75" r="12" fill="${s}"/><circle cx="155" cy="75" r="8" fill="${f}"/><path d="M62 75 H142" stroke="${s}" stroke-width="4"/>`,
    off: `<rect x="50" y="70" width="70" height="10" fill="${m}"/><circle cx="140" cy="55" r="14" fill="${s}"/><path d="M130 65 L145 50" stroke="${s}" stroke-width="3"/>`,
    side: `<rect x="40" y="55" width="14" height="40" fill="${m}"/><circle cx="110" cy="75" r="14" fill="${s}"/>`,
    north: `<path d="M100 120 V35" stroke="${s}" stroke-width="4"/><path d="M88 50 L100 30 L112 50" fill="${s}"/><text x="100" y="140" text-anchor="middle" font-size="14" fill="${m}" font-family="sans-serif">N</text>`,
    south: `<path d="M100 30 V115" stroke="${s}" stroke-width="4"/><path d="M88 100 L100 120 L112 100" fill="${s}"/>`,
    east: `<path d="M40 75 H155" stroke="${s}" stroke-width="4"/><path d="M140 63 L158 75 L140 87" fill="${s}"/>`,
    west: `<path d="M160 75 H45" stroke="${s}" stroke-width="4"/><path d="M60 63 L42 75 L60 87" fill="${s}"/>`,
    forward: `<path d="M35 75 H165" stroke="${s}" stroke-width="5"/><path d="M150 60 L170 75 L150 90" fill="${s}"/>`,
    here: `<circle cx="100" cy="75" r="22" fill="${s}"/><circle cx="100" cy="75" r="35" fill="none" stroke="${s}" stroke-width="2" stroke-dasharray="4 4"/>`,
    there: `<circle cx="130" cy="65" r="14" fill="${s}"/><circle cx="60" cy="85" r="8" fill="${m}"/><path d="M72 80 H115" stroke="${f}" stroke-width="2" stroke-dasharray="5 4"/>`,
    near: `<circle cx="75" cy="75" r="18" fill="${s}"/><circle cx="125" cy="75" r="10" fill="${m}"/>`,
    far: `<circle cx="55" cy="75" r="12" fill="${m}"/><circle cx="150" cy="75" r="10" fill="${s}"/><path d="M70 75 H135" stroke="${f}" stroke-width="2" stroke-dasharray="6 4"/>`,
    out: `<rect x="55" y="50" width="60" height="50" rx="6" fill="none" stroke="${m}" stroke-width="3"/><path d="M115 75 H165" stroke="${s}" stroke-width="4"/><path d="M152 65 L168 75 L152 85" fill="none" stroke="${s}" stroke-width="3"/>`,
    together: `<circle cx="75" cy="75" r="16" fill="${m}"/><circle cx="125" cy="75" r="16" fill="${s}"/><path d="M91 75 H109" stroke="#fff" stroke-width="3"/>`,
    as: `<rect x="50" y="55" width="45" height="40" rx="4" fill="${f}" stroke="${m}" stroke-width="2"/><path d="M105 75 H145" stroke="${s}" stroke-width="3"/><rect x="145" y="55" width="10" height="40" fill="${s}" opacity="0.5"/>`,
    for: `<circle cx="55" cy="75" r="12" fill="${m}"/><path d="M75 75 Q100 40 130 75" fill="none" stroke="${s}" stroke-width="3"/><circle cx="140" cy="75" r="8" fill="${s}"/>`,
    of: `<circle cx="70" cy="75" r="20" fill="none" stroke="${m}" stroke-width="3"/><circle cx="120" cy="75" r="10" fill="${s}"/>`,
    till: `<circle cx="60" cy="75" r="8" fill="${m}"/><path d="M80 75 H150" stroke="${s}" stroke-width="3"/><rect x="145" y="60" width="8" height="30" fill="${s}"/>`,
    than: `<rect x="45" y="55" width="35" height="40" fill="${m}" opacity="0.3"/><rect x="120" y="45" width="35" height="50" fill="${s}" opacity="0.5"/><text x="100" y="80" text-anchor="middle" font-size="20" fill="${m}" font-family="sans-serif">&gt;</text>`,
  };
  return svgData(wrapSvg(map[kind] || map.dot));
}

function operatorSvg(op) {
  const s = "#b45309", m = "#2c2825", f = "#d4cfc4";
  const ops = {
    come: `<circle cx="140" cy="75" r="8" fill="${m}"/><path d="M30 75 H115" stroke="${s}" stroke-width="5" stroke-linecap="round"/><path d="M100 62 L115 75 L100 88" fill="none" stroke="${s}" stroke-width="4"/>`,
    go: `<circle cx="60" cy="75" r="8" fill="${m}"/><path d="M60 75 H170" stroke="${s}" stroke-width="5"/><path d="M155 62 L170 75 L155 88" fill="none" stroke="${s}" stroke-width="4"/>`,
    put: `<path d="M60 95 H140 V120 H60 Z" stroke="${f}" stroke-width="3" fill="none"/><path d="M100 25 V85" stroke="${s}" stroke-width="4"/><path d="M88 72 L100 85 L112 72" fill="none" stroke="${s}" stroke-width="4"/>`,
    take: `<path d="M60 95 H140 V120 H60 Z" stroke="${f}" stroke-width="3" fill="none"/><path d="M100 105 V40" stroke="${s}" stroke-width="4"/><path d="M88 52 L100 40 L112 52" fill="none" stroke="${s}" stroke-width="4"/>`,
    give: `<circle cx="50" cy="75" r="10" fill="${m}"/><circle cx="150" cy="75" r="10" fill="${f}"/><path d="M65 68 Q100 45 135 68" fill="none" stroke="${s}" stroke-width="4"/>`,
    get: `<circle cx="150" cy="75" r="10" fill="${m}"/><circle cx="50" cy="75" r="10" fill="${f}"/><path d="M65 68 Q100 45 135 68" fill="none" stroke="${s}" stroke-width="4"/><path d="M72 62 L60 75 L72 78" fill="none" stroke="${s}" stroke-width="3"/>`,
    send: `<circle cx="50" cy="75" r="12" fill="${m}"/><path d="M70 60 L155 35" stroke="${s}" stroke-width="3"/><path d="M72 75 H160" stroke="${s}" stroke-width="4"/><path d="M70 90 L155 115" stroke="${s}" stroke-width="3"/>`,
    keep: `<circle cx="100" cy="75" r="14" fill="${m}"/><path d="M100 38 A37 37 0 1 1 99 38" fill="none" stroke="${s}" stroke-width="4"/>`,
    let: `<path d="M100 25 V55 M100 95 V125" stroke="${m}" stroke-width="4"/><path d="M30 75 H170" stroke="${s}" stroke-width="4" stroke-dasharray="8 4"/>`,
    make: `<rect x="50" y="90" width="100" height="18" rx="4" fill="${f}"/><rect x="70" y="65" width="60" height="18" rx="4" fill="none" stroke="${s}" stroke-width="3"/><path d="M100 30 V55" stroke="${s}" stroke-width="3"/>`,
    do: `<circle cx="75" cy="65" r="22" fill="none" stroke="${m}" stroke-width="3" stroke-dasharray="6 4"/><circle cx="125" cy="95" r="16" fill="none" stroke="${s}" stroke-width="3" stroke-dasharray="4 3"/>`,
    see: `<path d="M25 75 Q100 30 175 75 Q100 120 25 75 Z" fill="none" stroke="${m}" stroke-width="4"/><circle cx="100" cy="75" r="12" fill="${s}"/>`,
    say: `<path d="M35 45 H165 V90 H90 L55 115 V90 H35 Z" fill="none" stroke="${m}" stroke-width="3"/><path d="M60 68 H140" stroke="${s}" stroke-width="3"/>`,
    be: `<circle cx="100" cy="75" r="28" fill="none" stroke="${s}" stroke-width="5"/><circle cx="100" cy="75" r="10" fill="${m}"/>`,
    have: `<rect x="55" y="45" width="90" height="60" rx="8" fill="none" stroke="${m}" stroke-width="4"/><circle cx="100" cy="75" r="12" fill="${s}"/>`,
    seem: `<path d="M100 25 V125" stroke="${m}" stroke-width="2" stroke-dasharray="5 4"/><circle cx="65" cy="75" r="14" fill="${m}"/><circle cx="135" cy="75" r="14" fill="none" stroke="${s}" stroke-width="3" stroke-dasharray="4 3"/>`,
    may: `<path d="M25 75 H75" stroke="${m}" stroke-width="4"/><path d="M75 75 Q95 45 155 40" fill="none" stroke="${s}" stroke-width="3"/><path d="M75 75 Q95 105 155 110" fill="none" stroke="${s}" stroke-width="3" stroke-dasharray="5 3"/>`,
    will: `<path d="M25 75 H165" stroke="${s}" stroke-width="5"/><path d="M150 60 L170 75 L150 90" fill="none" stroke="${s}" stroke-width="4"/>`,
  };
  return svgData(wrapSvg(ops[op] || ops.be));
}

function conceptSvg(word, cn, tier) {
  const s = "#b45309", m = "#2c2825";
  const tierColors = { ops: "#b45309", pic: "#15803d", things: "#1d6fa5", qual: "#7e22ce", opp: "#be123c" };
  const accent = tierColors[tier] || s;
  const label = (cn || word).slice(0, 4);
  // 按中文语义选简单图标
  let icon = "";
  const c = cn || "";
  if (/人|他|她|我|谁/.test(c)) icon = `<circle cx="100" cy="55" r="18" fill="${m}"/><path d="M70 120 Q100 80 130 120" fill="${m}"/>`;
  else if (/时间|时|天|月|年|刻/.test(c)) icon = `<circle cx="100" cy="75" r="35" fill="none" stroke="${m}" stroke-width="3"/><path d="M100 75 V50" stroke="${s}" stroke-width="3"/><path d="M100 75 H120" stroke="${s}" stroke-width="2"/>`;
  else if (/心|情|爱|恨|怕|乐|悲/.test(c)) icon = `<path d="M100 115 C60 80 45 60 65 45 C80 35 95 50 100 58 C105 50 120 35 135 45 C155 60 140 80 100 115 Z" fill="${s}"/>`;
  else if (/说|言|语|话/.test(c)) icon = `<ellipse cx="100" cy="70" rx="50" ry="30" fill="none" stroke="${m}" stroke-width="3"/><path d="M75 85 L65 105 L90 90" fill="${m}"/>`;
  else if (/看|见|眼/.test(c)) icon = `<ellipse cx="100" cy="75" rx="55" ry="30" fill="none" stroke="${m}" stroke-width="3"/><circle cx="100" cy="75" r="12" fill="${s}"/>`;
  else if (/大|小|高|低|长|短|宽|窄/.test(c)) icon = `<rect x="55" y="70" width="30" height="30" fill="${m}" opacity="0.4"/><rect x="115" y="50" width="30" height="50" fill="${s}" opacity="0.6"/>`;
  else if (/好|坏|对|错|真|假/.test(c)) icon = `<path d="M60 75 L85 100 L140 50" fill="none" stroke="${s}" stroke-width="6" stroke-linecap="round"/>`;
  else if (/多|少|全|部/.test(c)) icon = `<circle cx="70" cy="75" r="8" fill="${m}"/><circle cx="100" cy="75" r="8" fill="${m}"/><circle cx="130" cy="75" r="8" fill="${s}"/>`;
  else if (/水|液|雨|海|河/.test(c)) icon = `<path d="M30 90 Q60 60 90 90 T150 90" fill="none" stroke="${accent}" stroke-width="4"/>`;
  else if (/火|热|烧/.test(c)) icon = `<path d="M100 115 C85 95 80 70 95 55 C90 75 105 70 100 90 C110 70 115 90 100 115 Z" fill="${s}"/>`;
  else if (/声|音|听/.test(c)) icon = `<path d="M70 60 V90 M75 55 Q95 75 75 95" fill="none" stroke="${m}" stroke-width="3"/><path d="M105 65 Q125 75 105 85" fill="none" stroke="${s}" stroke-width="3"/>`;
  else if (/数|量|计/.test(c)) icon = `<text x="100" y="90" text-anchor="middle" font-size="48" fill="${m}" font-family="serif">#</text>`;
  else if (/法|律|规/.test(c)) icon = `<rect x="70" y="40" width="60" height="80" fill="none" stroke="${m}" stroke-width="3"/><path d="M80 55 H120 M80 70 H120 M80 85 H105" stroke="#d4cfc4" stroke-width="2"/>`;
  else icon = `<circle cx="100" cy="60" r="22" fill="none" stroke="${accent}" stroke-width="3"/><text x="100" y="110" text-anchor="middle" font-size="22" fill="${m}" font-family="Georgia,serif">${word.slice(0, 6)}</text>`;

  return svgData(wrapSvg(
    icon + `<text x="100" y="138" text-anchor="middle" font-size="13" fill="${accent}" font-family="sans-serif">${label}</text>`,
    "#faf8f4"
  ));
}

function fallbackSvg(word, cn, tier) {
  if (OPERATORS.has(word)) return operatorSvg(word);
  if (COLORS[word]) return colorSvg(COLORS[word]);
  if (PREP_VISUAL[word]) return prepSvg(PREP_VISUAL[word]);
  return conceptSvg(word, cn, tier);
}

async function wikiThumb(word) {
  try {
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(word)}`,
      { headers: { "User-Agent": "OgdenBasicEnglish/1.0 (study site)" } }
    );
    if (!r.ok) return null;
    const j = await r.json();
    if (!j.thumbnail?.source) return null;
    return j.thumbnail.source.replace(/\/(\d+)px-/, "/200px-");
  } catch {
    return null;
  }
}

async function commonsThumb(word) {
  try {
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.searchParams.set("action", "query");
    url.searchParams.set("generator", "search");
    url.searchParams.set("gsrsearch", word);
    url.searchParams.set("gsrnamespace", "6");
    url.searchParams.set("prop", "imageinfo");
    url.searchParams.set("iiprop", "url");
    url.searchParams.set("iiurlwidth", "200");
    url.searchParams.set("format", "json");
    url.searchParams.set("origin", "*");
    const r = await fetch(url);
    const j = await r.json();
    const pages = j.query?.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0];
    return first?.imageinfo?.[0]?.thumburl || null;
  } catch {
    return null;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const ann = JSON.parse(readFileSync(ANN_PATH, "utf8"));
const missing = Object.keys(ann).filter((w) => !ann[w].img);
console.log(`Missing images: ${missing.length}`);

const TIER_MAP = {};
const w850 = readFileSync(join(__dirname, "../src/words850.ts"), "utf8");
const opsBlock = w850.match(/const OPS_RAW[\s\S]*?\];/);
if (opsBlock) {
  for (const m of opsBlock[0].matchAll(/w: "([^"]+)"/g)) TIER_MAP[m[1]] = "ops";
}
for (const [name, tier] of [
  ["PIC_WORDS", "pic"],
  ["THINGS_WORDS", "things"],
  ["QUAL_WORDS", "qual"],
  ["OPP_WORDS", "opp"],
]) {
  const m = w850.match(new RegExp(`const ${name}\\s*=\\s*\\n\\s*"([^"]+)"`));
  if (m) m[1].split(",").forEach((w) => { TIER_MAP[w.trim()] = tier; });
}

let wiki = 0, commons = 0, svg = 0;
const onlySvg = process.argv.includes("--svg-only");
const dryRun = process.argv.includes("--dry-run");

for (let i = 0; i < missing.length; i++) {
  const word = missing[i];
  const cn = ann[word].cn;
  const tier = TIER_MAP[word] || "things";

  let img = null;
  const svgFirst =
    OPERATORS.has(word) ||
    PREP_VISUAL[word] ||
    COLORS[word] ||
    tier === "qual" ||
    tier === "opp";

  if (!onlySvg && !svgFirst && tier === "things") {
    img = await wikiThumb(word);
    if (img) wiki++;
    else {
      await sleep(100);
      img = await commonsThumb(word);
      if (img) commons++;
      await sleep(100);
    }
  } else if (!onlySvg && !svgFirst && tier === "ops") {
    img = await wikiThumb(word);
    if (img) wiki++;
    await sleep(80);
  }

  if (!img) {
    img = fallbackSvg(word, cn, tier);
    svg++;
  }

  if (!dryRun) ann[word].img = img;
  if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${missing.length}...`);
}

if (!dryRun) {
  writeFileSync(ANN_PATH, JSON.stringify(ann, null, 2) + "\n");
}

console.log(`Done. wiki=${wiki} commons=${commons} svg=${svg}`);
console.log(`Total with img: ${Object.values(ann).filter((v) => v.img).length}`);
