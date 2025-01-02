import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "./useUserState";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const { isAdmin, isLoading } = useUserState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Vous n'avez pas les droits d'accès à cette page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate, toast]);

  return { isAdmin, isLoading };
};