"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { ShoppingBag, Calendar, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  className?: string
}

const navItems = [
  { id: "menu", label: "Menù", icon: ShoppingBag, href: "/asporto" },
  { id: "booking", label: "Booking", icon: Calendar, href: "/booking" },
] as const

export function Navigation({ className }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <nav
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border",
          className
        )}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border",
          className
        )}
      >
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                prefetch
                className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          })}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-xs">Tema</span>
          </button>
        </div>
      </nav>
    </>
  )
}
