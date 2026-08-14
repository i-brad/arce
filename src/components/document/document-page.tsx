import type { Client, Company, InvoiceDocument } from "@/lib/data/types";
import {
  companyContactLine,
  companySocials,
  formatLetterDate,
  renderTemplate,
  totalOf,
} from "@/lib/documents/document-utils";
import {
  FLOWER_CENTER_R,
  FLOWER_PETAL_R,
  FLOWER_SPACING,
  flowerPath,
} from "@/lib/documents/patterns";
import {
  CONTACT_ICONS,
  SOCIAL_ICONS,
  SOCIAL_STROKE_WIDTH,
  type IconDef,
} from "@/lib/documents/social-icons";
import {
  footerWaves,
  getTemplate,
  headerWaves,
  wedgeDiagonal,
} from "@/lib/documents/theme";
import { formatNaira } from "@/lib/utils/currency";
import Image from "next/image";
import { useId } from "react";

function SocialIcon({
  icon,
  size,
  color,
}: {
  icon: IconDef;
  size: number;
  color: string;
}) {
  return (
    <svg
      viewBox={icon.viewBox}
      width={size}
      height={size}
      aria-hidden
      focusable="false"
    >
      {icon.shapes.map((shape, i) => {
        const stroke = shape.mode === "stroke";
        if (shape.t === "path") {
          return stroke ? (
            <path
              key={i}
              d={shape.d}
              fill="none"
              stroke={color}
              strokeWidth={SOCIAL_STROKE_WIDTH}
              strokeLinecap="round"
            />
          ) : (
            <path key={i} d={shape.d} fill={color} />
          );
        }
        if (shape.t === "circle") {
          return stroke ? (
            <circle
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill="none"
              stroke={color}
              strokeWidth={SOCIAL_STROKE_WIDTH}
              strokeLinecap="round"
            />
          ) : (
            <circle
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              r={shape.r}
              fill={color}
            />
          );
        }
        if (shape.t === "ellipse") {
          return stroke ? (
            <ellipse
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              rx={shape.rx}
              ry={shape.ry}
              fill="none"
              stroke={color}
              strokeWidth={SOCIAL_STROKE_WIDTH}
              strokeLinecap="round"
            />
          ) : (
            <ellipse
              key={i}
              cx={shape.cx}
              cy={shape.cy}
              rx={shape.rx}
              ry={shape.ry}
              fill={color}
            />
          );
        }
        return (
          <line
            key={i}
            x1={shape.x1}
            y1={shape.y1}
            x2={shape.x2}
            y2={shape.y2}
            fill="none"
            stroke={color}
            strokeWidth={SOCIAL_STROKE_WIDTH}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function DocumentPage({
  doc,
  company,
  client,
}: {
  doc: InvoiceDocument;
  company: Company;
  client?: Client;
}) {
  const tpl = getTemplate(doc.template);
  const patternId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const body = renderTemplate(doc.body, doc);
  const closing = renderTemplate(doc.closing, doc);
  const thanks = renderTemplate(doc.thanks, doc);
  const total = totalOf(doc);
  const waves = footerWaves(794, 96);
  const topWaves = headerWaves(794, 40);
  const contactLine = companyContactLine(company);
  const socials = companySocials(company);
  const wedgeSocials = socials.filter((s) => s.key !== "website");
  const hasFooter = Boolean(contactLine || socials.length);
  const pt = 4 / 3;
  const tile = FLOWER_SPACING * pt;
  const flower = flowerPath(
    tile / 2,
    tile / 2,
    FLOWER_PETAL_R * pt,
    FLOWER_CENTER_R * pt,
  );

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
            className="tiled-pattern pointer-events-none absolute inset-0 z-1"
            style={{
              backgroundImage: `url("${company.patternImage}")`,
              backgroundRepeat: "repeat",
              backgroundSize: "92px 92px",
              opacity: 0.05,
            }}
          />
        ) : tpl.pattern ? (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-1 h-full w-full"
          >
            <defs>
              <pattern
                id={patternId}
                width={tile}
                height={tile}
                patternUnits="userSpaceOnUse"
              >
                <path d={flower.path} fill={tpl.primary} opacity="0.05" />
                <circle
                  cx={flower.centerX}
                  cy={flower.centerY}
                  r={flower.centerR}
                  fill={tpl.primary}
                  opacity="0.05"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        ) : null
      ) : null}

      {tpl.layout === "classic" ? (
        <div className="relative z-10 px-[26mm] pt-[8mm] text-center">
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
          <div
            className="mx-auto mt-3 h-px w-full"
            style={{ backgroundColor: tpl.line }}
          />
          <p
            className="mt-3 text-center text-[11px] tracking-[0.08em]"
            style={{ color: tpl.muted }}
          >
            {formatLetterDate(doc.date)}
          </p>
        </div>
      ) : tpl.layout === "banner" ? (
        <div className="relative z-10" style={{ backgroundColor: tpl.bandBg }}>
          <div className="px-[22mm] pb-2.5 pt-[6mm] text-center">
            {company.logo ? (
              <div
                className="mx-auto flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5"
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
              <p
                className="mx-auto mt-1 text-[10px]"
                style={{ color: tpl.bandMuted }}
              >
                RC {company.regNo}
              </p>
            ) : null}
            <p
              className="mt-2 border-t pt-1.5 text-[11px] tracking-[0.08em]"
              style={{ borderColor: tpl.bandMuted, color: tpl.bandMuted }}
            >
              {formatLetterDate(doc.date)}
            </p>
          </div>
          <div
            className="h-[4px] w-full"
            style={{ backgroundColor: tpl.accentStrip }}
          />
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
          <div className="flex items-start justify-between gap-8 px-[22mm] pb-5 pt-6">
            <div className="flex items-start gap-4">
              {company.logo ? (
                <div
                  className="flex size-13 shrink-0 items-center justify-center rounded-xl bg-white p-1.5"
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
            </div>
          </div>
          <div
            className="h-[4px] w-full"
            style={{ backgroundColor: tpl.accentStrip }}
          />
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
      ) : tpl.layout === "wedge" ? (
        <div className="relative px-[22mm] pt-[9mm]">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[28mm] w-full"
            viewBox="0 0 794 106"
            preserveAspectRatio="none"
          >
            <path d={wedgeDiagonal(794, 106)} fill={tpl.accentStrip} />
          </svg>
          <div className="relative z-10 flex flex-col items-start">
            {company.logo ? (
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={64}
                height={64}
                unoptimized
                className="h-14 w-auto shrink-0 object-contain"
              />
            ) : null}
            {company.tagline ? (
              <p
                className="ml-14 max-w-[85mm] text-[9.5px] italic leading-snug"
                style={{ color: tpl.muted }}
              >
                {company.tagline}
              </p>
            ) : null}
            {doc.showCompanyDetails ? (
              <>
                <p
                  className="mt-1.5 text-[16px] font-bold leading-snug tracking-wide"
                  style={{ color: tpl.ink }}
                >
                  {company.name}
                </p>
                {contactLine ? (
                  <p
                    className="mt-0.5 max-w-[85mm] text-[10px] leading-snug"
                    style={{ color: tpl.muted }}
                  >
                    {contactLine}
                  </p>
                ) : null}
                {company.regNo ? (
                  <p
                    className="mt-0.5 text-[9.5px] leading-snug"
                    style={{ color: tpl.muted }}
                  >
                    RC {company.regNo}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
          <p
            className="relative z-10 mt-3 text-right text-[12px] font-bold tracking-[0.08em]"
            style={{ color: tpl.ink }}
          >
            {formatLetterDate(doc.date)}
          </p>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-8 px-[22mm] pt-[12mm]">
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
              <p
                className="mt-1 max-w-[115mm] text-[10.5px] leading-snug"
                style={{ color: tpl.muted }}
              >
                {contactLine}
              </p>
              {company.regNo ? (
                <p
                  className="mt-0.5 text-[10px] leading-snug"
                  style={{ color: tpl.muted }}
                >
                  RC {company.regNo}
                </p>
              ) : null}
            </div>
          </div>
          <div className="text-right">
            <p
              className="whitespace-nowrap text-[12px] font-bold tracking-[0.08em]"
              style={{ color: tpl.ink }}
            >
              {formatLetterDate(doc.date)}
            </p>
          </div>
        </div>
      )}

      {/* Body */}
      <div
        className="relative flex flex-1 flex-col px-[22mm]"
        style={{
          paddingBottom: tpl.wave ? (hasFooter ? "10mm" : "32mm") : "14mm",
          paddingTop:
            tpl.layout === "classic"
              ? "7mm"
              : tpl.layout === "banner"
                ? "13mm"
                : tpl.layout === "wedge"
                  ? "5mm"
                  : tpl.band
                    ? "14mm"
                    : "9mm",
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
              <p
                className="text-base font-bold leading-relaxed"
                style={{ color: tpl.ink }}
              >
                {client.name}
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: tpl.muted }}
              >
                {client.address}
              </p>
              {client.phone || client.email ? (
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: tpl.muted }}
                >
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

          <p
            className="mt-3 text-[12px] leading-relaxed"
            style={{ color: tpl.ink }}
          >
            {doc.salutation}
          </p>

          <div
            className={
              tpl.layout === "wedge" ? "mt-3 text-center" : "mt-4 text-center"
            }
          >
            {tpl.layout === "wedge" ? (
              <h1
                className="inline-block text-[16px] font-bold uppercase tracking-[0.1em] underline decoration-2 underline-offset-[6px]"
                style={{ color: tpl.ink }}
              >
                {doc.title}
              </h1>
            ) : (
              <>
                <h1
                  className="text-[17px] font-bold uppercase tracking-[0.12em]"
                  style={{ color: tpl.titleAccent ? tpl.primary : tpl.ink }}
                >
                  {doc.title}
                </h1>
                {tpl.titleAccent ? (
                  <div
                    className="mx-auto mt-2 h-0.75 w-16"
                    style={{ backgroundColor: tpl.primary }}
                  />
                ) : null}
              </>
            )}
          </div>

          <p
            className={
              tpl.layout === "wedge"
                ? "mt-3 text-[12px] leading-normal text-justify"
                : "mt-4 text-[12px] leading-[1.85] text-justify"
            }
            style={{ color: tpl.ink }}
          >
            {body}
          </p>

          <p
            className={
              tpl.layout === "wedge"
                ? "mt-3 text-[12px] leading-snug"
                : "mt-4 text-[12px] leading-relaxed"
            }
            style={{ color: tpl.ink }}
          >
            {doc.breakdownHeading}
          </p>

          <div className={tpl.layout === "wedge" ? "mt-1.5" : "mt-3"}>
            {doc.sections.map((section) => (
              <div key={section.id}>
                {section.label ? (
                  tpl.layout === "wedge" ? (
                    <p
                      className="mt-2 text-[12px] font-bold uppercase tracking-wide underline underline-offset-4"
                      style={{ color: tpl.ink }}
                    >
                      {section.label}
                    </p>
                  ) : tpl.titleAccent ? (
                    <p
                      className="mt-3 border-l-[3px] pl-2.5 text-[12px] font-bold uppercase tracking-wide"
                      style={{ borderColor: tpl.primary, color: tpl.primary }}
                    >
                      {section.label}
                    </p>
                  ) : (
                    <p
                      className="mt-3 text-[12px] font-bold uppercase tracking-wide"
                      style={{ color: tpl.ink }}
                    >
                      {section.label}
                    </p>
                  )
                ) : null}
                {section.items.map((item) =>
                  tpl.layout === "wedge" ? (
                    <div
                      key={item.id}
                      className="flex items-baseline justify-between gap-6 py-0.5"
                    >
                      <span
                        className="flex flex-1 items-baseline gap-2 text-[12px] leading-snug"
                        style={{ color: tpl.ink }}
                      >
                        <span
                          aria-hidden
                          className="inline-block size-[6px] shrink-0 rotate-45"
                          style={{ backgroundColor: tpl.primary }}
                        />
                        {item.description}
                      </span>
                      <span
                        className="min-w-24 text-right text-[12px] font-bold tabular-nums"
                        style={{ color: tpl.ink }}
                      >
                        {formatNaira(item.amount)}
                      </span>
                    </div>
                  ) : (
                    <div
                      key={item.id}
                      className="flex items-baseline justify-between gap-6 border-b py-1"
                      style={{ borderColor: tpl.line }}
                    >
                      <span
                        className="flex-1 text-[12px] leading-relaxed"
                        style={{ color: tpl.ink }}
                      >
                        {item.description}
                      </span>
                      <span
                        className="min-w-24 text-right text-[12px] font-semibold tabular-nums"
                        style={{ color: tpl.primary }}
                      >
                        {formatNaira(item.amount)}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ))}
            {doc.showTotal ? (
              tpl.layout === "wedge" ? (
                <div className="mt-1.5 flex items-baseline justify-between gap-6 py-0.5">
                  <span
                    className="flex items-baseline gap-2 text-[12px] font-bold uppercase tracking-wide"
                    style={{ color: tpl.ink }}
                  >
                    <span
                      aria-hidden
                      className="inline-block size-[6px] shrink-0 rotate-45"
                      style={{ backgroundColor: tpl.primary }}
                    />
                    Total
                  </span>
                  <span
                    className="min-w-24 text-right text-[13px] font-bold tabular-nums underline underline-offset-4"
                    style={{ color: tpl.ink }}
                  >
                    {formatNaira(total)}
                  </span>
                </div>
              ) : tpl.totalChip ? (
                <div
                  className="mt-2 flex items-center justify-between gap-6 rounded-[6px] px-3 py-2.5"
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
                  className="mt-2 flex items-center justify-between gap-6 border-t pt-2.5"
                  style={{ borderColor: tpl.line }}
                >
                  <span
                    className="text-[12px] font-bold uppercase tracking-wide"
                    style={{ color: tpl.ink }}
                  >
                    Total
                  </span>
                  <span
                    className="min-w-24 text-right text-[13px] font-bold tabular-nums"
                    style={{ color: tpl.ink }}
                  >
                    {formatNaira(total)}
                  </span>
                </div>
              )
            ) : null}
          </div>
        </div>

        <div className="relative pt-6">
          <p
            className={
              tpl.layout === "wedge"
                ? "text-[12px] leading-normal text-justify"
                : "text-[12px] leading-[1.85] text-justify"
            }
            style={{ color: tpl.ink }}
          >
            {closing}
          </p>
          <p
            className={
              tpl.layout === "wedge"
                ? "mt-2 text-[12px] leading-normal text-justify"
                : "mt-2 text-[12px] leading-[1.85] text-justify"
            }
            style={{ color: tpl.ink }}
          >
            {thanks}
          </p>

          <div className="mt-3">
            {company.signature ? (
              <div className="relative -mb-0.75 h-16 max-w-50">
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
            <div
              className="max-w-50 mt-1.5"
              style={{ borderTopWidth: 2, borderTopColor: tpl.primary }}
            />
            <p
              className="mt-2.5 text-[12px] font-bold uppercase leading-relaxed"
              style={{ color: tpl.titleAccent ? tpl.primary : tpl.ink }}
            >
              {company.signatoryName ||
                doc.signatoryRole ||
                company.signatoryRole}
            </p>

            {company.signatoryName ? (
              <p
                className="mt-0.5 text-[12px] leading-relaxed"
                style={{ color: tpl.muted }}
              >
                {doc.signatoryRole || company.signatoryRole}
              </p>
            ) : null}
            <p
              className="text-[11px] leading-relaxed"
              style={{ color: tpl.muted }}
            >
              For: {company.name}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: contact details + socials */}
      {hasFooter ? (
        tpl.layout === "wedge" ? (
          <div
            className="relative z-2 overflow-hidden"
            style={{ backgroundColor: tpl.bandBg }}
          >
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 794 100"
              preserveAspectRatio="none"
            >
              <path d={wedgeDiagonal(794, 100)} fill={tpl.accentStrip} />
            </svg>
            <div
              className="relative flex items-center justify-between gap-6 px-[22mm]"
              style={{ paddingTop: "6mm", paddingBottom: "6mm" }}
            >
              <div className="space-y-1.5">
                {company.phone ? (
                  <div className="flex items-center gap-2">
                    <SocialIcon
                      icon={CONTACT_ICONS.phone}
                      size={11}
                      color={tpl.bandText}
                    />
                    <span
                      className="text-[11px] leading-snug"
                      style={{ color: tpl.bandText }}
                    >
                      {company.phone}
                    </span>
                  </div>
                ) : null}
                {company.email ? (
                  <div className="flex items-center gap-2">
                    <SocialIcon
                      icon={CONTACT_ICONS.mail}
                      size={11}
                      color={tpl.bandText}
                    />
                    <span
                      className="text-[11px] leading-snug"
                      style={{ color: tpl.bandText }}
                    >
                      {company.email}
                    </span>
                  </div>
                ) : null}
                {company.website ? (
                  <div className="flex items-center gap-2">
                    <SocialIcon
                      icon={SOCIAL_ICONS.website}
                      size={11}
                      color={tpl.bandText}
                    />
                    <span
                      className="text-[11px] leading-snug"
                      style={{ color: tpl.bandText }}
                    >
                      {company.website}
                    </span>
                  </div>
                ) : null}
                {company.address ? (
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">
                      <SocialIcon
                        icon={CONTACT_ICONS.pin}
                        size={11}
                        color={tpl.bandText}
                      />
                    </span>
                    <span
                      className="max-w-[80mm] text-[11px] leading-snug"
                      style={{ color: tpl.bandText }}
                    >
                      {company.address}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <p
                  className="text-right text-[15px] font-bold uppercase leading-snug tracking-[0.08em]"
                  style={{ color: tpl.bandText }}
                >
                  {company.name}
                </p>
                {wedgeSocials.length ? (
                  <div className="flex flex-col items-end gap-1">
                    {wedgeSocials.map((s) => (
                      <span
                        key={s.key}
                        className="inline-flex items-center gap-1.5"
                        style={{ color: tpl.bandText }}
                      >
                        <SocialIcon
                          icon={SOCIAL_ICONS[s.key]}
                          size={11}
                          color={tpl.bandText}
                        />
                        <span className="text-[10.5px] leading-snug">
                          {s.value}
                        </span>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="relative z-2"
            style={tpl.band ? { backgroundColor: tpl.bandBg } : undefined}
          >
            <div
              className="px-[22mm] text-center"
              style={
                tpl.band
                  ? {
                      paddingTop: "4mm",
                      paddingBottom: tpl.wave ? "14mm" : "8mm",
                    }
                  : {
                      borderTopWidth: 1,
                      borderTopColor: tpl.line,
                      paddingTop: "3mm",
                      paddingBottom: "8mm",
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
                      <SocialIcon
                        icon={SOCIAL_ICONS[s.key]}
                        size={12}
                        color="currentColor"
                      />
                      <span className="text-[12px] leading-relaxed">
                        {s.value}
                      </span>
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )
      ) : null}

      {/* Footer wave */}
      {tpl.wave ? (
        <div
          aria-hidden
          className="pointer-events-none absolute z-2 inset-x-0 bottom-0"
          style={{ height: 96 }}
        >
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
  );
}
