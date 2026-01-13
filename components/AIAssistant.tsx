"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Trash2, Save, MessageSquare } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ciao! 👋 Sono l'assistente AI del Ristorante Barinello. Come posso aiutarti oggi?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasBookingInterest, setHasBookingInterest] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)
    setHasBookingInterest(false)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.error || "Errore nella risposta")
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.message }])
      setHasBookingInterest(data.hasBookingInterest || false)
    } catch (error: any) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Mi dispiace, c'è stato un errore. ${error.message || "Riprova più tardi."} 😔`,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    if (confirm("Vuoi cancellare tutta la conversazione?")) {
      setMessages([
        {
          role: "assistant",
          content: "Ciao! 👋 Sono l'assistente AI del Ristorante Barinello. Come posso aiutarti oggi?",
        },
      ])
      setHasBookingInterest(false)
    }
  }

  const handleSave = () => {
    const conversation = messages
      .map((msg) => `${msg.role === "user" ? "Cliente" : "Assistente"}: ${msg.content}`)
      .join("\n\n")
    
    const blob = new Blob([conversation], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chat-barinello-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateWhatsAppSummary = () => {
    const summary = messages
      .filter((msg) => msg.role === "user" || msg.content.toLowerCase().includes("prenot") || msg.content.toLowerCase().includes("tavolo"))
      .map((msg) => `${msg.role === "user" ? "Cliente" : "Assistente"}: ${msg.content}`)
      .join("\n\n")
    
    return `*Nuova richiesta da Assistente AI Barinello*\n\n${summary}`
  }

  const handleWhatsApp = () => {
    const summary = generateWhatsAppSummary()
    const phoneNumber = "393207279857"
    const encodedMessage = encodeURIComponent(summary)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        style={{ backgroundColor: "#FF7F7F", color: "white" }}
        aria-label="Apri assistente AI"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <span className="text-sm md:text-base font-bold">AI</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-32 md:bottom-6 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[calc(100vw-3rem)] md:max-w-2xl h-[600px] md:h-[calc(100vh-8rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-semibold">Assistente AI Barinello</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Salva chat"
                title="Salva chat"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Cancella chat"
                title="Cancella chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded hover:bg-primary/80 transition-colors"
                aria-label="Chiudi chat"
                title="Chiudi chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Button (if booking interest) */}
          {hasBookingInterest && (
            <div className="px-4 py-2 border-t border-border">
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Contatta via WhatsApp</span>
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Scrivi un messaggio..."
                className="flex-1 px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

