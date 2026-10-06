import type { Metadata } from "next";
import { nostalgicItalic, munichBlack, munich } from "./fonts";

export const metadata: Metadata = {
  title: "2-Day Business & Sales Mastermind With Tom Howard & Phil Filaski — Las Vegas",
  description:
    "Two days in person with Tom Howard and Phil Filaski — business planning, goal planning, and a hands-on sales workshop. Nov 2-3, 2026, Las Vegas, NV. $4,500 per seat, only 7 remaining.",
  openGraph: {
    title: "2-Day Business & Sales Mastermind With Tom Howard & Phil Filaski",
    description:
      "Business planning, goal planning, and a hands-on sales workshop — in person, at Tom's own residence. Nov 2-3, 2026, Las Vegas, NV.",
    url: "https://www.realamericangrit.com/mastermind",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2-Day Business & Sales Mastermind With Tom Howard & Phil Filaski",
    description:
      "Two days in person with Tom Howard and Phil Filaski. Nov 2-3, 2026, Las Vegas, NV.",
  },
};

export default function MastermindLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${nostalgicItalic.variable} ${munichBlack.variable} ${munich.variable}`}
    >
      {children}
    </div>
  );
}
