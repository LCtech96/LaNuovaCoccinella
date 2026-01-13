import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Questa API route gestisce l'upload delle immagini per i piatti del menu
// Salva l'immagine come base64 in Supabase o restituisce il percorso

export async function POST(request: NextRequest) {
  try {
    await requireAuth()

    const body = await request.json()
    const { categoryIndex, dishIndex, fileName, imageData, imagePath } = body

    if (!imageData || !fileName) {
      return NextResponse.json(
        { error: "Dati immagine mancanti" },
        { status: 400 }
      )
    }

    // Salva l'immagine in Supabase Storage o come dato
    // Per ora, salva solo il percorso e l'immagine come base64 in admin_data
    if (supabaseServer) {
      // Salva l'immagine temporaneamente in admin_data
      // In futuro, potresti usare Supabase Storage per un approccio migliore
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: `menu_image_${categoryIndex}_${dishIndex}`,
          value: {
            fileName: fileName,
            imagePath: imagePath,
            imageData: imageData, // Base64
            uploadedAt: new Date().toISOString()
          },
          updated_at: new Date().toISOString()
        }, {
          onConflict: "key"
        })

      if (error) {
        console.error("Supabase error:", error)
        // Restituisci comunque il percorso, l'utente può caricare manualmente
        return NextResponse.json({
          success: true,
          imageUrl: imagePath,
          message: "Percorso salvato. Carica l'immagine manualmente nella cartella public/"
        })
      }

      return NextResponse.json({
        success: true,
        imageUrl: imagePath,
        message: "Immagine salvata con successo"
      })
    }

    // Se Supabase non è configurato, restituisci solo il percorso
    return NextResponse.json({
      success: true,
      imageUrl: imagePath,
      message: "Percorso salvato. Carica l'immagine manualmente nella cartella public/"
    })
  } catch (error: any) {
    console.error("Error uploading image:", error)
    if (error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Errore durante l'upload" },
      { status: 500 }
    )
  }
}




