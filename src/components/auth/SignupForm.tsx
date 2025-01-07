import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSignupHandler } from "@/hooks/auth/useSignupHandler"
import { SignupFormFields } from "./signup/SignupFormFields"
import { useIsMobile } from "@/hooks/use-mobile"

interface SignupFormProps {
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export function SignupForm({ onToggleMode, onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const { handleSignup, isLoading } = useSignupHandler()
  const isMobile = useIsMobile()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { success, shouldSwitchToLogin } = await handleSignup(email, password, fullName, phone)
    
    if (shouldSwitchToLogin) {
      onToggleMode()
    } else if (success && onSuccess) {
      onSuccess()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <SignupFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        fullName={fullName}
        setFullName={setFullName}
        phone={phone}
        setPhone={setPhone}
        isLoading={isLoading}
      />

      <Button 
        type="submit" 
        className={`w-full h-12 text-base rounded-xl bg-kbox-coral hover:bg-kbox-orange-dark
          transition-all duration-200 font-medium ${isMobile ? 'text-lg' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? "Chargement..." : "Créer un compte"}
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
          onClick={() => {/* TODO: Implement Google signup */}}
          disabled={isLoading}
        >
          <img src="/google.svg" alt="Google" className="w-5 h-5 mr-3" />
          Continuer avec Google
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base rounded-xl border-2 hover:bg-gray-50 transition-all duration-200"
          onClick={() => {/* TODO: Implement Apple signup */}}
          disabled={isLoading}
        >
          <img src="/apple.svg" alt="Apple" className="w-5 h-5 mr-3" />
          Continuer avec Apple
        </Button>
      </div>

      <div className="text-center pt-4">
        <div className="text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Button
            type="button"
            variant="link"
            className="text-kbox-coral hover:text-kbox-orange-dark font-medium p-0"
            onClick={onToggleMode}
            disabled={isLoading}
          >
            Se connecter
          </Button>
        </div>
      </div>
    </form>
  )
}