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
import { Loader2, Mail, Phone, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  created_at: string;
  email: string | null;
}

export const AccountsTable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useUserState();

  const { data: profiles = [], isLoading: isLoadingProfiles, error } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      try {
        console.log("Début de la requête des profils");
        
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        if (usersError) throw usersError;

        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // Combine user and profile data
        const combinedData = profiles.map(profile => {
          const user = users.find((u: User) => u.id === profile.id);
          return {
            ...profile,
            email: user?.email
          };
        });

        console.log("Profils récupérés:", combinedData);
        return combinedData || [];
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
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Utilisateur</TableHead>
            <TableHead>Contact</TableHead>
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