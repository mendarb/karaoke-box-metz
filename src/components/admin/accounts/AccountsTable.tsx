import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUserState } from "@/hooks/useUserState";
import { AccountTableContent } from "./AccountTableContent";

interface Profile {
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
        
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) throw profilesError;

        // Get user emails from the Edge Function
        const { data: emailsResponse, error: emailsError } = await supabase.functions.invoke(
          'get-user-emails'
        );

        if (emailsError) {
          console.error('Error fetching emails:', emailsError);
          throw emailsError;
        }

        const userEmails = emailsResponse.userEmails;

        // Format profiles with email from the Edge Function
        const formattedProfiles = (profiles || []).map((profile: any) => ({
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone,
          email: userEmails[profile.id],
          created_at: profile.created_at
        }));

        console.log("Profils récupérés:", formattedProfiles);
        return formattedProfiles || [];
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
        <AccountTableContent profiles={profiles} />
      </Table>
    </div>
  );
};