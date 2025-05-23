import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Detroit Axle Tools",
    template: "%s | Detroit Axle Tools"
  },
  description: "Professional tools for Detroit Axle customer communications and order processing",
  applicationName: "Detroit Axle Tools",
  keywords: ["email", "template", "builder", "detroit axle", "customer communications", "order processing"],
  authors: [{
    name: "Detroit Axle Team"
  }],
  creator: "Detroit Axle Team",
  publisher: "Detroit Axle Team",
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    }, {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon"
    }],
    apple: [{
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Detroit Axle Email Builder"
  },
  formatDetection: {
    telephone: false
  }
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="c55bb0b0-e514-49bb-a9ba-6d7fdcd5bb51" data-file-name="app/layout.tsx">
      <body data-unique-id="23c04154-7ac8-4c44-a7da-13d07c46d2c3" data-file-name="app/layout.tsx">
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>;
}