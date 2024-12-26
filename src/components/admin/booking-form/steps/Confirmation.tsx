import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { PaymentLinkDisplay } from "../PaymentLinkDisplay";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Users, Euro, Mail, Phone, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  const startHour = parseInt(formData.timeSlot);
  const endHour = startHour + parseInt(formData.duration);

  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="hover:bg-violet-50"
        >
          ← Retour
        </Button>
        <h3 className="text-lg font-semibold text-violet-900">Confirmation de la réservation</h3>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-violet-900">Détails de la réservation</h4>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-violet-500" />
                <span className="font-medium">{date}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-violet-500" />
                <span>
                  {formatHour(startHour)} - {formatHour(endHour)} ({formData.duration}h)
                </span>
              </div>
              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-violet-500" />
                <span>{formData.groupSize} personnes</span>
              </div>
              <div className="flex items-center text-sm">
                <Euro className="mr-2 h-4 w-4 text-violet-500" />
                <span className="font-medium">{formData.calculatedPrice}€</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-violet-900">Informations de contact</h4>
            <div className="space-y-3">
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
          </div>
        </div>

        {formData.message && (
          <div className="pt-4 border-t">
            <h4 className="font-medium text-sm text-violet-900 mb-2">Message</h4>
            <div className="flex items-start text-sm bg-gray-50 p-3 rounded-md">
              <MessageSquare className="mr-2 h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-600">{formData.message}</span>
            </div>
          </div>
        )}
      </Card>

      <div className="space-y-4">
        <Button 
          onClick={onSubmit} 
          disabled={isLoading} 
          className="w-full bg-violet-600 hover:bg-violet-700"
        >
          {isLoading ? "Création en cours..." : "Créer la réservation"}
        </Button>

        {paymentLink && <PaymentLinkDisplay paymentLink={paymentLink} />}
      </div>
    </div>
  );
};