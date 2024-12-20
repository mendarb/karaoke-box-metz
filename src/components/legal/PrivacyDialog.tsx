import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const PrivacyDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0">
          Politique de confidentialité
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Politique de Confidentialité</DialogTitle>
          <DialogDescription>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Collecte des Données</h3>
              <p>
                Conformément au RGPD, nous collectons et traitons les données suivantes :
                - Nom et prénom
                - Adresse email
                - Numéro de téléphone
                - Informations de réservation
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Finalités du Traitement</h3>
              <p>
                Vos données sont collectées pour :
                - La gestion de vos réservations
                - L'envoi de confirmations et rappels
                - La facturation
                - Le service client
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Base Légale</h3>
              <p>
                Le traitement de vos données est basé sur :
                - L'exécution du contrat de réservation
                - Votre consentement explicite
                - Nos obligations légales
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Durée de Conservation</h3>
              <p>
                Vos données sont conservées pendant la durée nécessaire à la finalité du traitement, conformément aux obligations légales.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Vos Droits</h3>
              <p>
                Vous disposez des droits suivants :
                - Droit d'accès
                - Droit de rectification
                - Droit à l'effacement
                - Droit à la portabilité
                - Droit d'opposition
                - Droit à la limitation du traitement
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Contact DPO</h3>
              <p>
                Pour exercer vos droits ou pour toute question, contactez notre Délégué à la Protection des Données à [email DPO].
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">7. CNIL</h3>
              <p>
                Vous pouvez introduire une réclamation auprès de la CNIL : www.cnil.fr
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};