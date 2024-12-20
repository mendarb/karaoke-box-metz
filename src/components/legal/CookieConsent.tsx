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

export const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Utilisation des cookies</DialogTitle>
          <DialogDescription>
            Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre site. Conformément au RGPD, nous avons besoin de votre consentement.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Les cookies nous permettent de :
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-600 space-y-1">
            <li>Mémoriser vos préférences</li>
            <li>Analyser l'utilisation du site pour l'améliorer</li>
            <li>Sécuriser votre connexion</li>
            <li>Personnaliser votre expérience</li>
          </ul>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReject}>
            Refuser
          </Button>
          <Button onClick={handleAccept}>
            Accepter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};