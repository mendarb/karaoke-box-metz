export const validateSignupData = (
  email: string,
  password: string,
  fullName: string,
  phone: string
): { isValid: boolean; error?: string } => {
  if (!email || !password || !fullName || !phone) {
    return {
      isValid: false,
      error: "Veuillez remplir tous les champs obligatoires"
    };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: "Le mot de passe doit contenir au moins 6 caractères"
    };
  }

  return { isValid: true };
};