import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trial Setup — Internal",
  robots: { index: false, follow: false },
};

export default function TrialOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
