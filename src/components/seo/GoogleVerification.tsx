import { useEffect } from 'react';
import { getGoogleVerification } from '@/lib/seo';

export const GoogleVerification = () => {
  useEffect(() => {
    const addVerificationMeta = async () => {
      const code = "imJKHLM3uqEPf9HXdTiJMiTg7IKjM_Ea-XY9x8RizOM";
      if (code) {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = code;
        document.head.appendChild(meta);
      }
    };

    addVerificationMeta();
  }, []);

  return null;
};