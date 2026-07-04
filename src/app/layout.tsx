import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ExitIntentPopup from "@/components/ExitIntentPopup";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const GA_MEASUREMENT_ID = "G-5EWVD54H21";

export const metadata: Metadata = {
  metadataBase: new URL('https://dmvcalifornia.us'),
  manifest: '/manifest.json',
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
    url: "https://dmvcalifornia.us/",
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
    "url": "https://dmvcalifornia.us",
    "logo": "https://dmvcalifornia.us/images/dmv-california-logo.png",
    "description": "DMV California Blog is your ultimate destination to learn about Driver License, Real ID, Driving Test, California DMV Quizzes, DMV Offices, Behind The Wheel Test",
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "DMV California Blog",
    "url": "https://dmvcalifornia.us",
    "description": "Your Simplified California DMV Guide",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://dmvcalifornia.us/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google AdSense — `lazyOnload` defers until after the page is
            fully loaded. `beforeInteractive` (the previous setting) blocked
            page interactivity until AdSense finished loading, accounting for
            most of the 3,350ms mobile TBT and the 16.7s LCP. Google itself
            recommends `lazyOnload` for AdSense scripts. */}
        <Script
          id="google-adsense"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7030490358552434"
          crossOrigin="anonymous"
        />

        {/* Google Analytics — gtag.js doesn't need to fire before paint.
            `lazyOnload` lets it run after the page is interactive without
            adding to TBT or main-thread work. */}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                send_page_view: false,
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
        <ExitIntentPopup />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
