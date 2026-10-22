# ProofPay — Guide complet d'installation et déploiement

## 🎯 Objectif

Mettre en place ProofPay sur ton environnement local, puis déployer sur Vercel et Supabase.

## ⏱ Durée estimée

- **Configuration locale** : 15 min
- **Configuration Supabase** : 20 min  
- **Déploiement Vercel** : 10 min
- **Tests** : 15 min
- **Total** : ~60 minutes

## 📋 Checklist pré-installation

- ✅ Node.js 18+ installé (`node --version`)
- ✅ npm installé (`npm --version`)
- ✅ Compte GitHub avec SSH ou HTTPS configurée
- ✅ Compte Supabase créé
- ✅ Compte Vercel créé

---

## 1️⃣ Configuration locale

### Étape 1.1 : Cloner ou initialiser le projet

Si le projet est sur GitHub :
```bash
git clone https://github.com/your-username/proofpay.git
cd proofpay
```

Si le projet est en local :
```bash
cd /c/Users/Administrateur/proofpay
```

### Étape 1.2 : Installer les dépendances

```bash
npm install
```

**Attendu** : Pas d'erreur, tous les packages installés.

### Étape 1.3 : Tester localement

```bash
npm run dev
```

**Attendu** : 
- Message : `Local: http://localhost:5173/`
- Ouvrir le navigateur → page blanche → redirection `/auth`

---

## 2️⃣ Configuration Supabase

### Étape 2.1 : Créer un projet Supabase

1. Aller sur https://supabase.com/dashboard
2. Cliquer sur **"New Project"**
3. Remplir :
   - **Name** : `proofpay` (ou autre)
   - **Database Password** : Générer fort
   - **Region** : Choisir proche de vous
4. Cliquer **"Create new project"**
5. **Attendre 2-3 minutes** que le projet soit créé

### Étape 2.2 : Récupérer les credentials

1. Aller dans **"Settings"** → **"API"**
2. Copier et noter :
   - **Project URL** (ex: `https://xyzabc.supabase.co`)
   - **Anon public key** (ex: `eyJhbGciOi...`)
3. **Ne jamais** partager la `service_role` key

### Étape 2.3 : Créer les tables et politiques RLS

1. Aller dans **"SQL Editor"**
2. Cliquer **"+ New Query"**
3. Copier le contenu de `supabase/migrations/001_init.sql`
4. Coller dans l'éditeur
5. Cliquer **"Run"**

**Attendu** : Pas d'erreur rouge, les tables sont créées

### Étape 2.4 : Créer le bucket de stockage

1. Aller dans **"Storage"** → **"Buckets"**
2. Cliquer **"New Bucket"**
3. Remplir :
   - **Name** : `receipts`
   - **Private bucket** : ✅ Cocher
4. Cliquer **"Create bucket"**

### Étape 2.5 : Appliquer les politiques de stockage

1. Aller dans **"Storage"** → **"Policies"** (ou **"Security"**)
2. Copier le contenu de `supabase/storage-policy.sql`
3. Exécuter dans l'SQL Editor

**Alternativement**, les activer manuellement :
1. Aller dans **"Storage"** → **"receipts"** → **"Policies"**
2. Créer 3 politiques pour **authenticated users** :
   - SELECT : `auth.uid()::text = (storage.foldername(name))[1]`
   - INSERT : `auth.uid()::text = (storage.foldername(name))[1]`
   - DELETE : `auth.uid()::text = (storage.foldername(name))[1]`

---

## 3️⃣ Configuration locale des variables d'environnement

### Étape 3.1 : Créer `.env.local`

```bash
cp .env.example .env.local
```

### Étape 3.2 : Remplir les variables

Éditer `.env.local` :

```env
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
```

Remplacer avec tes données Supabase (étape 2.2).

### Étape 3.3 : Tester localement

```bash
npm run dev
```

1. Ouvrir http://localhost:5173
2. Cliquer **"S'inscrire"**
3. Email et mot de passe (min 6 caractères)
4. **Vérifier** l'email Supabase (vérification confirmée ou manuelle)
5. Se connecter

**Attendu** :
- ✅ Accès au dashboard
- ✅ Voir les statistiques (tout à 0)
- ✅ Pouvoir créer une commande
- ✅ Pouvoir uploder un justificatif

---

## 4️⃣ Push sur GitHub

### Étape 4.1 : Initialiser Git (si needed)

```bash
cd /c/Users/Administrateur/proofpay
git init
git remote add origin https://github.com/your-username/proofpay.git
```

### Étape 4.2 : Commit

