import { useMemo, type ReactNode } from "react"
import {
  Circle,
  Document,
  Ellipse,
  Font,
  Image,
  Line,
  Page,
  Path,
  StyleSheet,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer"
import type { Client, Company, InvoiceDocument } from "@/lib/data/types"
import {
  companyContactLine,
  companySocials,
  formatLetterDate,
  renderTemplate,
  totalOf,
} from "@/lib/documents/document-utils"
import { SOCIAL_ICONS, SOCIAL_STROKE_WIDTH, type SocialKey } from "@/lib/documents/social-icons"
import { footerWaves, getTemplate, headerWaves, type DocTemplate } from "@/lib/documents/theme"
import { FLOWER_SPACING, flowerPath, type FlowerShape } from "@/lib/documents/patterns"
import { formatNaira } from "@/lib/utils/currency"

Font.register({
  family: "Carlito",
  fonts: [
    { src: "/fonts/Carlito-Regular.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "/fonts/Carlito-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/Carlito-Bold.ttf", fontWeight: 700, fontStyle: "normal" },
    { src: "/fonts/Carlito-BoldItalic.ttf", fontWeight: 700, fontStyle: "italic" },
  ],
})

Font.register({
  family: "Fraunces",
  fonts: [
    { src: "/fonts/Fraunces-Regular.ttf", fontWeight: 400, fontStyle: "normal" },
    { src: "/fonts/Fraunces-Italic.ttf", fontWeight: 400, fontStyle: "italic" },
    { src: "/fonts/Fraunces-SemiBold.ttf", fontWeight: 600, fontStyle: "normal" },
    { src: "/fonts/Fraunces-Bold.ttf", fontWeight: 700, fontStyle: "normal" },
  ],
})

function docFontFamily(font?: string) {
  return font === "fraunces" ? "Fraunces" : "Carlito"
}

function TiledPattern({ src, tile, opacity }: { src: string; tile: number; opacity: number }) {
  const cols = Math.ceil(PAGE_W / tile)
  const rows = Math.ceil(PAGE_H / tile)
  const cells: ReactNode[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push(
        // eslint-disable-next-line jsx-a11y/alt-text
        <Image
          key={`${r}-${c}`}
          src={src}
          style={{
            position: "absolute",
            top: r * tile,
            left: c * tile,
            width: tile,
            height: tile,
            objectFit: "cover",
            opacity,
            zIndex: 1,
          }}
        />,
      )
    }
  }
  return (
    <View
      fixed
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}
    >
      {cells}
    </View>
  )
}

