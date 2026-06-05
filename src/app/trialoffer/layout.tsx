import type { Metadata } from "next";

const title = "Trial Offer — Full Access Standard";
const description =
  "Free trial access to The 9-Figure Operator's Playbooks. Standard tier — every department, every operator on your team.";

export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: false },
  openGraph: {
    title,
    description,
    images: [
      {
        url: "/Social Sharing Images.png",
        width: 1920,
        height: 1080,
        alt: "Real American Grit University — Trial Offer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/Social Sharing Images.png"],
  },
};

export default function TrialOfferLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
