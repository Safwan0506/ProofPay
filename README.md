# ProofPay — Gestion des commandes et contrôle des justificatifs de paiement

Une application SaaS pour centraliser les commandes, gérer les justificatifs de paiement et détecter les incohérences.

## ✨ Fonctionnalités

### Authentification
- Inscription et connexion sécurisées via Supabase Auth
- Sessions persistantes

### Gestion des commandes
- Créer, consulter, rechercher et filtrer les commandes
- Champs : code, client, montant, devise, moyen de paiement, statut
- Statuts : En attente, À vérifier, Confirmé

### Gestion des justificatifs
- Upload d'images (JPG, PNG, WEBP) et PDF (max 5 Mo)
- Association à une commande
- Saisie de référence de transaction et montant affiché
- Stockage privé et sécurisé

### Contrôles automatiques
- Détection de montant différent du montant attendu
- Détection de référence de transaction dupliquée
- Détection de référence manquante
- Alertes avec explication

### Tableau de bord
- Statistiques en temps réel
- Vue d'ensemble des commandes par statut
- Montant total des commandes confirmées
- Compteur de dossiers en anomalie

### Interface
- Design premium : bleu marine, blanc, touches dorées
- Menu latéral sur ordinateur
- Navigation mobile responsive
- Tableaux, formulaires, filtres
- États de chargement, succès, erreur

## 🛠 Stack technologique

| Catégorie | Technologies |
|-----------|---|
| Frontend | React 19 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| UI | Lucide Icons, React Hot Toast |
| Routing | React Router v6 |
| Deployment | Vercel |

## 📋 Prérequis

- Node.js 18+
- npm (ou yarn/pnpm)
- Compte Supabase

## 🚀 Installation

### 1. Cloner le repository
```bash
git clone <repository-url>
cd proofpay
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Supabase

#### Créer un projet Supabase
1. Aller sur https://supabase.com
2. Créer un nouveau projet
3. Copier l'URL et la clé d'API publique (anon key)

#### Créer la base de données
1. Aller dans l'éditeur SQL
2. Copier et exécuter le contenu de `supabase/migrations/001_init.sql`
3. Exécuter `supabase/storage-policy.sql`

#### Créer le bucket de stockage
1. Aller dans Storage
2. Créer un nouveau bucket nommé `receipts`
3. Configurer comme **privé** (non public)
4. Appliquer les politiques RLS depuis le SQL

### 4. Configurer les variables d'environnement
```bash
cp .env.example .env.local
```

Remplir `.env.local` :
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

## 📦 Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Builder pour la production
npm run preview  # Prévisualiser la build
npm run lint     # Lancer ESLint
```

## 🔐 Sécurité

### Row Level Security (RLS)
- Chaque utilisateur ne voit que ses propres données
- Les politiques RLS sont appliquées sur les tables `orders` et `receipts`
- Le bucket `receipts` est privé

### Validation des fichiers
- Types acceptés : JPG, PNG, WEBP, PDF
- Taille maximale : 5 Mo
- Validation côté client et serveur

### Variables d'environnement
- **Ne jamais** commiter `.env.local`
- Ne jamais exposer la clé secrète `service_role`
- Seule la clé publique (anon key) est utilisée

## 📡 Déploiement sur Vercel

### 1. Pousser le code sur GitHub
```bash
git add .
git commit -m "ProofPay MVP"
git push origin main
```

### 2. Importer sur Vercel
1. Aller sur https://vercel.com/new
2. Importer le repository GitHub
3. Configurer les variables d'environnement :
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_PUBLISHABLE_KEY
   ```
4. Cliquer sur "Deploy"

### 3. Vérifier le déploiement
- L'URL de production sera disponible
- Tester l'authentification et les fonctionnalités

## 📊 Architecture des données

### Table `orders`
| Colonne | Type | Description |
|---------|------|---|
| id | UUID | Clé primaire |
| user_id | UUID | Référence utilisateur |
| order_code | VARCHAR | Code unique par utilisateur |
| customer_name | VARCHAR | Nom du client |
| customer_contact | VARCHAR | Email ou téléphone |
| amount | DECIMAL | Montant attendu |
| currency | VARCHAR | Devise (XAF, USD, EUR) |
| payment_method | VARCHAR | Mobile Money, Chèque, etc. |
| status | VARCHAR | en_attente, a_verifier, confirme |
| created_at | TIMESTAMP | Date de création |
| updated_at | TIMESTAMP | Dernière modification |

### Table `receipts`
| Colonne | Type | Description |
|---------|------|---|
| id | UUID | Clé primaire |
| user_id | UUID | Référence utilisateur |
| order_id | UUID | Référence commande |
| file_path | VARCHAR | Chemin dans Supabase Storage |
| file_name | VARCHAR | Nom du fichier |
| reference | VARCHAR | Référence de transaction |
| amount_seen | DECIMAL | Montant affiché sur le justificatif |
| review_status | VARCHAR | en_attente, anomalie, valide |
| note | TEXT | Notes de vérification |
| created_at | TIMESTAMP | Date d'upload |

## ⚠️ Principes importants

### Pas de confirmation automatique
ProofPay **détecte** les incohérences mais ne **confirme jamais** automatiquement un paiement. Chaque confirmation nécessite une vérification humaine.

### Anomalies détectées
- Montant du justificatif ≠ montant attendu
- Référence de transaction dupliquée
- Référence manquante
- Justificatif incomplet

### Limitation du MVP
- Pas d'OCR (extraction automatique des données)
- Pas d'intégration Mobile Money
- Pas d'historique détaillé des actions
- Pas de gestion d'équipe

## 📝 Checklist de sécurité

- ✅ RLS activée sur toutes les tables
- ✅ Variables d'environnement sécurisées
- ✅ Isolation des utilisateurs testée
- ✅ Bucket de stockage privé
- ✅ Types de fichiers validés
- ✅ Taille des fichiers validée
- ✅ Pas de confirmation automatique

## 🤝 Support

Pour des questions ou des bugs, veuillez ouvrir une issue dans le repository.

## 📄 Licence

MIT
