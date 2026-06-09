#!/usr/bin/env node
/**
 * 为抽象词生成「纯象形 / 动画」SVG —— 不含任何英文单词文本。
 * 输出覆盖 02-vocabulary/word-img/{word}.svg
 */
import { writeFileSync, copyFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../../02-vocabulary/word-img");

/* ── 调色 ── */
const A = "#b45309", G = "#15803d", BL = "#1d6fa5", P = "#7e22ce", R = "#be123c";
const INK = "#2c2825", MUT = "#c9c2b6", SOFT = "#ece6da";

/* ── 基元 ── */
const wrap = (b) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"><rect width="200" height="150" fill="#faf8f4"/>${b}</svg>`;
const Pa = (d, o = {}) => {
  const { c = INK, w = 3, f = "none", dash, extra = "" } = o;
  return `<path d="${d}" fill="${f}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ""} ${extra}/>`;
};
const Ci = (x, y, r, o = {}) => {
  const { f = "none", c = INK, w = 3, extra = "" } = o;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${c === "none" ? "" : ` stroke="${c}" stroke-width="${w}"`} ${extra}/>`;
};
const Re = (x, y, ww, h, o = {}) => {
  const { f = "none", c = INK, w = 3, rx = 6, extra = "" } = o;
  return `<rect x="${x}" y="${y}" width="${ww}" height="${h}" rx="${rx}" fill="${f}"${c === "none" ? "" : ` stroke="${c}" stroke-width="${w}"`} ${extra}/>`;
};
const Li = (x1, y1, x2, y2, o = {}) => {
  const { c = INK, w = 3, dash, extra = "" } = o;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""} ${extra}/>`;
};
const anim = (attr, vals, dur) =>
  `<animate attributeName="${attr}" values="${vals}" dur="${dur}" repeatCount="indefinite"/>`;
const animT = (type, vals, dur) =>
  `<animateTransform attributeName="transform" type="${type}" values="${vals}" dur="${dur}" repeatCount="indefinite"/>`;
const g = (inner, extra = "") => `<g ${extra}>${inner}</g>`;

/* 箭头：从(x1,y1)到(x2,y2) + 箭头头 */
function arrow(x1, y1, x2, y2, o = {}) {
  const { c = A, w = 3.5, dash } = o;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const h = 10;
  const hx1 = x2 - h * Math.cos(ang - 0.45), hy1 = y2 - h * Math.sin(ang - 0.45);
  const hx2 = x2 - h * Math.cos(ang + 0.45), hy2 = y2 - h * Math.sin(ang + 0.45);
  return Li(x1, y1, x2, y2, { c, w, dash }) + Pa(`M${hx1} ${hy1} L${x2} ${y2} L${hx2} ${hy2}`, { c, w });
}

/* 脸 */
function face(o = {}) {
  const { mouth = "smile", eyes = "dot", brows = "", tint = "#fff", extra = "", cx = 100, cy = 72, r = 36 } = o;
  let e = "";
  if (eyes === "dot") e = Ci(cx - 14, cy - 8, 3.5, { f: INK, c: "none" }) + Ci(cx + 14, cy - 8, 3.5, { f: INK, c: "none" });
  if (eyes === "happy") e = Pa(`M${cx - 20} ${cy - 8} Q${cx - 14} ${cy - 14} ${cx - 8} ${cy - 8}`) + Pa(`M${cx + 8} ${cy - 8} Q${cx + 14} ${cy - 14} ${cx + 20} ${cy - 8}`);
  if (eyes === "wide") e = Ci(cx - 14, cy - 9, 6) + Ci(cx + 14, cy - 9, 6) + Ci(cx - 14, cy - 9, 2, { f: INK, c: "none" }) + Ci(cx + 14, cy - 9, 2, { f: INK, c: "none" });
  if (eyes === "closed") e = Li(cx - 20, cy - 8, cx - 8, cy - 8) + Li(cx + 8, cy - 8, cx + 20, cy - 8);
  if (eyes === "x") e = Pa(`M${cx - 18} ${cy - 12} L${cx - 10} ${cy - 4} M${cx - 10} ${cy - 12} L${cx - 18} ${cy - 4}`, { w: 2.5 }) + Pa(`M${cx + 10} ${cy - 12} L${cx + 18} ${cy - 4} M${cx + 18} ${cy - 12} L${cx + 10} ${cy - 4}`, { w: 2.5 });
  if (eyes === "low") e = Pa(`M${cx - 20} ${cy - 6} Q${cx - 14} ${cy - 2} ${cx - 8} ${cy - 6}`) + Pa(`M${cx + 8} ${cy - 6} Q${cx + 14} ${cy - 2} ${cx + 20} ${cy - 6}`);
  let m = "";
  if (mouth === "smile") m = Pa(`M${cx - 16} ${cy + 12} Q${cx} ${cy + 25} ${cx + 16} ${cy + 12}`);
  if (mouth === "big") m = Pa(`M${cx - 18} ${cy + 10} Q${cx} ${cy + 34} ${cx + 18} ${cy + 10} Z`, { f: INK });
  if (mouth === "frown") m = Pa(`M${cx - 16} ${cy + 20} Q${cx} ${cy + 8} ${cx + 16} ${cy + 20}`);
  if (mouth === "flat") m = Li(cx - 14, cy + 16, cx + 14, cy + 16);
  if (mouth === "o") m = Ci(cx, cy + 16, 7);
  if (mouth === "small") m = Li(cx - 6, cy + 16, cx + 6, cy + 16);
  let b = "";
  if (brows === "angry") b = Pa(`M${cx - 24} ${cy - 20} L${cx - 6} ${cy - 14} M${cx + 24} ${cy - 20} L${cx + 6} ${cy - 14}`);
  if (brows === "up") b = Pa(`M${cx - 22} ${cy - 22} Q${cx - 14} ${cy - 26} ${cx - 6} ${cy - 22} M${cx + 6} ${cy - 22} Q${cx + 14} ${cy - 26} ${cx + 22} ${cy - 22}`);
  if (brows === "sad") b = Pa(`M${cx - 20} ${cy - 18} Q${cx - 12} ${cy - 22} ${cx - 6} ${cy - 16} M${cx + 20} ${cy - 18} Q${cx + 12} ${cy - 22} ${cx + 6} ${cy - 16}`);
  return Ci(cx, cy, r, { f: tint }) + b + e + m + extra;
}

/* 小人（火柴人）：head + torso + 自定义四肢 */
function man(cx, cy, limbs, o = {}) {
  const { c = INK, w = 3.2 } = o;
  return Ci(cx, cy - 26, 9, { c, w }) + Li(cx, cy - 17, cx, cy + 4, { c, w }) + Pa(limbs, { c, w });
}

/* 心形 */
const heart = (x, y, s = 1, f = R) =>
  `<path transform="translate(${x},${y}) scale(${s})" d="M0 6 C-2 -2 -14 -2 -14 7 C-14 15 -4 21 0 25 C4 21 14 15 14 7 C14 -2 2 -2 0 6 Z" fill="${f}"/>`;
/* 星 */
const star = (x, y, s = 1, f = A) =>
  `<path transform="translate(${x},${y}) scale(${s})" d="M0 -12 L3.5 -3.5 L12 -3 L5.5 3 L7.5 12 L0 7 L-7.5 12 L-5.5 3 L-12 -3 L-3.5 -3.5 Z" fill="${f}"/>`;
/* 问号(符号) */
const qmark = (x, y, s = 1, c = A) =>
  g(Pa("M-8 -10 Q-8 -20 0 -20 Q9 -20 9 -11 Q9 -4 0 -2 L0 4", { c, w: 4 }) + Ci(0, 12, 2.8, { f: c, c: "none" }), `transform="translate(${x},${y}) scale(${s})"`);
/* 勾/叉 */
const check = (x, y, s = 1, c = G) => Pa(`M${x - 12 * s} ${y} L${x - 3 * s} ${y + 9 * s} L${x + 13 * s} ${y - 10 * s}`, { c, w: 4.5 * s });
const cross = (x, y, s = 1, c = R) => Pa(`M${x - 9 * s} ${y - 9 * s} L${x + 9 * s} ${y + 9 * s} M${x + 9 * s} ${y - 9 * s} L${x - 9 * s} ${y + 9 * s}`, { c, w: 4.5 * s });
/* 时钟 */
const clock = (x, y, r, hAng, mAng, o = {}) => {
  const { c = INK, acc = A } = o;
  const hx = x + r * 0.45 * Math.sin(hAng), hy = y - r * 0.45 * Math.cos(hAng);
  const mx = x + r * 0.72 * Math.sin(mAng), my = y - r * 0.72 * Math.cos(mAng);
  return Ci(x, y, r, { c }) + Li(x, y, hx, hy, { c, w: 3.5 }) + Li(x, y, mx, my, { c: acc, w: 3 }) + Ci(x, y, 2.5, { f: c, c: "none" });
};
/* 文档 */
const doc = (x, y, w = 56, h = 70, lines = 4) => {
  let l = "";
  for (let i = 0; i < lines; i++) l += Li(x + 10, y + 16 + i * 13, x + w - 10, y + 16 + i * 13, { c: MUT, w: 3 });
  return Re(x, y, w, h, { f: "#fff", rx: 4 }) + l;
};
/* 言语泡 */
const bubble = (x, y, w = 60, h = 40, flip = false) =>
  Pa(`M${x} ${y} h${w} a8 8 0 0 1 8 8 v${h - 16} a8 8 0 0 1 -8 8 h${flip ? w - 18 : -w + 26} l${flip ? -12 : 12} 12 v-12 h${flip ? -8 : -10} a8 8 0 0 1 -8 -8 v${-(h - 16)} a8 8 0 0 1 8 -8 Z`.replaceAll("Z", "Z"), { f: "#fff" });
/* 波浪线 */
const wave = (x, y, len, amp = 6, c = BL, w = 3) =>
  Pa(`M${x} ${y} q${len / 8} ${-amp} ${len / 4} 0 t${len / 4} 0 t${len / 4} 0 t${len / 4} 0`, { c, w });
/* 太阳 */
const sun = (x, y, r = 14, c = A) => {
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a0 = (i * Math.PI) / 4;
    rays += Li(x + (r + 5) * Math.cos(a0), y + (r + 5) * Math.sin(a0), x + (r + 12) * Math.cos(a0), y + (r + 12) * Math.sin(a0), { c, w: 3 });
  }
  return Ci(x, y, r, { f: c, c: "none" }) + rays;
};
/* 齿轮 */
const gear = (x, y, r = 20, c = INK, spin = "") => {
  let teeth = "";
  for (let i = 0; i < 8; i++) {
    const a0 = (i * Math.PI) / 4;
    teeth += Li(x + r * Math.cos(a0), y + r * Math.sin(a0), x + (r + 7) * Math.cos(a0), y + (r + 7) * Math.sin(a0), { c, w: 4 });
  }
  return g(Ci(x, y, r, { c }) + teeth + Ci(x, y, 6, { c }), spin ? `transform-origin="${x} ${y}"` : "") + (spin ? `<animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur="${spin}" repeatCount="indefinite"/>` : "");
};
const gearSpin = (x, y, r, dur, c = INK) => {
  let teeth = "";
  for (let i = 0; i < 8; i++) {
    const a0 = (i * Math.PI) / 4;
    teeth += Li(x + r * Math.cos(a0), y + r * Math.sin(a0), x + (r + 7) * Math.cos(a0), y + (r + 7) * Math.sin(a0), { c, w: 4 });
  }
  return `<g>${Ci(x, y, r, { c })}${teeth}${Ci(x, y, 6, { c })}<animateTransform attributeName="transform" type="rotate" from="0 ${x} ${y}" to="360 ${x} ${y}" dur="${dur}" repeatCount="indefinite"/></g>`;
};
/* 天平 */
const scales = (tilt = 0) =>
  g(
    Li(100, 30, 100, 100) + Li(70, 100, 130, 100, { w: 4 }) +
    Li(55, 42 + tilt, 145, 42 - tilt, { w: 3.5 }) +
    Pa(`M40 ${56 + tilt} Q55 ${70 + tilt} 70 ${56 + tilt}`, { c: A, w: 3 }) + Li(55, 42 + tilt, 40, 56 + tilt, { w: 2 }) + Li(55, 42 + tilt, 70, 56 + tilt, { w: 2 }) +
    Pa(`M130 ${56 - tilt} Q145 ${70 - tilt} 160 ${56 - tilt}`, { c: A, w: 3 }) + Li(145, 42 - tilt, 130, 56 - tilt, { w: 2 }) + Li(145, 42 - tilt, 160, 56 - tilt, { w: 2 })
  );
/* 温度计 */
const thermo = (pct, extra = "") => {
  const top = 35, bot = 105, lv = bot - (bot - top) * pct;
  return Re(92, 28, 16, 84, { rx: 8, f: "#fff" }) + Ci(100, 118, 14, { f: pct > 0.6 ? R : BL, c: INK }) +
    Re(96, lv, 8, bot - lv + 10, { f: pct > 0.6 ? R : BL, c: "none", rx: 4 }) + extra;
};
/* 硬币 */
const coin = (x, y, r = 11) => Ci(x, y, r, { f: "#f0c75e", c: A, w: 2.5 }) + Ci(x, y, r - 5, { c: A, w: 1.5 });
/* 音符 */
const note8 = (x, y, s = 1, c = INK) =>
  g(Li(0, 0, 0, -26, { c, w: 3 }) + Ci(-5, 0, 6, { f: c, c: "none" }) + Pa("M0 -26 Q10 -22 12 -14", { c, w: 3 }), `transform="translate(${x},${y}) scale(${s})"`);

/* ════════ 词 → 象形映射 ════════ */
const I = {};

/* —— 情绪 / 脸 —— */
I.angry = () => face({ mouth: "frown", brows: "angry", tint: "#fde3e3", extra: Pa("M138 38 L150 26 M144 44 L156 36 M132 32 L140 20", { c: R, w: 3 }) });
I.happy = () => face({ mouth: "smile", eyes: "happy", tint: "#fdf3d8" });
I.smile = () => face({ mouth: "smile", tint: "#fdf3d8" });
I.laugh = () => face({ mouth: "big", eyes: "happy", tint: "#fdf3d8", extra: Pa("M50 60 L62 64 M150 60 L138 64", { c: A, w: 3 }) });
I.cry = () => face({ mouth: "frown", eyes: "closed", tint: "#e8f0f8", extra: g(Pa("M86 70 q-3 8 0 12 q4 -4 0 -12", { f: BL, c: BL }) + anim("opacity", "0;1;0", "1.6s")) + g(Pa("M114 74 q-3 8 0 12 q4 -4 0 -12", { f: BL, c: BL }) + anim("opacity", "1;0;1", "1.6s")) });
I.sad = () => face({ mouth: "frown", brows: "sad", tint: "#e8f0f8" });
I.kind = () => face({ mouth: "smile", eyes: "happy", tint: "#fdf3d8", extra: heart(148, 30, 0.8) });
I.cruel = () => face({ mouth: "frown", brows: "angry", eyes: "dot", tint: "#e9e2ee", extra: Pa("M84 92 L92 88 L100 92 L108 88 L116 92", { w: 2.5 }) });
I.foolish = () => face({ mouth: "o", eyes: "x", tint: "#fdf3d8", extra: g(star(146, 34, 0.55, P) + animT("rotate", "0 146 34;360 146 34", "3s")) });
I.wise = () => face({ mouth: "smile", eyes: "closed", tint: "#fdf3d8", extra: Ci(86, 64, 9, { w: 2.5 }) + Ci(114, 64, 9, { w: 2.5 }) + Li(95, 64, 105, 64, { w: 2.5 }) + Pa("M88 104 Q100 118 112 104", { c: MUT, w: 2.5 }) });
I.surprise = () => face({ mouth: "o", eyes: "wide", brows: "up", tint: "#fdf3d8", extra: Pa("M146 28 L146 44 M146 52 L146 55", { c: R, w: 4 }) });
I.tired = () => face({ mouth: "small", eyes: "low", tint: "#e8e8ee", extra: g(Pa("M138 30 h12 l-12 12 h12", { c: BL, w: 3 }) + anim("opacity", "0.3;1;0.3", "2s")) });
I.awake = () => face({ mouth: "small", eyes: "wide", tint: "#fdf3d8", extra: sun(155, 32, 9) });
I.conscious = () => face({ mouth: "small", eyes: "wide", tint: "#fdf3d8", extra: g(Ci(150, 34, 10, { c: A }) + Li(150, 24, 150, 18, { c: A }) + Li(160, 34, 166, 34, { c: A }) + Li(143, 27, 139, 23, { c: A }) + anim("opacity", "0.4;1;0.4", "1.8s")) });
I.disgust = () => face({ mouth: "frown", eyes: "x", tint: "#e3eede", extra: Pa("M100 88 L100 98", { c: G, w: 4 }) });
I.shame = () => face({ mouth: "small", eyes: "low", tint: "#fde8e8", extra: Ci(78, 84, 6, { f: "#f4a8a8", c: "none" }) + Ci(122, 84, 6, { f: "#f4a8a8", c: "none" }) });
I.regret = () => face({ mouth: "frown", brows: "sad", tint: "#e8e8ee", extra: g(Pa("M140 36 q-2 7 0 10 q3 -3 0 -10", { f: BL, c: BL })) });
I.humor = () => face({ mouth: "big", eyes: "happy", tint: "#fdf3d8", extra: g(Pa("M48 56 L60 62 M152 56 L140 62", { c: A, w: 3 }) + anim("opacity", "0.3;1;0.3", "0.9s")) });
I.serious = () => face({ mouth: "flat", brows: "angry", tint: "#eee" });
I.quiet = () => face({ mouth: "small", eyes: "closed", tint: "#eef0f4", extra: Li(100, 84, 100, 92, { c: "none" }) + Pa("M140 60 q8 8 0 16", { c: MUT, w: 3 }) + cross(152, 68, 0.7, MUT) });
I.ill = () => face({ mouth: "frown", eyes: "low", tint: "#e3eede", extra: Li(82, 88, 116, 84, { c: BL, w: 4 }) + g(Pa("M138 40 q-3 8 0 12 q4 -4 0 -12", { f: BL, c: BL })) });
I.healthy = () => face({ mouth: "smile", eyes: "happy", tint: "#fdf3d8", extra: heart(150, 28, 0.7, G) + check(150, 52, 0.6) });
I.feeling = () => heart(100, 56, 1.5) + g(Pa("M40 110 h30 l8 -14 l12 26 l10 -20 l6 8 h54", { c: R, w: 3.5 }) + anim("opacity", "0.5;1;0.5", "1.4s"));
I.pleasure = () => face({ mouth: "smile", eyes: "happy", tint: "#fdf3d8", extra: star(146, 32, 0.6) + star(54, 40, 0.45) });

/* —— 人物 —— */
const person = (cx, cy, s = 1, c = INK, f = "none") =>
  Ci(cx, cy - 22 * s, 9 * s, { c, f, w: 3 }) + Pa(`M${cx - 14 * s} ${cy + 22 * s} v-18 a14 14 0 0 1 28 0 v18`.replaceAll("14 14", `${14 * s} ${14 * s}`), { c, w: 3, f });
