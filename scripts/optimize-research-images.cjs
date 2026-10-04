// Usage: node scripts/optimize-research-images.cjs [path-to-sharp]
// Lossless display copies only. Original downloadable PNGs/PDFs are preserved.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const root = path.join(__dirname, '..');
const cv = fs.readFileSync(path.join(root, '_pages/cv.md'), 'utf8');
const images = [...new Set([...cv.matchAll(/<img\b[^>]*src="(\/images\/research\/[^\"]+\.png)"/g)].map(m => m[1]))];
(async () => {
  let before = 0, after = 0;
  const report = [];
  for (const src of images) {
    const input = path.join(root, src);
    const output = input.replace(/\.png$/, '.webp');
    const original = await sharp(input).ensureAlpha().raw().toBuffer();
    const encoded = await sharp(input).webp({ lossless: true, effort: 6 }).toBuffer();
    const decoded = await sharp(encoded).ensureAlpha().raw().toBuffer();
    if (!original.equals(decoded)) throw new Error('Pixel mismatch: ' + src);
    const size = fs.statSync(input).size;
    if (encoded.length >= size) continue;
    fs.writeFileSync(output, encoded);
    before += size;
    after += encoded.length;
    report.push({ src, before: size, after: encoded.length });
  }
  console.log(JSON.stringify({ before, after, reductionPercent: Math.round((1 - after / before) * 100), images: report }, null, 2));
})();
