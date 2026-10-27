import type { Metadata } from "next";
import { nostalgicItalic, munichBlack, munich } from "./fonts";

export const metadata: Metadata = {
  title: "2-Day Business & Sales Mastermind With Tom Howard — Las Vegas",
  description:
    "Two days in person with Tom Howard — business planning, goal planning, and a hands-on sales workshop. Nov 20-21, 2026, Las Vegas, NV. $4,500 per seat.",
  openGraph: {
    title: "2-Day Business & Sales Mastermind With Tom Howard",
    description:
      "Business planning, goal planning, and a hands-on sales workshop — in person, at Tom's own residence. Nov 20-21, 2026, Las Vegas, NV.",
    url: "https://www.realamericangrit.com/nov20mastermind",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "2-Day Business & Sales Mastermind With Tom Howard",
    description:
      "Two days in person with Tom Howard. Nov 20-21, 2026, Las Vegas, NV.",
  },
};

export default function MastermindNov20Layout({
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