I.brother = () => person(78, 70) + person(124, 76, 0.82) + Li(60, 116, 145, 116, { c: MUT });
I.sister = () => person(78, 70, 1, P) + person(124, 76, 0.82, P) + Li(60, 116, 145, 116, { c: MUT });
I.son = () => person(72, 66, 1.05) + person(126, 78, 0.7, A) + Li(55, 116, 148, 116, { c: MUT });
I.mother = () => person(78, 68, 1.05, P) + person(122, 80, 0.62, P) + heart(100, 30, 0.6);
I.father = () => person(78, 68, 1.05) + person(122, 80, 0.62) + heart(100, 30, 0.6);
I.family = () => person(60, 72, 0.95) + person(100, 72, 0.95, P) + person(138, 82, 0.6, A) + heart(100, 26, 0.55);
I.friend = () => person(74, 72) + person(126, 72) + Pa("M88 86 Q100 78 112 86", { c: A, w: 3.5 });
I.woman = () => Ci(100, 44, 12) + Pa("M84 110 L100 64 L116 110 Z") + Li(88, 92, 112, 92);
I.female = () => Ci(100, 58, 24, { c: P, w: 4 }) + Li(100, 82, 100, 112, { c: P, w: 4 }) + Li(86, 98, 114, 98, { c: P, w: 4 });
I.male = () => Ci(92, 78, 24, { c: BL, w: 4 }) + Li(109, 61, 130, 40, { c: BL, w: 4 }) + Pa("M116 38 h14 v14", { c: BL, w: 4 });
I.married = () => Ci(84, 76, 20, { c: A, w: 4 }) + Ci(116, 76, 20, { c: A, w: 4 }) + star(100, 44, 0.5);
I.expert = () => person(100, 76) + star(100, 28, 0.7) + check(140, 90, 0.8);
I.manager = () => person(76, 72) + Re(112, 48, 44, 56, { f: "#fff", rx: 4 }) + Li(120, 62, 148, 62, { c: MUT }) + Li(120, 74, 148, 74, { c: MUT }) + check(128, 90, 0.55);
I.owner = () => person(70, 76, 0.9) + Pa("M112 70 L136 50 L160 70 V104 H112 Z", { f: "#fff" }) + Ci(98, 92, 6, { c: A }) + Li(104, 92, 112, 92, { c: A });
I.porter = () => man(86, 86, "M86 -13 L106 78 M86 69 L74 86 M86 69 L100 84 M86 76 L72 108 M86 76 L98 108".replaceAll("-13", "53")) + Re(96, 36, 40, 28, { f: "#e7d9c5" }) + Re(104, 16, 30, 22, { f: "#e7d9c5" });
I.secretary = () => person(72, 70, 0.9) + doc(112, 42, 52, 64, 4) + Pa("M150 96 l12 -16", { c: A, w: 3.5 });
I.servant = () => person(76, 72, 0.9) + Ci(132, 64, 22, { c: INK }) + Li(106, 86, 158, 86, { w: 3.5 }) + Ci(132, 64, 4, { f: INK, c: "none" });
I.representative = () => person(100, 60, 0.85, A) + person(58, 100, 0.55) + person(86, 106, 0.55) + person(114, 106, 0.55) + person(142, 100, 0.55) + bubble(118, 18, 44, 28);
I.society = () => [0, 1, 2, 3, 4, 5].map((i) => { const a0 = (i * Math.PI) / 3; return person(100 + 44 * Math.cos(a0), 78 + 34 * Math.sin(a0), 0.5, i % 2 ? A : INK); }).join("") + Ci(100, 78, 12, { c: MUT, w: 2.5 });
I.group = () => person(76, 70, 0.7) + person(108, 64, 0.7) + person(92, 96, 0.7) + person(124, 92, 0.7) + Ci(100, 80, 52, { c: MUT, w: 2.5, extra: 'stroke-dasharray="6 6"' });
I.nation = () => Li(70, 30, 70, 118, { w: 4 }) + Pa("M70 34 H146 V72 H70 Z", { f: A }) + star(108, 53, 0.6, "#fff");
I.military = () => Pa("M100 30 L138 44 V80 Q138 108 100 120 Q62 108 62 80 V44 Z", { f: "#fff" }) + star(100, 72, 0.8, G);
I.self = () => person(100, 72) + arrow(146, 40, 116, 58, { c: A }) + Ci(100, 50, 30, { c: "none" });
I.you = () => person(130, 76, 1, A) + arrow(48, 86, 102, 80, { c: A, w: 4 });
I.body = () => Ci(100, 36, 12) + Li(100, 48, 100, 88) + Li(100, 58, 74, 76) + Li(100, 58, 126, 76) + Li(100, 88, 80, 118) + Li(100, 88, 120, 118);

/* —— 时间 —— */
I.again = () => g(Pa("M100 36 A34 34 0 1 1 66 70", { c: A, w: 4 }) + Pa("M58 56 L66 72 L80 62", { c: A, w: 4 }) + animT("rotate", "0 100 72;360 100 72", "2.6s"));
I.early = () => clock(80, 72, 34, 3.7, 0.1) + sun(150, 40, 10) + Pa("M138 56 Q150 50 162 56", { c: A, w: 2.5 });
I.late = () => clock(80, 72, 34, 5.8, 3.1) + Pa("M150 32 a11 11 0 1 0 0 22 a14 14 0 0 1 0 -22", { f: INK }) + star(166, 50, 0.35, MUT);
I.last = () => Ci(52, 75, 9, { f: MUT, c: "none" }) + Ci(84, 75, 9, { f: MUT, c: "none" }) + Ci(116, 75, 9, { f: MUT, c: "none" }) + Ci(148, 75, 12, { f: R, c: "none" }) + Li(40, 100, 160, 100, { c: MUT });
I.first = () => Ci(52, 75, 12, { f: A, c: "none" }) + star(52, 50, 0.5) + Ci(88, 75, 9, { f: MUT, c: "none" }) + Ci(120, 75, 9, { f: MUT, c: "none" }) + Ci(152, 75, 9, { f: MUT, c: "none" }) + Li(40, 100, 160, 100, { c: MUT });
I.second = () => Ci(52, 75, 9, { f: MUT, c: "none" }) + Ci(88, 75, 12, { f: A, c: "none" }) + Ci(124, 75, 9, { f: MUT, c: "none" }) + Ci(156, 75, 9, { f: MUT, c: "none" }) + Li(40, 100, 160, 100, { c: MUT });
I.future = () => Li(30, 75, 170, 75, { c: MUT, w: 3 }) + Ci(62, 75, 7, { f: INK, c: "none" }) + arrow(80, 75, 158, 75, { c: A, w: 4 }) + star(150, 48, 0.5);
I.past = () => Li(30, 75, 170, 75, { c: MUT, w: 3 }) + Ci(138, 75, 7, { f: INK, c: "none" }) + arrow(120, 75, 42, 75, { c: BL, w: 4 }) + Pa("M48 46 a12 12 0 1 0 2 18", { c: BL, w: 3 });
I.present = () => Li(30, 86, 170, 86, { c: MUT, w: 3 }) + g(Ci(100, 86, 10, { f: A, c: "none" }) + anim("r", "8;12;8", "1.4s")) + arrow(100, 40, 100, 68, { c: A });
I.now = () => Li(30, 86, 170, 86, { c: MUT, w: 3 }) + g(Ci(100, 86, 9, { f: R, c: "none" }) + anim("r", "6;11;6", "1s")) + Ci(100, 86, 18, { c: R, w: 2 });
I.then = () => Li(30, 86, 170, 86, { c: MUT, w: 3 }) + Ci(64, 86, 8, { f: INK, c: "none" }) + arrow(76, 86, 124, 86, { c: A }) + Ci(136, 86, 8, { f: A, c: "none" });
I.waiting = () => Pa("M76 36 H124 L100 75 Z M76 116 H124 L100 77 Z", { w: 3 }) + g(Pa("M92 52 H108 L100 64 Z", { f: A, c: "none" }) + anim("opacity", "1;0.2;1", "2s")) + Pa("M93 108 H107 L100 98 Z", { f: A, c: "none" });
I.frequent = () => Li(30, 90, 170, 90, { c: MUT, w: 3 }) + [46, 70, 94, 118, 142].map((x) => Li(x, 78, x, 102, { c: A, w: 4 })).join("");
I.sudden = () => g(Pa("M104 26 L82 74 H100 L92 122 L126 64 H104 L116 26 Z", { f: A, c: "none" }) + anim("opacity", "1;0.15;1", "0.8s"));
I.event = () => Re(56, 36, 88, 80, { f: "#fff" }) + Li(56, 58, 144, 58) + Li(76, 28, 76, 44, { w: 4 }) + Li(124, 28, 124, 44, { w: 4 }) + star(100, 88, 0.7);
I.history = () => doc(60, 34, 80, 84, 5) + Pa("M48 62 a18 18 0 1 0 4 -14", { c: BL, w: 3.5 }) + Pa("M44 42 L48 62 L62 52", { c: BL, w: 3 });
I.minute = () => clock(100, 75, 38, 0.5, 2.1) + g(Li(100, 75, 100, 44, { c: R, w: 2.5 }) + animT("rotate", "0 100 75;360 100 75", "4s"));
I.hour = () => clock(100, 75, 38, 2.1, 0.2);
I.year = () => Re(50, 34, 100, 84, { f: "#fff" }) + Li(50, 56, 150, 56) + [66, 86, 106, 126].map((x) => [68, 84, 100].map((y) => Ci(x + 4, y, 3, { f: MUT, c: "none" })).join("")).join("") + Ci(110, 84, 8, { c: A, w: 3 });
I.month = () => Re(56, 36, 88, 80, { f: "#fff" }) + Li(56, 58, 144, 58) + Li(76, 28, 76, 44, { w: 4 }) + Li(124, 28, 124, 44, { w: 4 }) + [72, 92, 112, 132].map((x) => Ci(x, 78, 3.5, { f: MUT, c: "none" })).join("") + [72, 92, 112].map((x) => Ci(x, 98, 3.5, { f: MUT, c: "none" })).join("");
I.day = () => sun(70, 60, 14) + Pa("M124 44 a16 16 0 1 0 4 30 a20 20 0 0 1 -4 -30", { f: INK }) + Li(40, 110, 160, 110, { c: MUT });
I.while = () => Li(40, 60, 160, 60, { c: A, w: 4 }) + Li(40, 92, 160, 92, { c: BL, w: 4 }) + Re(78, 46, 44, 60, { c: MUT, w: 2.5, extra: 'stroke-dasharray="5 5"' });
I.till = () => Li(30, 86, 142, 86, { c: A, w: 4 }) + arrow(120, 86, 138, 86, { c: A, w: 4 }) + Li(148, 60, 148, 112, { c: R, w: 5 });
I.ever = () => Pa("M64 76 C64 56 92 56 100 76 C108 96 136 96 136 76 C136 56 108 56 100 76 C92 96 64 96 64 76 Z", { c: A, w: 4 });

