import { useState } from 'react'
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
        toast.success('Connexion réussie')
      } else {
        await signUp(email, password)
        toast.success('Compte créé ! Vérifiez votre email pour confirmer.')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-800 to-navy-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-400 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-8 shadow-lg shadow-gold-500/20">
            <Shield className="w-8 h-8 text-navy-900" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ProofPay</h1>
          <p className="text-navy-300 text-lg leading-relaxed">
            Centralisez vos commandes, contrôlez vos justificatifs de paiement et
            repérez les incohérences en un coup d'œil.
          </p>
          <div className="mt-8 space-y-4">
            {['Gestion des commandes', 'Contrôle des justificatifs', 'Détection d\'anomalies'].map((feat) => (
              <div key={feat} className="flex items-center gap-3 text-navy-200">
                <div className="w-2 h-2 rounded-full bg-gold-500" />
                <span className="text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-navy-900" />
            </div>
            <h1 className="text-xl font-bold text-white">ProofPay</h1>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Bon retour !' : 'Créer un compte'}
          </h2>
          <p className="text-navy-400 mb-8">
            {isLogin
              ? 'Connectez-vous pour accéder à votre espace.'
              : 'Inscrivez-vous pour commencer à gérer vos paiements.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full pl-11 pr-4 py-3 bg-navy-800 border border-navy-600/50 rounded-xl text-white text-sm placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-navy-800 border border-navy-600/50 rounded-xl text-white text-sm placeholder:text-navy-500 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-navy-400 text-sm mt-6">
            {isLogin ? "Pas encore de compte ?" : 'Déjà inscrit ?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold-400 font-medium hover:underline"
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
