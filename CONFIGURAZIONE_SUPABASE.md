# Configurazione Supabase per Barinello

## Informazioni dal Database

Dalla connection string fornita:
- **Progetto ID**: `vbnujdctxkckvahlbdgw`
- **URL Progetto**: `https://vbnujdctxkckvahlbdgw.supabase.co`
- **Host Database**: `aws-1-eu-central-1.pooler.supabase.com`

## Passi per Configurare

### 1. Recupera le Chiavi API

1. Vai su [https://app.supabase.com](https://app.supabase.com)
2. Accedi al tuo account
3. Seleziona il progetto con ID `vbnujdctxkckvahlbdgw`
4. Vai su **Settings** (Impostazioni) → **API**
5. Troverai:
   - **Project URL**: `https://vbnujdctxkckvahlbdgw.supabase.co` (dovrebbe essere questo)
   - **anon public** key: Copia questa chiave
   - **service_role** key: Scorri in basso e copia questa chiave (⚠️ Tienila segreta!)

### 2. Crea le Tabelle nel Database

1. Nel dashboard Supabase, vai su **SQL Editor**
2. Clicca su **New Query**
3. Copia e incolla il contenuto del file `supabase-schema.sql`
4. Clicca su **Run** per eseguire lo script

Questo creerà:
- Tabella `admin_data` per menu, conoscenza AI e contenuti
- Tabella `bookings` per le prenotazioni
- Indici per migliorare le performance
- Policy RLS (Row Level Security) per la sicurezza

### 3. Configura le Variabili d'Ambiente su Vercel

1. Vai su [https://vercel.com](https://vercel.com)
2. Seleziona il progetto **barinello**
3. Vai su **Settings** → **Environment Variables**
4. Aggiungi queste tre variabili:

   ```
   NEXT_PUBLIC_SUPABASE_URL
   Valore: https://vbnujdctxkckvahlbdgw.supabase.co
   
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   Valore: [la chiave anon che hai copiato]
   
   SUPABASE_SERVICE_ROLE_KEY
   Valore: [la chiave service_role che hai copiato]
   ```

5. Assicurati che siano selezionate per **Production**, **Preview** e **Development**
6. Clicca su **Save**

### 4. Rifai il Deploy

Dopo aver aggiunto le variabili d'ambiente, devi rifare il deploy:

```bash
vercel --prod
```

Oppure:
- Vai su Vercel Dashboard
- Clicca su **Deployments**
- Trova l'ultimo deploy e clicca sui tre puntini
- Seleziona **Redeploy**

### 5. Verifica che Funzioni

1. Vai sul sito in produzione
2. Prova a fare una prenotazione dalla pagina Booking
3. Se funziona, vai al pannello admin e verifica che la prenotazione appaia

## Troubleshooting

### Errore "relation does not exist"
- **Causa**: Le tabelle non sono state create
- **Soluzione**: Esegui lo script SQL nel SQL Editor di Supabase

### Errore "permission denied"
- **Causa**: Le policy RLS non permettono l'operazione
- **Soluzione**: Assicurati di aver aggiunto `SUPABASE_SERVICE_ROLE_KEY` nelle variabili d'ambiente

### Errore 500 quando salvi nel pannello admin
- **Causa**: Le variabili d'ambiente non sono configurate correttamente
- **Soluzione**: Verifica che tutte e tre le variabili siano presenti su Vercel e rifai il deploy

## Note Importanti

- ⚠️ **NON condividere mai la `SUPABASE_SERVICE_ROLE_KEY` pubblicamente**
- La `service_role` key bypassa tutte le policy RLS, quindi è potente ma pericolosa se esposta
- L'`anon` key è sicura da esporre pubblicamente (è nel codice frontend)
- Dopo aver aggiunto le variabili d'ambiente, devi sempre rifare il deploy per applicarle




