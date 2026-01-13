"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Upload, Image as ImageIcon, Plus, Trash2, Eye, EyeOff, Edit2 } from "lucide-react"
import Link from "next/link"

interface EditableImage {
  id: string
  src: string
  title: string
  description: string
  visible?: boolean
}

interface Content {
  coverImage: string
  profileImage: string
  videos: Array<{ id: string; src: string; title: string; description: string; visible?: boolean }>
  images: Array<{ id: string; src: string; title: string; description: string; visible?: boolean }>
  editableImages?: Array<EditableImage>
}

export default function AdminContentPage() {
  const [content, setContent] = useState<Content>({
    coverImage: "/cop.png",
    profileImage: "/profile.png",
    videos: [],
    images: [],
    editableImages: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [editingItem, setEditingItem] = useState<{ type: "video" | "image"; index: number } | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch("/api/content")
      if (response.ok) {
        const data = await response.json()
        setContent(data)
      }
    } catch (error) {
      console.error("Error loading content:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveContent = async () => {
    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        setMessage("Contenuti salvati con successo!")
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

  const handleImageUpload = async (type: "cover" | "profile", file: File) => {
    // Qui implementeresti l'upload dell'immagine
    // Per ora salva solo il nome del file
    const imageUrl = `/uploads/${file.name}`
    if (type === "cover") {
      setContent({ ...content, coverImage: imageUrl })
    } else {
      setContent({ ...content, profileImage: imageUrl })
    }
  }

  const handleFileUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64Image = reader.result as string
      callback(base64Image)
    }
    reader.onerror = () => {
      setMessage("Errore durante il caricamento dell'immagine")
      setTimeout(() => setMessage(""), 3000)
    }
    reader.readAsDataURL(file)
  }

  const handleDoubleClick = (type: "video" | "image", index: number) => {
    setEditingItem({ type, index })
  }

  const addVideo = () => {
    const newVideo = {
      id: `video-${Date.now()}`,
      src: "",
      title: "",
      description: "",
      visible: true
    }
    setContent({ ...content, videos: [...content.videos, newVideo] })
    setEditingItem({ type: "video", index: content.videos.length })
  }

  const deleteVideo = async (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questo video?")) {
      const newVideos = content.videos.filter((_, i) => i !== index)
      const updatedContent = { ...content, videos: newVideos }
      setContent(updatedContent)
      if (editingItem?.type === "video" && editingItem.index === index) {
        setEditingItem(null)
      }
      
      // Salva automaticamente dopo l'eliminazione
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedContent),
        })
        if (response.ok) {
          setMessage("Video eliminato con successo")
          setTimeout(() => setMessage(""), 2000)
        } else {
          setMessage("Errore nell'eliminazione del video")
          setTimeout(() => setMessage(""), 3000)
        }
      } catch (error) {
        console.error("Error deleting video:", error)
        setMessage("Errore nell'eliminazione del video")
        setTimeout(() => setMessage(""), 3000)
      }
    }
  }

  const toggleVideoVisibility = async (index: number) => {
    const newVideos = [...content.videos]
    // Gestisci correttamente undefined: se è undefined o true, diventa false; se è false, diventa true
    const currentVisible = newVideos[index].visible !== false // true se visible è undefined o true
    newVideos[index] = { ...newVideos[index], visible: !currentVisible }
    setContent({ ...content, videos: newVideos })
    
    // Salva automaticamente quando si cambia la visibilità
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, videos: newVideos }),
      })
      if (response.ok) {
        setMessage(currentVisible ? "Video nascosto" : "Video mostrato")
        setTimeout(() => setMessage(""), 2000)
      }
    } catch (error) {
      console.error("Error saving visibility:", error)
    }
  }

  const updateVideo = (index: number, field: "title" | "description" | "src", value: string) => {
    const newVideos = [...content.videos]
    newVideos[index] = { ...newVideos[index], [field]: value }
    setContent({ ...content, videos: newVideos })
  }

  const updateImage = (index: number, field: "title" | "description" | "src", value: string) => {
    const newImages = [...content.images]
    newImages[index] = { ...newImages[index], [field]: value }
    setContent({ ...content, images: newImages })
  }

  const addImage = () => {
    const newImage = {
      id: `image-${Date.now()}`,
      src: "",
      title: "",
      description: "",
      visible: true
    }
    setContent({ ...content, images: [...content.images, newImage] })
    setEditingItem({ type: "image", index: content.images.length })
  }

  const deleteImage = async (index: number) => {
    if (confirm("Sei sicuro di voler eliminare questa immagine?")) {
      const newImages = content.images.filter((_, i) => i !== index)
      const updatedContent = { ...content, images: newImages }
      setContent(updatedContent)
      if (editingItem?.type === "image" && editingItem.index === index) {
        setEditingItem(null)
      }
      
      // Salva automaticamente dopo l'eliminazione
      try {
        const response = await fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedContent),
        })
        if (response.ok) {
          setMessage("Immagine eliminata con successo")
          setTimeout(() => setMessage(""), 2000)
        } else {
          setMessage("Errore nell'eliminazione dell'immagine")
          setTimeout(() => setMessage(""), 3000)
        }
      } catch (error) {
        console.error("Error deleting image:", error)
        setMessage("Errore nell'eliminazione dell'immagine")
        setTimeout(() => setMessage(""), 3000)
      }
    }
  }

  const toggleImageVisibility = async (index: number) => {
    const newImages = [...content.images]
    // Gestisci correttamente undefined: se è undefined o true, diventa false; se è false, diventa true
    const currentVisible = newImages[index].visible !== false // true se visible è undefined o true
    newImages[index] = { ...newImages[index], visible: !currentVisible }
    setContent({ ...content, images: newImages })
    
    // Salva automaticamente quando si cambia la visibilità
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...content, images: newImages }),
      })
      if (response.ok) {
        setMessage(currentVisible ? "Immagine nascosta" : "Immagine mostrata")
        setTimeout(() => setMessage(""), 2000)
      }
    } catch (error) {
      console.error("Error saving visibility:", error)
    }
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna al pannello</span>
            </Link>
            <h1 className="text-4xl font-bold mb-2">Gestione Contenuti</h1>
            <p className="text-muted-foreground">Modifica immagini profilo/copertina e contenuti video/foto (doppio tap per modificare)</p>
          </div>
          <button
            onClick={saveContent}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Salvataggio..." : "Salva"}</span>
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.includes("successo") ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Immagine di copertina */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Immagine di Copertina</h2>
            <div className="flex gap-4">
              <div className="relative w-48 h-32 bg-muted rounded-lg overflow-hidden">
                <img src={content.coverImage} alt="Cover" className="w-full h-full object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload("cover", file)
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Clicca sull&apos;immagine per caricare una nuova</p>
                <input
                  type="text"
                  value={content.coverImage}
                  onChange={(e) => setContent({ ...content, coverImage: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="/cop.png"
                />
              </div>
            </div>
          </div>

          {/* Immagine profilo */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Immagine Profilo</h2>
            <div className="flex gap-4">
              <div className="relative w-32 h-32 bg-muted rounded-full overflow-hidden">
                <img src={content.profileImage} alt="Profile" className="w-full h-full object-cover" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload("profile", file)
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Clicca sull&apos;immagine per caricare una nuova</p>
                <input
                  type="text"
                  value={content.profileImage}
                  onChange={(e) => setContent({ ...content, profileImage: e.target.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                  placeholder="/profile.png"
                />
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Video</h2>
              <button
                onClick={addVideo}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Video</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Clicca su un video per modificarlo</p>
            <div className="space-y-4">
              {content.videos.map((video, index) => (
                <div
                  key={video.id || index}
                  className={`p-4 border border-border rounded-lg ${video.visible === false ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      {editingItem?.type === "video" && editingItem.index === index ? (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Percorso Video</label>
                            <input
                              type="text"
                              value={video.src}
                              onChange={(e) => updateVideo(index, "src", e.target.value)}
                              className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                              placeholder="/video/nome-video.mp4"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Titolo</label>
                            <input
                              type="text"
                              value={video.title}
                              onChange={(e) => updateVideo(index, "title", e.target.value)}
                              className="w-full px-4 py-2 bg-background border border-border rounded-lg"
                              placeholder="Titolo"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-semibold mb-1 block">Descrizione</label>
                            <textarea
                              value={video.description}
                              onChange={(e) => updateVideo(index, "description", e.target.value)}
                              className="w-full px-4 py-2 bg-background border border-border rounded-lg min-h-[100px]"
                              placeholder="Descrizione"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                            >
                              Salva modifiche
                            </button>
                            <button
                              onClick={() => setEditingItem(null)}
                              className="px-4 py-2 bg-muted text-muted-foreground rounded-lg"
                            >
                              Annulla
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{video.title || "Video senza titolo"}</h3>
                            {video.visible === false && (
                              <span className="text-xs bg-muted px-2 py-1 rounded">Nascosto</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{video.description}</p>
                          <p className="text-xs text-muted-foreground">Percorso: {video.src || "Non specificato"}</p>
                        </div>
                      )}
                    </div>
                    {!(editingItem?.type === "video" && editingItem.index === index) && (
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleVideoVisibility(index)}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                          title={video.visible !== false ? "Nascondi" : "Mostra"}
                        >
                          {video.visible !== false ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDoubleClick("video", index)}
                          className="p-2 rounded-lg hover:bg-accent transition-colors"
                          title="Modifica"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteVideo(index)}
                          className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {content.videos.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nessun video presente. Clicca su &quot;Aggiungi Video&quot; per iniziare.</p>
              )}
            </div>
          </div>

          {/* Immagini Modificabili - Solo le 8 immagini specificate */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold">Immagini Modificabili</h2>
                <p className="text-sm text-muted-foreground mt-1">Gestisci le immagini: k.png, kj.png, kkk.png, cop.png, ddd.png, dfg.png, 3.png, 9.png</p>
              </div>
            </div>
            <div className="space-y-4">
              {(content.editableImages || []).map((image, index) => (
                <div
                  key={image.id || index}
                  className={`p-4 border border-border rounded-lg ${image.visible === false ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    {image.src && (
                      <div className="relative w-32 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img src={image.src} alt={image.title || image.id} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{image.src || image.id}</span>
                        {image.visible === false && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">Nascosta</span>
                        )}
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Immagine</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file, (base64) => {
                                  const newImages = [...(content.editableImages || [])]
                                  newImages[index] = { ...newImages[index], src: base64 }
                                  setContent({ ...content, editableImages: newImages })
                                })
                              }
                            }}
                            className="hidden"
                            id={`editable-image-${index}`}
                          />
                          <label
                            htmlFor={`editable-image-${index}`}
                            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-sm cursor-pointer hover:bg-primary/90 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload Foto</span>
                          </label>
                          {image.src && (
                            <span className="text-xs text-muted-foreground">
                              {image.src.startsWith("data:image") ? "Immagine caricata" : image.src}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Titolo</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => {
                            const newImages = [...(content.editableImages || [])]
                            newImages[index] = { ...newImages[index], title: e.target.value }
                            setContent({ ...content, editableImages: newImages })
                          }}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                          placeholder="Titolo"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Descrizione</label>
                        <textarea
                          value={image.description}
                          onChange={(e) => {
                            const newImages = [...(content.editableImages || [])]
                            newImages[index] = { ...newImages[index], description: e.target.value }
                            setContent({ ...content, editableImages: newImages })
                          }}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm min-h-[60px]"
                          placeholder="Descrizione"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newImages = [...(content.editableImages || [])]
                            const currentVisible = newImages[index].visible !== false
                            newImages[index] = { ...newImages[index], visible: !currentVisible }
                            setContent({ ...content, editableImages: newImages })
                          }}
                          className="p-1.5 rounded hover:bg-accent transition-colors"
                          title={image.visible !== false ? "Nascondi" : "Mostra"}
                        >
                          {image.visible !== false ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("Sei sicuro di voler eliminare questa immagine?")) {
                              const newImages = (content.editableImages || []).filter((_, i) => i !== index)
                              const updatedContent = { ...content, editableImages: newImages }
                              setContent(updatedContent)
                              
                              // Salva automaticamente dopo l'eliminazione
                              try {
                                const response = await fetch("/api/content", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify(updatedContent),
                                })
                                if (response.ok) {
                                  setMessage("Immagine eliminata con successo")
                                  setTimeout(() => setMessage(""), 2000)
                                } else {
                                  setMessage("Errore nell'eliminazione dell'immagine")
                                  setTimeout(() => setMessage(""), 3000)
                                }
                              } catch (error) {
                                console.error("Error deleting image:", error)
                                setMessage("Errore nell'eliminazione dell'immagine")
                                setTimeout(() => setMessage(""), 3000)
                              }
                            }
                          }}
                          className="p-1.5 rounded hover:bg-destructive/20 text-destructive transition-colors"
                          title="Elimina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {(!content.editableImages || content.editableImages.length === 0) && (
                <p className="text-center text-muted-foreground py-4">Nessuna immagine presente.</p>
              )}
            </div>
          </div>

          {/* Immagini */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Immagini</h2>
              <button
                onClick={addImage}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Aggiungi Immagine</span>
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Clicca su un&apos;immagine per modificarla</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {content.images.map((image, index) => (
                <div
                  key={image.id || index}
                  className={`border border-border rounded-lg overflow-hidden ${image.visible === false ? "opacity-50" : ""}`}
                >
                  <div className="relative">
                    {image.src ? (
                      <img src={image.src} alt={image.title} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground">
                        Nessuna immagine
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => toggleImageVisibility(index)}
                        className="p-1.5 rounded bg-black/50 hover:bg-black/70 transition-colors"
                        title={image.visible !== false ? "Nascondi" : "Mostra"}
                      >
                        {image.visible !== false ? (
                          <Eye className="w-4 h-4 text-white" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteImage(index)}
                        className="p-1.5 rounded bg-black/50 hover:bg-destructive/70 transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  {editingItem?.type === "image" && editingItem.index === index ? (
                    <div className="p-4 space-y-2">
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Immagine</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file, (base64) => {
                                  updateImage(index, "src", base64)
                                })
                              }
                            }}
                            className="hidden"
                            id={`image-upload-${index}`}
                          />
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded text-sm cursor-pointer hover:bg-primary/90 transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Upload Foto</span>
                          </label>
                          {image.src && (
                            <span className="text-xs text-muted-foreground">
                              {image.src.startsWith("data:image") ? "Immagine caricata" : image.src}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Titolo</label>
                        <input
                          type="text"
                          value={image.title}
                          onChange={(e) => updateImage(index, "title", e.target.value)}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm"
                          placeholder="Titolo"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold mb-1 block">Descrizione</label>
                        <textarea
                          value={image.description}
                          onChange={(e) => updateImage(index, "description", e.target.value)}
                          className="w-full px-2 py-1 bg-background border border-border rounded text-sm min-h-[60px]"
                          placeholder="Descrizione"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex-1 px-2 py-1 bg-primary text-primary-foreground rounded text-sm"
                        >
                          Salva
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex-1 px-2 py-1 bg-muted text-muted-foreground rounded text-sm"
                        >
                          Annulla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{image.title || "Immagine senza titolo"}</h3>
                        {image.visible === false && (
                          <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Nascosta</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{image.description}</p>
                      <button
                        onClick={() => handleDoubleClick("image", index)}
                        className="mt-2 text-xs text-primary hover:underline"
                      >
                        Clicca per modificare
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {content.images.length === 0 && (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  <p>Nessuna immagine presente. Clicca su &quot;Aggiungi Immagine&quot; per iniziare.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

