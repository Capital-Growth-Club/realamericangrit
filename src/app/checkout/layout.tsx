import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get the 9-Figure Operator's Playbooks",
  description:
    "The complete sales, marketing & operations playbook library behind a $150M+ home service company — train your whole team on the exact system we use ourselves.",
  openGraph: {
    title: "Get the 9-Figure Operator's Playbooks | Real American Grit University",
    description:
      "The complete playbook library behind a $150M+ home service company. Train your whole team on the exact sales, marketing & ops system.",
    url: "https://www.realamericangrit.com/checkout",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "The 9-Figure Operator's Playbooks — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Get the 9-Figure Operator's Playbooks | Real American Grit University",
    description:
      "The complete playbook library behind a $150M+ home service company — train your whole team on the exact system.",
    images: ["/og-bundle.jpg"],
  },
};

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
