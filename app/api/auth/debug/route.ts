import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

const ADMIN_EMAIL = "barinellocity@gmail.com"
const ADMIN_PASSWORD = "123456789Robetro"

// Endpoint di debug per verificare le credenziali
export async function GET(request: NextRequest) {
  try {
    // Carica le credenziali da Supabase
    let credentialsFromSupabase = null
    try {
      if (supabaseServer) {
        const { data, error } = await supabaseServer
          .from("admin_data")
          .select("value")
          .eq("key", "admin_credentials")
          .single()

        if (!error && data && data.value) {
          credentialsFromSupabase = data.value
        }
      }
    } catch (error) {
      console.error("Error loading from Supabase:", error)
    }

    return NextResponse.json({
      hardcoded: {
        email: ADMIN_EMAIL,
        passwordLength: ADMIN_PASSWORD.length,
        passwordFirstChar: ADMIN_PASSWORD[0],
        passwordLastChar: ADMIN_PASSWORD[ADMIN_PASSWORD.length - 1]
      },
      supabase: credentialsFromSupabase ? {
        email: credentialsFromSupabase.email,
        passwordLength: credentialsFromSupabase.password?.length,
        passwordFirstChar: credentialsFromSupabase.password?.[0],
        passwordLastChar: credentialsFromSupabase.password?.[credentialsFromSupabase.password?.length - 1]
      } : null,
      activeCredentials: credentialsFromSupabase || {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}



