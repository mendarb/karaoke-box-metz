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
import { useState } from "react";

interface TermsDialogProps {
  onAccept: () => void;
}

export const TermsDialog = ({ onAccept }: TermsDialogProps) => {
  const [open, setOpen] = useState(false);

  const handleAccept = () => {
    setOpen(false);
    onAccept();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0">
          Conditions générales de vente
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Conditions Générales de Vente</DialogTitle>
          <DialogDescription>
            Dernière mise à jour : {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-semibold mb-2">1. Objet</h3>
              <p>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations entre [Nom de l'entreprise] et les clients utilisant notre service de réservation en ligne.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Réservation</h3>
              <p>
                La réservation n'est définitive qu'après confirmation de notre part et réception du paiement intégral.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Prix et Paiement</h3>
              <p>
                Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne au moment de la réservation.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Annulation et Remboursement</h3>
              <p>
                Toute annulation doit être effectuée au moins 48 heures avant la date réservée pour un remboursement intégral.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Responsabilité</h3>
              <p>
                Nous nous réservons le droit de modifier ou d'annuler une réservation en cas de force majeure.
              </p>
            </section>
          </div>
        </ScrollArea>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button onClick={handleAccept}>
            Accepter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};