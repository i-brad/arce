export type TemplateId =
  | "estate"
  | "minimal"
  | "navy"
  | "terracotta"
  | "classic"
  | "banner"
  | "banner-navy"
  | "wedge"

export type LayoutId = "band" | "classic" | "banner" | "wedge"

export const layoutLabels: Record<LayoutId, string> = {
  band: "Band",
  classic: "Classic letterhead",
  banner: "Banner",
  wedge: "Diagonal wedge",
}

export interface DocTemplate {
  id: TemplateId
  label: string
  description: string
  layout: LayoutId
  band: boolean
  wave: boolean
  shapes: boolean
  pattern: boolean
  totalChip: boolean
  titleAccent: boolean
  bandBg: string
  bandText: string
  bandMuted: string
  accentStrip: string
  primary: string
  primarySoft: string
  primarySoftText: string
  shape: string
  shapeAlt: string
  ink: string
  muted: string
  faint: string
  line: string
  white: string
}

export const templates: Record<TemplateId, DocTemplate> = {
  estate: {
    id: "estate",
    label: "Estate green",
    description: "Deep green letterhead, soft shapes and a wavy footer.",
    layout: "band",
    band: true,
    wave: true,
    shapes: true,
    pattern: true,
    totalChip: true,
    titleAccent: true,
    bandBg: "#142820",
    bandText: "#FFFFFF",
    bandMuted: "#C7D4C9",
    accentStrip: "#4A6A55",
    primary: "#142820",
    primarySoft: "#E7EDE7",
    primarySoftText: "#142820",
    shape: "#EEF2EE",
    shapeAlt: "#E2E9E3",
    ink: "#1C241F",
    muted: "#5C6860",
    faint: "#8B968F",
    line: "#DDE4DE",
    white: "#FFFFFF",
  },
  minimal: {
    id: "minimal",
    label: "Minimal",
    description: "Classic black-on-white letter, no decorations.",
    layout: "band",
    band: false,
    wave: false,
    shapes: false,
    pattern: true,
    totalChip: false,
    titleAccent: false,
    bandBg: "#FFFFFF",
    bandText: "#1A1A1A",
    bandMuted: "#555555",
    accentStrip: "#E5E5E5",
    primary: "#1A1A1A",
    primarySoft: "#F4F4F4",
    primarySoftText: "#1A1A1A",
    shape: "#F7F7F7",
    shapeAlt: "#EFEFEF",
    ink: "#1A1A1A",
    muted: "#555555",
    faint: "#999999",
    line: "#E5E5E5",
    white: "#FFFFFF",
  },
  navy: {
    id: "navy",
    label: "Navy & gold",
    description: "Navy letterhead with gold accents and a wavy footer.",
    layout: "band",
    band: true,
    wave: true,
    shapes: true,
    pattern: true,
    totalChip: true,
    titleAccent: true,
    bandBg: "#152A4A",
    bandText: "#FFFFFF",
    bandMuted: "#C6D2E4",
    accentStrip: "#B99A54",
    primary: "#1E3A66",
    primarySoft: "#EDF1F8",
    primarySoftText: "#1E3A66",
    shape: "#F1F4F9",
    shapeAlt: "#E6EBF3",
    ink: "#1B2431",
    muted: "#56626F",
    faint: "#8E99A6",
    line: "#E1E6ED",
    white: "#FFFFFF",
  },
  terracotta: {
    id: "terracotta",
    label: "Terracotta clay",
    description: "Warm clay letterhead with cream accents and a wavy footer.",
    layout: "band",
    band: true,
    wave: true,
    shapes: true,
    pattern: true,
    totalChip: true,
    titleAccent: true,
    bandBg: "#A33612",
    bandText: "#FFFFFF",
    bandMuted: "#F3E3D7",
    accentStrip: "#EFE8DA",
    primary: "#A33612",
    primarySoft: "#EFE8DA",
    primarySoftText: "#7A2810",
    shape: "#F4EEE4",
    shapeAlt: "#EDE3D3",
    ink: "#2B241C",
    muted: "#6E6157",
    faint: "#A09386",
    line: "#E4D9CA",
    white: "#FFFFFF",
  },
  classic: {
    id: "classic",
    label: "Classic letter",
    description: "Formal black-on-white letter with a centred company block.",
    layout: "classic",
    band: false,
    wave: false,
    shapes: false,
    pattern: true,
    totalChip: false,
    titleAccent: false,
    bandBg: "#FFFFFF",
    bandText: "#1A1A1A",
    bandMuted: "#555555",
    accentStrip: "#E5E5E5",
    primary: "#1A1A1A",
    primarySoft: "#F4F4F4",
    primarySoftText: "#1A1A1A",
    shape: "#F7F7F7",
    shapeAlt: "#EFEFEF",
    ink: "#1A1A1A",
    muted: "#555555",
    faint: "#999999",
    line: "#E5E5E5",
    white: "#FFFFFF",
  },
  banner: {
    id: "banner",
    label: "Green banner",
    description: "Full-width deep green banner letterhead.",
    layout: "banner",
    band: true,
    wave: true,
    shapes: false,
    pattern: true,
    totalChip: true,
    titleAccent: true,
    bandBg: "#0F3D2C",
    bandText: "#FFFFFF",
    bandMuted: "#C6DCD0",
    accentStrip: "#C9A15A",
    primary: "#0F3D2C",
    primarySoft: "#E6EFEA",
    primarySoftText: "#0F3D2C",
    shape: "#F0F4F1",
    shapeAlt: "#E4ECE7",
    ink: "#18211C",
    muted: "#55655C",
    faint: "#8B978F",
    line: "#DCE4DE",
    white: "#FFFFFF",
  },
  "banner-navy": {
    id: "banner-navy",
    label: "Navy banner",
    description: "Full-width navy banner letterhead.",
    layout: "banner",
    band: true,
    wave: true,
    shapes: false,
    pattern: true,
    totalChip: true,
    titleAccent: true,
    bandBg: "#0E2240",
    bandText: "#FFFFFF",
    bandMuted: "#C2D0E4",
    accentStrip: "#B99A54",
    primary: "#1E3A66",
    primarySoft: "#EDF1F8",
    primarySoftText: "#1E3A66",
    shape: "#F1F4F9",
    shapeAlt: "#E6EBF3",
    ink: "#1B2431",
    muted: "#56626F",
    faint: "#8E99A6",
    line: "#E1E6ED",
    white: "#FFFFFF",
  },
  wedge: {
    id: "wedge",
    label: "Emerald wedge",
    description: "White letterhead with a diagonal green banner, bulleted breakdown and an icon footer.",
    layout: "wedge",
    band: false,
    wave: false,
    shapes: false,
    pattern: true,
    totalChip: false,
    titleAccent: true,
    bandBg: "#242723",
    bandText: "#FFFFFF",
    bandMuted: "#C7CCC8",
    accentStrip: "#357D57",
    primary: "#1D3B2D",
    primarySoft: "#E7ECE8",
    primarySoftText: "#1D3B2D",
    shape: "#EEF1EE",
    shapeAlt: "#E2E7E3",
    ink: "#1E241F",
    muted: "#5A655D",
    faint: "#8A958C",
    line: "#DCE2DD",
    white: "#FFFFFF",
  },
}

