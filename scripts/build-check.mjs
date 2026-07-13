import { readFile, access } from 'node:fs/promises';

const required = [
  'index.html',
  'styles.css',
  'script.js',
  'physics-model.mjs',
  'favicon.svg',
  'assets/social-preview.svg',
  'assets/social-preview.png',
  'facebook-post.txt'
];
await Promise.all(required.map((file) => access(file)));
const [html, css, js] = await Promise.all(required.slice(0, 3).map((file) => readFile(file, 'utf8')));
const failures = [];
if (!html.includes('lang="zh-Hant"')) failures.push('缺少繁體中文語系標示');
if (!html.includes('role="tablist"')) failures.push('缺少頁籤語意');
if (!html.includes('aria-live="polite"')) failures.push('缺少即時回饋區');
if (!css.includes('prefers-reduced-motion')) failures.push('缺少降低動畫支援');
if (!js.includes('computeTrainState')) failures.push('互動模型未連接物理狀態函式');
if (!html.includes('https://prayer168.github.io/electric-train/assets/social-preview.png')) failures.push('社群預覽圖未使用正式絕對網址');
if (!html.includes('twitter:card') || !html.includes('summary_large_image')) failures.push('缺少 Twitter large-image metadata');
for (const token of ['TODO', '待補', 'lorem ipsum']) {
  if (`${html}\n${css}\n${js}`.toLowerCase().includes(token.toLowerCase())) failures.push(`發現占位文字：${token}`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Build check passed: ${required.length} files, semantic tabs, live feedback, reduced motion, no placeholders.`);
