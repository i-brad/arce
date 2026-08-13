import { useMemo } from "react"
import { Circle, Document, Font, Image, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer"
import type { Client, Company, InvoiceDocument } from "@/lib/data/types"
import {
  companyContactLine,
  companySocialsLine,
  formatLetterDate,
  renderTemplate,
  totalOf,
} from "@/lib/documents/document-utils"
import { footerWaves, getTemplate, type DocTemplate } from "@/lib/documents/theme"
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

function buildStyles(tpl: DocTemplate, font?: string) {
  const fontFamily = docFontFamily(font)
  return StyleSheet.create({
    page: { fontFamily, color: tpl.ink, fontSize: 10 },
    pageInner: { flex: 1, position: "relative" },
    headerBand: {
      backgroundColor: tpl.bandBg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 62,
      paddingTop: 28,
      paddingBottom: 26,
    },
    brandRow: { flexDirection: "row", alignItems: "flex-start" },
    logoChip: {
      width: 52,
      height: 52,
      borderRadius: 12,
      backgroundColor: tpl.white,
      padding: 6,
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
    plainHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingHorizontal: 62,
      paddingTop: 42,
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
    body: {
      flex: 1,
      position: "relative",
      paddingHorizontal: 62,
      paddingTop: 40,
      paddingBottom: 34,
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
    content: { position: "relative" },
    clientName: { fontSize: 10, fontWeight: 700, lineHeight: 1.5, color: tpl.ink },
    clientAddress: { fontSize: 9, color: tpl.muted, marginTop: 2, lineHeight: 1.5 },
    clientMeta: { fontSize: 9, color: tpl.muted, marginTop: 2, lineHeight: 1.5 },
    salutation: { fontSize: 10, marginTop: 14, lineHeight: 1.5, color: tpl.ink },
    titleWrap: { marginTop: 20, alignItems: "center" },
    title: {
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: 1.4,
      color: tpl.titleAccent ? tpl.primary : tpl.ink,
    },
    titleRule: { width: 64, height: 3, backgroundColor: tpl.primary, marginTop: 8 },
    bodyText: { fontSize: 10, marginTop: 18, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    breakdownHeading: { fontSize: 10, marginTop: 18, lineHeight: 1.5, color: tpl.ink },
    itemsWrap: { marginTop: 10 },
    sectionLabel: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.6,
      marginTop: 14,
      marginBottom: 2,
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
      paddingVertical: 4,
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
      marginTop: 12,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    totalRowPlain: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderTopWidth: 0.6,
      borderTopColor: tpl.line,
      marginTop: 12,
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
    closingWrap: { marginTop: 26 },
    closing: { fontSize: 10, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    thanks: { fontSize: 10, marginTop: 10, lineHeight: 1.65, textAlign: "justify", color: tpl.ink },
    signature: { marginTop: 26 },
    signImage: { width: 190, height: 48, objectFit: "contain", marginBottom: 3 },
    signLine: { width: 200, borderTopWidth: 2, borderTopColor: tpl.primary },
    signRole: {
      fontSize: 10,
      fontWeight: 700,
      marginTop: 9,
      lineHeight: 1.4,
      color: tpl.titleAccent ? tpl.primary : tpl.ink,
    },
    signFor: { fontSize: 10, marginTop: 2, lineHeight: 1.4, color: tpl.muted },
    footerBand: {
      backgroundColor: tpl.bandBg,
      paddingHorizontal: 62,
      paddingTop: 18,
      paddingBottom: tpl.wave ? 70 : 38,
      alignItems: "center",
    },
    footerContact: { fontSize: 8, color: tpl.bandMuted, lineHeight: 1.5, textAlign: "center" },
    footerSocials: { fontSize: 8, color: tpl.bandMuted, marginTop: 4, lineHeight: 1.5, textAlign: "center" },
    footerPlain: {
      borderTopWidth: 0.6,
      borderTopColor: tpl.line,
      paddingHorizontal: 62,
      paddingTop: 16,
      paddingBottom: 44,
      alignItems: "center",
    },
    footerContactPlain: { fontSize: 8, color: tpl.muted, lineHeight: 1.5, textAlign: "center" },
    footerSocialsPlain: { fontSize: 8, color: tpl.faint, marginTop: 4, lineHeight: 1.5, textAlign: "center" },
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
    <Path key={`p${i}`} d={flower.path} fill={color} fillOpacity={0.09} />,
    <Circle
      key={`c${i}`}
      cx={flower.centerX}
      cy={flower.centerY}
      r={flower.centerR}
      fill={color}
      fillOpacity={0.09}
    />,
  ])
  return (
    <Svg width="100%" height="100%" viewBox={`0 0 ${PAGE_W} ${PAGE_H}`}>
      {elems}
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
  const contactLine = companyContactLine(company)
  const socialsLine = companySocialsLine(company)
  const hasFooter = Boolean(contactLine || socialsLine)

  return (
    <Document title={`${doc.title} — ${client?.name ?? doc.number}`} author={company.name}>
      <Page size="A4" style={s.page}>
        <View style={s.pageInner}>
          {company.patternImage ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src={company.patternImage}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: PAGE_W,
                height: PAGE_H,
                objectFit: "cover",
                opacity: 0.4,
              }}
            />
          ) : tpl.pattern ? (
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
              <FlowerPattern color={tpl.primary} />
            </View>
          ) : null}

          {tpl.shapes ? (
            <>
              <View style={s.shapeTop} />
              <View style={s.shapeBottom} />
            </>
          ) : null}

          {tpl.band ? (
            <>
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
            </>
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
              ...(!tpl.band ? [{ paddingTop: 34 }] : []),
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
                <Text style={s.signRole}>{doc.signatoryRole || company.signatoryRole}</Text>
                <Text style={s.signFor}>For: {company.name}</Text>
              </View>
            </View>
          </View>

          {hasFooter ? (
            <View style={tpl.band ? s.footerBand : s.footerPlain}>
              <Text style={tpl.band ? s.footerContact : s.footerContactPlain}>{contactLine}</Text>
              {socialsLine ? (
                <Text style={tpl.band ? s.footerSocials : s.footerSocialsPlain}>{socialsLine}</Text>
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
