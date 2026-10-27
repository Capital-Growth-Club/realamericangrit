import type { Metadata } from "next";
import { nostalgicItalic, munichBlack, munich } from "./fonts";

export const metadata: Metadata = {
  title: "Registration Closed — Real American Grit University",
  description:
    "Registration for this mastermind with Tom Howard has closed. See the next upcoming mastermind.",
  openGraph: {
    title: "Registration Closed — Real American Grit University",
    description:
      "Registration for this mastermind with Tom Howard has closed. See the next upcoming mastermind.",
    url: "https://www.realamericangrit.com/mastermind",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Registration Closed — Real American Grit University",
    description:
      "Registration for this mastermind with Tom Howard has closed.",
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
