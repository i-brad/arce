import type { Client, Company, InvoiceDocument } from "@/lib/data/types"
import {
  companyContactLine,
  companySocials,
  formatLetterDate,
  renderTemplate,
  totalOf,
} from "@/lib/documents/document-utils"
import { SOCIAL_ICONS, SOCIAL_STROKE_WIDTH, type SocialKey } from "@/lib/documents/social-icons"
import { footerWaves, getTemplate, headerWaves } from "@/lib/documents/theme"
import { FLOWER_CENTER_R, FLOWER_PETAL_R, FLOWER_SPACING, flowerPath } from "@/lib/documents/patterns"
import { formatNaira } from "@/lib/utils/currency"
import Image from "next/image"

function SocialIcon({ kind, size, color }: { kind: SocialKey; size: number; color: string }) {
  const icon = SOCIAL_ICONS[kind]
  return (
    <svg viewBox={icon.viewBox} width={size} height={size} aria-hidden focusable="false">
      {icon.shapes.map((shape, i) => {
        const stroke = shape.mode === "stroke"
        if (shape.t === "path") {
          return stroke ? (
            <path key={i} d={shape.d} fill="none" stroke={color} strokeWidth={SOCIAL_STROKE_WIDTH} strokeLinecap="round" />
          ) : (
            <path key={i} d={shape.d} fill={color} />
          )
        }
        if (shape.t === "circle") {
          return stroke ? (
            <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill="none" stroke={color} strokeWidth={SOCIAL_STROKE_WIDTH} strokeLinecap="round" />
          ) : (
            <circle key={i} cx={shape.cx} cy={shape.cy} r={shape.r} fill={color} />
          )
        }
        if (shape.t === "ellipse") {
          return stroke ? (
            <ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill="none" stroke={color} strokeWidth={SOCIAL_STROKE_WIDTH} strokeLinecap="round" />
          ) : (
            <ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} fill={color} />
          )
        }
        return (
          <line key={i} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} fill="none" stroke={color} strokeWidth={SOCIAL_STROKE_WIDTH} strokeLinecap="round" />
        )
      })}
    </svg>
  )
}

