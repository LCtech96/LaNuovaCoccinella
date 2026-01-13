-- Query SQL per inserire le credenziali admin su Supabase
-- Esegui questa query nella SQL Editor di Supabase

-- Crea la tabella admin_data se non esiste
CREATE TABLE IF NOT EXISTS admin_data (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Crea l'indice se non esiste
CREATE INDEX IF NOT EXISTS idx_admin_data_key ON admin_data(key);

-- Abilita Row Level Security (RLS) se non già abilitato
ALTER TABLE admin_data ENABLE ROW LEVEL SECURITY;

-- Crea la policy per la lettura pubblica se non esiste
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'admin_data' 
    AND policyname = 'Public read access for admin_data'
  ) THEN
    CREATE POLICY "Public read access for admin_data" ON admin_data
      FOR SELECT USING (true);
  END IF;
END
$$;

-- Inserisci o aggiorna le credenziali admin
INSERT INTO admin_data (key, value, updated_at)
VALUES (
  'admin_credentials',
  '{
    "email": "anthony316@outlook.it",
    "password": "123456789Cocci"
  }'::jsonb,
  NOW()
)
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Verifica che le credenziali siano state inserite correttamente
SELECT key, value, updated_at 
FROM admin_data 
WHERE key = 'admin_credentials';



