"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Utensils, Brain, Image as ImageIcon, LogOut, Users } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      // Verifica se c'è il cookie
      const response = await fetch("/api/auth/check", { method: "GET" })
      if (response.ok) {
        setAuthenticated(true)
      } else {
        router.push("/admin/login")
      }
    } catch {
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/admin/login")
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento...</div>
      </main>
    )
  }

  if (!authenticated) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pannello di Controllo</h1>
            <p className="text-muted-foreground">Gestisci il contenuto del sito</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Esci</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bottone 1: Gestione Asporto */}
          <Link
            href="/admin/asporto"
            className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Utensils className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Gestione Asporto</h2>
            </div>
            <p className="text-muted-foreground">
              Modifica prezzi, nomi, ingredienti, immagini e visibilità dei piatti nella pagina asporto
            </p>
          </Link>

          {/* Bottone 2: Conoscenza AI */}
          <Link
            href="/admin/ai-knowledge"
            className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Conoscenza AI</h2>
            </div>
            <p className="text-muted-foreground">
              Aggiorna orari, festività, eventi e altre informazioni per l&apos;assistente AI
            </p>
          </Link>

          {/* Bottone 3: Contenuti e Immagini */}
          <Link
            href="/admin/content"
            className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ImageIcon className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Contenuti</h2>
            </div>
            <p className="text-muted-foreground">
              Modifica immagini profilo/copertina e titoli/descrizioni di video e foto con doppio tap
            </p>
          </Link>

          {/* Bottone 4: Chi Siamo */}
          <Link
            href="/admin/chi-siamo"
            className="group bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Chi Siamo</h2>
            </div>
            <p className="text-muted-foreground">
              Modifica immagini, titoli e descrizioni dei membri del team
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}

