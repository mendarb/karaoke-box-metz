import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/useAuthSession";
import { CalendarDays } from "lucide-react";

export const UserNav = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthSession();

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated && (
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate("/bookings")}
        >
          <CalendarDays className="w-4 h-4" />
          Mes réservations
        </Button>
      )}
    </div>
  );
};