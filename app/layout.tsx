import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { websiteSchema, organizationSchema } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://numerica247.vercel.app"),
  title: "Numerica - Gaming Hub",
  description: "Play classic logic games including Tic-Tac-Toe, Memory Card, and Minesweeper. Challenge yourself with multiple difficulty levels and track your scores!",
  keywords: ["games", "logical games", "online games", "tic-tac-toe", "memory game", "minesweeper", "puzzle games"],
  authors: [{ name: "Numerica Team" }],
  manifest: "/manifest.json",
  verification: {
    google: "JhATpWCNUbrrsgR6PDhMEhBSe5Lj95up3U2aFytYXWM",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Numerica - Gaming Hub",
    description: "Play classic logic games including Tic-Tac-Toe, Memory Card, and Minesweeper. Challenge yourself with multiple difficulty levels!",
    type: "website",
    url: "https://numerica247.vercel.app",
    siteName: "Numerica",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Numerica - Gaming Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Numerica - Gaming Hub",
    description: "Play classic logic games including Tic-Tac-Toe, Memory Card, and Minesweeper!",
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
