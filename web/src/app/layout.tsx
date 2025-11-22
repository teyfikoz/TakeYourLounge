import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TakeYourLounge | Discover Airport Lounges Worldwide",
  description: "Find and book premium airport lounges globally. Browse 3,000+ lounges across 700 airports with Priority Pass, Amex, and more.",
  keywords: "airport lounge, priority pass, lounge access, travel, business lounge",
  openGraph: {
    title: "TakeYourLounge - Global Airport Lounge Directory",
    description: "Discover 3,000+ airport lounges worldwide",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
