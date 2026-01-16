import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

export interface Customer {
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

const DEFAULT_CUSTOMERS: Customer[] = []

// GET - Carica i clienti
export async function GET() {
  try {
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "customers")
        .single()

      if (!error && data) {
        return NextResponse.json(data.value || DEFAULT_CUSTOMERS)
      }
    }
    
    return NextResponse.json(DEFAULT_CUSTOMERS)
  } catch (error) {
    console.error("Error loading customers:", error)
    return NextResponse.json(DEFAULT_CUSTOMERS)
  }
}

// POST - Salva i clienti
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const customers = await request.json()
    
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "customers",
          value: customers,
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
    
    return NextResponse.json(
      { error: "Database non configurato. Configura Supabase per salvare i dati." },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error saving customers:", error)
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
