"use client"

import { HeroSection } from "@/components/HeroSection"
import { Navigation } from "@/components/Navigation"
import { Description } from "@/components/Description"
import { Address } from "@/components/Address"
import { Footer } from "@/components/Footer"
import { useEffect, useRef, useState } from "react"

// Immagini locali
const coverImage = "/cop.png"
const profileImage = "/profile.png"

interface Video {
  id: string
  src: string
  title: string
  description: string
  visible?: boolean
}

interface Image {
  id: string
  src: string
  title: string
  description: string
  visible?: boolean
}

interface Product {
  id: string
  src: string
  title: string
  description: string
  visible?: boolean
}

interface Cocktail {
  id: string
  src: string
  name: string
  ingredients: string
  visible?: boolean
}

function VideoPlayer({ video, isEven }: { video: Video; isEven: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const currentVideo = videoRef.current
    if (!currentVideo) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setIsVisible(true)
            currentVideo.play().catch(() => {
              // Autoplay può essere bloccato dal browser
            })
          } else {
            setIsVisible(false)
            currentVideo.pause()
          }
        })
      },
      {
        threshold: 0.5, // Il video deve essere almeno al 50% visibile
        rootMargin: "0px"
      }
    )

    observer.observe(currentVideo)

    return () => {
      observer.unobserve(currentVideo)
    }
  }, [])

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
      <video
        ref={videoRef}
        src={video.src}
        controls={false}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        preload="auto"
        loop
        muted
        playsInline
        onContextMenu={(e) => e.preventDefault()}
      >
        Il tuo browser non supporta il tag video.
      </video>
    </div>
  )
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [barman, setBarman] = useState<{ id: string; src: string; title: string; description: string; visible?: boolean } | null>(null)
  const [cocktails, setCocktails] = useState<Cocktail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch("/api/content", {
          cache: "no-store"
        })
        if (response.ok) {
          const data = await response.json()
          // Filtra solo i video e immagini visibili
          const visibleVideos = (data.videos || []).filter((video: Video) => video.visible !== false)
          const visibleImages = (data.images || []).filter((image: Image) => image.visible !== false)
          const visibleProducts = (data.products || []).filter((product: Product) => product.visible !== false)
          const visibleCocktails = (data.cocktails || []).filter((cocktail: Cocktail) => cocktail.visible !== false)
          setVideos(visibleVideos)
          setImages(visibleImages)
          setProducts(visibleProducts)
          setCocktails(visibleCocktails)
          if (data.barman && data.barman.visible !== false) {
            setBarman(data.barman)
          }
        }
      } catch (error) {
        console.error("Error loading content:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Separa i video in tramonti (primi 2) e piatti (restanti)
  const sunsetVideos = videos.filter((v) => v.id === "i" || v.id === "ii")
  const dishVideos = videos.filter((v) => v.id !== "i" && v.id !== "ii")
  
  // Crea un array combinato di video e immagini intercalati
  const combineMedia = () => {
    const combined: Array<{ type: 'video' | 'image'; data: Video | Image; index: number }> = []
    let imageIndex = 0
    
    // Aggiungi tramonti
    sunsetVideos.forEach((video, idx) => {
      combined.push({ type: 'video', data: video, index: idx })
      // Dopo ogni tramonto, aggiungi un'immagine se disponibile
      if (imageIndex < images.length) {
        combined.push({ type: 'image', data: images[imageIndex], index: imageIndex })
        imageIndex++
      }
    })
    
    // Aggiungi piatti
    dishVideos.forEach((video, idx) => {
      combined.push({ type: 'video', data: video, index: idx })
      // Dopo ogni piatto, aggiungi un'immagine se disponibile
      if (imageIndex < images.length) {
        combined.push({ type: 'image', data: images[imageIndex], index: imageIndex })
        imageIndex++
      }
    })
    
    // Aggiungi eventuali immagini rimanenti alla fine
    while (imageIndex < images.length) {
      combined.push({ type: 'image', data: images[imageIndex], index: imageIndex })
      imageIndex++
    }
    
    return combined
  }
  
  const combinedMedia = combineMedia()

  if (loading) {
    return (
      <main className="min-h-screen relative z-10">
        <Navigation />
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-muted-foreground">Caricamento...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen relative z-10">
      <Navigation />
      
      {/* Hero Section with Cover and Profile */}
      <div className="pt-0 md:pt-16">
        <HeroSection coverImage={coverImage} profileImage={profileImage} />
      </div>

      {/* Sezione Prodotti e Qualità - tra Hero e Tramonti */}
      {products.length > 0 && (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-6 md:space-y-8">
              {products.map((product, index) => (
                <div 
                  key={product.id || index} 
                  className={`flex gap-3 md:gap-6 items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Immagine */}
                  <div className="flex-1 w-full">
                    <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.src} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Descrizione */}
                  <div className="flex-1 w-full">
                    <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                      <h3 
                        className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                        style={{ fontFamily: "var(--font-playfair), serif" }}
                      >
                        {product.title}
                      </h3>
                      <p 
                        className="text-xs md:text-base text-muted-foreground leading-relaxed"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {product.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cocktail - griglia di immagini */}
              {barman && (
                <div className="space-y-4 md:space-y-6">
                  <div className="flex flex-row-reverse gap-3 md:gap-6 items-center">
                    {/* Immagine barman */}
                    <div className="flex-1 w-full">
                      <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={barman.src} 
                          alt={barman.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Descrizione */}
                    <div className="flex-1 w-full">
                      <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                        <h3 
                          className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {barman.title}
                        </h3>
                        <p 
                          className="text-xs md:text-base text-muted-foreground leading-relaxed"
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          {barman.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Griglia cocktail con nomi e ingredienti */}
                  {cocktails.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
                      {cocktails.map((cocktail, idx) => (
                        <div key={cocktail.id || idx} className="relative w-full aspect-square bg-black rounded-lg md:rounded-xl overflow-hidden shadow-lg group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={cocktail.src} 
                            alt={cocktail.name || `Cocktail ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay con nome e ingredienti */}
                          {(cocktail.name || cocktail.ingredients) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 md:p-3">
                              {cocktail.name && (
                                <h4 
                                  className="text-white font-bold text-xs md:text-sm mb-1"
                                  style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                  {cocktail.name}
                                </h4>
                              )}
                              {cocktail.ingredients && (
                                <p 
                                  className="text-white/90 text-[10px] md:text-xs leading-tight"
                                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                                >
                                  {cocktail.ingredients}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Videos and Images Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Sezione Tramonti */}
          {sunsetVideos.length > 0 && (
            <section className="mb-16 md:mb-20">
              <div className="text-center mb-8 md:mb-12">
                <h2 
                  className="text-4xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  I nostri tramonti
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
              </div>
              <div className="space-y-8 md:space-y-12">
                {sunsetVideos.map((video, index) => {
                  const isEven = index % 2 === 0
                  return (
                    <div key={video.id} className="space-y-8 md:space-y-12">
                      {/* Video */}
                      <div
                        className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-8 items-center`}
                      >
                        {/* Video */}
                        <div className="flex-1 w-full">
                          <VideoPlayer video={video} isEven={isEven} />
                        </div>
                        
                        {/* Description */}
                        <div className="flex-1 w-full">
                          <div className="h-full flex flex-col justify-center p-4 md:p-6 relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                            <h3 
                              className="text-2xl md:text-4xl font-bold mb-4 md:mb-6 text-foreground tracking-tight"
                              style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                              {video.title}
                            </h3>
                            <p 
                              className="text-base md:text-xl text-muted-foreground leading-relaxed"
                              style={{ fontFamily: "var(--font-cormorant), serif" }}
                            >
                              {video.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Immagine terrazza dopo il primo video */}
                      {index === 0 && (
                        <div className="flex flex-row-reverse gap-3 md:gap-6 items-center">
                          {/* Immagine */}
                          <div className="flex-1 w-full">
                            <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src="/dg.png" 
                                alt="La nostra terrazza vista sui faraglioni"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Descrizione */}
                          <div className="flex-1 w-full">
                            <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                              <h3 
                                className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                                style={{ fontFamily: "var(--font-playfair), serif" }}
                              >
                                La nostra terrazza
                              </h3>
                              <p 
                                className="text-xs md:text-base text-muted-foreground leading-relaxed"
                                style={{ fontFamily: "var(--font-cormorant), serif" }}
                              >
                                La nostra terrazza si affaccia direttamente sui faraglioni, offrendo una vista mozzafiato sul mare cristallino di Terrasini. Un luogo unico dove potete godere dei nostri piatti di pesce freschissimo mentre ammirate lo spettacolo naturale che solo questa posizione privilegiata può offrire.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}


          {/* Sezione Piatti con Immagini Intercalate */}
          {dishVideos.length > 0 && (
            <section className="mb-12">
              <div className="text-center mb-8 md:mb-12">
                <h2 
                  className="text-4xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  I nostri piatti
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
              </div>
              <div className="space-y-6 md:space-y-10">
                {dishVideos.map((video, index) => {
                  const isEven = index % 2 === 0
                  const imageAfter = images[index] // Immagine dopo questo video
                  const isFirstVideo = video.id === "d" // Primo video è d.mp4
                  return (
                    <div key={video.id} className="space-y-6 md:space-y-8">
                      {/* Video con descrizione */}
                      <div
                        className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-4 md:gap-6 items-center`}
                      >
                        {/* Video */}
                        <div className="flex-1 w-full">
                          <VideoPlayer video={video} isEven={isEven} />
                        </div>
                        
                        {/* Description */}
                        <div className="flex-1 w-full">
                          <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                            <h3 
                              className="text-xl md:text-3xl font-bold mb-3 md:mb-5 text-foreground tracking-tight"
                              style={{ fontFamily: "var(--font-playfair), serif" }}
                            >
                              {video.title}
                            </h3>
                            <p 
                              className="text-sm md:text-lg text-muted-foreground leading-relaxed"
                              style={{ fontFamily: "var(--font-cormorant), serif" }}
                            >
                              {video.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Immagine q.png dopo il primo video (d.mp4) */}
                      {isFirstVideo && (
                        <div className="space-y-6 md:space-y-8">
                          <div className="flex flex-row gap-3 md:gap-6 items-center">
                            {/* Immagine */}
                            <div className="flex-1 w-full">
                              <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src="/q.png" 
                                  alt="I nostri spaghetti alle cozze e vongole veraci"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Descrizione */}
                            <div className="flex-1 w-full">
                              <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                                <h3 
                                  className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                                  style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                  I nostri spaghetti alle cozze e vongole veraci
                                </h3>
                                <p 
                                  className="text-xs md:text-base text-muted-foreground leading-relaxed"
                                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                                >
                                  Un piatto che celebra la tradizione siciliana con cozze e vongole veraci freschissime, aglio, prezzemolo e un tocco di vino bianco. Gli spaghetti perfettamente al dente si sposano con il sapore autentico del mare.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Immagine 4.png dopo q.png (alternata) */}
                          <div className="flex flex-row-reverse gap-3 md:gap-6 items-center">
                            {/* Immagine */}
                            <div className="flex-1 w-full">
                              <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src="/4.png" 
                                  alt="I nostri spaghetti al nero di seppia e ricchi di mare"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Descrizione */}
                            <div className="flex-1 w-full">
                              <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                                <h3 
                                  className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                                  style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                  I nostri spaghetti al nero di seppia e ricchi di mare
                                </h3>
                                <p 
                                  className="text-xs md:text-base text-muted-foreground leading-relaxed"
                                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                                >
                                  Un piatto dal sapore intenso e caratteristico, preparato con il nero di seppia freschissimo e arricchito con frutti di mare selezionati. Gli spaghetti perfettamente al dente si colorano del nero profondo della seppia, creando un&apos;esperienza culinaria unica che celebra i sapori autentici del nostro mare.
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Immagine l.png dopo 4.png (alternata) */}
                          <div className="flex flex-row gap-3 md:gap-6 items-center">
                            {/* Immagine */}
                            <div className="flex-1 w-full">
                              <div className="relative w-full aspect-square md:aspect-[4/3] bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img 
                                  src="/l.png" 
                                  alt="Le nostre linguine all'astice"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Descrizione */}
                            <div className="flex-1 w-full">
                              <div className="h-full flex flex-col justify-center p-3 md:p-5 relative">
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                                <h3 
                                  className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight"
                                  style={{ fontFamily: "var(--font-playfair), serif" }}
                                >
                                  Le nostre linguine all&apos;astice
                                </h3>
                                <p 
                                  className="text-xs md:text-base text-muted-foreground leading-relaxed"
                                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                                >
                                  Linguine di grano duro con astice fresco appena pescato, pomodorini pachino e basilico siciliano. Un piatto di lusso che esalta la dolcezza dell&apos;astice e la ricchezza del mare, servito con eleganza e raffinatezza.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Immagine dopo il video (da admin) */}
                      {imageAfter && !isFirstVideo && (
                        <div className="w-full">
                          <div className="relative w-full aspect-[4/3] md:aspect-video bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-xl md:shadow-2xl">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={imageAfter.src} 
                              alt={imageAfter.title || imageAfter.description}
                              className="w-full h-full object-cover"
                            />
                            {(imageAfter.title || imageAfter.description) && (
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 md:p-6">
                                {imageAfter.title && (
                                  <h3 
                                    className="text-xl md:text-2xl font-bold mb-2 text-white"
                                    style={{ fontFamily: "var(--font-playfair), serif" }}
                                  >
                                    {imageAfter.title}
                                  </h3>
                                )}
                                {imageAfter.description && (
                                  <p 
                                    className="text-sm md:text-base text-white/90"
                                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                                  >
                                    {imageAfter.description}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Google Maps Section */}
          <section className="mb-12 mt-16 md:mt-20">
            <div className="text-center mb-12 md:mb-16">
              <h2 
                className="text-4xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                Come raggiungerci
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
            </div>
            <div className="w-full">
              <a
                href="https://maps.app.goo.gl/HT4SD3RfGD9w4ewj6"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 group cursor-pointer"
              >
                <div className="relative w-full aspect-video bg-muted">
                  <iframe
                    src="https://maps.google.com/maps?q=Via+G.+Ventimiglia,+73,+90049+Terrasini+PA&hl=it&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
              </a>
              <p className="text-center text-muted-foreground mt-4 text-sm md:text-base">
                Clicca sulla mappa per aprire Google Maps
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Description Section */}
      <Description />

      {/* Address Section */}
      <Address />

      {/* Footer */}
      <Footer />

    </main>
  )
}
