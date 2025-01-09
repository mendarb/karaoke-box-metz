import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthHandlers } from "@/hooks/useAuthHandlers"

interface LoginFormProps {
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showResetPassword, setShowResetPassword] = useState(false)
  const { handleLogin, handleResetPassword, isLoading } = useAuthHandlers()

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
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
          disabled={isLoading}
        />
      </div>
      {!showResetPassword && (
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe *</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            minLength={6}
            disabled={isLoading}
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Chargement..." : (showResetPassword ? "Réinitialiser le mot de passe" : "Se connecter")}
      </Button>
      <div className="flex flex-col space-y-2">
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={() => setShowResetPassword(!showResetPassword)}
          disabled={isLoading}
        >
          {showResetPassword ? "Retour à la connexion" : "Mot de passe oublié ?"}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          Pas encore de compte ? S'inscrire
        </Button>
      </div>
    </form>
  )
}