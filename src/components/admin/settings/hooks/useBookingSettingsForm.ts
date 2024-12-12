import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { BookingSettings } from "./bookingSettingsTypes";
import { fetchBookingSettings, saveBookingSettings } from "./bookingSettingsDb";

export const useBookingSettingsForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<BookingSettings>();

  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['booking-settings'],
    queryFn: fetchBookingSettings,
    retry: 1,
    staleTime: 0,
    meta: {
      onSuccess: (data: BookingSettings) => {
        console.log('Settings loaded, resetting form:', data);
        form.reset(data);
      }
    }
  });

  const mutation = useMutation({
    mutationFn: saveBookingSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['booking-settings'], data);
      form.reset(data);
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres ont été sauvegardés avec succès.",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde des paramètres.",
        variant: "destructive",
      });
    },
  });

  return {
    form,
    settings,
    isLoadingSettings,
    mutation,
  };
};