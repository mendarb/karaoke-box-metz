import { useToast } from "@/components/ui/use-toast";

export const useBookingNotifications = () => {
  const { toast } = useToast();

  const notifySuccess = () => {
    toast({
      title: "Succès",
      description: "La réservation a été mise à jour avec succès",
    });
  };

  const notifyError = (error: Error) => {
    toast({
      title: "Erreur",
      description: error.message || "Une erreur est survenue lors de la mise à jour",
      variant: "destructive",
    });
  };

  return { notifySuccess, notifyError };
};