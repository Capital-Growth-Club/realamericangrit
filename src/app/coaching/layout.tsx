import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The 9-Figure Operator's Playbooks",
  description:
    "Get the 9 playbooks behind a $1 billion home services company — now video trainings that install a 9-figure standard into every operator on your team. Built for HVAC, plumbing, electrical, roofing, and home services owners doing $2M – $10M.",
  openGraph: {
    title: "The 9-Figure Operator's Playbooks | Real American Grit University",
    description:
      "Train every operator on your team — GM, Service Manager, Sales Lead, CSR, Tech — with the exact playbooks behind a $1 billion home services operation.",
    url: "https://www.realamericangrit.com/coaching",
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
    title: "The 9-Figure Operator's Playbooks | Real American Grit University",
    description:
      "Train every operator on your team with the exact playbooks behind a $1 billion home services operation.",
    images: ["/og-bundle.jpg"],
  },
  alternates: {
    canonical: "https://www.realamericangrit.com/coaching",
  },
};

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
