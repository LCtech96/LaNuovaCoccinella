"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Log per debug
      console.log("Attempting login with:", {
        email: email.trim(),
        passwordLength: password.length
      })

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include" // Importante per i cookie
      })

      const data = await response.json()
      console.log("Login response:", { status: response.status, data })

      if (response.ok) {
        // Aspetta un momento per assicurarsi che il cookie sia impostato
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push("/admin")
        router.refresh() // Forza il refresh per verificare l'autenticazione
      } else {
        const errorMsg = data.error || "Credenziali non valide"
        console.error("Login failed:", errorMsg, data.debug)
        setError(errorMsg + (data.debug ? ` (Debug: ${JSON.stringify(data.debug)})` : ""))
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(`Errore di connessione: ${err.message || "Errore sconosciuto"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-muted-foreground">Accedi al pannello di controllo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="barinellocity@gmail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Debug info - solo in development */}
            {process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const response = await fetch("/api/auth/debug")
                    const data = await response.json()
                    console.log("Debug credentials:", data)
                    alert(`Debug Info:\n\nHardcoded Email: ${data.hardcoded.email}\nHardcoded Password Length: ${data.hardcoded.passwordLength}\n\nSupabase: ${data.supabase ? `Email: ${data.supabase.email}, Password Length: ${data.supabase.passwordLength}` : "Not loaded"}\n\nActive: ${data.activeCredentials.email}`)
                  } catch (err) {
                    console.error("Debug error:", err)
                  }
                }}
                className="w-full bg-muted text-muted-foreground py-2 rounded-lg text-sm hover:bg-muted/80 transition-colors"
              >
                🔍 Debug Credenziali
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}


