import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Dati di default
const DEFAULT_TEAM_MEMBERS = [
  {
    id: 1,
    image: "/gg.png",
    title: "Il nostro servizio",
    description: "Con attenzione ai dettagli e un sorriso sempre pronto, si prende cura di ogni ospite con dedizione e professionalità. La sua presenza discreta ma attenta rende ogni momento della cena piacevole e rilassante, creando un'atmosfera accogliente che fa sentire tutti come a casa.",
    layout: "left" // left = immagine a sinistra, right = immagine a destra
  },
  {
    id: 2,
    image: "/baa.png",
    title: "Barman",
    description: "Maestro delle bevande e creatore di momenti speciali, trasforma ogni drink in un'esperienza unica. Con passione e creatività, prepara cocktail raffinati e seleziona i migliori vini per accompagnare i nostri piatti. La sua competenza e il suo entusiasmo rendono ogni aperitivo o dopo cena un momento da ricordare.",
    layout: "right"
  },
  {
    id: 3,
    image: "/tit.png",
    title: "Il Titolare",
    description: "Cuore e anima del Ristorante Barinello, guida con passione e dedizione ogni aspetto della nostra cucina. Con anni di esperienza e un amore profondo per la tradizione siciliana, seleziona personalmente ogni ingrediente e supervisiona ogni piatto che esce dalla nostra cucina. La sua visione e il suo impegno rendono il Barinello un luogo dove tradizione e innovazione si incontrano per creare esperienze culinarie indimenticabili.",
    layout: "left"
  }
]

// GET - Carica i membri del team
export async function GET() {
  try {
    // Prova a caricare da Supabase
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "chi_siamo")
        .single()

      if (!error && data) {
        return NextResponse.json(data.value || DEFAULT_TEAM_MEMBERS)
      }
    }
    
    // Fallback: restituisci dati di default
    return NextResponse.json(DEFAULT_TEAM_MEMBERS)
  } catch (error) {
    console.error("Error loading chi siamo:", error)
    return NextResponse.json(DEFAULT_TEAM_MEMBERS)
  }
}

// POST - Salva i membri del team
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const teamMembers = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "chi_siamo",
          value: teamMembers,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      return NextResponse.json({ success: true })
    }
    
    // Se Supabase non è configurato, restituisci errore
    return NextResponse.json(
      { error: "Database non configurato. Configura Supabase per salvare i dati." },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error saving chi siamo:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Errore nel salvataggio" },
      { status: 500 }
    )
  }
}




