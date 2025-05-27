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
  return <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning data-unique-id="34d2b8b7-95c9-4246-a167-00931da19a21" data-file-name="app/layout.tsx">
      <body className="min-h-screen flex flex-col" data-unique-id="bf0fa4e3-5892-408e-b487-cc074c8078dd" data-file-name="app/layout.tsx">
        <ThemeProviderWrapper defaultTheme="system">
          <div className="flex-1" data-unique-id="438f6a74-65b9-49f3-bed6-a282cad35c46" data-file-name="app/layout.tsx" data-dynamic-text="true">
            {children}
          </div>
          <footer className="py-4 border-t border-border bg-accent/10" data-unique-id="0d3475dc-8077-4449-9e18-4425dc6696b4" data-file-name="app/layout.tsx">
            <div className="container mx-auto text-center text-sm text-muted-foreground" data-unique-id="f143aba9-f71a-40de-bf7b-16512906e3e9" data-file-name="app/layout.tsx">
              <p data-unique-id="321fcff2-4d20-4c75-a625-db73128147b4" data-file-name="app/layout.tsx">
                <span className="editable-text" data-unique-id="ffed01aa-5abb-4898-a421-f38b9d23c59b" data-file-name="app/layout.tsx">Developed by </span>
                <a href="https://ctrl-department.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline transition-colors" data-unique-id="ad1d4217-bf38-4eb9-8fbc-744c58ffbbe7" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="d2637601-8357-46a4-a32c-4b345b92016a" data-file-name="app/layout.tsx">Ctrl-Department</span>
                </a>
                <a href="/admin" className="ml-4 px-3 py-1 bg-primary text-white rounded-md text-xs hover:bg-primary/90 transition-colors" data-unique-id="078dc1af-ee10-4785-8018-d910bcc096a9" data-file-name="app/layout.tsx">
                  <span className="editable-text" data-unique-id="063cf8c9-49d7-4353-94df-f1df13378a20" data-file-name="app/layout.tsx">Admin Panel</span>
                </a>
              </p>
            </div>
          </footer>
        </ThemeProviderWrapper>
      </body>
    </html>;
}