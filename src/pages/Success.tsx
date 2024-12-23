import { useEffect, useState } from "react";
import { useBookingSuccess } from "@/hooks/useBookingSuccess";
import { BookingSuccessDetails } from "@/components/booking/BookingSuccessDetails";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { bookingDetails, loading } = useBookingSuccess();
  const navigate = useNavigate();

  useEffect(() => {
    // Ajouter un délai pour laisser le temps au webhook de traiter la réservation
    const timer = setTimeout(() => {
      if (!loading && !bookingDetails) {
        console.log('Aucune réservation trouvée après le délai');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loading, bookingDetails]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement de votre réservation...</p>
        <p className="text-sm text-gray-500 mt-2">Veuillez patienter pendant que nous confirmons votre paiement</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Réservation en cours de traitement
          </h1>
          <p className="text-gray-600 mb-8">
            Votre paiement a été accepté et votre réservation est en cours de traitement. 
            Vous recevrez un email de confirmation dans quelques instants.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Réservation confirmée
          </h1>
          <p className="text-gray-600 mt-2">
            Merci pour votre réservation ! Vous recevrez bientôt un email de confirmation.
          </p>
        </div>

        <BookingSuccessDetails bookingDetails={bookingDetails} />

        <div className="mt-6 text-center">
          <Button
            onClick={() => navigate('/')}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Success;