import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://invoicing.worksbybrad.xyz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  applicationName: "Acre",
  title: {
    default: "Acre — Invoicing & Acknowledgment Letters",
    template: "%s · Acre",
  },
  description:
    "Acre turns every payment you receive into a clean one-page acknowledgment letter or invoice, ready to send to any client.",
  keywords: [
    "invoicing",
    "payment acknowledgment letter",
    "invoice generator",
    "payment receipt",
    "Acre",
  ],
  authors: [{ name: "Works by Brad" }],
  creator: "Works by Brad",
  publisher: "Works by Brad",
  category: "business",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Acre",
    title: "Acre — Invoicing & Acknowledgment Letters",
    description:
      "Turn every payment you receive into a clean one-page acknowledgment letter or invoice, ready to send to any client.",
    locale: "en_NG",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Acre — Invoicing & Acknowledgment Letters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acre — Invoicing & Acknowledgment Letters",
    description:
      "Turn every payment you receive into a clean one-page acknowledgment letter or invoice.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#142820",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
