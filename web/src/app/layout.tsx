import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracker from "@/components/VisitorTracker";
import ClickTracker from "@/components/ClickTracker";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TakeYourLounge | Discover Airport Lounges Worldwide",
  description: "Find and book premium airport lounges globally. Browse 2,045 lounges across 703 airports with Priority Pass, Amex, and more.",
  keywords: "airport lounge, priority pass, lounge access, travel, business lounge, VIP lounge, airport wifi, business travel, lounge finder",
  metadataBase: new URL('https://takeyourlounge.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TakeYourLounge - Global Airport Lounge Directory",
    description: "Discover 2,045 premium airport lounges worldwide across 175 countries. Find lounges with Priority Pass, credit card access, and more.",
    type: "website",
    url: "https://takeyourlounge.com",
    siteName: "TakeYourLounge",
    locale: "en_US",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TakeYourLounge - Global Airport Lounge Directory',
    description: 'Discover 2,045 premium airport lounges worldwide. Find your perfect travel sanctuary.',
    site: '@TakeYourLounge',
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
      </body>
    </html>
  );
}
