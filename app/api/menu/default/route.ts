import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import path from "path"

// Questo file contiene i dati di default del menu
// Copiati dalla pagina asporto
const DEFAULT_MENU = [
  {
    title: "Antipasti di Mare",
    dishes: [
      { name: "Polipetti Murati", description: "Polipetti marinati con olio, limone e prezzemolo", price: "€16.00", visible: true },
      { name: "Ostrica", description: "Ostriche freschissime del giorno", price: "€4.00", visible: true },
      { name: "Insalata di Mare", description: "Polpo, Calamari, Cozze, Vongole, Carote, Sedano", price: "€15.00", visible: true },
      // Aggiungi tutti gli altri piatti qui...
    ]
  }
  // Aggiungi tutte le altre categorie qui...
]

export async function GET() {
  try {
    // Prova a leggere dalla pagina asporto
    const asportoPath = path.join(process.cwd(), "app", "asporto", "page.tsx")
    // Per ora restituisci un array vuoto, i dati verranno caricati dalla pagina asporto
    return NextResponse.json([])
  } catch {
    return NextResponse.json(DEFAULT_MENU)
  }
}




