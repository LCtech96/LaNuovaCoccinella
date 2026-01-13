# Istruzioni per Aggiungere le Immagini

## Immagini da Aggiungere

1. **Immagine di Copertina** (coverImage)
   - Posizione: `public/cover-image.jpg` o `public/cover-image.png`
   - Dimensione consigliata: 1200x400px
   - Questa è l'immagine che vedi nella prima foto caricata (vista del mare con cocktail)

2. **Immagine Profilo** (profileImage)
   - Posizione: `public/profile-image.jpg` o `public/profile-image.png`
   - Dimensione consigliata: 400x400px (quadrata)
   - Questa è l'immagine che vedi nella seconda foto caricata (cocktail con testo "Barinello City")

3. **Immagini Gallery**
   - Posizione: `public/gallery/`
   - Aggiungi le foto del ristorante e dei piatti
   - Dimensione consigliata: 800x1200px (verticale)
   - Nomi suggeriti: `gallery-1.jpg`, `gallery-2.jpg`, ecc.

## Come Sostituire le Immagini

1. Aggiungi le immagini nella cartella `public/`
2. Apri `app/page.tsx`
3. Sostituisci gli URL placeholder con i percorsi locali:

```typescript
// Sostituisci queste righe:
const coverImage = "https://images.unsplash.com/..."
const profileImage = "https://images.unsplash.com/..."

// Con:
const coverImage = "/cover-image.jpg"
const profileImage = "/profile-image.jpg"

// E per la gallery:
const galleryImages = [
  {
    id: 1,
    src: "/gallery/gallery-1.jpg",
    alt: "Descrizione immagine 1",
  },
  // ... altre immagini
]
```

## Note

- Le immagini devono essere ottimizzate per il web (formato JPG o WebP)
- Usa strumenti come TinyPNG o ImageOptim per ridurre le dimensioni
- Next.js ottimizza automaticamente le immagini con il componente Image

