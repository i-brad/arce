import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

const BASE = "http://localhost:3000"
const SHOTS = "/tmp/opencode"
mkdirSync(SHOTS, { recursive: true })

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
]
function letterDate(d) {
  const day = d.getDate()
  const suffix =
    day % 10 === 1 && day !== 11 ? "ST"
    : day % 10 === 2 && day !== 12 ? "ND"
    : day % 10 === 3 && day !== 13 ? "RD" : "TH"
  return `${day}${suffix} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
}
const TODAY_LETTER = letterDate(new Date())
const THIS_YEAR = new Date().getFullYear()

const errors = []
const browser = await chromium.launch()
const page = await browser.newPage()
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`[console] ${msg.text()}`)
})
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`))

let failures = 0
async function check(url, expectedTexts, label) {
  const target = url.startsWith("http") ? url : `${BASE}${url}`
  await page.goto(target, { waitUntil: "networkidle" })
  const body = await page.locator("body").innerText()
  const missing = expectedTexts.filter((t) => !body.includes(t))
  if (missing.length) failures++
  console.log(`[${label}] ${missing.length ? "MISSING: " + missing.join(" | ") : "OK"}`)
}

const hasPatternLayer = async () =>
  (await page.locator(".document-page pattern").count()) > 0 ||
  (await page.locator('.document-page img[aria-hidden="true"]').count()) > 0

// A fresh user starts with an empty dashboard and lists (no sample data is seeded)
await check("/", [
  "Recent documents",
  "No documents yet.",
  "No clients yet.",
], "dashboard (empty)")

await check("/documents", ["No documents yet.", "New document"], "documents list (empty)")
await check("/clients", ["No clients yet.", "Add client"], "clients list (empty)")
await check("/settings", [
  "Upload logo",
  "WhatsApp",
  "SOCIALS",
  "Instagram",
  "Website",
  "Save settings",
], "settings")
const companyInput = await page.getByLabel("Company name").inputValue()
if (companyInput !== "Silver Pacific Homes") failures++
console.log(`[settings] company input: ${companyInput === "Silver Pacific Homes" ? "OK" : "FAIL"}`)

// Load the acknowledgment sample from the new-document page
await page.goto(`${BASE}/documents/new`, { waitUntil: "networkidle" })
await page.getByRole("button", { name: /Acknowledgment letter/ }).click()
await page.waitForURL(/\/documents\//)
await page.waitForTimeout(600)
const sampleUrl = page.url()
console.log(`[sample] loaded sample document: ${sampleUrl}`)

await check(sampleUrl, [
  "Silver Pacific Homes",
  "Southern Atlantic Estate",
  TODAY_LETTER,
  "LETTER OF ACKNOWLEDGEMENT",
  "Three Million, Seven Hundred Thousand Naira only",
  "N 3,700,000",
  "N 500,000",
  "STATUTORY FEES",
  "N 300,000",
  "N 150,000",
  "N 900,000",
  "N 1,850,000",
  "N 7,400,000",
  "DIRECTOR OF OPERATIONS",
  "For: Silver Pacific Homes",
  "Download PDF",
], "editor preview")

// Line-item description inputs must be wide enough to read/edit (regression: w-full was overriding flex-1)
const descWidth = await page
  .locator('input[placeholder="Item description"]')
  .first()
  .evaluate((el) => parseFloat(getComputedStyle(el).width))
if (descWidth < 100) {
  failures++
  console.log(`[editor] item description width: ${descWidth}px (too narrow)`)
} else {
  console.log(`[editor] item description width: ${descWidth}px OK`)
}
const amountWidth = await page
  .locator('input[placeholder="0"]')
  .first()
  .evaluate((el) => parseFloat(getComputedStyle(el).width))
if (amountWidth > 260) {
  failures++
  console.log(`[editor] amount field width: ${amountWidth}px (should be ~144px)`)
} else {
  console.log(`[editor] amount field width: ${amountWidth}px OK`)
}
// Date must render on one line in the header
const dateWraps = await page
  .locator(".document-page")
  .first()
  .evaluate((root, year) => {
    const el = Array.from(root.querySelectorAll("p")).find(
      (p) => p.textContent && p.textContent.includes(String(year)),
    )
    return el ? el.scrollWidth > el.clientWidth + 1 : false
  }, THIS_YEAR)
if (dateWraps) {
  failures++
  console.log("[editor] date wraps to multiple lines")
} else {
  console.log("[editor] date on one line: OK")
}

// Background pattern must be OFF by default on the sample document
if (await hasPatternLayer()) {
  failures++
  console.log("[pattern] sample should have patterns off by default")
} else {
  console.log("[pattern] off by default on sample: OK")
}

// Template switching: estate has a footer wave, minimal has none, navy brings it back
const previewSvg = page.locator(".document-page svg.document-wave")
if ((await previewSvg.count()) === 0) {
  failures++
  console.log("[template] estate: MISSING footer wave svg")
} else {
  console.log("[template] estate footer wave: OK")
}
const headerWave = page.locator(".document-page svg.document-header-wave")
if ((await headerWave.count()) === 0) {
  failures++
  console.log("[template] estate: MISSING header wave svg")
} else {
  console.log("[template] estate header wave: OK")
}
const bandZ = await page
  .locator(".document-page .z-10")
  .first()
  .evaluate((el) => getComputedStyle(el).zIndex)
if (bandZ !== "10") {
  failures++
  console.log(`[template] estate band z-index: got ${bandZ}`)
} else {
  console.log("[template] band covers top shape: OK")
}
await page.getByLabel("Template").selectOption("minimal")
await page.waitForTimeout(400)
if ((await previewSvg.count()) !== 0 || (await headerWave.count()) !== 0) {
  failures++
  console.log("[template] minimal: unexpected wave svg present")
} else {
  console.log("[template] minimal (no wave): OK")
}
await page.getByLabel("Template").selectOption("navy")
await page.waitForTimeout(400)
if ((await previewSvg.count()) === 0 || (await headerWave.count()) === 0) {
  failures++
  console.log("[template] navy: MISSING wave svg")
} else {
  console.log("[template] navy footer+header wave: OK")
}
await page.getByLabel("Template").selectOption("terracotta")
await page.waitForTimeout(400)
if ((await previewSvg.count()) === 0 || (await headerWave.count()) === 0) {
  failures++
  console.log("[template] terracotta: MISSING wave svg")
} else {
  console.log("[template] terracotta footer+header wave: OK")
}
const bandBg = await page
  .locator(".document-page .z-10")
  .first()
  .evaluate((el) => getComputedStyle(el).backgroundColor)
if (bandBg !== "rgb(163, 54, 18)") {
  failures++
  console.log(`[template] terracotta band: got ${bandBg}`)
} else {
  console.log("[template] terracotta band color: OK")
}
await page.getByLabel("Template").selectOption("estate")
await page.waitForTimeout(300)

// Settings flow: add logo + socials, save, verify they appear on the document
await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" })
await page.getByLabel("Company name").fill("Casa Khanya")
await page.getByLabel("Phone").fill("+234 708 709 6105")
await page.getByLabel("Email").fill("contact@casakhanya.estate")
await page.getByLabel("WhatsApp").fill("+234 708 709 6105")
await page.getByLabel("Address").fill("Akobo, Olorunda, Ibadan, Nigeria")
await page.getByLabel("Website").fill("casakhanya.estate")
await page.getByLabel("Instagram").fill("@casakhanya")
await page.getByLabel("Facebook").fill("Casa Khanya")

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
)
await page.locator('input[type="file"]').first().setInputFiles({
  name: "logo.png",
  mimeType: "image/png",
  buffer: png,
})
await page.getByText("Replace logo").waitFor({ timeout: 5000 })
await page.getByText("Save settings").click()
await page.waitForTimeout(600)

