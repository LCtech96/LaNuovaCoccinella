import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// POST - Salva una prenotazione
export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()
    
    // Verifica che Supabase sia configurato
    if (!supabaseServer) {
      console.error("Supabase non configurato. Verifica le variabili d'ambiente.")
      
      // Fallback: almeno logga la prenotazione per debugging
      console.log("PRENOTAZIONE RICEVUTA (database non configurato):", booking)
      
      // Restituisci successo comunque, ma avvisa che deve essere configurato Supabase
      // In questo modo l'utente non vede un errore, ma l'admin sa che deve configurare il database
      return NextResponse.json({ 
        success: true, 
        booking: {
          ...booking,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          warning: "Database non configurato. Configura Supabase per salvare le prenotazioni permanentemente."
        }
      })
    }
    
    // Salva su Supabase
    const { data, error } = await supabaseServer
      .from("bookings")
      .insert({
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        guests: booking.guests,
        date: booking.date,
        time: booking.time
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      
      // Se la tabella non esiste, fornisci un messaggio più chiaro
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Tabella database non trovata. L'amministratore deve eseguire lo script SQL per creare le tabelle.",
            details: error.message
          },
          { status: 500 }
        )
      }
      
      // Se c'è un problema di permessi
      if (error.code === "42501" || error.message?.includes("permission")) {
        return NextResponse.json(
          { 
            error: "Errore di permessi nel database. Verifica le policy RLS o usa la service_role key.",
            details: error.message
          },
          { status: 500 }
        )
      }
      
      throw error
    }

    return NextResponse.json({ success: true, booking: data })
  } catch (error: any) {
    console.error("Error saving booking:", error)
    return NextResponse.json(
      { 
        error: "Errore nel salvataggio della prenotazione",
        details: error.message || "Errore sconosciuto"
      },
      { status: 500 }
    )
  }
}

// GET - Ottieni tutte le prenotazioni (protetto)
export async function GET(request: NextRequest) {
  try {
    // Verifica autenticazione
    const cookieStore = await import("next/headers").then(m => m.cookies())
    const token = cookieStore.get("admin_token")
    
    if (!token) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    
    // Verifica che Supabase sia configurato
    if (!supabaseServer) {
      console.warn("Supabase non configurato per il caricamento delle prenotazioni")
      return NextResponse.json([])
    }
    
    // Carica da Supabase
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      
      // Se la tabella non esiste, restituisci array vuoto invece di errore
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return NextResponse.json([])
      }
      
      throw error
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Error loading bookings:", error)
    return NextResponse.json(
      { error: error.message || "Errore nel caricamento delle prenotazioni" },
      { status: 500 }
    )
  }
}
