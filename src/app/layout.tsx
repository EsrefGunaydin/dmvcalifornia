import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const GA_MEASUREMENT_ID = "G-5EWVD54H21";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dmvcalifornia.us'),
  title: {
    default: "DMV California Blog | Your Simplified California DMV Guide",
    template: "%s | DMV California"
  },
  description: "DMV California Blog is your ultimate destination to learn about Driver License, Real ID, Driving Test, California DMV Quizzes, DMV Offices, Behind The Wheel Test",
  keywords: ["DMV California", "California DMV", "DMV test", "driving test", "driver license", "Real ID", "DMV quiz", "practice test", "behind the wheel", "DMV offices"],
  authors: [{ name: "DMV California" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.dmvcalifornia.us/",
    siteName: "DMV California Blog",
    title: "DMV California Blog | Your Simplified California DMV Guide",
    description: "DMV California Blog is your ultimate destination to learn about Driver License, Real ID, Driving Test, California DMV Quizzes, DMV Offices, Behind The Wheel Test",
    images: [
      {
        url: "/images/dmv-california-logo.png",
        width: 1200,
        height: 630,
        alt: "DMV California Blog"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DMV California Blog | Your Simplified California DMV Guide",
    description: "DMV California Blog is your ultimate destination to learn about Driver License, Real ID, Driving Test, California DMV Quizzes, DMV Offices, Behind The Wheel Test",
    images: ["/images/dmv-california-logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },
  verification: {
    google: 'your-google-verification-code', // Add when available
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DMV California",
    "url": "https://www.dmvcalifornia.us",
    "logo": "https://www.dmvcalifornia.us/images/dmv-california-logo.png",
    "description": "DMV California Blog is your ultimate destination to learn about Driver License, Real ID, Driving Test, California DMV Quizzes, DMV Offices, Behind The Wheel Test",
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DMV California Blog",
    "url": "https://www.dmvcalifornia.us",
    "description": "Your Simplified California DMV Guide",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.dmvcalifornia.us/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google AdSense - Load in head with beforeInteractive */}
        <Script
          id="google-adsense"
          strategy="beforeInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7030490358552434"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />

        {/* Schema.org Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {children}
      </body>
    </html>
  );
}
