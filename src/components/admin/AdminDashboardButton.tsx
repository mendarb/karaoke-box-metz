import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";

export const AdminDashboardButton = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserState();
  
  if (!isAdmin) return null;

  return (
    <div className="mb-6">
      <Button
        onClick={() => navigate("/admin")}
        variant="outline"
        className="w-full md:w-auto"
      >
        Accéder au tableau de bord
      </Button>
    </div>
  );
};