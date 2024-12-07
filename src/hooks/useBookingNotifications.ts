import { useToast } from "@/components/ui/use-toast";

export const useBookingNotifications = () => {
  const { toast } = useToast();

  const notifySuccess = () => {
    toast({
      title: "Succès",
      description: "Statut de la réservation mis à jour",
    });
  };

  const notifyError = (error: Error) => {
    toast({
      title: "Erreur",
      description: error.message || "Une erreur est survenue",
      variant: "destructive",
    });
  };

  return { notifySuccess, notifyError };
};