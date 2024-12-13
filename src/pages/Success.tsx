import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          navigate('/');
          return;
        }

        // Récupérer les données de réservation stockées
        const storedSession = localStorage.getItem('currentBookingSession');
        if (!storedSession) {
          console.error('No booking session found');
          return;
        }

        const { session, bookingData } = JSON.parse(storedSession);

        // Restaurer la session utilisateur
        if (session?.access_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token,
          });

          if (sessionError) {
            console.error('Error restoring session:', sessionError);
            toast({
              title: "Erreur de session",
              description: "Impossible de restaurer votre session.",
              variant: "destructive",
            });
            return;
          }
        }

        // Attendre un peu pour laisser le temps au webhook de traiter la réservation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Récupérer la dernière réservation
        const { data: bookings, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', bookingData.userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching booking:', error);
          // Si pas de réservation trouvée, utiliser les données stockées
          if (error.code === 'PGRST116') {
            setBookingDetails({
              date: bookingData.date,
              time_slot: bookingData.timeSlot,
              duration: bookingData.duration,
              group_size: bookingData.groupSize,
              price: bookingData.price,
              is_test_booking: bookingData.isTestMode,
            });
          } else {
            throw error;
          }
        } else {
          setBookingDetails(bookings);
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la récupération des détails de votre réservation.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [navigate, searchParams, toast]);

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