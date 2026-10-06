import localFont from "next/font/local";

// Brand kit fonts (see hf_brand.json): headlines in Recalling Nostalgic Italic
// or Munich Pro Black, body in Munich Pro. Scoped to /mastermind only — the
// rest of the site still uses Bebas Neue everywhere per its current build.
export const nostalgicItalic = localFont({
  src: "../../fonts/mastermind/Recalling Nostalgic Italic.ttf",
  variable: "--font-nostalgic-italic",
  display: "swap",
});

export const munichBlack = localFont({
  src: "../../fonts/mastermind/MunichPro-Black.ttf",
  variable: "--font-munich-black",
  display: "swap",
});

export const munich = localFont({
  src: [
    { path: "../../fonts/mastermind/MunichPro-Regular.ttf", weight: "400" },
    { path: "../../fonts/mastermind/MunichPro-Medium.ttf", weight: "500" },
  ],
  variable: "--font-munich",
  display: "swap",
});
