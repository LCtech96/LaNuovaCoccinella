import { NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { supabaseServer } from "@/lib/supabase-server"

export interface BlogPost {
  id: string
  title: string
  description: string
  image?: string
  visible?: boolean
  createdAt?: string
  updatedAt?: string
}

const DEFAULT_BLOG_POSTS: BlogPost[] = []

// GET - Carica i post del blog
export async function GET() {
  try {
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "blog_posts")
        .single()

      if (!error && data) {
        return NextResponse.json(data.value || DEFAULT_BLOG_POSTS)
      }
    }
    
    return NextResponse.json(DEFAULT_BLOG_POSTS)
  } catch (error) {
    console.error("Error loading blog posts:", error)
    return NextResponse.json(DEFAULT_BLOG_POSTS)
  }
}

// POST - Salva i post del blog
export async function POST(request: NextRequest) {
  try {
    await requireAuth()
    
    const blogPosts = await request.json()
    
    if (supabaseServer) {
      const { error } = await supabaseServer
        .from("admin_data")
        .upsert({
          key: "blog_posts",
          value: blogPosts,
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
    console.error("Error saving blog posts:", error)
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
