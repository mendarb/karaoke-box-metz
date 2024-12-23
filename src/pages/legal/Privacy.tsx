import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
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
          <h1 className="text-3xl font-bold mb-8">Politique de Confidentialité</h1>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Collecte des données personnelles</h2>
                <p className="text-gray-600">
                  Nous collectons les données suivantes :
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Informations de réservation</li>
                  <li>Données de paiement (traitées de manière sécurisée)</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Utilisation des données</h2>
                <p className="text-gray-600">
                  Vos données sont utilisées pour :
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-600">
                  <li>Gérer vos réservations</li>
                  <li>Vous contacter concernant votre réservation</li>
                  <li>Améliorer nos services</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Protection de vos données</h2>
                <p className="text-gray-600">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données personnelles.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Privacy;