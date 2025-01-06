import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { TermsDialog } from "../legal/TermsDialog";
import { PrivacyDialog } from "../legal/PrivacyDialog";
import { CancellationDialog } from "../legal/CancellationDialog";
import { Button } from "@/components/ui/button";
import { BookmarkPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface BookingFormLegalProps {
  form: UseFormReturn<any>;
  onSaveForLater?: () => void;
  groupSize: string;
  duration: string;
  date: string;
  timeSlot: string;
  message?: string;
}

export const BookingFormLegal = ({ 
  form, 
  groupSize,
  duration,
  date,
  timeSlot,
  message
}: BookingFormLegalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveForLater = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour sauvegarder votre réservation",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('saved_bookings')
        .insert({
          user_id: session.user.id,
          date,
          time_slot: timeSlot,
          duration,
          group_size: groupSize,
          message
        });

      if (error) throw error;

      toast({
        title: "Réservation sauvegardée",
        description: "Vous pourrez la retrouver dans votre espace personnel",
      });

      navigate('/account');
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la réservation",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="acceptTerms"
          rules={{ required: "Vous devez accepter les conditions générales" }}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-violet-600"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <p className="text-sm text-gray-500">
                  J'accepte les <TermsDialog onAccept={() => field.onChange(true)} />, la{" "}
                  <PrivacyDialog /> et la{" "}
                  <CancellationDialog />.
                </p>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />

        <p className="text-xs text-gray-400">
          Vos données sont utilisées uniquement dans le cadre de votre réservation.
        </p>
      </div>

      <div className="flex justify-center pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleSaveForLater}
          className="bg-violet-50 hover:bg-violet-100 text-violet-700 hover:text-violet-800 transition-all duration-200 shadow-sm"
        >
          <BookmarkPlus className="mr-2 h-5 w-5" />
          Enregistrer ma réservation pour plus tard
        </Button>
      </div>
    </div>
  );
};