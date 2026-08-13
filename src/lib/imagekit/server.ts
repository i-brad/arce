import ImageKit from "imagekit"
import { IMAGEKIT_PRIVATE_KEY, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_URL_ENDPOINT } from "@/lib/env"

let imagekit: ImageKit | null = null

export function getImageKit(): ImageKit {
  if (!imagekit) {
    imagekit = new ImageKit({
      publicKey: IMAGEKIT_PUBLIC_KEY,
      privateKey: IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: IMAGEKIT_URL_ENDPOINT,
    })
  }
  return imagekit
}

export interface ImageKitAuthParams {
  token: string
  expire: string
  signature: string
  publicKey: string
  urlEndpoint: string
}

export function getImageKitAuthParams(): ImageKitAuthParams {
  const auth = getImageKit().getAuthenticationParameters()
  return {
    token: auth.token,
    expire: String(auth.expire),
    signature: auth.signature,
    publicKey: IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  }
}
