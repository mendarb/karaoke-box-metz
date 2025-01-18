import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { UserDetails } from "../user-selection/UserDetails";
import { PaymentLinkDisplay } from "../PaymentLinkDisplay";
import { BookingSummary } from "@/components/booking/additional/BookingSummary";
import { BookingFormLegal } from "@/components/booking/BookingFormLegal";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    <div className="w-full max-w-[800px] mx-auto space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900">Confirmation de la réservation</h2>
        
        <Card className="p-6">
          <div className="space-y-6">
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
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Informations client</h3>
              <UserDetails form={form} />
            </div>
            
            {paymentMethod === 'stripe' && paymentLink && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Paiement</h3>
                  <PaymentLinkDisplay paymentLink={paymentLink} />
                </div>
              </>
            )}
            
            {paymentMethod === 'sumup' && (
              <>
                <Separator className="my-6" />
                <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
                  La réservation sera marquée comme en attente de paiement par carte (SumUp)
                </div>
              </>
            )}
            
            {paymentMethod === 'cash' && (
              <>
                <Separator className="my-6" />
                <div className="rounded-lg bg-green-50 p-4 text-green-700">
                  La réservation sera marquée comme en attente de paiement en espèces
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <BookingFormLegal form={form} />
        </Card>
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
          disabled={isLoading || !form.getValues().acceptTerms}
          className="bg-violet-600 hover:bg-violet-700"
        >
          {isLoading ? "Chargement..." : "Confirmer la réservation"}
        </Button>
      </div>
    </div>
  );
};