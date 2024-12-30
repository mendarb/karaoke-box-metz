import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError | null) => {
  if (!error) return null;

  // Cas spécifique pour un utilisateur déjà existant
  if (error.message?.includes("User already registered")) {
    return {
      title: "Compte existant",
      description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
      shouldSwitchToLogin: true
    };
  }

  // Cas de limite de tentatives dépassée
  if (error.message?.includes("Too many requests")) {
    return {
      title: "Trop de tentatives",
      description: "Veuillez patienter quelques minutes avant de réessayer.",
      shouldSwitchToLogin: false
    };
  }

  // Erreur par défaut
  return {
    title: "Erreur",
    description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
    shouldSwitchToLogin: false
  };
};