import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuthHandlers } from "@/hooks/useAuthHandlers"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { LoginFormFields } from "./login/LoginFormFields"
import { GoogleLoginButton } from "./login/GoogleLoginButton"
import { LoginFooter } from "./login/LoginFooter"

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
  const { toast } = useToast()

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

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error("Erreur Google login:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la connexion avec Google",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur inattendue:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 px-4 py-6">
      <LoginFormFields
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        isLoading={isLoading}
        showResetPassword={showResetPassword}
      />

      <Button 
        type="submit" 
        className={`w-full h-12 text-base rounded-xl bg-kbox-coral hover:bg-kbox-orange-dark
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`} 
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : (showResetPassword ? "Réinitialiser le mot de passe" : "Se connecter")}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 text-gray-500 bg-white">ou</span>
        </div>
      </div>

      <div className="space-y-4">
        <GoogleLoginButton onClick={handleGoogleLogin} isLoading={isLoading} />
      </div>

      <LoginFooter
        showResetPassword={showResetPassword}
        setShowResetPassword={setShowResetPassword}
        onToggleMode={onToggleMode}
        isLoading={isLoading}
      />
    </form>
  )
}