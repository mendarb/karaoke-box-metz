import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthHandlers } from "@/hooks/useAuthHandlers"
import { useIsMobile } from "@/hooks/use-mobile"

interface LoginFormProps {
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { handleLogin, handleResetPassword, isLoading } = useAuthHandlers()
  const isMobile = useIsMobile()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (showResetPassword) {
      const success = await handleResetPassword(email)
      if (success) {
        setShowResetPassword(false)
      }
    } else {
      const success = await handleLogin(email, password)
      if (success && onSuccess) {
        onSuccess()
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="votre@email.com"
            disabled={isLoading}
            className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
          />
        </div>
        {!showResetPassword && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={6}
              disabled={isLoading}
              className={`h-12 rounded-xl bg-gray-50 border-gray-200 ${isMobile ? 'text-base' : ''}`}
            />
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className={`w-full h-12 text-base rounded-xl bg-kbox-coral hover:bg-kbox-orange-dark
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`} 
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : (showResetPassword ? "Réinitialiser le mot de passe" : "Se connecter")}
      </Button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500 bg-white">ou</span>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
          onClick={() => {/* TODO: Implement Google login */}}
          disabled={isLoading}
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
          Continuer avec Google
        </Button>
      </div>

      <div className="flex flex-col space-y-4 text-center pt-4">
        <Button
          type="button"
          variant="link"
          className="text-sm text-gray-600 hover:text-kbox-coral"
          onClick={() => setShowResetPassword(!showResetPassword)}
          disabled={isLoading}
        >
          {showResetPassword ? "Retour à la connexion" : "Mot de passe oublié ?"}
        </Button>
        <div className="text-sm text-gray-600">
          Pas encore de compte ?{" "}
          <Button
            type="button"
            variant="link"
            className="text-kbox-coral hover:text-kbox-orange-dark font-medium p-0"
            onClick={onToggleMode}
            disabled={isLoading}
          >
            Créer un compte
          </Button>
        </div>
      </div>
    </form>
  )
}