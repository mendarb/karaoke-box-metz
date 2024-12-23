import { useEffect, useState } from "react";
import { useBookingSuccess } from "@/hooks/useBookingSuccess";
import { BookingSuccessDetails } from "@/components/booking/BookingSuccessDetails";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const { bookingDetails, loading } = useBookingSuccess();
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (bookingDetails && bookingDetails.payment_status === 'unpaid') {
      setShowPaymentWarning(true);
    }
  }, [bookingDetails]);

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

  const getPaymentStatus = () => {
    switch (bookingDetails.payment_status) {
      case 'paid':
        return {
          icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
          title: "Réservation confirmée",
          message: "Merci pour votre réservation ! Vous recevrez bientôt un email de confirmation."
        };
      case 'unpaid':
        return {
          icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
          title: "Paiement en attente",
          message: "Votre réservation a été enregistrée mais le paiement n'a pas encore été confirmé. Vous recevrez un email dès que le paiement sera validé."
        };
      case 'failed':
        return {
          icon: <XCircle className="h-12 w-12 text-red-500" />,
          title: "Échec du paiement",
          message: "Le paiement n'a pas pu être effectué. Veuillez réessayer ou contacter le support."
        };
      default:
        return {
          icon: <AlertTriangle className="h-12 w-12 text-yellow-500" />,
          title: "Statut en cours de vérification",
          message: "Nous vérifions actuellement le statut de votre réservation. Vous recevrez un email de confirmation sous peu."
        };
    }
  };

  const status = getPaymentStatus();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {status.icon}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {status.title}
          </h1>
          <p className="text-gray-600 mt-2">
            {status.message}
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