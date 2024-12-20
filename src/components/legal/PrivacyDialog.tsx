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
                Nous collectons uniquement les données nécessaires à la gestion de vos réservations : nom, prénom, email, numéro de téléphone.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Utilisation des Données</h3>
              <p>
                Vos données sont utilisées exclusivement pour la gestion de vos réservations et pour vous contacter en cas de nécessité.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Protection des Données</h3>
              <p>
                Nous mettons en œuvre toutes les mesures nécessaires pour protéger vos données personnelles conformément au RGPD.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Vos Droits</h3>
              <p>
                Vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};