import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Implementation Call — Real American Grit University",
  description:
    "Schedule your implementation call. We'll upload your whole team into RAG University and assign everyone's role — no guesswork.",
  openGraph: {
    title: "Book Your Implementation Call | Real American Grit University",
    description:
      "Schedule your implementation call. We'll upload your whole team into RAG University and assign everyone's role — no guesswork.",
    url: "https://www.realamericangrit.com/implementation-call",
    siteName: "Real American Grit University",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-bundle.jpg",
        width: 1500,
        height: 788,
        alt: "Book Your Implementation Call — Real American Grit University",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Your Implementation Call | Real American Grit University",
    description:
      "Schedule your implementation call. We'll upload your whole team into RAG University and assign everyone's role — no guesswork.",
    images: ["/og-bundle.jpg"],
  },
};

export default function ImplementationCallLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
