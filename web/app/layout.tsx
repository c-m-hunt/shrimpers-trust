import React from "react";
import type { Metadata } from "next";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import localFont from "next/font/local";
import Navbar from "./components/navbar.tsx";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Shrimpers Trust",
  description: "Tooling for Shrimpers Trust",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Auth0Provider>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <main className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              {children}
            </div>
          </main>
        </body>
      </Auth0Provider>
    </html>
  );
}
