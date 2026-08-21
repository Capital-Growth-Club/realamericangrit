import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Guide: What To Charge — Pricing HVAC & Plumbing Work",
  description:
    "The contractor's guide to pricing HVAC & plumbing work so you actually make money. From Tom Howard, the operator behind a $150M+ home service business. Download free.",
  openGraph: {
    title: "Free Guide: Price Your HVAC & Plumbing Work to Actually Make Money",
    description:
      "The contractor's pricing guide from Tom Howard — markup vs. margin, overhead per man-day, billable efficiency, and pricing to a net number. Download free.",
    url: "https://www.realamericangrit.com/pricingguide",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "What To Charge — The Pricing Guide by Tom Howard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Guide: Price Your HVAC & Plumbing Work to Actually Make Money",
    description:
      "The contractor's pricing guide from Tom Howard. Download free.",
    images: ["/og-bundle.jpg"],
  },
};

export default function PricingGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
