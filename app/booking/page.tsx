"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { useState } from "react"
import { Calendar, Users, Mail, Phone, User, CheckCircle } from "lucide-react"

export default function BookingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "",
    date: "",
    time: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Formatta la data in italiano
    const dateObj = new Date(formData.date)
    const formattedDate = dateObj.toLocaleDateString("it-IT", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    })

    // Crea il messaggio WhatsApp
    const message = `*RICHIESTA DI PRENOTAZIONE - La Nuova Coccinella di Salvo & Family*\n\n` +
      `⚠️ *ATTENZIONE: Questa è una RICHIESTA di prenotazione, non una prenotazione confermata.*\n` +
      `La disponibilità verrà valutata dal proprietario del locale.\n\n` +
      `*Dettagli della richiesta:*\n` +
      `👤 Nome: ${formData.name}\n` +
      `📧 Email: ${formData.email}\n` +
      `📱 Telefono: ${formData.phone}\n` +
      `👥 Numero di persone: ${formData.guests}\n` +
      `📅 Data: ${formattedDate}\n` +
      `🕐 Orario: ${formData.time}\n\n` +
      `Grazie per la richiesta! Ti contatteremo presto per confermare la disponibilità.`

    const phoneNumber = "393207279857"
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    
    // Apri WhatsApp
    window.open(whatsappUrl, "_blank")
    
    // Mostra messaggio di conferma
    setSubmitted(true)
    setFormData({
      name: "",
      email: "",
      phone: "",
      guests: "",
      date: "",
      time: ""
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Calcola la data minima (oggi)
  const today = new Date().toISOString().split("T")[0]

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Prenota un Tavolo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Compila il form per inviare una richiesta di prenotazione. Ti contatteremo per confermare la disponibilità.
            </p>
          </div>

          {submitted ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Richiesta Inviata!</h2>
              <p className="text-muted-foreground mb-6">
                La tua richiesta di prenotazione è stata inviata su WhatsApp. Ti contatteremo presto per confermare la disponibilità del tavolo.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Nuova Richiesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Il tuo nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="tua.email@esempio.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Cellulare
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+39 123 456 7890"
                />
              </div>

              <div>
                <label htmlFor="guests" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Numero di Persone
                </label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleziona...</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? "persona" : "persone"}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={today}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  Orario
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Seleziona...</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                  <option value="22:00">22:00</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Invia Richiesta su WhatsApp
              </button>
            </form>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}

