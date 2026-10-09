import { Inter, JetBrains_Mono, Lexend } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontHeading = Lexend({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
