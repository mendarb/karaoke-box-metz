import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CheckCircle2 } from "lucide-react";

export const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          navigate('/');
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/');
          return;
        }

        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        setBookingDetails(bookings);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [navigate, searchParams]);

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
              Réservation confirmée !
            </h1>
            <p className="text-gray-600">
              Votre réservation a été enregistrée avec succès.
            </p>
          </div>

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
              </dl>
            </div>
          </div>

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