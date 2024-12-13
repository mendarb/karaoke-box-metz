import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useBookingSession = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedSession = localStorage.getItem('currentBookingSession');
        if (!storedSession) return;

        const { session, bookingData } = JSON.parse(storedSession);
        
        // Vérifier si la session est toujours valide
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          // Si pas de session, essayer de se reconnecter avec la session stockée
          const { error } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });

          if (error) {
            console.error('Error restoring session:', error);
            localStorage.removeItem('currentBookingSession');
          }
        }
      } catch (error) {
        console.error('Error restoring booking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  return { isLoading };
};