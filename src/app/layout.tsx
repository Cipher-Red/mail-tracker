import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProviderWrapper } from "@/components/theme-provider-wrapper";
import { DevtoolsProvider } from 'creatr-devtools';
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
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="a16b9ad5-ea6d-4f81-9d73-a342de6ebb49" data-file-name="app/layout.tsx">
      <body className="min-h-screen flex flex-col" data-unique-id="a679ad54-7d24-4d44-8490-0ce5951d2cf0" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          <div className="flex-1" data-unique-id="e8a459c5-ddf2-4649-b623-a49b49de8b65" data-file-name="app/layout.tsx" data-dynamic-text="true">
            {children}
          </div>
          <footer className="py-4 border-t border-border bg-accent/10" data-unique-id="8235e755-d85e-4d01-8ec5-23ba80232e5e" data-file-name="app/layout.tsx">
            <div className="container mx-auto text-center text-sm text-muted-foreground" data-unique-id="edb556bf-3cb8-44fe-8574-19a50fbd718c" data-file-name="app/layout.tsx">
              <p data-unique-id="386b0398-47ea-47bc-acbe-905bcafbdf3e" data-file-name="app/layout.tsx">
                <span className="editable-text" data-unique-id="fc5abede-1e20-4f15-8201-aa631632b1c7" data-file-name="app/layout.tsx">Developed by </span>
                <a href="https://ctrl-department.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors" data-unique-id="8ca94a91-f5a8-4f83-8af5-2197f4f6a830" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="a23c2285-250a-4fc9-a135-e414d413830f" data-file-name="app/layout.tsx">Ctrl-Department</span>
                </a>
                <a href="/admin" className="ml-4 px-3 py-1 bg-primary text-white rounded-md text-xs hover:bg-primary/90 transition-colors" data-unique-id="91d03e3f-f2d7-44c9-baea-1227a70b6328" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="540768e8-6078-428d-9ed0-04e11aa12118" data-file-name="app/layout.tsx">Admin Panel</span>
                </a>
              </p>
            </div>
          </footer>
        </ThemeProviderWrapper>
      </body>
    </html>;
}