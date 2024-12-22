import { useEffect, useState } from "react";

export const useBookingMode = () => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Explicitly check for 'test' value
    const mode = import.meta.env.VITE_STRIPE_MODE;
    setIsTestMode(mode === 'test');
    console.log('🔧 Booking mode initialized:', {
      envValue: mode,
      isTestMode: mode === 'test'
    });
  }, []);

  return { isTestMode };
};