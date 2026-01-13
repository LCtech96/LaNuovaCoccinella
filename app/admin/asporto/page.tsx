"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Save, Upload, X } from "lucide-react"
import Link from "next/link"
import { defaultMenuCategories } from "@/lib/menu-data-default"

interface Dish {
  name: string
  description: string
  price: string
  image?: string
  visible?: boolean
}

interface Category {
  title: string
  dishes: Dish[]
}

export default function AdminAsportoPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const response = await fetch("/api/menu")
      if (response.ok) {
        const data = await response.json()
        if (data.length > 0) {
          setCategories(data)
        } else {
          // Se non ci sono dati salvati, carica i dati di default
          setCategories(defaultMenuCategories)
        }
      } else {
        // Se c'è un errore, carica i dati di default
        setCategories(defaultMenuCategories)
      }
    } catch (error) {
      console.error("Error loading menu:", error)
      // In caso di errore, carica i dati di default
      setCategories(defaultMenuCategories)
    } finally {
      setLoading(false)
    }
  }

  const saveMenu = async () => {
    setSaving(true)
    setMessage("")
    try {
      // Pulisci i dati prima di salvare: rimuovi blob URLs e percorsi temporanei
      const cleanedCategories = categories.map(category => ({
        ...category,
        dishes: category.dishes.map(dish => {
          // Se l'immagine è un blob URL o un percorso temporaneo che inizia con /dish-, rimuovila
          // Mantieni solo immagini base64 o percorsi validi
          let cleanedImage = dish.image
          if (dish.image) {
            if (dish.image.startsWith('blob:')) {
              // Rimuovi blob URLs - non possono essere salvati
              cleanedImage = undefined
            } else if (dish.image.startsWith('/dish-') && dish.image.includes('-')) {
              // Rimuovi percorsi temporanei generati automaticamente
              cleanedImage = undefined
            }
            // Mantieni solo base64 o percorsi validi che iniziano con / e non sono temporanei
          }
          return {
            ...dish,
            image: cleanedImage
          }
        })
      }))

      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedCategories),
      })

      if (response.ok) {
        // Aggiorna lo stato locale con i dati puliti
        setCategories(cleanedCategories)
        setMessage("Menu salvato con successo!")
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

  const updateDish = (categoryIndex: number, dishIndex: number, field: keyof Dish, value: string | boolean) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].dishes[dishIndex] = {
      ...newCategories[categoryIndex].dishes[dishIndex],
      [field]: value,
    }
    setCategories(newCategories)
  }

  const addDish = (categoryIndex: number) => {
    const newCategories = [...categories]
    newCategories[categoryIndex].dishes.push({
      name: "Nuovo Piatto",
      description: "",
      price: "€0.00",
      visible: true,
    })
    setCategories(newCategories)
  }

  const removeDish = (categoryIndex: number, dishIndex: number) => {
    if (confirm("Vuoi rimuovere questo piatto?")) {
      const newCategories = [...categories]
      newCategories[categoryIndex].dishes.splice(dishIndex, 1)
      setCategories(newCategories)
    }
  }

  const removeCategory = (categoryIndex: number) => {
    if (confirm("Vuoi rimuovere questa categoria e tutti i suoi piatti?")) {
      const newCategories = categories.filter((_, index) => index !== categoryIndex)
      setCategories(newCategories)
    }
  }

  const toggleVisibility = (categoryIndex: number, dishIndex: number) => {
    const newCategories = [...categories]
    const dish = newCategories[categoryIndex].dishes[dishIndex]
    dish.visible = !dish.visible
    setCategories(newCategories)
  }

  const handleImageUpload = async (categoryIndex: number, dishIndex: number, file: File) => {
    // Verifica che sia un'immagine
    if (!file.type.startsWith("image/")) {
      setMessage("Il file deve essere un'immagine")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Verifica la dimensione del file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("L'immagine deve essere inferiore a 5MB")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    // Crea un'anteprima immediata con blob URL per feedback visivo immediato
    const previewUrl = URL.createObjectURL(file)
    
    // Aggiorna immediatamente con l'anteprima blob URL
    updateDish(categoryIndex, dishIndex, "image", previewUrl)
    
    // Converti l'immagine in base64 e salvala direttamente nel dish
    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        try {
          const base64Image = reader.result as string
          
          // Salva l'immagine come base64 direttamente nel dish
          // Questo permette di avere l'immagine persistente anche dopo il ricaricamento
          // Sostituisce il blob URL temporaneo con il base64 permanente
          updateDish(categoryIndex, dishIndex, "image", base64Image)
          
          setMessage("Immagine caricata con successo!")
          setTimeout(() => setMessage(""), 3000)
          
          // Rilascia l'URL temporaneo dopo che è stato sostituito con il base64
          // Aspettiamo un po' per assicurarci che il rendering del base64 sia completato
          setTimeout(() => {
            URL.revokeObjectURL(previewUrl)
          }, 500)
        } catch (error) {
          console.error("Error processing image:", error)
          setMessage("Errore durante l'elaborazione dell'immagine")
          setTimeout(() => setMessage(""), 5000)
          // In caso di errore, mantieni il blob URL temporaneo
        }
      }
      reader.onerror = () => {
        setMessage("Errore durante la lettura del file")
        setTimeout(() => setMessage(""), 5000)
        // Non revocare il blob URL se c'è un errore, così l'utente può vedere l'anteprima
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error uploading image:", error)
      setMessage("Errore durante l'upload")
      setTimeout(() => setMessage(""), 5000)
      // Non revocare il blob URL se c'è un errore
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Gestione Asporto</h1>
            <p className="text-muted-foreground">Modifica piatti, prezzi, descrizioni e immagini</p>
          </div>
          <button
            onClick={saveMenu}
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

        <div className="space-y-8">
          {categories.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">Nessuna categoria presente. Aggiungi la prima categoria per iniziare.</p>
              <button
                onClick={() => {
                  setCategories([{ title: "Nuova Categoria", dishes: [] }])
                }}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Aggiungi Prima Categoria
              </button>
            </div>
          )}
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <input
                  type="text"
                  value={category.title}
                  onChange={(e) => {
                    const newCategories = [...categories]
                    newCategories[categoryIndex].title = e.target.value
                    setCategories(newCategories)
                  }}
                  className="text-2xl font-bold bg-transparent border-b-2 border-transparent hover:border-border focus:border-primary focus:outline-none pb-2 flex-1"
                />
                <button
                  onClick={() => removeCategory(categoryIndex)}
                  className="ml-4 p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                  title="Rimuovi categoria"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {category.dishes.map((dish, dishIndex) => (
                  <div
                    key={dishIndex}
                    className={`p-4 rounded-lg border ${
                      dish.visible !== false ? "border-border" : "border-destructive/50 bg-destructive/5"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Immagine */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Immagine</label>
                        <div className="relative">
                          {dish.image ? (
                            <div className="relative w-full h-24 rounded overflow-hidden bg-muted">
                              {(dish.image.startsWith('data:image') || dish.image.startsWith('blob:')) ? (
                                // Se è un'immagine base64 o un blob URL temporaneo, usala direttamente
                                <img 
                                  src={dish.image} 
                                  alt={dish.name} 
                                  className="w-full h-24 object-cover rounded"
                                  onError={(e) => {
                                    // Se anche il blob URL fallisce, mostra placeholder
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent && !parent.querySelector('.image-placeholder')) {
                                      const placeholder = document.createElement('div')
                                      placeholder.className = 'image-placeholder w-full h-24 bg-muted rounded flex flex-col items-center justify-center text-muted-foreground'
                                      placeholder.innerHTML = `
                                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span class="text-xs">Errore caricamento</span>
                                      `
                                      parent.appendChild(placeholder)
                                    }
                                  }}
                                />
                              ) : (
                                // Se è un percorso, prova a caricarlo
                                <img 
                                  src={dish.image} 
                                  alt={dish.name} 
                                  className="w-full h-24 object-cover rounded"
                                  onError={(e) => {
                                    // Se l'immagine non può essere caricata, mostra un placeholder
                                    const target = e.target as HTMLImageElement
                                    target.style.display = 'none'
                                    const parent = target.parentElement
                                    if (parent && !parent.querySelector('.image-placeholder')) {
                                      const placeholder = document.createElement('div')
                                      placeholder.className = 'image-placeholder w-full h-24 bg-muted rounded flex flex-col items-center justify-center text-muted-foreground'
                                      placeholder.innerHTML = `
                                        <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                        <span class="text-xs">Immagine non trovata</span>
                                      `
                                      parent.appendChild(placeholder)
                                    }
                                  }}
                                />
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-24 bg-muted rounded flex items-center justify-center">
                              <Upload className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(categoryIndex, dishIndex, file)
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Nome */}
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium mb-2">Nome</label>
                        <input
                          type="text"
                          value={dish.name}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "name", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>

                      {/* Descrizione */}
                      <div className="md:col-span-4">
                        <label className="block text-sm font-medium mb-2">Descrizione</label>
                        <input
                          type="text"
                          value={dish.description}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "description", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                        />
                      </div>

                      {/* Prezzo */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Prezzo</label>
                        <input
                          type="text"
                          value={dish.price}
                          onChange={(e) => updateDish(categoryIndex, dishIndex, "price", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg"
                          placeholder="€0.00"
                        />
                      </div>

                      {/* Azioni */}
                      <div className="md:col-span-1 flex items-end gap-2">
                        <button
                          onClick={() => toggleVisibility(categoryIndex, dishIndex)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title={dish.visible !== false ? "Nascondi" : "Mostra"}
                        >
                          {dish.visible !== false ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-destructive" />
                          )}
                        </button>
                        <button
                          onClick={() => removeDish(categoryIndex, dishIndex)}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          title="Rimuovi"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addDish(categoryIndex)}
                  className="w-full py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Aggiungi Piatto</span>
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => {
              setCategories([...categories, { title: "Nuova Categoria", dishes: [] }])
            }}
            className="w-full py-4 border-2 border-dashed border-border rounded-xl hover:bg-accent/50 transition-colors flex items-center justify-center gap-2 text-lg"
          >
            <Plus className="w-6 h-6" />
            <span>Aggiungi Categoria</span>
          </button>
        </div>
      </div>
    </main>
  )
}

