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
                Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des relations entre [Nom de l'entreprise], ci-après dénommée "le Prestataire", et toute personne physique ou morale effectuant une réservation, ci-après dénommée "le Client".
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">2. Prix et Modalités de Paiement</h3>
              <p>
                Les prix sont indiqués en euros TTC. Le paiement s'effectue en ligne au moment de la réservation. La réservation n'est définitive qu'après confirmation du paiement.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">3. Droit de Rétractation</h3>
              <p>
                Conformément à l'article L221-28 12° du Code de la consommation, le droit de rétractation ne peut être exercé pour les prestations de services d'activités de loisirs qui doivent être fournis à une date déterminée.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">4. Responsabilité</h3>
              <p>
                Le Prestataire ne pourra être tenu responsable des dommages directs ou indirects causés au matériel du Client lors de l'utilisation du service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">5. Protection des Données Personnelles</h3>
              <p>
                Les données personnelles collectées sont traitées conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">6. Droit Applicable</h3>
              <p>
                Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.
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