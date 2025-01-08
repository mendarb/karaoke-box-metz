import { User } from "@supabase/supabase-js";
import { BookingFormWrapper } from "@/components/booking/BookingFormWrapper";

interface LoginColumnProps {
  user: User | null;
  onClose: () => void;
}

export const LoginColumn = ({ user, onClose }: LoginColumnProps) => {
  return (
    <div className="flex flex-col justify-center p-4 sm:p-8 overflow-y-auto max-h-screen">
      {user ? (
        <div className="max-w-xl mx-auto w-full">
          <BookingFormWrapper />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-6 p-4 sm:p-8 text-center max-w-2xl mx-auto">
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Réservez votre session karaoké
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
              Pour profiter de notre box karaoké, connectez-vous à votre compte ou créez-en un nouveau en quelques clics.
            </p>
          </div>

          <div className="w-full max-w-lg space-y-3 sm:space-y-4">
            <button 
              onClick={onClose}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg py-3 px-4 text-base transition-colors"
            >
              Se connecter pour réserver
            </button>

            <button 
              onClick={onClose}
              className="w-full border border-violet-200 hover:bg-violet-50 rounded-lg py-3 px-4 text-base transition-colors"
            >
              Créer un compte pour réserver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};