/* —— 维度 / 比较 —— */
I.deep = () => Li(36, 50, 164, 50, { c: BL, w: 3 }) + wave(36, 50, 128, 4) + arrow(100, 58, 100, 118, { c: BL, w: 4 }) + Li(60, 118, 140, 118, { c: MUT, dash: "6 5" });
I.distance = () => Ci(46, 76, 7, { f: INK, c: "none" }) + Ci(154, 76, 7, { f: INK, c: "none" }) + arrow(60, 76, 142, 76, { c: A }) + arrow(140, 90, 58, 90, { c: A });
I.degree = () => Pa("M40 110 A62 62 0 0 1 160 110", { w: 3 }) + [0, 30, 60, 90, 120, 150, 180].map((d) => { const a0 = (Math.PI * (180 - d)) / 180; return Li(100 + 54 * Math.cos(a0), 110 - 54 * Math.sin(a0), 100 + 62 * Math.cos(a0), 110 - 62 * Math.sin(a0), { w: 2.5 }); }).join("") + Li(100, 110, 100 + 48 * Math.cos(2.3), 110 - 48 * Math.sin(2.3), { c: A, w: 4 });
I.equal = () => Re(48, 56, 30, 56, { f: SOFT }) + Re(122, 56, 30, 56, { f: SOFT }) + Li(90, 70, 110, 70, { c: A, w: 5 }) + Li(90, 84, 110, 84, { c: A, w: 5 });
I.different = () => Ci(56, 70, 14, { f: MUT, c: "none" }) + Ci(96, 70, 14, { f: MUT, c: "none" }) + Re(126, 56, 30, 30, { f: R, c: "none", rx: 4 }) + Li(40, 108, 160, 108, { c: MUT });
I.same = () => Ci(70, 72, 18, { f: A, c: "none" }) + Ci(130, 72, 18, { f: A, c: "none" }) + Li(90, 108, 110, 108, { c: INK, w: 4 }) + Li(90, 118, 110, 118, { c: INK, w: 4 });
I.level = () => Re(40, 66, 120, 20, { f: "#fff" }) + Ci(100, 76, 7, { f: G, c: "none" }) + Li(92, 60, 92, 92, { c: MUT, w: 2 }) + Li(108, 60, 108, 92, { c: MUT, w: 2 });
I.limit = () => arrow(36, 76, 126, 76, { c: A }) + Li(140, 46, 140, 106, { c: R, w: 6 }) + cross(158, 60, 0.5);
I.parallel = () => Li(50, 50, 150, 60, { c: A, w: 4 }) + Li(50, 90, 150, 100, { c: A, w: 4 });
I.range = () => Li(40, 90, 160, 90, { w: 3 }) + Pa("M60 70 V58 H140 V70", { c: A, w: 3 }) + Li(60, 82, 60, 98, { c: A, w: 3.5 }) + Li(140, 82, 140, 98, { c: A, w: 3.5 });
I.rate = () => Pa("M44 108 A56 56 0 0 1 156 108", { w: 3.5 }) + Li(100, 108, 138, 70, { c: R, w: 4.5 }) + Ci(100, 108, 5, { f: INK, c: "none" }) + [0.3, 1, 1.7, 2.4].map((a0) => Li(100 + 48 * Math.cos(Math.PI - a0), 108 - 48 * Math.sin(Math.PI - a0), 100 + 56 * Math.cos(Math.PI - a0), 108 - 56 * Math.sin(Math.PI - a0), { w: 2.5 })).join("");
I.size = () => Re(46, 80, 26, 26, { f: SOFT }) + Re(96, 46, 60, 60, { f: SOFT }) + arrow(76, 92, 92, 88, { c: A, w: 3 });
I.thick = () => Li(60, 56, 150, 56, { c: A, w: 14 }) + Li(60, 98, 150, 98, { c: MUT, w: 3 });
I.thin = () => Li(60, 56, 150, 56, { c: MUT, w: 14 }) + Li(60, 98, 150, 98, { c: A, w: 2.5 });
I.straight = () => Li(48, 60, 152, 60, { c: A, w: 4.5 }) + Pa("M48 100 q14 -16 28 0 t28 0 t28 0", { c: MUT, w: 3.5 });
I.slope = () => Pa("M40 110 L160 50 L160 110 Z", { f: SOFT }) + g(Ci(76, 84, 10, { f: A, c: "none" }) + animT("translate", "0 0;52 -26;0 0", "2.4s"));
I.flat = () => Li(36, 84, 164, 84, { c: A, w: 5 }) + Ci(70, 76, 6, { f: G, c: "none" }) + Ci(130, 76, 6, { f: G, c: "none" });
I.round = () => Ci(76, 76, 30, { c: A, w: 4.5 }) + Re(122, 50, 48, 52, { c: MUT, w: 3, rx: 2 });
I.edge = () => Re(56, 46, 88, 64, { f: SOFT, c: MUT }) + Li(144, 46, 144, 110, { c: R, w: 5 }) + arrow(168, 76, 152, 76, { c: R, w: 3 });
I.side = () => Re(60, 46, 80, 64, { f: SOFT, c: MUT }) + Li(60, 46, 60, 110, { c: A, w: 5.5 }) + arrow(34, 78, 52, 78, { c: A, w: 3 });
I.middle = () => Li(40, 78, 160, 78, { w: 3.5 }) + Li(40, 68, 40, 88, { w: 3.5 }) + Li(160, 68, 160, 88, { w: 3.5 }) + g(Ci(100, 78, 9, { f: A, c: "none" }) + anim("r", "7;10;7", "1.6s"));
I.end = () => Li(36, 78, 142, 78, { w: 3.5 }) + Ci(150, 78, 9, { f: R, c: "none" }) + Li(150, 60, 150, 96, { c: R, w: 3 });
I.front = () => Re(84, 56, 60, 50, { f: SOFT, c: MUT }) + Re(64, 66, 60, 50, { f: "#fff" }) + arrow(40, 91, 58, 91, { c: A });
I.base = () => Re(64, 96, 72, 18, { f: A, c: "none" }) + Re(76, 44, 48, 52, { f: SOFT, c: MUT }) + arrow(40, 105, 58, 105, { c: A, w: 3 });
I.top = () => Re(76, 56, 48, 52, { f: SOFT, c: MUT }) + Re(64, 38, 72, 18, { f: A, c: "none" }) + arrow(40, 47, 58, 47, { c: A, w: 3 });
I.complete = () => Ci(100, 72, 36, { c: G, w: 5 }) + check(100, 72, 1.1);
I.hollow = () => Ci(72, 76, 26, { c: A, w: 5 }) + Ci(140, 76, 26, { f: MUT, c: "none" });
I.solid = () => Ci(72, 76, 26, { f: A, c: "none" }) + Ci(140, 76, 26, { c: MUT, w: 4 });
I.broken = () => Pa("M48 66 L88 66 L96 80 L104 56 L112 70 L152 70", { w: 4.5 }) + Pa("M92 88 L100 100 M104 84 L114 96", { c: R, w: 3 });
I.bent = () => Pa("M52 96 L100 96 L138 58", { c: A, w: 5 }) + Li(52, 116, 148, 116, { c: MUT, w: 4 });
I.loose = () => Pa("M44 70 q20 26 38 0 t38 0 t36 0", { c: A, w: 4.5 }) + Li(44, 110, 156, 110, { c: MUT, w: 3, dash: "5 6" });
I.tight = () => Li(44, 70, 156, 70, { c: A, w: 4.5 }) + Pa("M92 58 L96 64 M108 58 L104 64 M92 82 L96 76 M108 82 L104 76", { c: R, w: 2.5 }) + Li(44, 60, 44, 80, { w: 4 }) + Li(156, 60, 156, 80, { w: 4 });
I.fixed = () => Re(60, 70, 80, 30, { f: SOFT, c: MUT }) + Li(100, 40, 100, 76, { c: A, w: 5 }) + Pa("M92 44 H108", { c: A, w: 6 }) + cross(146, 50, 0.5, MUT);
I.free = () => Re(46, 56, 50, 56, { c: MUT, w: 3 }) + [56, 68, 80].map((x) => Li(x, 56, x, 86, { c: MUT, w: 2.5 })).join("") + g(Pa("M118 70 q10 -12 20 0 q10 -12 20 0", { c: A, w: 3.5 }) + animT("translate", "0 0;14 -12;0 0", "1.8s"));
I.hanging = () => Li(40, 36, 160, 36, { w: 4 }) + g(Li(100, 36, 100, 70, { w: 3 }) + Re(82, 70, 36, 30, { f: SOFT, c: INK }) + `<animateTransform attributeName="transform" type="rotate" values="-8 100 36;8 100 36;-8 100 36" dur="2.2s" repeatCount="indefinite"/>`);
I.open = () => Re(56, 40, 60, 76, { f: "#fff" }) + Pa("M116 40 L150 56 V124 L116 116 Z", { f: SOFT }) + Ci(140, 88, 3.5, { f: INK, c: "none" }) + arrow(126, 30, 152, 44, { c: G, w: 3 });
I.shut = () => Re(70, 40, 60, 76, { f: SOFT }) + Ci(120, 80, 3.5, { f: INK, c: "none" }) + Li(70, 40, 70, 116, { w: 4 });
I.elastic = () => g(Pa("M60 76 q8 -18 16 0 t16 0 t16 0 t16 0", { c: A, w: 4 }) + `<animateTransform attributeName="transform" type="scale" values="1 1;1.25 0.8;1 1" dur="1.6s" repeatCount="indefinite" additive="sum"/>`) + Li(52, 60, 52, 92, { w: 4.5 }) + Li(150, 60, 150, 92, { w: 4.5 });
I.stiff = () => Li(60, 88, 148, 56, { c: A, w: 6 }) + Pa("M84 110 q16 -14 32 0", { c: MUT, w: 3 }) + cross(116, 116, 0.5, MUT);
I.smooth = () => Pa("M40 76 Q100 60 160 76", { c: A, w: 4.5 }) + Ci(100, 50, 12, { f: "#fff", c: INK }) + star(126, 36, 0.4);
I.rough = () => Pa("M40 80 L56 62 L70 84 L86 58 L102 86 L118 60 L134 84 L150 64 L160 80", { c: A, w: 4 });
I.sharp = () => Pa("M48 96 L128 56 L132 70 Z", { f: "#dfe5ea", c: INK }) + Pa("M48 96 L128 56", { c: INK, w: 3 }) + Re(128, 50, 26, 26, { f: "#9a6b3f", c: "none", rx: 4 }) + g(star(60, 46, 0.5) + anim("opacity", "0.2;1;0.2", "1.4s"));
I.soft = () => Pa("M50 96 Q50 64 84 64 Q90 46 112 50 Q136 42 144 64 Q166 70 158 96 Z", { f: "#fff" }) + Pa("M86 86 Q100 96 114 86", { c: MUT, w: 3 });
I.hard = () => Pa("M100 36 L136 56 V96 L100 116 L64 96 V56 Z", { f: "#dfe5ea", c: INK }) + Li(100, 36, 100, 76, { w: 2 }) + Li(100, 76, 136, 96, { w: 2 }) + Li(100, 76, 64, 96, { w: 2 });
I.sticky = () => Pa("M64 56 Q100 40 136 56 L130 76 Q100 64 70 76 Z", { f: "#e8b24a", c: A }) + [82, 100, 118].map((x) => g(Pa(`M${x} 74 q-2 14 0 22`, { c: "#e8b24a", w: 5 }) + anim("opacity", "1;0.4;1", "1.8s"))).join("");
I.strong = () => Pa("M56 96 q-4 -28 18 -30 q2 -16 18 -10 q6 -14 20 -6 q18 -6 20 14 q14 8 6 24 Z", { f: "none", c: "none" }) + Pa("M60 100 Q56 70 80 64 Q84 44 104 50 Q104 36 122 40 Q124 56 116 64 Q140 68 136 100 Z", { f: "#f0cfae", c: A, w: 3 }) + Li(40, 108, 160, 108, { c: MUT });
I.feeble = () => g(Pa("M70 108 Q70 70 96 62 Q98 50 110 52", { c: MUT, w: 4 })) + Li(118, 50, 118, 108, { c: MUT, w: 3, dash: "4 6" }) + Pa("M124 88 q10 8 0 18", { c: MUT, w: 2.5 });
I.fat = () => Ci(100, 50, 12) + Pa("M100 62 Q66 70 66 92 Q66 112 100 112 Q134 112 134 92 Q134 70 100 62", { w: 3.5 });
I.warm = () => thermo(0.55) + sun(146, 44, 10);
I.cold = () => thermo(0.18) + Pa("M142 36 v24 M130 42 l24 12 M154 42 l-24 12", { c: BL, w: 3 });
I.boiling = () => Pa("M56 70 H144 V108 Q144 118 134 118 H66 Q56 118 56 108 Z", { f: "#fff" }) + Li(144, 78, 160, 72, { w: 3.5 }) + [74, 100, 126].map((x, i) => g(Ci(x, 100, 5, { c: BL, w: 2.5 }) + anim("cy", "104;76;104", `${1 + i * 0.3}s`) + anim("opacity", "1;0.2;1", `${1 + i * 0.3}s`)).toString()).join("") + g(Pa("M76 54 q6 -10 0 -18 M100 56 q6 -10 0 -18 M124 54 q6 -10 0 -18", { c: MUT, w: 3 }) + anim("opacity", "0.3;1;0.3", "1.4s"));
I.dry = () => Pa("M70 60 L96 60 M84 46 L84 74", { c: MUT, w: 3 }) + Pa("M100 44 q-16 24 0 34 q16 -10 0 -34", { c: MUT, w: 3, dash: "4 4" }) + Pa("M44 96 H156 M70 96 L62 116 M100 96 L96 116 M130 96 L138 116", { c: A, w: 3 });
I.wet = () => Pa("M100 38 q-20 30 0 44 q20 -14 0 -44", { f: BL, c: "none" }) + g(wave(40, 104, 120, 5) + anim("opacity", "0.5;1;0.5", "1.6s")) + Pa("M64 56 q-6 10 0 14 q6 -4 0 -14", { f: BL, c: "none" }) + Pa("M140 62 q-6 10 0 14 q6 -4 0 -14", { f: BL, c: "none" });
I.dark = () => Re(44, 36, 112, 80, { f: "#221f1c", c: "none", rx: 10 }) + Pa("M114 52 a18 18 0 1 0 8 32 a22 22 0 0 1 -8 -32", { f: "#f4e9c8", c: "none" }) + star(80, 60, 0.35, "#f4e9c8") + star(96, 84, 0.28, "#f4e9c8");
I.bright = () => g(sun(100, 72, 18) + animT("rotate", "0 100 72;45 100 72", "4s"));
I.clean = () => Re(56, 50, 88, 58, { f: "#fff", rx: 8 }) + g(star(80, 68, 0.5, G) + anim("opacity", "0.3;1;0.3", "1.4s")) + g(star(120, 84, 0.4, G) + anim("opacity", "1;0.3;1", "1.4s"));
I.dirty = () => Re(56, 50, 88, 58, { f: "#fff", rx: 8 }) + Ci(82, 70, 8, { f: "#8a7355", c: "none" }) + Ci(114, 88, 6, { f: "#8a7355", c: "none" }) + Ci(124, 64, 5, { f: "#8a7355", c: "none" }) + Pa("M66 92 q6 -6 12 0", { c: "#8a7355", w: 3 });
I.clear = () => Ci(100, 74, 34, { c: BL, w: 3.5 }) + Ci(100, 74, 34, { f: "#eaf3fa", c: "none", extra: 'opacity="0.5"' }) + Pa("M84 60 q-10 10 -2 24", { c: "#fff", w: 4 }) + sun(152, 38, 8);
I.mist = () => Pa("M50 96 Q70 60 100 60 Q130 60 150 96 Z", { f: "#dcd6ca", c: "none" }) + [56, 50, 62].map((y, i2) => g(Li(44 + i2 * 8, y + i2 * 14, 156 - i2 * 6, y + i2 * 14, { c: "#b5ada0", w: 5 }) + anim("opacity", "0.4;0.9;0.4", `${2 + i2 * 0.4}s`))).join("");
I.new = () => Re(64, 46, 72, 64, { f: "#fff" }) + star(136, 46, 0.7) + g(star(60, 96, 0.4, A) + anim("opacity", "0.3;1;0.3", "1.2s"));
I.old = () => Pa("M84 116 V64 Q84 44 104 44 Q120 44 120 58", { c: "#9a6b3f", w: 6 }) + Li(60, 116, 140, 116, { c: MUT });
I.young = () => Pa("M100 116 V76", { c: G, w: 4 }) + Pa("M100 92 Q80 88 76 68 Q96 68 100 86", { f: "#bfe3bf", c: G }) + Pa("M100 84 Q120 80 124 60 Q104 60 100 78", { f: "#bfe3bf", c: G }) + Li(70, 116, 130, 116, { c: MUT });
I.cheap = () => Pa("M70 44 H118 L130 56 V84 L92 116 L58 82 Z", { f: "#fff" }) + Ci(82, 58, 4, { f: INK, c: "none" }) + arrow(140, 60, 140, 104, { c: G, w: 4 });
I.chief = () => person(100, 80) + Pa("M80 38 L86 26 L94 36 L100 22 L106 36 L114 26 L120 38 Z", { f: A, c: "none" });
I.common = () => [60, 100, 140].map((x) => Ci(x, 64, 12, { f: SOFT, c: INK, w: 2.5 })).join("") + [80, 120].map((x) => Ci(x, 96, 12, { f: SOFT, c: INK, w: 2.5 })).join("");
I.general = () => Pa("M40 70 Q100 26 160 70", { c: A, w: 4 }) + [56, 78, 100, 122, 144].map((x) => Ci(x, 92, 6, { f: MUT, c: "none" })).join("") + Li(100, 48, 100, 36, { c: A, w: 3 });
I.special = () => [56, 88, 152].map((x) => Ci(x, 80, 9, { f: MUT, c: "none" })).join("") + star(120, 76, 0.9) + Ci(120, 78, 20, { c: A, w: 2.5, extra: 'stroke-dasharray="5 5"' });
I.normal = () => Pa("M40 108 Q70 108 84 76 Q100 40 116 76 Q130 108 160 108", { c: A, w: 3.5 }) + Li(100, 54, 100, 112, { c: MUT, w: 2.5, dash: "5 5" });
I.natural = () => Pa("M100 116 V72", { c: G, w: 4 }) + Pa("M100 88 Q70 84 64 54 Q94 56 100 82 M100 76 Q130 72 136 42 Q106 44 100 70", { f: "#cfe8cf", c: G, w: 3 }) + sun(48, 40, 9);
I.chemical = () => Pa("M88 36 V64 L62 108 Q58 118 70 118 H130 Q142 118 138 108 L112 64 V36", { f: "#fff" }) + Li(80, 36, 120, 36, { w: 4 }) + Pa("M74 92 H126", { c: G, w: 3 }) + g(Ci(92, 102, 4, { c: G, w: 2 }) + anim("cy", "104;94;104", "1.5s")) + Ci(110, 100, 3, { c: G, w: 2 });
I.physical = () => Ci(100, 76, 8, { f: A, c: "none" }) + `<ellipse cx="100" cy="76" rx="44" ry="16" fill="none" stroke="${INK}" stroke-width="2.5"/><ellipse cx="100" cy="76" rx="44" ry="16" fill="none" stroke="${INK}" stroke-width="2.5" transform="rotate(60 100 76)"/><ellipse cx="100" cy="76" rx="44" ry="16" fill="none" stroke="${INK}" stroke-width="2.5" transform="rotate(120 100 76)"/>`;
I.electric = () => g(Pa("M106 28 L80 78 H98 L90 124 L126 66 H106 L118 28 Z", { f: "#f2c233", c: A, w: 2 }) + anim("opacity", "1;0.5;1", "1.1s"));
I.automatic = () => gearSpin(82, 76, 20, "3s") + gearSpin(128, 60, 13, "2s") + arrow(118, 104, 146, 104, { c: A, w: 3 });
I.medical = () => Re(60, 46, 80, 64, { f: "#fff", rx: 10 }) + Pa(`M100 60 V96 M82 78 H118`, { c: R, w: 9 });
I.political = () => Re(64, 56, 72, 52, { f: "#fff" }) + Pa("M64 56 L100 32 L136 56", { w: 3.5 }) + [80, 100, 120].map((x) => Li(x, 66, x, 98, { w: 3 })).join("") + check(160, 44, 0.6);
I.public = () => [50, 80, 110, 140].map((x, i2) => person(x + 5, 76, 0.6, i2 % 2 ? A : INK)).join("") + Pa("M36 110 H164", { c: MUT, w: 3 });
I.private = () => Re(72, 66, 56, 44, { f: "#fff", rx: 8 }) + Pa("M82 66 V54 a18 18 0 0 1 36 0 V66", { w: 4 }) + Ci(100, 86, 5, { f: INK, c: "none" }) + Li(100, 89, 100, 98, { w: 4 });
I.secret = () => Re(60, 56, 80, 52, { f: "#fff" }) + Pa("M60 56 L100 86 L140 56", { w: 3 }) + Ci(148, 48, 12, { f: R, c: "none" }) + Pa("M142 48 q6 -7 12 0 M142 48 q6 7 12 0", { c: "#fff", w: 2 });
I.probable = () => Pa("M100 110 A44 44 0 1 1 100 22 A44 44 0 0 1 100 110", { c: SOFT, w: 11 }) + Pa("M100 22 A44 44 0 1 1 62 92", { c: G, w: 11 }) + qmark(100, 70, 0.8, INK);
I.possible = () => Pa("M100 110 A44 44 0 1 1 100 22", { c: SOFT, w: 11 }) + Pa("M100 22 A44 44 0 0 1 100 110", { c: G, w: 11 }) + qmark(100, 70, 0.8, INK);
I.certain = () => Ci(100, 70, 42, { c: G, w: 9 }) + check(100, 70, 1.2);
I.necessary = () => Re(56, 56, 50, 44, { f: "#fff", rx: 6 }) + Ci(81, 78, 8, { w: 3.5 }) + Pa("M120 62 h28 M134 48 v28", { c: R, w: 5 }) + Pa("M81 78 m8 0 h22", { c: A, w: 3.5 });
I.important = () => g(Li(100, 34, 100, 88, { c: R, w: 10 }) + Ci(100, 110, 6.5, { f: R, c: "none" }) + anim("opacity", "1;0.55;1", "1.3s"));
I.responsible = () => man(100, 92, "M100 75 L74 60 M100 75 L126 60 M100 96 L84 122 M100 96 L116 122") + Li(58, 48, 142, 48, { c: A, w: 7 });
I.true = () => Ci(100, 72, 38, { c: G, w: 5 }) + check(100, 74, 1.2);
I.false = () => Ci(100, 72, 38, { c: R, w: 5 }) + cross(100, 72, 1.1);
I.right = () => check(100, 76, 1.6, G);
I.violent = () => g(Pa("M100 32 L112 60 L142 56 L122 80 L148 98 L114 96 L108 124 L94 98 L62 106 L84 80 L56 62 L90 64 Z", { f: R, c: "none" }) + anim("opacity", "1;0.7;1", "0.7s"));
I.quick = () => g(arrow(50, 70, 150, 70, { c: A, w: 5 }) + animT("translate", "-12 0;12 0;-12 0", "0.6s")) + Li(40, 88, 96, 88, { c: MUT, w: 3 }) + Li(52, 100, 88, 100, { c: MUT, w: 3 });
I.slow = () => Ci(86, 84, 24, { f: "#e7d9c5", c: A, w: 3 }) + Pa("M86 84 m-12 0 a12 12 0 1 1 24 0 a7 7 0 0 1 -14 0 a4 4 0 0 1 7 0", { c: A, w: 2.5 }) + Pa("M108 92 q14 -4 18 -16 M122 70 l4 -8 M126 78 l8 -4", { w: 3 }) + g(arrow(130, 104, 158, 104, { c: MUT, w: 3, dash: "3 7" }));
I.sweet = () => Ci(100, 74, 24, { f: "#f3b6c8", c: R, w: 3 }) + Pa("M76 74 L52 60 M76 74 L52 88 M124 74 L148 60 M124 74 L148 88", { c: R, w: 3.5 }) + star(100, 74, 0.5, "#fff");
I.bitter = () => Ci(100, 74, 30, { f: "#f5e069", c: A, w: 3 }) + [0, 60, 120, 180, 240, 300].map((d) => { const a0 = (d * Math.PI) / 180; return Li(100 + 8 * Math.cos(a0), 74 + 8 * Math.sin(a0), 100 + 24 * Math.cos(a0), 74 + 24 * Math.sin(a0), { c: "#fff", w: 3 }); }).join("") + Pa("M86 116 Q100 108 114 116", { w: 3 });
I.acid = () => Pa("M88 36 V60 L66 102 Q62 112 74 112 H126 Q138 112 134 102 L112 60 V36", { f: "#fff" }) + Li(80, 36, 120, 36, { w: 4 }) + Pa("M72 88 H128", { c: "#cddc39", w: 3 }) + g(Pa("M88 100 q-4 8 0 12", { c: "#9aa826", w: 3 }) + anim("opacity", "1;0.3;1", "1.3s")) + Pa("M150 56 q-8 12 0 18 q8 -6 0 -18", { f: "#cddc39", c: "none" });

