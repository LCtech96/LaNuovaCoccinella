import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

// Video di default dalla home page
const DEFAULT_VIDEOS = [
  {
    id: "i",
    src: "/video/i.mp4",
    title: "Tramonto sul mare",
    description: "Lasciatevi incantare dai tramonti mozzafiato che ogni sera colorano il cielo sopra il mare di Terrasini. Un momento magico che rende ogni cena al Ristorante Barinello un'esperienza indimenticabile, dove la natura si fonde con l'eccellenza culinaria.",
    visible: true
  },
  {
    id: "ii",
    src: "/video/ii.mp4",
    title: "Il sole che si tuffa nel mare",
    description: "Il sole che si tuffa nel mare cristallino crea uno spettacolo unico che solo la Sicilia può offrire. Sulla nostra terrazza affacciata sul mare, potete ammirare questi momenti di pura bellezza mentre gustate i nostri piatti di pesce freschissimo.",
    visible: true
  },
  {
    id: "d",
    src: "/video/d.mp4",
    title: "I nostri spaghetti alle vongole",
    description: "Spaghetti perfettamente al dente con vongole veraci freschissime, aglio, prezzemolo e un tocco di vino bianco. Un classico della cucina siciliana che celebra il sapore autentico del mare, preparato con la passione e l'esperienza che solo la tradizione può offrire.",
    visible: true
  },
  {
    id: "f",
    src: "/video/f.mp4",
    title: "Le nostre busiate con gambero",
    description: "La pasta tipica siciliana incontra i gamberi freschissimi del nostro mare. Le busiate, avvolte a mano secondo l'antica tradizione, si sposano perfettamente con il sapore delicato e intenso dei gamberi, creando un piatto che è poesia in ogni boccone.",
    visible: true
  },
  {
    id: "g",
    src: "/video/g.mp4",
    title: "Le nostre linguine all'astice",
    description: "Linguine di grano duro con astice fresco appena pescato, pomodorini pachino e basilico siciliano. Un piatto di lusso che esalta la dolcezza dell'astice e la ricchezza del mare, servito con eleganza e raffinatezza.",
    visible: true
  },
  {
    id: "w",
    src: "/video/w.mp4",
    title: "Il nostro pescato fresco",
    description: "Ogni mattina i nostri pescatori locali portano il pesce più fresco del mare di Terrasini. Branzini, orate, triglie e pesce spada vengono selezionati con cura per garantire la massima qualità e freschezza in ogni nostro piatto.",
    visible: true
  },
  {
    id: "e",
    src: "/video/e.mp4",
    title: "Il nostro pescato fresco",
    description: "La tradizione della pesca siciliana si unisce all'arte culinaria. Il nostro pescato del giorno viene preparato rispettando i sapori autentici del mare, con tecniche che esaltano la naturale bontà di ogni ingrediente.",
    visible: true
  },
  {
    id: "u",
    src: "/video/u.mp4",
    title: "I nostri crudi di mare",
    description: "Una selezione raffinata di crudi di pesce freschissimo: pesce spada, tonno, gamberi e ricci di mare. Ogni boccone è un'esplosione di sapori puri e autentici, accompagnati da olio extravergine siciliano e limone dell'isola.",
    visible: true
  }
]

// Immagini modificabili: k.png, kj.png, kkk.png, cop.png, ddd.png, dfg.png, 3.png, 9.png
const DEFAULT_EDITABLE_IMAGES = [
  { id: "k", src: "/k.png", title: "", description: "", visible: true },
  { id: "kj", src: "/kj.png", title: "", description: "", visible: true },
  { id: "kkk", src: "/kkk.png", title: "", description: "", visible: true },
  { id: "cop", src: "/cop.png", title: "", description: "", visible: true },
  { id: "ddd", src: "/ddd.png", title: "", description: "", visible: true },
  { id: "dfg", src: "/dfg.png", title: "", description: "", visible: true },
  { id: "3", src: "/3.png", title: "", description: "", visible: true },
  { id: "9", src: "/9.png", title: "", description: "", visible: true }
]

const DEFAULT_HOME_IMAGES = [
  {
    id: "dg",
    src: "/dg.png",
    title: "La nostra terrazza",
    description: "La nostra terrazza si affaccia direttamente sui faraglioni, offrendo una vista mozzafiato sul mare cristallino di Terrasini. Un luogo unico dove potete godere dei nostri piatti di pesce freschissimo mentre ammirate lo spettacolo naturale che solo questa posizione privilegiata può offrire.",
    visible: true
  },
  {
    id: "q",
    src: "/q.png",
    title: "I nostri spaghetti alle cozze e vongole veraci",
    description: "Un piatto che celebra la tradizione siciliana con cozze e vongole veraci freschissime, aglio, prezzemolo e un tocco di vino bianco. Gli spaghetti perfettamente al dente si sposano con il sapore autentico del mare.",
    visible: true
  },
  {
    id: "4",
    src: "/4.png",
    title: "I nostri spaghetti al nero di seppia e ricchi di mare",
    description: "Un piatto dal sapore intenso e caratteristico, preparato con il nero di seppia freschissimo e arricchito con frutti di mare selezionati. Gli spaghetti perfettamente al dente si colorano del nero profondo della seppia, creando un'esperienza culinaria unica che celebra i sapori autentici del nostro mare.",
    visible: true
  },
  {
    id: "l",
    src: "/l.png",
    title: "Le nostre linguine all'astice",
    description: "Linguine di grano duro con astice fresco appena pescato, pomodorini pachino e basilico siciliano. Un piatto di lusso che esalta la dolcezza dell'astice e la ricchezza del mare, servito con eleganza e raffinatezza.",
    visible: true
  }
]

const DEFAULT_CONTENT = {
  coverImage: "/cop.png",
  profileImage: "/profile.png",
  videos: DEFAULT_VIDEOS,
  images: [],
  editableImages: DEFAULT_EDITABLE_IMAGES,
  homeImages: DEFAULT_HOME_IMAGES
}

// GET - Carica i contenuti
export async function GET() {
  try {
    // Prova a caricare da Supabase
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "content")
        .single()

      if (!error && data) {
        return NextResponse.json(data.value || DEFAULT_CONTENT)
      }
    }
    
    // Fallback: restituisci dati di default
    return NextResponse.json(DEFAULT_CONTENT)
  } catch (error) {
    console.error("Error loading content:", error)
    return NextResponse.json(DEFAULT_CONTENT)
  }
}

// POST - Salva i contenuti
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const content = await request.json()
    
    // Salva su Supabase
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "content",
          value: content,
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
    console.error("Error saving content:", error)
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
