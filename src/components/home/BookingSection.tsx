import { BookingForm } from "@/components/BookingForm";

interface BookingSectionProps {
  user: any;
  onShowAuth: () => void;
}

export const BookingSection = ({ user, onShowAuth }: BookingSectionProps) => {
  return (
    <div className="bg-white h-full p-8 flex flex-col justify-center">
      {user ? (
        <BookingForm />
      ) : (
        <div className="flex flex-col justify-center h-full">
          <h2 className="text-2xl text-kbox-coral mb-4">
            Connectez-vous pour réserver
          </h2>
          <p className="text-gray-600 mb-6">
            Pour effectuer une réservation, vous devez être connecté à votre compte.
          </p>
          <button 
            onClick={onShowAuth}
            className="bg-[#7E3AED] text-white px-6 py-3 hover:bg-[#6D28D9] transition-colors w-full md:w-auto"
          >
            Se connecter / S'inscrire
          </button>
        </div>
      )}
    </div>
  );
};