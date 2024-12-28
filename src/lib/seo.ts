import { supabase } from './supabase';

export const getGoogleVerification = async () => {
  try {
    const { data: { code } } = await supabase.functions.invoke('get-google-verification');
    if (!code) {
      console.error('Google verification code not found');
      return null;
    }
    return code;
  } catch (error) {
    console.error('Error fetching Google verification code:', error);
    return null;
  }
};