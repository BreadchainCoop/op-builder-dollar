import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Rubik } from "next/font/google";
import Content from "./Content";

export const metadata: Metadata = {
  title: "OP Builders Dollar",
  description: "Optimistic Builders Dollar",
  openGraph: {
    title: "OP Builders Dollar",
    description: "Optimistic Builders Dollar",
    url: "https://obdollar.xyz/",
    siteName: "OP Builders Dollar",
    images: [
      {
        url: "https://obdollar.xyz/images/preview.png",
        width: 800,
        height: 600,
        alt: "Optimistic Builders Dollar",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OP Builders Dollar",
    description: "Optimistic Builders Dollar",
    images: ["https://obdollar.xyz/images/preview.png"],
  },
};

const rubik = Rubik({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/logo.svg" type="image/png" />
      </head>
      <body className={`${rubik.className} bg-background text-foreground`}>
        <Content>{children}</Content>
      </body>
    </html>
  );
}
