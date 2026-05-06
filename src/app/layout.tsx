import type { Metadata } from "next";
import { Bebas_Neue, Roboto } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Real American Grit University — The 9-Figure Operator's Playbooks",
    template: "%s | Real American Grit University",
  },
  description:
    "The 9 playbooks behind a $1 billion home services company — now video trainings that install a 9-figure standard into every operator on your team.",
  keywords: [
    "home services training",
    "HVAC training",
    "plumbing training",
    "trades coaching",
    "home services SOPs",
    "9-figure operator",
    "operator playbooks",
    "home services operations",
  ],
  authors: [{ name: "Real American Grit University" }],
  openGraph: {
    title: "Real American Grit University — The 9-Figure Operator's Playbooks",
    description:
      "Train every operator on your team with the playbooks behind a $1 billion home services operation.",
    url: "https://www.realamericangrit.com",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "The 9-Figure Operator's Playbooks — complete bundle",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Real American Grit University — The 9-Figure Operator's Playbooks",
    description:
      "Train every operator on your team with the playbooks behind a $1 billion home services operation.",
    images: ["/og-bundle.jpg"],
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
      className={`${bebas.variable} ${roboto.variable} h-full antialiased`}
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
