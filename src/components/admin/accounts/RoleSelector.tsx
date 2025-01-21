import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface RoleSelectorProps {
  userId: string;
  initialRole?: string;
  onRoleChange?: () => void;
}

export const RoleSelector = ({ userId, initialRole = 'user', onRoleChange }: RoleSelectorProps) => {
  const [role, setRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateRole = async (newRole: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;

      setRole(newRole);
      toast({
        title: "Rôle mis à jour",
        description: `Le rôle a été changé en ${newRole}`,
      });
      
      if (onRoleChange) {
        onRoleChange();
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-[100px]">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span className="capitalize">{role}</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateRole('user')}>
          <span className="capitalize">User</span>
          {role === 'user' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateRole('admin')}>
          <span className="capitalize">Admin</span>
          {role === 'admin' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};