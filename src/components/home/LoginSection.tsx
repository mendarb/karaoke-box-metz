import { User } from "@supabase/supabase-js";
import { LoginColumn } from "./login/LoginColumn";
import { InfoColumn } from "./login/InfoColumn";

interface LoginSectionProps {
  user: User | null;
  onShowAuth: () => void;
}

export const LoginSection = ({ user, onShowAuth }: LoginSectionProps) => {
  return (
    <div className="min-h-[90vh] grid md:grid-cols-2">
      <LoginColumn user={user} onClose={onShowAuth} />
      <InfoColumn />
    </div>
  );
};