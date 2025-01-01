import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface SignupFormProps {
  onToggleMode: () => void;
  onSuccess?: () => void;
}

export function SignupForm({ onToggleMode, onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Vérification de l'email:", email.toLowerCase())
      
      // Vérifier si l'email existe déjà dans profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email.toLowerCase())
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Erreur lors de la vérification du profil:", profileError)
        throw new Error("Erreur lors de la vérification de l'email")
      }

      if (existingProfile) {
        console.log("Email déjà utilisé:", email)
        toast({
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        })
        onToggleMode()
        return
      }

      // Procéder à l'inscription si l'email n'existe pas
      console.log("Création du compte...")
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      })

      if (signUpError) {
        console.error("Erreur lors de l'inscription:", signUpError)
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Email déjà utilisé",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
            variant: "destructive",
          })
          onToggleMode()
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'inscription.",
            variant: "destructive",
          })
        }
        return
      }

      toast({
        title: "Inscription réussie",
        description: "Un email de confirmation vous a été envoyé.",
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Nom complet *</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Jean Dupont"
          disabled={isLoading}
        />
      </div>
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
      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone *</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          placeholder="06 12 34 56 78"
          disabled={isLoading}
        />
      </div>
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