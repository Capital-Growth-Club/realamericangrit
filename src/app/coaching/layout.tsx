import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real American Grit — Scale Your Home Service Company Past 7 Figures",
  description:
    "The proven course & coaching program for home service business owners. Led by Tom Howard, President of ServiceTitan ($3B company), and Trent Lowenstein, the #1 home services sales rep in the country. $997/mo — limited launch pricing.",
  openGraph: {
    title: "Scale Your Home Service Company Past 7 Figures",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Course + coaching for plumbing, HVAC, roofing & more. Limited launch price: $997/mo.",
    url: "https://www.realamericangrit.com/coaching",
    siteName: "Real American Grit",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scale Your Home Service Company Past 7 Figures",
    description:
      "The proven system from the President of ServiceTitan & the #1 home services sales rep. Limited launch price: $997/mo.",
  },
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
