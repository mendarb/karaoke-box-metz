import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CookieConsentDialog } from "./CookieConsentDialog";

export const CookieConsent = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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
    <CookieConsentDialog
      open={open}
      onOpenChange={setOpen}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  );
};