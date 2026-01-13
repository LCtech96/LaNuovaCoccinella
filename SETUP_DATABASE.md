# Setup Database Supabase

Per far funzionare il sistema admin, devi configurare Supabase come database.

## Passi per configurare Supabase:

### 1. Crea un progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Crea un account o accedi
3. Crea un nuovo progetto
4. Prendi nota dell'URL del progetto e della chiave anonima (anon key)

### 2. Crea le tabelle nel database

1. Vai nella sezione "SQL Editor" del tuo progetto Supabase
2. Esegui lo script SQL contenuto nel file `supabase-schema.sql`:

```sql
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

-- Policy per admin_data: lettura pubblica
CREATE POLICY "Public read access for admin_data" ON admin_data
  FOR SELECT USING (true);

-- Policy per bookings: inserimento pubblico, lettura solo per admin
CREATE POLICY "Public insert access for bookings" ON bookings
  FOR INSERT WITH CHECK (true);
```

### 3. Configura le variabili d'ambiente

#### In locale (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Nota:** La `SUPABASE_SERVICE_ROLE_KEY` è opzionale ma consigliata. La trovi nelle impostazioni del progetto Supabase sotto "API" > "service_role" (tieni questa chiave segreta!).

#### Su Vercel:

1. Vai nelle impostazioni del tuo progetto su Vercel
2. Sezione "Environment Variables"
3. Aggiungi:
   - `NEXT_PUBLIC_SUPABASE_URL` = URL del tuo progetto Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Chiave anonima
   - `SUPABASE_SERVICE_ROLE_KEY` = Service role key (opzionale ma consigliata)

### 4. Configura le policy RLS (Row Level Security)

Per permettere la scrittura su `admin_data` dalle API routes, hai due opzioni:

#### Opzione A: Usa Service Role Key (Consigliata)
- Aggiungi `SUPABASE_SERVICE_ROLE_KEY` nelle variabili d'ambiente
- Questa chiave bypassa RLS, quindi funziona automaticamente

#### Opzione B: Configura policy RLS manualmente
Se non vuoi usare la service role key, crea una policy per permettere l'upsert:

```sql
CREATE POLICY "Allow upsert for admin_data" ON admin_data
  FOR ALL USING (true) WITH CHECK (true);
```

**Attenzione:** Questa policy permette a chiunque di modificare i dati. Per sicurezza, usa la service role key nelle API routes.

### 5. Verifica la configurazione

Dopo aver configurato tutto:
1. Fai il deploy dell'applicazione
2. Accedi al pannello admin
3. Prova a salvare una modifica al menu
4. Se funziona, il database è configurato correttamente!

## Troubleshooting

- **Errore 500**: Verifica che le variabili d'ambiente siano configurate correttamente
- **Errore "relation does not exist"**: Esegui lo script SQL per creare le tabelle
- **Errore "permission denied"**: Configura correttamente le policy RLS o usa la service role key




