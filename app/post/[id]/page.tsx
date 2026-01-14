"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  description: string
  image?: string
  visible?: boolean
  createdAt?: string
  updatedAt?: string
}

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      const response = await fetch("/api/blog")
      if (response.ok) {
        const posts: Post[] = await response.json()
        const foundPost = posts.find((p) => p.id === postId && p.visible !== false)
        if (foundPost) {
          setPost(foundPost)
        }
      }
    } catch (error) {
      console.error("Error loading post:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Post non trovato</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto">
          {/* Tasto Indietro */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Torna alla home</span>
          </Link>

          {/* Immagine */}
          {post.image && (
            <div className="relative w-full aspect-video md:aspect-[16/9] bg-muted rounded-xl md:rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Titolo */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>
            {post.title}
          </h1>

          {/* Descrizione */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {post.description}
            </p>
          </div>

          {/* Data */}
          {post.createdAt && (
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Pubblicato il {new Date(post.createdAt).toLocaleDateString("it-IT", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
