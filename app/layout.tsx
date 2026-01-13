import type { Metadata } from "next"
import { Inter, Playfair_Display, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
})
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap"
})

export const metadata: Metadata = {
  title: "La Nuova Coccinella di Salvo & Family - Pizzeria e Polleria a Terrasini",
  description: "Pizzeria e polleria a Terrasini, Sicilia. Cucina tradizionale con prodotti della massima qualità.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.className} ${playfair.variable} ${cormorant.variable} relative`}>
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src="/sfondo.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              filter: "blur(8px)",
              opacity: 0.5,
              transform: "scale(1.1)"
            }}
          />
          <div className="absolute inset-0 bg-background/40" />
        </div>
        <div className="relative z-10 min-h-screen">
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  )
}
