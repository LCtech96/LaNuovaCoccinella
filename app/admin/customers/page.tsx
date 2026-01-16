"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Plus, Trash2, Upload } from "lucide-react"
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
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState("")
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

  const parseImportText = (text: string): Customer[] => {
    const lines = text.trim().split('\n').filter(line => line.trim() && !line.includes("CLIENTI") && !line.includes("Cliente") && !line.includes("---"))
    const importedCustomers: Customer[] = []
    
    for (const line of lines) {
      // Prova a parsare righe separate da pipe (|)
      let parts: string[] = []
      if (line.includes('|')) {
        parts = line.split('|').map(p => p.trim())
      } else {
        // Prova a parsare righe separate da tab o spazi multipli
        parts = line.split(/\t| {2,}/).map(p => p.trim()).filter(p => p)
      }
      
      if (parts.length >= 1 && parts[0]) {
        // Mappa i campi: Cliente, Indirizzo, Città, Prov., P. IVA, Telefono, Cellulare, E-M@il
        const customer: Customer = {
          id: `customer-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          cliente: parts[0] || '',
          indirizzo: parts[1] || '',
          citta: parts[2] || '',
          provincia: parts[3] || '',
          partitaIVA: parts[4] || '',
          telefono: parts[5] || '',
          cellulare: parts[6] || '',
          email: parts[7] || ''
        }
        importedCustomers.push(customer)
      }
    }
    
    return importedCustomers
  }

  const handleImport = () => {
    if (!importText.trim()) {
      setMessage("Incolla i dati da importare")
      return
    }
    
    try {
      const imported = parseImportText(importText)
      if (imported.length === 0) {
        setMessage("Nessun cliente valido trovato nel testo")
        return
      }
      
      // Aggiungi i clienti importati a quelli esistenti
      setCustomers([...customers, ...imported])
      setShowImportModal(false)
      setImportText("")
      setMessage(`${imported.length} clienti importati con successo! Clicca su "Salva" per salvare le modifiche.`)
      setTimeout(() => setMessage(""), 5000)
    } catch (error) {
      setMessage("Errore durante l'importazione: " + (error as Error).message)
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
              onClick={() => setShowImportModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Importa Clienti</span>
            </button>
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

        {/* Modal Importazione */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl p-6 mx-4 max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Importa Clienti</h3>
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportText("")
                  }}
                  className="p-2 rounded-lg hover:bg-accent"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Incolla i dati dei clienti (formato separato da pipe | o tab). Una riga per cliente.
              </p>
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="flex-1 w-full px-4 py-2 bg-background border border-border rounded-lg font-mono text-sm resize-none"
                placeholder="Esempio:&#10;CLIENTE1|INDIRIZZO1|CITTA1|PROV1|P.IVA1|TEL1|CELL1|EMAIL1&#10;CLIENTE2|INDIRIZZO2|CITTA2|PROV2|P.IVA2|TEL2|CELL2|EMAIL2"
              />
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleImport}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Importa
                </button>
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportText("")
                  }}
                  className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/90 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
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
