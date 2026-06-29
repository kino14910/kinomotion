import sharp from 'sharp'
import { readdir, stat, mkdir } from 'node:fs/promises'
import { join, dirname, basename, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = join(__dirname, '..', 'public', 'assets')

const tasks = [
  // Hero background — full-width, keep quality
  { src: 'hero-image.png', maxWidth: 1920, quality: 80 },
  // Poker card back
  { src: 'pokers/poker-back.jpg', maxWidth: 640, quality: 80 },
  // Avatar
  { src: 'QQAvatar.jpg', maxWidth: 420, quality: 80 },
]

// Poker face cards poker0–poker9
for (let i = 0; i <= 9; i++) {
  tasks.push({ src: `pokers/poker${i}.jpg`, maxWidth: 640, quality: 80 })
}

// Responsive variants for poker images (displayed ~240px desktop, ~160px mobile)
for (const w of [480, 320]) {
  for (let i = 0; i <= 9; i++) {
    tasks.push({ src: `pokers/poker${i}.jpg`, maxWidth: w, quality: 80, suffix: `${w}w` })
  }
  tasks.push({ src: 'pokers/poker-back.jpg', maxWidth: w, quality: 80, suffix: `${w}w` })
}

async function convert({ src, maxWidth, quality, suffix }) {
  const inputPath = join(ASSETS, src)
  const name = basename(src, extname(src))
  const dir = dirname(inputPath)
  const outName = suffix ? `${name}-${suffix}.webp` : `${name}.webp`
  const outPath = join(dir, outName)

  try {
    const inputStat = await stat(inputPath)
    try {
      const outputStat = await stat(outPath)
      if (outputStat.mtimeMs >= inputStat.mtimeMs) {
        console.log(`  skip ${src} (up to date)`)
        return
      }
    } catch {
      // output doesn't exist — proceed
    }
  } catch {
    console.warn(`  warn: ${src} not found, skipping`)
    return
  }

  const image = sharp(inputPath)
  const metadata = await image.metadata()

  let pipeline = image.resize({
    width: metadata.width > maxWidth ? maxWidth : undefined,
    withoutEnlargement: true,
  })

  pipeline = pipeline.webp({ quality })

  await mkdir(dir, { recursive: true })
  const info = await pipeline.toFile(outPath)

  const inputKB = (await stat(inputPath)).size / 1024
  const outputKB = info.size / 1024
  const pct = ((1 - outputKB / inputKB) * 100).toFixed(0)
  console.log(
    `  ${src} → ${outName}  ${inputKB.toFixed(0)}KB → ${outputKB.toFixed(0)}KB  (-${pct}%)`,
  )
}

console.log('Optimizing images...')
await Promise.all(tasks.map(convert))
console.log('Done.')
