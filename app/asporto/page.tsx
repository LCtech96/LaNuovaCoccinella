import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import { AsportoMenu } from "@/components/AsportoMenu"
import {
  getMenuCategories,
  getVisibleMenuCategories,
} from "@/lib/get-menu"

export const revalidate = 60

export const metadata = {
  title: "Menù Asporto | La Nuova Coccinella",
  description:
    "Consulta il menù asporto della Nuova Coccinella di Salvo & Family a Terrasini.",
}

export default async function AsportoPage() {
  const categories = getVisibleMenuCategories(await getMenuCategories())

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-24 md:py-32">
        <AsportoMenu categories={categories} />
      </div>
      <Footer />
    </main>
  )
}