export const templateList = Object.values(templates)

export function getTemplate(id: string): DocTemplate {
  return templates[id as TemplateId] ?? templates.estate
}

/**
 * Diagonal banner shape used by the wedge layout, anchored to the right edge.
 * Shared by the header and footer so both diagonals lean at the same angle.
 */
export function wedgeDiagonal(width: number, height: number): string {
  const topX = width * 0.3
  const bottomX = width * 0.52
  return `M ${topX} 0 L ${width} 0 L ${width} ${height} L ${bottomX} ${height} Z`
}


export function footerWaves(width: number, height: number): { main: string; accent: string } {
  const humps = 3
  const step = width / (humps * 2)
  const wave = (base: number, amp: number) => {
    let d = `M0 ${base}`
    for (let i = 0; i < humps * 2; i++) {
      const x0 = i * step
      const dir = i % 2 === 0 ? -1 : 1
      d += ` Q ${x0 + step / 2} ${base + amp * dir}, ${x0 + step} ${base}`
    }
    d += ` L ${width} ${height} L 0 ${height} Z`
    return d
  }
  return {
    main: wave(height * 0.62, height * 0.09),
    accent: wave(height * 0.84, height * 0.06),
  }
}

export function headerWaves(width: number, height: number): { main: string; accent: string } {
  const humps = 3
  const step = width / (humps * 2)
  const wave = (base: number, amp: number) => {
    let d = `M0 0 L ${width} 0 L ${width} ${base}`
    for (let i = 0; i < humps * 2; i++) {
      const x0 = width - i * step
      const dir = i % 2 === 0 ? -1 : 1
      d += ` Q ${x0 - step / 2} ${base + amp * dir}, ${x0 - step} ${base}`
    }
    d += ` L 0 0 Z`
    return d
  }
  return {
    main: wave(height * 0.72, height * 0.16),
    accent: wave(height * 0.45, height * 0.12),
  }
}
