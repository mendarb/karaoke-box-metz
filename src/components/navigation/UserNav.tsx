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
  onSignOut: () => Promise<void>;
  isAdmin: boolean;
}

export const UserNav = ({ onSignOut, isAdmin }: UserNavProps) => {
  const { user } = useUserState();

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
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/admin"}>
                Administration
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut}>
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};