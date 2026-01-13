// File per gestire i dati del menu in modo centralizzato
// Questo file può essere modificato dall'admin

export interface Dish {
  name: string
  description: string
  price: string
  image?: string
  visible?: boolean
}

export interface Category {
  title: string
  dishes: Dish[]
}

// Funzione per caricare i dati del menu
export async function getMenuData(): Promise<Category[]> {
  try {
    const fs = await import("fs/promises")
    const path = await import("path")
    const filePath = path.join(process.cwd(), "data", "menu.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    return JSON.parse(fileContents)
  } catch {
    // Se il file non esiste, usa i dati di default
    return getDefaultMenuData()
  }
}

// Funzione per salvare i dati del menu
export async function saveMenuData(data: Category[]): Promise<void> {
  const fs = await import("fs/promises")
  const path = await import("path")
  const dataDir = path.join(process.cwd(), "data")
  
  // Crea la directory se non esiste
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch {}
  
  const filePath = path.join(dataDir, "menu.json")
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
}

// Dati di default (copiati dalla pagina asporto)
export function getDefaultMenuData(): Category[] {
  // Questo sarà popolato con i dati attuali dalla pagina asporto
  return []
}




