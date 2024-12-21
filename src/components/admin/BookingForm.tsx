import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { createCheckoutSession } from "@/services/checkoutService";

export const AdminBookingForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      phone: "",
      date: "",
      timeSlot: "",
      duration: "",
      groupSize: "",
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      
      // Calculer le prix (20€ par personne et par heure)
      const price = parseInt(data.groupSize) * parseInt(data.duration) * 20;

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
          price: price,
          message: data.message,
          status: 'pending',
          payment_status: 'unpaid',
          is_test_booking: false,
        }])
        .select()
        .single();

      if (error) throw error;

      // Générer le lien de paiement
      const checkoutUrl = await createCheckoutSession({
        bookingId: booking.id,
        userEmail: data.email,
        date: data.date,
        timeSlot: data.timeSlot,
        duration: data.duration,
        groupSize: data.groupSize,
        price: price,
        finalPrice: price,
        message: data.message,
        userId: booking.user_id,
        userName: data.fullName,
        userPhone: data.phone,
        isTestMode: false,
      });

      setPaymentLink(checkoutUrl);
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Email</label>
            <Input {...form.register("email")} type="email" required />
          </div>
          <div className="space-y-2">
            <label>Nom complet</label>
            <Input {...form.register("fullName")} required />
          </div>
          <div className="space-y-2">
            <label>Téléphone</label>
            <Input {...form.register("phone")} required />
          </div>
          <div className="space-y-2">
            <label>Date</label>
            <Input {...form.register("date")} type="date" required />
          </div>
          <div className="space-y-2">
            <label>Heure de début</label>
            <Input {...form.register("timeSlot")} type="number" min="14" max="23" required />
          </div>
          <div className="space-y-2">
            <label>Durée (heures)</label>
            <Input {...form.register("duration")} type="number" min="1" max="4" required />
          </div>
          <div className="space-y-2">
            <label>Nombre de personnes</label>
            <Input {...form.register("groupSize")} type="number" min="1" max="15" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <label>Message</label>
          <Textarea {...form.register("message")} />
        </div>

        <Button type="submit" disabled={isLoading}>
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