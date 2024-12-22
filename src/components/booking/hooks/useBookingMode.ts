import { useState, useEffect } from 'react';

export const useBookingMode = () => {
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Vérifier si nous sommes en mode test
    const checkTestMode = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const testMode = urlParams.get('test') === 'true';
      setIsTestMode(testMode);
      
      console.log('🔧 Booking mode initialized:', {
        isTestMode: testMode
      });
    };

    checkTestMode();
  }, []);

  return { isTestMode };
};