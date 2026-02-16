import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "@/components/ThemeWrapper";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const merriweather = Merriweather({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "LuminaReader | Personal eReader",
  description: "A premium web-based eReader for eBooks, Comics, and PDFs.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LuminaReader",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}
      >
        <ThemeWrapper>
          <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {children}
          </div>
        </ThemeWrapper>
      </body>
    </html>
  );
}
