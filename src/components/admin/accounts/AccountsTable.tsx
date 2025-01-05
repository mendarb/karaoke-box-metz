import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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
          .select('*')
          .order('created_at', { ascending: false });

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
          email: userEmails[profile.id] || profile.email,
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

  const handleExportCSV = async () => {
    try {
      setIsLoading(true);
      const csvContent = [
        ['Email', 'Prénom', 'Nom', 'Téléphone', 'Date d\'inscription'].join(','),
        ...profiles.map(profile => [
          profile.email || '',
          profile.first_name || '',
          profile.last_name || '',
          profile.phone || '',
          new Date(profile.created_at).toLocaleDateString('fr-FR')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `kbox-users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé avec succès",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'export",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 text-red-600">
        Une erreur est survenue lors du chargement des profils.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Liste des utilisateurs</h2>
        <Button 
          onClick={handleExportCSV} 
          disabled={isLoading || isLoadingProfiles}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exporter en CSV
        </Button>
      </div>

      {isLoadingProfiles ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            <p className="text-sm text-muted-foreground">Chargement des profils...</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Utilisateur</TableHead>
                <TableHead className="w-[300px]">Contact</TableHead>
                <TableHead className="w-[150px]">Date d'inscription</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <AccountTableContent profiles={profiles} />
          </Table>
        </div>
      )}
    </div>
  );
};