/* —— 动作 / 运动（动画）—— */
I.attack = () => g(arrow(40, 90, 118, 64, { c: R, w: 5 }) + animT("translate", "0 0;16 -6;0 0", "0.8s")) + Ci(142, 56, 18, { c: INK, w: 3.5 }) + Ci(142, 56, 8, { c: INK, w: 2.5 });
I.attempt = () => arrow(40, 100, 108, 60, { c: A, w: 4, dash: "8 6" }) + Ci(146, 44, 16, { c: INK, w: 3 }) + Ci(146, 44, 6, { c: INK, w: 2 }) + Pa("M112 72 q6 6 2 14", { c: MUT, w: 2.5 });
I.attraction = () => Pa("M70 40 V84 a30 30 0 0 0 60 0 V40 H106 V82 a6 6 0 0 1 -12 0 V40 Z", { f: R, c: "none" }) + Re(70, 40, 24, 14, { f: "#dfe5ea", c: "none", rx: 0 }) + Re(106, 40, 24, 14, { f: "#dfe5ea", c: "none", rx: 0 }) + g(Ci(58, 124, 5, { f: INK, c: "none" }) + animT("translate", "0 0;30 -10;0 0", "1.4s")) + g(Ci(146, 124, 5, { f: INK, c: "none" }) + animT("translate", "0 0;-30 -10;0 0", "1.4s"));
I.balance = () => scales(0);
I.comparison = () => scales(8);
I.doubt = () => scales(-6) + qmark(168, 50, 0.7);
I.birth = () => Pa("M100 112 Q64 112 64 80 Q64 50 100 44 Q136 50 136 80 Q136 112 100 112 Z", { f: "#fff" }) + Pa("M70 70 L84 80 L96 66 L110 82 L124 68 L134 78", { w: 2.5 }) + g(Pa("M100 64 V44", { c: G, w: 4 }) + Pa("M100 52 Q88 50 86 38 Q98 40 100 50", { f: "#bfe3bf", c: G }) + anim("opacity", "0.4;1;0.4", "2s"));
I.bite = () => Ci(108, 72, 32, { f: "#e85d4a", c: R, w: 3 }) + Pa("M64 56 Q56 72 64 88 L74 84 L70 72 L78 64 Z", { f: "#faf8f4", c: "none" }) + Pa("M64 54 l8 6 M60 70 l10 1 M64 90 l9 -5", { w: 2.5 }) + Pa("M108 44 q4 -8 12 -8", { c: "#7a4", w: 3 });
I.blow = () => face({ cx: 64, cy: 72, r: 26, mouth: "o", eyes: "closed" }) + g(wave(96, 62, 64, 5, A) + anim("opacity", "0.3;1;0.3", "1.1s")) + g(wave(96, 82, 56, 5, A) + anim("opacity", "1;0.3;1", "1.1s"));
I.breath = () => Pa("M86 50 Q86 36 100 36 Q114 36 114 50 V64 Q114 74 100 74 Q86 74 86 64 Z", { f: "#fff" }) + Pa("M100 74 V88 M100 88 Q76 88 70 108 M100 88 Q124 88 130 108", { w: 3.5 }) + g(Pa("M64 44 q-10 6 0 14 M58 38 q-16 10 0 26", { c: BL, w: 2.5 }) + anim("opacity", "0;1;0", "2.4s")) + g(Pa("M136 44 q10 6 0 14 M142 38 q16 10 0 26", { c: BL, w: 2.5 }) + anim("opacity", "1;0;1", "2.4s"));
I.burst = () => g(star(100, 74, 1.7, "#f2c233") + anim("opacity", "0.4;1;0.4", "0.9s")) + [30, 90, 150, 210, 270, 330].map((d) => { const a0 = (d * Math.PI) / 180; return g(Li(100 + 30 * Math.cos(a0), 74 + 30 * Math.sin(a0), 100 + 44 * Math.cos(a0), 74 + 44 * Math.sin(a0), { c: R, w: 3 }) + anim("opacity", "1;0.2;1", "0.9s")); }).join("");
I.crush = () => g(Re(58, 30, 84, 22, { f: "#dfe5ea", c: INK }) + animT("translate", "0 0;0 26;0 0", "1.6s")) + Pa("M70 96 Q76 84 86 92 Q96 80 108 90 Q120 82 130 96 Q120 104 70 96 Z", { f: SOFT, c: INK, w: 2.5 }) + Li(54, 112, 146, 112, { w: 4 });
I.current = () => [58, 76, 94].map((y, i2) => g(Pa(`M36 ${y} q20 -10 40 0 t40 0 t40 0`, { c: BL, w: 4 }) + `<animate attributeName="stroke-dashoffset" from="40" to="0" dur="${1 + i2 * 0.2}s" repeatCount="indefinite"/>` ).replace("<path", `<path stroke-dasharray="20 20"`)).join("") + arrow(120, 114, 158, 114, { c: BL, w: 3 });
I.cut = () => Li(40, 76, 160, 76, { w: 3, dash: "8 7" }) + Ci(70, 50, 8, { c: R, w: 3 }) + Ci(70, 96, 8, { c: R, w: 3 }) + Pa("M76 56 L128 90 M76 90 L128 56", { c: R, w: 3.5 });
I.damage = () => Re(60, 46, 80, 62, { f: "#fff" }) + Pa("M100 46 L92 68 L106 78 L94 96 L102 108", { c: R, w: 3.5 }) + Pa("M60 80 L78 72", { c: MUT, w: 2.5 });
I.dead = () => Pa("M100 118 V72", { c: "#9a8c7a", w: 4 }) + Pa("M100 88 Q82 92 74 108", { c: "#9a8c7a", w: 3 }) + Pa("M100 78 Q116 70 124 84 Q110 92 100 84", { f: "#cfc4b4", c: "#9a8c7a" }) + Li(70, 118, 130, 118, { c: MUT }) + Pa("M86 50 q14 -16 28 0", { c: "#9a8c7a", w: 2.5, dash: "3 5" });
I.death = () => Pa("M72 116 V72 A28 28 0 0 1 128 72 V116 Z", { f: "#e6e0d4", c: INK }) + Pa("M100 80 V100 M90 88 H110", { c: INK, w: 4 }) + g(Pa("M140 50 q-6 8 0 14", { c: MUT, w: 3 }) + anim("opacity", "0.8;0.2;0.8", "2.5s"));
I.decision = () => Li(100, 110, 100, 76, { w: 4 }) + arrow(100, 76, 60, 44, { c: MUT, w: 3.5 }) + arrow(100, 76, 140, 44, { c: G, w: 4.5 }) + check(152, 32, 0.6);
I.desire = () => g(heart(100, 50, 1.2) + anim("opacity", "0.6;1;0.6", "1.2s")) + Pa("M100 124 q-4 -16 0 -28 M88 122 q-22 -10 -16 -30 q16 4 18 22 M112 122 q22 -10 16 -30 q-16 4 -18 22", { c: A, w: 3 });
I.detail = () => [70, 90, 110].map((y) => Li(56, y, 110, y, { c: MUT, w: 3 })).join("") + Ci(124, 84, 22, { c: A, w: 4 }) + Li(140, 100, 156, 116, { c: A, w: 5 }) + Ci(124, 84, 3, { f: A, c: "none" }) + Ci(116, 80, 2, { f: A, c: "none" }) + Ci(131, 88, 2, { f: A, c: "none" });
I.development = () => [0, 1, 2, 3].map((i2) => g(Re(48 + i2 * 30, 110 - (i2 + 1) * 18, 20, (i2 + 1) * 18, { f: i2 === 3 ? A : SOFT, c: INK, rx: 3 }))).join("") + arrow(50, 50, 150, 28, { c: G, w: 3 });
I.digestion = () => Pa("M88 36 Q88 56 96 64 Q112 76 110 94 Q108 116 88 114 Q70 112 74 92", { f: "#f6d8c8", c: A, w: 3 }) + g(arrow(92, 48, 92, 66, { c: A, w: 2.5 }) + anim("opacity", "1;0.2;1", "1.5s")) + g(arrow(98, 80, 94, 100, { c: A, w: 2.5 }) + anim("opacity", "0.2;1;0.2", "1.5s"));
I.discovery = () => Ci(86, 70, 28, { c: A, w: 4 }) + Li(106, 90, 130, 114, { c: A, w: 6 }) + g(star(86, 70, 0.8, "#f2c233") + anim("opacity", "0.3;1;0.3", "1.3s"));
I.discussion = () => bubble(36, 36, 56, 36) + bubble(112, 64, 56, 36, true) + [54, 66, 78].map((x) => Ci(x, 54, 3, { f: MUT, c: "none" })).join("") + [130, 142, 154].map((x) => Ci(x, 82, 3, { f: MUT, c: "none" })).join("");
I.disease = () => Ci(100, 74, 24, { f: "#dcedc8", c: G, w: 3 }) + [0, 45, 90, 135, 180, 225, 270, 315].map((d) => { const a0 = (d * Math.PI) / 180; return Li(100 + 24 * Math.cos(a0), 74 + 24 * Math.sin(a0), 100 + 36 * Math.cos(a0), 74 + 36 * Math.sin(a0), { c: G, w: 3 }) + Ci(100 + 38 * Math.cos(a0), 74 + 38 * Math.sin(a0), 3, { f: G, c: "none" }); }).join("") + Ci(92, 68, 4, { f: G, c: "none" }) + Ci(108, 80, 5, { f: G, c: "none" });
I.distribution = () => Ci(100, 40, 10, { f: A, c: "none" }) + [48, 82, 118, 152].map((x) => g(arrow(100, 52, x, 100, { c: A, w: 3 })) + Ci(x, 110, 7, { f: SOFT, c: INK, w: 2.5 })).join("");
I.division = () => Ci(100, 76, 36, { f: SOFT, c: INK }) + Li(100, 36, 100, 116, { c: R, w: 4 }) + arrow(82, 76, 56, 76, { c: A, w: 3 }) + arrow(118, 76, 144, 76, { c: A, w: 3 });
I.driving = () => Ci(100, 80, 34, { c: INK, w: 5 }) + Li(100, 46, 100, 70, { w: 4 }) + Li(70, 96, 90, 88, { w: 4 }) + Li(130, 96, 110, 88, { w: 4 }) + Ci(100, 80, 8, { f: INK, c: "none" }) + g(Li(40, 124, 70, 124, { c: MUT, w: 4 }) + Li(90, 124, 120, 124, { c: MUT, w: 4 }) + Li(140, 124, 165, 124, { c: MUT, w: 4 }) + animT("translate", "0 0;-30 0;0 0", "1s"));
I.fall = () => g(Ci(100, 40, 11, { f: A, c: "none" }) + anim("cy", "34;104;34", "1.8s")) + Li(56, 118, 144, 118, { w: 4 }) + Pa("M86 60 l-6 8 M118 76 l6 8", { c: MUT, w: 2.5 });
I.flight = () => g(Pa("M52 92 L104 76 L88 56 L100 52 L124 70 L148 62 Q158 60 154 70 L132 84 L138 108 L128 110 L112 88 L60 100 Z", { f: "#dfe5ea", c: INK, w: 2.5 }) + animT("translate", "0 0;18 -14;0 0", "2.4s")) + Pa("M36 116 q14 -8 28 0 M76 122 q12 -6 24 0", { c: MUT, w: 2.5 });
I.fold = () => Pa("M48 96 H152 V60 H110 L96 96", { f: "#fff" }) + Pa("M48 96 L96 96 L110 60 L62 60 Z", { f: SOFT, c: INK }) + Pa("M110 60 L96 96", { c: A, w: 3.5 });
I.grip = () => Li(56, 76, 144, 76, { c: "#9a6b3f", w: 9 }) + Pa("M76 50 q-14 4 -12 20 q0 18 14 22 h32 q14 -4 14 -22 q2 -16 -12 -20", { f: "#f0cfae", c: A, w: 3 }) + [86, 98, 110].map((x) => Li(x, 52, x, 64, { c: A, w: 3 })).join("");
I.impulse = () => g(Pa("M40 76 H86 L96 48 L108 104 L118 76 H160", { c: R, w: 4 }) + anim("opacity", "1;0.4;1", "0.8s")) + g(Ci(160, 76, 6, { f: R, c: "none" }) + anim("r", "4;8;4", "0.8s"));
I.jump = () => g(man(100, 70, "M100 53 L80 64 M100 53 L120 64 M100 74 L82 90 M100 74 L118 90") + animT("translate", "0 18;0 -14;0 18", "1.3s")) + Li(48, 122, 152, 122, { w: 4 }) + Pa("M62 110 q6 -8 0 -14 M138 110 q-6 -8 0 -14", { c: MUT, w: 2.5 });
I.kiss = () => face({ cx: 68, cy: 72, r: 26, mouth: "small", eyes: "closed", tint: "#fdf3d8" }) + face({ cx: 132, cy: 72, r: 26, mouth: "small", eyes: "closed", tint: "#fdf3d8" }) + g(heart(100, 30, 0.7) + anim("opacity", "0.4;1;0.4", "1.4s"));
I.lift = () => g(Re(82, 36, 36, 26, { f: "#e7d9c5", c: INK }) + animT("translate", "0 12;0 -8;0 12", "1.6s")) + man(100, 96, "M100 79 L82 64 M100 79 L118 64 M100 100 L84 124 M100 100 L116 124") + arrow(146, 96, 146, 52, { c: G, w: 4 });
I.motion = () => g(Ci(112, 76, 13, { f: A, c: "none" }) + animT("translate", "-40 0;28 0;-40 0", "1.6s")) + [56, 76, 96].map((x, i2) => Li(x - 26, 76, x - 8, 76, { c: MUT, w: 3 })).join("");
I.move = () => g(Re(60, 60, 40, 34, { f: SOFT, c: INK }) + animT("translate", "0 0;44 0;0 0", "2s")) + arrow(108, 46, 148, 46, { c: A, w: 4 }) + Li(40, 104, 160, 104, { c: MUT });
I.pull = () => man(64, 88, "M64 71 L88 76 M64 71 L86 64 M64 92 L48 116 M64 92 L76 116") + g(Re(112, 66, 40, 32, { f: "#e7d9c5", c: INK }) + animT("translate", "0 0;-14 0;0 0", "1.4s")) + Li(88, 74, 112, 80, { c: A, w: 3 });
I.push = () => man(60, 88, "M60 71 L88 80 M60 71 L86 68 M60 92 L44 116 M60 92 L72 116") + g(Re(96, 66, 40, 32, { f: "#e7d9c5", c: INK }) + animT("translate", "0 0;16 0;0 0", "1.4s")) + arrow(146, 82, 168, 82, { c: A, w: 3.5 });
I.roll = () => g(Ci(90, 84, 24, { c: INK, w: 4 }) + Li(90, 60, 90, 84, { c: A, w: 3.5 }) + Li(90, 84, 110, 96, { c: A, w: 3 }) + `<animateTransform attributeName="transform" type="rotate" from="0 90 84" to="360 90 84" dur="2s" repeatCount="indefinite"/>`) + Li(40, 110, 164, 110, { w: 3.5 }) + arrow(126, 50, 156, 50, { c: MUT, w: 3 });
I.rub = () => Re(56, 84, 90, 22, { f: SOFT, c: INK }) + g(Re(82, 56, 38, 22, { f: "#fff", rx: 8 }) + animT("translate", "-18 0;18 0;-18 0", "0.9s")) + g(star(150, 56, 0.4) + anim("opacity", "0.2;1;0.2", "0.9s"));
I.run = () => g(man(96, 80, "M96 63 L72 72 M96 63 L122 56 M96 84 L70 96 M96 84 L122 104") + animT("translate", "-6 2;8 -2;-6 2", "0.5s")) + [44, 60].map((x, i2) => g(Li(x - 14, 96 + i2 * 12, x + 8, 96 + i2 * 12, { c: MUT, w: 3 }) + anim("opacity", "1;0.2;1", "0.5s"))).join("") + Li(36, 122, 164, 122, { c: MUT, w: 3 });
I.shake = () => g(Re(76, 48, 48, 56, { f: SOFT, c: INK }) + `<animateTransform attributeName="transform" type="rotate" values="-4 100 76;4 100 76;-4 100 76" dur="0.35s" repeatCount="indefinite"/>`) + Pa("M58 50 l-8 -6 M58 76 l-10 0 M58 102 l-8 6 M142 50 l8 -6 M142 76 l10 0 M142 102 l8 6", { c: A, w: 3 });
I.slip = () => g(man(92, 72, "M92 55 L70 50 M92 55 L114 46 M92 76 L116 84 M92 76 L70 88") + `<animateTransform attributeName="transform" type="rotate" values="0 92 96;-22 92 96;0 92 96" dur="1.4s" repeatCount="indefinite"/>`) + Pa("M48 112 Q100 104 156 112", { c: BL, w: 4 }) + Pa("M60 122 q8 -4 16 0 M110 124 q8 -4 16 0", { c: BL, w: 2.5 });
I.smash = () => g(Pa("M72 40 L84 64 L72 64 Z", { f: "none", c: "none" })) + g(Re(56, 30, 30, 36, { f: "#9a6b3f", c: INK, rx: 4 }) + animT("rotate", "-30 70 30;14 70 30;-30 70 30", "1.1s")) + g(Pa("M96 92 L112 80 L124 96 L140 84", { c: R, w: 3 }) + anim("opacity", "0;1;0", "1.1s")) + Pa("M88 104 L100 96 L114 108 L128 98 L142 110", { w: 3.5 }) + Li(50, 118, 156, 118, { c: MUT, w: 3 });
I.sneeze = () => face({ cx: 76, cy: 70, r: 28, mouth: "o", eyes: "closed", brows: "sad" }) + g(Pa("M110 78 L150 66 M110 86 L156 84 M110 94 L148 104", { c: BL, w: 3 }) + anim("opacity", "0;1;0", "1s"));
I.step = () => Pa("M48 116 H78 V96 H108 V76 H138 V56 H164", { w: 4 }) + Pa("M60 108 q4 -8 12 -6 q4 6 -2 8 q-8 2 -10 -2", { f: A, c: "none" }) + g(Pa("M92 88 q4 -8 12 -6 q4 6 -2 8 q-8 2 -10 -2", { f: A, c: "none" }) + anim("opacity", "0.3;1;0.3", "1.4s"));
I.stretch = () => g(Pa("M70 76 q10 -16 20 0 t20 0 t20 0", { c: A, w: 4.5 }) + `<animateTransform attributeName="transform" type="scale" values="1 1;1.3 1;1 1" dur="1.8s" repeatCount="indefinite"/>`) + g(arrow(56, 110, 30, 110, { c: MUT, w: 3 })) + g(arrow(144, 110, 170, 110, { c: MUT, w: 3 }));
I.swim = () => g(man(92, 66, "M92 49 L120 56 M92 49 L66 42 M92 70 L120 78 M92 70 L66 64") + animT("translate", "-8 0;10 0;-8 0", "1.6s")) + g(wave(36, 100, 130, 6) + animT("translate", "0 0;-12 0;0 0", "1.6s")) + wave(36, 114, 130, 5, "#8ab6d6");
I.touch = () => Pa("M96 36 V78 M96 50 q-2 -10 8 -10 q8 0 8 10 V78 M112 54 q0 -8 8 -8 q8 0 8 8 V80 M128 60 q0 -6 7 -6 q7 0 7 7 V86 Q142 116 116 116 Q92 116 88 92 L80 72 q-2 -8 6 -8 q6 0 10 10", { f: "#f0cfae", c: A, w: 3 }) + g(Ci(96, 28, 6, { c: BL, w: 2.5 }) + anim("r", "4;9;4", "1.2s"));
I.turn = () => g(Pa("M100 36 A38 38 0 1 1 62 74", { c: A, w: 5 }) + Pa("M52 60 L62 76 L76 64", { c: A, w: 5 }) + animT("rotate", "0 100 74;360 100 74", "2.2s"));
I.twist = () => Pa("M60 50 q40 18 80 0 M60 76 q40 -18 80 0 M60 102 q40 18 80 0", { c: A, w: 4.5 }) + Li(60, 44, 60, 108, { w: 4 }) + Li(140, 44, 140, 108, { w: 4 });
I.walk = () => g(man(100, 78, "M100 61 L84 72 M100 61 L116 70 M100 82 L84 106 M100 82 L116 106") + animT("translate", "-4 0;6 0;-4 0", "1.4s")) + Li(40, 122, 160, 122, { c: MUT, w: 3 }) + Pa("M52 114 q4 -6 10 -4 M142 116 q4 -6 10 -4", { c: MUT, w: 2.5 });
I.wash = () => Pa("M56 64 H144 L136 108 Q134 118 124 118 H76 Q66 118 64 108 Z", { f: "#fff" }) + g(Ci(80, 48, 7, { c: BL, w: 2.5 }) + anim("cy", "52;36;52", "1.7s")) + g(Ci(104, 44, 5, { c: BL, w: 2.5 }) + anim("cy", "48;32;48", "1.4s")) + g(Ci(124, 50, 6, { c: BL, w: 2.5 }) + anim("cy", "54;40;54", "2s")) + wave(64, 84, 72, 4);
I.work = () => g(Pa("M76 56 L116 96", { c: "#9a6b3f", w: 6 }) + Re(108, 86, 26, 20, { f: "#8b8b8b", c: INK, rx: 3 }) + animT("rotate", "-26 76 56;18 76 56;-26 76 56", "1s")) + Li(48, 118, 152, 118, { w: 4 }) + g(star(140, 56, 0.4) + anim("opacity", "0;1;0", "1s"));
I.shock = () => g(Pa("M96 30 L78 70 H94 L86 112 L120 60 H102 L112 30 Z", { f: "#f2c233", c: A, w: 2 }) + anim("opacity", "1;0.3;1", "0.5s")) + face({ cx: 152, cy: 92, r: 22, mouth: "o", eyes: "wide" });
I.wind = () => [52, 72, 92].map((y, i2) => g(Pa(`M30 ${y} q30 -12 60 0 q20 8 40 0 q14 -6 28 0`, { c: BL, w: 3.5 }) + anim("opacity", "0.3;1;0.3", `${1.2 + i2 * 0.3}s`))).join("") + g(Pa("M138 104 q10 -14 22 -6 q-2 14 -16 12 q-8 -1 -6 -6 Z", { f: G, c: "none" }) + animT("translate", "0 0;16 -6;0 0", "1.5s"));
I.thunder = () => Pa("M58 60 Q44 60 44 46 Q44 32 60 32 Q64 18 82 18 Q98 18 102 30 Q120 26 126 40 Q140 42 140 54 Q140 66 126 66 Z", { f: "#cfc8bb", c: INK }) + g(Pa("M96 66 L80 96 H94 L86 126 L114 84 H100 L110 66 Z", { f: "#f2c233", c: A, w: 2 }) + anim("opacity", "1;0.1;1", "1.2s"));
I.steam = () => Pa("M64 96 H136 V112 Q136 122 126 122 H74 Q64 122 64 112 Z", { f: "#fff" }) + Li(136, 102, 154, 96, { w: 3.5 }) + [78, 100, 122].map((x, i2) => g(Pa(`M${x} 88 q8 -10 0 -20 q-8 -10 0 -20`, { c: MUT, w: 3.5 }) + anim("opacity", "0.2;1;0.2", `${1.4 + i2 * 0.3}s`))).join("");

