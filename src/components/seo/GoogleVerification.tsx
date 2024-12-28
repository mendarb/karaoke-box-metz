import { useEffect, useState } from 'react';
import { getGoogleVerification } from '@/lib/seo';

export const GoogleVerification = () => {
  const [verificationCode, setVerificationCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerificationCode = async () => {
      const code = await getGoogleVerification();
      if (code) {
        setVerificationCode(code);
      }
    };

    fetchVerificationCode();
  }, []);

  if (!verificationCode) return null;

  return (
    <meta name="google-site-verification" content={verificationCode} />
  );
};