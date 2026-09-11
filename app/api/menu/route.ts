import { NextRequest, NextResponse } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"
import { getMenuCategories } from "@/lib/get-menu"

function jsonWithCache(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}

// GET - Carica il menu
export async function GET() {
  try {
    const categories = await getMenuCategories()
    return jsonWithCache(categories)
  } catch (error) {
    console.error("Error loading menu:", error)
    const { defaultMenuCategories } = await import("@/lib/menu-data-default")
    return jsonWithCache(defaultMenuCategories)
  }
}

// POST - Salva il menu
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const menu = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "menu",
          value: menu,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      revalidateTag("menu")
      revalidatePath("/asporto")
      return NextResponse.json({ success: true })
    }
    
    // Se Supabase non è configurato, restituisci errore
    return NextResponse.json(
      { error: "Database non configurato. Configura Supabase per salvare i dati." },
      { status: 500 }
    )
  } catch (error: any) {
    console.error("Error saving menu:", error)
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
