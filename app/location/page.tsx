"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Video {
  id: string
  src: string
  title: string
  description: string
}

// Video dei tramonti
const sunsetVideos: Video[] = [
  {
    id: "i",
    src: "/video/i.mp4",
    title: "Tramonto sul mare",
    description: "Lasciatevi incantare dai tramonti mozzafiato che ogni sera colorano il cielo sopra il mare di Terrasini. Un momento magico che rende ogni cena al Ristorante Barinello un'esperienza indimenticabile, dove la natura si fonde con l'eccellenza culinaria."
  },
  {
    id: "ii",
    src: "/video/ii.mp4",
    title: "Il sole che si tuffa nel mare",
    description: "Il sole che si tuffa nel mare cristallino crea uno spettacolo unico che solo la Sicilia può offrire. Sulla nostra terrazza affacciata sul mare, potete ammirare questi momenti di pura bellezza mentre gustate i nostri piatti di pesce freschissimo."
  }
]

// Video dei piatti
const dishVideos: Video[] = [
  {
    id: "d",
    src: "/video/d.mp4",
    title: "I nostri spaghetti alle vongole",
    description: "Spaghetti perfettamente al dente con vongole veraci freschissime, aglio, prezzemolo e un tocco di vino bianco. Un classico della cucina siciliana che celebra il sapore autentico del mare, preparato con la passione e l'esperienza che solo la tradizione può offrire."
  },
  {
    id: "f",
    src: "/video/f.mp4",
    title: "Le nostre busiate con gambero",
    description: "La pasta tipica siciliana incontra i gamberi freschissimi del nostro mare. Le busiate, avvolte a mano secondo l'antica tradizione, si sposano perfettamente con il sapore delicato e intenso dei gamberi, creando un piatto che è poesia in ogni boccone."
  },
  {
    id: "g",
    src: "/video/g.mp4",
    title: "Le nostre linguine all'astice",
    description: "Linguine di grano duro con astice fresco appena pescato, pomodorini pachino e basilico siciliano. Un piatto di lusso che esalta la dolcezza dell'astice e la ricchezza del mare, servito con eleganza e raffinatezza."
  },
  {
    id: "w",
    src: "/video/w.mp4",
    title: "Il nostro pescato fresco",
    description: "Ogni mattina i nostri pescatori locali portano il pesce più fresco del mare di Terrasini. Branzini, orate, triglie e pesce spada vengono selezionati con cura per garantire la massima qualità e freschezza in ogni nostro piatto."
  },
  {
    id: "e",
    src: "/video/e.mp4",
    title: "Il nostro pescato fresco",
    description: "La tradizione della pesca siciliana si unisce all'arte culinaria. Il nostro pescato del giorno viene preparato rispettando i sapori autentici del mare, con tecniche che esaltano la naturale bontà di ogni ingrediente."
  },
  {
    id: "u",
    src: "/video/u.mp4",
    title: "I nostri crudi di mare",
    description: "Una selezione raffinata di crudi di pesce freschissimo: pesce spada, tonno, gamberi e ricci di mare. Ogni boccone è un'esplosione di sapori puri e autentici, accompagnati da olio extravergine siciliano e limone dell'isola."
  }
]

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

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background/0 via-background/0 to-muted/0 relative z-10">
      <Navigation />
      
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-7xl mx-auto">
          {/* Sezione Tramonti */}
          <section className="mb-32 md:mb-40">
            <div className="text-center mb-16 md:mb-24">
              <h2 
                className="text-5xl md:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                I nostri tramonti
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
            </div>
            <div className="space-y-20 md:space-y-28">
              {sunsetVideos.map((video, index) => {
                const isEven = index % 2 === 0
                return (
                  <div
                    key={video.id}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center min-h-[70vh]`}
                  >
                    {/* Video */}
                    <div className="flex-1 w-full">
                      <VideoPlayer video={video} isEven={isEven} />
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1 w-full">
                      <div className="h-full flex flex-col justify-center p-8 md:p-12 relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                        <h3 
                          className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-foreground tracking-tight"
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {video.title}
                        </h3>
                        <p 
                          className="text-lg md:text-2xl text-muted-foreground leading-relaxed md:leading-loose"
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Sezione Piatti */}
          <section className="mb-20">
            <div className="text-center mb-16 md:mb-24">
              <h2 
                className="text-5xl md:text-7xl font-bold mb-4 tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
                style={{ fontFamily: "var(--font-playfair), serif" }}
              >
                I nostri piatti
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6" />
            </div>
            <div className="space-y-20 md:space-y-28">
              {dishVideos.map((video, index) => {
                const isEven = index % 2 === 0
                return (
                  <div
                    key={video.id}
                    className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center min-h-[70vh]`}
                  >
                    {/* Video */}
                    <div className="flex-1 w-full">
                      <VideoPlayer video={video} isEven={isEven} />
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1 w-full">
                      <div className="h-full flex flex-col justify-center p-8 md:p-12 relative">
                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent opacity-50" />
                        <h3 
                          className="text-3xl md:text-5xl font-bold mb-6 md:mb-8 text-foreground tracking-tight"
                          style={{ fontFamily: "var(--font-playfair), serif" }}
                        >
                          {video.title}
                        </h3>
                        <p 
                          className="text-lg md:text-2xl text-muted-foreground leading-relaxed md:leading-loose"
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          {video.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Footer Link */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Torna alla home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  )
}
