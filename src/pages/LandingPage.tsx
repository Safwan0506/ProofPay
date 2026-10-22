import { Link } from 'react-router-dom'
import { Shield, BarChart3, Lock, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/80 backdrop-blur-lg border-b border-navy-600/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy-900" />
            </div>
            <h1 className="text-2xl font-bold">ProofPay</h1>
          </div>
          <Link
            to="/auth"
            className="px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg font-semibold hover:shadow-lg hover:shadow-gold-500/20 transition-all"
          >
            Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Contrôlez vos <span className="bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">paiements</span> facilement
          </h2>

          <p className="text-xl text-navy-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            ProofPay centralise vos commandes, gère vos justificatifs et détecte les anomalies automatiquement.
            La solution SaaS pour les commerçants qui veulent contrôler leurs paiements.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/auth"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-gold-500/20 transition-all flex items-center justify-center gap-2"
            >
              Commencer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 border border-gold-500/30 text-gold-400 rounded-xl font-semibold hover:bg-gold-500/5 transition-all"
            >
              En savoir plus
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6 md:gap-10">
            <div>
              <p className="text-3xl font-bold text-gold-400">30+</p>
              <p className="text-navy-400 text-sm">Commandes gérées</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold-400">100%</p>
              <p className="text-navy-400 text-sm">Sécurisé (RLS)</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gold-400">0s</p>
              <p className="text-navy-400 text-sm">Setup requis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-navy-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4">Pourquoi choisir ProofPay?</h3>
            <p className="text-navy-300 text-lg">Tout ce dont vous avez besoin pour contrôler vos paiements</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Gestion complète',
                description: 'Centralisez toutes vos commandes, clients et montants en un seul endroit',
              },
              {
                icon: Shield,
                title: 'Stockage sécurisé',
                description: 'Vos justificatifs (photos, PDF) sont privés et accessibles uniquement par vous',
              },
              {
                icon: Zap,
                title: 'Détection d\'anomalies',
                description: 'Détectez automatiquement les montants différents et les références dupliquées',
              },
              {
                icon: Lock,
                title: 'Authentification',
                description: 'Connexion sécurisée avec Supabase Auth pour protéger vos données',
              },
              {
                icon: CheckCircle2,
                title: 'Tableau de bord',
                description: 'Vue d\'ensemble complète avec statistiques en temps réel',
              },
              {
                icon: ArrowRight,
                title: 'Sans confirmation auto',
                description: 'Vous contrôlez chaque confirmation - aucune automatisation dangereuse',
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="bg-navy-700/50 border border-navy-600/30 rounded-xl p-6 hover:border-gold-500/30 transition-all">
                  <Icon className="w-8 h-8 text-gold-400 mb-4" />
                  <h4 className="text-lg font-bold mb-2">{feature.title}</h4>
                  <p className="text-navy-400 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Technologie moderne</h3>
          <p className="text-navy-300 mb-8">Construit avec les meilleures technologies pour la performance et la sécurité</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Vite', 'PostgreSQL', 'RLS Security', 'Vercel'].map((tech) => (
              <div key={tech} className="bg-navy-800/50 border border-navy-600/30 rounded-lg p-4 text-sm font-medium text-gold-400">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-gold-500/10 to-gold-600/10 border border-gold-500/20 rounded-2xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-4">Prêt à contrôler vos paiements?</h3>
          <p className="text-navy-300 mb-8">Créez votre compte gratuitement et commencez dès maintenant</p>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-gold-500/20 transition-all"
          >
            Commencer gratuitement
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-600/20 py-12 px-6 bg-navy-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">ProofPay</h4>
              <p className="text-navy-400 text-sm">Contrôlez vos paiements avec confiance</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Produit</h5>
              <ul className="space-y-2 text-sm text-navy-400">
                <li><a href="#features" className="hover:text-gold-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Légal</h5>
              <ul className="space-y-2 text-sm text-navy-400">
                <li><a href="#" className="hover:text-gold-400 transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-gold-400 transition-colors">Politique de confidentialité</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <p className="text-sm text-navy-400">info@proofpay.com</p>
            </div>
          </div>

          <div className="border-t border-navy-600/20 pt-8 text-center text-navy-400 text-sm">
            <p>© 2026 ProofPay. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
