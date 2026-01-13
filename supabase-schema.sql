-- Schema per il database Supabase
-- Esegui questo script nella SQL Editor di Supabase

-- Tabella per i dati admin (menu, ai_knowledge, content)
CREATE TABLE IF NOT EXISTS admin_data (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella per le prenotazioni
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  guests TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per migliorare le performance
CREATE INDEX IF NOT EXISTS idx_admin_data_key ON admin_data(key);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);

-- Abilita Row Level Security (RLS)
ALTER TABLE admin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policy per admin_data: solo lettura pubblica, scrittura solo per admin autenticati
CREATE POLICY "Public read access for admin_data" ON admin_data
  FOR SELECT USING (true);

-- Policy per bookings: inserimento pubblico, lettura solo per admin
CREATE POLICY "Public insert access for bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Nota: Per le policy di scrittura su admin_data, dovrai configurarle manualmente
-- o usare il service_role key nelle API routes invece dell'anon key




