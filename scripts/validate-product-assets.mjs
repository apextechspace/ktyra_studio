// Ensure featured product images have real WebP transparency before merging.
// Run: node scripts/validate-product-assets.mjs
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const groups = {
  'men/thobes': ['classic-thobe-pearl-white','classic-thobe-desert-sand','classic-thobe-midnight-navy','classic-thobe-graphite','classic-thobe-onyx-black'],
  'women/abayas': ['embroidered-abaya-onyx','embroidered-abaya-plum','embroidered-abaya-taupe','embroidered-abaya-emerald','embroidered-abaya-sand'],
  'women/hijabs': ['full-khimar-onyx','full-khimar-plum','full-khimar-taupe','full-khimar-emerald','full-khimar-sand']
};
let failures = 0, checked = 0;
for (const [folder, names] of Object.entries(groups)) {
  for (const name of names) {
    const file = `assets/products/${folder}/${name}.webp`;
    try {
      const bytes = readFileSync(resolve(file));
      const riff = bytes.toString('ascii',0,4)==='RIFF';
      const webp = bytes.toString('ascii',8,12)==='WEBP';
      const extended = bytes.toString('ascii',12,16)==='VP8X';
      const hasAlpha = extended && (bytes[20] & 0x10)!==0;
      if (!(riff && webp && hasAlpha)) {
        throw new Error('Not an alpha-enabled WebP. Background may be baked into the image.');
      }
      checked++;
      console.log('PASS',file);
    } catch (error) {
      failures++;
      console.error('FAIL',file,'—',error.message);
    }
  }
}
console.log(`\n${checked} product assets passed; ${failures} failed.`);
if (failures) process.exitCode = 1;
