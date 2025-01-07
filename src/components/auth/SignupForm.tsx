import { useState } from "react"
import { useSignupHandler } from "@/hooks/auth/useSignupHandler"
import { SignupFormFields } from "./signup/SignupFormFields"
import { SignupDivider } from "./signup/SignupDivider"
import { SignupFooter } from "./signup/SignupFooter"
import { SignupButtons } from "./signup/SignupButtons"
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

      <SignupButtons 
        isLoading={isLoading}
        handleGoogleSignup={handleGoogleSignup}
      />

      <SignupDivider />

      <SignupFooter 
        onToggleMode={onToggleMode}
        isLoading={isLoading}
      />
    </form>
  )
}