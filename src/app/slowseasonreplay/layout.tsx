import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slow Season Profits Training Replay",
  description:
    "Watch the full 2026 Slow Season Profits Sales & Marketing live training replay — the exact playbook behind a $150M+ home service business.",
  openGraph: {
    title: "2026 Slow Season Profits — Live Training Replay | Real American Grit University",
    description:
      "Watch the full Sales & Marketing live training replay — the exact playbook behind a $150M+ home service business.",
    url: "https://www.realamericangrit.com/slowseasonreplay",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "2026 Slow Season Profits Live Training Replay — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "2026 Slow Season Profits — Live Training Replay",
    description:
      "Watch the full Sales & Marketing live training replay from Real American Grit University.",
    images: ["/og-bundle.jpg"],
  },
};

export default function ReplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
