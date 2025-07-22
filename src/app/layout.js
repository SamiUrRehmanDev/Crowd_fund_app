import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CrowdFund - Empowering Communities Through Crowdfunding",
  description: "Join thousands of donors, volunteers, and communities in creating positive change. Start your campaign or support causes that matter to you.",
  keywords: ["crowdfunding", "donations", "charity", "fundraising", "community", "help", "support"],
  authors: [{ name: "CrowdFund Team" }],
  creator: "CrowdFund Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crowdfund.com",
    title: "CrowdFund - Empowering Communities Through Crowdfunding",
    description: "Join thousands of donors, volunteers, and communities in creating positive change.",
    siteName: "CrowdFund",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CrowdFund Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CrowdFund - Empowering Communities Through Crowdfunding",
    description: "Join thousands of donors, volunteers, and communities in creating positive change.",
    images: ["/images/twitter-card.jpg"],
    creator: "@crowdfund",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