```bash
git add .
git commit -m "ProofPay MVP - gestion des commandes et justificatifs de paiement

- Authentification Supabase
- Gestion complète des commandes
- Upload et gestion des justificatifs
- Détection d'anomalies
- Tableau de bord en temps réel
- Interface responsive premium

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Étape 4.3 : Push

```bash
git push -u origin main
```

---

## 5️⃣ Déploiement sur Vercel

### Étape 5.1 : Importer le projet

1. Aller sur https://vercel.com/new
2. Cliquer **"Import Git Repository"**
3. Coller l'URL GitHub : `https://github.com/your-username/proofpay.git`
4. Cliquer **"Import"**

### Étape 5.2 : Configurer l'environnement

1. Dans **"Environment Variables"**, ajouter :
   ```
   VITE_SUPABASE_URL = https://xyzabc.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY = eyJhbGciOi...
   ```
2. Cliquer **"Deploy"**

**Attendu** : Build en cours → ✅ Success

### Étape 5.3 : Accéder au site en production

1. Copier l'URL fournie (ex: `https://proofpay.vercel.app`)
2. Ouvrir dans le navigateur
3. Tester le flux complet (signup → login → créer commande → upload justificatif)

---

## 6️⃣ Tests de sécurité

### Test 6.1 : Isolation des utilisateurs

1. **Utilisateur A** :
   - Signup : `user-a@test.com` / `password123`
   - Créer commande : "CMD-001" / 100 000 XAF
2. **Utilisateur B** (incognito/autre navigateur) :
   - Signup : `user-b@test.com` / `password123`
   - **Vérifier** qu'on voit 0 commandes (pas celle de A)
   - Créer commande : "CMD-002" / 50 000 XAF
3. **Utilisateur A** (retour) :
   - **Vérifier** qu'on voit que "CMD-001" (pas "CMD-002")

**Verdict** : ✅ OK si chaque user ne voit que ses données

### Test 6.2 : Justificatifs privés

1. Créer commande et uploader un justificatif
2. Copier l'URL du fichier
3. Ouvrir l'URL en incognito sans login
4. **Attendu** : Erreur 403 ou accès refusé

### Test 6.3 : Types de fichiers

1. Essayer d'uploader un `.exe` ou `.sh`
2. **Attendu** : Erreur "Type de fichier non autorisé"

### Test 6.4 : Taille de fichier

1. Créer un fichier > 5 Mo
2. Essayer d'uploader
3. **Attendu** : Erreur "Fichier trop volumineux"

---

## 7️⃣ Déploiement continu

### Étape 7.1 : Modifier le code et redéployer

```bash
# Sur ta machine locale
git add .
git commit -m "Amélioration : [description]"
git push origin main
```

**Vercel redéploiera automatiquement** en 1-2 minutes.

### Étape 7.2 : Monitorer les déploiements

1. Aller sur https://vercel.com/dashboard
2. Cliquer sur le projet `proofpay`
3. Voir l'historique des déploiements

---

## ⚠️ Troubleshooting

### Erreur : "Missing VITE_SUPABASE_URL"
**Solution** : Vérifier que `.env.local` existe et est rempli

### Erreur : "RLS policy not found"
**Solution** : Vérifier que `001_init.sql` a été exécuté dans Supabase

### Erreur : "Bucket not found"
**Solution** : Créer le bucket `receipts` dans Storage

### Signup OK mais pas d'email de confirmation
**Solution** : Dans Supabase, vérifier que l'email provider est configuré, ou activer "Skip Email confirmation" en développement

### Build échoue sur Vercel
**Solution** : Vérifier les logs Vercel → souvent un missing package

---

## ✅ Checklist finale

- ✅ Local dev server fonctionne
- ✅ Supabase configuré avec tables et RLS
- ✅ Bucket `receipts` créé et privé
- ✅ `.env.local` rempli
- ✅ Tests locaux passent (auth, CRUD, upload)
- ✅ Code poussé sur GitHub
- ✅ Déploiement Vercel réussi
- ✅ Tests de sécurité validés
- ✅ Site en production accessible

---

## 📞 Support

**Problème persistant ?**

1. Vérifier les logs :
   - Local : `npm run dev` output
   - Supabase : Database → Logs
   - Vercel : Deployments → Build logs

2. Consulter les fichiers :
   - README.md (vue d'ensemble)
   - SETUP_GUIDE.md (ce fichier)
   - supabase/migrations/001_init.sql (schéma)

3. Questions ?
   - Vérifier les URLs (pas de typos)
   - Vérifier les permissions Supabase
   - Vérifier `.env.local` n'est pas dans `.gitignore`

---

**🚀 Prêt à lancer ProofPay!**
