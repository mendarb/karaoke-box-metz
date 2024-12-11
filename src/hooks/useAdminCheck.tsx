import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const useAdminCheck = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Admin check - Current session:", session);
        
        if (!session?.user?.email) {
          console.log("No session or email found");
          throw new Error("Session invalide");
        }

        if (session.user.email !== 'mendar.bouchali@gmail.com') {
          console.log("Unauthorized access attempt:", session.user.email);
          throw new Error("Accès non autorisé");
        }

      } catch (error) {
        console.error("Admin access check error:", error);
        toast({
          title: "Accès refusé",
          description: error.message === "Session invalide" 
            ? "Veuillez vous reconnecter" 
            : "Vous n'avez pas les droits d'accès à cette page",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);
};