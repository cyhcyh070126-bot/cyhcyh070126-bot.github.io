// Smaller lossless WebP display copies. Download links keep the original files.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const root = path.join(__dirname, '..');
(async () => {
  const cvPath = path.join(root, '_pages/cv.md');
  let cv = fs.readFileSync(cvPath, 'utf8');
  const sources = [...new Set([...cv.matchAll(/<img\b[^>]*src="(\/images\/research\/[^\"]+\.png)"/g)].map(m => m[1]))];
  const variants = {};
  const wide = /(?:composite_n100_mesh_overview|battery_prediction_summary|llm_finetuning_workflow_v2)\.png$/;
  const sizes = src => wide.test(src) ? '(max-width: 600px) calc(100vw - 64px), 1100px' : '(max-width: 600px) calc(100vw - 64px), (max-width: 1023px) 50vw, 600px';
  let before = 0, after = 0;
  for (const src of sources) {
    const input = path.join(root, src);
    const metadata = await sharp(input).metadata();
    const candidates = [];
    for (const width of [...new Set([640, 1280, 1920].map(w => Math.min(w, metadata.width)))]) {
      const relative = src.replace(/\.png$/, `.display-${width}.webp`);
      const buffer = await sharp(input).resize({width, withoutEnlargement:true}).webp({lossless:true, effort:6}).toBuffer();
      fs.writeFileSync(path.join(root, relative), buffer);
      candidates.push({src:relative, width, bytes:buffer.length});
    }
    variants[src] = {srcset:candidates.map(c=>`${c.src} ${c.width}w`).join(', '), sizes:sizes(src), candidates};
    const oldDisplay = input.replace(/\.png$/, '.webp');
    before += fs.existsSync(oldDisplay) ? fs.statSync(oldDisplay).size : fs.statSync(input).size;
    after += candidates.find(c=>c.width >= 1280)?.bytes || candidates.at(-1).bytes;
  }
  cv = cv.replace(/<source type="image\/webp" srcset="([^\"]+)"[^>]*\/>/g, (tag, old) => {
    const original = old.split(',')[0].trim().split(' ')[0].replace(/(?:\.display-\d+)?\.webp$/, '.png');
    if (!variants[original]) return tag;
    return `<source type="image/webp" srcset="${variants[original].srcset}" sizes="${variants[original].sizes}" />`;
  });
  const seal = '/images/schools/tongji-university-seal.png';
  const sealCopy = '/images/schools/tongji-university-seal-128.png';
  const sealBuffer = await sharp(path.join(root, seal)).resize({width:128}).png({compressionLevel:9}).toBuffer();
  fs.writeFileSync(path.join(root, sealCopy), sealBuffer);
  cv = cv.replace("'/images/schools/tongji-university-seal.png'", "'/images/schools/tongji-university-seal-128.png'");
  cv = cv.replace(/(class="cv-school__seal"[^>]+)(>)/g, (_, attrs) => attrs.replace(/\s(?:width|height|decoding|fetchpriority)="[^"]*"/g, '') + ' width="128" height="128" decoding="async" fetchpriority="high">');
  fs.writeFileSync(cvPath, cv);
  fs.writeFileSync(path.join(root, '_data/image_variants.json'), JSON.stringify(variants));
  const gallery = [...cv.matchAll(/<img\b[^>]*src="(\/images\/research\/[^\"]+)"/g)].map(m=>m[1]);
  const manifest = [
    {src:sealCopy}, {src:'/images/schools/johns-hopkins-university-shield.svg'},
    {src:'/assets/icons/huggingface.svg'},
    ...gallery.map(src=>({src, ...(variants[src] ? {srcset:variants[src].srcset, sizes:variants[src].sizes} : {})})),
    // Projects previews select a smaller candidate than the same figure in CV.
    ...['cylinder_subdomain_supports_1234.png', 'llm_finetuning_workflow_v2.png'].map(name=>{
      const src='/images/research/'+name;
      return {src,srcset:variants[src].srcset,sizes:'(max-width: 767px) calc(100vw - 64px), 320px'};
    })
  ];
  // Prepare each project's entry image first, then static figures, then animations.
  const seeds = ['cylinder_subdomain_supports_1234.png', 'battery_concentration.gif', 'pinn_shock_problem_framework_v8.svg', 'llm_finetuning_workflow_v2.png'];
  manifest.sort((a,b) => {
    const rank = item => !item.src.includes('/research/') ? 0 : seeds.some(s=>item.src.endsWith(s)) ? 1 : item.src.endsWith('.gif') ? 3 : 2;
    return rank(a)-rank(b);
  });
  fs.writeFileSync(path.join(root, '_data/navigation_images.json'), JSON.stringify(manifest));
  console.log(JSON.stringify({staticImages:sources.length, oldFullDisplayBytes:before, display1280Bytes:after,
    reductionPercent:Math.round((1-after/before)*100), sealBefore:fs.statSync(path.join(root,seal)).size, sealAfter:sealBuffer.length}));
})();
