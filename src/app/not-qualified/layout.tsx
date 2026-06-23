import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not A Fit",
  robots: { index: false, follow: false },
};

export default function NotQualifiedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
