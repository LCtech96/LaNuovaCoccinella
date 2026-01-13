"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface TeamMember {
  id: number
  image: string
  title: string
  description: string
  layout: "left" | "right"
  visible?: boolean
}

export default function ChiSiamoPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const response = await fetch("/api/chi-siamo", {
          cache: "no-store"
        })
        if (response.ok) {
          const data = await response.json()
          // Filtra solo i membri visibili
          const visibleMembers = data.filter((member: TeamMember) => member.visible !== false)
          setTeamMembers(visibleMembers)
        }
      } catch (error) {
        console.error("Error loading team members:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTeamMembers()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento...</p>
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
          <div className="text-center mb-16 md:mb-24">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Chi Siamo
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Il nostro team è composto da persone appassionate che rendono ogni esperienza alla Nuova Coccinella di Salvo & Family unica e indimenticabile.
            </p>
          </div>

          {/* Team Members */}
          <div className="space-y-20 md:space-y-32">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                className={`flex flex-col gap-10 md:gap-16 items-center ${
                  member.layout === "right" ? "md:flex-row-reverse" : "md:flex-row"
                }`}
              >
                <div className="flex-1 w-full">
                  <div className="relative aspect-square max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                        Nessuna immagine
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="h-full flex flex-col justify-center p-6 md:p-8">
                    <h2
                      className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight"
                      style={{ fontFamily: "var(--font-playfair), serif" }}
                    >
                      {member.title}
                    </h2>
                    <p
                      className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Link */}
          <div className="mt-16 md:mt-24 text-center">
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

