/**
 * Flattens the adaptive launcher icon that `capacitor-assets generate` writes.
 *
 * The generator wraps *both* adaptive-icon layers in `<inset android:inset="16.7%">`,
 * which shrinks each layer to the central 66.6% of the 108dp canvas — exactly the
 * area a launcher shows at rest. That has two visible costs:
 *
 *   1. The background stops full-bleeding. Launchers parallax the two layers
 *      against each other on long-press drag, and the moment they do, the
 *      background slides off its own inset bounds and the mask corners show
 *      through as transparent straight edges cutting into the circle.
 *   2. Everything is scaled down twice. assets/icon-foreground.svg already sizes
 *      the mark for the safe zone, so the extra inset leaves it floating in a
 *      sea of empty plate — noticeably smaller than the legacy icon.
 *
 * Dropping both insets restores the contract the source art was drawn against:
 * the 1024px canvas maps to the full 108dp, the visible window is its central
 * 66.6%, and assets/icon-background.svg keeps its detail inside that window.
 *
 * Runs as part of `npm run assets`, because the generator overwrites these two
 * files on every run and a manual post-step would eventually be forgotten.
 */
import { readFile, writeFile } from 'node:fs/promises'

const FILES = [
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
]

/** `<background><inset android:drawable="X" android:inset="16.7%" /></background>` */
const WRAPPED = /<(background|foreground)>\s*<inset\s+android:drawable="([^"]+)"\s+android:inset="[^"]+"\s*\/>\s*<\/\1>/g

let patched = 0
let skipped = 0

for (const file of FILES) {
  let xml
  try {
    xml = await readFile(file, 'utf8')
  } catch {
    // No android/ project yet — `npx cap add android` has not been run. Not an
    // error: there is simply nothing to patch.
    console.log(`skip  ${file} (not present)`)
    skipped += 1
    continue
  }

  const flat = xml.replace(WRAPPED, '<$1 android:drawable="$2" />')

  if (flat !== xml) {
    await writeFile(file, flat, 'utf8')
    console.log(`flat  ${file}`)
    patched += 1
  } else if (/<background\s+android:drawable=/.test(xml)) {
    console.log(`ok    ${file} (already flat)`)
    patched += 1
  } else {
    // The generator's output shape changed. Fail loudly rather than shipping an
    // icon nobody looked at.
    console.error(`\nERROR ${file} matched neither the inset nor the flat form.`)
    console.error('@capacitor/assets has changed its output — re-check this script.\n')
    process.exit(1)
  }
}

if (patched === 0 && skipped > 0) console.log('\nNothing to patch. Run `npx cap add android` first.')
