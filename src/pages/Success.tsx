import { useEffect, useState } from "react";
import { useBookingSuccess } from "@/hooks/useBookingSuccess";
import { BookingSuccessDetails } from "@/components/booking/BookingSuccessDetails";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const { bookingDetails, loading } = useBookingSuccess();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">Chargement de votre réservation...</p>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Réservation non trouvée
          </h1>
          <p className="text-gray-600 mb-8">
            Nous n'avons pas pu trouver les détails de votre réservation.
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

  // Si nous avons un session_id de Stripe, le paiement est confirmé
  const isPaid = sessionId || bookingDetails.payment_status === 'paid';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {isPaid ? (
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            ) : (
              <AlertTriangle className="h-12 w-12 text-yellow-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isPaid ? "Réservation confirmée" : "Paiement en attente"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isPaid 
              ? "Merci pour votre réservation ! Vous recevrez bientôt un email de confirmation."
              : "Votre réservation a été enregistrée mais le paiement n'a pas encore été confirmé. Vous recevrez un email dès que le paiement sera validé."
            }
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