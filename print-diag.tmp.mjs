import { chromium } from "playwright"
const page = await (await chromium.launch()).newPage()
await page.goto("http://localhost:3000/documents/new", { waitUntil: "networkidle" })
await page.getByRole("button", { name: /Acknowledgment letter/ }).click()
await page.waitForURL(/\/documents\//)
await page.getByText("Download PDF").waitFor({ timeout: 20000 })
await page.emulateMedia({ media: "print" })
const dims = await page.evaluate(() => {
  const d = document.querySelector(".print-only .document-page")
  const po = document.querySelector(".print-only")
  const mm = (px) => `${(px * 0.264583).toFixed(1)}mm`
  return {
    doc: d ? `${d.clientWidth}x${d.scrollHeight}px (${mm(d.clientWidth)}x${mm(d.scrollHeight)})` : "none",
    printOnly: po ? `scrollHeight=${mm(po.scrollHeight)}` : "none",
  }
})
console.log(dims)
await page.screenshot({ path: "/tmp/opencode/print-diag.png" })
