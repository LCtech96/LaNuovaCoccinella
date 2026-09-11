"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react"
import type { Category } from "@/lib/menu-data-default"

export function AsportoMenu({ categories }: { categories: Category[] }) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Menù</h1>
      </div>

      <div className="space-y-2">
        {categories.map((category, categoryIndex) => {
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
            <div
              key={categoryIndex}
              className="border border-border rounded-lg overflow-hidden bg-card"
            >
              <button
                onClick={toggleCategory}
                className="w-full flex items-center justify-between p-4 md:p-6 hover:bg-accent/50 transition-colors text-left"
                aria-expanded={isExpanded}
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

              {isExpanded && (
                <div className="border-t border-border p-4 md:p-6">
                  <div className="space-y-4">
                    {category.dishes.map((dish, dishIndex) => (
                      <div
                        key={dishIndex}
                        className={`flex flex-col md:flex-row md:items-start md:justify-between gap-3 p-3 rounded-lg hover:bg-accent/30 transition-colors ${
                          category.title === "Note"
                            ? "border-t border-border pt-4"
                            : ""
                        }`}
                      >
                        <div className="flex-1 flex gap-4">
                          {dish.image && (
                            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = "none"
                                }}
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3
                              className={`text-base md:text-lg font-semibold mb-1 ${
                                category.title === "Note" ? "inline" : ""
                              }`}
                            >
                              {dish.name}
                              {category.title === "Note" &&
                                dish.description && (
                                  <span className="text-muted-foreground">
                                    : {dish.description}
                                  </span>
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
  )
}
