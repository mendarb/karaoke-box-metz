import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
}

export const AccountsTable = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { data: profiles = [], isLoading: isLoadingProfiles } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching profiles:', error);
          throw error;
        }

        return profiles || [];
      } catch (err) {
        console.error('Query error:', err);
        throw err;
      }
    },
  });

  if (isLoadingProfiles) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Date d'inscription</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id}>
              <TableCell>
                {profile.first_name || profile.last_name ? (
                  `${profile.first_name || ''} ${profile.last_name || ''}`
                ) : (
                  <span className="text-gray-500">Non renseigné</span>
                )}
              </TableCell>
              <TableCell>
                {profile.phone || <span className="text-gray-500">Non renseigné</span>}
              </TableCell>
              <TableCell>
                {new Date(profile.created_at).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // TODO: Implémenter la modification du profil
                  }}
                >
                  Modifier
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};