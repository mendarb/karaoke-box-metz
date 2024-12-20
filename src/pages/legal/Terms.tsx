import { ScrollArea } from "@/components/ui/scroll-area";

const Terms = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Conditions Générales de Vente</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations entre Karaoke Cabin, ci-après dénommée "le Prestataire", et toute personne physique ou morale effectuant une réservation, ci-après dénommée "le Client".
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Services proposés</h2>
            <p>
              Le Prestataire propose la location de cabines de karaoké privatisées, équipées de matériel audio professionnel et d'un catalogue de chansons. Les réservations sont possibles selon les créneaux horaires disponibles affichés sur le site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Prix et modalités de paiement</h2>
            <p>
              Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne au moment de la réservation par carte bancaire. La réservation n'est définitive qu'après confirmation du paiement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Annulation et remboursement</h2>
            <p>
              Les conditions d'annulation sont détaillées dans notre politique d'annulation. Toute demande d'annulation doit être effectuée selon les modalités prévues.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Responsabilité</h2>
            <p>
              Le Client s'engage à utiliser les équipements mis à disposition avec soin et dans le respect des consignes de sécurité. Le Prestataire ne pourra être tenu responsable des dommages indirects ou immatériels.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Protection des données personnelles</h2>
            <p>
              Le traitement des données personnelles est effectué conformément à notre politique de confidentialité et au Règlement Général sur la Protection des Données (RGPD).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Droit applicable et litiges</h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
            </p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Terms;