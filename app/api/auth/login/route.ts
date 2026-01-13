import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabase-server"

const ADMIN_EMAIL = "barinellocity@gmail.com"
const ADMIN_PASSWORD = "123456789Robetro"

// Funzione per caricare le credenziali da Supabase (se disponibili)
async function loadAdminCredentials() {
  try {
    if (supabaseServer) {
      const { data, error } = await supabaseServer
        .from("admin_data")
        .select("value")
        .eq("key", "admin_credentials")
        .single()

      if (!error && data && data.value) {
        return {
          email: data.value.email || ADMIN_EMAIL,
          password: data.value.password || ADMIN_PASSWORD
        }
      }
    }
  } catch (error) {
    console.error("Error loading admin credentials from Supabase:", error)
  }
  
  // Fallback alle credenziali hardcoded
  return {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e password sono obbligatorie" },
        { status: 400 }
      )
    }

    // Carica le credenziali (da Supabase o fallback)
    const credentials = await loadAdminCredentials()

    // Normalizza l'input (trim e lowercase per email)
    const normalizedEmail = email?.trim().toLowerCase()
    const normalizedPassword = password?.trim()
    const normalizedStoredEmail = credentials.email?.trim().toLowerCase()
    const normalizedStoredPassword = credentials.password?.trim()

    // Logging per debug (senza esporre password)
    console.log("Login attempt:", {
      providedEmail: normalizedEmail,
      providedPasswordLength: normalizedPassword?.length,
      storedEmail: normalizedStoredEmail,
      storedPasswordLength: normalizedStoredPassword?.length,
      emailMatch: normalizedEmail === normalizedStoredEmail,
      passwordMatch: normalizedPassword === normalizedStoredPassword,
      credentialsSource: credentials.email === ADMIN_EMAIL ? "hardcoded" : "supabase"
    })

    // Confronto più robusto
    const emailMatches = normalizedEmail === normalizedStoredEmail
    const passwordMatches = normalizedPassword === normalizedStoredPassword

    if (emailMatches && passwordMatches) {
      // Crea un token semplice (in produzione usa JWT)
      const token = Buffer.from(`${normalizedEmail}:${Date.now()}`).toString("base64")
      
      // Imposta il cookie
      const cookieStore = await cookies()
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 giorni
        path: "/"
      })

      console.log("Login successful, cookie set")
      return NextResponse.json({ success: true })
    }

    // Log dettagliato per capire il problema
    console.log("Login failed:", {
      emailMatch: emailMatches,
      passwordMatch: passwordMatches,
      providedEmailChars: normalizedEmail?.split(""),
      storedEmailChars: normalizedStoredEmail?.split(""),
      providedPasswordChars: normalizedPassword?.split("").map(() => "*"),
      storedPasswordChars: normalizedStoredPassword?.split("").map(() => "*")
    })

    return NextResponse.json(
      { 
        error: "Credenziali non valide",
        debug: process.env.NODE_ENV === "development" ? {
          emailMatch: emailMatches,
          passwordMatch: passwordMatches,
          providedEmailLength: normalizedEmail?.length,
          storedEmailLength: normalizedStoredEmail?.length,
          providedPasswordLength: normalizedPassword?.length,
          storedPasswordLength: normalizedStoredPassword?.length
        } : undefined
      },
      { status: 401 }
    )
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Errore nel server", details: error.message },
      { status: 500 }
    )
  }
}


