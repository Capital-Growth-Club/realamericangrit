import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2-Day Business & Sales Mastermind With Tom Howard — Las Vegas",
  description:
    "Two days in person with Tom Howard — business planning, goal planning, and a hands-on sales workshop. Nov 2-3, 2026, Las Vegas, NV. $4,500 per seat.",
  openGraph: {
    title: "2-Day Business & Sales Mastermind With Tom Howard",
    description:
      "Business planning, goal planning, and a hands-on sales workshop — in person, at Tom's own residence. Nov 2-3, 2026, Las Vegas, NV.",
    url: "https://www.realamericangrit.com/mastermind",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2-Day Business & Sales Mastermind With Tom Howard",
    description:
      "Two days in person with Tom Howard. Nov 2-3, 2026, Las Vegas, NV.",
  },
};

export default function MastermindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