const settingsBody = await page.locator("body").innerText()
const savedCompany = await page.getByLabel("Company name").inputValue()
if (savedCompany !== "Casa Khanya") failures++
if (!settingsBody.includes("Replace logo")) failures++
console.log("[settings save] " + (settingsBody.includes("Replace logo") ? "OK" : "FAIL (logo not saved)"))

// Background pattern upload: upload, save, verify it replaces the flower pattern on the document
await page.locator('input[type="file"]').nth(1).setInputFiles({
  name: "pattern.png",
  mimeType: "image/png",
  buffer: png,
})
await page.getByText("Replace pattern").waitFor({ timeout: 5000 })
await page.getByText("Save settings").click()
await page.waitForTimeout(600)
const patternSettingsBody = await page.locator("body").innerText()
if (!patternSettingsBody.includes("Replace pattern")) failures++
console.log("[settings] " + (patternSettingsBody.includes("Replace pattern") ? "pattern upload: OK" : "FAIL (pattern not saved)"))

await page.goto(sampleUrl, { waitUntil: "networkidle" })
const docBody = await page.locator("body").innerText()
const expectedDoc = [
  "Casa Khanya",
  "contact@casakhanya.estate",
  "WhatsApp: +234 708 709 6105",
  "Akobo, Olorunda, Ibadan, Nigeria",
]
const missDoc = expectedDoc.filter((t) => !docBody.includes(t))
if (missDoc.length) failures++
console.log("[logo+socials on doc] " + (missDoc.length ? "MISSING: " + missDoc.join(" | ") : "OK"))

// Footer must render contact details + socials
const expectedFooter = [
  "WhatsApp: +234 708 709 6105",
  "Website: casakhanya.estate",
  "Instagram: @casakhanya",
  "Facebook: Casa Khanya",
]
const missFooter = expectedFooter.filter((t) => !docBody.includes(t))
if (missFooter.length) failures++
console.log("[footer socials+contact] " + (missFooter.length ? "MISSING: " + missFooter.join(" | ") : "OK"))