export function DocumentPage({
  doc,
  company,
  client,
}: {
  doc: InvoiceDocument
  company: Company
  client?: Client
}) {
  const tpl = getTemplate(doc.template)
  const body = renderTemplate(doc.body, doc)
  const closing = renderTemplate(doc.closing, doc)
  const thanks = renderTemplate(doc.thanks, doc)
  const total = totalOf(doc)
  const waves = footerWaves(794, 96)
  const topWaves = headerWaves(794, 40)
  const contactLine = companyContactLine(company)
  const socials = companySocials(company)
  const hasFooter = Boolean(contactLine || socials.length)
  const pt = 4 / 3
  const tile = FLOWER_SPACING * pt
  const flower = flowerPath(tile / 2, tile / 2, FLOWER_PETAL_R * pt, FLOWER_CENTER_R * pt)

  return (
    <div
      className={`document-page relative mx-auto flex w-[210mm] min-h-[297mm] flex-col overflow-hidden bg-panel text-ink shadow-[0_1px_6px_rgba(28,28,28,0.08)] ring-1 ring-line ${
        doc.font === "fraunces" ? "font-fraunces" : "font-document"
      }`}
    >
      {/* Background pattern: uploaded icon tiled across the page, else template flower pattern */}
      {doc.showPattern ? (
        company.patternImage ? (
          <div
            aria-hidden
            className="tiled-pattern pointer-events-none absolute inset-0 z-[1]"
            style={{
              backgroundImage: `url("${company.patternImage}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "90px 90px",
              opacity: 0.4,
            }}
          />
        ) : tpl.pattern ? (
          <svg aria-hidden className="pointer-events-none absolute inset-0 z-[1] h-full w-full">
            <defs>
              <pattern
                id={`pattern-${tpl.id}`}
                width={tile}
                height={tile}
                patternUnits="userSpaceOnUse"
              >
                <path d={flower.path} fill={tpl.primary} opacity="0.09" />
                <circle
                  cx={flower.centerX}
                  cy={flower.centerY}
                  r={flower.centerR}
                  fill={tpl.primary}
                  opacity="0.09"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${tpl.id})`} />
          </svg>
        ) : null
      ) : null}

      {tpl.layout === "classic" ? (
        <div className="relative z-10 px-[26mm] pt-[10mm] text-center">
          {company.logo ? (
            <Image
              src={company.logo}
              alt={`${company.name} logo`}
              width={56}
              height={56}
              unoptimized
              className="mx-auto h-12 w-auto object-contain"
            />
          ) : null}
          <p
            className="mt-2 text-[20px] font-bold leading-snug tracking-wide"
            style={{ color: tpl.ink }}
          >
            {company.name}
          </p>
          {contactLine ? (
            <p
              className="mx-auto mt-1 max-w-[125mm] text-[10.5px] leading-snug"
              style={{ color: tpl.muted }}
            >
              {contactLine}
            </p>
          ) : null}
          {company.regNo ? (
            <p className="mt-0.5 text-[10px]" style={{ color: tpl.muted }}>
              RC {company.regNo}
            </p>
          ) : null}
          <div className="mx-auto mt-3 h-px w-full" style={{ backgroundColor: tpl.line }} />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] tracking-[0.08em]" style={{ color: tpl.muted }}>
              {formatLetterDate(doc.date)}
            </p>
            <p className="text-[11px] tracking-[0.08em]" style={{ color: tpl.muted }}>
              Ref: {doc.number}
            </p>
          </div>
        </div>
      ) : tpl.layout === "banner" ? (
        <div className="relative z-10" style={{ backgroundColor: tpl.bandBg }}>
          <div className="px-[22mm] pb-3 pt-[7mm] text-center">
            {company.logo ? (
              <div
                className="mx-auto flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5"
                style={{ backgroundColor: tpl.white }}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={company.logo}
                    alt={`${company.name} logo`}
                    fill
                    sizes="36px"
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
            <p
              className="mt-2 text-[17px] font-bold leading-tight tracking-wide"
              style={{ color: tpl.bandText }}
            >
              {company.name}
            </p>
            {contactLine ? (
              <p
                className="mx-auto mt-1 max-w-[140mm] text-[10px] leading-snug"
                style={{ color: tpl.bandMuted }}
              >
                {contactLine}
                {company.regNo ? ` · RC ${company.regNo}` : ""}
              </p>
            ) : company.regNo ? (
              <p className="mx-auto mt-1 text-[10px]" style={{ color: tpl.bandMuted }}>
                RC {company.regNo}
              </p>
            ) : null}
            <div
              className="mt-2 flex items-center justify-between border-t pt-1.5"
              style={{ borderColor: tpl.bandMuted }}
            >
              <p
                className="text-[11px] tracking-[0.08em]"
                style={{ color: tpl.bandMuted }}
              >
                {formatLetterDate(doc.date)}
              </p>
              <p
                className="text-[11px] tracking-[0.08em]"
                style={{ color: tpl.bandMuted }}
              >
                Ref: {doc.number}
              </p>
            </div>
          </div>
          <div className="h-[4px] w-full" style={{ backgroundColor: tpl.accentStrip }} />
          {tpl.wave ? (
            <svg
              aria-hidden
              className="document-header-wave pointer-events-none absolute inset-x-0 top-full h-[40px] w-full"
              viewBox="0 0 794 40"
              preserveAspectRatio="none"
            >
              <path d={topWaves.main} fill={tpl.bandBg} />
              <path d={topWaves.accent} fill={tpl.accentStrip} />
            </svg>
          ) : null}
        </div>
      ) : tpl.band ? (
        <div className="relative z-10" style={{ backgroundColor: tpl.bandBg }}>
          <div className="flex items-start justify-between gap-8 px-[22mm] pb-7 pt-8">
            <div className="flex items-start gap-4">
              {company.logo ? (
                <div
                  className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-white p-1.5"
                  style={{ backgroundColor: tpl.white }}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      fill
                      sizes="44px"
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </div>
              ) : null}
              <div>
                <p
                  className="text-[17px] font-bold leading-snug tracking-wide"
                  style={{ color: tpl.bandText }}
                >
                  {company.name}
                </p>
                <p
                  className="mt-1 max-w-[115mm] text-[10.5px] leading-snug"
                  style={{ color: tpl.bandMuted }}
                >
                  {contactLine}
                </p>
                {company.regNo ? (
                  <p
                    className="mt-0.5 text-[10px] leading-snug"
                    style={{ color: tpl.bandMuted }}
                  >
                    RC {company.regNo}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="text-right">
              <p
                className="whitespace-nowrap text-[12px] font-bold tracking-[0.08em]"
                style={{ color: tpl.bandText }}
              >
                {formatLetterDate(doc.date)}
              </p>
              <p className="mt-0.5 whitespace-nowrap text-[10.5px]" style={{ color: tpl.bandMuted }}>
                Ref: {doc.number}
              </p>
            </div>
          </div>
          <div className="h-[4px] w-full" style={{ backgroundColor: tpl.accentStrip }} />
          {tpl.wave ? (
            <svg
              aria-hidden
              className="document-header-wave pointer-events-none absolute inset-x-0 top-full h-[40px] w-full"
              viewBox="0 0 794 40"
              preserveAspectRatio="none"
            >
              <path d={topWaves.main} fill={tpl.bandBg} />
              <path d={topWaves.accent} fill={tpl.accentStrip} />
            </svg>
          ) : null}
        </div>
      ) : (
        <div className="flex items-start justify-between gap-8 px-[22mm] pt-[14mm]">
          <div className="flex items-start gap-4">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={48}
                height={48}
                unoptimized
                className="size-12 shrink-0 object-contain"
              />
            ) : null}
            <div>
              <p
                className="text-[17px] font-bold leading-snug tracking-wide"
                style={{ color: tpl.ink }}
              >
                {company.name}
              </p>
              <p className="mt-1 max-w-[115mm] text-[10.5px] leading-snug" style={{ color: tpl.muted }}>
                {contactLine}
              </p>
              {company.regNo ? (
                <p className="mt-0.5 text-[10px] leading-snug" style={{ color: tpl.muted }}>
                  RC {company.regNo}
                </p>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <p className="whitespace-nowrap text-[12px] font-bold tracking-[0.08em]" style={{ color: tpl.ink }}>
              {formatLetterDate(doc.date)}
            </p>
            <p className="mt-0.5 whitespace-nowrap text-[10.5px]" style={{ color: tpl.muted }}>
              Ref: {doc.number}
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div
        className="relative flex flex-1 flex-col px-[22mm]"
        style={{
          paddingBottom: tpl.wave ? (hasFooter ? "12mm" : "34mm") : "16mm",
          paddingTop: tpl.layout === "classic" ? "7mm" : tpl.layout === "banner" ? "11mm" : tpl.band ? "20mm" : "10mm",
        }}
      >
        {/* Background shapes */}
        {tpl.shapes ? (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-12 -top-24 size-[68mm] rounded-full"
              style={{ backgroundColor: tpl.shape }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-16 -left-16 size-[84mm] rounded-full"
              style={{ backgroundColor: tpl.shapeAlt }}
            />
          </>
        ) : null}

        <div className="relative z-10">
          {client ? (
            <>
              <p className="text-[12px] font-bold leading-relaxed" style={{ color: tpl.ink }}>
                {client.name}
              </p>
              <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: tpl.muted }}>
                {client.address}
              </p>
              {client.phone || client.email ? (
                <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: tpl.muted }}>
                  {[
                    client.phone ? `Tel: ${client.phone}` : "",
                    client.email ? `Email: ${client.email}` : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              ) : null}
            </>
          ) : null}

          <p className="mt-6 text-[12px] leading-relaxed" style={{ color: tpl.ink }}>
            {doc.salutation}
          </p>

          <div className="mt-8 text-center">
            <h1
              className="text-[17px] font-bold uppercase tracking-[0.12em]"
              style={{ color: tpl.titleAccent ? tpl.primary : tpl.ink }}
            >
              {doc.title}
            </h1>
            {tpl.titleAccent ? (
              <div className="mx-auto mt-3 h-[3px] w-16" style={{ backgroundColor: tpl.primary }} />
            ) : null}
          </div>

          <p className="mt-7 text-[12px] leading-[1.85] text-justify" style={{ color: tpl.ink }}>
            {body}
          </p>

          <p className="mt-7 text-[12px] leading-relaxed" style={{ color: tpl.ink }}>
            {doc.breakdownHeading}
          </p>

          <div className="mt-4">
            {doc.sections.map((section) => (
              <div key={section.id}>
                {section.label ? (
                  tpl.titleAccent ? (
                    <p
                      className="mt-4 border-l-[3px] pl-2.5 text-[12px] font-bold uppercase tracking-wide"
                      style={{ borderColor: tpl.primary, color: tpl.primary }}
                    >
                      {section.label}
                    </p>
                  ) : (
                    <p className="mt-4 text-[12px] font-bold uppercase tracking-wide" style={{ color: tpl.ink }}>
                      {section.label}
                    </p>
                  )
                ) : null}
                {section.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-baseline justify-between gap-6 border-b py-[5px]"
                    style={{ borderColor: tpl.line }}
                  >
                    <span className="flex-1 text-[12px] leading-relaxed" style={{ color: tpl.ink }}>
                      {item.description}
                    </span>
                    <span
                      className="min-w-24 text-right text-[12px] font-semibold tabular-nums"
                      style={{ color: tpl.primary }}
                    >
                      {formatNaira(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
            {doc.showTotal ? (
              tpl.totalChip ? (
                <div
                  className="mt-3 flex items-center justify-between gap-6 rounded-[6px] px-3 py-2.5"
                  style={{ backgroundColor: tpl.primarySoft }}
                >
                  <span
                    className="text-[12px] font-bold uppercase tracking-wide"
                    style={{ color: tpl.primarySoftText }}
                  >
                    Total
                  </span>
                  <span
                    className="min-w-24 text-right text-[13px] font-bold tabular-nums"
                    style={{ color: tpl.primarySoftText }}
                  >
                    {formatNaira(total)}
                  </span>
                </div>
              ) : (
                <div
                  className="mt-3 flex items-center justify-between gap-6 border-t pt-2.5"
                  style={{ borderColor: tpl.line }}
                >
                  <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: tpl.ink }}>
                    Total
                  </span>
                  <span className="min-w-24 text-right text-[13px] font-bold tabular-nums" style={{ color: tpl.ink }}>
                    {formatNaira(total)}
                  </span>
                </div>
              )
            ) : null}
          </div>
        </div>

        <div className="relative mt-auto pt-10">
          <p className="text-[12px] leading-[1.85] text-justify" style={{ color: tpl.ink }}>
            {closing}
          </p>
          <p className="mt-4 text-[12px] leading-[1.85] text-justify" style={{ color: tpl.ink }}>
            {thanks}
          </p>

          <div className="mt-10">
            {company.signature ? (
              <div className="relative mb-[-3px] h-16 max-w-[200px]">
                <Image
                  src={company.signature}
                  alt={`Signature of ${company.signatoryName || doc.signatoryRole || company.signatoryRole}`}
                  fill
                  sizes="200px"
                  unoptimized
                  className="object-contain object-left-top"
                />
              </div>
            ) : null}
            <div className="max-w-[200px]" style={{ borderTopWidth: 2, borderTopColor: tpl.primary }} />
            <p
              className="mt-2.5 text-[12px] font-bold uppercase leading-relaxed"
              style={{ color: tpl.titleAccent ? tpl.primary : tpl.ink }}
            >
              {company.signatoryName || doc.signatoryRole || company.signatoryRole}
            </p>
            <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: tpl.muted }}>
              For: {company.name}
            </p>
            {company.signatoryName ? (
              <p className="mt-0.5 text-[12px] leading-relaxed" style={{ color: tpl.muted }}>
                {doc.signatoryRole || company.signatoryRole}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Footer: contact details + socials */}
      {hasFooter ? (
        <div className="relative" style={tpl.band ? { backgroundColor: tpl.bandBg } : undefined}>
          <div
            className="px-[22mm] text-center"
            style={
              tpl.band
                ? { paddingTop: "7mm", paddingBottom: tpl.wave ? "17mm" : "9mm" }
                : {
                    borderTopWidth: 1,
                    borderTopColor: tpl.line,
                    paddingTop: "5mm",
                    paddingBottom: "12mm",
                  }
            }
          >
            <p
              className="mx-auto max-w-[165mm] text-[12px] leading-relaxed"
              style={{ color: tpl.band ? tpl.bandMuted : tpl.muted }}
            >
              {contactLine}
            </p>
            {socials.length ? (
              <div className="mx-auto mt-1.5 flex max-w-[165mm] flex-wrap items-center justify-center gap-x-4 gap-y-1">
                {socials.map((s) => (
                  <span
                    key={s.key}
                    className="inline-flex items-center gap-1.5"
                    style={{ color: tpl.band ? tpl.bandMuted : tpl.faint }}
                  >
                    <SocialIcon kind={s.key} size={12} color="currentColor" />
                    <span className="text-[12px] leading-relaxed">{s.value}</span>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Footer wave */}
      {tpl.wave ? (
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: 96 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 794 96"
            preserveAspectRatio="none"
            className="document-wave"
          >
            <path d={waves.main} fill={tpl.bandBg} />
            <path d={waves.accent} fill={tpl.accentStrip} />
          </svg>
        </div>
      ) : null}
    </div>
  )
}
