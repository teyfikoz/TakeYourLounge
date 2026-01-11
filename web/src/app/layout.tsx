import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracker from "@/components/VisitorTracker";
import ClickTracker from "@/components/ClickTracker";
import CookieConsent from "@/components/CookieConsent";
import LoungeFinderWizard from "@/components/lounge-finder-wizard";
import AIConciergeChat from "@/components/ai-concierge-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TakeYourLounge | Discover 2,045+ Airport Lounges Worldwide with AI Concierge",
    template: "%s | TakeYourLounge"
  },
  description: "Find and compare 2,045+ premium airport lounges across 703 airports in 175 countries. AI-powered lounge finder, Priority Pass, Amex Centurion, Plaza Premium access. Get personalized lounge recommendations instantly.",
  keywords: "airport lounge, airport lounge finder, priority pass lounges, lounge access, travel lounge, business lounge, VIP lounge, airport wifi, business travel, lounge finder, amex centurion lounge, plaza premium lounge, airport lounge reviews, best airport lounges, airport lounge guide, lounge pass, day pass lounge, airport lounge amenities, AI lounge concierge, airport lounge comparison",
  authors: [{ name: "Tech Sync Analytica LLC" }],
  creator: "Tech Sync Analytica LLC",
  publisher: "Tech Sync Analytica LLC",
  metadataBase: new URL('https://takeyourlounge.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TakeYourLounge - AI-Powered Global Airport Lounge Directory | 2,045+ Lounges",
    description: "Discover and compare 2,045+ premium airport lounges worldwide with our AI concierge. Priority Pass, Amex, and credit card access. Find your perfect travel sanctuary across 175 countries.",
    type: "website",
    url: "https://takeyourlounge.com",
    siteName: "TakeYourLounge",
    locale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TakeYourLounge - Global Airport Lounge Directory"
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TakeYourLounge - AI-Powered Airport Lounge Discovery',
    description: 'Discover 2,045+ premium airport lounges worldwide with AI assistance. Priority Pass, Amex, and more. Find your perfect travel sanctuary.',
    site: '@TakeYourLounge',
    creator: '@TakeYourLounge',
    images: ['/twitter-image.jpg']
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TakeYourLounge'
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
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'travel',
};

export const viewport = {
  themeColor: '#9333ea',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleAnalytics />
        <VisitorTracker />
        <ClickTracker />
        <CookieConsent />
        {children}
        <LoungeFinderWizard />
        <AIConciergeChat />
      </body>
    </html>
  );
}
