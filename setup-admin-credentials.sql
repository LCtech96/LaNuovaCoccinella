-- Query SQL per inserire le credenziali admin su Supabase
-- Esegui questa query nella SQL Editor di Supabase

-- Inserisci o aggiorna le credenziali admin
INSERT INTO admin_data (key, value, updated_at)
VALUES (
  'admin_credentials',
  '{
    "email": "barinellocity@gmail.com",
    "password": "123456789Robetro"
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



