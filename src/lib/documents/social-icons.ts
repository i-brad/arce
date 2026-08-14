export type SocialKey = "website" | "instagram" | "facebook" | "twitter" | "tiktok" | "linkedin"

export type IconShape =
  | { t: "path"; d: string; mode?: "fill" | "stroke" }
  | { t: "circle"; cx: number; cy: number; r: number; mode?: "fill" | "stroke" }
  | { t: "ellipse"; cx: number; cy: number; rx: number; ry: number; mode?: "fill" | "stroke" }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number; mode?: "fill" | "stroke" }

export interface IconDef {
  viewBox: string
  shapes: IconShape[]
}

const STROKE = 1.6

export const SOCIAL_ICONS: Record<SocialKey, IconDef> = {
  website: {
    viewBox: "0 0 24 24",
    shapes: [
      { t: "circle", cx: 12, cy: 12, r: 9, mode: "stroke" },
      { t: "ellipse", cx: 12, cy: 12, rx: 4.2, ry: 9, mode: "stroke" },
      { t: "line", x1: 3, y1: 12, x2: 21, y2: 12, mode: "stroke" },
    ],
  },
  instagram: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z",
        mode: "stroke",
      },
      { t: "circle", cx: 12, cy: 12, r: 4, mode: "stroke" },
      { t: "circle", cx: 16.6, cy: 7.4, r: 1.4, mode: "fill" },
    ],
  },
  facebook: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M13.5 2.6c1.9 0 3.3.2 4 .5l-.3 3.5c-.7-.2-1.5-.3-2.5-.3-1.2 0-1.6.5-1.6 1.4V9.5h4.2l-.4 3.7h-3.8v8.8h-3.9v-8.8H7.5V9.5h3.7V7.3c0-2.9 1.5-4.7 2.3-4.7Z",
      },
    ],
  },
  twitter: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M17.75 3h3.08l-6.73 7.69L21.75 21h-6.2l-4.86-6.35L5.1 21H2l7.2-8.23L2.25 3h6.36l4.39 5.8L17.75 3Zm-1.08 16.16h1.7L7.44 4.74H5.6l11.07 14.42Z",
      },
    ],
  },
  tiktok: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
      },
    ],
  },
  linkedin: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M6.94 8.9V20H3.7V8.9h3.24zM5.32 3.5a1.88 1.88 0 1 1 0 3.76 1.88 1.88 0 0 1 0-3.76zM20.3 13.94v6.06h-3.24v-5.93c0-1.49-.53-2.5-1.86-2.5-1.02 0-1.63.68-1.9 1.34-.1.24-.12.57-.12.9v6.19H9.94c.04-10.05 0-11.08 0-11.08h3.24v1.6c.43-.66 1.2-1.6 2.9-1.6 2.12 0 3.71 1.38 3.71 4.36Z",
      },
    ],
  },
}

export const SOCIAL_STROKE_WIDTH = STROKE

export type ContactIconKey = "phone" | "mail" | "pin"

export const CONTACT_ICONS: Record<ContactIconKey, IconDef> = {
  phone: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M6.6 3.6c.7-.3 1.5 0 1.8.7l1 2.3c.3.6.1 1.3-.4 1.7L7.8 9.6c1 2.4 2.9 4.3 5.3 5.3l1.3-1.2c.4-.5 1.1-.7 1.7-.4l2.3 1c.7.3 1 1.1.7 1.8l-.9 2c-.3.6-.9 1-1.6.9-6-.7-10.8-5.5-11.5-11.5-.1-.7.3-1.3.9-1.6l2-.9Z",
        mode: "stroke",
      },
    ],
  },
  mail: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
        mode: "stroke",
      },
      { t: "path", d: "M3.5 7 12 13 20.5 7", mode: "stroke" },
    ],
  },
  pin: {
    viewBox: "0 0 24 24",
    shapes: [
      {
        t: "path",
        d: "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z",
        mode: "stroke",
      },
      { t: "circle", cx: 12, cy: 9, r: 2.4, mode: "stroke" },
    ],
  },
}
