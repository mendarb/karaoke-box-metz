import { BookingDetails } from "@/hooks/useBookingSuccess";
import { CheckCircle2 } from "lucide-react";

interface BookingSuccessDetailsProps {
  bookingDetails: BookingDetails;
}

export const BookingSuccessDetails = ({ bookingDetails }: BookingSuccessDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="border-t border-gray-200 pt-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Détails de la réservation
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-600">Date</dt>
            <dd className="text-sm font-medium text-gray-900">
              {new Date(bookingDetails.date).toLocaleDateString('fr-FR')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Heure</dt>
            <dd className="text-sm font-medium text-gray-900">
              {bookingDetails.time_slot}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Durée</dt>
            <dd className="text-sm font-medium text-gray-900">
              {bookingDetails.duration}h
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Nombre de personnes</dt>
            <dd className="text-sm font-medium text-gray-900">
              {bookingDetails.group_size}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Prix</dt>
            <dd className="text-sm font-medium text-gray-900">
              {bookingDetails.price}€
            </dd>
          </div>
          {bookingDetails.is_test_booking && (
            <div className="col-span-2">
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  Ceci est une réservation de test. Aucun paiement n'a été effectué.
                </p>
              </div>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};