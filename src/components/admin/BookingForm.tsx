import { useState } from "react";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/services/checkoutService";
import { PriceCalculator } from "@/components/PriceCalculator";
import { UserSelection } from "./booking-form/UserSelection";
import { BookingFormFields } from "./booking-form/BookingFormFields";
import { useBookingOverlap } from "@/hooks/useBookingOverlap";

export const AdminBookingForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const { checkOverlap } = useBookingOverlap();

  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: "",
      timeSlot: "",
      duration: "1",
      groupSize: "1",
      message: "",
    },
  });

  const durations = ["1", "2", "3", "4"];
  const groupSizes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"];

  const handlePriceCalculated = (price: number) => {
    setCalculatedPrice(price);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);

      // Vérifier les chevauchements
      const hasOverlap = await checkOverlap(data.date, data.timeSlot, data.duration);
      if (hasOverlap) {
        setIsLoading(false);
        return;
      }

      // Créer la réservation
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([{
          user_email: data.email,
          user_name: data.fullName,
          user_phone: data.phone,
          date: data.date,
          time_slot: data.timeSlot,
          duration: data.duration,
          group_size: data.groupSize,
          price: calculatedPrice,
          message: data.message,
          status: 'pending',
          payment_status: 'unpaid',
          is_test_booking: false,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating booking:', error);
        throw error;
      }

      // Générer le lien de paiement
      const checkoutUrl = await createCheckoutSession({
        bookingId: booking.id,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        price: calculatedPrice,
        finalPrice: calculatedPrice,
        message: data.message,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: false,
      });

      setPaymentLink(checkoutUrl);

      // Envoyer un email pour créer un compte si l'utilisateur n'existe pas
      const { data: { users } } = await supabase.auth.admin.listUsers({
        filters: { email: data.email }
      });

      if (!users || users.length === 0) {
        const { error: signupError } = await supabase.auth.signInWithOtp({
          email: data.email,
          options: {
            data: {
              full_name: data.fullName,
              phone: data.phone,
            }
          }
        });

        if (signupError) {
          console.error('Error sending signup email:', signupError);
          toast({
            title: "Attention",
            description: "Impossible d'envoyer l'email de création de compte",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Email envoyé",
            description: "Un email a été envoyé pour créer un compte",
          });
        }
      }

      toast({
        title: "Réservation créée",
        description: "Le lien de paiement a été généré avec succès.",
      });
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <UserSelection form={form} />

        <BookingFormFields 
          form={form}
          durations={durations}
          groupSizes={groupSizes}
          isLoading={isLoading}
        />

        <div className="mt-6">
          <PriceCalculator
            groupSize={form.watch("groupSize")}
            duration={form.watch("duration")}
            onPriceCalculated={handlePriceCalculated}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Création..." : "Créer la réservation"}
        </Button>

        {paymentLink && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <p className="font-medium text-green-800">Lien de paiement généré :</p>
            <div className="flex items-center gap-2 mt-2">
              <Input value={paymentLink} readOnly />
              <Button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(paymentLink);
                  toast({
                    title: "Copié !",
                    description: "Le lien a été copié dans le presse-papier.",
                  });
                }}
              >
                Copier
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};