// PDF download test
const [download] = await Promise.all([
  page.waitForEvent("download", { timeout: 90000 }),
  page.getByText("Download PDF").click(),
])
const dlPath = await download.path()
console.log(`[pdf download] ${dlPath ? "OK (" + download.suggestedFilename() + ")" : "FAILED"}`)
if (!dlPath) failures++
const pdfBuf = await import("node:fs/promises").then((fs) => fs.readFile(dlPath))
const pdfText = pdfBuf.toString("latin1")
const countMatch = pdfText.match(/\/Count\s+(\d+)/)
const pageCount = countMatch ? parseInt(countMatch[1], 10) : null
if (pageCount === null) {
  failures++
  console.log("[pdf] page count unknown")
} else if (pageCount > 1) {
  failures++
  console.log(`[pdf] should be 1 page, got ${pageCount}`)
} else {
  console.log("[pdf] single page: OK")
}

// Print: only the print-only document must be visible; app chrome hidden
await page.emulateMedia({ media: "print" })
const printState = await page.evaluate(() => {
  const printOnly = document.querySelector(".print-only")
  const printCopy = printOnly?.querySelector(".document-page")
  const saveBtn = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent?.trim() === "Save",
  )
  return {
    printOnlyDisplay: printOnly ? getComputedStyle(printOnly).display : "missing",
    printOnlyVisible: printOnly ? getComputedStyle(printOnly).visibility : "missing",
    saveHidden: saveBtn ? getComputedStyle(saveBtn).visibility : "missing",
    printCopyWidth: printCopy ? getComputedStyle(printCopy).width : "missing",
  }
})
await page.emulateMedia({ media: "screen" })
const printOk =
  printState.printOnlyDisplay === "block" &&
  printState.printOnlyVisible === "visible" &&
  printState.saveHidden === "hidden"
if (!printOk) {
  failures++
  console.log(`[print] ${JSON.stringify(printState)}`)
} else {
  console.log(
    `[print] clean A4 document (chrome hidden): OK (${printState.printCopyWidth})`,
  )
}

// New document: total breakdown enabled by default, pattern toggle works
await page.goto(`${BASE}/documents/new`, { waitUntil: "networkidle" })
await page.getByLabel("Client").selectOption({ label: "MR OLUWAFEMI ALOFE OLUWADAMILARE" })
await page.getByLabel("Reference number").fill("VERIFY-001")
await page.getByText("Create & edit").click()
await page.waitForURL(/\/documents\//)
await page.waitForTimeout(600)
const newDocBody = await page.locator("body").innerText()
if (!newDocBody.includes("TOTAL")) {
  failures++
  console.log("[defaults] new document: TOTAL missing (showTotal should default on)")
} else {
  console.log("[defaults] new document total enabled by default: OK")
}
await page.getByLabel("Show background pattern").check()
await page.waitForTimeout(300)
if (!(await hasPatternLayer())) {
  failures++
  console.log("[defaults] pattern should appear when toggled on")
} else {
  console.log("[defaults] pattern toggle on: OK")
}
await page.getByLabel("Show background pattern").uncheck()
await page.waitForTimeout(300)
if (await hasPatternLayer()) {
  failures++
  console.log("[defaults] pattern should disappear when toggled off")
} else {
  console.log("[defaults] pattern toggle off: OK")
}

// Mobile responsiveness: hamburger opens the drawer, nav works, sidebar hidden
await page.setViewportSize({ width: 375, height: 720 })
await page.goto(`${BASE}/`, { waitUntil: "networkidle" })
const desktopSidebarHidden = await page
  .locator("aside")
  .first()
  .evaluate((el) => getComputedStyle(el).display)
if (desktopSidebarHidden === "none") {
  console.log("[mobile] desktop sidebar hidden on mobile: OK")
} else {
  failures++
  console.log(`[mobile] desktop sidebar should be hidden, got ${desktopSidebarHidden}`)
}
await page.getByLabel("Open menu").click()
const drawerVisible = await page
  .locator(".mobile-drawer")
  .evaluate((el) => getComputedStyle(el).transform)
if (drawerVisible === "none" || drawerVisible.includes("matrix(1")) {
  console.log("[mobile] drawer opens: OK")
} else {
  failures++
  console.log(`[mobile] drawer transform: ${drawerVisible}`)
}
await page.getByRole("link", { name: "Documents", exact: true }).click()
await page.waitForURL(/\/documents$/)
if (page.url().endsWith("/documents")) {
  console.log("[mobile] drawer navigation: OK")
} else {
  failures++
  console.log(`[mobile] navigation failed: ${page.url()}`)
}
await page.setViewportSize({ width: 1280, height: 800 })

// Screenshots
await page.goto(sampleUrl, { waitUntil: "networkidle" })
await page.waitForTimeout(400)
await page.screenshot({ path: `${SHOTS}/editor.png`, fullPage: true })
await page.goto(BASE, { waitUntil: "networkidle" })
await page.waitForTimeout(400)
await page.screenshot({ path: `${SHOTS}/dashboard.png`, fullPage: true })
await page.goto(`${BASE}/settings`, { waitUntil: "networkidle" })
await page.waitForTimeout(300)
await page.screenshot({ path: `${SHOTS}/settings.png`, fullPage: true })
console.log(`Screenshots in ${SHOTS}`)

await browser.close()

console.log(`\n${errors.length} console errors, ${failures} failed checks`)
for (const e of errors) console.log("  " + e)
process.exit(failures || errors.length ? 1 : 0)