function buildStyles(tpl: DocTemplate, font?: string) {
  const fontFamily = docFontFamily(font)
  return StyleSheet.create({
    page: { fontFamily, color: tpl.ink, fontSize: 10 },
    pageInner: { flex: 1, position: "relative" },
    bandWrap: { position: "relative" },
    headerBand: {
      backgroundColor: tpl.bandBg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 62,
      paddingTop: 14,
      paddingBottom: 12,
    },
    brandRow: { flexDirection: "row", alignItems: "flex-start" },
    logoChip: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: tpl.white,
      padding: 5,
      marginRight: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: { maxWidth: 40, maxHeight: 40, objectFit: "contain" },
    brand: { maxWidth: 310 },
    companyName: { fontSize: 14, fontWeight: 700, letterSpacing: 0.4, color: tpl.bandText },
    companyMeta: { fontSize: 8, color: tpl.bandMuted, marginTop: 3, lineHeight: 1.45 },
    rightCol: { alignItems: "flex-end" },
    date: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: tpl.bandText, whiteSpace: "nowrap" },
    ref: { fontSize: 8, color: tpl.bandMuted, marginTop: 2, whiteSpace: "nowrap" },
    accentStrip: { height: 4, backgroundColor: tpl.accentStrip },
    headerWaveSvg: {
      position: "absolute",
      top: "100%",
      left: 0,
      right: 0,
      width: PAGE_W,
      height: 34,
    },
    plainHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 62,
      paddingTop: 36,
    },
    plainLogo: { width: 42, height: 42, marginRight: 14, objectFit: "contain" },
    plainCompanyName: { fontSize: 14, fontWeight: 700, letterSpacing: 0.4, color: tpl.ink },
    plainMeta: { fontSize: 9, color: tpl.muted, marginTop: 3, lineHeight: 1.45 },
    plainDate: { fontSize: 10, fontWeight: 700, letterSpacing: 0.8, color: tpl.ink, whiteSpace: "nowrap" },
    plainRef: { fontSize: 9, color: tpl.muted, marginTop: 2, whiteSpace: "nowrap" },
    plainRule: {
      borderBottomWidth: 0.6,
      borderBottomColor: tpl.line,
      marginHorizontal: 62,
      marginTop: 16,
    },
    classicHeader: {
      alignItems: "center",
      paddingHorizontal: 74,
      paddingTop: 26,
    },
    classicLogo: { width: 48, height: 48, marginBottom: 6, objectFit: "contain" },
    classicName: { fontSize: 17, fontWeight: 700, letterSpacing: 0.5, color: tpl.ink, textAlign: "center" },
    classicMeta: { fontSize: 8.5, color: tpl.muted, marginTop: 3, lineHeight: 1.5, textAlign: "center" },
    classicRule: {
      borderBottomWidth: 0.6,
      borderBottomColor: tpl.line,
      marginTop: 10,
      alignSelf: "stretch",
    },
    classicMetaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8, alignSelf: "stretch" },
    classicDate: { fontSize: 9, letterSpacing: 0.8, color: tpl.muted },
    classicRef: { fontSize: 9, letterSpacing: 0.8, color: tpl.muted },
    bannerHeader: {
      backgroundColor: tpl.bandBg,
      alignItems: "center",
      paddingHorizontal: 62,
      paddingTop: 13,
      paddingBottom: 7,
    },
    bannerLogoChip: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: tpl.white,
      padding: 4,
      marginBottom: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    bannerLogo: { maxWidth: 34, maxHeight: 34, objectFit: "contain" },
    bannerName: { fontSize: 15, fontWeight: 700, letterSpacing: 0.6, color: tpl.bandText, textAlign: "center" },
    bannerMeta: { fontSize: 8.5, color: tpl.bandMuted, marginTop: 2, lineHeight: 1.45, textAlign: "center" },
    bannerMetaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 7,
      borderTopWidth: 0.6,
      borderTopColor: tpl.bandMuted,
      paddingTop: 3,
      alignSelf: "stretch",
    },
    bannerDate: { fontSize: 9, letterSpacing: 0.8, color: tpl.bandMuted },
    bannerRef: { fontSize: 9, letterSpacing: 0.8, color: tpl.bandMuted },
    body: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 62,
      paddingTop: 38,
      paddingBottom: 20,
    },
    shapeTop: {
      position: "absolute",
      top: -68,
      right: -40,
      width: 192,
      height: 192,
      borderRadius: 96,
      backgroundColor: tpl.shape,
    },
    shapeBottom: {
      position: "absolute",
      bottom: -40,
      left: -50,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: tpl.shapeAlt,
    },
    content: { position: "relative", zIndex: 2 },
    clientName: { fontSize: 10, fontWeight: 700, lineHeight: 1.5, color: tpl.ink },
    clientAddress: { fontSize: 9, color: tpl.muted, marginTop: 2, lineHeight: 1.5 },
    clientMeta: { fontSize: 9, color: tpl.muted, marginTop: 2, lineHeight: 1.5 },
    salutation: { fontSize: 10, marginTop: 8, lineHeight: 1.5, color: tpl.ink },
    titleWrap: { marginTop: 12, alignItems: "center" },
    title: {
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1.4,
      color: tpl.titleAccent ? tpl.primary : tpl.ink,
    },
    titleRule: { width: 64, height: 3, backgroundColor: tpl.primary, marginTop: 6 },
    bodyText: { fontSize: 10, marginTop: 10, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    breakdownHeading: { fontSize: 10, marginTop: 10, lineHeight: 1.5, color: tpl.ink },
    itemsWrap: { marginTop: 6 },
    sectionLabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.6,
      marginTop: 10,
      marginBottom: 0,
      paddingLeft: 10,
      lineHeight: 1.5,
      color: tpl.titleAccent ? tpl.primary : tpl.ink,
      ...(tpl.titleAccent ? { borderLeftWidth: 3, borderLeftColor: tpl.primary } : {}),
      textTransform: "uppercase",
    },
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderBottomWidth: 0.4,
      borderBottomColor: tpl.line,
      paddingVertical: 3,
    },
    itemDesc: { flex: 1, fontSize: 10, lineHeight: 1.5, paddingRight: 18, color: tpl.ink },
    itemAmount: {
      fontSize: 10,
      fontWeight: 600,
      textAlign: "right",
      minWidth: 88,
      color: tpl.primary,
    },
    totalRowChip: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: tpl.primarySoft,
      borderRadius: 6,
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    totalRowPlain: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 0.6,
      borderTopColor: tpl.line,
      marginTop: 8,
      paddingTop: 10,
    },
    totalLabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.8,
      color: tpl.totalChip ? tpl.primarySoftText : tpl.ink,
    },
    totalAmount: {
      fontSize: 10.5,
      fontWeight: 700,
      textAlign: "right",
      minWidth: 88,
      color: tpl.totalChip ? tpl.primarySoftText : tpl.ink,
    },
    spacer: { flex: 1 },
    closingWrap: { marginTop: 12 },
    closing: { fontSize: 10, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    thanks: { fontSize: 10, marginTop: 6, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    signature: { marginTop: 12 },
    signImage: { width: 190, height: 48, objectFit: "contain", marginBottom: 3 },
    signLine: { width: 200, borderTopWidth: 2, borderTopColor: tpl.primary },
    signRole: {
      fontSize: 10,
      fontWeight: 700,
      marginTop: 7,
      lineHeight: 1.4,
      color: tpl.titleAccent ? tpl.primary : tpl.ink,
    },
    signFor: { fontSize: 10, marginTop: 2, lineHeight: 1.4, color: tpl.muted },
    footerBand: {
      backgroundColor: tpl.bandBg,
      paddingHorizontal: 62,
      paddingTop: 8,
      paddingBottom: tpl.wave ? 52 : 34,
      alignItems: "center",
    },
    footerContact: { fontSize: 10, color: tpl.bandMuted, lineHeight: 1.5, textAlign: "center" },
    footerSocials: { fontSize: 10, color: tpl.bandMuted, lineHeight: 1.5, textAlign: "center" },
    footerPlain: {
      borderTopWidth: 0.6,
      borderTopColor: tpl.line,
      paddingHorizontal: 62,
      paddingTop: 10,
      paddingBottom: 34,
      alignItems: "center",
    },
    footerContactPlain: { fontSize: 10, color: tpl.muted, lineHeight: 1.5, textAlign: "center" },
    footerSocialsPlain: { fontSize: 10, color: tpl.faint, lineHeight: 1.5, textAlign: "center" },
    socialsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 5,
    },
    socialItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 8, marginTop: 3 },
  })
}

