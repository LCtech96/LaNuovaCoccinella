import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

const DEFAULT_KNOWLEDGE = {
  openingHours: "07:00 - 01:00",
  closingDays: [],
  holidays: [],
  events: [],
  additionalInfo: ""
}

// GET - Carica la conoscenza AI
export async function GET() {
  try {
    // Prova a caricare da Supabase
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "ai_knowledge")
        .single()

      if (!error && data) {
        return NextResponse.json(data.value || DEFAULT_KNOWLEDGE)
      }
    }
    
    // Fallback: restituisci dati di default
    return NextResponse.json(DEFAULT_KNOWLEDGE)
  } catch (error) {
    console.error("Error loading AI knowledge:", error)
    return NextResponse.json(DEFAULT_KNOWLEDGE)
  }
}

// POST - Salva la conoscenza AI
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const knowledge = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "ai_knowledge",
          value: knowledge,
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
    console.error("Error saving AI knowledge:", error)
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
