import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AdminDashboardButton = () => {
  const navigate = useNavigate();
  
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