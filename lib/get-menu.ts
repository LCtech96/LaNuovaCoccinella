import { unstable_cache } from "next/cache"
import { supabaseServer } from "@/lib/supabase-server"
import { defaultMenuCategories, type Category } from "@/lib/menu-data-default"

function mergeWithDefaults(savedCategories: Category[]): Category[] {
  const savedTitles = new Set(savedCategories.map((cat) => cat.title))
  const missingCategories = defaultMenuCategories.filter(
    (defaultCat) => !savedTitles.has(defaultCat.title)
  )
  return [...savedCategories, ...missingCategories]
}

async function fetchMenuFromSource(): Promise<Category[]> {
  try {
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "menu")
        .single()

      if (
        !error &&
        data?.value &&
        Array.isArray(data.value) &&
        data.value.length > 0
      ) {
        return mergeWithDefaults(data.value as Category[])
      }
    }
  } catch (error) {
    console.error("Error loading menu:", error)
  }

  return defaultMenuCategories
}

export const getMenuCategories = unstable_cache(
  fetchMenuFromSource,
  ["menu-categories"],
  {
    revalidate: 60,
    tags: ["menu"],
  }
)

export function getVisibleMenuCategories(categories: Category[]): Category[] {
  return categories.map((cat) => ({
    ...cat,
    dishes: cat.dishes.filter((dish) => dish.visible !== false),
  }))
}