/* —— 物件 —— */
I.brass = () => Re(62, 66, 76, 30, { f: "#d8b34a", c: A, rx: 4 }) + Pa("M62 66 L78 50 H154 L138 66", { f: "#e8c969", c: A }) + Pa("M154 50 L138 66 V96", { c: A, w: 3 }) + star(120, 58, 0.4, "#fff");
I.butter = () => Re(56, 70, 88, 34, { f: "#f5d76e", c: A, rx: 4 }) + Pa("M56 70 L72 56 H160 L144 70", { f: "#f9e6a0", c: A }) + Pa("M40 110 H160", { c: MUT, w: 3 }) + Pa("M120 44 L138 30", { c: INK, w: 3 }) + Pa("M132 42 q10 -8 14 2 q-6 8 -14 -2", { f: "#ddd", c: INK, w: 2 });
I.canvas = () => Pa("M70 118 L100 38 L130 118", { w: 3.5 }) + Re(64, 50, 72, 54, { f: "#fff" }) + Pa("M72 92 q14 -22 26 -8 q12 -20 24 -2", { c: A, w: 3 }) + Li(100, 104, 100, 118, { w: 3 });
I.chalk = () => Re(48, 40, 104, 64, { f: "#3d4a3e", c: INK, rx: 4 }) + Pa("M62 78 q20 -16 40 0 t36 -4", { c: "#fff", w: 3 }) + Re(120, 110, 36, 10, { f: "#fff", c: MUT, rx: 5 });
I.cloth = () => Pa("M52 50 H148 V98 Q124 110 100 98 Q76 86 52 98 Z", { f: "#cfe0ee", c: BL, w: 3 }) + [66, 82, 98, 114, 130].map((x) => Li(x, 54, x, 98, { c: "#9db8cc", w: 1.5 })).join("") + [62, 74, 86].map((y) => Li(54, y, 146, y, { c: "#9db8cc", w: 1.5 })).join("");
I.cork = () => Pa("M76 64 Q76 36 100 36 Q124 36 124 64 V116 H76 Z", { f: "#e6f0d8", c: G, w: 3 }) + Re(86, 28, 28, 24, { f: "#c89a68", c: A, rx: 4 }) + Pa("M90 36 h20 M92 44 h16", { c: A, w: 1.8 });
I.cotton = () => Ci(84, 70, 17, { f: "#fff", c: MUT, w: 2.5 }) + Ci(112, 64, 15, { f: "#fff", c: MUT, w: 2.5 }) + Ci(98, 84, 16, { f: "#fff", c: MUT, w: 2.5 }) + Ci(120, 84, 12, { f: "#fff", c: MUT, w: 2.5 }) + Pa("M100 102 V122 M100 110 L84 122", { c: "#7a5c3e", w: 3 });
I.cover = () => Re(64, 76, 72, 34, { f: SOFT, c: INK }) + g(Pa("M58 76 Q58 48 100 48 Q142 48 142 76", { f: "#fff", c: INK, w: 3 }) + Ci(100, 44, 5, { c: INK, w: 3 }) + animT("translate", "0 0;0 -12;0 0", "2s"));
I.field = () => Pa("M36 110 H164", { c: G, w: 3 }) + [44, 60, 76, 92, 108, 124, 140, 156].map((x) => Pa(`M${x} 110 q2 -12 4 -16 M${x + 4} 110 q-1 -10 4 -14`, { c: G, w: 2.5 })).join("") + Li(36, 86, 164, 86, { c: "#9a6b3f", w: 2.5 }) + [52, 84, 116, 148].map((x) => Li(x, 78, x, 94, { c: "#9a6b3f", w: 2.5 })).join("") + sun(150, 40, 9);
I.flower = () => [0, 72, 144, 216, 288].map((d) => `<ellipse cx="100" cy="56" rx="9" ry="17" fill="#f3b6c8" stroke="${R}" stroke-width="2" transform="rotate(${d} 100 68)"/>`).join("") + Ci(100, 68, 8, { f: "#f2c233", c: A }) + Pa("M100 88 V120 M100 102 Q84 100 80 88", { c: G, w: 3.5 });
I.frame = () => Re(56, 40, 88, 72, { f: "#c89a68", c: A, w: 3, rx: 4 }) + Re(70, 52, 60, 48, { f: "#fff", c: INK, w: 2.5, rx: 2 }) + Pa("M74 92 L88 74 L98 86 L112 64 L126 92", { c: G, w: 2.5 }) + Ci(116, 62, 4, { f: A, c: "none" });
I.glass = () => Pa("M76 40 H124 L118 112 Q117 120 100 120 Q83 120 82 112 Z", { f: "#eaf3fa", c: BL, w: 3 }) + Li(80, 66, 120, 66, { c: BL, w: 2.5 }) + Pa("M86 50 q-2 26 2 54", { c: "#fff", w: 3 });
I.grain = () => Pa("M100 122 V52", { c: A, w: 3 }) + [0, 1, 2, 3].map((i2) => { const y = 56 + i2 * 14; return Pa(`M100 ${y} q-14 -4 -18 -16 q14 0 18 12 M100 ${y} q14 -4 18 -16 q-14 0 -18 12`, { f: "#e8c969", c: A, w: 2 }); }).join("") + Pa("M100 52 q-4 -12 0 -16 q4 4 0 16", { f: "#e8c969", c: A });
I.grass = () => [48, 64, 80, 96, 112, 128, 144].map((x, i2) => Pa(`M${x} 116 q-4 -22 ${i2 % 2 ? 8 : -8} -38 M${x + 6} 116 q2 -18 ${i2 % 2 ? -6 : 8} -30`, { c: G, w: 3 })).join("") + Li(36, 118, 164, 118, { c: G, w: 3 });
I.harbor = () => Pa("M100 36 V96 M100 48 Q124 48 126 36 M78 64 H122", { c: INK, w: 4 }) + Pa("M70 96 Q85 84 100 96 Q115 108 130 96", { c: INK, w: 4 }) + wave(40, 116, 120, 5);
I.insect = () => `<ellipse cx="100" cy="84" rx="16" ry="22" fill="#5f7340" stroke="${INK}" stroke-width="2.5"/>` + Ci(100, 54, 10, { f: "#5f7340", c: INK, w: 2.5 }) + Pa("M94 46 L86 34 M106 46 L114 34", { w: 2.5 }) + Pa("M86 72 L62 64 M86 86 L60 86 M86 100 L64 110 M114 72 L138 64 M114 86 L140 86 M114 100 L136 110", { w: 2.5 }) + Li(100, 66, 100, 102, { c: INK, w: 1.5 });
I.jelly = () => g(Pa("M64 104 Q60 56 100 56 Q140 56 136 104 Z", { f: "#e85d8a", c: R, w: 3 }) + `<animateTransform attributeName="transform" type="scale" values="1 1;1.06 0.94;1 1" dur="1s" repeatCount="indefinite" additive="sum"/>`) + Li(48, 108, 152, 108, { w: 3.5 }) + Pa("M80 72 q-4 10 0 18", { c: "#fff", w: 3 });
I.leaf = () => Pa("M100 120 Q60 92 64 56 Q66 32 100 30 Q134 32 136 56 Q140 92 100 120 Z", { f: "#bfe3bf", c: G, w: 3 }) + Pa("M100 116 V40 M100 88 L76 70 M100 96 L124 78 M100 66 L82 52 M100 72 L120 56", { c: G, w: 2.5 });
I.leather = () => Pa("M60 50 Q52 66 60 84 L54 100 Q72 112 100 110 Q128 112 146 100 L140 84 Q148 66 140 50 Q120 40 100 44 Q80 40 60 50 Z", { f: "#b07b4f", c: A, w: 3 }) + Pa("M68 60 h10 M84 56 h10 M100 58 h10 M116 56 h10 M130 62 h8", { c: "#7a4f2c", w: 2, dash: "2 4" });
I.letter = () => Re(52, 50, 96, 58, { f: "#fff", rx: 4 }) + Pa("M52 52 L100 88 L148 52", { w: 3 }) + Ci(132, 64, 7, { c: R, w: 2.5 });
I.linen = () => Pa("M56 46 H144 V104 H56 Z", { f: "#f2ead8", c: A, w: 3 }) + [70, 84, 98, 112, 126].map((x) => Li(x, 48, x, 102, { c: "#d9cdb2", w: 1.5 })).join("") + [60, 74, 88].map((y) => Li(58, y, 142, y, { c: "#d9cdb2", w: 1.5 })).join("") + Pa("M56 104 q10 8 18 0 q10 8 18 0 q10 8 18 0 q10 8 18 0 q10 8 16 0", { c: A, w: 2.5 });
I.list = () => doc(64, 32, 72, 90, 0) + [52, 70, 88, 106].map((y) => Ci(78, y, 3.5, { f: A, c: "none" }) + Li(90, y, 122, y, { c: MUT, w: 3 })).join("");
I.machine = () => gearSpin(78, 66, 18, "3.5s") + gearSpin(116, 90, 13, "2.4s") + Re(52, 110, 96, 12, { f: SOFT, c: INK, rx: 3 }) + Li(140, 56, 156, 56, { c: A, w: 3 }) + Ci(160, 56, 4, { f: A, c: "none" });
I.market = () => Pa("M52 64 H148 L140 44 H60 Z", { f: A, c: "none" }) + Pa("M52 64 q0 10 12 10 q12 0 12 -10 q0 10 12 10 q12 0 12 -10 q0 10 12 10 q12 0 12 -10 q0 10 12 10 q12 0 12 -10", { f: "#e8c969", c: A, w: 2 }) + Re(60, 74, 80, 44, { f: "#fff", c: INK, w: 2.5 }) + Re(72, 90, 22, 28, { f: SOFT, c: INK, w: 2 }) + Ci(116, 100, 8, { f: "#e85d4a", c: R, w: 2 }) + Ci(128, 104, 7, { f: "#f2c233", c: A, w: 2 });
I.material = () => Re(52, 84, 40, 28, { f: "#c89a68", c: A, rx: 3 }) + Re(86, 64, 40, 28, { f: "#cfd8e0", c: BL, rx: 3 }) + Re(120, 88, 40, 24, { f: "#dcedc8", c: G, rx: 3 }) + Pa("M58 92 h26 M92 72 h26 M126 96 h26", { c: "#fff", w: 2 });
I.mine = () => Pa("M48 116 L84 56 H116 L152 116 Z", { f: "#8a7355", c: INK, w: 3 }) + Pa("M88 116 Q88 88 100 88 Q112 88 112 116 Z", { f: "#352f28", c: "none" }) + g(star(100, 70, 0.45, "#f2c233") + anim("opacity", "0.3;1;0.3", "1.6s")) + Pa("M132 52 L148 36 M148 36 l8 8 -10 2 Z", { c: A, w: 3.5 });
I.mountain = () => Pa("M32 116 L84 44 L112 84 L132 60 L168 116 Z", { f: "#9db8cc", c: BL, w: 3 }) + Pa("M74 58 L84 44 L94 58 L88 56 L84 62 L78 56 Z", { f: "#fff", c: "none" }) + sun(46, 40, 8);
I.nail = () => Li(100, 44, 100, 108, { c: "#8b8b8b", w: 6 }) + Pa("M100 108 L96 118 L104 118 Z", { f: "#8b8b8b", c: "none" }) + Re(84, 36, 32, 9, { f: "#8b8b8b", c: INK, rx: 3 }) + Re(56, 96, 88, 22, { f: "#c89a68", c: A, rx: 3 });
I.news = () => Re(48, 40, 104, 76, { f: "#fff", rx: 4 }) + Re(56, 50, 42, 30, { f: SOFT, c: MUT, rx: 2 }) + [56, 66, 76].map((y) => Li(106, y + 0, 144, y, { c: MUT, w: 3 })).join("") + [92, 102].map((y) => Li(56, y, 144, y, { c: MUT, w: 3 })).join("") + g(Ci(150, 38, 8, { f: R, c: "none" }) + anim("r", "6;9;6", "1.2s"));
I.note = () => Re(64, 40, 72, 76, { f: "#fdf3c0", c: A, rx: 2 }) + [58, 72, 86].map((y) => Li(76, y, 124, y, { c: "#cdb88a", w: 2.5 })).join("") + Ci(100, 40, 6, { f: R, c: INK, w: 2 });
I.oil = () => Pa("M100 34 Q72 70 72 92 A28 28 0 0 0 128 92 Q128 70 100 34 Z", { f: "#3a3530", c: "none" }) + Pa("M86 92 q0 14 14 16", { c: "#6a625a", w: 3 }) + g(Pa("M140 56 q-5 8 0 12 q5 -4 0 -12", { f: "#3a3530", c: "none" }) + anim("opacity", "0;1;0", "1.8s"));
I.ornament = () => Li(100, 26, 100, 44, { w: 3 }) + Ci(100, 78, 32, { f: "#e85d8a", c: R, w: 3 }) + Pa("M72 70 q28 -16 56 0 M72 88 q28 16 56 0", { c: "#fff", w: 2.5 }) + Re(92, 38, 16, 10, { f: "#e8c969", c: A, rx: 2 }) + star(112, 60, 0.35, "#fff");
I.page = () => Pa("M64 32 H120 L140 52 V118 H64 Z", { f: "#fff" }) + Pa("M120 32 V52 H140", { w: 2.5 }) + [64, 78, 92, 104].map((y) => Li(74, y + 0, 128, y, { c: MUT, w: 3 })).join("") + Pa("M64 118 Q70 110 78 118", { c: MUT, w: 2.5 });
I.paint = () => Pa("M60 96 q-8 14 4 18 q12 4 14 -10 q0 -8 8 -14 L134 44 L150 60 L102 106 q-6 8 -14 8", { f: "#fff", c: INK, w: 3 }) + Pa("M134 44 L150 60", { c: A, w: 3 }) + Pa("M48 60 Q70 40 96 56", { c: P, w: 7 }) + Pa("M52 76 Q74 58 98 72", { c: G, w: 7 });
I.paper = () => Re(64, 34, 72, 84, { f: "#fff", rx: 2 }) + Pa("M64 34 m58 0 l14 14 h-14 Z", { f: SOFT, c: INK, w: 2 });
I.paste = () => Re(56, 60, 44, 52, { f: "#fff", rx: 6 }) + Re(64, 48, 28, 14, { f: SOFT, c: INK, rx: 3 }) + Pa("M112 70 Q132 60 148 72 Q142 86 124 82 Q112 80 112 70", { f: "#e8e0c8", c: A, w: 2.5 }) + Pa("M120 96 q14 -6 28 0", { c: "#e8e0c8", w: 6 });
I.polish = () => Ci(96, 80, 26, { f: "#d8b34a", c: A, w: 3 }) + g(Re(120, 44, 32, 20, { f: "#fff", rx: 8, c: INK, w: 2.5 }) + animT("translate", "-10 6;10 -6;-10 6", "0.9s")) + g(star(72, 52, 0.5, "#fff") + anim("opacity", "0.2;1;0.2", "0.9s")) + g(star(112, 104, 0.4, "#fff") + anim("opacity", "1;0.2;1", "0.9s"));
I.road = () => Pa("M70 118 L94 36 H106 L130 118 Z", { f: "#8a8378", c: INK, w: 2.5 }) + [104, 86, 68, 52].map((y, i2) => Li(100, y, 100, y - 9, { c: "#fff", w: 3 })).join("");
I.room = () => Pa("M48 116 V52 L100 32 L152 52 V116 Z", { f: "#fff" }) + Re(66, 76, 24, 40, { f: SOFT, c: INK, w: 2.5 }) + Ci(86, 96, 2.5, { f: INK, c: "none" }) + Re(112, 70, 26, 22, { f: "#eaf3fa", c: INK, w: 2.5 }) + Li(125, 70, 125, 92, { w: 2 }) + Li(112, 81, 138, 81, { w: 2 });
I.seat = () => Pa("M64 40 V96 H128 M64 96 V118 M128 96 V118", { w: 4.5 }) + Re(64, 88, 64, 10, { f: A, c: "none", rx: 4 }) + Re(64, 40, 10, 50, { f: A, c: "none", rx: 4 });
I.silk = () => g(Pa("M44 60 Q80 36 116 60 T188 60", { c: "#d88ab8", w: 7 }) + animT("translate", "0 0;0 10;0 0", "2.2s")) + g(Pa("M28 84 Q64 60 100 84 T172 84", { c: "#e8aed0", w: 7 }) + animT("translate", "0 0;0 -10;0 0", "2.2s")) + star(140, 44, 0.4, "#fff");
I.silver = () => Re(58, 64, 84, 32, { f: "#d4d8dc", c: "#8b95a0", rx: 4 }) + Pa("M58 64 L74 48 H158 L142 64", { f: "#e6eaee", c: "#8b95a0" }) + Pa("M158 48 L142 64 V96", { c: "#8b95a0", w: 3 }) + g(star(120, 56, 0.4, "#fff") + anim("opacity", "0.3;1;0.3", "1.5s"));
I.soap = () => Re(56, 66, 70, 40, { f: "#cfe0ee", c: BL, rx: 14 }) + g(Ci(140, 52, 9, { c: BL, w: 2.5 }) + anim("cy", "56;36;56", "2s")) + g(Ci(156, 68, 6, { c: BL, w: 2.5 }) + anim("cy", "72;52;72", "1.6s")) + Pa("M68 80 q10 -8 20 0", { c: "#fff", w: 3 });
I.soup = () => Pa("M52 76 H148 Q148 116 100 116 Q52 116 52 76 Z", { f: "#fff" }) + Pa("M62 84 Q100 96 138 84", { c: "#e8a23a", w: 4 }) + Li(140, 60, 162, 44, { w: 3.5 }) + [82, 104].map((x, i2) => g(Pa(`M${x} 64 q6 -8 0 -16`, { c: MUT, w: 3 }) + anim("opacity", "0.3;1;0.3", `${1.5 + i2 * 0.3}s`))).join("");
I.table = () => Re(48, 58, 104, 10, { f: "#b07b4f", c: A, rx: 3 }) + Li(58, 68, 58, 114, { c: A, w: 5 }) + Li(142, 68, 142, 114, { c: A, w: 5 }) + Li(58, 92, 142, 92, { c: A, w: 3 });
I.tin = () => Pa("M70 48 a30 8 0 0 0 60 0 a30 8 0 0 0 -60 0 V104 a30 8 0 0 0 60 0 V48", { f: "#d4d8dc", c: "#8b95a0", w: 2.5 }) + Li(70, 76, 130, 76, { c: "#aab2bc", w: 2 }) + Pa("M82 44 h36", { c: "#8b95a0", w: 2 });
I.vessel = () => Pa("M78 36 H122 M100 36 V56 Q140 60 140 92 A40 24 0 0 1 60 92 Q60 60 100 56", { f: "#eaf3fa", c: BL, w: 3 }) + wave(70, 92, 60, 4);
I.wine = () => Pa("M76 36 H124 Q124 76 100 80 Q76 76 76 36 Z", { f: "#f6e8ee", c: INK, w: 3 }) + Pa("M80 44 H120 Q119 66 100 70 Q81 66 80 44 Z", { f: "#a3325a", c: "none" }) + Li(100, 80, 100, 110, { w: 3 }) + Li(82, 114, 118, 114, { w: 3.5 });
I.wood = () => Ci(76, 76, 30, { f: "#deb887", c: A, w: 3 }) + Ci(76, 76, 19, { c: A, w: 2 }) + Ci(76, 76, 9, { c: A, w: 2 }) + Re(110, 56, 52, 40, { f: "#c89a68", c: A, rx: 4 }) + Pa("M116 66 q20 -4 40 0 M116 80 q20 4 40 0", { c: "#9a6b3f", w: 2 });
I.wool = () => Ci(100, 76, 30, { f: "#f4efe6", c: A, w: 3 }) + Pa("M76 68 q24 -18 48 0 M74 84 q26 18 52 0 M84 56 q16 40 32 0 M84 96 q16 -40 32 0", { c: "#cdbfa4", w: 2 }) + Pa("M128 94 q22 8 30 24", { c: A, w: 2.5 });

