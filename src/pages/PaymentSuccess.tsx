import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        navigate('/');
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("Session not found");
        }

        // Verify payment status with Stripe webhook
        const { error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) {
          console.error('Payment verification error:', error);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier votre paiement. Notre équipe a été notifiée.",
            variant: "destructive",
          });
          navigate('/payment-error');
          return;
        }

        navigate('/success');
      } catch (error) {
        console.error('Error in payment verification:', error);
        navigate('/payment-error');
      }
    };

    verifyPayment();
  }, [sessionId, navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Vérification du paiement...
          </h1>
          <p className="text-gray-600 mt-2">
            Veuillez patienter pendant que nous confirmons votre paiement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;