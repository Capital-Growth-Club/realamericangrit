import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Platform Demo Call",
  description:
    "Get a live walkthrough of the training platform behind a $150M+ home service operation. Grab a time in 60 seconds.",
  openGraph: {
    title: "Book Your Platform Demo Call | Real American Grit University",
    description:
      "Get a live walkthrough of the training platform behind a $150M+ home service operation. Grab a time in 60 seconds.",
    url: "https://www.realamericangrit.com/bookdemo",
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
    title: "Book Your Platform Demo Call | Real American Grit University",
    description:
      "Get a live walkthrough of the training platform behind a $150M+ home service operation.",
    images: ["/og-bundle.jpg"],
  },
};

export default function BookDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
