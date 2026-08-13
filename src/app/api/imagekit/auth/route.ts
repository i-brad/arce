import { NextResponse } from "next/server"
import { getImageKitAuthParams } from "@/lib/imagekit/server"
import { imagekitConfigured } from "@/lib/env"

export async function GET() {
  if (!imagekitConfigured()) {
    return NextResponse.json(
      { error: "ImageKit is not configured. Add the IMAGEKIT_* environment variables." },
      { status: 503 },
    )
  }
  return NextResponse.json(getImageKitAuthParams())
}
