import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./styles/landing.css";
import "./styles/onboarding.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CALAFDOON — Find Your Person",
    template: "%s · CALAFDOON",
  },
  description:
    "A modern matchmaking platform for meaningful relationships and marriage, built with Somali communities worldwide.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