/* —— 能力 / 抽象关系 —— */
I.able = () => man(84, 84, "M84 67 L62 56 M84 67 L110 50 M84 88 L68 112 M84 88 L100 112") + Re(104, 38, 28, 20, { f: "#e7d9c5", c: INK }) + check(152, 84, 0.9);
I.authority = () => person(100, 78) + Pa("M82 40 L88 26 L96 38 L100 22 L104 38 L112 26 L118 40 Z", { f: "#e8c969", c: A }) + person(56, 104, 0.45) + person(144, 104, 0.45) + arrow(72, 104, 86, 96, { c: MUT, w: 2.5 }) + arrow(128, 104, 114, 96, { c: MUT, w: 2.5 });
I.beautiful = () => I.flower() + g(star(60, 44, 0.5) + anim("opacity", "0.3;1;0.3", "1.3s")) + g(star(146, 50, 0.45) + anim("opacity", "1;0.3;1", "1.3s"));
I.belief = () => Ci(100, 60, 26) + Ci(86, 54, 3, { f: INK, c: "none" }) + Ci(114, 54, 3, { f: INK, c: "none" }) + heart(100, 92, 0.8) + Pa("M100 56 V72", { c: "none", w: 1 }) + g(Ci(100, 60, 36, { c: A, w: 2, extra: 'stroke-dasharray="5 6"' }) + anim("opacity", "0.4;1;0.4", "2s"));
I.building = () => Re(64, 44, 72, 74, { f: "#fff" }) + [58, 76, 94].map((y) => [78, 100, 122].map((x) => Re(x - 6, y, 12, 10, { f: "#cfe0ee", c: INK, w: 1.8, rx: 1 })).join("")).join("") + Re(92, 102, 16, 16, { f: SOFT, c: INK, w: 2, rx: 1 }) + Li(48, 118, 152, 118, { w: 3.5 });
I.cause = () => g(Re(48, 60, 14, 44, { f: A, c: "none", rx: 3, extra: `transform="rotate(18 55 104)"` })) + Re(84, 60, 14, 44, { f: SOFT, c: INK, rx: 3 }) + Re(114, 60, 14, 44, { f: SOFT, c: INK, rx: 3 }) + Re(144, 60, 14, 44, { f: SOFT, c: INK, rx: 3 }) + arrow(58, 44, 78, 52, { c: A, w: 3 });
I.chance = () => Re(64, 52, 46, 46, { f: "#fff", rx: 8 }) + Ci(80, 68, 4, { f: INK, c: "none" }) + Ci(96, 84, 4, { f: INK, c: "none" }) + g(Re(102, 64, 42, 42, { f: "#fff", rx: 8 }) + Ci(114, 76, 3.5, { f: INK, c: "none" }) + Ci(124, 86, 3.5, { f: INK, c: "none" }) + Ci(134, 96, 3.5, { f: INK, c: "none" }) + animT("rotate", "-6 123 85;8 123 85;-6 123 85", "1.6s"));
I.change = () => Pa("M64 56 H120 L110 44 M120 56 l-10 12", { c: "none", w: 1 }) + g(arrow(56, 56, 134, 56, { c: A, w: 4 })) + g(arrow(144, 94, 66, 94, { c: BL, w: 4 })) + Ci(46, 56, 9, { f: SOFT, c: INK, w: 2.5 }) + Re(146, 86, 18, 18, { f: SOFT, c: INK, w: 2.5, rx: 3 });
I.color = () => Ci(78, 64, 16, { f: R, c: "none" }) + Ci(122, 64, 16, { f: BL, c: "none" }) + Ci(78, 100, 16, { f: "#f2c233", c: "none" }) + Ci(122, 100, 16, { f: G, c: "none" });
I.comfort = () => Pa("M56 100 V72 Q56 60 68 60 H132 Q144 60 144 72 V100", { f: "#d8c8e8", c: P, w: 3 }) + Re(48, 96, 104, 16, { f: "#c4aede", c: P, rx: 8 }) + Re(66, 74, 28, 20, { f: "#fff", c: P, w: 2, rx: 6 }) + g(Pa("M156 48 q6 -10 0 -18", { c: MUT, w: 3 }) + anim("opacity", "0.3;1;0.3", "1.8s"));
I.complex = () => [[60, 56], [100, 40], [140, 56], [72, 96], [128, 96], [100, 72]].map(([x, y]) => Ci(x, y, 7, { f: SOFT, c: INK, w: 2.5 })).join("") + Pa("M60 56 L100 40 L140 56 L128 96 L72 96 Z M60 56 L100 72 L140 56 M72 96 L100 72 L128 96 M100 40 L100 72", { c: MUT, w: 2 });
I.condition = () => Re(56, 44, 88, 20, { f: "#fff", rx: 10 }) + Ci(76, 54, 8, { f: G, c: INK, w: 2 }) + Re(56, 78, 88, 20, { f: "#fff", rx: 10 }) + Ci(124, 88, 8, { f: MUT, c: INK, w: 2 }) + check(160, 54, 0.5) + qmark(164, 90, 0.5, MUT);
I.connection = () => Ci(60, 76, 14, { f: SOFT, c: INK }) + Ci(140, 76, 14, { f: SOFT, c: INK }) + g(Li(74, 76, 126, 76, { c: A, w: 4 }) + anim("stroke-width", "3;6;3", "1.4s")) + Ci(100, 76, 5, { f: A, c: "none" });
I.control = () => Re(56, 48, 88, 60, { f: "#fff", rx: 8 }) + Li(72, 64, 128, 64, { c: MUT, w: 3 }) + Ci(88, 64, 7, { f: A, c: INK, w: 2 }) + Li(72, 84, 128, 84, { c: MUT, w: 3 }) + g(Ci(116, 84, 7, { f: A, c: INK, w: 2 }) + animT("translate", "0 0;-24 0;0 0", "2s"));
I.cook = () => Pa("M60 72 H140 V104 Q140 114 130 114 H70 Q60 114 60 104 Z", { f: "#fff" }) + Li(140, 80, 156, 74, { w: 3.5 }) + g(Pa("M80 60 q6 -10 0 -18 M100 62 q6 -10 0 -18 M120 60 q6 -10 0 -18", { c: MUT, w: 3 }) + anim("opacity", "0.3;1;0.3", "1.5s")) + Pa("M84 124 q8 -6 16 0 q8 6 16 0", { c: R, w: 3 });
I.copy = () => Re(60, 40, 56, 70, { f: "#fff", rx: 3 }) + [54, 66, 78].map((y) => Li(70, y, 106, y, { c: MUT, w: 2.5 })).join("") + Re(84, 56, 56, 70, { f: "#fff", rx: 3 }) + [72, 84, 96].map((y) => Li(94, y, 130, y, { c: MUT, w: 2.5 })).join("") + arrow(120, 36, 140, 50, { c: A, w: 3 });
I.cough = () => face({ cx: 72, cy: 70, r: 26, mouth: "o", eyes: "closed", brows: "sad" }) + g(Pa("M104 64 l16 -6 M106 74 l20 0 M104 84 l16 6", { c: A, w: 3.5 }) + anim("opacity", "0;1;0", "0.8s")) + Pa("M58 104 q14 10 28 0", { c: MUT, w: 2.5 });
I.country = () => Pa("M36 110 Q60 84 84 96 Q110 70 134 88 Q150 78 164 92 V110 Z", { f: "#dcedc8", c: G, w: 3 }) + sun(58, 44, 9) + Pa("M120 56 V36 H140 L134 42 L140 48 H124", { c: R, w: 3 });
I.crack = () => Re(56, 40, 88, 76, { f: "#fff" }) + Pa("M100 40 L90 62 L104 74 L92 92 L102 116", { c: R, w: 3.5 });
I.delicate = () => Pa("M76 36 H124 L118 100 Q117 112 100 112 Q83 112 82 100 Z", { f: "#eaf3fa", c: BL, w: 2 }) + Pa("M150 40 q-8 12 0 18 M42 60 q8 10 0 18", { c: MUT, w: 2 }) + Pa("M118 56 l10 -8 M124 64 l12 -4", { c: R, w: 2 }) + Pa("M86 48 q-2 24 2 48", { c: "#fff", w: 3 });
I.dependent = () => Ci(72, 64, 24, { f: SOFT, c: INK }) + Ci(134, 96, 13, { f: "#fff", c: A, w: 3 }) + Li(92, 78, 124, 90, { c: A, w: 3.5 }) + arrow(134, 70, 134, 82, { c: MUT, w: 2.5 });
I.earth = () => Ci(100, 76, 40, { f: "#cfe0ee", c: BL, w: 3 }) + Pa("M72 56 Q86 48 96 58 Q104 66 94 74 Q80 76 72 66 Z M110 80 Q126 74 134 84 Q138 96 124 100 Q110 98 110 88 Z M88 96 Q98 92 102 100 Q98 108 90 104 Z", { f: "#9fcf9f", c: G, w: 2 });
I.education = () => Pa("M100 44 L156 64 L100 84 L44 64 Z", { f: INK, c: "none" }) + Li(100, 84, 100, 100, { w: 3 }) + Pa("M72 74 V94 Q100 108 128 94 V74", { c: INK, w: 3 }) + Li(140, 70, 140, 92, { c: A, w: 3 }) + Ci(140, 96, 4, { f: A, c: "none" });
I.effect = () => g(Ci(100, 76, 8, { f: BL, c: "none" })) + [18, 30, 42].map((r, i2) => g(Ci(100, 76, r, { c: BL, w: 2.5 }) + anim("r", `${r - 6};${r + 8};${r - 6}`, "2s") + anim("opacity", "1;0.2;1", "2s"))).join("");
I.enough = () => Pa("M68 44 H132 V108 Q132 118 122 118 H78 Q68 118 68 108 Z", { f: "#fff" }) + Re(70, 70, 60, 46, { f: "#cfe0ee", c: "none", rx: 0 }) + Li(60, 70, 140, 70, { c: G, w: 3.5, dash: "6 5" }) + check(154, 56, 0.7);
I.even = () => [60, 90, 120].map((x) => Re(x - 9, 64, 18, 40, { f: SOFT, c: INK, rx: 3 })).join("") + Li(40, 60, 160, 60, { c: G, w: 3.5 }) + Li(40, 108, 160, 108, { c: MUT });
I.every = () => [0, 1, 2].map((r) => [0, 1, 2, 3].map((cc) => Ci(58 + cc * 28, 50 + r * 28, 9, { f: A, c: "none" })).join("")).join("") + check(166, 110, 0.6);
I.example = () => [56, 88, 152].map((x) => Ci(x, 88, 9, { f: MUT, c: "none" })).join("") + Ci(120, 84, 13, { f: A, c: "none" }) + Pa("M120 50 L120 64", { c: A, w: 3 }) + Pa("M112 56 L120 66 L128 56", { c: A, w: 3 }) + Ci(120, 84, 22, { c: A, w: 2.5, extra: 'stroke-dasharray="5 5"' });
I.exchange = () => Re(44, 48, 36, 28, { f: SOFT, c: INK, rx: 4 }) + Ci(138, 62, 16, { f: "#e8c969", c: A, w: 2.5 }) + g(arrow(86, 52, 116, 52, { c: A, w: 3.5 }) + animT("translate", "0 0;6 0;0 0", "1.2s")) + g(arrow(114, 96, 84, 96, { c: BL, w: 3.5 }) + animT("translate", "0 0;-6 0;0 0", "1.2s")) + Re(120, 84, 36, 26, { f: SOFT, c: INK, rx: 4 }) + Ci(62, 98, 14, { f: "#e8c969", c: A, w: 2.5 });
I.existence = () => g(Ci(100, 76, 12, { f: A, c: "none" }) + anim("r", "10;14;10", "1.8s")) + [0, 45, 90, 135, 180, 225, 270, 315].map((d) => { const a0 = (d * Math.PI) / 180; return Li(100 + 22 * Math.cos(a0), 76 + 22 * Math.sin(a0), 100 + 32 * Math.cos(a0), 76 + 32 * Math.sin(a0), { c: A, w: 2.5 }); }).join("") + check(152, 110, 0.6);
I.expansion = () => g(Re(76, 52, 48, 48, { f: SOFT, c: INK, rx: 6 }) + `<animateTransform attributeName="transform" type="scale" values="1;1.25;1" dur="1.8s" repeatCount="indefinite" additive="sum" transform-origin="100 76"/>`) + [[44, 40, -1, -1], [156, 40, 1, -1], [44, 112, -1, 1], [156, 112, 1, 1]].map(([x, y, dx, dy]) => arrow(x - dx * 18, y - dy * 14, x, y, { c: A, w: 3 })).join("");
I.experience = () => Pa("M40 110 Q70 110 76 86 Q82 56 110 60 Q138 64 142 44", { c: A, w: 3.5, dash: "7 6" }) + Ci(40, 110, 6, { f: INK, c: "none" }) + Pa("M142 28 V52 L158 44 Z", { f: R, c: "none" }) + [76, 110].map((x, i2) => Ci(x, i2 ? 60 : 86, 4, { f: A, c: "none" })).join("");
I.fact = () => doc(64, 34, 72, 84, 4) + Ci(120, 102, 14, { f: G, c: "none" }) + check(120, 102, 0.6, "#fff");
I.fertile = () => Pa("M40 100 H160 V116 H40 Z", { f: "#8a6a4a", c: A, w: 2.5 }) + [64, 100, 136].map((x, i2) => g(Pa(`M${x} 100 V72 M${x} 84 q-12 -2 -14 -14 q12 0 14 10 M${x} 78 q12 -4 14 -16 q-12 0 -14 12`, { c: G, w: 3 }) + anim("opacity", "0.5;1;0.5", `${1.6 + i2 * 0.3}s`))).join("") + sun(152, 40, 9);
I.form = () => Ci(70, 64, 18, { c: A, w: 3.5 }) + Re(106, 46, 36, 36, { c: BL, w: 3.5, rx: 2 }) + Pa("M70 94 L88 124 H52 Z", { c: G, w: 3.5 }) + Pa("M112 94 l28 0 l-8 28 l-28 0 Z", { c: P, w: 3.5 });
I.full = () => Pa("M72 40 H128 V108 Q128 118 118 118 H82 Q72 118 72 108 Z", { f: "#fff" }) + Pa("M74 48 H126 V108 Q126 116 118 116 H82 Q74 116 74 108 Z", { f: "#9db8d8", c: "none" }) + g(wave(74, 48, 52, 3) + anim("opacity", "0.6;1;0.6", "1.6s"));
I.harmony = () => note8(76, 80, 1, A) + note8(116, 72, 0.85, BL) + g(wave(48, 106, 104, 5, G) + anim("opacity", "0.5;1;0.5", "1.8s"));
I.help = () => Pa("M40 96 Q60 80 80 88 L96 94", { c: A, w: 5 }) + Pa("M160 56 Q140 72 120 64 L104 58", { c: BL, w: 5 }) + Pa("M96 94 Q100 80 104 58", { c: "none", w: 1 }) + Pa("M94 90 q8 -16 12 -28", { c: MUT, w: 2.5, dash: "4 4" }) + heart(100, 30, 0.55);
I.hole = () => Re(48, 44, 104, 72, { f: SOFT, c: MUT }) + `<ellipse cx="100" cy="82" rx="26" ry="14" fill="#2b2622"/>` + Pa("M74 82 a26 14 0 0 1 52 0", { c: INK, w: 2.5 });
I.hope = () => Pa("M36 110 H164", { c: MUT, w: 3 }) + Pa("M52 110 A48 48 0 0 1 148 110", { f: "none", c: A, w: 4 }) + g(star(100, 38, 0.8) + anim("opacity", "0.4;1;0.4", "1.6s")) + person(100, 96, 0.55);
I.how = () => qmark(100, 60, 1.1) + gearSpin(64, 104, 11, "3s") + arrow(84, 104, 116, 104, { c: A, w: 3 }) + Ci(132, 104, 9, { f: G, c: "none" });
I.if = () => Li(100, 112, 100, 80, { w: 4 }) + Ci(100, 70, 9, { f: A, c: "none" }) + arrow(94, 64, 58, 40, { c: MUT, w: 3.5, dash: "6 5" }) + arrow(106, 64, 142, 40, { c: MUT, w: 3.5, dash: "6 5" }) + qmark(100, 36, 0.55);
I.industry = () => Pa("M48 116 V72 L76 88 V72 L104 88 V72 L132 88 V60 H152 V116 Z", { f: "#cfc8bb", c: INK, w: 3 }) + g(Pa("M140 48 q6 -10 0 -18", { c: MUT, w: 4 }) + anim("opacity", "0.3;1;0.3", "1.6s")) + Re(60, 96, 12, 20, { f: "#8a8378", c: "none" });
I.insurance = () => Pa("M100 36 Q104 56 130 56 Q130 58 100 64 Q70 58 70 56 Q96 56 100 36 Z", { f: "none", c: "none" }) + Pa("M58 64 Q100 28 142 64 M100 36 V100", { c: A, w: 4 }) + Pa("M100 100 q0 12 -12 12", { c: A, w: 3.5 }) + Pa("M76 88 L100 72 L124 88 V112 H76 Z", { f: "#fff", c: INK, w: 2.5 });
I.interest = () => Ci(80, 70, 22, { c: INK, w: 3.5 }) + Ci(80, 70, 8, { f: INK, c: "none" }) + g(arrow(106, 70, 134, 70, { c: A, w: 3.5 }) + anim("opacity", "0.4;1;0.4", "1.2s")) + star(150, 66, 0.7);
I.invention = () => Ci(100, 62, 24, { f: "#fdf3c0", c: A, w: 3 }) + Pa("M90 84 H110 V94 H90 Z M94 94 v8 h12 v-8", { c: A, w: 2.5 }) + [0, 45, 90, 135, 180].map((d) => { const a0 = ((d - 180) * Math.PI) / 180; return g(Li(100 + 30 * Math.cos(a0), 62 + 30 * Math.sin(a0), 100 + 40 * Math.cos(a0), 62 + 40 * Math.sin(a0), { c: A, w: 2.5 }) + anim("opacity", "0.3;1;0.3", "1.4s")); }).join("") + gearSpin(146, 104, 9, "3s");
I.join = () => Pa("M56 60 H88 V76 H100 V60 H92", { c: "none", w: 1 }) + Pa("M52 56 h32 v16 h-12 v16 h-32 v-16 h12 Z", { f: SOFT, c: INK, w: 2.5 }) + Pa("M116 56 h32 v32 h-32 v-12 h-12 v-8 h12 Z", { f: "#e8c969", c: A, w: 2.5 }) + g(arrow(104, 100, 92, 88, { c: A, w: 3 }) + anim("opacity", "0.4;1;0.4", "1.4s"));
I.journey = () => Pa("M44 104 Q80 96 96 72 Q112 48 152 48", { c: A, w: 3.5, dash: "8 7" }) + Ci(44, 104, 7, { f: G, c: "none" }) + Pa("M152 32 V56 M152 32 H168 L162 40 L168 48 H152", { c: R, w: 3 }) + Pa("M86 86 q4 -6 10 -6", { c: "none", w: 1 });
I.learning = () => Ci(72, 56, 18) + Pa("M72 74 V96", { w: 3 }) + Pa("M96 96 H148 V64 Q122 56 96 64 Z M122 62 V94", { f: "#fff", c: INK, w: 2.5 }) + g(arrow(112, 44, 84, 50, { c: A, w: 3 }) + anim("opacity", "0.4;1;0.4", "1.4s"));
I.left = () => arrow(150, 76, 56, 76, { c: A, w: 6 }) + Li(40, 50, 40, 102, { c: A, w: 4 });
I.like = () => heart(78, 56, 1) + Ci(132, 70, 16, { f: SOFT, c: INK, w: 2.5 }) + Pa("M118 70 q-8 -2 -8 -10 q0 -8 8 -8 q2 -8 12 -8 q10 0 12 8 q8 0 8 8 q0 8 -8 10", { c: "none", w: 1 }) + arrow(96, 72, 114, 72, { c: A, w: 3 }) + arrow(116, 92, 98, 88, { c: A, w: 3 });
I.living = () => g(Pa("M100 116 V70", { c: G, w: 4 }) + anim("opacity", "0.7;1;0.7", "2s")) + g(Pa("M100 88 Q76 84 70 58 Q96 60 100 82 M100 76 Q124 72 130 46 Q104 48 100 70", { f: "#bfe3bf", c: G, w: 3 }) + `<animateTransform attributeName="transform" type="scale" values="1;1.06;1" dur="2s" repeatCount="indefinite" additive="sum" transform-origin="100 90"/>`) + sun(50, 40, 8) + Li(70, 116, 130, 116, { c: MUT });
I.loss = () => Pa("M64 48 h44 q14 0 14 14 v6", { c: "none", w: 1 }) + Pa("M60 52 H120", { c: MUT, w: 3 }) + g(coin(132, 64) + anim("cy", "60;104;60", "1.8s") + anim("opacity", "1;0.2;1", "1.8s")) + Pa("M56 64 q-4 28 10 44 h60", { c: A, w: 3.5 }) + arrow(146, 96, 158, 112, { c: R, w: 3.5 });
I.memory = () => Ci(96, 70, 32) + Pa("M96 38 Q120 38 126 58", { c: "none", w: 1 }) + Pa("M96 102 V112 Q96 120 86 120", { c: INK, w: 3 }) + clock(96, 70, 18, 1, 3.5, { acc: A }) + g(Pa("M140 50 q10 -4 16 4", { c: MUT, w: 2.5, dash: "3 4" }) + anim("opacity", "0.3;1;0.3", "2s"));
I.mind = () => Ci(96, 72, 34) + Pa("M96 106 V116", { w: 3 }) + gearSpin(88, 66, 11, "4s") + gearSpin(110, 84, 8, "3s");
I.mixed = () => Pa("M64 96 Q60 56 100 56 Q140 56 136 96 Z", { f: "#fff", c: INK, w: 3 }) + g(Pa("M76 84 Q88 70 100 84 Q112 98 124 84", { c: P, w: 4 }) + animT("rotate", "0 100 80;14 100 80;0 100 80", "1.4s")) + g(Pa("M76 74 Q88 88 100 74 Q112 60 124 74", { c: G, w: 4 }) + animT("rotate", "0 100 80;-14 100 80;0 100 80", "1.4s")) + Li(100, 36, 116, 52, { c: A, w: 4 });
I.need = () => Pa("M64 76 q0 -18 16 -18 h14", { c: A, w: 4 }) + Ci(56, 88, 14, { c: A, w: 4 }) + Pa("M118 58 h14 q16 0 16 18", { c: BL, w: 4 }) + Ci(156, 88, 14, { c: BL, w: 4 }) + g(arrow(98, 58, 112, 58, { c: R, w: 3 }) + anim("opacity", "0.3;1;0.3", "1s"));
I.no = () => Ci(100, 74, 38, { c: R, w: 6 }) + Li(74, 100, 126, 48, { c: R, w: 6 });
I.not = () => Re(72, 52, 56, 48, { f: SOFT, c: INK, rx: 6 }) + Li(60, 112, 140, 40, { c: R, w: 6 });
I.offer = () => Pa("M40 104 Q64 92 84 100 L100 106", { c: A, w: 4.5 }) + Re(96, 48, 44, 36, { f: "#f3d6e0", c: R, w: 2.5, rx: 4 }) + Pa("M96 62 h44 M118 48 v36 M110 48 q8 -12 8 0 q8 -12 8 0", { c: R, w: 2.5 }) + g(animT("translate", "0 0;0 -6;0 0", "1.6s"));
I.operation = () => gearSpin(86, 70, 17, "3s") + arrow(50, 108, 80, 96, { c: A, w: 3 }) + arrow(120, 96, 150, 108, { c: A, w: 3 }) + Re(120, 52, 34, 24, { f: "#fff", c: INK, w: 2.5, rx: 4 }) + check(137, 64, 0.5);
I.opinion = () => bubble(48, 36, 60, 40) + Pa("M70 56 l8 14 M86 70 l8 -22", { c: "none", w: 1 }) + Pa("M70 70 l8 -10 l6 6 l10 -14", { c: G, w: 3 }) + bubble(108, 70, 52, 34, true) + Pa("M128 92 l16 -12 M128 80 l16 12", { c: R, w: 3 });
I.opposite = () => arrow(96, 60, 44, 60, { c: BL, w: 5 }) + arrow(104, 92, 156, 92, { c: R, w: 5 }) + Li(100, 40, 100, 112, { c: MUT, w: 2.5, dash: "5 5" });
I.or = () => Li(100, 116, 100, 84, { w: 4 }) + arrow(96, 80, 62, 48, { c: A, w: 4 }) + arrow(104, 80, 138, 48, { c: A, w: 4 }) + Ci(62, 40, 9, { f: SOFT, c: INK, w: 2.5 }) + Re(130, 32, 18, 18, { f: SOFT, c: INK, w: 2.5, rx: 3 });
I.pain = () => Pa("M70 56 Q70 36 92 40 Q98 28 112 34 Q128 30 128 48 Q142 54 134 70 Q138 86 122 88 Q116 100 102 94 Q86 100 82 86 Q66 84 70 70 Z", { f: "#fde3e3", c: R, w: 3 }) + g(Pa("M100 50 L92 66 H102 L96 84", { c: R, w: 4 }) + anim("opacity", "1;0.3;1", "0.7s"));
I.payment = () => coin(70, 60) + coin(82, 60) + g(coin(94, 60) + animT("translate", "0 0;36 24;0 0", "1.6s")) + Pa("M118 96 Q140 86 160 96 L156 110 Q138 102 122 110 Z", { f: "#f0cfae", c: A, w: 2.5 });
I.peace = () => Pa("M86 64 Q66 64 66 82 Q66 100 88 100 L114 100 Q134 100 134 84 Q134 70 118 70 Q112 54 96 56 Q86 58 86 64 Z", { f: "none", c: "none" }) + Pa("M70 90 Q100 60 142 64 Q128 70 124 78 Q140 78 148 72 Q142 92 116 94 Q88 96 70 90 Z", { f: "#fff", c: INK, w: 2.5 }) + Ci(140, 62, 2, { f: INK, c: "none" }) + Pa("M96 96 q-2 10 -10 14", { c: INK, w: 2.5 }) + Pa("M56 44 q14 4 18 14 M62 38 q4 8 12 10", { c: G, w: 2.5 });
I.place = () => Pa("M100 32 Q128 32 128 62 Q128 84 100 116 Q72 84 72 62 Q72 32 100 32 Z", { f: R, c: "none" }) + Ci(100, 60, 11, { f: "#fff", c: "none" }) + `<ellipse cx="100" cy="120" rx="26" ry="6" fill="${SOFT}"/>`;
I.play = () => g(Ci(84, 56, 14, { f: R, c: INK, w: 2.5 }) + anim("cy", "56;96;56", "1.1s")) + Li(48, 112, 152, 112, { w: 3.5 }) + man(136, 84, "M136 67 L120 76 M136 67 L152 60 M136 88 L122 110 M136 88 L150 110");
I.point = () => arrow(48, 108, 116, 56, { c: A, w: 5 }) + g(Ci(128, 48, 7, { f: R, c: "none" }) + anim("r", "5;9;5", "1.2s"));
I.poor = () => Pa("M76 56 Q76 40 100 40 Q124 40 124 56 V76 Q124 92 100 92 Q76 92 76 76 Z", { f: "none", c: "none" }) + person(100, 72) + Pa("M84 102 h10 M106 102 h10", { c: MUT, w: 3 }) + coin(140, 110, 7) + Pa("M58 104 q6 8 0 14", { c: MUT, w: 2.5 });
I.position = () => [0, 1, 2].map((r) => [0, 1, 2].map((cc) => Ci(64 + cc * 36, 48 + r * 30, 3, { f: MUT, c: "none" })).join("")).join("") + Ci(136, 78, 11, { f: A, c: "none" }) + Ci(136, 78, 19, { c: A, w: 2.5, extra: 'stroke-dasharray="4 5"' });
I.price = () => Pa("M64 44 H116 L132 60 V92 L96 122 L52 84 Z", { f: "#fdf3c0", c: A, w: 3 }) + Ci(78, 60, 5, { c: A, w: 2.5 }) + Li(86, 78, 110, 78, { c: A, w: 3 }) + Li(86, 92, 104, 92, { c: A, w: 3 });
I.print = () => Re(56, 64, 88, 36, { f: "#8b95a0", c: INK, rx: 6 }) + g(Re(72, 40, 56, 28, { f: "#fff", rx: 2 }) + animT("translate", "0 0;0 22;0 0", "1.8s")) + Re(72, 104, 56, 22, { f: "#fff", rx: 2 }) + [110, 116].map((y) => Li(80, y, 120, y, { c: MUT, w: 2.5 })).join("");
I.process = () => [50, 100, 150].map((x, i2) => Ci(x, 76, 13, { f: i2 === 2 ? G : SOFT, c: INK, w: 2.5 })).join("") + arrow(64, 76, 86, 76, { c: A, w: 3.5 }) + arrow(114, 76, 136, 76, { c: A, w: 3.5 }) + check(150, 76, 0.5, "#fff");
I.produce = () => Re(48, 56, 44, 40, { f: "#cfc8bb", c: INK, rx: 4 }) + gearSpin(70, 76, 9, "3s") + arrow(96, 76, 124, 76, { c: A, w: 4 }) + g(Re(130, 60, 32, 32, { f: "#e8c969", c: A, rx: 4 }) + animT("translate", "-8 0;6 0;-8 0", "1.8s"));
I.profit = () => [0, 1, 2, 3].map((i2) => Re(52 + i2 * 26, 108 - (i2 + 1) * 16, 18, (i2 + 1) * 16, { f: i2 === 3 ? "#e8c969" : SOFT, c: INK, rx: 2 })).join("") + arrow(56, 56, 148, 30, { c: G, w: 4 }) + coin(160, 96, 9);
I.property = () => Pa("M64 76 L100 48 L136 76 V112 H64 Z", { f: "#fff", c: INK, w: 3 }) + Re(92, 88, 16, 24, { f: SOFT, c: INK, w: 2 }) + Pa("M44 120 H156", { c: MUT, w: 3 }) + Ci(148, 54, 7, { c: A, w: 3 }) + Li(148, 61, 148, 74, { c: A, w: 3 }) + Li(148, 68, 154, 68, { c: A, w: 2.5 });
I.prose = () => doc(56, 32, 88, 90, 0) + [48, 60, 72, 84, 96].map((y, i2) => Li(66, y, i2 === 4 ? 100 : 134, y, { c: MUT, w: 3 })).join("");
I.punishment = () => Pa("M76 56 L108 88", { c: "#9a6b3f", w: 7 }) + Re(98, 78, 30, 22, { f: "#8b6f4f", c: A, rx: 3, extra: `transform="rotate(45 113 89)"` }) + Re(56, 108, 88, 10, { f: SOFT, c: INK, rx: 2 }) + cross(152, 52, 0.7);
I.purpose = () => Ci(120, 70, 30, { c: INK, w: 3 }) + Ci(120, 70, 19, { c: INK, w: 2.5 }) + Ci(120, 70, 8, { f: R, c: "none" }) + g(arrow(40, 110, 108, 78, { c: A, w: 4 }) + animT("translate", "-6 4;4 -2;-6 4", "1.3s"));
I.question = () => qmark(100, 66, 1.5) + Re(56, 36, 88, 80, { c: MUT, w: 2.5, rx: 10, extra: 'stroke-dasharray="6 6"' });
I.quite = () => Pa("M44 108 A56 56 0 0 1 156 108", { c: SOFT, w: 10 }) + Pa("M44 108 A56 56 0 0 1 140 68", { c: A, w: 10 }) + Li(100, 108, 132, 64, { c: INK, w: 4 }) + Ci(100, 108, 5, { f: INK, c: "none" });
I.ray = () => sun(60, 56, 13) + g(Li(78, 68, 150, 110, { c: "#f2c233", w: 5 }) + anim("opacity", "0.5;1;0.5", "1.2s")) + Pa("M142 116 l14 -2 -6 -12", { f: "#f2c233", c: "none" });
I.reaction = () => g(Ci(64, 76, 12, { f: A, c: "none" }) + animT("translate", "0 0;24 0;0 0", "1.2s")) + g(Ci(124, 76, 12, { f: BL, c: "none" }) + animT("translate", "0 0;24 0;0 0", "1.2s")) + Pa("M88 56 l6 8 M88 96 l6 -8", { c: MUT, w: 2.5 });
I.reading = () => Pa("M100 56 Q76 44 52 50 V104 Q76 98 100 110 Q124 98 148 104 V50 Q124 44 100 56 Z M100 56 V110", { f: "#fff", c: INK, w: 3 }) + [62, 74, 86].map((y) => Li(62, y, 90, y - 2, { c: MUT, w: 2 }) + Li(110, y - 2, 138, y, { c: MUT, w: 2 })).join("");
I.reason = () => Ci(70, 60, 20, { f: "#fdf3c0", c: A, w: 3 }) + Li(70, 84, 70, 94, { c: A, w: 3 }) + arrow(94, 76, 120, 76, { c: INK, w: 3 }) + Ci(140, 76, 12, { f: SOFT, c: INK, w: 2.5 }) + check(140, 76, 0.45);
I.record = () => Ci(90, 76, 34, { f: "#332e29", c: "none" }) + Ci(90, 76, 22, { c: "#5a544c", w: 1.5 }) + Ci(90, 76, 13, { c: "#5a544c", w: 1.5 }) + Ci(90, 76, 5, { f: "#c44", c: "none" }) + g(Li(132, 48, 148, 76, { w: 3 }) + Ci(148, 80, 4, { f: INK, c: "none" }));
I.relation = () => Ci(64, 60, 13, { f: SOFT, c: INK }) + Ci(136, 60, 13, { f: SOFT, c: INK }) + Ci(100, 104, 13, { f: "#e8c969", c: A }) + Li(74, 68, 92, 96, { c: MUT, w: 3 }) + Li(126, 68, 108, 96, { c: MUT, w: 3 }) + Li(77, 60, 123, 60, { c: MUT, w: 3 });
I.religion = () => [56, 84, 112, 140].map((x) => Li(x, 60, x, 108, { w: 4 })).join("") + Pa("M44 60 L100 36 L156 60 Z", { f: "#fff", c: INK, w: 3 }) + Li(40, 112, 160, 112, { w: 4 }) + star(100, 50, 0.4);
I.request = () => bubble(52, 40, 64, 40) + qmark(84, 60, 0.55, INK) + Pa("M124 96 Q142 84 160 92", { c: A, w: 4 }) + Pa("M124 96 q-2 8 6 10", { c: A, w: 3 });
I.respect = () => person(124, 64, 0.85, A) + Ci(68, 64, 9) + Pa("M68 73 Q68 88 80 94 M68 80 L56 92 M68 80 L80 92", { w: 3 }) + Pa("M56 104 q12 8 24 0", { c: MUT, w: 2.5 });
I.rest = () => Pa("M48 96 H152 V108 H48 Z", { f: SOFT, c: INK, w: 2.5 }) + Re(56, 84, 28, 12, { f: "#fff", c: INK, w: 2.5, rx: 5 }) + Pa("M88 96 Q88 80 110 80 H140 Q152 80 152 96", { f: "#d8c8e8", c: P, w: 2.5 }) + Pa("M132 40 a10 10 0 1 0 4 18 a13 13 0 0 1 -4 -18", { f: INK, c: "none" });
I.reward = () => Pa("M76 40 H124 V64 Q124 88 100 88 Q76 88 76 64 Z", { f: "#f2c233", c: A, w: 3 }) + Pa("M76 48 H62 Q60 68 76 70 M124 48 H138 Q140 68 124 70", { c: A, w: 3 }) + Re(90, 96, 20, 10, { f: A, c: "none", rx: 2 }) + Li(100, 88, 100, 96, { c: A, w: 4 }) + star(100, 60, 0.5, "#fff");
I.science = () => Pa("M88 36 V60 L64 104 Q60 114 72 114 H128 Q140 114 136 104 L112 60 V36", { f: "#fff", c: INK, w: 3 }) + Li(80, 36, 120, 36, { w: 4 }) + Ci(100, 92, 5, { f: BL, c: "none" }) + `<ellipse cx="100" cy="92" rx="20" ry="8" fill="none" stroke="${BL}" stroke-width="2" transform="rotate(30 100 92)"/><ellipse cx="100" cy="92" rx="20" ry="8" fill="none" stroke="${BL}" stroke-width="2" transform="rotate(-30 100 92)"/>`;
I.selection = () => [[64, 60], [100, 60], [136, 60], [82, 96], [118, 96]].map(([x, y], i2) => Ci(x, y, 11, { f: i2 === 1 ? A : SOFT, c: INK, w: 2.5 })).join("") + Pa("M100 36 L100 46", { c: A, w: 3 }) + Pa("M93 40 L100 48 L107 40", { c: A, w: 3 });
I.sense = () => Ci(100, 76, 9, { f: A, c: "none" }) + [["M56 48 a22 14 0 0 1 30 8", "眼"], ["M140 44 q10 10 2 22", "耳"], ["M64 108 q8 -10 18 -4", "手"]].map(([d]) => Pa(d, { c: BL, w: 3.5 })).join("") + [[70, 56], [138, 58], [76, 104]].map(([x, y]) => g(Li(x, y, 100 - (100 - x) * 0.3, 76 - (76 - y) * 0.3, { c: MUT, w: 2, dash: "3 4" }) + anim("opacity", "0.3;1;0.3", "1.6s"))).join("");
I.separate = () => Ci(64, 76, 16, { f: SOFT, c: INK }) + Ci(136, 76, 16, { f: SOFT, c: INK }) + Li(100, 40, 100, 112, { c: R, w: 4, dash: "8 6" }) + arrow(84, 76, 60, 76, { c: "none", w: 0.1 }) + g(arrow(92, 104, 72, 104, { c: A, w: 3 })) + g(arrow(108, 104, 128, 104, { c: A, w: 3 }));
I.shade = () => sun(60, 40, 11) + Pa("M104 48 Q140 48 148 78 Q124 70 104 78 Z", { f: G, c: "none" }) + Li(126, 60, 126, 110, { c: A, w: 4 }) + `<ellipse cx="126" cy="114" rx="30" ry="7" fill="#cdc5b6"/>`;
I.sign = () => Li(100, 44, 100, 118, { c: "#9a6b3f", w: 5 }) + Pa("M100 44 H148 L160 56 L148 68 H100 Z", { f: A, c: "none" }) + Pa("M100 76 H60 L48 88 L60 100 H100 Z", { f: BL, c: "none" }) + arrow(112, 56, 140, 56, { c: "#fff", w: 3 }) + arrow(88, 88, 62, 88, { c: "#fff", w: 3 });
I.simple = () => Ci(72, 76, 22, { f: "none", c: G, w: 4.5 }) + Pa("M116 56 q14 14 0 22 q-12 8 2 18 q12 8 0 16 M132 50 q-12 10 2 20 q12 8 -2 18 q-10 8 4 16", { c: MUT, w: 2.5 });
I.smell = () => Pa("M96 44 Q108 60 104 76 Q100 88 108 94", { c: A, w: 4 }) + [126, 142].map((x, i2) => g(Pa(`M${x} 56 q8 12 0 26 q-6 12 2 22`, { c: MUT, w: 3 }) + anim("opacity", "0.2;1;0.2", `${1.4 + i2 * 0.4}s`) + animT("translate", "0 0;-8 -6;0 0", `${1.4 + i2 * 0.4}s`))).join("") + Ci(96, 100, 3, { f: A, c: "none" });
I.so = () => Ci(56, 60, 12, { f: SOFT, c: INK, w: 2.5 }) + arrow(72, 66, 116, 88, { c: A, w: 4 }) + Ci(132, 96, 12, { f: "#e8c969", c: A, w: 2.5 }) + Pa("M52 36 l8 8 M68 36 l-8 8", { c: "none", w: 1 });
I.some = () => [0, 1, 2, 3].map((cc) => Ci(56 + cc * 30, 56, 9, { f: cc < 2 ? A : "none", c: cc < 2 ? "none" : MUT, w: 2.5 })).join("") + [0, 1, 2, 3].map((cc) => Ci(56 + cc * 30, 96, 9, { f: cc === 0 ? A : "none", c: cc === 0 ? "none" : MUT, w: 2.5 })).join("");
I.song = () => g(note8(72, 84, 1, A) + animT("translate", "0 0;0 -8;0 0", "1.4s")) + g(note8(108, 72, 0.8, BL) + animT("translate", "0 0;0 -12;0 0", "1.8s")) + g(note8(136, 92, 0.7, G) + animT("translate", "0 0;0 -6;0 0", "1.1s")) + wave(52, 112, 96, 4, MUT, 2.5);
I.sort = () => Re(48, 56, 22, 22, { f: R, c: "none", rx: 3 }) + Ci(59, 104, 11, { f: R, c: "none" }) + Re(90, 56, 22, 22, { f: BL, c: "none", rx: 3 }) + Re(90, 94, 22, 22, { f: BL, c: "none", rx: 3 }) + Ci(143, 67, 11, { f: G, c: "none" }) + Pa("M132 94 h22 l-11 20 Z", { f: G, c: "none" }) + Li(79, 44, 79, 122, { c: MUT, w: 2, dash: "4 5" }) + Li(122, 44, 122, 122, { c: MUT, w: 2, dash: "4 5" });
I.space = () => Re(52, 40, 96, 72, { c: MUT, w: 2.5, rx: 8, extra: 'stroke-dasharray="6 6"' }) + arrow(60, 76, 88, 76, { c: A, w: 2.5 }) + arrow(140, 76, 112, 76, { c: A, w: 2.5 }) + arrow(100, 48, 100, 64, { c: A, w: 2.5 }) + arrow(100, 104, 100, 88, { c: A, w: 2.5 });
I.stage = () => Re(48, 88, 104, 24, { f: "#9a6b3f", c: A, rx: 3 }) + Pa("M48 36 Q100 52 152 36 V56 Q100 72 48 56 Z", { f: "#a3325a", c: R, w: 2.5 }) + person(100, 72, 0.55) + g(Li(70, 28, 86, 56, { c: "#f2c233", w: 3 }) + anim("opacity", "0.3;1;0.3", "1.5s"));
I.start = () => Li(56, 36, 56, 118, { w: 4 }) + Pa("M56 36 H110 L98 50 L110 64 H56 Z", { f: G, c: "none" }) + g(arrow(72, 96, 150, 96, { c: A, w: 4.5 }) + anim("opacity", "0.4;1;0.4", "1s"));
I.statement = () => bubble(48, 40, 72, 44) + [58, 70].map((y) => Li(62, y + 0, 108, y, { c: MUT, w: 3 })).join("") + Li(62, 82, 90, 82, { c: MUT, w: 3 }) + Ci(146, 60, 13, { f: G, c: "none" }) + check(146, 60, 0.5, "#fff");
I.still = () => Pa("M100 44 V92", { w: 3 }) + Ci(100, 102, 10, { f: A, c: "none" }) + Pa("M64 56 Q56 64 64 72 M136 56 Q144 64 136 72", { c: MUT, w: 2.5, dash: "3 4" }) + cross(64, 100, 0.5, MUT) + cross(136, 100, 0.5, MUT) + Li(60, 124, 140, 124, { c: MUT });
I.stitch = () => Pa("M48 76 Q100 60 152 76", { c: "none", w: 1 }) + Re(48, 60, 104, 40, { f: "#cfe0ee", c: BL, rx: 4 }) + Pa("M60 80 h12 M84 80 h12 M108 80 h12 M132 80 h12", { c: R, w: 3 }) + Pa("M148 52 L120 64", { c: "#8b95a0", w: 2.5 }) + Pa("M148 52 l4 -8 M148 52 l-2 9", { c: "#8b95a0", w: 2 }) + Ci(150, 44, 2, { f: INK, c: "none" });
I.stop = () => Pa("M82 40 H118 L144 66 V102 L118 128 H82 L56 102 V66 Z", { f: R, c: "none" }) + Pa("M76 70 q0 -10 12 -8 M88 84 v22 M104 62 v44 M120 70 q8 0 8 8 q0 8 -8 8", { c: "#fff", w: 5 });
I.story = () => Pa("M100 56 Q76 44 52 50 V104 Q76 98 100 110 Q124 98 148 104 V50 Q124 44 100 56 Z M100 56 V110", { f: "#fff", c: INK, w: 3 }) + star(76, 72, 0.45, A) + Pa("M112 66 q10 -8 20 0 M112 80 h24", { c: MUT, w: 2.5 });
I.strange = () => [[56, 72], [92, 72], [164, 72]].map(([x, y], i2) => i2 === 2 ? "" : Ci(x, y, 13, { f: SOFT, c: INK, w: 2.5 })).join("") + Pa("M128 58 q16 -10 24 4 q6 12 -8 18 q-10 4 -8 14", { c: P, w: 4 }) + Ci(136, 102, 3, { f: P, c: "none" }) + qmark(166, 50, 0.5, P);
I.substance = () => Pa("M100 40 L136 58 V94 L100 112 L64 94 V58 Z", { f: "#dfe5ea", c: INK, w: 3 }) + [[88, 70], [108, 64], [98, 84], [112, 88], [84, 88]].map(([x, y]) => Ci(x, y, 3, { f: BL, c: "none" })).join("");
I.such = () => Re(48, 48, 36, 36, { f: A, c: "none", rx: 5 }) + arrow(92, 66, 112, 66, { c: MUT, w: 3 }) + Re(120, 48, 28, 28, { f: "none", c: A, w: 3, rx: 4 }) + Re(132, 84, 28, 28, { f: "none", c: A, w: 3, rx: 4 }) + Re(100, 92, 24, 24, { f: "none", c: A, w: 3, rx: 4 });
I.suggestion = () => Ci(80, 60, 20, { f: "#fdf3c0", c: A, w: 3 }) + Li(80, 84, 80, 92, { c: A, w: 3 }) + bubble(108, 48, 48, 32, true) + g(arrow(102, 64, 112, 60, { c: MUT, w: 2.5 }) + anim("opacity", "0.4;1;0.4", "1.4s"));
I.system = () => gearSpin(72, 60, 14, "3.5s") + gearSpin(124, 56, 10, "2.5s") + gearSpin(98, 100, 12, "3s") + Li(86, 68, 92, 90, { c: MUT, w: 2.5 }) + Li(114, 62, 104, 90, { c: MUT, w: 2.5 }) + Li(86, 58, 112, 56, { c: MUT, w: 2.5 });
I.taste = () => Pa("M64 60 Q64 44 100 44 Q136 44 136 60 Q136 84 118 86 Q112 104 100 104 Q88 104 82 86 Q64 84 64 60 Z", { f: "#e88a9a", c: R, w: 3 }) + Li(100, 56, 100, 92, { c: "#c45a6a", w: 2.5 }) + [[84, 64], [116, 64], [100, 76]].map(([x, y]) => g(Ci(x, y, 3.5, { f: "#fff", c: "none" }) + anim("opacity", "0.4;1;0.4", "1.5s"))).join("");
I.tax = () => coin(64, 56, 10) + coin(64, 78, 10) + coin(64, 100, 10) + arrow(84, 72, 116, 72, { c: R, w: 4 }) + Pa("M120 88 H160 M124 88 V60 L140 50 L156 60 V88", { f: "#fff", c: INK, w: 2.5 }) + Li(132, 70, 132, 88, { w: 2 }) + Li(148, 70, 148, 88, { w: 2 });
I.teaching = () => person(64, 64, 0.8) + Re(96, 40, 60, 44, { f: "#3d4a3e", c: INK, rx: 3 }) + Pa("M106 56 h40 M106 68 h28", { c: "#fff", w: 2.5 }) + Pa("M80 70 L96 60", { c: A, w: 3 }) + person(70, 110, 0.45) + person(98, 112, 0.45) + person(126, 110, 0.45);
I.tendency = () => Pa("M44 108 L80 92 L108 98 L144 60", { c: A, w: 4 }) + arrow(144, 60, 160, 44, { c: A, w: 4 }) + [44, 80, 108].map((x, i2) => Ci(x, [108, 92, 98][i2], 4, { f: INK, c: "none" })).join("") + Li(40, 116, 164, 116, { c: MUT, w: 2.5 });
I.test = () => doc(60, 32, 80, 92, 0) + [[78, 56], [78, 76], [78, 96]].map(([x, y], i2) => Re(x - 6, y - 6, 12, 12, { c: INK, w: 2, rx: 2 }) + (i2 < 2 ? check(x, y, 0.4) : cross(x, y, 0.4))).join("") + [92, 72].map((y, i2) => Li(94, [56, 76][i2], 126, [56, 76][i2], { c: MUT, w: 2.5 })).join("") + Li(94, 96, 126, 96, { c: MUT, w: 2.5 });
I.that = () => person(56, 92, 0.7) + Pa("M74 74 L106 60", { c: A, w: 3.5 }) + Ci(140, 52, 11, { f: A, c: "none" }) + Pa("M120 110 q20 -10 40 0", { c: MUT, w: 2.5, dash: "4 5" });
I.this = () => person(60, 92, 0.7) + Pa("M78 78 L92 76", { c: A, w: 3.5 }) + Ci(106, 76, 11, { f: A, c: "none" }) + Ci(106, 76, 19, { c: A, w: 2.5, extra: 'stroke-dasharray="4 5"' });
I.the = () => [[56, 60], [100, 52], [144, 60], [78, 96], [122, 96]].map(([x, y], i2) => Ci(x, y, 9, { f: i2 === 1 ? A : "none", c: i2 === 1 ? "none" : MUT, w: 2.5 })).join("") + Ci(100, 52, 17, { c: A, w: 3 }) + arrow(100, 20, 100, 32, { c: A, w: 3 });
I.theory = () => Ci(76, 56, 18, { f: "#fdf3c0", c: A, w: 3 }) + Li(76, 78, 76, 86, { c: A, w: 3 }) + [[120, 48], [148, 64], [132, 92]].map(([x, y]) => Ci(x, y, 6, { f: SOFT, c: INK, w: 2.5 })).join("") + Pa("M94 60 L114 50 M148 70 L138 86 M120 54 L144 60", { c: MUT, w: 2, dash: "4 4" }) + qmark(160, 100, 0.5, MUT);
I.thing = () => Pa("M100 40 L134 58 V96 L100 114 L66 96 V58 Z", { f: "#fff", c: INK, w: 3 }) + Pa("M66 58 L100 76 L134 58 M100 76 V114", { c: INK, w: 2 });
I.though = () => Li(40, 76, 88, 76, { c: A, w: 4 }) + Li(100, 56, 100, 96, { c: R, w: 5 }) + Pa("M88 76 Q94 50 112 48 Q128 48 132 62", { c: A, w: 4, dash: "2 0" }) + arrow(132, 62, 156, 76, { c: A, w: 4 });
I.trouble = () => Pa("M70 96 Q56 84 64 68 Q52 60 64 48 Q60 34 78 36 Q84 24 98 32 Q112 24 118 36 Q136 34 132 50 Q144 60 132 70 Q140 84 124 92 Q120 104 104 100 Q92 110 82 100 Q72 104 70 96 Z", { f: "#e8e2d6", c: INK, w: 2.5 }) + Pa("M86 56 q14 18 -2 26 M112 54 q-12 16 4 26", { c: R, w: 3 }) + Li(100, 36, 100, 24, { c: R, w: 4 });
I.unit = () => [0, 1, 2, 3, 4].map((i2) => Re(46 + i2 * 23, 64, 17, 24, { f: i2 === 0 ? A : "none", c: i2 === 0 ? "none" : MUT, w: 2.5, rx: 3 })).join("") + Pa("M46 100 h17", { c: A, w: 3 }) + Pa("M46 108 q8 6 17 0", { c: "none", w: 1 });
I.use = () => Pa("M64 96 L100 60", { c: "#9a6b3f", w: 6 }) + g(Re(92, 50, 26, 20, { f: "#8b8b8b", c: INK, rx: 3, extra: `transform="rotate(45 105 60)"` }) + animT("rotate", "-14 64 96;10 64 96;-14 64 96", "1s")) + Li(108, 108, 148, 108, { c: A, w: 4 }) + Pa("M124 100 l8 8 -8 8", { c: A, w: 3 });
I.value = () => Pa("M100 36 L128 56 L116 92 H84 L72 56 Z", { f: "#cfe0ee", c: BL, w: 3 }) + Pa("M100 36 L100 92 M72 56 L128 56", { c: BL, w: 1.8 }) + star(100, 70, 0.5, BL) + Pa("M64 108 h72", { c: MUT, w: 3 });
I.verse = () => doc(56, 32, 88, 90, 0) + [48, 58, 68].map((y) => Li(70, y, 122, y, { c: MUT, w: 2.5 })).join("") + [84, 94, 104].map((y) => Li(70, y, 116, y, { c: MUT, w: 2.5 })).join("") + note8(136, 60, 0.6, A);
I.very = () => Pa("M44 104 A56 56 0 0 1 156 104", { c: SOFT, w: 11 }) + Pa("M44 104 A56 56 0 0 1 152 90", { c: R, w: 11 }) + g(Li(100, 104, 144, 76, { c: INK, w: 4 }) + animT("rotate", "-6 100 104;4 100 104;-6 100 104", "0.8s")) + Ci(100, 104, 5, { f: INK, c: "none" });
I.way = () => Pa("M60 118 Q72 84 100 76 Q132 68 140 36", { c: "#8a8378", w: 14 }) + Pa("M60 118 Q72 84 100 76 Q132 68 140 36", { c: "#fff", w: 2.5, dash: "7 8" }) + Ci(60, 118, 6, { f: G, c: "none" }) + Pa("M140 22 V44 L154 36 Z", { f: R, c: "none" });
I.where = () => Pa("M100 36 Q126 36 126 64 Q126 84 100 112 Q74 84 74 64 Q74 36 100 36 Z", { f: "none", c: A, w: 4 }) + qmark(100, 64, 0.7);
I.why = () => qmark(80, 64, 1.2) + gearSpin(136, 96, 11, "3.5s") + Pa("M104 88 q12 6 20 4", { c: MUT, w: 2.5, dash: "3 4" });
I.wound = () => Pa("M64 56 Q64 40 84 40 H116 Q136 40 136 56 V96 Q136 112 116 112 H84 Q64 112 64 96 Z", { f: "#f0cfae", c: A, w: 3 }) + Pa("M88 64 L112 88 M112 64 L88 88", { c: "none", w: 1 }) + Re(78, 64, 44, 24, { f: "#fff", c: INK, w: 2, rx: 4, extra: `transform="rotate(-18 100 76)"` }) + Pa("M92 70 l16 12", { c: R, w: 2.5, extra: `transform="rotate(-18 100 76)"` });
I.yes = () => Ci(100, 74, 38, { c: G, w: 6 }) + check(100, 76, 1.3);
I.and = () => Ci(70, 64, 13, { f: SOFT, c: INK, w: 2.5 }) + Ci(130, 64, 13, { f: SOFT, c: INK, w: 2.5 }) + Pa("M70 84 Q70 104 100 104 Q130 104 130 84", { c: A, w: 4 }) + Pa("M92 56 h16 M100 48 v16", { c: A, w: 3.5 });
I.but = () => arrow(40, 76, 92, 76, { c: A, w: 4.5 }) + Li(104, 52, 104, 100, { c: R, w: 5 }) + arrow(116, 96, 156, 60, { c: BL, w: 4.5 });
I.because = () => Ci(64, 56, 12, { f: "#e8c969", c: A, w: 2.5 }) + arrow(80, 64, 116, 88, { c: A, w: 4 }) + Ci(132, 96, 12, { f: SOFT, c: INK, w: 2.5 }) + Pa("M48 40 q-4 -10 6 -12 M58 36 q0 -8 8 -8", { c: MUT, w: 2.5 });
I.behavior = () => person(76, 68, 0.85) + Pa("M96 80 Q116 72 128 84 Q140 96 156 92", { c: A, w: 3.5, dash: "6 5" }) + [[100, 78], [128, 84], [152, 92]].map(([x, y]) => Ci(x, y, 3.5, { f: A, c: "none" })).join("") + Pa("M58 108 q18 10 36 0", { c: MUT, w: 2.5 });
I.all = () => [0, 1, 2].map((r) => [0, 1, 2, 3].map((cc) => Ci(58 + cc * 28, 50 + r * 28, 9, { f: A, c: "none" })).join("")).join("") + Ci(100, 78, 62, { c: MUT, w: 2.5, extra: 'stroke-dasharray="6 7"' });
I.almost = () => Pa("M44 96 A56 56 0 0 1 148 72", { c: A, w: 9 }) + Pa("M148 72 A56 56 0 0 1 156 96", { c: SOFT, w: 9 }) + arrow(120, 36, 142, 56, { c: A, w: 3 }) + Ci(156, 96, 6, { f: R, c: "none" });
I.any = () => [[60, 56], [100, 56], [140, 56], [80, 96], [120, 96]].map(([x, y]) => Ci(x, y, 10, { c: MUT, w: 2.5 })).join("") + g(Ci(100, 56, 10, { f: A, c: "none" }) + anim("opacity", "1;0.3;1", "1.2s")) + qmark(166, 104, 0.5, MUT);
I.only = () => Ci(100, 72, 13, { f: A, c: "none" }) + Pa("M100 38 L100 50", { c: A, w: 3 }) + Ci(100, 72, 26, { c: A, w: 2.5, extra: 'stroke-dasharray="5 6"' }) + [[52, 100], [148, 100], [60, 48], [140, 48]].map(([x, y]) => cross(x, y, 0.4, MUT)).join("");

