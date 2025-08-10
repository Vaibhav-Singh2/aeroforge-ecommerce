import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/layouts/site-header";
import { SiteFooter } from "@/components/layouts/site-footer";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReduxProvider } from "@/lib/redux/provider";
import { ClerkThemeProvider } from "@/components/providers/clerk-theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anubhav Projects's Lab",
  description:
    "Anubhav Projects's Lab – Explore, print, and repair with our advanced e-commerce platform for 3D printing and repair services.",
  openGraph: {
    title: "Anubhav Projects's Lab",
    description:
      "Explore, print, and repair with our advanced e-commerce platform for 3D printing and repair services.",
    url: "https://your-domain.com",
    siteName: "Anubhav Projects's Lab",
    images: [
      {
        url: "/public/vercel.svg", // Update with your actual image path
        width: 1200,
        height: 630,
        alt: "Anubhav Projects's Lab",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anubhav Projects's Lab",
    description:
      "Explore, print, and repair with our advanced e-commerce platform for 3D printing and repair services.",
    images: ["/public/vercel.svg"], // Update with your actual image path
  },
  keywords: [
    "3D Printing",
    "Repair Services",
    "E-commerce",
    "Anubhav Projects",
    "Online Printing",
    "Product Lab",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <ReduxProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </ReduxProvider>
            <Toaster />
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
