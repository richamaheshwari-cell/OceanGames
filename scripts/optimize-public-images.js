/**
 * One-off script: compress images in public/ to reduce load time.
 * Uses quality 85 WebP to avoid visible loss. Run: node scripts/optimize-public-images.js
 */

const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const PUBLIC = path.join(__dirname, "..", "public");

async function run() {
  // og.webp: resize to standard OG size 1200x630, quality 85
  const ogPath = path.join(PUBLIC, "og.webp");
  if (fs.existsSync(ogPath)) {
    const before = fs.statSync(ogPath).size;
    await sharp(ogPath)
      .resize(1200, 630, { fit: "cover", position: "center" })
      .webp({ quality: 85 })
      .toFile(ogPath + ".tmp");
    fs.renameSync(ogPath + ".tmp", ogPath);
    const after = fs.statSync(ogPath).size;
  }

  // hero.webp: keep dimensions, re-encode at quality 85
  const heroPath = path.join(PUBLIC, "hero.webp");
  if (fs.existsSync(heroPath)) {
    const before = fs.statSync(heroPath).size;
    await sharp(heroPath)
      .webp({ quality: 85 })
      .toFile(heroPath + ".tmp");
    fs.renameSync(heroPath + ".tmp", heroPath);
    const after = fs.statSync(heroPath).size;
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
