import type { Metadata } from "next";
import { Outfit, Rubik } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Real American Grit — Coming Soon",
  description:
    "The proven course & coaching program for home service business owners is almost here. Pre-register to get notified the moment we go live.",
  openGraph: {
    title: "Real American Grit — Coming Soon",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Pre-register to get notified when we launch.",
    url: "https://www.realamericangrit.com",
    siteName: "Real American Grit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Real American Grit — Coming Soon",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Pre-register to get notified when we launch.",
  },
  metadataBase: new URL("https://www.realamericangrit.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${rubik.variable} h-full antialiased`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#1a1a1a]">
        {children}
      </body>
    </html>
  );
}
