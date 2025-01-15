import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UserDetails } from "../user-selection/UserDetails";
import { PaymentLinkDisplay } from "../PaymentLinkDisplay";
import { BookingSummary } from "@/components/booking/additional/BookingSummary";

interface ConfirmationProps {
  form: UseFormReturn<any>;
  isLoading: boolean;
  paymentLink: string | null;
  onBack: () => void;
  onSubmit: () => void;
  paymentMethod: 'stripe' | 'sumup' | 'cash';
}

export const Confirmation = ({ 
  form, 
  isLoading, 
  paymentLink, 
  onBack, 
  onSubmit,
  paymentMethod 
}: ConfirmationProps) => {
  const formValues = form.getValues();
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Confirmation de la réservation</h2>
        
        <BookingSummary
          groupSize={formValues.groupSize}
          duration={formValues.duration}
          calculatedPrice={formValues.calculatedPrice}
          isPromoValid={!!formValues.promoCode}
          promoCode={formValues.promoCode}
          finalPrice={formValues.finalPrice}
          date={formValues.date}
          timeSlot={formValues.timeSlot}
          message={formValues.message}
        />
        
        <UserDetails form={form} />
        
        {paymentMethod === 'stripe' && paymentLink && (
          <PaymentLinkDisplay paymentLink={paymentLink} />
        )}
        
        {paymentMethod === 'sumup' && (
          <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
            La réservation sera marquée comme en attente de paiement par carte (SumUp)
          </div>
        )}
        
        {paymentMethod === 'cash' && (
          <div className="rounded-lg bg-green-50 p-4 text-green-700">
            La réservation sera marquée comme en attente de paiement en espèces
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
        >
          Retour
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Confirmer la réservation"}
        </Button>
      </div>
    </div>
  );
};