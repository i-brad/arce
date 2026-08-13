export type TemplateId = "estate" | "minimal" | "navy" | "terracotta"

export interface DocTemplate {
  id: TemplateId
  label: string
  description: string
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
}

export const templateList = Object.values(templates)

export function getTemplate(id: string): DocTemplate {
  return templates[id as TemplateId] ?? templates.estate
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