const PAGE_W = 595.28
const PAGE_H = 842

function FlowerPattern({ color }: { color: string }) {
  const flowers: FlowerShape[] = []
  for (let y = FLOWER_SPACING / 2; y < PAGE_H - FLOWER_SPACING / 2; y += FLOWER_SPACING) {
    for (let x = FLOWER_SPACING / 2; x < PAGE_W - FLOWER_SPACING / 2; x += FLOWER_SPACING) {
      flowers.push(flowerPath(x, y))
    }
  }
  const elems = flowers.flatMap((flower, i) => [
    <Path key={`p${i}`} d={flower.path} fill={color} fillOpacity={0.05} />,
    <Circle
      key={`c${i}`}
      cx={flower.centerX}
      cy={flower.centerY}
      r={flower.centerR}
      fill={color}
      fillOpacity={0.05}
    />,
  ])
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
      {elems}
    </Svg>
  )
}

function PdfSocialIcon({ kind, color, size }: { kind: SocialKey; color: string; size: number }) {
  const icon = SOCIAL_ICONS[kind]
  const stroke = { stroke: color, strokeWidth: SOCIAL_STROKE_WIDTH }
  return (
    <Svg style={{ marginRight: 4 }} width={size} height={size} viewBox={icon.viewBox}>
      {icon.shapes.map((shape, i) => {
        if (shape.t === "path") {
          return shape.mode === "stroke" ? (
            <Path key={i} d={shape.d} fill="none" {...stroke} />
          ) : (
            <Path key={i} d={shape.d} fill={color} />
          )
        }
        if (shape.t === "circle") {
          return shape.mode === "stroke" ? (
            <Circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill="none" {...stroke} />
          ) : (
            <Circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill={color} />
          )
        }
        if (shape.t === "ellipse") {
          return shape.mode === "stroke" ? (
            <Ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill="none" {...stroke} />
          ) : (
            <Ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={color} />
          )
        }
        return <Line key={i} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} {...stroke} />
      })}
    </Svg>
  )
}

