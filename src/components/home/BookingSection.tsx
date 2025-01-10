import { BookingForm } from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/navigation/Logo";
import { useNavigate } from "react-router-dom";

interface BookingSectionProps {
  user: any;
  onShowAuth: () => void;
}

const BookingSection = ({ user, onShowAuth }: BookingSectionProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col">
        {user ? (
          <BookingForm />
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4 p-4">
            <h2 className="text-xl font-semibold text-center">
              Connectez-vous pour réserver
            </h2>
            <Button onClick={onShowAuth} className="w-full max-w-sm">
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSection;