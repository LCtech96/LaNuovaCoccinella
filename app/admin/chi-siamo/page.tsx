"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Trash2, Plus, Eye, EyeOff, Upload } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: number
  image: string
  title: string
  description: string
  layout: "left" | "right"
  visible?: boolean
}

export default function AdminChiSiamoPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      const response = await fetch("/api/chi-siamo", {
        cache: "no-store"
      })
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data || [])
      }
    } catch (error) {
      console.error("Error loading team members:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const response = await fetch("/api/chi-siamo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teamMembers),
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Modifiche salvate con successo!" })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await response.json()
        setMessage({ type: "error", text: error.error || "Errore nel salvataggio" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Errore nel salvataggio" })
    } finally {
      setSaving(false)
    }
  }

  const updateMember = (index: number, field: keyof TeamMember, value: any) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], [field]: value }
    setTeamMembers(updated)
  }

  const deleteMember = (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questo membro del team?")) {
      const updated = teamMembers.filter((_, i) => i !== index)
      setTeamMembers(updated)
    }
  }

  const toggleVisibility = (index: number) => {
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], visible: !updated[index].visible }
    setTeamMembers(updated)
  }

  const addMember = () => {
    const newMember: TeamMember = {
      id: Date.now(),
      image: "",
      title: "",
      description: "",
      layout: "left",
      visible: true
    }
    setTeamMembers([...teamMembers, newMember])
  }

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Verifica che sia un'immagine
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Il file deve essere un&apos;immagine" })
      return
    }

    // Verifica la dimensione del file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "L&apos;immagine deve essere inferiore a 5MB" })
      return
    }

    // Crea un URL temporaneo per l'anteprima immediata
    const previewUrl = URL.createObjectURL(file)
    
    // Aggiorna immediatamente con l'anteprima
    const updated = [...teamMembers]
    updated[index] = { ...updated[index], image: previewUrl }
    setTeamMembers(updated)

    // Genera un nome file univoco
    const fileName = `team-${teamMembers[index].id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const imagePath = `/team/${fileName}`
    
    try {
      // Prova a caricare l'immagine convertendola in base64 e salvandola in Supabase
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          // Converti l'immagine in base64
          const base64Image = reader.result as string
          
          // Salva i dati dell'immagine in Supabase come base64 temporaneamente
          // In futuro potresti usare Supabase Storage per un approccio migliore
          const response = await fetch("/api/upload/chi-siamo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberId: teamMembers[index].id.toString(),
              fileName: fileName,
              imageData: base64Image,
              imagePath: imagePath
            }),
          })

          if (response.ok) {
            const data = await response.json()
            // Aggiorna con il percorso reale dell'immagine
            updated[index] = { ...updated[index], image: data.imageUrl || imagePath }
            setTeamMembers(updated)
            setMessage({ type: "success", text: "Immagine caricata con successo!" })
            setTimeout(() => setMessage(null), 3000)
            
            // Rilascia l'URL temporaneo
            URL.revokeObjectURL(previewUrl)
          } else {
            // Se l'upload fallisce, usa il percorso del file
            updated[index] = { ...updated[index], image: imagePath }
            setTeamMembers(updated)
            setMessage({ 
              type: "success", 
              text: `Immagine selezionata. Carica il file "${fileName}" nella cartella public/team/ oppure usa il percorso: ${imagePath}` 
            })
            setTimeout(() => setMessage(null), 5000)
          }
        } catch (error) {
          console.error("Error uploading image:", error)
          // In caso di errore, usa il percorso del file
          updated[index] = { ...updated[index], image: imagePath }
          setTeamMembers(updated)
          setMessage({ 
            type: "error", 
            text: "Errore durante l&apos;upload. Usa il percorso manuale o carica l&apos;immagine nella cartella public/team/" 
          })
          setTimeout(() => setMessage(null), 5000)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing image:", error)
      // In caso di errore, usa il percorso del file
      updated[index] = { ...updated[index], image: imagePath }
      setTeamMembers(updated)
      setMessage({ 
        type: "error", 
        text: "Errore durante l&apos;elaborazione. Usa il percorso manuale." 
      })
      setTimeout(() => setMessage(null), 5000)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin")}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-4xl font-bold mb-2">Gestione Chi Siamo</h1>
              <p className="text-muted-foreground">Modifica immagini, titoli e descrizioni dei membri del team</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? "Salvataggio..." : "Salva"}</span>
          </button>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                : "bg-red-500/20 text-red-400 border border-red-500/50"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Add Member Button */}
        <div className="mb-6">
          <button
            onClick={addMember}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Aggiungi Membro</span>
          </button>
        </div>

        {/* Team Members */}
        <div className="space-y-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">Membro #{index + 1}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors"
                    title={member.visible !== false ? "Nascondi" : "Mostra"}
                  >
                    {member.visible !== false ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteMember(index)}
                    className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Immagine</label>
                  <div className="relative aspect-square max-w-xs rounded-lg overflow-hidden border border-border group cursor-pointer">
                    {member.image ? (
                      <>
                        <Image
                          src={member.image}
                          alt={member.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">Clicca per cambiare</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm">Nessuna immagine</span>
                        <span className="text-xs mt-1">Clicca per caricare</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <input
                    type="text"
                    value={member.image}
                    onChange={(e) => updateMember(index, "image", e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    placeholder="/path/to/image.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Clicca sull&apos;immagine per caricare un nuovo file, oppure inserisci il percorso manualmente
                  </p>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  {/* Layout */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Layout</label>
                    <select
                      value={member.layout}
                      onChange={(e) => updateMember(index, "layout", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                    >
                      <option value="left">Immagine a sinistra</option>
                      <option value="right">Immagine a destra</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Titolo</label>
                    <input
                      type="text"
                      value={member.title}
                      onChange={(e) => updateMember(index, "title", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                      placeholder="Titolo del membro"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Descrizione</label>
                    <textarea
                      value={member.description}
                      onChange={(e) => updateMember(index, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg min-h-[120px]"
                      placeholder="Descrizione del membro"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teamMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nessun membro del team presente. Clicca su &quot;Aggiungi Membro&quot; per iniziare.</p>
          </div>
        )}
      </div>
    </main>
  )
}

