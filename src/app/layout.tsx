import type { Metadata } from "next";
import { AR_One_Sans, Quicksand } from "next/font/google";
import "./globals.css";

const font = Quicksand({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Split Ease",
//   description: "Split and ease your expenses.",
// };

export const metadata: Metadata = {
  title: "SplitEase - Free Expense Splitter",
  description: "View and manage your expense groups with ease.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SplitEase - Free Expense Splitter",
    description: "View and manage your expense groups with ease.",
    url: "https://app.splitease.net/app/groups",
    images: ["https://splitease.net/social-preview.png"],
  },
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
