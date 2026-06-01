import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ttf2woff2 from 'ttf2woff2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, '../src/fonts');
const publicDir = path.resolve(__dirname, '../public/fonts');
const fontsourceDir = path.resolve(__dirname, '../node_modules/@fontsource/inter/files');

fs.mkdirSync(publicDir, { recursive: true });

const ttfFiles = [
  'ZtChablisSemiBold.ttf',
  'Involve-Regular.ttf',
  'Involve-Medium.ttf',
  'Involve-SemiBold.ttf',
];

const interFiles = [
  'inter-latin-400-normal.woff2',
  'inter-latin-600-normal.woff2',
  'inter-cyrillic-400-normal.woff2',
  'inter-cyrillic-600-normal.woff2',
];

for (const file of ttfFiles) {
  const input = path.join(srcDir, file);
  const name = file.replace('.ttf', '.woff2');
  const woff2 = ttf2woff2(fs.readFileSync(input));
  fs.writeFileSync(path.join(publicDir, name), woff2);
  const kb = (fs.statSync(path.join(publicDir, name)).size / 1024).toFixed(1);
  console.log(`${file} → ${name} (${kb} KB)`);
}

for (const file of interFiles) {
  const from = path.join(fontsourceDir, file);
  const to = path.join(publicDir, file);
  fs.copyFileSync(from, to);
  const kb = (fs.statSync(to).size / 1024).toFixed(1);
  console.log(`Inter: ${file} (${kb} KB)`);
}
