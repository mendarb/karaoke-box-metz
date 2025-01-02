import { BookingForm } from "@/components/BookingForm";
import { LogIn } from "lucide-react";

interface BookingSectionProps {
  user: any;
  onShowAuth: () => void;
}

const BookingSection = ({ user, onShowAuth }: BookingSectionProps) => {
  return (
    <div className="bg-white h-full p-6 flex flex-col justify-center">
      {user ? (
        <BookingForm />
      ) : (
        <div className="flex flex-col justify-center items-center h-full max-w-md mx-auto space-y-3">
          <div className="rounded-full bg-violet-100 p-3 mb-2">
            <LogIn className="h-6 w-6 text-violet-600" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1.5">
              Connectez-vous pour réserver
            </h2>
            <p className="text-gray-600 text-sm max-w-sm mb-3">
              Pour effectuer une réservation et profiter de notre box karaoké, vous devez être connecté à votre compte.
            </p>
          </div>
          <button 
            onClick={onShowAuth}
            className="bg-violet-600 text-white px-6 py-2 rounded-md hover:bg-violet-700 transition-colors duration-200 flex items-center gap-2 shadow-sm"
          >
            <LogIn className="h-4 w-4" />
            Se connecter / S'inscrire
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingSection;