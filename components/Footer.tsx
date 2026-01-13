"use client"

import { useState } from "react"
import { Facebook, MessageCircle, X } from "lucide-react"

export function Footer() {
  const [showDisclaimer, setShowDisclaimer] = useState<string | null>(null)

  const handleClick = (platform: string) => {
    setShowDisclaimer(platform)
    setTimeout(() => setShowDisclaimer(null), 3000)
  }

  return (
    <>
      <footer className="bg-background border-t border-border py-8 pb-24 md:pb-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
            <button
              onClick={() => handleClick("facebook")}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </button>
            <a
              href="https://wa.me/393289571052"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Created by{" "}
              <a
                href="https://facevoice.ai/home"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                facevoice.ai
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border rounded-lg p-6 mx-4 max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Avviso</h3>
              <button
                onClick={() => setShowDisclaimer(null)}
                className="p-1 rounded hover:bg-accent"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-muted-foreground">Aggiorneremo presto questa funzione</p>
          </div>
        </div>
      )}
    </>
  )
}

