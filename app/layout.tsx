import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { BookmarkProvider } from "@/lib/context/BookmarkContext"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookMarker - Organize Your Bookmarks",
  description: "A modern bookmark manager to organize and manage your favorite links and resources efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BookmarkProvider>
          {children}
        </BookmarkProvider>
      </body>
    </html>
  );
}
