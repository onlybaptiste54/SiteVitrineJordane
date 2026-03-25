import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MERINO - Estimation Immobilière | Grand Nancy",
  description: "Vendez votre bien vite et au bon prix avec MERINO. Obtenez une estimation gratuite en 2 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${rubik.variable} font-sans antialiased bg-merino-ecru text-merino-black min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
