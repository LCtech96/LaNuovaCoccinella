"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface AIKnowledge {
  openingHours: string
  closingDays: string[]
  holidays: Array<{ date: string; description: string }>
  events: Array<{ date: string; description: string }>
  additionalInfo: string
}

export default function AdminAIKnowledgePage() {
  const [knowledge, setKnowledge] = useState<AIKnowledge>({
    openingHours: "07:00 - 01:00",
    closingDays: [],
    holidays: [],
    events: [],
    additionalInfo: ""
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadKnowledge()
  }, [])

  const loadKnowledge = async () => {
    try {
      const response = await fetch("/api/ai-knowledge")
      if (response.ok) {
        const data = await response.json()
        setKnowledge(data)
      }
    } catch (error) {
      console.error("Error loading knowledge:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveKnowledge = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/ai-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(knowledge),
      })

      if (response.ok) {
        setMessage("Conoscenza AI salvata con successo!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Errore nel salvataggio")
      }
    } catch (error) {
      setMessage("Errore nel salvataggio")
    } finally {
      setSaving(false)
    }
  }

  const addHoliday = () => {
    setKnowledge({
      ...knowledge,
      holidays: [...knowledge.holidays, { date: "", description: "" }]
    })
  }

  const removeHoliday = (index: number) => {
    const newHolidays = knowledge.holidays.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, holidays: newHolidays })
  }

  const updateHoliday = (index: number, field: "date" | "description", value: string) => {
    const newHolidays = [...knowledge.holidays]
    newHolidays[index] = { ...newHolidays[index], [field]: value }
    setKnowledge({ ...knowledge, holidays: newHolidays })
  }

  const addEvent = () => {
    setKnowledge({
      ...knowledge,
      events: [...knowledge.events, { date: "", description: "" }]
    })
  }

  const removeEvent = (index: number) => {
    const newEvents = knowledge.events.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, events: newEvents })
  }

  const updateEvent = (index: number, field: "date" | "description", value: string) => {
    const newEvents = [...knowledge.events]
    newEvents[index] = { ...newEvents[index], [field]: value }
    setKnowledge({ ...knowledge, events: newEvents })
  }

  const addClosingDay = () => {
    setKnowledge({
      ...knowledge,
      closingDays: [...knowledge.closingDays, ""]
    })
  }

  const removeClosingDay = (index: number) => {
    const newClosingDays = knowledge.closingDays.filter((_, i) => i !== index)
    setKnowledge({ ...knowledge, closingDays: newClosingDays })
  }

  const updateClosingDay = (index: number, value: string) => {
    const newClosingDays = [...knowledge.closingDays]
    newClosingDays[index] = value
    setKnowledge({ ...knowledge, closingDays: newClosingDays })
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Conoscenza AI</h1>
            <p className="text-muted-foreground">Aggiorna orari, festività, eventi e informazioni per l&apos;assistente AI</p>
          </div>
          <button
            onClick={saveKnowledge}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvataggio..." : "Salva"}</span>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Orari di apertura */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Orari di Apertura</h2>
            <input
              type="text"
              value={knowledge.openingHours}
              onChange={(e) => setKnowledge({ ...knowledge, openingHours: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg"
              placeholder="07:00 - 01:00"
            />
          </div>

          {/* Giorni di chiusura */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Giorni di Chiusura</h2>
              <button
                onClick={addClosingDay}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-2">
              {knowledge.closingDays.map((day, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={day}
                    onChange={(e) => updateClosingDay(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                    placeholder="Es: Lunedì"
                  />
                  <button
                    onClick={() => removeClosingDay(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Festività */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Festività</h2>
              <button
                onClick={addHoliday}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-4">
              {knowledge.holidays.map((holiday, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="date"
                    value={holiday.date}
                    onChange={(e) => updateHoliday(index, "date", e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={holiday.description}
                    onChange={(e) => updateHoliday(index, "description", e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                    placeholder="Descrizione festività"
                  />
                  <button
                    onClick={() => removeHoliday(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Eventi */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Eventi Speciali</h2>
              <button
                onClick={addEvent}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi</span>
              </button>
            </div>
            <div className="space-y-4">
              {knowledge.events.map((event, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="date"
                    value={event.date}
                    onChange={(e) => updateEvent(index, "date", e.target.value)}
                    className="px-4 py-2 bg-background border border-border rounded-lg"
                  />
                  <input
                    type="text"
                    value={event.description}
                    onChange={(e) => updateEvent(index, "description", e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-border rounded-lg"
                    placeholder="Descrizione evento"
                  />
                  <button
                    onClick={() => removeEvent(index)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Informazioni Aggiuntive</h2>
            <textarea
              value={knowledge.additionalInfo}
              onChange={(e) => setKnowledge({ ...knowledge, additionalInfo: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg min-h-[200px]"
              placeholder="Aggiungi altre informazioni che l'AI dovrebbe conoscere..."
            />
          </div>
        </div>
      </div>
    </main>
  )
}

