import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import VisitorTracker from "@/components/VisitorTracker";
import ClickTracker from "@/components/ClickTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TakeYourLounge | Discover Airport Lounges Worldwide",
  description: "Find and book premium airport lounges globally. Browse 2,256 lounges across 703 airports with Priority Pass, Amex, and more.",
  keywords: "airport lounge, priority pass, lounge access, travel, business lounge, VIP lounge",
  metadataBase: new URL('https://takeyourlounge.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TakeYourLounge - Global Airport Lounge Directory",
    description: "Discover 2,256 airport lounges worldwide across 175 countries",
    type: "website",
    url: "https://takeyourlounge.com",
  },
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
        {children}
      </body>
    </html>
  );
}
