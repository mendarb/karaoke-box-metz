import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProfileData } from "@/hooks/useProfileData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserState } from "@/hooks/useUserState";

interface UserNavProps {
  onSignOut: () => Promise<void>;
  isAdmin: boolean;
}

export const UserNav = ({ onSignOut, isAdmin }: UserNavProps) => {
  const navigate = useNavigate();
  const { user } = useUserState();
  const { initialData } = useProfileData(user);

  const getInitials = () => {
    if (initialData?.first_name && initialData?.last_name) {
      return `${initialData.first_name[0]}${initialData.last_name[0]}`.toUpperCase();
    }
    return initialData?.first_name?.[0]?.toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => navigate("/account/my-bookings")}>
          Mes réservations
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/account")}>
          Mon compte
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem onClick={() => navigate("/admin")}>
            Administration
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onSignOut}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};