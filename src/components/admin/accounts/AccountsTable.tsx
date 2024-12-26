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
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
}

export const AccountsTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useUserState();

  const { data: profiles = [], isLoading: isLoadingProfiles, error } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      try {
        console.log("Fetching profiles as admin:", isAdmin);
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching profiles:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les profils utilisateurs",
            variant: "destructive",
          });
          throw error;
        }

        console.log("Fetched profiles:", profiles);
        return profiles || [];
      } catch (err) {
        console.error('Query error:', err);
        return [];
      }
    },
    enabled: isAdmin,
  });

  if (error) {
    console.error('Query error:', error);
    return (
      <div className="p-4 text-red-500">
        Une erreur est survenue lors du chargement des profils.
      </div>
    );
  }

  if (isLoadingProfiles) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div>
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
          {profiles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                Aucun compte utilisateur trouvé
              </TableCell>
            </TableRow>
          ) : (
            profiles.map((profile: UserProfile) => (
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
                      console.log("Modifier le profil:", profile.id);
                    }}
                  >
                    Modifier
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};