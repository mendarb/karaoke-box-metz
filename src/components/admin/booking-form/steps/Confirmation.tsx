import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PaymentLinkDisplay } from "../PaymentLinkDisplay";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ConfirmationProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  paymentLink: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

export const Confirmation = ({
  form,
  isLoading,
  paymentLink,
  onBack,
  onSubmit,
}: ConfirmationProps) => {
  const formData = form.getValues();
  const date = formData.date ? format(new Date(formData.date), "EEEE d MMMM yyyy", { locale: fr }) : "";

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Modifier la réservation
      </Button>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium">Récapitulatif de la réservation</h3>
        
        <div className="space-y-2">
          <p><strong>Client :</strong> {formData.fullName}</p>
          <p><strong>Email :</strong> {formData.email}</p>
          <p><strong>Téléphone :</strong> {formData.phone}</p>
          <p><strong>Date :</strong> {date}</p>
          <p><strong>Heure :</strong> {formData.timeSlot}h</p>
          <p><strong>Durée :</strong> {formData.duration}h</p>
          <p><strong>Nombre de personnes :</strong> {formData.groupSize}</p>
          <p><strong>Prix :</strong> {formData.calculatedPrice}€</p>
          {formData.message && (
            <p><strong>Message :</strong> {formData.message}</p>
          )}
        </div>
      </div>

      <Button 
        onClick={onSubmit} 
        disabled={isLoading} 
        className="w-full"
      >
        {isLoading ? "Création..." : "Créer la réservation"}
      </Button>

      {paymentLink && <PaymentLinkDisplay paymentLink={paymentLink} />}
    </div>
  );
};