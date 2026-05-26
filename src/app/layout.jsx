import { Inter, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/nav/Navbar";
import { PLACEHOLDER_USER_ID } from "@/lib/placeholderUser";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sinterklaas Wishlist",
  description: "Manage your Sinterklaas wishes",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col pt-16">
        <Navbar userId={PLACEHOLDER_USER_ID} role="admin" />
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
