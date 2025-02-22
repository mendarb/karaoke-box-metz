import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { ClientResult } from "./types";

export const useClientSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<ClientResult[]>([]);
  const { toast } = useToast();

  const searchClients = async (searchTerm: string) => {
    if (!searchTerm?.trim()) {
      setClients([]);
      return;
    }

    setIsLoading(true);
    try {
      const [bookingsResponse, profilesResponse] = await Promise.all([
        supabase
          .from('bookings')
          .select('user_name, user_phone, user_email, user_id')
          .or(`user_email.ilike.%${searchTerm}%,user_name.ilike.%${searchTerm}%,user_phone.ilike.%${searchTerm}%`)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('profiles')
          .select('id, email, first_name, last_name, phone')
          .or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
      ]);

      if (bookingsResponse.error) throw bookingsResponse.error;
      if (profilesResponse.error) throw profilesResponse.error;

      const bookingClients: ClientResult[] = (bookingsResponse.data || []).map(booking => ({
        user_id: booking.user_id,
        user_email: booking.user_email,
        user_name: booking.user_name,
        user_phone: booking.user_phone,
        source: 'booking'
      }));

      const profileClients: ClientResult[] = (profilesResponse.data || []).map(profile => ({
        user_id: profile.id,
        user_email: profile.email || '',
        user_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
        user_phone: profile.phone || '',
        source: 'profile'
      }));

      const allClients = [...bookingClients, ...profileClients];
      
      const uniqueClients = allClients.reduce((acc: ClientResult[], current) => {
        const exists = acc.find(client => 
          client.user_email === current.user_email || 
          (client.user_phone && client.user_phone === current.user_phone)
        );
        if (!exists && (current.user_email || current.user_phone)) {
          acc.push(current);
        }
        return acc;
      }, []);

      setClients(uniqueClients);

      if (uniqueClients.length === 0) {
        toast({
          title: "Aucun résultat",
          description: "Aucun client trouvé avec ces critères",
        });
      }
    } catch (error) {
      console.error('Error searching clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de rechercher les clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients,
    isLoading,
    searchClients
  };
};