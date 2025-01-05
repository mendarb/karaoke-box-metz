import { User } from '@supabase/supabase-js';
import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
}

interface AccountTableRowProps {
  profile: UserProfile;
}

export const AccountTableRow = ({ profile }: AccountTableRowProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/admin/accounts/${profile.id}`);
  };

  return (
    <TableRow key={profile.id}>
      <TableCell>
        <div className="space-y-1">
          {profile.first_name || profile.last_name ? (
            <span className="font-medium">
              {`${profile.first_name || ''} ${profile.last_name || ''}`}
            </span>
          ) : (
            <span className="text-gray-500">Non renseigné</span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-gray-500" />
            <a href={`mailto:${profile.email}`} className="hover:text-violet-500">
              {profile.email}
            </a>
          </div>
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${profile.phone}`} className="hover:text-violet-500">
                {profile.phone}
              </a>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {new Date(profile.created_at).toLocaleDateString('fr-FR')}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
        >
          Modifier
        </Button>
      </TableCell>
    </TableRow>
  );
};