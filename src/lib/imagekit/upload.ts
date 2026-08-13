"use client"

import { IMAGEKIT_URL_ENDPOINT } from "@/lib/env"

export function imagekitConfigured(): boolean {
  return Boolean(IMAGEKIT_URL_ENDPOINT)
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(",")
  const mime = head.match(/data:([^;]+)/)?.[1] ?? "image/png"
  const bytes = atob(body)
  const arr = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
  return new Blob([arr], { type: mime })
}

/**
 * Uploads an image to ImageKit and returns the resulting URL.
 * Falls back to the raw data URL when ImageKit is not configured,
 * so the app keeps working before backend keys are added.
 */
export async function uploadImage(
  source: File | Blob | string,
  fileName = "upload.png",
): Promise<string> {
  if (typeof source === "string" && source.startsWith("data:")) {
    if (!imagekitConfigured()) return source
    const blob = dataUrlToBlob(source)
    return uploadBlob(blob, fileName)
  }
  if (source instanceof File || source instanceof Blob) {
    if (!imagekitConfigured()) return readAsDataUrl(source)
    return uploadBlob(source, source instanceof File ? source.name : fileName)
  }
  return source
}

function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function uploadBlob(blob: Blob, fileName: string): Promise<string> {
  const res = await fetch("/api/imagekit/auth")
  if (!res.ok) {
    return readAsDataUrl(blob)
  }
  const { token, expire, signature, publicKey } = await res.json()

  const form = new FormData()
  form.append("file", blob, fileName)
  form.append("fileName", fileName)
  form.append("folder", "/arce")
  form.append("publicKey", publicKey)
  form.append("token", token)
  form.append("expire", expire)
  form.append("signature", signature)
  form.append("useUniqueFileName", "true")

  const upload = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: form,
  })
  if (!upload.ok) {
    return readAsDataUrl(blob)
  }
  const data = await upload.json()
  return String(data.url)
}
