import type { Metadata } from "next";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { Rubik } from "next/font/google";
import Content from "./Content";

export const metadata: Metadata = {
  title: "OP Builders Dollar",
  description: "Optimistic Builders Dollar",
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
