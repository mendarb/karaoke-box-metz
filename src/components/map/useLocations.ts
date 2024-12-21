import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  capacity: number;
}

export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_active', true)
        .is('deleted_at', null);

      if (error) throw error;
      return data as Location[];
    }
  });
};