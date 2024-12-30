export type SignupErrorType = 
  | "USER_EXISTS"
  | "RATE_LIMIT"
  | "GENERIC_ERROR";

export interface SignupErrorConfig {
  title: string;
  description: string;
  variant: "destructive" | "default";
  shouldSwitchToLogin: boolean;
}

export const SIGNUP_ERROR_MESSAGES: Record<SignupErrorType, SignupErrorConfig> = {
  USER_EXISTS: {
    title: "Compte existant",
    description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
    variant: "default",
    shouldSwitchToLogin: true
  },
  RATE_LIMIT: {
    title: "Trop de tentatives",
    description: "Trop d'emails ont été envoyés à cette adresse. Veuillez patienter quelques minutes.",
    variant: "destructive",
    shouldSwitchToLogin: false
  },
  GENERIC_ERROR: {
    title: "Erreur",
    description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
    variant: "destructive",
    shouldSwitchToLogin: false
  }
};