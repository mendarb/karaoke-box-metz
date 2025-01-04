import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "./useUserState";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const { isAdmin, isLoading, sessionChecked, user } = useUserState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only check admin status after session is checked and user is loaded
    if (!isLoading && sessionChecked) {
      if (user && !isAdmin) {
        console.log("Access denied: User is logged in but not admin");
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'accès à cette page",
          variant: "destructive",
        });
        navigate("/");
      } else if (!user) {
        console.log("Access denied: No user logged in");
        navigate("/");
      }
    }
  }, [isAdmin, isLoading, sessionChecked, user, navigate, toast]);

  return { isAdmin, isLoading };
};