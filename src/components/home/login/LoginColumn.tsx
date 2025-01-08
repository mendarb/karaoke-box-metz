import { User } from "@supabase/supabase-js";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";
import { Button } from "@/components/ui/button";

interface LoginColumnProps {
  user: User | null;
  onClose: () => void;
}

export const LoginColumn = ({ user, onClose }: LoginColumnProps) => {
  return (
    <div className="flex flex-col justify-center min-h-screen p-8 bg-white">
      {user ? (
        <div className="max-w-xl mx-auto w-full">
          <BookingFormWrapper />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Réservez votre session karaoké</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
              Pour profiter de notre box karaoké, connectez-vous à votre compte ou créez-en un nouveau en quelques clics.
            </p>
          </div>

          <div className="w-full max-w-lg space-y-3 sm:space-y-4">
            <Button 
              onClick={onClose}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 sm:h-14 text-base"
            >
              Se connecter pour réserver
            </Button>

            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full border-violet-200 hover:bg-violet-50 h-12 sm:h-14 text-base"
            >
              Créer un compte pour réserver
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};