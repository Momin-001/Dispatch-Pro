import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Radio_Canada_Big, Hedvig_Letters_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import NextTopLoader from 'nextjs-toploader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const radioCanadaBig = Radio_Canada_Big({
  variable: "--font-radio-canada-big",
  subsets: ["latin"],
});

const hedvigLettersSans = Hedvig_Letters_Sans({
  variable: "--font-hedvig-letters-sans",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Dispatch Pro",
  description: "Dispatch Pro is a platform for dispatching loads and equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${radioCanadaBig.variable} ${hedvigLettersSans.variable} ${inter.variable} antialiased`}
      >
        <NextTopLoader
          color="#00796B"
          showSpinner={false}
          easing="ease"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
