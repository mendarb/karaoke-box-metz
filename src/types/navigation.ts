import { User } from "@supabase/supabase-js";

export interface MobileNavProps {
  user: User | null;
  isAdmin: boolean;
  onSignOut: () => void;
  onShowAuth: () => void;
}