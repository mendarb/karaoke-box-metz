import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PaymentLinkDisplay } from "../PaymentLinkDisplay";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users, Euro, Mail, Phone, MessageSquare } from "lucide-react";

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
  
  // Ensure we're working with a proper Date object
  const bookingDate = new Date(formData.date);
  // Add timezone offset to compensate for UTC conversion
  bookingDate.setMinutes(bookingDate.getMinutes() + bookingDate.getTimezoneOffset());
  
  const date = formData.date ? format(bookingDate, "EEEE d MMMM yyyy", { locale: fr }) : "";
  const startHour = parseInt(formData.timeSlot);
  const endHour = startHour + parseInt(formData.duration);

  const formatHour = (hour: number) => {
    const paddedHour = hour.toString().padStart(2, '0');
    return `${paddedHour}h00`;
  };

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-4"
      >
        ← Modifier la réservation
      </Button>

      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-medium text-lg">Récapitulatif de la réservation</h3>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Calendar className="mr-2 h-4 w-4 text-violet-500" />
              <span className="font-medium capitalize">{date}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="mr-2 h-4 w-4 text-violet-500" />
              <span>
                {formatHour(startHour)} - {formatHour(endHour)} ({formData.duration}h)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <Users className="mr-2 h-4 w-4 text-violet-500" />
              <span>{formData.groupSize} personnes</span>
            </div>
            <div className="flex items-center text-sm">
              <Euro className="mr-2 h-4 w-4 text-violet-500" />
              <span>{formData.calculatedPrice}€</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Informations de contact</h4>
            <div className="flex items-center text-sm">
              <span className="font-medium">{formData.fullName}</span>
            </div>
            <div className="flex items-center text-sm">
              <Mail className="mr-2 h-4 w-4 text-violet-500" />
              <span>{formData.email}</span>
            </div>
            <div className="flex items-center text-sm">
              <Phone className="mr-2 h-4 w-4 text-violet-500" />
              <span>{formData.phone}</span>
            </div>
          </div>

          {formData.message && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Message</h4>
              <div className="flex items-start text-sm">
                <MessageSquare className="mr-2 h-4 w-4 text-violet-500 mt-0.5" />
                <span className="text-gray-600">{formData.message}</span>
              </div>
            </div>
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
