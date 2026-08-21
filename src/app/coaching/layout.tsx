import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a Private Coaching Call With Tom Howard",
  description:
    "One-on-one coaching with the operator behind a $150M+ home service business. Bring your numbers and bottlenecks and walk away with a clear next move.",
  openGraph: {
    title: "Private Coaching With Tom Howard | Real American Grit University",
    description:
      "One-on-one coaching with the operator behind a $150M+ home service business. Grab a time that works for you.",
    url: "https://www.realamericangrit.com/coaching",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "Private Coaching With Tom Howard — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Coaching With Tom Howard | Real American Grit University",
    description:
      "One-on-one coaching with the operator behind a $150M+ home service business.",
    images: ["/og-bundle.jpg"],
  },
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
