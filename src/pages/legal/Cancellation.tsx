import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Cancellation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold mb-8">Politique d'Annulation</h1>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Délais d'annulation</h2>
                <p className="text-gray-600">
                  Nos conditions d'annulation sont les suivantes :
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Plus de 48h avant la séance : remboursement intégral</li>
                  <li>Entre 24h et 48h : remboursement à 50%</li>
                  <li>Moins de 24h : aucun remboursement</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Procédure d'annulation</h2>
                <p className="text-gray-600">
                  Pour annuler votre réservation :
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Connectez-vous à votre compte</li>
                  <li>Accédez à "Mes Réservations"</li>
                  <li>Sélectionnez la réservation à annuler</li>
                  <li>Suivez la procédure d'annulation</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Cas exceptionnels</h2>
                <p className="text-gray-600">
                  En cas de force majeure (maladie avec certificat médical, etc.), contactez-nous pour étudier votre situation.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;