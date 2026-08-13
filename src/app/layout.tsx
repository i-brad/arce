import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/data/context";
import { AppShell } from "@/components/app-shell";

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
    default: "Acre — Real Estate Invoicing",
    template: "%s · Acre",
  },
  description:
    "Acre turns every payment you receive into a clean one-page acknowledgment letter or invoice. Built for real estate agents.",
  keywords: [
    "real estate invoicing",
    "payment acknowledgment letter",
    "real estate agents",
    "invoice generator",
    "property payment receipt",
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
    title: "Acre — Real Estate Invoicing",
    description:
      "Turn every payment you receive into a clean one-page acknowledgment letter or invoice. Built for real estate agents.",
    locale: "en_NG",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Acre — Real Estate Invoicing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acre — Real Estate Invoicing",
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
        <DataProvider>
          <AppShell>{children}</AppShell>
        </DataProvider>
      </body>
    </html>
  );
}
