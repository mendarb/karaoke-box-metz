import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserState } from "@/hooks/useUserState";

export const AdminDashboardButton = () => {
  const navigate = useNavigate();
  const { isAdmin } = useUserState();
  
  if (!isAdmin) return null;

  return (
    <div className="mb-6 flex justify-end">
      <Button
        onClick={() => navigate("/admin")}
        variant="outline"
        className="mb-4"
      >
        Accéder au tableau de bord
      </Button>
    </div>
  );
};