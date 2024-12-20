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

export const CancellationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0">
          Politique d'annulation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Politique d'Annulation</DialogTitle>
          <DialogDescription>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Délais d'Annulation</h3>
              <p>
                - Plus de 48h avant la séance : remboursement intégral<br />
                - Entre 24h et 48h : remboursement à 50%<br />
                - Moins de 24h : aucun remboursement
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Procédure d'Annulation</h3>
              <p>
                Pour annuler votre réservation, connectez-vous à votre compte et utilisez la fonction d'annulation dans "Mes Réservations".
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Cas Particuliers</h3>
              <p>
                En cas de force majeure (maladie avec certificat médical, etc.), contactez-nous pour étudier votre situation.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Remboursements</h3>
              <p>
                Les remboursements sont effectués sur la carte bancaire utilisée lors de la réservation sous 5-10 jours ouvrés.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};