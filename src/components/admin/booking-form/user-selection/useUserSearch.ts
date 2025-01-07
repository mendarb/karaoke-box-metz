import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
  id?: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
}

export const useUserSearch = (form: UseFormReturn<any>) => {
  const [isSearching, setIsSearching] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const { toast } = useToast();

  const searchUser = async (searchTerm: string) => {
    if (!searchTerm) {
      setSearchResults([]);
      setUserFound(false);
      return;
    }

    setIsSearching(true);
    try {
      // Recherche dans les profils
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone')
        .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`);

      if (profilesError) throw profilesError;

      // Recherche dans les réservations existantes
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('user_id, user_name, user_phone, user_email')
        .or(`user_email.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%,user_phone.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Obtenir les emails des utilisateurs via la fonction Edge
      const { data: emailsResponse, error: emailsError } = await supabase.functions.invoke(
        'get-user-emails'
      );

      if (emailsError) {
        console.error('Error fetching emails:', emailsError);
        throw emailsError;
      }

      const userEmails = emailsResponse.userEmails;

      // Transformer les résultats des profils
      const profileResults: SearchResult[] = (profilesData || []).map(profile => ({
        id: profile.id,
        user_email: profile.email || '',
        user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        user_phone: profile.phone || '',
      }));

      // Transformer les résultats des réservations
      const bookingResults: SearchResult[] = (bookingsData || []).map(booking => ({
        id: booking.user_id,
        user_email: booking.user_email,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
      }));

      // Ajouter les utilisateurs qui ont un email mais pas de profil
      const emailOnlyResults: SearchResult[] = Object.entries(userEmails)
        .filter(([userId, email]) => {
          const emailLower = email.toLowerCase();
          const searchTermLower = searchTerm.toLowerCase();
          return emailLower.includes(searchTermLower) &&
                 !profileResults.some(p => p.user_email.toLowerCase() === emailLower) &&
                 !bookingResults.some(b => b.user_email.toLowerCase() === emailLower);
        })
        .map(([userId, email]) => ({
          id: userId,
          user_email: email,
          user_name: email.split('@')[0], // Utiliser la partie locale de l'email comme nom par défaut
          user_phone: '',
        }));

      // Combiner et dédupliquer les résultats
      const allResults = [...profileResults, ...bookingResults, ...emailOnlyResults];
      
      const uniqueResults = allResults.reduce((acc: SearchResult[], current) => {
        const exists = acc.find(item => 
          item.user_email.toLowerCase() === current.user_email.toLowerCase() ||
          (item.user_phone && current.user_phone && item.user_phone === current.user_phone)
        );
        if (!exists) {
          acc.push(current);
        }
        return acc;
      }, []);

      console.log('Résultats de recherche:', uniqueResults);
      setSearchResults(uniqueResults);
      setUserFound(uniqueResults.length > 0);

      if (uniqueResults.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun utilisateur trouvé avec ces critères",
        });
      }
    } catch (error) {
      console.error('Error searching user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher l'utilisateur",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return {
    isSearching,
    userFound,
    searchResults,
    searchUser,
  };
};