"use client"

const MAX_DIMENSION = 512

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function isJpeg(dataUrl: string): boolean {
  return dataUrl.startsWith("data:image/jpeg")
}

/**
 * Shrinks an image to fit MAX_DIMENSION and re-encodes it as a data URL so it
 * can live in browser storage. Small images are returned untouched.
 */
function downscaleImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height))
      if (scale >= 1) {
        resolve(dataUrl)
        return
      }
      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        resolve(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL(isJpeg(dataUrl) ? "image/jpeg" : "image/png", 0.9))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

/**
 * Reads an uploaded image and returns a data URL for browser storage.
 * Large images are downscaled first so everything fits in the browser's quota.
 */
export async function uploadImage(source: File | Blob | string): Promise<string> {
  if (typeof source === "string") {
    if (!source.startsWith("data:")) return source
    return downscaleImage(source)
  }
  return downscaleImage(await readAsDataUrl(source))
}
