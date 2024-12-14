import { useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useBookingSuccess } from "@/hooks/useBookingSuccess";
import { BookingSuccessDetails } from "@/components/booking/BookingSuccessDetails";

export const Success = () => {
  const navigate = useNavigate();
  const { bookingDetails, loading } = useBookingSuccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune réservation trouvée</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-violet-600 hover:text-violet-700"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-violet-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {bookingDetails.is_test_booking ? '[TEST] ' : ''}
              Réservation confirmée !
            </h1>
            <p className="text-gray-600">
              Votre réservation a été enregistrée avec succès.
            </p>
          </div>

          <BookingSuccessDetails bookingDetails={bookingDetails} />

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};