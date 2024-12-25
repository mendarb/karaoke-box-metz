import { useEffect } from "react";
import { useBookingSuccess } from "@/hooks/useBookingSuccess";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { isLoading } = useBookingSuccess();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {isLoading ? (
          <>
            <LoadingSpinner className="w-12 h-12 text-violet-600 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Confirmation en cours...
            </h2>
            <p className="mt-2 text-gray-600">
              Nous finalisons votre réservation. Merci de patienter quelques instants.
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Réservation confirmée !
            </h1>
            <p className="text-gray-600 mb-6">
              Un email de confirmation contenant tous les détails vous a été envoyé.
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-violet-600 hover:bg-violet-700 w-full"
            >
              Retour à l'accueil
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Success;