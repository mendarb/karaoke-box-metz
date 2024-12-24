import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

interface AuthFormProps {
  onClose: () => void;
  isLogin: boolean;
  onToggleMode: () => void;
}

export function AuthForm({ onClose, isLogin, onToggleMode }: AuthFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        })

        if (error) {
          console.error("Auth error:", error)
          if (error.message === "Invalid login credentials") {
            toast({
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Erreur de connexion",
              description: error.message,
              variant: "destructive",
            })
          }
          setIsLoading(false)
          return
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        })
        onClose()
      } else {
        // Validation pour l'inscription
        if (!fullName || !phone) {
          toast({
            title: "Erreur",
            description: "Veuillez remplir tous les champs obligatoires",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              full_name: fullName,
              phone: phone,
            },
            emailRedirectTo: `${window.location.origin}/account`,
          },
        })

        if (error) {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte",
        })
        onClose()
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleAuth} className="space-y-4 pt-4">
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet *</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required={!isLogin}
            placeholder="Jean Dupont"
          />
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="votre@email.com"
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
        />
      </div>
      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone *</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required={!isLogin}
            placeholder="06 12 34 56 78"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={onToggleMode}
      >
        {isLogin
          ? "Pas encore de compte ? S'inscrire"
          : "Déjà un compte ? Se connecter"}
      </Button>
    </form>
  )
}