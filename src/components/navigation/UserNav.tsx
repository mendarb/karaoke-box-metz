import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useUserState } from "@/hooks/useUserState";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const UserNav = () => {
  const { user, profile } = useUserState();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        // If it's a session not found error, we can ignore it as the user is already logged out
        if (error.message.includes('session_not_found')) {
          console.log('Session already expired, proceeding with local logout');
          navigate('/');
          return;
        }
        throw error;
      }
      navigate('/');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        title: "Erreur lors de la déconnexion",
        description: "Vous avez été déconnecté localement",
        variant: "destructive",
      });
      // Even if there's an error, we should redirect the user
      navigate('/');
    }
  };

  if (!user) return null;

  const initials = profile?.first_name 
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`
    : user.email?.[0].toUpperCase() || '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.first_name || 'Utilisateur'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/account')}>
          Mon compte
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/bookings')}>
          Mes réservations
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};