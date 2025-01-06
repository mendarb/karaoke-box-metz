import { Button } from "@/components/ui/button";
import { useUserState } from "@/hooks/useUserState";
import { SavedBookingsCart } from "@/components/booking/SavedBookingsCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";

interface UserNavProps {
  onShowAuth: () => void;
}

export const UserNav = ({ onShowAuth }: UserNavProps) => {
  const { user, signOut } = useUserState();

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <Button variant="outline" onClick={onShowAuth}>
        Se connecter
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <SavedBookingsCart />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = "/account"}>
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.location.href = "/my-bookings"}>
            Mes réservations
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};