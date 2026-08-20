import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Free Platform Demo",
  description:
    "See the exact training platform and playbooks behind a $150M+ home service operation — and how to install that standard into every operator on your team.",
  openGraph: {
    title: "Book Your Free Platform Demo | Real American Grit University",
    description:
      "See the exact training platform behind a $150M+ home service operation, and install that 9-figure standard into your team. Book a free walkthrough.",
    url: "https://www.realamericangrit.com/demo",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "The 9-Figure Operator's Playbooks — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Your Free Platform Demo | Real American Grit University",
    description:
      "See the exact training platform behind a $150M+ home service operation. Book a free walkthrough.",
    images: ["/og-bundle.jpg"],
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
