import { AuthError } from "@supabase/supabase-js";

export const handleSignupError = (error: AuthError | null) => {
  if (!error) return {
    success: false,
    message: "Une erreur inconnue est survenue",
    shouldSwitchToLogin: false
  };

  // Cas spécifique pour un utilisateur déjà existant
  if (error.message?.includes("User already registered") || 
      error.message?.includes("Email already registered")) {
    return {
      success: false,
      message: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
      shouldSwitchToLogin: true
    };
  }

  // Cas de limite de tentatives dépassée
  if (error.message?.includes("Too many requests")) {
    return {
      success: false,
      message: "Veuillez patienter quelques minutes avant de réessayer.",
      shouldSwitchToLogin: false
    };
  }

  // Erreur par défaut
  return {
    success: false,
    message: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
    shouldSwitchToLogin: false
  };
};