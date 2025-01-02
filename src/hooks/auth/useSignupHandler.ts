import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { checkExistingUser, handleExistingUser } from "@/services/userVerificationService";
import { signupUser } from "@/services/signupService";

export const useSignupHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => {
    setIsLoading(true);
    
    try {
      const existingUser = await checkExistingUser(email);
      
      if (existingUser) {
        return handleExistingUser(email);
      }

      const result = await signupUser({
        email,
        password,
        fullName,
        phone,
      });

      if (result.success) {
        toast({
          title: "Inscription réussie",
          description: result.message,
        });
      } else {
        toast({
          title: "Erreur",
          description: result.message,
          variant: "destructive",
        });
      }

      return result;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription.",
        variant: "destructive",
      });
      return { success: false, message: "Erreur lors de l'inscription" };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSignup, isLoading };
};