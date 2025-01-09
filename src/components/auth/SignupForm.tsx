import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSignupHandler } from "@/hooks/auth/useSignupHandler"
import { SignupFormFields } from "./signup/SignupFormFields"

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
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
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
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Chargement..." : "S'inscrire"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={onToggleMode}
        disabled={isLoading}
      >
        Déjà un compte ? Se connecter
      </Button>
    </form>
  )
}