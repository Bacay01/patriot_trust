// src/app/layout.js
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-public-sans",
});

export const metadata = {
  title: "Patriot Trust",
  description: "Banking that puts you first.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={publicSans.variable}>{children}</body>
    </html>
  );
}