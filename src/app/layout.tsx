import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
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
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="3a4a8653-334f-47e3-b991-9c90b79cbdcc" data-file-name="app/layout.tsx">
      <body data-unique-id="5e1a4e2f-3aae-4080-a46f-824d1f572ba2" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>;
}