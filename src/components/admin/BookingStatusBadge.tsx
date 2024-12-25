import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BookingStatusBadgeProps {
  status: string;
  paymentStatus?: string;
  isTestBooking?: boolean;
  className?: string;
}

export const BookingStatusBadge = ({ 
  status, 
  paymentStatus, 
  isTestBooking,
  className 
}: BookingStatusBadgeProps) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";
  let label = status;

  switch (status) {
    case 'confirmed':
      variant = paymentStatus === 'paid' ? "default" : "secondary";
      label = paymentStatus === 'paid' ? "Confirmée et payée" : "Confirmée";
      break;
    case 'cancelled':
      variant = "destructive";
      label = paymentStatus === 'failed' ? "Paiement échoué" : 
              paymentStatus === 'expired' ? "Expirée" : "Annulée";
      break;
    case 'pending':
      variant = paymentStatus === 'paid' ? "default" : "secondary";
      label = paymentStatus === 'paid' ? "Payée" : 
              paymentStatus === 'awaiting_payment' ? "En attente de paiement" : "En attente";
      break;
    default:
      variant = "outline";
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={variant}
        className={cn("capitalize", className)}
      >
        {label}
      </Badge>
      {isTestBooking && (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Test
        </Badge>
      )}
    </div>
  );
};