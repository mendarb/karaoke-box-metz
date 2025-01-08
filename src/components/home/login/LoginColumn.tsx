import { Card } from "@/components/ui/card";
import { AuthForm } from "@/components/auth/AuthForm";
import { BookingForm } from "@/components/BookingForm";
import { User } from "@supabase/supabase-js";

interface LoginColumnProps {
  user: User | null;
  onClose: () => void;
}

export const LoginColumn = ({ user, onClose }: LoginColumnProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-none">
            {!user ? (
              <AuthForm 
                onClose={onClose} 
                isLogin={true}
                onToggleMode={() => {}}
              />
            ) : (
              <BookingForm />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};