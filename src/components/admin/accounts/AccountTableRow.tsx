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

  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return null;
    
    let cleaned = phone.replace(/[^\d+]/g, '');
    
    if (cleaned.startsWith('0')) {
      cleaned = '+33' + cleaned.substring(1);
    }
    
    if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    
    return cleaned;
  };

  const handleEdit = () => {
    navigate(`/admin/accounts/${profile.id}`);
  };

  const displayName = () => {
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }
    return profile.email ? profile.email.split('@')[0] : 'Utilisateur';
  };

  return (
    <TableRow key={profile.id}>
      <TableCell className="font-medium">
        <div className="truncate max-w-[180px]">
          {displayName()}
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {profile.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500 shrink-0" />
              <a 
                href={`mailto:${profile.email}`} 
                className="hover:text-violet-500 truncate max-w-[250px]"
              >
                {profile.email}
              </a>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500 shrink-0" />
              <a 
                href={`tel:${formatPhoneNumber(profile.phone)}`} 
                className="hover:text-violet-500"
              >
                {formatPhoneNumber(profile.phone)}
              </a>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {new Date(profile.created_at).toLocaleDateString('fr-FR')}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="text-sm"
        >
          Modifier
        </Button>
      </TableCell>
    </TableRow>
  );
};