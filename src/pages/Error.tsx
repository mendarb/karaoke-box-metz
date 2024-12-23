import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const Error = () => {
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("Une erreur est survenue");

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      switch (error) {
        case "payment_failed":
          setErrorMessage("Le paiement a échoué. Veuillez réessayer.");
          break;
        case "session_expired":
          setErrorMessage("La session de paiement a expiré. Veuillez réessayer.");
          break;
        default:
          setErrorMessage("Une erreur est survenue lors de la réservation.");
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Erreur de réservation
          </h1>
          <p className="text-gray-600">
            {errorMessage}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-violet-600 hover:bg-violet-700"
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Error;