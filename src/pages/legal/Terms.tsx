import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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
          <h1 className="text-3xl font-bold mb-8">Conditions Générales de Vente</h1>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Objet</h2>
                <p className="text-gray-600">
                  Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations entre Karaoke Cabin, ci-après dénommée "le Prestataire", et toute personne physique ou morale effectuant une réservation, ci-après dénommée "le Client".
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Services proposés</h2>
                <p className="text-gray-600">
                  Le Prestataire propose la location de cabines de karaoké privatisées, équipées de matériel audio professionnel et d'un catalogue de chansons. Les réservations sont possibles selon les créneaux horaires disponibles affichés sur le site.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Prix et modalités de paiement</h2>
                <p className="text-gray-600">
                  Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne au moment de la réservation par carte bancaire. La réservation n'est définitive qu'après confirmation du paiement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Annulation et remboursement</h2>
                <p className="text-gray-600">
                  Les conditions d'annulation sont détaillées dans notre politique d'annulation. Toute demande d'annulation doit être effectuée selon les modalités prévues.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Responsabilité</h2>
                <p className="text-gray-600">
                  Le Client s'engage à utiliser les équipements mis à disposition avec soin et dans le respect des consignes de sécurité. Le Prestataire ne pourra être tenu responsable des dommages indirects ou immatériels.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Terms;