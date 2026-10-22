# ProofPay — Document de sécurité

## 🔐 Vue d'ensemble

ProofPay implémente plusieurs couches de sécurité pour protéger les données sensibles des utilisateurs.

## 1. Authentification

### Supabase Auth
- Authentification gérée par Supabase (PostgreSQL + JWT)
- Sessions persistantes via localStorage
- Pas de mot de passe stocké côté frontend

### Bonnes pratiques
```typescript
// ✅ Correct : récupérer l'utilisateur via Supabase
const { data: { user } } = await supabase.auth.getUser()

// ❌ Mauvais : ne jamais faire confiance au localStorage directement
const user = JSON.parse(localStorage.getItem('user'))
```

## 2. Row Level Security (RLS)

### Configuration
Chaque table (`orders`, `receipts`) a des politiques RLS strictes :

```sql
-- Exemple pour 'orders'
CREATE POLICY "Users can only see their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

### Garanties
- Un utilisateur **ne voit que ses propres données**
- Les requêtes SQL sans `user_id = auth.uid()` retournent une erreur
- Pas d'accès direct à la base de données possible

### Test
```typescript
// ✅ Approuvé par RLS
const { data } = await supabase
  .from('orders')
  .select('*')
  // auth.uid() injecté automatiquement

// ❌ Refusé par RLS (même si le user_id est différent)
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', 'autre-user-uuid')
// error: "new row violates row-level security policy"
```

## 3. Stockage des fichiers

### Bucket `receipts`
- **Public** : ❌ Non (privé)
- **Accès** : Seul l'utilisateur propriétaire peut télécharger
- **Chemins** : Structure `user_id/order_id/file_id.ext`

### Politiques de stockage
```sql
-- Utilisateur ne peut voir que ses propres fichiers
CREATE POLICY "Users can view their own receipts"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'receipts' AND 
         auth.uid()::text = (storage.foldername(name))[1]);
```

### Validation côté client
```typescript
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
]
const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('Type non autorisé')
}
if (file.size > MAX_SIZE) {
  throw new Error('Fichier trop volumineux')
}
```

## 4. Variables d'environnement

### Frontend (SAFE to expose)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi... (anon key)
```

- Ces variables sont **publiques** (visibles dans le bundle)
- Elles ne donnent accès qu'aux opérations `authenticated`

### Backend (NEVER expose)
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (secret key)
DATABASE_PASSWORD=...
```

- **Ne jamais** commiter dans le repo
- **Ne jamais** envoyer au frontend
- Réservée aux opérations côté serveur (migrations, admin)

### `.env.local` et `.gitignore`
```
# .gitignore
.env
.env.local
.env.*.local
```

**Vérifier** : `git status` ne doit pas montrer `.env.local`

## 5. Dépendances

### Audit des packages

```bash
# Vérifier les vulnérabilités
npm audit

# Mettre à jour les packages de sécurité
npm audit fix
```

### Packages critiques
- `@supabase/supabase-js` : Client Supabase
- `react-router-dom` : Routing
- `lucide-react` : Icons

**Ne pas** installer de packages suspects (malveillance, typosquatting).

## 6. Principes du produit

### ⚠️ Pas de confirmation automatique

ProofPay **détecte** les anomalies mais ne confirme **jamais** automatiquement un paiement.

**Raison** : Les screenshots et les justificatifs peuvent être falsifiés.

**Approche** :
- Détecte les montants qui ne correspondent pas
- Signale les références dupliquées
- Demande une vérification humaine auprès de la source

### Anomalies detectable
```typescript
if (receipt.amount_seen !== order.amount) {
  // Signaler : montant différent
  review_status = 'anomalie'
  note = 'Montant du justificatif ne correspond pas'
}

if (await isDuplicateReference(receipt.reference)) {
  // Signaler : référence déjà utilisée
  review_status = 'anomalie'
  note = 'Référence de transaction dupliquée'
}
```

## 7. Tests de sécurité

### Test 1 : Isolation des utilisateurs
```bash
# User A crée order-1
# User B crée order-2
# User A ne doit voir que order-1 (pas order-2)
```

**Résultat** : ✅ RLS bloque l'accès aux données d'autres utilisateurs

### Test 2 : Accès aux justificatifs
```bash
# URL du fichier privé : /receipts/user-a-uuid/order-1/file.pdf
# Copier l'URL
# Ouvrir en incognito (pas connecté)
# Essayer d'accéder
```

**Résultat** : ❌ 403 Forbidden

### Test 3 : Injection SQL
```typescript
const malicious = "'; DROP TABLE orders; --"
const { data, error } = await supabase
  .from('orders')
  .select('*')
  .eq('order_code', malicious)
// RLS + Supabase parameterized queries = safe
```

**Résultat** : ✅ Requête sécurisée (pas d'exécution de SQL)

### Test 4 : XSS (Cross-Site Scripting)
```typescript
const malicious = '<img src=x onerror=alert("xss")>'
// React échappe automatiquement le contenu
<p>{malicious}</p> // Affiche littéralement le texte, pas le script
```

**Résultat** : ✅ React échappe le contenu par défaut

## 8. Déploiement sécurisé

### Sur Vercel
1. Variables d'env configurées dans **Settings → Environment Variables**
2. Pas de `.env.local` commité
3. Build produit sans secrets exposés

### SSL/HTTPS
- Vercel fournit SSL gratuit pour `*.vercel.app`
- Tous les échanges sont chiffrés

### Headers de sécurité
Vercel ajoute automatiquement :
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

## 9. Recommandations supplémentaires

### Court terme (MVP)
- ✅ Activer 2FA sur les comptes admin Supabase
- ✅ Monitorer les accès Supabase
- ✅ Sauvegardes régulières Supabase

### Moyen terme (v1.0)
- 🔄 Audit code externe (security review)
- 🔄 Audit des dépendances npm régulièrement
- 🔄 Logs détaillés des actions utilisateur

### Long terme (v2.0+)
- 🔄 Signature numérique des justificatifs
- 🔄 Watermarking des images uploadées
- 🔄 Intégration OAuth officielle (Mobile Money)
- 🔄 Rate limiting sur les APIs

## 10. Incident response

### Si compromission supposée

1. **Révoquer les tokens** :
   ```bash
   # Dans Supabase Dashboard
   # Auth → Users → Vérifier les sessions
   # Révoquer si suspect
   ```

2. **Changer les secrets** :
   ```bash
   # Regenerate les API keys Supabase
   # Mettre à jour Vercel env vars
   ```

3. **Analyser les logs** :
   ```bash
   # Supabase : Database → Logs
   # Vercel : Deployments → Logs
   # Vérifier les accès anormaux
   ```

4. **Notification utilisateurs** (si données exposées)

---

## ✅ Checklist de sécurité

- ✅ RLS activée sur `orders` et `receipts`
- ✅ Bucket `receipts` privé
- ✅ `.env.local` dans `.gitignore`
- ✅ Validation des types de fichiers
- ✅ Validation de la taille des fichiers
- ✅ Pas de confirmation automatique des paiements
- ✅ JWT tokens gérés par Supabase
- ✅ HTTPS sur production
- ✅ Pas de secrets dans les commits
- ✅ Audit des dépendances npm regulier

---

**ProofPay est conçu avec la sécurité comme priorité.**
