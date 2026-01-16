"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  cliente: string
  indirizzo: string
  citta: string
  provincia: string
  partitaIVA: string
  telefono: string
  cellulare: string
  email: string
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const response = await fetch("/api/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data || [])
      }
    } catch (error) {
      console.error("Error loading customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveCustomers = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customers),
      })

      if (response.ok) {
        setMessage("Clienti salvati con successo!")
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

  const addCustomer = () => {
    const newCustomer: Customer = {
      id: `customer-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      cliente: "",
      indirizzo: "",
      citta: "",
      provincia: "",
      partitaIVA: "",
      telefono: "",
      cellulare: "",
      email: ""
    }
    setCustomers([...customers, newCustomer])
  }

  const deleteCustomer = (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questo cliente?")) {
      const newCustomers = customers.filter((_, i) => i !== index)
      setCustomers(newCustomers)
    }
  }

  const updateCustomer = (index: number, field: keyof Customer, value: string) => {
    const newCustomers = [...customers]
    newCustomers[index] = { ...newCustomers[index], [field]: value }
    setCustomers(newCustomers)
  }

  const handleCellClick = (row: number, col: string) => {
    setEditingCell({ row, col })
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const handleCellKeyDown = (e: React.KeyboardEvent, row: number, col: string) => {
    if (e.key === "Enter") {
      e.preventDefault()
      setEditingCell(null)
    } else if (e.key === "Escape") {
      setEditingCell(null)
    } else if (e.key === "Tab") {
      e.preventDefault()
      setEditingCell(null)
      // Naviga alla cella successiva/precedente
      const cols = ["cliente", "indirizzo", "citta", "provincia", "partitaIVA", "telefono", "cellulare", "email"]
      const currentIndex = cols.indexOf(col)
      const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1
      if (nextIndex >= 0 && nextIndex < cols.length) {
        setEditingCell({ row, col: cols[nextIndex] })
      }
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento...</div>
      </main>
    )
  }

  const columns = [
    { key: "cliente", label: "Cliente" },
    { key: "indirizzo", label: "Indirizzo" },
    { key: "citta", label: "Città" },
    { key: "provincia", label: "Prov." },
    { key: "partitaIVA", label: "P. IVA" },
    { key: "telefono", label: "Telefono" },
    { key: "cellulare", label: "Cellulare" },
    { key: "email", label: "E-M@il" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Gestione Clienti</h1>
            <p className="text-sm md:text-base text-muted-foreground">Clicca sulle celle per modificare i dati</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={addCustomer}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Cliente</span>
            </button>
            <button
              onClick={saveCustomers}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Salvataggio..." : "Salva"}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        {/* Tabella tipo Excel */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-3 py-3 text-left text-xs md:text-sm font-semibold text-foreground border-r border-border last:border-r-0 sticky top-0 bg-muted/50 z-10 min-w-[120px]"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="px-3 py-3 text-left text-xs md:text-sm font-semibold text-foreground sticky top-0 bg-muted/50 z-10 min-w-[60px]">
                    Azioni
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    className="border-b border-border hover:bg-muted/20 transition-colors"
                  >
                    {columns.map((col) => {
                      const isEditing = editingCell?.row === index && editingCell?.col === col.key
                      return (
                        <td
                          key={col.key}
                          className="px-3 py-2 border-r border-border last:border-r-0"
                          onClick={() => !isEditing && handleCellClick(index, col.key)}
                        >
                          {isEditing ? (
                            <input
                              type="text"
                              value={customer[col.key as keyof Customer] || ""}
                              onChange={(e) => updateCustomer(index, col.key as keyof Customer, e.target.value)}
                              onBlur={handleCellBlur}
                              onKeyDown={(e) => handleCellKeyDown(e, index, col.key)}
                              className="w-full px-2 py-1 bg-background border border-primary rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                            />
                          ) : (
                            <div className="px-2 py-1 min-h-[28px] text-sm cursor-pointer hover:bg-accent/50 rounded">
                              {customer[col.key as keyof Customer] || ""}
                            </div>
                          )}
                        </td>
                      )
                    })}
                    <td className="px-3 py-2">
                      <button
                        onClick={() => deleteCustomer(index)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {customers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nessun cliente presente. Clicca su &quot;Aggiungi Cliente&quot; per iniziare.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
