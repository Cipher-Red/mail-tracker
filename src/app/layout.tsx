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
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="7aae4865-9d2e-4f5f-bc5c-ab954e7a2b75" data-file-name="app/layout.tsx">
      <body data-unique-id="f19082ae-d66a-44ca-a3fe-f90ab7ebd678" data-file-name="app/layout.tsx">
        <ThemeProvider defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>;
}