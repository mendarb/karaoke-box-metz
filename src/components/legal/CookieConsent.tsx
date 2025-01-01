import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

export const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setOpen(false);
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences de cookies ont été enregistrées.",
    });
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setOpen(false);
    toast({
      title: "Préférences sauvegardées",
      description: "Vous pouvez modifier vos préférences à tout moment dans les paramètres.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={`
        sm:max-w-[600px]
        ${isMobile ? 'p-0 rounded-t-xl rounded-b-none h-[85vh] mt-auto translate-y-0' : ''}
      `}>
        <DialogHeader className={isMobile ? 'p-4 border-b' : ''}>
          <DialogTitle className="text-xl">Paramètres de confidentialité</DialogTitle>
          <DialogDescription className="text-base">
            Nous utilisons des cookies pour améliorer votre expérience
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className={`
          ${isMobile ? 'p-4 flex-1' : 'max-h-[60vh] pr-4'}
        `}>
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="font-semibold text-lg">Cookies essentiels</h3>
              <p className="text-sm text-gray-600">
                Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés.
                Ils permettent notamment de :
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Mémoriser vos préférences de confidentialité</li>
                <li>Maintenir votre session sécurisée</li>
                <li>Sauvegarder le contenu de votre panier</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg">Cookies analytiques</h3>
              <p className="text-sm text-gray-600">
                Ces cookies nous permettent d'analyser l'utilisation du site pour l'améliorer.
                Les données collectées sont anonymisées.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="font-semibold text-lg">Protection de vos données</h3>
              <p className="text-sm text-gray-600">
                Conformément au RGPD, vous pouvez exercer vos droits (accès, rectification, effacement...)
                en nous contactant. Pour plus d'informations, consultez notre politique de confidentialité.
              </p>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className={`
          ${isMobile ? 'p-4 border-t mt-auto' : 'flex gap-2 sm:gap-0'}
        `}>
          <div className={`
            ${isMobile ? 'grid grid-cols-2 gap-3 w-full' : 'flex gap-2 sm:gap-0'}
          `}>
            <Button
              variant="outline"
              onClick={handleReject}
              className={`
                ${isMobile ? 'w-full text-base py-6' : 'flex-1 sm:flex-none'}
              `}
            >
              Refuser
            </Button>
            <Button
              onClick={handleAccept}
              className={`
                ${isMobile ? 'w-full text-base py-6' : 'flex-1 sm:flex-none'}
              `}
            >
              Tout accepter
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};