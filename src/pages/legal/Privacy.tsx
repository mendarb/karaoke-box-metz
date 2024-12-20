import { ScrollArea } from "@/components/ui/scroll-area";

const Privacy = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Politique de Confidentialité</h1>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Collecte des données personnelles</h2>
            <p>
              Nous collectons les données suivantes :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Informations de réservation</li>
              <li>Données de paiement (traitées de manière sécurisée par notre prestataire de paiement)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Utilisation des données</h2>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Gérer vos réservations</li>
              <li>Vous contacter concernant votre réservation</li>
              <li>Améliorer nos services</li>
              <li>Respecter nos obligations légales</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Base légale du traitement</h2>
            <p>
              Le traitement de vos données est basé sur :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>L'exécution du contrat de réservation</li>
              <li>Votre consentement explicite</li>
              <li>Nos obligations légales</li>
              <li>Notre intérêt légitime à améliorer nos services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Conservation des données</h2>
            <p>
              Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées, conformément aux exigences légales et réglementaires.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Vos droits</h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification</li>
              <li>Droit à l'effacement</li>
              <li>Droit à la limitation du traitement</li>
              <li>Droit à la portabilité des données</li>
              <li>Droit d'opposition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Sécurité des données</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données personnelles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Contact</h2>
            <p>
              Pour exercer vos droits ou pour toute question concernant le traitement de vos données personnelles, vous pouvez nous contacter à l'adresse suivante : [adresse email du DPO].
            </p>
          </section>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Privacy;