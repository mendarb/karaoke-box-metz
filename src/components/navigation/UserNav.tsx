import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

interface UserNavProps {
  onSignOut: () => Promise<void>;
  isAdmin: boolean;
}

export const UserNav = ({ onSignOut, isAdmin }: UserNavProps) => {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="relative w-8 h-8 rounded-full border-gray-300 hover:bg-gray-100 p-0"
        >
          <User className="h-4 w-4 text-gray-700" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem onClick={() => navigate('/my-bookings')}>
          Mes réservations
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/account')}>
          Mon compte
        </DropdownMenuItem>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              Administration
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={onSignOut} 
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};