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
  title: "Real American Grit — Scale Your Home Service Company Past 7 Figures",
  description:
    "The proven course & coaching program for home service business owners. Led by Tom Howard, President of ServiceTitan ($3B company), and Trent Lowenstein, the #1 home services sales rep in the country. $997/yr — limited launch pricing.",
  openGraph: {
    title: "Scale Your Home Service Company Past 7 Figures",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Course + coaching for plumbing, HVAC, roofing & more. Limited launch price: $997/yr.",
    url: "https://www.realamericangrit.com",
    siteName: "Real American Grit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale Your Home Service Company Past 7 Figures",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Limited launch price: $997/yr.",
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
