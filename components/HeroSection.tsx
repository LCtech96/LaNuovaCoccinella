"use client"

import Image from "next/image"

interface HeroSectionProps {
  coverImage: string
  profileImage: string
}

export function HeroSection({ coverImage, profileImage }: HeroSectionProps) {
  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
        <Image
          src={coverImage}
          alt="Vista del mare e faraglioni"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40" />
      </div>

      {/* Profile Image Container */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-24 flex justify-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-background shadow-lg">
            <Image
              src={profileImage}
              alt="La Nuova Coccinella di Salvo & Family"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Title and Name */}
      <div className="container mx-auto px-4 mt-6 text-center">
        <h2 className="text-lg md:text-xl text-muted-foreground mb-2">Tra i faraglioni e la vista del mare</h2>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">La Nuova Coccinella di Salvo & Family</h1>
      </div>
    </div>
  )
}

