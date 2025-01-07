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
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
          className={`h-11 ${isMobile ? 'text-base' : ''}`}
        />
      </div>
      {!showResetPassword && (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Mot de passe *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
            disabled={isLoading}
            className={`h-11 ${isMobile ? 'text-base' : ''}`}
          />
        </div>
      )}
      <Button 
        type="submit" 
        className={`w-full h-11 text-base ${isMobile ? 'mt-6' : ''}`} 
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : (showResetPassword ? "Réinitialiser le mot de passe" : "Se connecter")}
      </Button>
      <div className="flex flex-col space-y-2 pt-2">
        <Button
          type="button"
          variant="link"
          className="text-sm"
          onClick={() => setShowResetPassword(!showResetPassword)}
          disabled={isLoading}
        >
          {showResetPassword ? "Retour à la connexion" : "Mot de passe oublié ?"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="text-sm"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Pas encore de compte ? S'inscrire
        </Button>
      </div>
    </form>
  )
}