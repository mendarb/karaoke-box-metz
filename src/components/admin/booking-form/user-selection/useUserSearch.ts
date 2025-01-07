import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface SearchResult {
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
      const [bookingsResponse, profilesResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('user_name, user_phone, user_email')
          .or(`user_email.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%,user_phone.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('profiles')
          .select('email, first_name, last_name, phone')
          .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      ]);

      if (bookingsResponse.error) throw bookingsResponse.error;
      if (profilesResponse.error) throw profilesResponse.error;

      const bookingUsers = (bookingsResponse.data || []).map(booking => ({
        user_email: booking.user_email,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
      }));

      const profileUsers = (profilesResponse.data || []).map(profile => ({
        user_email: profile.email || '',
        user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        user_phone: profile.phone || '',
      }));

      const allUsers = [...bookingUsers, ...profileUsers];
      
      const uniqueUsers = allUsers.reduce((acc: SearchResult[], current) => {
        const exists = acc.find(user => 
          user.user_email === current.user_email || 
          (user.user_phone && user.user_phone === current.user_phone)
        );
        if (!exists && (current.user_email || current.user_phone)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setSearchResults(uniqueUsers);
      setUserFound(uniqueUsers.length > 0);

      if (uniqueUsers.length === 0) {
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