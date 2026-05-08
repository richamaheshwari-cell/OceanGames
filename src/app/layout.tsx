import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeRegistry } from "@/components/ThemeRegistry";
import { NavbarClient } from "@/components/NavbarClient";
import { SITE_LANGUAGE, SITE_URL, buildLocaleAlternates } from "@/lib/seo";

const Footer = dynamic(
  () => import("@/components/Footer").then((m) => ({ default: m.Footer })),
  {
    ssr: true,
  },
);

const SITE_NAME = "TheOceanGame";
const DEFAULT_TITLE = "Online Casino Reviews, Bonuses & Expert Guides";
const TITLE = `${SITE_NAME} | ${DEFAULT_TITLE}`;
const DESCRIPTION =
  "Independent online casino reviews, bonus analysis, game guides, and responsible iGaming resources. Compare top-rated casinos, explore offers, and learn how features work.";

const OG_IMAGE = "/og-responsible.png";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1220",
  colorScheme: "light",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  alternates: buildLocaleAlternates("/"),

  applicationName: SITE_NAME,
  category: "Entertainment",
  publisher: SITE_NAME,
  referrer: "origin-when-cross-origin",

  // Avoid iOS turning numbers into phone links
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",

  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },

  description: DESCRIPTION,

  // Keep keywords modest (Google mostly ignores), but it's fine to include
  keywords: [
    "online casino reviews",
    "casino bonuses",
    "casino guide",
    "slot games",
    "best online casinos",
    "casino strategies",
    "responsible iGaming",
  ],

  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },

  // Optional but useful for search consoles (google-site-verification added in <head> below)
  verification: {
    // google: "GOOGLE_VERIFICATION_CODE",
    // other: { "msvalidate.01": "BING_VERIFICATION_CODE" },
  },

  // Misc meta tags (safe)
  other: {
    "theme-color": "#0B1220",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "content-language": SITE_LANGUAGE,
    rating: "adult",
    "age-restriction": "21+",
    "responsible-gaming": "Informational content only. Gamble responsibly.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ✅ Optional JSON-LD (Organization). Safe and recommended.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/tog_logo.svg`,
    sameAs: [
      // Add your real profiles if any. If none, remove this property.
      // "https://twitter.com/yourhandle",
      // "https://www.facebook.com/yourpage",
    ],
  };

  const siteOrigin = SITE_URL.startsWith("http")
    ? SITE_URL
    : `https://${SITE_URL}`;
  let apiOrigin: string | null = null;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    if (apiBase) apiOrigin = new URL(apiBase).origin;
  } catch {
    // ignore
  }
  const needApiPreconnect =
    apiOrigin && apiOrigin !== new URL(siteOrigin).origin;

  return (
    <html lang={SITE_LANGUAGE}>
      <head>
        <link rel="preconnect" href={siteOrigin} />
        {needApiPreconnect && <link rel="preconnect" href={apiOrigin!} />}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta httpEquiv="content-language" content={SITE_LANGUAGE} />
        <meta
          name="google-site-verification"
          content="O2vzFgzjveqFbUrCyx6ZoxIr4POo-1zi5UR4oRfCFiE"
        />
      </head>
      <body
        style={{
          minHeight: "100vh",
          textRendering: "optimizeLegibility",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        }}
      >
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':new Date().getTime(),event:'gtm.js'});",
          }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-5M6B6VMP"
        />
        <AppRouterCacheProvider>
          {/* HTML comments below appear in page source for easy identification */}
          <script
            type="text/html"
            dangerouslySetInnerHTML={{
              __html: "<!-- Google Tag Manager (noscript) -->",
            }}
          />
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-5M6B6VMP"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
          <script
            type="text/html"
            dangerouslySetInnerHTML={{
              __html: "<!-- End Google Tag Manager (noscript) -->",
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <ThemeRegistry>
            <NavbarClient />
            <main style={{ minHeight: "100vh" }}>{children}</main>
            <Footer />
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
