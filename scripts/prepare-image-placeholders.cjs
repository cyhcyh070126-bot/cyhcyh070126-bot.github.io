// Embed tiny previews so a cold image request never starts as an empty white frame.
// Usage: node scripts/prepare-image-placeholders.cjs [path-to-sharp]
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const root = path.join(__dirname, '..');
(async () => {
  const cvPath = path.join(root, '_pages/cv.md');
  let cv = fs.readFileSync(cvPath, 'utf8');
  const previews = {};
  const images = [...new Set([...cv.matchAll(/<img\b[^>]*src="(\/images\/research\/[^\"]+)"[^>]*>/g)].map(m => m[1]))];
  let bytes = 0;
  for (const src of images) {
    const preview = await sharp(path.join(root, src), { animated: false }).resize({ width: 120, height: 90, fit: 'inside', withoutEnlargement: true }).webp({ quality: 45, effort: 4 }).toBuffer();
    bytes += preview.length;
    previews[src] = 'data:image/webp;base64,' + preview.toString('base64');
  }
  cv = cv.replace(/<img\b[^>]*src="(\/images\/research\/[^\"]+)"[^>]*>/g, (tag, src) => {
    tag = tag.replace(/ style="[^"]*"/g, '');
    return tag.replace(/\s*\/?\s*>$/, ` style="background-image:url('${previews[src]}');background-size:contain;background-position:center;background-repeat:no-repeat" />`);
  });
  fs.writeFileSync(cvPath, cv);
  fs.writeFileSync(path.join(root, '_data/image_previews.json'), JSON.stringify(previews));
  console.log(JSON.stringify({ images: images.length, previewBytes: bytes, htmlBase64Bytes: Math.ceil(bytes * 4 / 3) }));
})();
