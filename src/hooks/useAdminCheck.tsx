import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserState } from "./useUserState";
import { useToast } from "@/components/ui/use-toast";

export const useAdminCheck = () => {
  const { isAdmin, isLoading, sessionChecked, user } = useUserState();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && sessionChecked) {
      if (user && !isAdmin) {
        navigate("/");
      } else if (!user) {
        navigate("/");
      }
    }
  }, [isAdmin, isLoading, sessionChecked, user, navigate]);

  return { isAdmin, isLoading };
};