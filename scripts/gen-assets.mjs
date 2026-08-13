import { chromium } from "playwright"
import { writeFileSync, mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const fontsDir = join(root, "public/fonts").replace(/ /g, "%20")
const fraunces = `file://${fontsDir}/Fraunces-SemiBold.ttf`
const frauncesBold = `file://${fontsDir}/Fraunces-Bold.ttf`

const fontCss = `
  @font-face { font-family: "Fraunces"; font-weight: 600; src: url("${fraunces}"); }
  @font-face { font-family: "Fraunces"; font-weight: 700; src: url("${frauncesBold}"); }
`

const GREEN = "#142820"
const GREEN_SOFT = "#1F382C"
const CREAM = "#C7D4C9"
const MUTED = "#8FAA98"

function flower(cx, cy, petalR, opacity) {
  const petals = 6
  const phi = (Math.PI * 2) / petals
  const ctrl = petalR * 0.55
  let d = `M ${cx.toFixed(2)} ${cy.toFixed(2)}`
  for (let i = 0; i < petals; i++) {
    const a = phi * i - Math.PI / 2
    const tipX = cx + Math.cos(a) * petalR
    const tipY = cy + Math.sin(a) * petalR
    const c1x = cx + Math.cos(a - phi / 2) * ctrl
    const c1y = cy + Math.sin(a - phi / 2) * ctrl
    const c2x = cx + Math.cos(a + phi / 2) * ctrl
    const c2y = cy + Math.sin(a + phi / 2) * ctrl
    d += ` Q ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${tipX.toFixed(2)} ${tipY.toFixed(2)}`
    d += ` Q ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${cx.toFixed(2)} ${cy.toFixed(2)}`
  }
  d += " Z"
  return `<path d="${d}" fill="${CREAM}" fill-opacity="${opacity}"/>`
}

function flowerGrid(width, height, spacing, petalR, opacity) {
  let out = ""
  for (let y = spacing / 2; y < height; y += spacing) {
    for (let x = spacing / 2; x < width; x += spacing) {
      out += flower(x, y, petalR, opacity)
    }
  }
  return out
}

function monogram(size, rx, color, fill, weight) {
  return `
    <rect width="${size}" height="${size}" rx="${rx}" fill="${color}"/>
    ${flowerGrid(size, size, 64, 7.5, 0.06)}
    <text x="${size / 2}" y="${size * 0.68}" font-family="Fraunces" font-weight="${weight}" font-size="${size * 0.58}" fill="${fill}" text-anchor="middle">A</text>
  `
}

const og = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <style>${fontCss}</style>
  <defs>
    <radialGradient id="bg" cx="0.5" cy="0.35" r="0.95">
      <stop offset="0" stop-color="#1C3629"/>
      <stop offset="1" stop-color="${GREEN}"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1040" cy="-120" r="300" fill="${GREEN_SOFT}"/>
  <circle cx="-140" cy="620" r="260" fill="${GREEN_SOFT}"/>
  ${flowerGrid(1200, 630, 132, 14, 0.07)}
  <g transform="translate(600, 212)">
    <rect x="-92" y="-92" width="184" height="184" rx="42" fill="#FFFFFF"/>
    <text x="0" y="46" font-family="Fraunces" font-weight="700" font-size="108" fill="${GREEN}" text-anchor="middle">A</text>
  </g>
  <text x="600" y="440" font-family="Fraunces" font-weight="600" font-size="86" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">Acre</text>
  <text x="600" y="500" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="${CREAM}" text-anchor="middle" letter-spacing="10">INVOICING & ACKNOWLEDGMENTS</text>
  <text x="1132" y="600" font-family="Helvetica, Arial, sans-serif" font-size="18" fill="${MUTED}" text-anchor="end" letter-spacing="4">invoicing.worksbybrad.xyz</text>
</svg>`

const icon = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <style>${fontCss}</style>
  ${monogram(512, 116, GREEN, "#FFFFFF", 700)}
</svg>`

const browser = await chromium.launch()
const page = await browser.newPage()

async function render(svg, file, w, h) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}</style></head><body style="margin:0;width:${w}px;height:${h}px">${svg}</body></html>`
  const tmp = join(root, ".tmp-og.html")
  writeFileSync(tmp, html)
  await page.goto(`file://${tmp}`, { waitUntil: "networkidle" })
  await page.evaluate(async () => {
    await document.fonts.ready
  })
  const loaded = await page.evaluate(
    () => document.fonts.check("600 16px Fraunces") || document.fonts.check("700 16px Fraunces"),
  )
  if (!loaded) throw new Error("Fraunces failed to load for " + file)
  mkdirSync(join(root, "public"), { recursive: true })
  mkdirSync(join(root, "src/app"), { recursive: true })
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } })
  console.log(`wrote ${file}`)
}

await render(og, join(root, "public/og.png"), 1200, 630)
await render(icon, join(root, "src/app/icon.png"), 512, 512)
await render(icon, join(root, "src/app/apple-icon.png"), 180, 180)

writeFileSync(
  join(root, "src/app/icon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="116" fill="${GREEN}"/>
  <circle cx="404" cy="104" r="140" fill="#1F382C"/>
  <circle cx="96" cy="420" r="120" fill="#1F382C"/>
  <g fill="${CREAM}" fill-opacity="0.12">
${Array.from({ length: 16 })
    .map(() => flower(Math.round(Math.random() * 512), Math.round(Math.random() * 512), 8, 1))
    .join("\n")}
  </g>
  <text x="256" y="352" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="300" fill="#FFFFFF" text-anchor="middle">A</text>
</svg>
`,
)

await browser.close()
console.log("done")
