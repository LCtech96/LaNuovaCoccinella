import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
})
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "La Nuova Coccinella di Salvo & Family - Pizzeria e Polleria a Terrasini",
  description:
    "Pizzeria e polleria a Terrasini, Sicilia. Cucina tradizionale con prodotti della massima qualità.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${inter.className} ${playfair.variable} ${cormorant.variable} relative`}
      >
        <div className="site-bg" aria-hidden="true" />
        <div className="relative z-10 min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
