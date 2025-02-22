import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserState } from './useUserState';

export const useBookingSession = () => {
  const [sessionId] = useState(() => crypto.randomUUID());
  const { user } = useUserState();

  const trackStep = async (step: number, stepName: string, completed: boolean = false, bookingId?: string) => {
    try {
      const { error } = await supabase
        .from('booking_steps_tracking')
        .insert({
          session_id: sessionId,
          user_id: user?.id,
          user_email: user?.email,
          step,
          step_name: stepName,
          completed,
          booking_id: bookingId
        });

      if (error) {
        console.error('Error tracking step:', error);
      }
    } catch (error) {
      console.error('Error tracking step:', error);
    }
  };

  return {
    sessionId,
    trackStep
  };
};