import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import { I18nProvider } from "@/app/lib/i18n/i18n-context"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
 
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The QR Tool",
  description:
    "Free online QR tool that allows you to read, create, and manage QR codes instantly. Easy to use, no installation required.",
  keywords: "QR code tool, QR code reader, QR code generator, QR code scanner, create QR code, manage QR codes",
  authors: [{ name: "Mohammad" }],
  openGraph: {
    title: "The QR Tool .",
    description:
      "Free online QR tool that allows you to read, create, and manage QR codes instantly. Easy to use, no installation required.",
    url: "https://the-mohammad.is-a.dev",
    siteName: "The QR Tool",
    images: [
      {
        url: "https://the-mohammad.is-a.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "The QR Tool Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Tool .",
    description:
      "Free online QR tool that allows you to scan, create, or decode QR codes instantly. Easy to use, no installation required.",
    images: ["https://mohammad.is-a.dev/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    apple: { url: "/apple-touch-icon.png" },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="canonical" href="https://the-mohammad.is-a.dev" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="google-adsense-account" content="ca-pub-3460143338187515" />
      </head>
      <body className={inter.className}>
        <Suspense>
          <I18nProvider>{children}</I18nProvider>
        </Suspense>
        <Toaster />
        <Analytics />
        <Script id="schema-org" type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "QR Tool",
              "description": "Free online QR tool that allows you to scan, create, or decode QR codes instantly.",
              "url": "https://mohammad.is-a.dev",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </Script>
      </body>
    </html>
  )
}
