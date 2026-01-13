"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft, Phone, Clock, ChevronDown, ChevronUp } from "lucide-react"
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

export default function AsportoPage() {
  const [menuCategories, setMenuCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    const loadMenu = async () => {
      try {
        // Carica i dati da Supabase tramite l'API
        const response = await fetch("/api/menu", {
          cache: "no-store" // Evita cache per avere sempre dati aggiornati
        })
        
        if (response.ok) {
          const savedMenu = await response.json()
          
          // Se ci sono dati salvati, usali
          if (savedMenu && Array.isArray(savedMenu) && savedMenu.length > 0) {
            const categories = savedMenu.map((cat: Category) => ({
              ...cat,
              dishes: cat.dishes.filter((dish: Dish) => dish.visible !== false)
            }))
            setMenuCategories(categories)
          } else {
            // Altrimenti usa i dati di default
            const defaultCategories = defaultMenuCategories.map(cat => ({
              ...cat,
              dishes: cat.dishes.filter(dish => dish.visible !== false)
            }))
            setMenuCategories(defaultCategories)
          }
        } else {
          // In caso di errore, usa i dati di default
          const defaultCategories = defaultMenuCategories.map(cat => ({
            ...cat,
            dishes: cat.dishes.filter(dish => dish.visible !== false)
          }))
          setMenuCategories(defaultCategories)
        }
      } catch (error) {
        console.error("Error loading menu:", error)
        // In caso di errore, usa i dati di default
        const defaultCategories = defaultMenuCategories.map(cat => ({
          ...cat,
          dishes: cat.dishes.filter(dish => dish.visible !== false)
        }))
        setMenuCategories(defaultCategories)
      } finally {
        setLoading(false)
      }
    }

    loadMenu()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento menu...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Asporto</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Ordina i tuoi piatti preferiti e ritirali direttamente dal ristorante
            </p>
            
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-5 h-5" />
                <span>Chiama per ordinare</span>
              </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-5 h-5" />
                      <span>Orari: 07:00 - 01:00</span>
                    </div>
            </div>
          </div>

          {/* Menu Categories - Accordion Style */}
          <div className="space-y-2">
            {menuCategories.map((category, categoryIndex) => {
              const isExpanded = expandedCategories.has(category.title)
              const toggleCategory = () => {
                const newExpanded = new Set(expandedCategories)
                if (isExpanded) {
                  newExpanded.delete(category.title)
                } else {
                  newExpanded.add(category.title)
                }
                setExpandedCategories(newExpanded)
              }

              return (
                <div key={categoryIndex} className="border border-border rounded-lg overflow-hidden bg-card">
                  {/* Category Header - Clickable */}
                  <button
                    onClick={toggleCategory}
                    className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent/50 transition-colors text-left"
                  >
                    <h2 className="text-xl md:text-2xl font-bold text-foreground">
                      {category.title}
                    </h2>
                    <div className="flex-shrink-0 ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                  
                  {/* Category Content - Collapsible */}
                  {isExpanded && (
                    <div className="border-t border-border p-4 md:p-6">
                      <div className="space-y-4">
                        {category.dishes.map((dish, dishIndex) => (
                          <div
                            key={dishIndex}
                            className={`flex flex-col md:flex-row md:items-start md:justify-between gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors ${
                              category.title === "Note" ? "border-t border-border pt-4" : ""
                            }`}
                          >
                            <div className="flex-1 flex gap-4">
                              {dish.image && (
                                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                                  {dish.image.startsWith('data:image') ? (
                                    <img 
                                      src={dish.image} 
                                      alt={dish.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <img 
                                      src={dish.image} 
                                      alt={dish.name} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                      }}
                                    />
                                  )}
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className={`text-base md:text-lg font-semibold mb-1 ${category.title === "Note" ? "inline" : ""}`}>
                                  {dish.name}
                                  {category.title === "Note" && dish.description && (
                                    <span className="text-muted-foreground">: {dish.description}</span>
                                  )}
                                </h3>
                                {category.title !== "Note" && dish.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {dish.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {dish.price && category.title !== "Note" && (
                              <div className="flex-shrink-0">
                                <span className="text-base md:text-lg font-bold text-foreground">
                                  {dish.price}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Footer Link */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
