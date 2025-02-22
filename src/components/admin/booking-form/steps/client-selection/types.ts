export interface ClientResult {
  user_id: string | null;
  user_email: string;
  user_name: string;
  user_phone: string;
  source: 'booking' | 'profile';
}