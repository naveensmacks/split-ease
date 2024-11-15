import type { Metadata } from "next";
import { AR_One_Sans, Quicksand } from "next/font/google";
import "./globals.css";

const font = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Split Ease",
  description: "Split and ease your expenses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className}  bg-secondcolor text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
