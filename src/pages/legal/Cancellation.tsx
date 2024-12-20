import { ScrollArea } from "@/components/ui/scroll-area";

const Cancellation = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Politique d'Annulation</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Délais d'annulation</h2>
            <p>
              Nos conditions d'annulation sont les suivantes :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Plus de 48h avant la séance : remboursement intégral</li>
              <li>Entre 24h et 48h : remboursement à 50%</li>
              <li>Moins de 24h : aucun remboursement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Procédure d'annulation</h2>
            <p>
              Pour annuler votre réservation :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Connectez-vous à votre compte</li>
              <li>Accédez à "Mes Réservations"</li>
              <li>Sélectionnez la réservation à annuler</li>
              <li>Suivez la procédure d'annulation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Remboursements</h2>
            <p>
              Les remboursements sont effectués sur la carte bancaire utilisée lors de la réservation sous 5-10 jours ouvrés.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Cas exceptionnels</h2>
            <p>
              En cas de force majeure (maladie avec certificat médical, etc.), contactez-nous pour étudier votre situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Modifications</h2>
            <p>
              Les modifications de réservation sont possibles jusqu'à 48h avant la séance, sous réserve de disponibilité.
            </p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Cancellation;