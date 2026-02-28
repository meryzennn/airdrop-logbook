import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Footer from "@/components/Footer";
import StyledComponentsRegistry from "./StyledComponentsRegistry";

const inter = Inter({ subsets: ["latin"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://zendrop-logbook.vercel.apphttps://zendrop-logbook.vercel.app"; // <-- ganti

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "Airdrop Logbook",
    template: "%s • Airdrop Logbook",
  },
  description: "Track your airdrop tasks efficiently",

  // Good defaults for SEO
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Airdrop Logbook",
    title: "Airdrop Logbook",
    description: "Track your airdrop tasks efficiently",
    // images: [{ url: "/og.png", width: 1200, height: 630, alt: "Airdrop Logbook" }],
  },

  twitter: {
    card: "summary_large_image",
    title: "Airdrop Logbook",
    description: "Track your airdrop tasks efficiently",
    // images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 min-h-screen`}
      >
        <StyledComponentsRegistry>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
