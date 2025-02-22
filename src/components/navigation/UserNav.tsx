import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useProfileData } from "@/hooks/useProfileData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserState } from "@/hooks/useUserState";
import { LogOut, User, Calendar, Settings } from "lucide-react";

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
        <Button variant="ghost" className="relative h-10 w-10 rounded-full border-2 border-muted hover:bg-accent hover:text-accent-foreground">
          <Avatar className="h-9 w-9 transition-transform">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 space-y-1">
        <DropdownMenuItem 
          onClick={() => navigate("/account/my-bookings")}
          className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent transition-colors"
        >
          <Calendar className="h-4 w-4" />
          <span>Mes réservations</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => navigate("/account")}
          className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Mon compte</span>
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem 
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Administration</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={onSignOut}
          className="flex items-center gap-2 p-3 cursor-pointer hover:bg-accent transition-colors text-red-500 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};