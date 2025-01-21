import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { RoleSelector } from "./RoleSelector";

interface AccountTableRowProps {
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    created_at: string;
    email: string | null;
  };
}

export const AccountTableRow = ({ profile }: AccountTableRowProps) => {
  const { data: userRole } = useQuery({
    queryKey: ['user-role', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.role || 'user';
    }
  });

  return (
    <TableRow>
      <TableCell>
        <div>
          <p className="font-medium">
            {profile.first_name} {profile.last_name}
          </p>
          <p className="text-sm text-gray-500">
            Inscrit le {new Date(profile.created_at).toLocaleDateString()}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p>{profile.email}</p>
          {profile.phone && (
            <p className="text-sm text-gray-500">{profile.phone}</p>
          )}
        </div>
      </TableCell>
      <TableCell>
        {new Date(profile.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <RoleSelector 
            userId={profile.id} 
            initialRole={userRole}
          />
          <Link to={`/admin/accounts/${profile.id}`}>
            <Button variant="ghost" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};