export function LetterPdf({
  doc,
  company,
  client,
}: {
  doc: InvoiceDocument
  company: Company
  client?: Client
}) {
  const tpl = getTemplate(doc.template)
  const s = useMemo(() => buildStyles(tpl, doc.font), [tpl, doc.font])
  const body = renderTemplate(doc.body, doc)
  const closing = renderTemplate(doc.closing, doc)
  const thanks = renderTemplate(doc.thanks, doc)
  const total = totalOf(doc)
  const waves = footerWaves(PAGE_W, 100)
  const topWaves = headerWaves(PAGE_W, 34)
  const contactLine = companyContactLine(company)
  const socials = companySocials(company)
  const hasFooter = Boolean(contactLine || socials.length)

  return (
    <Document title={`${doc.title} — ${client?.name ?? doc.number}`} author={company.name}>
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          {doc.showPattern ? (
            company.patternImage ? (
              <TiledPattern src={company.patternImage} tile={92} opacity={0.05} />
            ) : tpl.pattern ? (
              <View
                fixed
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1,
                }}
              >
                <FlowerPattern color={tpl.primary} />
              </View>
            ) : null
          ) : null}

          {tpl.shapes ? (
            <>
              <View style={s.shapeTop} />
              <View style={s.shapeBottom} />
            </>
          ) : null}

          {tpl.layout === "classic" ? (
            <View style={s.classicHeader}>
              {company.logo ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={company.logo} style={s.classicLogo} />
              ) : null}
              <Text style={s.classicName}>{company.name}</Text>
              {contactLine ? <Text style={s.classicMeta}>{contactLine}</Text> : null}
              {company.regNo ? <Text style={s.classicMeta}>RC {company.regNo}</Text> : null}
              <View style={s.classicRule} />
              <View style={s.classicMetaRow}>
                <Text style={s.classicDate}>{formatLetterDate(doc.date)}</Text>
                <Text style={s.classicRef}>Ref: {doc.number}</Text>
              </View>
            </View>
          ) : tpl.layout === "banner" ? (
            <View style={s.bandWrap}>
              <View style={s.bannerHeader}>
                {company.logo ? (
                  <View style={s.bannerLogoChip}>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image src={company.logo} style={s.bannerLogo} />
                  </View>
                ) : null}
                <Text style={s.bannerName}>{company.name}</Text>
                {contactLine ? <Text style={s.bannerMeta}>{contactLine}</Text> : null}
                {company.regNo ? <Text style={s.bannerMeta}>RC {company.regNo}</Text> : null}
                <View style={s.bannerMetaRow}>
                  <Text style={s.bannerDate}>{formatLetterDate(doc.date)}</Text>
                  <Text style={s.bannerRef}>Ref: {doc.number}</Text>
                </View>
              </View>
              <View style={s.accentStrip} />
              {tpl.wave ? (
                <Svg style={s.headerWaveSvg} viewBox={`0 0 ${PAGE_W} 34`} preserveAspectRatio="none">
                  <Path d={topWaves.main} fill={tpl.bandBg} />
                  <Path d={topWaves.accent} fill={tpl.accentStrip} />
                </Svg>
              ) : null}
            </View>
          ) : tpl.band ? (
            <View style={s.bandWrap}>
              <View style={s.headerBand}>
                <View style={s.brandRow}>
                  {company.logo ? (
                    <View style={s.logoChip}>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image src={company.logo} style={s.logo} />
                    </View>
                  ) : null}
                  <View style={s.brand}>
                    <Text style={s.companyName}>{company.name}</Text>
                    <Text style={s.companyMeta}>{contactLine}</Text>
                    {company.regNo ? (
                      <Text style={s.companyMeta}>RC {company.regNo}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={s.rightCol}>
                  <Text style={s.date}>{formatLetterDate(doc.date)}</Text>
                  <Text style={s.ref}>Ref: {doc.number}</Text>
                </View>
              </View>
              <View style={s.accentStrip} />
              {tpl.wave ? (
                <Svg style={s.headerWaveSvg} viewBox={`0 0 ${PAGE_W} 34`} preserveAspectRatio="none">
                  <Path d={topWaves.main} fill={tpl.bandBg} />
                  <Path d={topWaves.accent} fill={tpl.accentStrip} />
                </Svg>
              ) : null}
            </View>
          ) : (
            <>
              <View style={s.plainHeader}>
                <View style={s.brandRow}>
                  {company.logo ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image src={company.logo} style={s.plainLogo} />
                  ) : null}
                  <View style={s.brand}>
                    <Text style={s.plainCompanyName}>{company.name}</Text>
                    <Text style={s.plainMeta}>{contactLine}</Text>
                    {company.regNo ? (
                      <Text style={s.plainMeta}>RC {company.regNo}</Text>
                    ) : null}
                  </View>
                </View>
                <View style={s.rightCol}>
                  <Text style={s.plainDate}>{formatLetterDate(doc.date)}</Text>
                  <Text style={s.plainRef}>Ref: {doc.number}</Text>
                </View>
              </View>
              <View style={s.plainRule} />
            </>
          )}

          <View
            style={[
              s.body,
              ...(tpl.wave && !hasFooter ? [{ paddingBottom: 118 }] : []),
              ...(!tpl.band ? [{ paddingTop: tpl.layout === "classic" ? 20 : 34 }] : []),
              ...(tpl.layout === "banner" ? [{ paddingTop: 36 }] : []),
            ]}
          >
            <View style={s.content}>
              {client ? (
                <View>
                  <Text style={s.clientName}>{client.name}</Text>
                  <Text style={s.clientAddress}>{client.address}</Text>
                  {client.phone || client.email ? (
                    <Text style={s.clientMeta}>
                      {[client.phone ? `Tel: ${client.phone}` : "", client.email ? `Email: ${client.email}` : ""]
                        .filter(Boolean)
                        .join(" • ")}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <Text style={s.salutation}>{doc.salutation}</Text>

              <View style={s.titleWrap}>
                <Text style={s.title}>{doc.title}</Text>
                {tpl.titleAccent ? <View style={s.titleRule} /> : null}
              </View>

              <Text style={s.bodyText}>{body}</Text>
              <Text style={s.breakdownHeading}>{doc.breakdownHeading}</Text>

              <View style={s.itemsWrap}>
                {doc.sections.map((section) => (
                  <View key={section.id}>
                    {section.label ? <Text style={s.sectionLabel}>{section.label}</Text> : null}
                    {section.items.map((item) => (
                      <View key={item.id} style={s.itemRow}>
                        <Text style={s.itemDesc}>{item.description}</Text>
                        <Text style={s.itemAmount}>{formatNaira(item.amount)}</Text>
                      </View>
                    ))}
                  </View>
                ))}
                {doc.showTotal ? (
                  <View style={tpl.totalChip ? s.totalRowChip : s.totalRowPlain}>
                    <Text style={s.totalLabel}>TOTAL</Text>
                    <Text style={s.totalAmount}>{formatNaira(total)}</Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View style={s.spacer} />

            <View style={s.closingWrap}>
              <Text style={s.closing}>{closing}</Text>
              <Text style={s.thanks}>{thanks} </Text>

              <View style={s.signature}>
                {company.signature ? (
                  <View>
                    {/* eslint-disable-next-line jsx-a11y/alt-text */}
                    <Image src={company.signature} style={s.signImage} />
                  </View>
                ) : null}
                <View style={s.signLine} />
                <Text style={s.signRole}>
                  {company.signatoryName || doc.signatoryRole || company.signatoryRole}
                </Text>
                <Text style={s.signFor}>For: {company.name}</Text>
                {company.signatoryName ? (
                  <Text style={s.signFor}>{doc.signatoryRole || company.signatoryRole}</Text>
                ) : null}
              </View>
            </View>
          </View>

          {hasFooter ? (
            <View style={tpl.band ? s.footerBand : s.footerPlain}>
              <Text style={tpl.band ? s.footerContact : s.footerContactPlain}>{contactLine}</Text>
              {socials.length ? (
                <View style={s.socialsRow}>
                  {socials.map((entry) => (
                    <View key={entry.key} style={s.socialItem} wrap={false}>
                      <PdfSocialIcon
                        kind={entry.key}
                        color={tpl.band ? tpl.bandMuted : tpl.faint}
                        size={10}
                      />
                      <Text style={tpl.band ? s.footerSocials : s.footerSocialsPlain}>
                        {entry.value}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}

          {tpl.wave ? (
            <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 100 }}>
              <Svg width="100%" height={100} viewBox="0 0 595.28 100">
                <Path d={waves.main} fill={tpl.bandBg} />
                <Path d={waves.accent} fill={tpl.accentStrip} />
              </Svg>
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  )
}
