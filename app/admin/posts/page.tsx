"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Plus, Trash2, Eye, EyeOff, Edit2 } from "lucide-react"
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

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingPost, setEditingPost] = useState<number | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch("/api/blog")
      if (response.ok) {
        const data = await response.json()
        setPosts(data || [])
      }
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const savePosts = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(posts),
      })

      if (response.ok) {
        setMessage("Post salvati con successo!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Errore nel salvataggio")
      }
    } catch (error) {
      setMessage("Errore nel salvataggio")
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = (file: File, callback: (base64: string) => void) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setMessage("L'immagine deve essere inferiore a 5MB")
      setTimeout(() => setMessage(""), 3000)
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Data = reader.result as string
      callback(base64Data)
    }
    reader.onerror = () => {
      setMessage("Errore durante il caricamento dell'immagine")
      setTimeout(() => setMessage(""), 3000)
    }
    reader.readAsDataURL(file)
  }

  const addPost = () => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: "",
      description: "",
      image: "",
      visible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setPosts([...posts, newPost])
    setEditingPost(posts.length)
  }

  const deletePost = async (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questo post?")) {
      const newPosts = posts.filter((_, i) => i !== index)
      setPosts(newPosts)
      if (editingPost === index) {
        setEditingPost(null)
      }
      
      // Salva automaticamente
      try {
        const response = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPosts),
        })
        if (response.ok) {
          setMessage("Post eliminato con successo")
          setTimeout(() => setMessage(""), 2000)
        }
      } catch (error) {
        console.error("Error deleting post:", error)
      }
    }
  }

  const togglePostVisibility = async (index: number) => {
    const newPosts = [...posts]
    const currentVisible = newPosts[index].visible !== false
    newPosts[index] = { ...newPosts[index], visible: !currentVisible, updatedAt: new Date().toISOString() }
    setPosts(newPosts)
    
    // Salva automaticamente
    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPosts),
      })
      if (response.ok) {
        setMessage(currentVisible ? "Post nascosto" : "Post mostrato")
        setTimeout(() => setMessage(""), 2000)
      }
    } catch (error) {
      console.error("Error saving visibility:", error)
    }
  }

  const updatePost = (index: number, field: "title" | "description" | "image", value: string) => {
    const newPosts = [...posts]
    newPosts[index] = { ...newPosts[index], [field]: value, updatedAt: new Date().toISOString() }
    setPosts(newPosts)
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Caricamento...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Gestione Post del Giorno</h1>
            <p className="text-sm md:text-base text-muted-foreground">Aggiungi, modifica o rimuovi i post del giorno</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={addPost}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Aggiungi Post</span>
            </button>
            <button
              onClick={savePosts}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Salvataggio..." : "Salva"}</span>
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          {posts.map((post, index) => (
            <div
              key={post.id || index}
              className={`bg-card border border-border rounded-xl p-4 md:p-6 ${post.visible === false ? "opacity-50" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {editingPost === index ? (
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Immagine</label>
                      {post.image && (
                        <div className="relative w-full md:w-64 h-48 bg-muted rounded-lg overflow-hidden mb-3">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              handleFileUpload(file, (base64) => {
                                updatePost(index, "image", base64)
                              })
                            }
                          }}
                          className="hidden"
                          id={`post-image-${index}`}
                        />
                        <label
                          htmlFor={`post-image-${index}`}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/90 transition-colors w-full sm:w-auto"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{post.image ? "Sostituisci immagine" : "Carica immagine"}</span>
                        </label>
                        {post.image && (
                          <button
                            onClick={() => {
                              if (confirm("Sei sicuro di voler rimuovere l'immagine?")) {
                                updatePost(index, "image", "")
                              }
                            }}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors w-full sm:w-auto"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Rimuovi immagine</span>
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Titolo</label>
                      <input
                        type="text"
                        value={post.title}
                        onChange={(e) => updatePost(index, "title", e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                        placeholder="Titolo del post"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold mb-2 block">Descrizione</label>
                      <textarea
                        value={post.description}
                        onChange={(e) => updatePost(index, "description", e.target.value)}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg min-h-[120px]"
                        placeholder="Descrizione del post"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg w-full sm:w-auto"
                      >
                        Salva modifiche
                      </button>
                      <button
                        onClick={() => setEditingPost(null)}
                        className="px-4 py-2 bg-muted text-muted-foreground rounded-lg w-full sm:w-auto"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{post.title || "Post senza titolo"}</h3>
                        {post.visible === false && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">Nascosto</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{post.description}</p>
                      {post.image && (
                        <div className="relative w-full md:w-64 h-48 bg-muted rounded-lg overflow-hidden mt-2">
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 md:ml-4">
                      <button
                        onClick={() => togglePostVisibility(index)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title={post.visible !== false ? "Nascondi" : "Mostra"}
                      >
                        {post.visible !== false ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingPost(index)}
                        className="p-2 rounded-lg hover:bg-accent transition-colors"
                        title="Modifica"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePost(index)}
                        className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center text-muted-foreground py-12 bg-card border border-border rounded-xl">
              <p>Nessun post presente. Clicca su &quot;Aggiungi Post&quot; per iniziare.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
