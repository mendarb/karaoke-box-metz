import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

export const Error = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const error = searchParams.get("error");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    const updateFailedBooking = async () => {
      if (paymentIntentId) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update({
            status: 'cancelled',
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('payment_intent_id', paymentIntentId);

        if (updateError) {
          console.error('Error updating failed booking:', updateError);
        }
      }
    };

    if (paymentIntentId) {
      updateFailedBooking();
    }

    if (error) {
      toast({
        title: "Erreur de paiement",
        description: error.replace(/_/g, ' '),
        variant: "destructive",
      });
    }
  }, [error, paymentIntentId, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Une erreur est survenue
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error?.replace(/_/g, ' ') || "Votre paiement n'a pas pu être traité"}
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            Réessayer la réservation
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="w-full"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};