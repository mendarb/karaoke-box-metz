import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useSignupHandler } from "@/hooks/auth/useSignupHandler"
import { SignupFormFields } from "./signup/SignupFormFields"
import { useIsMobile } from "@/hooks/use-mobile"
import { GoogleSignupButton } from "./signup/GoogleSignupButton"
import { SignupDivider } from "./signup/SignupDivider"
import { SignupFooter } from "./signup/SignupFooter"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

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
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { success, shouldSwitchToLogin } = await handleSignup(email, password, fullName, phone)
    
    if (shouldSwitchToLogin) {
      onToggleMode()
    } else if (success && onSuccess) {
      onSuccess()
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error("Erreur Google signup:", error)
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

      <SignupDivider />

      <div className="space-y-4">
        <GoogleSignupButton 
          onClick={handleGoogleSignup}
          isLoading={isLoading}
        />
      </div>

      <SignupFooter 
        onToggleMode={onToggleMode}
        isLoading={isLoading}
      />
    </form>
  )
}