import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useAuthHandlers() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Vérifier d'abord si l'email est confirmé
      const { data: { users }, error: getUserError } = await supabase.auth.admin.listUsers()
      const existingUser = users?.find(u => u.email === email.trim())

      if (existingUser && !existingUser.email_confirmed_at) {
        toast({
          title: "Email non confirmé",
          description: "Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.",
          variant: "destructive",
        })
        return false
      }

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
        return false
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      })
      return true
    } catch (error: any) {
      console.error("Auth error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (email: string, password: string, fullName: string, phone: string) => {
    setIsLoading(true)
    try {
      if (!fullName || !phone) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires",
          variant: "destructive",
        })
        return { success: false, shouldSwitchToLogin: false }
      }

      // Vérifier si l'utilisateur existe déjà
      const { data: { users } } = await supabase.auth.admin.listUsers()
      const existingUser = users?.find(u => u.email === email.trim())

      if (existingUser) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
        })
        return { success: false, shouldSwitchToLogin: true }
      }

      // Inscription avec les métadonnées utilisateur
      const { error, data } = await supabase.auth.signUp({
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
        console.error("Signup error:", error)
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        })
        return { success: false, shouldSwitchToLogin: false }
      }

      toast({
        title: "Inscription réussie",
        description: "Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.",
      })
      return { success: true, shouldSwitchToLogin: false }
    } catch (error: any) {
      console.error("Auth error:", error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      })
      return { success: false, shouldSwitchToLogin: false }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    handleLogin,
    handleSignup,
    isLoading
  }
}