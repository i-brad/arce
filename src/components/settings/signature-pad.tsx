"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import { Button } from "@/components/ui/button"

function trimCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d")
  if (!ctx) return canvas
  const { width: w, height: h } = canvas
  const data = ctx.getImageData(0, 0, w, h).data
  let top = h
  let bottom = 0
  let left = w
  let right = 0
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 0) {
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
  }
  if (right < left || bottom < top) return canvas
  const pad = 10
  const sx = Math.max(0, left - pad)
  const sy = Math.max(0, top - pad)
  const sw = Math.min(right + pad, w) - sx
  const sh = Math.min(bottom + pad, h) - sy
  const out = document.createElement("canvas")
  out.width = sw
  out.height = sh
  out.getContext("2d")?.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh)
  return out
}

export function SignaturePad({
  onCancel,
  onSave,
}: {
  onCancel: () => void
  onSave: (dataUrl: string) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [hasStroke, setHasStroke] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2.4
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#1C241F"
  }, [])

  const position = (e: PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleDown = (e: PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = position(e)
  }

  const handleMove = (e: PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return
    const p = position(e)
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    setHasStroke(true)
  }

  const handleUp = () => {
    drawing.current = false
    last.current = null
  }

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasStroke(false)
  }

  const save = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const trimmed = trimCanvas(canvas)
    onSave(trimmed.toDataURL("image/png"))
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="h-36 w-full cursor-crosshair touch-none rounded-[8px] border border-line-strong bg-bg"
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerLeave={handleUp}
      />
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={clear}>
          Clear
        </Button>
        <Button variant="secondary" size="sm" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" type="button" onClick={save} disabled={!hasStroke}>
          Use signature
        </Button>
      </div>
    </div>
  )
}