I.bad = () => Ci(100, 72, 36, { c: R, w: 5 }) + Pa("M84 96 Q100 84 116 96", { c: R, w: 4 }) + Ci(86, 64, 3.5, { f: R, c: "none" }) + Ci(114, 64, 3.5, { f: R, c: "none" }) + cross(152, 40, 0.7);
I.direction = () => Ci(100, 76, 40, { c: INK, w: 3.5 }) + Pa("M100 44 L108 72 L100 68 L92 72 Z", { f: R, c: "none" }) + Pa("M100 108 L92 80 L100 84 L108 80 Z", { f: SOFT, c: INK, w: 2 }) + [[100, 32], [100, 120], [56, 76], [144, 76]].map(([x, y]) => Ci(x, y, 2.5, { f: INK, c: "none" })).join("");

/* ════════ 主流程 ════════ */
const ALIASES = { behaviour: "behavior", colour: "color", harbour: "harbor", humour: "humor" };

let written = 0;
for (const [word, fn] of Object.entries(I)) {
  writeFileSync(join(OUT, `${word}.svg`), wrap(fn()));
  written++;
}
for (const [alias, canon] of Object.entries(ALIASES)) {
  if (I[canon]) {
    copyFileSync(join(OUT, `${canon}.svg`), join(OUT, `${alias}.svg`));
    written++;
  }
}
console.log(`semantic svgs written: ${written}`);

/* 校验：还有哪些文本框 SVG 未覆盖 */
import { readdirSync, readFileSync } from "fs";
const leftover = readdirSync(OUT)
  .filter((f) => f.endsWith(".svg"))
  .filter((f) => readFileSync(join(OUT, f), "utf8").includes("Georgia,serif"))
  .map((f) => f.replace(".svg", ""));
console.log(`remaining text-box svgs: ${leftover.length}`);
if (leftover.length) console.log(leftover.join(" "));

