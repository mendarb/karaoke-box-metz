import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { toast } = useToast()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          console.log("Auth error:", error)
          if (error.message.includes("Email not confirmed")) {
            toast({
              title: "Email non confirmé",
              description: "Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.",
              variant: "destructive",
            })
          } else if (error.message === "Invalid login credentials") {
            toast({
              title: "Erreur",
              description: "Email ou mot de passe incorrect",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Erreur",
              description: error.message,
              variant: "destructive",
            })
          }
          return
        }

        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        })
        onClose()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin.includes('localhost') 
              ? 'https://lxkaosgjtqonrnlivzev.supabase.co' 
              : window.location.origin,
          },
        })
        if (error) {
          toast({
            title: "Erreur",
            description: error.message,
            variant: "destructive",
          })
          return
        }
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte. Un email vous a été envoyé.",
        })
        onClose()
      }
    } catch (error) {
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isLogin ? "Connexion" : "Créer un compte"}
          </DialogTitle>
          <DialogDescription>
            {isLogin 
              ? "Connectez-vous à votre compte"
              : "Créez un compte pour réserver votre box"
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
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
            <Label htmlFor="password">Mot de passe</Label>
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Pas encore de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}