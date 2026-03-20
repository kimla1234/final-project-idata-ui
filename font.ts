import { Inter, Suwannaphum } from "next/font/google";

export const suwannaphum = Suwannaphum({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["khmer"],
  display: "swap",
  variable: "--font-suwannaphum",
});

export const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});