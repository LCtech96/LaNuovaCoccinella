-- Query SQL per inizializzare i clienti su Supabase
-- Esegui questa query nella SQL Editor di Supabase

-- Assicurati che la tabella admin_data esista (dovrebbe già esistere)
-- Se non esiste, esegui prima supabase-schema.sql

-- Inserisci un array vuoto di clienti (verranno gestiti tramite l'admin panel)
INSERT INTO admin_data (key, value, updated_at)
VALUES (
  'customers',
  '[]'::jsonb,
  NOW()
)
ON CONFLICT (key) 
DO UPDATE SET 
  value = EXCLUDED.value,
  updated_at = NOW();

-- Verifica che i clienti siano stati inizializzati
SELECT key, value, updated_at 
FROM admin_data 
WHERE key = 'customers';
